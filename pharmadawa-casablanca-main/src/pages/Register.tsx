import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
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
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);

      // Call your auth register function
      const user = await authRegister({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        role: data.role,
      });

      setUserData(user);
      setRegistrationSuccess(true);

      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
      });

      // Redirect to login or dashboard based on role
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
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
        className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
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
              {isLoading ? "جاري التسجيل..." : "تسجيل حساب جديد"}
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
