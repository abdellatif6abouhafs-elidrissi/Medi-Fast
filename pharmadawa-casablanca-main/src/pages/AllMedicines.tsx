import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Pill, Search, Store, MapPin, Phone, Package, Loader2, ShoppingCart, Plus } from "lucide-react";

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

const AllMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<{ medicine: Medicine; quantity: number }[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/medicines`);
      
      if (response.ok) {
        const data = await response.json();
        setMedicines(data.medicines || []);
      } else {
        console.error("Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/medicines/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart function
  const addToCart = (medicine: Medicine) => {
    if (!medicine.inStock) {
      toast({
        title: "غير متوفر",
        description: "هذا الدواء غير متوفر حالياً",
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.medicine._id === medicine._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.medicine._id === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast({
        title: "تم التحديث",
        description: `تم زيادة كمية ${medicine.name}`,
      });
    } else {
      setCart([...cart, { medicine, quantity: 1 }]);
      toast({
        title: "تمت الإضافة",
        description: `تم إضافة ${medicine.name} للسلة`,
      });
    }
  };

  // Go to cart
  const goToCart = () => {
    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة أدوية إلى السلة أولاً",
        variant: "destructive",
      });
      return;
    }
    
    // Save cart to localStorage
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    navigate('/cart');
  };

  // Group medicines by pharmacy
  const medicinesByPharmacy = filteredMedicines.reduce((acc, medicine) => {
    const pharmacyName = medicine.pharmacyName || "صيدلية غير محددة";
    if (!acc[pharmacyName]) {
      acc[pharmacyName] = [];
    }
    acc[pharmacyName].push(medicine);
    return acc;
  }, {} as Record<string, Medicine[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الأدوية...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Cart Badge */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Pill className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-gradient">جميع الأدوية المتاحة</h1>
              <p className="text-muted-foreground text-lg">
                تصفح جميع الأدوية من صيدلياتنا الشريكة
              </p>
            </div>
          </div>
          
          {/* Cart Badge */}
          {cart.length > 0 && (
            <Button onClick={goToCart} className="relative">
              <ShoppingCart className="h-5 w-5 ml-2" />
              السلة
              <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="ابحث عن دواء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                الكل ({medicines.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          عرض <span className="font-bold text-primary">{filteredMedicines.length}</span> دواء من{" "}
          <span className="font-bold text-primary">{Object.keys(medicinesByPharmacy).length}</span> صيدلية
        </p>
      </div>

      {/* Medicines by Pharmacy */}
      {Object.keys(medicinesByPharmacy).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد أدوية</h3>
            <p className="text-muted-foreground">لم يتم العثور على أدوية تطابق البحث</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(medicinesByPharmacy).map(([pharmacyName, pharmacyMedicines]) => (
            <Card key={pharmacyName}>
              <CardHeader className="bg-accent/50">
                <div className="flex items-center gap-3">
                  <Store className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{pharmacyName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pharmacyMedicines.length} دواء متاح
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pharmacyMedicines.map((medicine) => (
                    <Card key={medicine._id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{medicine.name}</h3>
                          </div>
                          <Badge variant={medicine.inStock ? "default" : "secondary"}>
                            {medicine.inStock ? "متوفر" : "غير متوفر"}
                          </Badge>
                        </div>

                        {medicine.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {medicine.description}
                          </p>
                        )}

                        <div className="space-y-2">
                          {medicine.category && (
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">{medicine.category}</Badge>
                            </div>
                          )}

                          {medicine.price && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold text-primary">
                                {medicine.price} درهم
                              </span>
                            </div>
                          )}

                          {medicine.stock !== undefined && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Package className="h-4 w-4" />
                              <span>الكمية: {medicine.stock}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => addToCart(medicine)}
                            disabled={!medicine.inStock}
                            className="flex-1"
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 ml-2" />
                            أضف للسلة
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                          >
                            <Link to={`/pharmacy/${medicine.pharmacyId}/medicines`}>
                              <Store className="h-4 w-4 ml-2" />
                              الصيدلية
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMedicines;
