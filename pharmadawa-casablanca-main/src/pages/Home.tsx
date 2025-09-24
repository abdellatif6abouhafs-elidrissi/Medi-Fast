import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Pill,
  Clock,
  Shield,
  Phone,
  Search,
  Truck,
  CheckCircle,
  Star,
  MapPin,
  Users,
  Mail,
} from "lucide-react";

// Home page with hero section, features, how it works, and contact
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [pharmacies, setPharmacies] = useState(0);

  useEffect(() => {
    // Target values
    const targets = {
      orders: 500,
      time: 15,
      pharm: 50
    };

    // Animation duration in milliseconds
    const duration = 2000;
    const frameDuration = 1000 / 60; // 60fps
    const frames = Math.round(duration / frameDuration);
    
    const animateCounters = () => {
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        
        // Calculate progress (easing function for smooth animation)
        const progress = frame / frames;
        const easeOutQuad = 1 - Math.pow(1 - progress, 3);
        
        // Update values
        setDeliveredOrders(Math.round(easeOutQuad * targets.orders));
        setDeliveryTime(Math.round(easeOutQuad * targets.time));
        setPharmacies(Math.round(easeOutQuad * targets.pharm));
        
        // Stop the animation when complete
        if (frame === frames) {
          clearInterval(counter);
        }
      }, frameDuration);
    };

    // Start animation when component mounts
    const timer = setTimeout(animateCounters, 500);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-40 bg-cover px-4 overflow-hidden" data-aos="fade-up"
      style={{ backgroundImage: "url('https://i.pinimg.com/736x/2e/76/3a/2e763a2ff9f20c4aeafe71b4f8e9e966.jpg')" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="font-arabic-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              توصيل الأدوية
              <br />
              <span className="text-white/90">السريع والآمن</span>
            </h1>
            <p className="font-arabic text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              نوصل لك دواءك في أسرع وقت إلى باب منزلك في الدار البيضاء
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 font-arabic text-lg px-8 py-3 animate-pulse-glow"
                >
                  <Link to="/order">اطلب دواءك الآن</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 font-arabic text-lg px-8 py-3 animate-pulse-glow"
                >
                  <Link to="/register">تسجيل الدخول لطلب الدواء</Link>
                </Button>
              )}
              {isAuthenticated && user && user.role === 'admin' ? (
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 font-arabic text-lg px-8 py-3 animate-pulse-glow"
                >
                  <Link to="/pharmacy-partners">الصيدليات الشريكة</Link>
                </Button>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* About the Service */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-delay="100">
            <h2 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
              عن خدمتنا
            </h2>
            <p className="font-arabic text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نحن نقدم خدمة توصيل الأدوية الأكثر سرعة وأماناً في الدار البيضاء،
              مع شراكات مع أفضل الصيدليات في المدينة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="150">
            {[
              {
                icon: Clock,
                title: "سرعة في التوصيل",
                description: "نوصل طلبك في أقل من 30 دقيقة",
                color: "text-primary",
              },
              {
                icon: Shield,
                title: "أمان مضمون",
                description: "جميع الأدوية أصلية ومضمونة الجودة",
                color: "text-secondary",
              },
              {
                icon: Phone,
                title: "دعم 24/7",
                description: "خدمة العملاء متاحة طوال اليوم",
                color: "text-primary",
              },
              {
                icon: Users,
                title: "فريق محترف",
                description: "فريق مدرب ومعتمد لضمان أفضل خدمة",
                color: "text-secondary",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <feature.icon
                    className={`w-12 h-12 mx-auto mb-4 ${feature.color}`}
                  />
                  <h3 className="font-arabic-display text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-arabic text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
              كيف تعمل الخدمة؟
            </h2>
            <p className="font-arabic text-xl text-muted-foreground">
              ثلاث خطوات بسيطة للحصول على دوائك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                step: "1",
                icon: Search,
                title: "ابحث عن دوائك",
                description:
                  "قم بتعبئة النموذج وحدد الدواء المطلوب أو ارفع صورة الوصفة الطبية",
              },
              {
                step: "2",
                icon: CheckCircle,
                title: "تأكيد الطلب",
                description:
                  "سنتواصل معك لتأكيد الطلب والعنوان وتحديد موعد التوصيل",
              },
              {
                step: "3",
                icon: Truck,
                title: "استلم طلبك",
                description:
                  "سيصلك الدواء في الوقت المحدد مع ضمان الجودة والأمان",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
              <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-medium"></div>
                  <step.icon className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1" />
                </div>

                <h3 className="font-arabic-display text-2xl font-semibold mb-4">
                  {step.title}
                </h3>
                <p className="font-arabic text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>

                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-l from-primary/50 to-transparent transform translate-x-[-50%]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
              لماذا تختارنا؟
            </h2>
            <p className="font-arabic text-xl text-muted-foreground">
              نتميز بالجودة والسرعة والثقة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8" data-aos="fade-right" data-aos-delay="100">
              {[
                {
                  icon: Clock,
                  title: "توصيل سريع",
                  description:
                    "نضمن وصول دوائك في أقل من 30 دقيقة في معظم مناطق الدار البيضاء",
                  stats: "متوسط 15 دقيقة",
                },
                {
                  icon: Shield,
                  title: "جودة مضمونة",
                  description:
                    "جميع الأدوية من صيدليات معتمدة ومرخصة من وزارة الصحة",
                  stats: "100% أصلية",
                },
                {
                  icon: Phone,
                  title: "دعم مستمر",
                  description:
                    "فريق خدمة العملاء متاح على مدار الساعة لمساعدتك",
                  stats: "24/7 دعم",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 space-x-reverse animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-arabic-display text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="font-arabic text-muted-foreground leading-relaxed mb-2">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-arabic">
                      <Star className="w-4 h-4 ml-1" />
                      {item.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative" data-aos="fade-left" data-aos-delay="150">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-strong">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-medium">
                    <Pill className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-arabic-display text-2xl font-bold">
                    أكثر من 500 عميل راض
                  </h3>
                  <p className="font-arabic text-muted-foreground leading-relaxed">
                    انضم إلى مئات العملاء الذين يثقون في خدمتنا اليومية
                  </p>
                  <div className="flex justify-center space-x-2 space-x-reverse">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="font-arabic text-sm text-muted-foreground">
                    تقييم 4.9/5 من عملائنا
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-hero" data-aos="fade-up">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-arabic-display text-4xl font-bold text-white mb-6">
              هل لديك سؤال؟
            </h2>
            <p className="font-arabic text-xl text-white/90 mb-8 leading-relaxed">
              فريقنا مستعد لمساعدتك في أي وقت. لا تتردد في التواصل معنا
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Phone className="w-8 h-8 text-white mx-auto mb-4 rtl-flip" />
                <h3 className="font-arabic font-semibold text-white mb-2">
                  اتصل بنا
                </h3>
                <p className="font-arabic text-white/80">+212 625034547</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="font-arabic font-semibold text-white mb-2">
                  راسلنا
                </h3>
                <p className="font-arabic text-white/80">
                pharma-medicine-casa.ma
                </p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="font-arabic font-semibold text-white mb-2">
                  موقعنا
                </h3>
                <p className="font-arabic text-white/80">
                  الدار البيضاء - أنفا
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90 font-arabic text-lg px-8 py-3"
              >
                <Link to="/order">اطلب دواءك الآن</Link>
              </Button>
              <Button
                asChild
                className="border-white text-white hover:bg-white/10 font-arabic text-lg px-8 py-3"
              >
                <Link to="/faqs">الأسئلة الشائعة</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
