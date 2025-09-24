import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const OrderManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>إدارة الطلبات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>محتوى صفحة إدارة الطلبات الجديدة سيوضع هنا.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
