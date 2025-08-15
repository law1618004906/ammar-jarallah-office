
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center formal-bg p-6" dir="rtl">
          <Card className="formal-card max-w-lg w-full">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <CardTitle className="text-2xl formal-title text-red-700">
                حدث خطأ غير متوقع
              </CardTitle>
              <CardDescription className="text-lg formal-subtitle">
                نأسف، حدث خطأ أثناء تحميل هذه الصفحة
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  {this.state.error?.message || 'خطأ غير محدد'}
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="btn-formal flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  إعادة المحاولة
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2"
                >
                  العودة للخلف
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm formal-subtitle">
                  إذا استمر الخطأ، يرجى التواصل مع الدعم الفني
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
