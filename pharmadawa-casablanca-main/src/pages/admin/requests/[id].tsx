import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Printer, MessageSquare, Phone, Mail, MapPin, Clock, CheckCircle, Clock as ClockIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Mock data - replace with actual API call
const mockOrder = {
  id: "12345",
  customerName: "أحمد محمد",
  customerPhone: "+212 600 123456",
  customerEmail: "ahmed@example.com",
  deliveryAddress: "123 شارع محمد الخامس، الدار البيضاء",
  orderDate: new Date("2023-06-15T14:30:00"),
  status: "قيد التجهيز", // يمكن أن تكون: قيد التجهيز، قيد التوصيل، مكتمل، ملغي
  items: [
    { id: 1, name: "بنادول اكسترا 500 مجم", quantity: 2, price: 25.00, total: 50.00 },
    { id: 2, name: "فيتامين سي 1000 مجم", quantity: 1, price: 45.00, total: 45.00 },
    { id: 3, name: "كريم مرطب للوجه", quantity: 1, price: 35.50, total: 35.50 },
  ],
  subtotal: 130.50,
  deliveryFee: 15.00,
  total: 145.50,
  notes: "الرجاء ترك الطرد عند البوابة إذا لم أكن في المنزل",
  pharmacyNotes: "يجب التأكد من صلاحية الدواء قبل التوصيل"
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch the order details using the id
  // useEffect(() => {
  //   const fetchOrderDetails = async () => {
  //     const response = await fetch(`/api/orders/${id}`);
  //     const data = await response.json();
  //     setOrder(data);
  //   };
  //   fetchOrderDetails();
  // }, [id]);

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy - hh:mm a", { locale: ar });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'قيد التجهيز':
        return <Badge className="bg-amber-500 hover:bg-amber-600">
          <ClockIcon className="h-3 w-3 ml-1" />
          {status}
        </Badge>;
      case 'قيد التوصيل':
        return <Badge className="bg-blue-500 hover:bg-blue-600">
          <ClockIcon className="h-3 w-3 ml-1" />
          {status}
        </Badge>;
      case 'مكتمل':
        return <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 ml-1" />
          {status}
        </Badge>;
      case 'ملغي':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 ml-1" />
          {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-1">
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">الطلب #{mockOrder.id}</CardTitle>
                  <CardDescription>
                    {formatDate(mockOrder.orderDate)}
                  </CardDescription>
                </div>
                {getStatusBadge(mockOrder.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">معلومات العميل</h4>
                    <p className="text-sm">{mockOrder.customerName}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${mockOrder.customerPhone}`} className="hover:underline">
                        {mockOrder.customerPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${mockOrder.customerEmail}`} className="hover:underline">
                        {mockOrder.customerEmail}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">عنوان التوصيل</h4>
                    <div className="flex items-start gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{mockOrder.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>التوصيل خلال ساعة</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">المنتجات</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-right p-3 text-sm font-medium">المنتج</th>
                          <th className="text-center p-3 text-sm font-medium">الكمية</th>
                          <th className="text-left p-3 text-sm font-medium">السعر</th>
                          <th className="text-left p-3 text-sm font-medium">المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrder.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">#{item.id}</div>
                            </td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3">{item.price.toFixed(2)} درهم</td>
                            <td className="p-3 font-medium">{item.total.toFixed(2)} درهم</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-4">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي:</span>
                  <span>{mockOrder.subtotal.toFixed(2)} درهم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم التوصيل:</span>
                  <span>{mockOrder.deliveryFee.toFixed(2)} درهم</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع الكلي:</span>
                  <span>{mockOrder.total.toFixed(2)} درهم</span>
                </div>
              </div>

              {mockOrder.notes && (
                <div className="w-full mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">ملاحظات العميل</h4>
                  <p className="text-sm text-muted-foreground">{mockOrder.notes}</p>
                </div>
              )}

              {mockOrder.pharmacyNotes && (
                <div className="w-full mt-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-200">ملاحظات الصيدلية</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{mockOrder.pharmacyNotes}</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Order Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">حالة الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">حالة الطلب الحالية:</span>
                {getStatusBadge(mockOrder.status)}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">تغيير الحالة</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    تم التجهيز
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <ClockIcon className="h-4 w-4 ml-2" />
                    قيد التوصيل
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    تم التسليم
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-destructive">
                    <XCircle className="h-4 w-4 ml-2" />
                    إلغاء الطلب
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الاتصال بالعميل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 ml-2" />
                إرسال رسالة
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 ml-2" />
                الاتصال بالعميل
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 ml-2" />
                إرسال بريد إلكتروني
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجراءات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 ml-2" />
                إرجاع الطلب
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 ml-2" />
                طباعة الفاتورة
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive">
                <XCircle className="h-4 w-4 ml-2" />
                حذف الطلب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
