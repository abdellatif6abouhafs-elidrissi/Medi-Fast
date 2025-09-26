import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم مكونًا من حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, you would call your backend API here
      // await api.submitForgotPassword(data);
      
      setFormSubmitted(true);
      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم التواصل معك قريبًا لإعادة تعيين كلمة المرور",
      });
      
      // Log the submitted data to console
      console.log("Submitted data:", data);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            نسيت كلمة المرور؟
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            يرجى تعبئة النموذج التالي وسنقوم بالتواصل معك
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-medium text-green-800">شكرًا لك!</h3>
            <p className="mt-2 text-green-700">
              تم استلام طلبك بنجاح. سيتم التواصل معك قريبًا عبر البريد الإلكتروني أو الهاتف.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              العودة إلى صفحة تسجيل الدخول
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  type="text"
                  className="mt-1 block w-full"
                  placeholder="أدخل اسمك الكامل"
                  {...register("name")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني (Gmail)</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1 block w-full"
                  placeholder="example@gmail.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="mt-1 block w-full"
                  placeholder="06XXXXXXXX"
                  {...register("phone")}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال الطلب"
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
