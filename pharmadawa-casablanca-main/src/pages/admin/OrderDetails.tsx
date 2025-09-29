import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Pill,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  _id: string;
  medicine: {
    name: string;
    quantity: number;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  phone: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  notes?: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulate loading and set mock data based on ID
    const loadOrder = () => {
      setTimeout(() => {
        const mockOrders: { [key: string]: Order } = {
          "order-1": {
            _id: "order-1",
            medicine: {
              name: "باراسيتامول 500mg",
              quantity: 2,
            },
            user: {
              name: "أحمد محمد",
              email: "ahmed@example.com",
              phone: "0612345678",
            },
            address: "شارع الحسن الثاني، الدار البيضاء",
            phone: "0612345678",
            status: "pending",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            notes: "أحتاج الدواء بسرعة من فضلكم",
          },
          "order-2": {
            _id: "order-2",
            medicine: {
              name: "إيبوبروفين 400mg",
              quantity: 1,
            },
            user: {
              name: "فاطمة الزهراء",
              email: "fatima@example.com",
              phone: "0623456789",
            },
            address: "حي المعاريف، الرباط",
            phone: "0623456789",
            status: "accepted",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          "order-3": {
            _id: "order-3",
            medicine: {
              name: "فيتامين د3",
              quantity: 3,
            },
            user: {
              name: "يوسف العلوي",
              email: "youssef@example.com",
              phone: "0634567890",
            },
            address: "شارع محمد الخامس، فاس",
            phone: "0634567890",
            status: "completed",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        };

        const foundOrder = mockOrders[id || "order-1"] || mockOrders["order-1"];
        setOrder(foundOrder);
        setLoading(false);
        
        toast({
          title: "تم التحميل بنجاح",
          description: "تم تحميل تفاصيل الطلب (وضع التجريب)",
        });
      }, 500);
    };

    loadOrder();
  }, [id, toast]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "مقبول", className: "bg-blue-100 text-blue-800" },
      rejected: { label: "مرفوض", className: "bg-red-100 text-red-800" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const updateOrderStatus = (newStatus: string) => {
    if (order) {
      setOrder({ ...order, status: newStatus as any });
      toast({
        title: "تم التحديث بنجاح!",
        description: `تم تحديث حالة الطلب إلى: ${newStatus} (وضع التجريب)`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2>الطلب غير موجود</h2>
          <Button onClick={() => navigate("/admin/orders")}>
            العودة إلى قائمة الطلبات
          </Button>
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
          onClick={() => navigate("/admin/orders")}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة إلى الطلبات
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تفاصيل الطلب #{order._id}</h1>
          <p className="text-muted-foreground">
            تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-MA')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              معلومات الطلب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Pill className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{order.medicine.name}</p>
                <p className="text-sm text-muted-foreground">
                  الكمية: {order.medicine.quantity}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">تاريخ الطلب</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString('ar-MA')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">حالة الطلب</p>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {order.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold mb-1">ملاحظات العميل:</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{order.user.name}</p>
                <p className="text-sm text-muted-foreground">{order.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <p>{order.user.phone}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="leading-relaxed">{order.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>إجراءات الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {order.status === "pending" && (
              <>
                <Button
                  onClick={() => updateOrderStatus("accepted")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  قبول الطلب
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateOrderStatus("rejected")}
                >
                  رفض الطلب
                </Button>
              </>
            )}
            
            {order.status === "accepted" && (
              <Button
                onClick={() => updateOrderStatus("completed")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                تم التسليم
              </Button>
            )}
            
            {(order.status === "completed" || order.status === "rejected") && (
              <p className="text-muted-foreground py-2">
                تم {order.status === "completed" ? "إكمال" : "رفض"} هذا الطلب
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
