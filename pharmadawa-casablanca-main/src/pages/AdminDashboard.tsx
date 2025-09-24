import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
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
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState({
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock data, replace with actual API calls
        setOrders({ processing: 5, shipped: 10, delivered: 25 });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-aos="fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div data-aos="fade-up">
          <h1 className="text-2xl md:text-3xl font-bold">
            مرحباً بك، {user?.name || "عزيزي المدير"}
          </h1>
          <p className="text-muted-foreground">
            لوحة تحكم مسؤول النظام - إدارة المحتوى والمستخدمين
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/orders">
              <Package className="h-4 w-4 ml-2" />
              إدارة الطلبات
            </Link>
          </Button>
        </div>
      </div>

      {/* Admin Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card data-aos="fade-up" data-aos-delay="50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المستخدمين
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 هذا الشهر</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الطلبات الجديدة
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.delivered + orders.processing + orders.shipped}
            </div>
            <p className="text-xs text-muted-foreground">+0 اليوم</p>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 متوفر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 درهم</div>
            <p className="text-xs text-muted-foreground">+0% من الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Admin Quick Actions */}
        <div className="md:col-span-2">
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>إجراءات سريعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/products">
                    <Package className="h-6 w-6" />
                    <span>إدارة المنتجات</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/orders">
                    <Package className="h-6 w-6" />
                    <span>إدارة الطلبات</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/users">
                    <Users className="h-6 w-6" />
                    <span>إدارة المستخدمين</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/categories">
                    <Package className="h-6 w-6" />
                    <span>التصنيفات</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/settings">
                    <Settings className="h-6 w-6" />
                    <span>الإعدادات</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/admin/reports">
                    <BarChart3 className="h-6 w-6" />
                    <span>التقارير</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Profile */}
        <div>
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>الملف الشخصي</span>
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
                <h3 className="font-medium">{user?.name || "مسؤول النظام"}</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
                  مسؤول النظام
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/admin/settings">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Management Section */}
      <div className="mt-8">
        <Card data-aos="fade-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>إدارة الطلبات</span>
              </CardTitle>
              <Button size="sm" asChild>
                <Link to="/admin/requests/new">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة طلب جديد
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>نوع الطلب</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>#REQ-1001</TableCell>
                      <td className="px-4 py-3">طلب دواء غير متوفر</td>
                      <td>أحمد محمد</td>
                      <td>2023-11-15</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          قيد المراجعة
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/admin/requests/1">عرض التفاصيل</Link>
                        </Button>
                      </td>
                    </TableRow>
                    <TableRow>
                      <TableCell>#REQ-1002</TableCell>
                      <td className="px-4 py-3">طلب استبدال</td>
                      <td>سارة أحمد</td>
                      <td>2023-11-14</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          قيد التنفيذ
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/admin/requests/2">عرض التفاصيل</Link>
                        </Button>
                      </td>
                    </TableRow>
                    <TableRow>
                      <TableCell>#REQ-1003</TableCell>
                      <td className="px-4 py-3">استفسار عن دواء</td>
                      <td>محمد علي</td>
                      <td>2023-11-13</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          مكتمل
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/admin/requests/3">عرض التفاصيل</Link>
                        </Button>
                      </td>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  عرض 1 إلى 3 من 3 طلبات
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    السابق
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    التالي
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
