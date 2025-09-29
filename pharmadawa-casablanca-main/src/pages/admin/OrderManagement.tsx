import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Package, Eye } from "lucide-react";

interface Order {
  _id: string;
  medicine: {
    name: string;
    quantity: number;
  };
  user: {
    name: string;
    phone: string;
  };
  address: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

const OrderManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulate loading and set mock data
    const loadOrders = () => {
      setTimeout(() => {
        const mockOrders = [
          {
            _id: "order-1",
            medicine: {
              name: "باراسيتامول 500mg",
              quantity: 2,
            },
            user: {
              name: "أحمد محمد",
              phone: "0612345678",
            },
            address: "شارع الحسن الثاني، الدار البيضاء",
            status: "pending" as const,
            createdAt: new Date().toISOString(),
          },
          {
            _id: "order-2",
            medicine: {
              name: "إيبوبروفين 400mg",
              quantity: 1,
            },
            user: {
              name: "فاطمة الزهراء",
              phone: "0623456789",
            },
            address: "حي المعاريف، الرباط",
            status: "accepted" as const,
            createdAt: new Date().toISOString(),
          },
          {
            _id: "order-3",
            medicine: {
              name: "فيتامين د3",
              quantity: 3,
            },
            user: {
              name: "يوسف العلوي",
              phone: "0634567890",
            },
            address: "شارع محمد الخامس، فاس",
            status: "completed" as const,
            createdAt: new Date().toISOString(),
          },
        ];
        
        setOrders(mockOrders);
        setLoading(false);
        
        toast({
          title: "تم التحميل بنجاح",
          description: "تم تحميل قائمة الطلبات (وضع التجريب)",
        });
      }, 500);
    };

    loadOrders();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "مقبول", className: "bg-blue-100 text-blue-800" },
      rejected: { label: "مرفوض", className: "bg-red-100 text-red-800" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <span className={`px-2 py-1 rounded text-sm ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus as any }
          : order
      )
    );

    toast({
      title: "تم التحديث بنجاح!",
      description: "تم تحديث حالة الطلب (وضع التجريب)",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للوحة التحكم
        </Button>
        <div>
          <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع طلبات الأدوية
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {order.medicine.name}
                </div>
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div>
                  <p><strong>العميل:</strong> {order.user.name}</p>
                  <p><strong>الهاتف:</strong> {order.user.phone}</p>
                  <p><strong>العنوان:</strong> {order.address}</p>
                  <p><strong>الكمية:</strong> {order.medicine.quantity}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/orders/${order._id}`}>
                      <Eye className="h-3 w-3 ml-1" />
                      عرض التفاصيل
                    </Link>
                  </Button>
                  
                  {order.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, "accepted")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order._id, "rejected")}
                      >
                        رفض
                      </Button>
                    </>
                  )}
                  
                  {order.status === "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order._id, "completed")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      اكتمل
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground">
              لم يتم استلام أي طلبات حتى الآن
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
