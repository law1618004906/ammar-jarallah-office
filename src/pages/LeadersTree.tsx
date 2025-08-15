
import React, { useState, useEffect } from 'react';
import { Crown, User, ChevronRight, ChevronDown, Phone, MapPin, Briefcase, Vote, Users, BarChart3, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface TreeNode {
  id: string;
  name: string;
  type: 'leader' | 'person';
  totalVotes: number;
  details: {
    phone?: string;
    address?: string;
    work?: string;
    votingCenter?: string;
    stationNumber?: string;
  };
  children: TreeNode[];
}

interface StatsData {
  totalLeaders: number;
  totalPersons: number;
  totalVotes: number;
  avgVotesPerLeader: number;
}

export default function LeadersTree() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalLeaders: 0,
    totalPersons: 0,
    totalVotes: 0,
    avgVotesPerLeader: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTreeData();
  }, []);

  const fetchTreeData = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: "getLeadersTree",
        param: []
      });

      if (error) {
        toast({
          title: "خطأ في تحميل البيانات",
          description: error,
          variant: "destructive"
        });
        return;
      }

      setTree(data?.tree || []);
      setStats(data?.stats || {
        totalLeaders: 0,
        totalPersons: 0,
        totalVotes: 0,
        avgVotesPerLeader: 0
      });

      // توسيع جميع القادة بشكل افتراضي
      const leaderIds = data?.tree?.filter((node: TreeNode) => node.type === 'leader').map((node: TreeNode) => node.id) || [];
      setExpandedNodes(new Set(leaderIds));

      toast({
        title: "تم تحميل البيانات",
        description: `تم جلب ${data?.tree?.length || 0} قائد بنجاح`
      });
    } catch (error) {
      console.error('خطأ في تحميل الشجرة:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (expandedNodes.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const TreeNodeView = ({ node, level = 0 }: {node: TreeNode;level?: number;}) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div className="tree-node">
        <div
          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
          isSelected ?
          'bg-purple-100 border-2 border-purple-400 tree-node selected shadow-lg' :
          'hover:bg-purple-50 border border-gray-200 hover:border-purple-200 interactive-hover'}`
          }
          style={{ marginRight: `${level * 24}px` }}
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) {
              toggleNode(node.id);
            }
          }}>

          {hasChildren &&
          <div className="text-purple-600 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <ChevronRight size={18} />
            </div>
          }
          
          <div className={node.type === 'leader' ? 'crown-icon' : 'user-icon'}>
            {node.type === 'leader' ? <Crown size={22} /> : <User size={20} />}
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-lg">{node.name}</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-medium">
              <Vote size={14} className="mr-1" />
              {node.totalVotes} صوت
            </Badge>
          </div>
        </div>

        {isExpanded && hasChildren &&
        <div className="mt-2 relative">
            <div className="tree-connector"></div>
            {node.children.map((child) =>
          <div key={child.id} className="mb-2">
                <TreeNodeView node={child} level={level + 1} />
              </div>
          )}
          </div>
        }
      </div>);

  };

  const NodeDetailsView = () => {
    if (!selectedNode) {
      return (
        <Card className="sticky top-6">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <CardTitle className="text-xl">اختر عنصراً من الشجرة</CardTitle>
            <CardDescription>انقر على أي قائد أو فرد لعرض تفاصيله الكاملة</CardDescription>
          </CardHeader>
        </Card>);

    }

    return (
      <Card className="sticky top-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${selectedNode.type === 'leader' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
              {selectedNode.type === 'leader' ?
              <Crown className="text-yellow-600" size={24} /> :

              <User className="text-blue-600" size={24} />
              }
            </div>
            <div>
              <CardTitle className="text-xl">
                {selectedNode.type === 'leader' ? 'تفاصيل القائد' : 'تفاصيل الفرد'}
              </CardTitle>
              <CardDescription>{selectedNode.name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedNode.details.phone &&
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-green-600" size={20} />
              <div>
                <div className="font-medium text-gray-700">الهاتف</div>
                <div className="text-gray-900">{selectedNode.details.phone}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.address &&
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="text-red-600" size={20} />
              <div>
                <div className="font-medium text-gray-700">السكن</div>
                <div className="text-gray-900">{selectedNode.details.address}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.work &&
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase className="text-blue-600" size={20} />
              <div>
                <div className="font-medium text-gray-700">العمل</div>
                <div className="text-gray-900">{selectedNode.details.work}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.votingCenter &&
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Home className="text-purple-600" size={20} />
              <div>
                <div className="font-medium text-gray-700">المركز الانتخابي</div>
                <div className="text-gray-900">{selectedNode.details.votingCenter}</div>
              </div>
            </div>
          }

          <Separator />
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="text-purple-600" size={20} />
              <span className="font-semibold text-purple-700">إجمالي الأصوات</span>
            </div>
            <div className="text-3xl font-bold text-purple-800">{selectedNode.totalVotes}</div>
          </div>

          {selectedNode.type === 'leader' && selectedNode.children.length > 0 &&
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" size={20} />
                <span className="font-semibold text-blue-700">عدد الأفراد</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{selectedNode.children.length}</div>
            </div>
          }
        </CardContent>
      </Card>);

  };

  const StatsView = () =>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Crown size={24} />
            <div>
              <div className="text-sm opacity-90">إجمالي القادة</div>
              <div className="text-2xl font-bold">{stats.totalLeaders}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users size={24} />
            <div>
              <div className="text-sm opacity-90">إجمالي الأفراد</div>
              <div className="text-2xl font-bold">{stats.totalPersons}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Vote size={24} />
            <div>
              <div className="text-sm opacity-90">إجمالي الأصوات</div>
              <div className="text-2xl font-bold">{stats.totalVotes}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} />
            <div>
              <div className="text-sm opacity-90">متوسط أصوات/قائد</div>
              <div className="text-2xl font-bold">{stats.avgVotesPerLeader}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">جارٍ تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-4" dir="rtl">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            العرض الشجري للقادة والأفراد
          </h1>
          <p className="text-lg text-gray-600">مكتب النائب عمار جار الله</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </div>

        {/* الإحصائيات */}
        <StatsView />

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* عمود الشجرة */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Crown className="text-purple-600" size={24} />
                  </div>
                  الهيكل التنظيمي
                </CardTitle>
                <CardDescription>
                  انقر على القادة لتوسيع قائمة الأفراد التابعين لهم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar">
                  {tree.length === 0 ?
                  <div className="text-center py-12">
                      <Users className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 text-lg">لا توجد بيانات متاحة</p>
                      <Button
                      variant="outline"
                      onClick={fetchTreeData}
                      className="mt-4">

                        إعادة تحميل
                      </Button>
                    </div> :

                  tree.map((node) =>
                  <TreeNodeView key={node.id} node={node} />
                  )
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* عمود التفاصيل */}
          <div>
            <NodeDetailsView />
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={fetchTreeData}
            className="bg-purple-600 hover:bg-purple-700">

            إعادة تحميل البيانات
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const allNodeIds = tree.reduce((acc: string[], node) => {
                acc.push(node.id);
                node.children.forEach((child) => acc.push(child.id));
                return acc;
              }, []);
              setExpandedNodes(new Set(allNodeIds));
            }}>

            توسيع الكل
          </Button>
          <Button
            variant="outline"
            onClick={() => setExpandedNodes(new Set())}>

            طي الكل
          </Button>
        </div>
      </div>
    </div>);

}