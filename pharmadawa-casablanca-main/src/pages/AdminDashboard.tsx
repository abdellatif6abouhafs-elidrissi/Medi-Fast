import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Package,
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

        // Get pharmacy ID for API calls (use pharmacy reference from admin model)
        const pharmacyId = user?.pharmacy || user?.pharmacyId || user?.id;
        
        try {
          const pharmacyResponse = await fetch(`${API_BASE}/api/pharmacies/${pharmacyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (pharmacyResponse.ok) {
            const pharmacyData = await pharmacyResponse.json();
            setPharmacy(pharmacyData);
            setHasPharmacy(true);
          } else {
            // Fallback to user profile data if API fails
            if (user?.pharmacyId || user?.pharmacyName || user?.role === "admin") {
              const userPharmacy = {
                id: user.pharmacyId || user.id || "admin-pharmacy",
                name: user.pharmacyName || `صيدلية ${user.name}`,
                address: user.pharmacyAddress || "العنوان غير محدد",
                phone: user.pharmacyPhone || user.phone || "الهاتف غير محدد",
                specialties: user.pharmacySpecialties || ["أدوية عامة"],
                workingHours: user.pharmacyWorkingHours || "8:00 ص - 9:00 م",
                image: user.pharmacyImage || "🏪",
                medicines: [],
              };
              
              setPharmacy(userPharmacy);
              setHasPharmacy(true);
            } else {
              setHasPharmacy(false);
            }
          }
        } catch (pharmacyError) {
          console.log("Pharmacy API not available, using user profile data");
          // Fallback to user profile data - assume admin users have a pharmacy
          if (user?.role === "admin") {
            const userPharmacy = {
              id: user.pharmacyId || user.id || "admin-pharmacy",
              name: user.pharmacyName || `صيدلية ${user.name}`,
              address: user.pharmacyAddress || "العنوان غير محدد",
              phone: user.pharmacyPhone || user.phone || "الهاتف غير محدد",
              specialties: user.pharmacySpecialties || ["أدوية عامة"],
              workingHours: user.pharmacyWorkingHours || "8:00 ص - 9:00 م",
              image: user.pharmacyImage || "🏪",
              medicines: [],
            };
            
            setPharmacy(userPharmacy);
            setHasPharmacy(true);
          } else {
            setHasPharmacy(false);
          }
        }

        // Fetch real pharmacy statistics and orders
        
        try {
          // Fetch pharmacy statistics
          const statsResponse = await fetch(`${API_BASE}/api/admin/pharmacy/${pharmacyId}/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          } else {
            // Fallback to default stats if API fails
            setStats({
              totalOrders: 0,
              pendingOrders: 0,
              completedOrders: 0,
              unreadNotifications: 0,
            });
          }

          // Fetch recent orders for this pharmacy
          const ordersResponse = await fetch(`${API_BASE}/api/admin/pharmacy/${pharmacyId}/orders?limit=5&sort=createdAt&order=desc`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setRecentOrders(ordersData.orders || []);
          } else {
            // Fallback to empty orders if API fails
            setRecentOrders([]);
          }
        } catch (apiError) {
          console.log("API not available, using fallback data");
          // Fallback stats and orders for development
          setStats({
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            unreadNotifications: 0,
          });
          setRecentOrders([]);
        }
        
        if (user?.pharmacyId) {
          toast({
            title: "تم التحميل بنجاح",
            description: `مرحباً بك في لوحة تحكم ${user.pharmacyName}`,
          });
        } else {
          toast({
            title: "وضع التجريب",
            description: "تم تحميل بيانات تجريبية. يرجى إكمال معلومات الصيدلية.",
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات لوحة التحكم",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user, navigate, toast, API_BASE]);

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

  // Admin users always have access to dashboard
  // Remove the "no pharmacy" blocking screen

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
                          العميل: {order.user.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/orders/${order._id}`}>
                            <Eye className="h-3 w-3" />
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

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card data-aos="fade-up" data-aos-delay="150">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to="/admin/medicines">
                  <Pill className="h-4 w-4 ml-2" />
                  إدارة الأدوية
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/orders">
                  <Package className="h-4 w-4 ml-2" />
                  عرض جميع الطلبات
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/pharmacy/edit">
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل معلومات الصيدلية
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
