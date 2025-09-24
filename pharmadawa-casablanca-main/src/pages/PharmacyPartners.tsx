import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Users,
  Handshake,
  CheckCircle,
  Mail,
  Clock,
  Pill,
} from "lucide-react";

// Pharmacy Partners page with list of partners and join form
const PharmacyPartners = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinFormData, setJoinFormData] = useState({
    pharmacyName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    license: "",
    description: "",
  });

  // Mock data for partner pharmacies
  const partnerPharmacies = [
    {
      id: 1,
      name: "صيدلية النور",
      address: "شارع الملك محمد الخامس، الدار البيضاء",
      phone: "+212 522-123-456",
      rating: 4.8,
      specialties: ["أدوية عامة", "مستحضرات التجميل", "أجهزة طبية"],
      workingHours: "8:00 ص - 10:00 م",
      image: "🏪",
    },
    {
      id: 7,
      name: "صيدلية الأطباء",
      address: "حي النهضة، الدار البيضاء",
      phone: "+212 522-789-012",
      rating: 4.7,
      specialties: ["أدوية موصوفة", "مستلزمات طبية", "مكملات غذائية"],
      workingHours: "8:30 ص - 9:30 م",
      image: "👨‍⚕️",
    },
    {
      id: 8,
      name: "صيدلية الحياة",
      address: "حي الأحباس، الدار البيضاء",
      phone: "+212 522-890-123",
      rating: 4.9,
      specialties: ["أدوية أطفال", "عناية بالبشرة", "منتجات طبيعية"],
      workingHours: "7:30 ص - 10:30 م",
      image: "🌱",
    },
    {
      id: 9,
      name: "صيدلية النجاح",
      address: "حي المعاريف، الدار البيضاء",
      phone: "+212 522-901-234",
      rating: 4.8,
      specialties: ["أدوية مزمنة", "عناية بالشعر", "فيتامينات"],
      workingHours: "8:00 ص - 11:00 م",
      image: "✨",
    },
    {
      id: 2,
      name: "صيدلية الأمل",
      address: "حي المعاريف، الدار البيضاء",
      phone: "+212 522-234-567",
      rating: 4.9,
      specialties: ["أدوية الأطفال", "المكملات الغذائية", "العناية الشخصية"],
      workingHours: "24 ساعة",
      image: "🏥",
    },
    {
      id: 3,
      name: "صيدلية السلام",
      address: "شارع الحسن الثاني، أنفا",
      phone: "+212 522-345-678",
      rating: 4.7,
      specialties: ["أدوية مزمنة", "أعشاب طبية", "قياس الضغط"],
      workingHours: "7:00 ص - 11:00 م",
      image: "💊",
    },
    {
      id: 4,
      name: "صيدلية الشفاء",
      address: "المدينة القديمة، الدار البيضاء",
      phone: "+212 522-456-789",
      rating: 4.6,
      specialties: ["طب بديل", "زيوت طبيعية", "استشارات صيدلانية"],
      workingHours: "9:00 ص - 8:00 م",
      image: "🌿",
    },
    {
      id: 5,
      name: "صيدلية المستقبل",
      address: "حي السلام، الدار البيضاء",
      phone: "+212 522-567-890",
      rating: 4.8,
      specialties: ["تكنولوجيا طبية", "أدوية حديثة", "توصيل سريع"],
      workingHours: "6:00 ص - 12:00 ص",
      image: "🚀",
    },
    {
      id: 6,
      name: "صيدلية الرحمة",
      address: "شارع الجيش الملكي، الدار البيضاء",
      phone: "+212 522-678-901",
      rating: 4.9,
      specialties: ["رعاية كبار السن", "أدوية القلب", "متابعة طبية"],
      workingHours: "8:00 ص - 9:00 م",
      image: "❤️",
    },
  ];

  // Handle join form input changes
  const handleJoinInputChange = (field: string, value: string) => {
    setJoinFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle join form submission
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !joinFormData.pharmacyName ||
      !joinFormData.ownerName ||
      !joinFormData.phone ||
      !joinFormData.email
    ) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سنراجع طلبك ونتواصل معك قريباً",
      });

      // Reset form
      setJoinFormData({
        pharmacyName: "",
        ownerName: "",
        phone: "",
        email: "",
        address: "",
        license: "",
        description: "",
      });
      setShowJoinForm(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" data-aos="fade-up">
      <div className="container mx-auto max-w-6xl">
        {/* Page header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium animate-pulse-glow">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
            الصيدليات الشريكة
          </h1>
          <p className="font-arabic text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نتعاون مع أفضل الصيدليات في الدار البيضاء لضمان توفير أجود الأدوية
            وأسرع الخدمات
          </p>
        </div>

        {/* Statistics */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {[
            { icon: Building2, number: "50+", label: "صيدلية شريكة" },
            { icon: Users, number: "500+", label: "عميل راض" },
            { icon: Star, number: "4.8", label: "تقييم متوسط" },
            { icon: CheckCircle, number: "99%", label: "معدل النجاح" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-gradient-card border-0 shadow-soft animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="font-arabic text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join as pharmacy button (admins only) */}
        {user?.role === "admin" && (
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Button
              size="lg"
              onClick={() => setShowJoinForm(!showJoinForm)}
              className="font-arabic text-lg px-8 py-3 animate-pulse-glow"
            >
              <Handshake className="w-5 h-5 ml-2" />
              {showJoinForm ? "إخفاء النموذج" : "انضم كصيدلية شريكة"}
            </Button>
          </div>
        )}

        {/* Join form (admins only) */}
        {user?.role === "admin" && showJoinForm && (
          <Card
            className="mb-12 shadow-medium"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <CardHeader>
              <CardTitle className="font-arabic-display text-2xl text-center">
                انضم إلى شبكة الصيدليات الشريكة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName" className="font-arabic">
                      اسم الصيدلية *
                    </Label>
                    <Input
                      id="pharmacyName"
                      placeholder="أدخل اسم الصيدلية"
                      value={joinFormData.pharmacyName}
                      onChange={(e) =>
                        handleJoinInputChange("pharmacyName", e.target.value)
                      }
                      className="font-arabic"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="font-arabic">
                      اسم المالك *
                    </Label>
                    <Input
                      id="ownerName"
                      placeholder="أدخل اسم المالك"
                      value={joinFormData.ownerName}
                      onChange={(e) =>
                        handleJoinInputChange("ownerName", e.target.value)
                      }
                      className="font-arabic"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinPhone" className="font-arabic">
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="joinPhone"
                      placeholder="0612345678"
                      value={joinFormData.phone}
                      onChange={(e) =>
                        handleJoinInputChange("phone", e.target.value)
                      }
                      className="font-arabic"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinEmail" className="font-arabic">
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="joinEmail"
                      type="email"
                      placeholder="pharmacy@example.com"
                      value={joinFormData.email}
                      onChange={(e) =>
                        handleJoinInputChange("email", e.target.value)
                      }
                      className="font-arabic"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license" className="font-arabic">
                      رقم الترخيص
                    </Label>
                    <Input
                      id="license"
                      placeholder="رقم ترخيص الصيدلية"
                      value={joinFormData.license}
                      onChange={(e) =>
                        handleJoinInputChange("license", e.target.value)
                      }
                      className="font-arabic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinAddress" className="font-arabic">
                    العنوان الكامل
                  </Label>
                  <Textarea
                    id="joinAddress"
                    placeholder="أدخل عنوان الصيدلية بالتفصيل"
                    value={joinFormData.address}
                    onChange={(e) =>
                      handleJoinInputChange("address", e.target.value)
                    }
                    className="font-arabic"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-arabic">
                    وصف الخدمات
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="صف الخدمات والتخصصات التي تقدمها صيدليتك"
                    value={joinFormData.description}
                    onChange={(e) =>
                      handleJoinInputChange("description", e.target.value)
                    }
                    className="font-arabic"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full font-arabic text-lg py-3"
                >
                  إرسال طلب الانضمام
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Partner pharmacies list */}
        <div className="space-y-8" data-aos="fade-up">
          <h2 className="font-arabic-display text-3xl font-bold text-center text-gradient">
            صيدلياتنا الشريكة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerPharmacies.map((pharmacy, index) => (
              <Card
                key={pharmacy.id}
                className="shadow-medium hover:shadow-strong transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{pharmacy.image}</div>
                    <h3 className="font-arabic-display text-xl font-bold mb-2">
                      {pharmacy.name}
                    </h3>
                    <p className="text-muted-foreground text-sm flex items-center justify-center">
                      <MapPin className="ml-1 h-4 w-4" />
                      {pharmacy.address}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                    >
                      <Link
                        to={`/pharmacy/${pharmacy.id}/medicines`}
                        className="flex items-center justify-center"
                      >
                        <Pill className="ml-1 h-4 w-4" />
                        عرض الأدوية
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="font-arabic text-sm text-muted-foreground leading-relaxed">
                        {pharmacy.address}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Phone className="w-4 h-4 text-primary rtl-flip" />
                      <p className="font-arabic text-sm text-muted-foreground">
                        {pharmacy.phone}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="font-arabic text-sm text-muted-foreground">
                        {pharmacy.workingHours}
                      </p>
                    </div>

                    <div className="pt-3 border-t">
                      <h4 className="font-arabic-display font-semibold text-sm mb-2">
                        التخصصات:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {pharmacy.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-arabic rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <div
          className="mt-20 py-16 px-6 bg-gray-100 dark:bg-black/10 rounded-2xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="font-arabic-display text-3xl font-bold mb-4">
              مميزات الشراكة معنا
            </h2>
            <p className="font-arabic text-xl text-muted-foreground">
              انضم إلى شبكتنا واستفد من المميزات التالية
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {[
              {
                icon: Users,
                title: "زيادة العملاء",
                description: "وصول إلى قاعدة عملاء أكبر وزيادة في المبيعات",
              },
              {
                icon: CheckCircle,
                title: "إدارة سهلة",
                description: "نظام إدارة متقدم لتتبع الطلبات والمبيعات",
              },
              {
                icon: Handshake,
                title: "دعم تسويقي",
                description: "حملات تسويقية لصيدليتك على منصاتنا",
              },
              {
                icon: Star,
                title: "تقييمات العملاء",
                description: "نظام تقييم يساعد في بناء سمعة ممتازة",
              },
              {
                icon: Phone,
                title: "دعم فني",
                description: "فريق دعم متخصص لمساعدتك في أي وقت",
              },
              {
                icon: Building2,
                title: "نمو مستدام",
                description: "فرص نمو وتوسع مع شبكة راسخة",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-arabic-display text-xl font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="font-arabic text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPartners;
