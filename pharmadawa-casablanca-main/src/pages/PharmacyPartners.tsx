import { useState, useEffect } from "react";
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

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  specialties: string[];
  workingHours: string;
  image: string;
}

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
    password: "",
    address: "",
    license: "",
    description: "",
    workingHours: "8:00 ص - 9:00 م",
    specialties: [] as string[],
    image: "🏪",
  });

  const [partnerPharmacies, setPartnerPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/pharmacies`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pharmacies');
        }

        const data = await response.json();
        setPartnerPharmacies(data.pharmacies || []);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل قائمة الصيدليات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [toast]);

  // Handle join form input changes
  const handleJoinInputChange = (field: string, value: string | string[]) => {
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
      !joinFormData.email ||
      !joinFormData.password ||
      !joinFormData.address
    ) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Register admin and create pharmacy
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: joinFormData.ownerName,
            email: joinFormData.email,
            password: joinFormData.password,
            phone: joinFormData.phone,
            address: joinFormData.address,
            role: 'admin',
            pharmacyName: joinFormData.pharmacyName,
            pharmacySpecialties: joinFormData.specialties,
            pharmacyWorkingHours: joinFormData.workingHours,
            pharmacyImage: joinFormData.image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "يمكنك الآن إدارة صيدليتك من لوحة التحكم",
      });

      // Reset form
      setJoinFormData({
        pharmacyName: "",
        ownerName: "",
        phone: "",
        email: "",
        password: "",
        address: "",
        license: "",
        description: "",
        workingHours: "8:00 ص - 9:00 م",
        specialties: [],
        image: "🏪",
      });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إنشاء الحساب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const statistics = [
    { icon: Building2, number: String(partnerPharmacies.length), label: "صيدلية شريكة" },
    { icon: Users, number: "500+", label: "عميل راض" },
    { icon: Star, number: "4.8", label: "تقييم متوسط" },
    { icon: CheckCircle, number: "99%", label: "معدل النجاح" },
  ];

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
          {statistics.map((stat, index) => (
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

        

        
        {/* Partner pharmacies list */}
        <div className="space-y-8" data-aos="fade-up">
          <h2 className="font-arabic-display text-3xl font-bold text-center text-gradient">
            صيدلياتنا الشريكة
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-arabic text-muted-foreground">جاري تحميل الصيدليات...</p>
            </div>
          ) : partnerPharmacies.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-arabic text-muted-foreground">لا توجد صيدليات شريكة حالياً</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Benefits section */}
        <div
          className="mt-20 py-16 px-6 bg-gray-100 dark:bg-black/10 rounded-2xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="text-center mb-12">
            <h2 className="font-arabic-display text-3xl font-bold mb-4">
              مميزات الشراكة معنا
            </h2>
            <p className="font-arabic text-xl text-muted-foreground">
              انضم إلى شبكتنا واستفد من المميزات التالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
