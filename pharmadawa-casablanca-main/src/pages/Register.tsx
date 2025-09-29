import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "الاسم مطلوب" }),
    lastName: z.string().optional(),
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
    password: z
      .string()
      .min(6, { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" }),
    confirmPassword: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    role: z.enum(["user", "admin"]).default("user"),
    // Pharmacy fields (required only for admin role)
    pharmacyName: z.string().optional(),
    pharmacyAddress: z.string().optional(),
    pharmacyWorkingHours: z.string().optional(),
    pharmacyImage: z.string().optional(),
    pharmacySpecialties: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "admin") {
      return data.pharmacyName && data.pharmacyName.length > 0;
    }
    return true;
  }, {
    message: "اسم الصيدلية مطلوب للمدراء",
    path: ["pharmacyName"],
  })
  .refine((data) => {
    if (data.role === "admin") {
      return data.pharmacyAddress && data.pharmacyAddress.length > 0;
    }
    return true;
  }, {
    message: "عنوان الصيدلية مطلوب للمدراء",
    path: ["pharmacyAddress"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      postalCode: "",
      role: "user",
      pharmacyName: "",
      pharmacyAddress: "",
      pharmacyWorkingHours: "8:00 ص - 9:00 م",
      pharmacyImage: "🏪",
      pharmacySpecialties: [],
    },
  });

  const watchRole = form.watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      form.reset({
        ...data,
        password: "",
        confirmPassword: "",
      });

      // Call your auth register function
      const registrationData: any = {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        role: data.role,
      };

      // Add pharmacy data if the user is registering as admin
      if (data.role === "admin") {
        registrationData.pharmacyName = data.pharmacyName;
        registrationData.pharmacySpecialties = data.pharmacySpecialties || [];
        registrationData.pharmacyWorkingHours = data.pharmacyWorkingHours;
        registrationData.pharmacyImage = data.pharmacyImage;
        // Use pharmacy address as the main address for admin
        registrationData.address = data.pharmacyAddress;
      }

      const result = await authRegister(registrationData);

      if (!result.success) {
        const errorMessages = {
          "Email already exists": "البريد الإلكتروني مستخدم بالفعل",
          "Registration failed": "فشل في إنشاء الحساب",
          "An unexpected error occurred": "حدث خطأ غير متوقع",
        };

        toast({
          variant: "destructive",
          title: "خطأ في التسجيل",
          description:
            errorMessages[result.error as keyof typeof errorMessages] ||
            result.error ||
            "فشل في إنشاء الحساب",
        });

        // Clear sensitive fields on error
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        return;
      }

      setRegistrationSuccess(true);
      
      if (data.role === "admin") {
        toast({
          title: "تم إنشاء حساب الصيدلية بنجاح!",
          description: "تم إنشاء حسابك وصيدليتك بنجاح. يمكنك الآن إدارة صيدليتك من لوحة التحكم.",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "تم التسجيل بنجاح",
          description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء التسجيل",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-aos="fade-up">
      <div
        className={`mx-auto bg-white rounded-lg shadow-md p-6 ${
          watchRole === "admin" ? "max-w-4xl" : "max-w-md"
        }`}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h1 className="text-2xl font-bold text-center mb-6">إنشاء حساب جديد</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العائلة</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الحساب</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحساب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">مستخدم عادي</SelectItem>
                        <SelectItem value="admin">مدير صيدلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pharmacy Fields - Show only when admin role is selected */}
            {watchRole === "admin" && (
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">معلومات الصيدلية</h3>
                
                <FormField
                  control={form.control}
                  name="pharmacyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الصيدلية *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل اسم الصيدلية" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pharmacyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الصيدلية *</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="أدخل عنوان الصيدلية بالتفصيل" disabled={isLoading} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pharmacyWorkingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ساعات العمل</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="مثال: 8:00 ص - 9:00 م" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pharmacyImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أيقونة الصيدلية</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="🏪">🏪 صيدلية</SelectItem>
                              <SelectItem value="💊">💊 دواء</SelectItem>
                              <SelectItem value="👨‍⚕️">👨‍⚕️ طبيب</SelectItem>
                              <SelectItem value="🌿">🌿 طبيعي</SelectItem>
                              <SelectItem value="❤️">❤️ صحة</SelectItem>
                              <SelectItem value="🌟">🌟 نجمة</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pharmacySpecialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التخصصات</FormLabel>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          "أدوية عامة",
                          "أدوية الأطفال", 
                          "رعاية كبار السن",
                          "أدوية القلب",
                          "مستحضرات التجميل",
                          "أجهزة طبية",
                          "مكملات غذائية",
                          "أعشاب طبية"
                        ].map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2 space-x-reverse text-sm">
                            <input
                              type="checkbox"
                              checked={field.value?.includes(specialty) || false}
                              onChange={(e) => {
                                const currentSpecialties = field.value || [];
                                const newSpecialties = e.target.checked
                                  ? [...currentSpecialties, specialty]
                                  : currentSpecialties.filter(s => s !== specialty);
                                field.onChange(newSpecialties);
                              }}
                              className="form-checkbox h-4 w-4"
                              disabled={isLoading}
                            />
                            <span>{specialty}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address field - only show for regular users */}
            {watchRole === "user" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدينة</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرمز البريدي</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {watchRole === "admin" ? "جاري إنشاء حساب الصيدلية..." : "جاري التسجيل..."}
                </div>
              ) : (
                watchRole === "admin" ? "إنشاء حساب صيدلية" : "تسجيل حساب جديد"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>

      <Dialog open={registrationSuccess} onOpenChange={setRegistrationSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم التسجيل بنجاح!</DialogTitle>
            <DialogDescription>
              تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول باستخدام بريدك
              الإلكتروني وكلمة المرور.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate("/login")}>
              الذهاب إلى صفحة تسجيل الدخول
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">رقم الهاتف:</Label>
              <div className="col-span-3 font-medium">{userData?.phone}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">العنوان:</Label>
              <div className="col-span-3 font-medium">
                {userData?.address}، {userData?.city} - {userData?.postalCode}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">نوع الحساب:</Label>
              <div className="col-span-3 font-medium">{userData?.role}</div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setRegistrationSuccess(false);
                navigate("/login");
              }}
              className="bg-primary hover:bg-primary/90"
            >
              الذهاب لتسجيل الدخول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
