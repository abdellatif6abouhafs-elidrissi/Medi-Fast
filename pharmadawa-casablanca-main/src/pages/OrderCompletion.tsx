import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const OrderCompletion = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg text-center p-8">
        <CardHeader>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">تم استلام طلبك بنجاح!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            شكراً لك على طلبك. سنتواصل معك قريباً لتأكيد التفاصيل.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">عرض سجل الطلبات</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCompletion;
