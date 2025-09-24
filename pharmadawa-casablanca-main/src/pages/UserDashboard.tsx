import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState({
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  interface Order {
    id: number;
    status: string;
    date: string;
    total: number;
    items: number;
  }

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setRecentOrders([
          {
            id: 1,
            status: "قيد التجهيز",
            date: "2023-09-09",
            total: 450,
            items: 3,
          },
          { id: 2, status: "شحنت", date: "2023-09-05", total: 320, items: 2 },
          {
            id: 3,
            status: "تم التوصيل",
            date: "2023-08-28",
            total: 150,
            items: 1,
          },
        ]);

        setOrders({ processing: 1, shipped: 1, delivered: 1 });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
            مرحباً بك، {user?.name}
          </h1>
          <p className="text-muted-foreground">
            هنا يمكنك تتبع طلباتك وإدارة حسابك.
          </p>
        </div>
        <Button asChild>
          <Link to="/order">
            <Package className="h-4 w-4 ml-2" />
            اطلب دواء جديد
          </Link>
        </Button>
      </div>

      {/* User Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card data-aos="fade-up" data-aos-delay="50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              طلبات قيد التجهيز
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.processing}</div>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات شحنت</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.shipped}</div>
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              طلبات تم توصيلها
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.delivered}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Recent Orders */}
        <div className="md:col-span-2">
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle>أحدث الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        رقم الطلب
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        الحالة
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        المجموع
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4">#{order.id}</td>
                        <td className="px-6 py-4">{order.status}</td>
                        <td className="px-6 py-4">{order.total} درهم</td>
                        <td className="px-6 py-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Actions */}
        <div>
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardHeader>
              <CardTitle>حسابي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
