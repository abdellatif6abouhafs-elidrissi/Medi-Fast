import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Package,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  updatedAt: string;
  notes?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const OrderManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const statusOptions = [
    { value: "all", label: "جميع الطلبات" },
    { value: "pending", label: "قيد الانتظار" },
    { value: "accepted", label: "مقبول" },
    { value: "rejected", label: "مرفوض" },
    { value: "completed", label: "مكتمل" },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      // Always use mock data for demo
      console.log("Using mock orders for demo");
      const mockOrders: Order[] = [
        {
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
          status: "pending" as const,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          notes: "أحتاج الدواء بسرعة من فضلكم",
        },
        {
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
          status: "accepted" as const,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
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
          status: "completed" as const,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "order-4",
          medicine: {
            name: "أموكسيسيلين 250mg",
            quantity: 1,
          },
          user: {
            name: "خديجة بنعلي",
            email: "khadija@example.com",
            phone: "0645678901",
          },
          address: "حي الأندلس، مراكش",
          phone: "0645678901",
          status: "rejected" as const,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Filter orders based on status
      let filteredOrders = mockOrders;
      if (filters.status !== "all") {
        filteredOrders = mockOrders.filter(order => order.status === filters.status);
      }

      setOrders(filteredOrders);
      setPagination({
        currentPage: filters.page,
        totalPages: 1,
        totalOrders: filteredOrders.length,
        hasNext: false,
        hasPrev: false,
      });

      toast({
        title: "وضع التجريب",
        description: "تم تحميل طلبات تجريبية. سيتم الاتصال بالخادم عند توفره.",
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Simulate success for demo
      console.log("Simulating status update for order:", orderId, "to:", newStatus);
      
      // Update the order status locally
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
            : order
        )
      );

      toast({
        title: "تم التحديث بنجاح! (وضع التجريب)",
        description: "تم تحديث حالة الطلب محلياً. سيتم حفظها في قاعدة البيانات عند توفر الخادم.",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", variant: "secondary" as const, icon: Clock },
      accepted: { label: "مقبول", variant: "default" as const, icon: CheckCircle },
      rejected: { label: "مرفوض", variant: "destructive" as const, icon: XCircle },
      completed: { label: "مكتمل", variant: "default" as const, icon: CheckCircle },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الطلبات...</p>
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

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            الطلبات ({pagination.totalOrders})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على طلبات تطابق المعايير المحددة
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الدواء</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.medicine.name}</div>
                          <div className="text-sm text-muted-foreground">
                            الكمية: {order.medicine.quantity}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.user.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{order.user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{order.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/orders/${order._id}`}>
                              <Eye className="h-3 w-3 ml-1" />
                              عرض
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
