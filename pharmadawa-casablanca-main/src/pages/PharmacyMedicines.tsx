import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ShoppingCart, Check, Filter, Loader2, Pill } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMedicines } from "@/hooks/useMedicines";
import { Medicine } from "@/types/medicine";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PharmacyMedicines = () => {
  // Route is defined as "/pharmacy/:id/medicines" in App.tsx
  // So we must read the param as `id`, not `pharmacyId`
  const { id } = useParams();
  const { addToCart, items: cartItems } = useCart();
  const { toast } = useToast();
  
  // Use the medicines hook with pharmacy filter
  const {
    medicines,
    loading,
    error,
    total,
    fetchMedicinesByPharmacy,
    searchMedicines,
  } = useMedicines();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Available categories
  const categories = [
    "مسكنات",
    "مضادات حيوية", 
    "فيتامينات",
    "مضادات الالتهاب",
    "أدوية القلب",
    "أدوية السكري",
    "مكملات غذائية",
    "أدوية الجهاز الهضمي",
    "أدوية الجهاز التنفسي",
    "أخرى"
  ];

  const priceRanges = [
    { value: "all", label: "جميع الأسعار" },
    { value: "0-20", label: "أقل من 20 درهم" },
    { value: "20-50", label: "20 - 50 درهم" },
    { value: "50-100", label: "50 - 100 درهم" },
    { value: "100+", label: "أكثر من 100 درهم" },
  ];

  // Load medicines for this pharmacy
  useEffect(() => {
    if (id) {
      fetchMedicinesByPharmacy(id);
    }
  }, [id, fetchMedicinesByPharmacy]);

  // Filter medicines based on search and filters
  const filteredMedicines = medicines.filter((medicine) => {
    // Search filter
    if (searchQuery && !medicine.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "all" && medicine.category !== selectedCategory) {
      return false;
    }

    // Price filter
    if (priceRange !== "all") {
      const price = medicine.price;
      switch (priceRange) {
        case "0-20":
          return price < 20;
        case "20-50":
          return price >= 20 && price <= 50;
        case "50-100":
          return price >= 50 && price <= 100;
        case "100+":
          return price > 100;
        default:
          return true;
      }
    }

    return true;
  });

  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.stock <= 0) {
      toast({
        title: "غير متوفر",
        description: "هذا الدواء غير متوفر حالياً",
        variant: "destructive",
      });
      return;
    }

    // Check if already in cart
    const existingItem = cartItems.find(item => item.id === parseInt(medicine._id || medicine.id?.toString() || '0'));
    if (existingItem) {
      toast({
        title: "موجود في السلة",
        description: "هذا الدواء موجود بالفعل في سلة التسوق",
      });
      return;
    }

    addToCart({
      id: parseInt(medicine._id || medicine.id?.toString() || '0'),
      name: medicine.name,
      price: medicine.price
    }, parseInt(medicine.pharmacyId?.toString() || '0'));

    toast({
      title: "تم الإضافة!",
      description: `تم إضافة ${medicine.name} إلى سلة التسوق`,
    });
  };

  const isInCart = (medicine: Medicine) => {
    return cartItems.some(item => item.id === parseInt(medicine._id || medicine.id?.toString() || '0'));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMedicines(searchQuery, {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        pharmacyId: id,
      });
    }
  };

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">حدث خطأ</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">أدوية الصيدلية</h1>
        <p className="text-muted-foreground">
          تصفح الأدوية المتوفرة وأضفها إلى سلة التسوق
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="البحث عن دواء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="السعر" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          تم العثور على {filteredMedicines.length} دواء
        </p>
      </div>

      {/* Medicines Grid */}
      {filteredMedicines.length === 0 ? (
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد أدوية</h3>
          <p className="text-muted-foreground">
            لم يتم العثور على أدوية تطابق معايير البحث
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine._id || medicine.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{medicine.name}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {medicine.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    medicine.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {medicine.stock > 0 ? `متوفر (${medicine.stock})` : 'غير متوفر'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  {medicine.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {medicine.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {medicine.manufacturer && (
                      <div>
                        <span className="font-medium">الشركة المصنعة: </span>
                        {medicine.manufacturer}
                      </div>
                    )}
                    {medicine.dosage && (
                      <div>
                        <span className="font-medium">الجرعة: </span>
                        {medicine.dosage}
                      </div>
                    )}
                  </div>

                  {medicine.prescription && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                      <span className="text-yellow-800 text-xs font-medium">
                        ⚠️ يتطلب وصفة طبية
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {medicine.price} درهم
                    </span>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(medicine)}
                    disabled={medicine.stock <= 0 || isInCart(medicine)}
                  >
                    {isInCart(medicine) ? (
                      <>
                        <Check className="h-4 w-4 ml-2" />
                        في السلة
                      </>
                    ) : medicine.stock <= 0 ? (
                      "غير متوفر"
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Back to Pharmacies */}
      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link to="/pharmacy-partners">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة إلى الصيدليات
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PharmacyMedicines;
