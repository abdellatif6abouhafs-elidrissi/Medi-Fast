import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalItems, 
    getTotalPrice,
    clearCart 
  } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close cart when navigating to a new page
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleCheckout = () => {
    // Navigate to the payment page
    navigate('/payment');
    setIsOpen(false); // Close the cart drawer
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {getTotalItems()}
            </span>
          )}
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-background shadow-xl">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium">سلة التسوق</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium">سلة التسوق فارغة</h3>
                    <p className="mt-1 text-sm text-muted-foreground">ابدأ بإضافة بعض المنتجات</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-border">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium">
                                <h3>{item.name}</h3>
                                <p className="ml-4">{item.price * item.quantity} درهم</p>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.price} درهم للوحدة
                              </p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm mt-2">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium">
                  <p>المجموع</p>
                  <p>{getTotalPrice()} درهم</p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  الشحن والضرائب تحسب عند الدفع
                </p>
                <div className="mt-6 space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من إفراغ سلة التسوق؟')) {
                        clearCart();
                      }
                    }}
                  >
                    <Trash2 className="ml-2 h-5 w-5" />
                    إفراغ السلة
                  </Button>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    اتمام الطلب
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
