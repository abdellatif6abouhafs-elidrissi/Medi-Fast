import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PaymentPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'number') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Format expiry date as MM/YY
    else if (name === 'expiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Format CVV (max 4 digits)
    else if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').substr(0, 4);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      // Basic validation for card payment
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "خطأ",
          description: "الرجاء ملء جميع حقول بطاقة الدفع",
          variant: "destructive",
        });
        return;
      }
      
      // Validate card number (16 digits)
      const cardNumber = cardDetails.number.replace(/\s/g, '');
      if (cardNumber.length !== 16) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال رقم بطاقة صالح (16 رقم)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate expiry date (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiry)) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال تاريخ انتهاء صالح (MM/YY)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate CVV (3 or 4 digits)
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال رمز CVV صالح (3 أو 4 أرقام)",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!deliveryAddress) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال عنوان التوصيل",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success message
      clearCart();
      
      toast({
        title: "تم الدفع بنجاح",
        description: "شكراً لشرائك مع صيداوة. سيتم توصيل طلبك قريباً.",
        variant: "default",
      });
      
      // Redirect to order confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">إتمام عملية الدفع</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">طريقة الدفع</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Button
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        className="flex-col h-auto py-4"
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard className="h-6 w-6 mb-2" />
                        <span>بطاقة ائتمان</span>
                      </Button>
                      <Button
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        className="flex-col h-auto py-4"
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <span className="text-2xl mb-1">💵</span>
                        <span>الدفع عند الاستلام</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">رقم البطاقة</Label>
                        <Input
                          id="card-number"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="card-name">اسم حامل البطاقة</Label>
                        <Input
                          id="card-name"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardInputChange}
                          placeholder="كما هو مدون على البطاقة"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            type="password"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="address">عنوان التوصيل</Label>
                    <Input
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="أدخل عنوان التوصيل الكامل"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span>{item.price * item.quantity} درهم</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>المجموع</span>
                      <span>{getTotalPrice()} درهم</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>التوصيل</span>
                      <span>مجاناً</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <Check className="ml-2 h-4 w-4" />
                        تأكيد الطلب
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    بالضغط على "تأكيد الطلب"، فإنك توافق على شروط وأحكام صيداوة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
