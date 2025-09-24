import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle, Search, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      data-aos="fade-up"
    >
      <div className="container mx-auto max-w-2xl text-center">
        <Card
          className="shadow-strong bg-gradient-card border-0"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <CardContent className="p-12">
            {/* Error icon and animation */}
            <div className="relative mb-8" data-aos="zoom-in">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-medium animate-pulse-glow">
                <AlertTriangle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white font-bold">!</span>
              </div>
            </div>

            {/* Error message */}
            <h1 className="font-arabic-display text-6xl md:text-7xl font-bold text-gradient mb-4">
              404
            </h1>
            <h2 className="font-arabic-display text-3xl font-bold mb-4">
              الصفحة غير موجودة
            </h2>
            <p className="font-arabic text-xl text-muted-foreground mb-8 leading-relaxed">
              نعتذر، لكن الصفحة التي تبحث عنها غير متوفرة أو قد تكون تم نقلها
              إلى موقع آخر
            </p>

            {/* Helpful links */}
            <div
              className="space-y-4 mb-8"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <p className="font-arabic text-muted-foreground">يمكنك تجربة:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 space-x-reverse justify-center p-3 bg-accent/50 rounded-lg">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-arabic text-sm">
                    العودة للصفحة الرئيسية
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse justify-center p-3 bg-accent/50 rounded-lg">
                  <Search className="w-5 h-5 text-primary" />
                  <span className="font-arabic text-sm">
                    استخدام شريط البحث
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button
                asChild
                size="lg"
                className="font-arabic text-lg px-8 py-3"
              >
                <Link to="/">
                  <Home className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-arabic text-lg px-8 py-3"
              >
                <Link to="/order">
                  <ArrowRight className="w-5 h-5 ml-2 rtl-flip" />
                  اطلب دواءك
                </Link>
              </Button>
            </div>

            {/* Contact info */}
            <div
              className="mt-12 pt-8 border-t"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <p className="font-arabic text-muted-foreground mb-4">
                هل تحتاج مساعدة؟
              </p>
              <p className="font-arabic text-sm text-muted-foreground">
                تواصل معنا: +212 6XX-XXX-XXX
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
