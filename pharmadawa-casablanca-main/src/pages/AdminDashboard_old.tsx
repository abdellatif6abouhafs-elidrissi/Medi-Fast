import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Package,
  User,
  CreditCard,
  LogOut,
  Shield,
  Users,
  Settings,
  BarChart3,
  Store,
  Bell,
  Eye,
  Edit,
  MapPin,
  Phone,
  Clock,
  Pill,
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

interface PharmacyData {
  id: string;
  name: string;
  address: string;
  phone: string;
  specialties: string[];
  workingHours: string;
  image: string;
  medicines: Array<{
    name: string;
    description?: string;
    price?: number;
    inStock: boolean;
  }>;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  unreadNotifications: number;
}

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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [hasPharmacy, setHasPharmacy] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    unreadNotifications: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // If API endpoint doesn't exist, create mock data for demo
          console.log("API endpoint not available, using mock dashboard data");
          
          const mockPharmacy = {
            id: "mock-pharmacy-1",
            name: "صيدلية الشفاء",
            address: "شارع محمد الخامس، الدار البيضاء",
            phone: "0522123456",
            specialties: ["أدوية عامة", "أدوية الأطفال", "مستحضرات التجميل"],
            workingHours: "8:00 ص - 9:00 م",
            image: "🏪",
            medicines: [
              { name: "باراسيتامول 500mg", description: "مسكن للألم", price: 15.50, inStock: true },
              { name: "إيبوبروفين 400mg", description: "مضاد للالتهاب", price: 25.00, inStock: true },
              { name: "فيتامين د3", description: "مكمل غذائي", price: 35.00, inStock: false },
            ],
          };

          const mockStats = {
            totalOrders: 12,
            pendingOrders: 3,
            completedOrders: 8,
            unreadNotifications: 2,
          };

          const mockRecentOrders = [
            {
              _id: "order-1",
              medicine: { name: "باراسيتامول 500mg", quantity: 2 },
              user: { name: "أحمد محمد", email: "ahmed@example.com", phone: "0612345678" },
              address: "شارع الحسن الثاني، الدار البيضاء",
              phone: "0612345678",
              status: "pending" as const,
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: "order-2",
              medicine: { name: "إيبوبروفين 400mg", quantity: 1 },
              user: { name: "فاطمة الزهراء", email: "fatima@example.com", phone: "0623456789" },
              address: "حي المعاريف، الرباط",
              phone: "0623456789",
              status: "accepted" as const,
              createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
          ];

          setPharmacy(mockPharmacy);
          setHasPharmacy(true);
          setStats(mockStats);
          setRecentOrders(mockRecentOrders);
          return;
        }

        const data = await response.json();
        
        if (data.hasPharmacy) {
          setPharmacy(data.pharmacy);
          setHasPharmacy(true);
          setStats(data.statistics || {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            unreadNotifications: 0,
          });
          setRecentOrders(data.orders || []);
        } else {
          setHasPharmacy(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Even on error, provide mock data for demo
        const mockPharmacy = {
          id: "mock-pharmacy-1",
          name: "صيدلية الشفاء",
          address: "شارع محمد الخامس، الدار البيضاء",
          phone: "0522123456",
          specialties: ["أدوية عامة", "أدوية الأطفال", "مستحضرات التجميل"],
          workingHours: "8:00 ص - 9:00 م",
          image: "🏪",
          medicines: [
            { name: "باراسيتامول 500mg", description: "مسكن للألم", price: 15.50, inStock: true },
            { name: "إيبوبروفين 400mg", description: "مضاد للالتهاب", price: 25.00, inStock: true },
            { name: "فيتامين د3", description: "مكمل غذائي", price: 35.00, inStock: false },
          ],
        };

        const mockStats = {
          totalOrders: 12,
          pendingOrders: 3,
          completedOrders: 8,
          unreadNotifications: 2,
        };

        const mockRecentOrders = [
          {
            _id: "order-1",
            medicine: { name: "باراسيتامول 500mg", quantity: 2 },
            user: { name: "أحمد محمد", email: "ahmed@example.com", phone: "0612345678" },
            address: "شارع الحسن الثاني، الدار البيضاء",
            phone: "0612345678",
            status: "pending" as const,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: "order-2",
            medicine: { name: "إيبوبروفين 400mg", quantity: 1 },
            user: { name: "فاطمة الزهراء", email: "fatima@example.com", phone: "0623456789" },
            address: "حي المعاريف، الرباط",
            phone: "0623456789",
            status: "accepted" as const,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
        ];

        setPharmacy(mockPharmacy);
        setHasPharmacy(true);
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        
        toast({
          title: "وضع التجريب",
          description: "تم تحميل بيانات تجريبية. سيتم الاتصال بالخادم عند توفره.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate, toast, API_BASE]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "قيد الانتظار", variant: "secondary" as const },
      accepted: { label: "مقبول", variant: "default" as const },
      rejected: { label: "مرفوض", variant: "destructive" as const },
      completed: { label: "مكتمل", variant: "default" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!hasPharmacy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-2xl">لا توجد صيدلية مرتبطة بحسابك</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              يجب إنشاء صيدلية أولاً للوصول إلى لوحة التحكم
            </p>
            <Button asChild>
              <Link to="/pharmacy-partners">
                <Store className="ml-2 h-4 w-4" />
                إنشاء صيدلية
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-aos="fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div data-aos="fade-up">
          <h1 className="text-2xl md:text-3xl font-bold">
            مرحباً بك، {user?.name || "مدير الصيدلية"}
          </h1>
          <p className="text-muted-foreground">
            لوحة تحكم صيدلية {pharmacy?.name} - إدارة الطلبات والأدوية
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/pharmacy/edit">
              <Edit className="h-4 w-4 ml-2" />
              تعديل الصيدلية
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/orders">
              <Package className="h-4 w-4 ml-2" />
              إدارة الطلبات
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card data-aos="fade-up" data-aos-delay="50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات قيد الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">تحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات مكتملة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">تم التسليم</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإشعارات</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">غير مقروءة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pharmacy Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pharmacy Details Card */}
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                معلومات الصيدلية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{pharmacy?.image}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{pharmacy?.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pharmacy?.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{pharmacy?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{pharmacy?.workingHours}</span>
                  </div>
                </div>

                {pharmacy?.specialties && pharmacy.specialties.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">التخصصات:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/pharmacy/edit">
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل المعلومات
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/medicines">
                      <Pill className="h-4 w-4 ml-2" />
                      إدارة الأدوية
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  الطلبات الأخيرة
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/orders">
                    <Eye className="h-4 w-4 ml-2" />
                    عرض الكل
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد طلبات حتى الآن
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.medicine.name}</span>
                          <span className="text-sm text-muted-foreground">
                            (الكمية: {order.medicine.quantity})
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          العميل: {order.user.name} • {order.user.phone}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/admin/orders/${order._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Profile */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card data-aos="fade-up" data-aos-delay="150">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/orders">
                    <Package className="h-4 w-4 ml-2" />
                    إدارة الطلبات
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/medicines">
                    <Pill className="h-4 w-4 ml-2" />
                    إدارة الأدوية
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/pharmacy/edit">
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل الصيدلية
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/reports">
                    <BarChart3 className="h-4 w-4 ml-2" />
                    التقارير
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Profile */}
          <Card data-aos="fade-up" data-aos-delay="200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                الملف الشخصي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary">مدير صيدلية</Badge>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/settings">
                    <Settings className="ml-2 h-4 w-4" />
                    إعدادات الحساب
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
