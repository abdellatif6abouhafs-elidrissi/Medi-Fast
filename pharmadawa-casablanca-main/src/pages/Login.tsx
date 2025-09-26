import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const success = await login(data.email, data.password);

      if (success) {
        // Check if the logged-in user is an admin
        const isAdmin = data.email === "admin@example.com";

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحبًا بعودتك${isAdmin ? " أيها المدير" : ""}!`,
        });

        // Redirect based on user role
        const redirectPath = isAdmin ? "/admin/dashboard" : "/dashboard";
        navigate(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      data-aos="fade-up"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center" data-aos="fade-up">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            تسجيل الدخول إلى حسابك
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أو{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@example.com"
                className="mt-1 block w-full"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  هل نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1 block w-full"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6" data-aos="fade-up" data-aos-delay="150">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">أو تابع بـ</span>
            </div>
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Button 
              variant="outline" 
              type="button" 
              disabled={isLoading}
              className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => window.open('https://github.com/abdellatif6abouhafs-elidrissi/pharmadawa-casablanca', '_blank')}
            >
              <svg
                className="h-5 w-5 text-gray-800 dark:text-gray-200"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.14 20.16 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-800 dark:text-gray-200 font-medium">GitHub</span>
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}
             onClick={() => window.open('https://www.google.com/', '_blank')}
            >
  {/* Icon Google */}
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 533.5 544.3"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 33.9-25.4 62.7-54.1 82v68h87.4c51.1-47 80.3-116.4 80.3-195z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c73.9 0 135.8-24.5 181-66.6l-87.4-68c-24.3 16.3-55.5 25.9-93.6 25.9-71.9 0-132.8-48.5-154.6-113.8H31.8v71.5C76.9 486.8 169 544.3 272 544.3z"
    />
    <path
      fill="#FBBC05"
      d="M117.4 326.2c-10.8-32.4-10.8-67.6 0-100l-85.6-71.5C8 197.8 0 235.6 0 276c0 40.5 8 78.3 31.8 121.3l85.6-71.1z"
    />
    <path
      fill="#EA4335"
      d="M272 109.7c39 0 74.3 13.4 102 39.7l76-76.1C403.6 24.1 337.9 0 272 0 169 0 76.9 57.5 31.8 151.3l85.6 71.5C139.2 158.2 200.1 109.7 272 109.7z"
    />
  </svg>

  {/* Text */}
  <span>Google</span>
</Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
