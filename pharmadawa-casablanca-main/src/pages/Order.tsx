import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Pill,
  Upload,
  Phone,
  MapPin,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";

// Order page with medicine request form and validation
const Order = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    medicineName: "",
    notes: "",
    prescription: null as File | null,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [isAuthenticated, user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for pharmacies
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);

  // Fetch pharmacies on component mount and refresh every 30 seconds
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoadingPharmacies(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
          }/api/pharmacies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pharmacies");
        }

        const data = await response.json();
        setPharmacies(data.pharmacies);
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل قائمة الصيدليات",
          variant: "destructive",
        });
      } finally {
        setLoadingPharmacies(false);
      }
    };

    fetchPharmacies();
    const interval = setInterval(fetchPharmacies, 30000);
    return () => clearInterval(interval);
  }, []);

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPharmacy) {
      newErrors.pharmacy = "يرجى اختيار صيدلية";
    }

    if (!formData.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (
      !/^(\+212|0)[5-7]\d{8}$/.test(formData.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "رقم الهاتف غير صحيح (مثال: 0612345678)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "العنوان يجب أن يكون أكثر تفصيلاً";
    }

    if (!formData.medicineName.trim() && !formData.prescription) {
      newErrors.medicineName = "اسم الدواء مطلوب أو ارفع صورة الوصفة";
    }

    if (!selectedPharmacy) {
      newErrors.pharmacy = "يرجى اختيار صيدلية";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطأ في الملف",
          description: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "نوع الملف غير مدعوم",
          description: "يرجى رفع صورة بصيغة JPG أو PNG",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, prescription: file }));
      // Clear medicine name error if prescription is uploaded
      if (errors.medicineName) {
        setErrors((prev) => ({ ...prev, medicineName: "" }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تصحيح الأخطاء المشار إليها",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
        }/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pharmacyId: selectedPharmacy?.id,
            medicineName: formData.medicineName,
            quantity: 1,
            address: formData.address,
            phone: formData.phone,
            notes: formData.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل في إرسال الطلب");
      }

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الطلب وموعد التوصيل",
      });

      // Reset form, keeping user data if logged in
      setFormData({
        name: isAuthenticated && user ? user.name || "" : "",
        phone: isAuthenticated && user ? user.phone || "" : "",
        address: isAuthenticated && user ? user.address || "" : "",
        medicineName: "",
        notes: "",
        prescription: null,
      });
      setSelectedPharmacy(null);

      // Reset file input
      const fileInput = document.getElementById(
        "prescription"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" data-aos="fade-up">
      <div className="container mx-auto max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium animate-pulse-glow">
            <Pill className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
            اطلب دواءك الآن
          </h1>
          <p className="font-arabic text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            املأ النموذج أدناه وسنقوم بتوصيل دوائك في أسرع وقت ممكن
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order form */}
          <div
            className="lg:col-span-2"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="font-arabic-display text-2xl">
                  معلومات الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Pharmacy Selection */}
                  <div className="space-y-4">
                    <h3 className="font-arabic-display text-lg font-semibold text-primary">
                      اختيار الصيدلية
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="pharmacy"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>الصيدلية *</span>
                      </Label>
                      <select
                        id="pharmacy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedPharmacy?.id || ""}
                        onChange={(e) => {
                          const pharmacy = pharmacies.find(
                            (p) => p.id === e.target.value
                          );
                          setSelectedPharmacy(pharmacy || null);
                          if (errors.pharmacy) {
                            setErrors((prev) => ({ ...prev, pharmacy: "" }));
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <option value="">اختر الصيدلية</option>
                        {pharmacies.map((pharmacy) => (
                          <option key={pharmacy.id} value={pharmacy.id}>
                            {pharmacy.name}
                          </option>
                        ))}
                      </select>
                      {errors.pharmacy && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.pharmacy}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Personal information */}
                  <div className="space-y-4">
                    <h3 className="font-arabic-display text-lg font-semibold text-primary">
                      المعلومات الشخصية
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <User className="w-4 h-4" />
                        <span>الاسم الكامل *</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`font-arabic ${
                          errors.name ? "border-destructive" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <Phone className="w-4 h-4 rtl-flip" />
                        <span>رقم الهاتف *</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="0612345678"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`font-arabic ${
                          errors.phone ? "border-destructive" : ""
                        }`}
                        dir="ltr"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>العنوان الكامل *</span>
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="أدخل عنوانك بالتفصيل (الشارع، الحي، المدينة، إلخ)"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className={`font-arabic min-h-[100px] ${
                          errors.address ? "border-destructive" : ""
                        }`}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medicine information */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-arabic-display text-lg font-semibold text-primary">
                      معلومات الدواء
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="medicineName" className="font-arabic">
                        اسم الدواء أو الوصف
                      </Label>
                      <Input
                        id="medicineName"
                        placeholder="اكتب اسم الدواء المطلوب"
                        value={formData.medicineName}
                        onChange={(e) =>
                          handleInputChange("medicineName", e.target.value)
                        }
                        className={`font-arabic ${
                          errors.medicineName ? "border-destructive" : ""
                        }`}
                      />
                      {errors.medicineName && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.medicineName}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="prescription"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <FileText className="w-4 h-4" />
                        <span>صورة الوصفة الطبية (اختياري)</span>
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          id="prescription"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="prescription"
                          className="cursor-pointer"
                        >
                          <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                          <p className="font-arabic text-muted-foreground mb-2">
                            {formData.prescription
                              ? formData.prescription.name
                              : "اضغط لرفع صورة الوصفة"}
                          </p>
                          <p className="font-arabic text-sm text-muted-foreground">
                            JPG, PNG أقل من 5MB
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="font-arabic">
                        ملاحظات إضافية
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="أي ملاحظات أو تفاصيل إضافية"
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        className="font-arabic"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Pharmacy selection */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-arabic-display text-lg font-semibold text-primary">
                      اختر الصيدلية
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="pharmacy"
                        className="font-arabic flex items-center space-x-2 space-x-reverse"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>الصيدلية *</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="pharmacy"
                          value={selectedPharmacy?.id || ""}
                          onChange={(e) => {
                            const pharmacyId = e.target.value;
                            const pharmacy = pharmacies.find(
                              (p) => p.id === pharmacyId
                            );
                            setSelectedPharmacy(pharmacy || null);
                            // Clear pharmacy error if a valid pharmacy is selected
                            if (errors.pharmacy) {
                              setErrors((prev) => ({ ...prev, pharmacy: "" }));
                            }
                          }}
                          className={`block appearance-none w-full bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none font-arabic ${
                            errors.pharmacy ? "border-destructive" : ""
                          }`}
                        >
                          <option value="">اختر صيدلية</option>
                          {pharmacies.map((pharmacy) => (
                            <option key={pharmacy.id} value={pharmacy.id}>
                              {pharmacy.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.pharmacy && (
                        <p className="text-destructive text-sm font-arabic flex items-center space-x-1 space-x-reverse">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.pharmacy}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full font-arabic text-lg py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order information sidebar */}
          <div className="space-y-6" data-aos="fade-left" data-aos-delay="150">
            {/* Service features */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="font-arabic-display text-xl">
                  مميزات الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: "⚡",
                    title: "توصيل سريع",
                    description: "في أقل من 30 دقيقة",
                  },
                  {
                    icon: "🛡️",
                    title: "أدوية أصلية",
                    description: "مضمونة 100%",
                  },
                  {
                    icon: "📞",
                    title: "دعم مستمر",
                    description: "24/7",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 space-x-reverse"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-arabic-display font-semibold">
                        {feature.title}
                      </h4>
                      <p className="font-arabic text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact info */}
            <Card className="shadow-medium bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-arabic-display text-xl">
                  هل تحتاج مساعدة؟
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-arabic text-muted-foreground">
                  إذا كان لديك أي استفسار، لا تتردد في التواصل معنا
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4 text-primary rtl-flip" />
                    <span className="font-arabic text-sm">
                      +212 6XX-XXX-XXX
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-4 h-4 text-center text-primary">✉️</span>
                    <span className="font-arabic text-sm">
                      info@medicine-casa.ma
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
