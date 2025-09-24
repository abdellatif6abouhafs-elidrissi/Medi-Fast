import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  User, 
  Shield, 
  Settings, 
  BarChart3, 
  Package,
  Users,
  AlertTriangle
} from "lucide-react";

// Admin placeholder page with login form (not functional)
const Admin = () => {
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  // Handle login form submission (placeholder functionality)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder validation
    if (!loginData.username || !loginData.password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    // Simulate login attempt
    toast({
      title: "وظيفة غير متاحة",
      description: "هذه صفحة تجريبية. ستتم إضافة وظائف الإدارة لاحقاً",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-accent/20 to-secondary/10">
      <div className="container mx-auto max-w-6xl">
        {/* Page header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium animate-pulse-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
            لوحة التحكم الإدارية
          </h1>
          <p className="font-arabic text-xl text-muted-foreground">
            إدارة نظام توصيل الأدوية - الدار البيضاء
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Login Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="font-arabic-display text-2xl text-center">
                  تسجيل الدخول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-arabic flex items-center space-x-2 space-x-reverse">
                      <User className="w-4 h-4" />
                      <span>اسم المستخدم</span>
                    </Label>
                    <Input
                      id="username"
                      placeholder="أدخل اسم المستخدم"
                      value={loginData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="font-arabic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-arabic flex items-center space-x-2 space-x-reverse">
                      <Lock className="w-4 h-4" />
                      <span>كلمة المرور</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={loginData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="font-arabic"
                    />
                  </div>

                  <Button type="submit" className="w-full font-arabic text-lg">
                    <Lock className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                </form>

                {/* Warning notice */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-arabic-display font-semibold text-yellow-800 mb-1">
                        ملاحظة مهمة
                      </h4>
                      <p className="font-arabic text-sm text-yellow-700 leading-relaxed">
                        هذه صفحة تجريبية لأغراض العرض فقط. وظائف الإدارة الفعلية ستتم إضافتها في المراحل التالية من التطوير.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Preview */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-arabic-display text-2xl font-bold text-center mb-6">
              معاينة لوحة التحكم المستقبلية
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Package, label: "الطلبات اليوم", value: "127", color: "text-primary" },
                { icon: Users, label: "العملاء النشطون", value: "89", color: "text-secondary" },
                { icon: Shield, label: "معدل النجاح", value: "98%", color: "text-green-600" },
                { icon: BarChart3, label: "الإيرادات", value: "15.2K", color: "text-purple-600" }
              ].map((stat, index) => (
                <Card key={index} className="text-center bg-gradient-card border-0 shadow-soft opacity-60">
                  <CardContent className="p-4">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="font-arabic text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Future Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-medium opacity-70">
                <CardHeader>
                  <CardTitle className="font-arabic-display text-xl flex items-center space-x-2 space-x-reverse">
                    <Package className="w-6 h-6 text-primary" />
                    <span>إدارة الطلبات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-arabic text-muted-foreground mb-4">
                    متابعة وإدارة جميع طلبات العملاء في الوقت الفعلي
                  </p>
                  <ul className="font-arabic text-sm space-y-2">
                    <li>• عرض الطلبات الجديدة</li>
                    <li>• تتبع حالة التوصيل</li>
                    <li>• إدارة المندوبين</li>
                    <li>• تحديث العملاء</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-medium opacity-70">
                <CardHeader>
                  <CardTitle className="font-arabic-display text-xl flex items-center space-x-2 space-x-reverse">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                    <span>التقارير والإحصائيات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-arabic text-muted-foreground mb-4">
                    تحليلات مفصلة لأداء الخدمة والإيرادات
                  </p>
                  <ul className="font-arabic text-sm space-y-2">
                    <li>• تقارير يومية وشهرية</li>
                    <li>• إحصائيات العملاء</li>
                    <li>• تحليل الطلبات</li>
                    <li>• مؤشرات الأداء</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-medium opacity-70">
                <CardHeader>
                  <CardTitle className="font-arabic-display text-xl flex items-center space-x-2 space-x-reverse">
                    <Users className="w-6 h-6 text-green-600" />
                    <span>إدارة الصيدليات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-arabic text-muted-foreground mb-4">
                    متابعة الشراكات مع الصيدليات المحلية
                  </p>
                  <ul className="font-arabic text-sm space-y-2">
                    <li>• قائمة الصيدليات الشريكة</li>
                    <li>• طلبات الانضمام الجديدة</li>
                    <li>• تقييم الأداء</li>
                    <li>• إدارة العمولات</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-medium opacity-70">
                <CardHeader>
                  <CardTitle className="font-arabic-display text-xl flex items-center space-x-2 space-x-reverse">
                    <Settings className="w-6 h-6 text-purple-600" />
                    <span>إعدادات النظام</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-arabic text-muted-foreground mb-4">
                    تخصيص وإعداد جميع جوانب النظام
                  </p>
                  <ul className="font-arabic text-sm space-y-2">
                    <li>• إعدادات التوصيل</li>
                    <li>• إدارة المستخدمين</li>
                    <li>• تخصيص المظهر</li>
                    <li>• نسخ احتياطية</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Development Status */}
            <Card className="shadow-medium bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-arabic-display text-xl text-center">
                  حالة التطوير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-arabic">
                      <Settings className="w-4 h-4 ml-2" />
                      قيد التطوير
                    </div>
                  </div>
                  
                  <p className="font-arabic text-center text-muted-foreground leading-relaxed">
                    نعمل حالياً على تطوير لوحة التحكم الإدارية الكاملة. ستشمل جميع الوظائف اللازمة لإدارة النظام بكفاءة وسهولة.
                  </p>

                  <div className="text-center pt-4">
                    <div className="font-arabic text-sm text-muted-foreground">
                      موعد الإطلاق المتوقع: الربع الأول من 2024
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact for Admin Access */}
        <Card className="mt-12 shadow-medium bg-gradient-hero">
          <CardContent className="p-8 text-center text-white">
            <h2 className="font-arabic-display text-2xl font-bold mb-4">
              هل تحتاج وصول إداري؟
            </h2>
            <p className="font-arabic mb-6 leading-relaxed opacity-90">
              للحصول على صلاحيات الوصول الإداري، يرجى التواصل مع الإدارة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-arabic">
                <User className="w-4 h-4 ml-2" />
                تواصل مع الإدارة
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-arabic">
                <Shield className="w-4 h-4 ml-2" />
                طلب صلاحيات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;