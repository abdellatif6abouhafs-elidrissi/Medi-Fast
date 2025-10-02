import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

interface Medicine {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  inStock: boolean;
  stock?: number;
  pharmacyId: string;
  pharmacyName: string;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('medicineCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('medicineCart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (medicineId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.medicine._id === medicineId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            return item; // Will be filtered out in removeItem
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeItem = (medicineId: string) => {
    setCart(prevCart => prevCart.filter(item => item.medicine._id !== medicineId));
    toast({
      title: "تم الحذف",
      description: "تم حذف الدواء من السلة",
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('medicineCart');
    toast({
      title: "تم إفراغ السلة",
      description: "تم حذف جميع الأدوية من السلة",
    });
  };

  const goToCheckout = () => {
    console.log('goToCheckout called');
    console.log('Current cart:', cart);
    
    if (cart.length === 0) {
      console.log('Cart is empty');
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة أدوية إلى السلة أولاً",
        variant: "destructive",
      });
      return;
    }
    
    // Save cart to localStorage before going to payment
    console.log('Saving cart to localStorage');
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    
    console.log('Navigating to /payment');
    navigate('/payment');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.medicine.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">السلة فارغة</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بإضافة أي أدوية بعد
            </p>
            <Button asChild size="lg">
              <Link to="/medicines">
                <ShoppingBag className="h-5 w-5 ml-2" />
                تصفح الأدوية
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-gradient">سلة التسوق</h1>
              <p className="text-muted-foreground">
                لديك {getTotalItems()} منتج في السلة
              </p>
            </div>
          </div>
          
          <Button
            variant="destructive"
            onClick={clearCart}
            size="sm"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            إفراغ السلة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.medicine._id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{item.medicine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.medicine.pharmacyName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.medicine._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.medicine.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.medicine.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.medicine._id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.medicine._id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-left">
                        {item.medicine.price ? (
                          <>
                            <p className="font-bold text-xl text-primary">
                              {item.medicine.price * item.quantity} درهم
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.medicine.price} درهم × {item.quantity}
                            </p>
                          </>
                        ) : (
                          <Badge variant="outline">السعر غير محدد</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد الأدوية:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد المنتجات:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">المجموع:</span>
                  <span className="font-bold text-xl text-primary">
                    {getTotalPrice()} درهم
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  * قد تختلف الأسعار النهائية حسب توفر المنتجات
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  onClick={goToCheckout}
                  className="w-full"
                  size="lg"
                >
                  <ArrowRight className="h-5 w-5 ml-2" />
                  إتمام الطلب
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Link to="/medicines">
                    متابعة التسوق
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
