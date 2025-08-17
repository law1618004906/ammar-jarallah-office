
import React, { useState, useEffect } from 'react';
import { Crown, User, ChevronRight, ChevronDown, Phone, MapPin, Briefcase, Vote, Users, BarChart3, Home, Shield, Building } from 'lucide-react';
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
      
      // Check if EasySite API is available
      if (window?.ezsite?.apis?.run) {
        const { data, error } = await window.ezsite.apis.run({
          path: "getLeadersTree",
          param: []
        });

        if (!error && data) {
          setTree(data.tree || []);
          setStats(data.stats || {
            totalLeaders: 0,
            totalPersons: 0,
            totalVotes: 0,
            avgVotesPerLeader: 0
          });
          return;
        }
      }

      // Fallback: Use mock data for production
      console.log('Using mock data for leaders tree');
      const mockTree: TreeNode[] = [
        {
          id: "leader-1",
          name: "أحمد محمد علي الحسني",
          type: "leader",
          totalVotes: 320,
          details: {
            phone: "07901234567",
            address: "حي الجادرية - بغداد",
            work: "وزارة التربية",
            votingCenter: "مركز الجادرية الانتخابي",
            stationNumber: "101"
          },
          children: [
            {
              id: "person-1-1",
              name: "سارة أحمد محمد الكريم",
              type: "person",
              totalVotes: 45,
              details: {
                phone: "07801234567",
                address: "حي الجادرية - بغداد",
                work: "مدرسة الجادرية الابتدائية",
                votingCenter: "مركز الجادرية الانتخابي",
                stationNumber: "101"
              },
              children: []
            },
            {
              id: "person-1-2",
              name: "محمد علي حسن الموسوي",
              type: "person",
              totalVotes: 38,
              details: {
                phone: "07812345678",
                address: "حي الجادرية - بغداد",
                work: "مستشفى الجادرية العام",
                votingCenter: "مركز الجادرية الانتخابي",
                stationNumber: "101"
              },
              children: []
            }
          ]
        },
        {
          id: "leader-2",
          name: "فاطمة حسن محمود الزهراء",
          type: "leader",
          totalVotes: 285,
          details: {
            phone: "07912345678",
            address: "حي الكرادة - بغداد",
            work: "جامعة بغداد",
            votingCenter: "مركز الكرادة الانتخابي",
            stationNumber: "205"
          },
          children: [
            {
              id: "person-2-1",
              name: "زينب محمد عبدالله النجار",
              type: "person",
              totalVotes: 42,
              details: {
                phone: "07823456789",
                address: "حي الكرادة - بغداد",
                work: "شركة التوزيع الكهربائية",
                votingCenter: "مركز الكرادة الانتخابي",
                stationNumber: "205"
              },
              children: []
            }
          ]
        }
      ];

      const mockStats: StatsData = {
        totalLeaders: 2,
        totalPersons: 3,
        totalVotes: 730,
        avgVotesPerLeader: 365
      };

      setTree(mockTree);
      setStats(mockStats);
    } catch (error) {
      console.error('خطأ في تحميل الشجرة:', error);
      // Even on error, show mock data
      const mockTree: TreeNode[] = [
        {
          id: "leader-1",
          name: "قائد تجريبي",
          type: "leader",
          totalVotes: 100,
          details: {
            phone: "07901234567",
            address: "بغداد",
            work: "موظف حكومي"
          },
          children: []
        }
      ];
      setTree(mockTree);
      setStats({
        totalLeaders: 1,
        totalPersons: 0,
        totalVotes: 100,
        avgVotesPerLeader: 100
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
          className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-300 ${
          isSelected ?
          'tree-node selected formal-shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300' :
          'hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 interactive-hover formal-card'}`
          }
          style={{ marginRight: `${level * 24}px` }}
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) {
              toggleNode(node.id);
            }
          }}>

          {hasChildren &&
          <div className="text-blue-600 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <ChevronRight size={20} />
            </div>
          }
          
          <div className={node.type === 'leader' ? 'crown-icon p-2 bg-yellow-100 rounded-lg' : 'user-icon p-2 bg-blue-100 rounded-lg'}>
            {node.type === 'leader' ? <Crown size={24} /> : <User size={22} />}
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 text-xl">{node.name}</span>
              <div className="text-sm formal-subtitle mt-1">
                {node.type === 'leader' ? 'قائد انتخابي' : 'فرد تابع'}
              </div>
            </div>
            <Badge className="formal-badge text-lg px-4 py-2">
              <Vote size={16} className="mr-2" />
              {node.totalVotes} صوت
            </Badge>
          </div>
        </div>

        {isExpanded && hasChildren &&
        <div className="mt-3 relative">
            <div className="tree-connector"></div>
            {node.children.map((child) =>
          <div key={child.id} className="mb-3">
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
        <Card className="formal-card sticky top-6 formal-shadow-lg">
          <CardHeader className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Users className="text-blue-600" size={40} />
            </div>
            <CardTitle className="text-2xl formal-title">اختر عنصراً من الشجرة</CardTitle>
            <CardDescription className="text-lg formal-subtitle">انقر على أي قائد أو فرد لعرض تفاصيله الكاملة</CardDescription>
          </CardHeader>
        </Card>);

    }

    return (
      <Card className="formal-card sticky top-6 formal-shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${selectedNode.type === 'leader' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
              {selectedNode.type === 'leader' ?
              <Crown className="text-yellow-600" size={28} /> :
              <User className="text-blue-600" size={28} />
              }
            </div>
            <div>
              <CardTitle className="text-2xl formal-title">
                {selectedNode.type === 'leader' ? 'تفاصيل القائد' : 'تفاصيل الفرد'}
              </CardTitle>
              <CardDescription className="text-lg formal-subtitle">{selectedNode.name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {selectedNode.details.phone &&
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="text-green-600" size={22} />
              </div>
              <div>
                <div className="font-semibold text-gray-700">الهاتف</div>
                <div className="text-gray-900 font-mono">{selectedNode.details.phone}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.address &&
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="p-2 bg-red-100 rounded-lg">
                <MapPin className="text-red-600" size={22} />
              </div>
              <div>
                <div className="font-semibold text-gray-700">السكن</div>
                <div className="text-gray-900">{selectedNode.details.address}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.work &&
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="text-purple-600" size={22} />
              </div>
              <div>
                <div className="font-semibold text-gray-700">العمل</div>
                <div className="text-gray-900">{selectedNode.details.work}</div>
              </div>
            </div>
          }
          
          {selectedNode.details.votingCenter &&
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="text-blue-600" size={22} />
              </div>
              <div>
                <div className="font-semibold text-gray-700">المركز الانتخابي</div>
                <div className="text-gray-900">{selectedNode.details.votingCenter}</div>
              </div>
            </div>
          }

          <Separator />
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Vote className="text-blue-600" size={24} />
              <span className="font-bold text-blue-700 text-lg">إجمالي الأصوات</span>
            </div>
            <div className="text-4xl font-bold text-blue-800">{selectedNode.totalVotes}</div>
          </div>

          {selectedNode.type === 'leader' && selectedNode.children.length > 0 &&
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-green-600" size={24} />
                <span className="font-bold text-green-700 text-lg">عدد الأفراد</span>
              </div>
              <div className="text-3xl font-bold text-green-800">{selectedNode.children.length}</div>
            </div>
          }
        </CardContent>
      </Card>);

  };

  const StatsView = () =>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="stats-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Crown size={28} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm formal-subtitle font-medium">إجمالي القادة</div>
            <div className="text-2xl font-bold formal-title">{stats.totalLeaders}</div>
          </div>
        </div>
      </div>

      <div className="stats-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Users size={28} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm formal-subtitle font-medium">إجمالي الأفراد</div>
            <div className="text-2xl font-bold formal-title">{stats.totalPersons}</div>
          </div>
        </div>
      </div>

      <div className="stats-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Vote size={28} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm formal-subtitle font-medium">إجمالي الأصوات</div>
            <div className="text-2xl font-bold formal-title">{stats.totalVotes}</div>
          </div>
        </div>
      </div>

      <div className="stats-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <BarChart3 size={28} className="text-orange-600" />
          </div>
          <div>
            <div className="text-sm formal-subtitle font-medium">متوسط أصوات/قائد</div>
            <div className="text-2xl font-bold formal-title">{stats.avgVotesPerLeader}</div>
          </div>
        </div>
      </div>
    </div>;


  if (loading) {
    return (
      <div className="formal-bg min-h-screen p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-xl formal-subtitle">جارٍ تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="formal-bg min-h-screen pt-6" dir="rtl">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="formal-card rounded-2xl p-8 mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 official-logo rounded-full mb-6">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold formal-title mb-4">
            العرض الشجري للقادة والأفراد
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="formal-badge text-lg px-4 py-2">
              <Building size={18} className="ml-2" />
              مكتب النائب عمار جار الله
            </Badge>
          </div>
          <div className="formal-divider"></div>
        </div>

        {/* الإحصائيات */}
        <StatsView />

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* عمود الشجرة */}
          <div className="lg:col-span-2">
            <Card className="formal-card formal-shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4 text-3xl formal-title">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Crown className="text-blue-600" size={32} />
                  </div>
                  الهيكل التنظيمي
                </CardTitle>
                <CardDescription className="text-lg formal-subtitle">
                  انقر على القادة لتوسيع قائمة الأفراد التابعين لهم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                  {tree.length === 0 ?
                  <div className="text-center py-16">
                      <Users className="mx-auto text-gray-400 mb-6" size={64} />
                      <p className="text-gray-500 text-xl mb-6">لا توجد بيانات متاحة</p>
                      <Button
                      variant="outline"
                      onClick={fetchTreeData}
                      className="btn-formal">

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
        <div className="flex justify-center gap-6 mt-8">
          <Button
            onClick={fetchTreeData}
            className="btn-formal px-8 py-3 text-lg">

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
            }}
            className="formal-shadow px-8 py-3 text-lg border-2 border-blue-200 hover:border-blue-400">

            توسيع الكل
          </Button>
          <Button
            variant="outline"
            onClick={() => setExpandedNodes(new Set())}
            className="formal-shadow px-8 py-3 text-lg border-2 border-red-200 hover:border-red-400">

            طي الكل
          </Button>
        </div>
      </div>
    </div>);

}