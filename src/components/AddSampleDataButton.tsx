
import React, { useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AddSampleDataButtonProps {
  onDataAdded?: () => void;
}

export default function AddSampleDataButton({ onDataAdded }: AddSampleDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: "addSampleData",
        param: []
      });

      if (error) {
        toast({
          title: "خطأ في إضافة البيانات",
          description: error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${data.leadersAdded} قائد و ${data.personsAdded} فرد كبيانات تجريبية`
      });

      if (onDataAdded) {
        onDataAdded();
      }
    } catch (error) {
      console.error('خطأ في إضافة البيانات التجريبية:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة البيانات التجريبية",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAddSampleData}
      disabled={loading}
      className="h-12 px-6 text-lg font-semibold formal-shadow border-2 border-green-200 hover:border-green-400 hover:bg-green-50"
    >
      {loading ? (
        <>
          <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full mr-2"></div>
          جارٍ الإضافة...
        </>
      ) : (
        <>
          <Database size={20} className="ml-2" />
          إضافة بيانات تجريبية
        </>
      )}
    </Button>
  );
}
