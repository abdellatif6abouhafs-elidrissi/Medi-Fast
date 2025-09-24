import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          شكراً لطلبك!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          تم استلام طلبك بنجاح وسيتم معالجته قريباً.
        </p>
        <p className="text-sm text-gray-600">
          سيصلك إشعار بتفاصيل الشحن على بريدك الإلكتروني: <span className="font-medium">{user?.email}</span>
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            رقم الطلب: #{Math.floor(100000 + Math.random() * 900000)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            تاريخ الطلب: {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            العودة إلى المتجر
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
            className="w-full"
          >
            تتبع طلباتي
          </Button>
        </div>
      </div>
    </div>
  );
}
