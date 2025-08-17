import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Phone, MapPin, Briefcase, Vote, Users, Building, Shield, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import AddLeaderModal from '@/components/AddLeaderModal';
import EditLeaderModal from '@/components/EditLeaderModal';
import AddSampleDataButton from '@/components/AddSampleDataButton';
import EnhancedSearch from '@/components/EnhancedSearch';
import { getLeadersFromStorage, deleteLeaderFromStorage, getPersonsFromStorage, initializeDefaultData, type Leader } from '@/lib/localStorageOperations';
import { dataManager, performanceMonitor } from '@/lib/dataIndexing';

export default function LeadersManagement() {
  const [allLeaders, setAllLeaders] = useState<Leader[]>([]);
  const [displayedLeaders, setDisplayedLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    const timer = performanceMonitor.startTimer('fetchLeaders');
    try {
      setLoading(true);
      
      // Check if EasySite API is available
      if (typeof window !== 'undefined' && window.ezsite?.apis?.run) {
        try {
          const response = await window.ezsite.apis.run({
            name: 'get_leaders',
            data: {}
          });
          
          if (response && response.leaders) {
            setAllLeaders(response.leaders);
            setDisplayedLeaders(response.leaders);
            
            // Build indexes for performance
            const persons = getPersonsFromStorage();
            dataManager.rebuildIndexes(response.leaders, persons);
            
            timer.end();
            return;
          }
        } catch (apiError) {
          console.warn('EasySite API failed, falling back to localStorage:', apiError);
        }
      }
      
      // Fallback to localStorage
      const leaders = getLeadersFromStorage();
      setAllLeaders(leaders);
      setDisplayedLeaders(leaders);
      
      // Build indexes for performance
      const persons = getPersonsFromStorage();
      dataManager.rebuildIndexes(leaders, persons);
      
      if (leaders.length === 0) {
        toast({
          title: "تنبيه",
          description: "لا توجد بيانات قادة. يتم استخدام البيانات المحلية.",
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات القادة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      timer.end();
    }
  };

  const handleDelete = async (leaderId: number) => {
    const timer = performanceMonitor.startTimer('deleteLeader');
    try {
      // Try API first
      if (typeof window !== 'undefined' && window.ezsite?.apis?.run) {
        try {
          await window.ezsite.apis.run({
            name: 'delete_leader',
            data: { leader_id: leaderId }
          });
          
          // Update local state
          const updatedLeaders = allLeaders.filter(leader => leader.id !== leaderId);
          setAllLeaders(updatedLeaders);
          setDisplayedLeaders(updatedLeaders);
          
          toast({
            title: "تم الحذف",
            description: "تم حذف القائد بنجاح",
            variant: "default"
          });
          
          timer.end();
          return;
        } catch (apiError) {
          console.warn('API delete failed, using localStorage:', apiError);
        }
      }
      
      // Fallback to localStorage
      const success = deleteLeaderFromStorage(leaderId);
      if (success) {
        const updatedLeaders = allLeaders.filter(leader => leader.id !== leaderId);
        setAllLeaders(updatedLeaders);
        setDisplayedLeaders(updatedLeaders);
        
        toast({
          title: "تم الحذف محلياً",
          description: "تم حذف القائد من البيانات المحلية",
          variant: "default"
        });
      } else {
        throw new Error('Failed to delete from localStorage');
      }
      
    } catch (error) {
      console.error('Error deleting leader:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف القائد",
        variant: "destructive"
      });
    } finally {
      timer.end();
    }
  };

  const handleEdit = (leader: Leader) => {
    setSelectedLeader(leader);
    setIsEditModalOpen(true);
  };

  const handleLeaderAdded = (newLeader: Leader) => {
    const updatedLeaders = [...allLeaders, newLeader];
    setAllLeaders(updatedLeaders);
    setDisplayedLeaders(updatedLeaders);
    setIsAddModalOpen(false);
  };

  const handleLeaderUpdated = (updatedLeader: Leader) => {
    const updatedLeaders = allLeaders.map(leader => 
      leader.id === updatedLeader.id ? updatedLeader : leader
    );
    setAllLeaders(updatedLeaders);
    setDisplayedLeaders(updatedLeaders);
    setIsEditModalOpen(false);
    setSelectedLeader(null);
  };

  const handleSearchResults = (results: Leader[] | any[]) => {
    setDisplayedLeaders(results as Leader[]);
  };

  const getLeaderStats = () => {
    return dataManager.getLeaderStats(allLeaders);
  };

  const stats = getLeaderStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات القادة...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-600" />
            إدارة القادة
          </h1>
          <p className="text-gray-600 mt-1">إدارة وتنظيم بيانات القادة في النظام</p>
        </div>
        <div className="flex gap-2">
          <AddSampleDataButton onDataAdded={fetchLeaders} />
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة قائد جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القادة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeaders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأصوات</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الأصوات</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageVotes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد المحطات</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stationCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية المتقدم</CardTitle>
          <CardDescription>
            استخدم البحث المتقدم للعثور على القادة بسرعة وكفاءة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedSearch
            data={allLeaders}
            onResults={handleSearchResults}
            type="leaders"
            placeholder="البحث في أسماء القادة، الهواتف، المحطات، أماكن العمل..."
          />
        </CardContent>
      </Card>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedLeaders.map((leader) => (
          <Card key={leader.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-lg">{leader.full_name}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {leader.votes_count} صوت
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{leader.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{leader.residence}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{leader.workplace}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>محطة {leader.station_number}</span>
                </div>
                
                {leader.center_info && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs">{leader.center_info}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(leader)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف القائد "{leader.full_name}"؟ 
                        هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(leader.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {displayedLeaders.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قادة</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على أي قادة مطابقين لمعايير البحث</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة قائد جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddLeaderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLeaderAdded={handleLeaderAdded}
      />

      {selectedLeader && (
        <EditLeaderModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLeader(null);
          }}
          leader={selectedLeader}
          onLeaderUpdated={handleLeaderUpdated}
        />
      )}
    </div>
  );
}
