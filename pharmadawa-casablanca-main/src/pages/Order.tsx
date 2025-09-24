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

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
