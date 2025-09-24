import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for pharmacy medicines
const pharmacyMedicines = {
  // Pharmacy ID 1 - صيدلية النور
  1: [
    { id: 101, name: "باراسيتامول 500 مجم", price: 12.99, stock: 45, category: "مسكنات" },
    { id: 102, name: "فيتامين سي 1000 مجم", price: 29.99, stock: 30, category: "فيتامينات" },
    { id: 103, name: "ايبوبروفين 400 مجم", price: 15.50, stock: 28, category: "مسكنات" },
    { id: 104, name: "أموكسيسيلين 500 مجم", price: 45.00, stock: 22, category: "مضادات حيوية" },
    { id: 105, name: "لوراتادين 10 مجم", price: 18.75, stock: 35, category: "حساسية" },
    { id: 106, name: "أوميبرازول 20 مجم", price: 35.00, stock: 27, category: "معدة" },
    { id: 107, name: "ديكلوفيناك 50 مجم", price: 22.50, stock: 19, category: "مسكنات" },
    { id: 108, name: "فيتامين د3 5000 وحدة", price: 55.00, stock: 15, category: "فيتامينات" },
    { id: 109, name: "سيرترالين 50 مجم", price: 65.00, stock: 18, category: "اكتئاب" },
    { id: 110, name: "ميتفورمين 850 مجم", price: 28.00, stock: 32, category: "سكري" },
    { id: 111, name: "أموكسيسيلين مع حمض الكلافيولانيك", price: 52.00, stock: 20, category: "مضادات حيوية" },
    { id: 112, name: "دومبيريدون 10 مجم", price: 35.00, stock: 25, category: "هضم" },
  ],
  
  // Pharmacy ID 2 - صيدلية الأمل
  2: [
    { id: 201, name: "أوميبرازول 20 مجم", price: 35.00, stock: 20, category: "معدة" },
    { id: 202, name: "فيتامين د3 2000 وحدة", price: 42.00, stock: 25, category: "فيتامينات" },
    { id: 203, name: "سيتريزين 10 مجم", price: 15.00, stock: 40, category: "حساسية" },
    { id: 204, name: "ميتفورمين 850 مجم", price: 28.50, stock: 30, category: "سكري" },
    { id: 205, name: "أتورفاستاتين 20 مجم", price: 65.00, stock: 18, category: "كوليسترول" },
    { id: 206, name: "ديكلوفيناك جل", price: 32.00, stock: 25, category: "مسكنات موضعية" },
    { id: 207, name: "أوميغا 3 1000 مجم", price: 75.00, stock: 15, category: "مكملات غذائية" },
    { id: 208, name: "لوسارتان 50 مجم", price: 48.00, stock: 22, category: "ضغط الدم" },
    { id: 209, name: "دومبيريدون 10 مجم", price: 32.00, stock: 28, category: "هضم" },
    { id: 210, name: "باراسيتامول 1000 مجم", price: 18.00, stock: 50, category: "مسكنات" },
    { id: 211, name: "فيتامين ب المركب", price: 55.00, stock: 20, category: "فيتامينات" },
    { id: 212, name: "ديكلوفيناك 75 مجم", price: 28.00, stock: 25, category: "مسكنات" },
  ],
  
  // Pharmacy ID 3 - صيدلية السلام
  3: [
    { id: 301, name: "أملوديبين 10 مجم", price: 32.00, stock: 25, category: "ضغط الدم" },
    { id: 302, name: "ميتفورمين 1000 مجم", price: 28.50, stock: 30, category: "سكري" },
    { id: 303, name: "أتورفاستاتين 40 مجم", price: 70.00, stock: 18, category: "كوليسترول" },
    { id: 304, name: "فيتامين د 4000 وحدة", price: 55.00, stock: 22, category: "فيتامينات" },
    { id: 305, name: "ايبوبروفين 600 مجم", price: 18.00, stock: 35, category: "مسكنات" },
    { id: 306, name: "لوسارتان 50 مجم", price: 48.00, stock: 22, category: "ضغط الدم" },
    { id: 307, name: "جلوكوفاج 850 مجم", price: 32.00, stock: 28, category: "سكري" },
    { id: 308, name: "روزوفاستاتين 20 مجم", price: 85.00, stock: 15, category: "كوليسترول" },
    { id: 309, name: "أوميغا 3 1200 مجم", price: 95.00, stock: 20, category: "فيتامينات" },
    { id: 310, name: "ديكلوفيناك 75 مجم", price: 25.00, stock: 30, category: "مسكنات" },
    { id: 311, name: "إنالابريل 20 مجم", price: 42.00, stock: 25, category: "ضغط الدم" },
    { id: 312, name: "جلوكوفاج إكس آر 500 مجم", price: 38.00, stock: 20, category: "سكري" },
  ],
  
  // Pharmacy ID 4 - صيدلية الشفاء
  4: [
    { id: 401, name: "شاي أخضر عضوي 20 كيس", price: 35.00, stock: 30, category: "أعشاب" },
    { id: 402, name: "زيت اللافندر 30 مل", price: 50.00, stock: 25, category: "زيوت" },
    { id: 403, name: "أوميغا 3 نباتي 60 كبسولة", price: 85.00, stock: 20, category: "مكملات" },
    { id: 404, name: "كريم الصبار الطبيعي 100 مل", price: 45.00, stock: 28, category: "عناية بالبشرة" },
    { id: 405, name: "زنجبيل مطحون 100 جم", price: 28.00, stock: 35, category: "أعشاب" },
    { id: 406, name: "زيت النعناع 30 مل", price: 40.00, stock: 22, category: "زيوت" },
    { id: 407, name: "بروبيوتيك 10 مليار 30 كبسولة", price: 95.00, stock: 18, category: "مكملات" },
    { id: 408, name: "كريم شيا بالزبدة 200 مل", price: 55.00, stock: 25, category: "عناية بالبشرة" },
    { id: 409, name: "كركم عضوي 100 جم", price: 32.00, stock: 30, category: "أعشاب" },
    { id: 410, name: "زيت جوز الهند 200 مل", price: 65.00, stock: 20, category: "زيوت" },
    { id: 411, name: "فيتامين د3 + ك2 60 كبسولة", price: 75.00, stock: 22, category: "مكملات" },
    { id: 412, name: "جل الصبار النقي 150 مل", price: 38.00, stock: 28, category: "عناية بالبشرة" },
  ],
  
  // Pharmacy ID 5 - صيدلية المستقبل
  5: [
    { id: 501, name: "أورليستات 120 مجم 42 كبسولة", price: 180.00, stock: 15, category: "تخسيس" },
    { id: 502, name: "واي بروتين 1 كجم", price: 220.00, stock: 12, category: "رياضة" },
    { id: 503, name: "فيتامينات متعددة للرجال 60 قرص", price: 120.00, stock: 20, category: "فيتامينات" },
    { id: 504, name: "فيلدرينا 20 مجم 4 أقراص", price: 250.00, stock: 10, category: "صحة جنسية" },
    { id: 505, name: "كلين بترول 60 كبسولة", price: 150.00, stock: 18, category: "تخسيس" },
    { id: 506, name: "كرياتين مونوهيدرات 300 جم", price: 180.00, stock: 15, category: "رياضة" },
    { id: 507, name: "أوميغا 3 2000 مجم 120 كبسولة", price: 150.00, stock: 22, category: "فيتامينات" },
    { id: 508, name: "سياليس 20 مجم 4 أقراص", price: 280.00, stock: 8, category: "صحة جنسية" },
    { id: 509, name: "جلوكومانان 500 مجم 90 كبسولة", price: 95.00, stock: 25, category: "تخسيس" },
    { id: 510, name: "بي سي إيه إيه 2000 مجم 120 كبسولة", price: 200.00, stock: 18, category: "رياضة" },
    { id: 511, name: "فيتامين د3 10000 وحدة 60 كبسولة", price: 85.00, stock: 20, category: "فيتامينات" },
    { id: 512, name: "ليفيترا 20 مجم 4 أقراص", price: 260.00, stock: 10, category: "صحة جنسية" },
  ],
  
  // Pharmacy ID 6 - صيدلية الرحمة
  6: [
    { id: 601, name: "دونيبيزيل 10 مجم 28 قرص", price: 120.00, stock: 15, category: "ذاكرة" },
    { id: 602, name: "كالسيوم + فيتامين د3 60 قرص", price: 65.00, stock: 25, category: "عظام" },
    { id: 603, name: "أوميغا 3 1000 مجم 120 كبسولة", price: 95.00, stock: 20, category: "مكملات" },
    { id: 604, name: "أليندورونات 70 مجم 4 أقراص", price: 85.00, stock: 18, category: "هشاشة عظام" },
    { id: 605, name: "دومبريدون 10 مجم 30 قرص", price: 45.00, stock: 22, category: "هضم" },
    { id: 606, name: "أتورفاستاتين 40 مجم 30 قرص", price: 75.00, stock: 20, category: "كوليسترول" },
    { id: 607, name: "فيتامين ب12 1000 ميكروجرام 60 قرص", price: 65.00, stock: 25, category: "فيتامينات" },
    { id: 608, name: "أملوديبين 10 مجم 30 قرص", price: 55.00, stock: 20, category: "ضغط الدم" },
    { id: 609, name: "جلوكوزامين 1500 مجم 60 قرص", price: 110.00, stock: 18, category: "مفاصل" },
    { id: 610, name: "دومبي 10 مجم 30 قرص", price: 95.00, stock: 15, category: "باركنسون" },
    { id: 611, name: "مكمل غذائي كامل للمسنين 30 كيس", price: 150.00, stock: 12, category: "تغذية" },
    { id: 612, name: "مسكن موضعي للآلام 50 جم", price: 40.00, stock: 30, category: "مسكنات" },
  ],
  
  // Pharmacy ID 7 - صيدلية الأطباء
  7: [
    { id: 701, name: "أموكسيسيلين 500 مجم 16 كبسولة", price: 45.00, stock: 30, category: "مضاد حيوي" },
    { id: 702, name: "لوسارتان 50 مجم 30 قرص", price: 65.00, stock: 25, category: "ضغط الدم" },
    { id: 703, name: "سيتالوبرام 20 مجم 28 قرص", price: 75.00, stock: 20, category: "اكتئاب" },
    { id: 704, name: "ميتفورمين 850 مجم 30 قرص", price: 35.00, stock: 35, category: "سكري" },
    { id: 705, name: "أتورفاستاتين 40 مجم 30 قرص", price: 85.00, stock: 22, category: "كوليسترول" },
    { id: 706, name: "إسيتالوبرام 10 مجم 28 قرص", price: 70.00, stock: 20, category: "قلق" },
    { id: 707, name: "أوميبرازول 20 مجم 14 كبسولة", price: 55.00, stock: 30, category: "معدة" },
    { id: 708, name: "ميتوبرولول 50 مجم 30 قرص", price: 45.00, stock: 25, category: "قلب" },
    { id: 709, name: "سيرترالين 50 مجم 30 قرص", price: 65.00, stock: 20, category: "اكتئاب" },
    { id: 710, name: "ديكلوفيناك 50 مجم 20 قرص", price: 30.00, stock: 35, category: "مسكن" },
    { id: 711, name: "فينتوين 100 مجم 30 قرص", price: 50.00, stock: 15, category: "صرع" },
    { id: 712, name: "وارفارين 5 مجم 30 قرص", price: 40.00, stock: 20, category: "تجلط" },
  ],
  
  // Pharmacy ID 8 - صيدلية الحياة
  8: [
    { id: 801, name: "أدوية أطفال", price: 30.00, stock: 35, category: "أطفال" },
    { id: 802, name: "عناية بالبشرة", price: 40.00, stock: 28, category: "بشرة" },
    { id: 803, name: "منتجات طبيعية", price: 50.00, stock: 22, category: "طبيعي" },
  ],
  
  // Pharmacy ID 9 - صيدلية النجاح
  9: [
    { id: 901, name: "أدوية مزمنة", price: 65.00, stock: 20, category: "أمراض مزمنة" },
    { id: 902, name: "عناية بالشعر", price: 45.00, stock: 30, category: "شعر" },
    { id: 903, name: "فيتامينات", price: 75.00, stock: 25, category: "فيتامينات" },
  ]
};

// Pharmacy data
const pharmacies = {
  1: { name: "صيدلية النور", address: "شارع الملك محمد الخامس، الدار البيضاء" },
  2: { name: "صيدلية الأمل", address: "حي المعاريف، الدار البيضاء" },
  3: { name: "صيدلية السلام", address: "شارع الحسن الثاني، أنفا" },
  4: { name: "صيدلية الشفاء", address: "المدينة القديمة، الدار البيضاء" },
  5: { name: "صيدلية المستقبل", address: "حي السلام، الدار البيضاء" },
  6: { name: "صيدلية الرحمة", address: "شارع الجيش الملكي، الدار البيضاء" },
  7: { name: "صيدلية الأطباء", address: "حي النهضة، الدار البيضاء" },
  8: { name: "صيدلية الحياة", address: "حي الأحباس، الدار البيضاء" },
  9: { name: "صيدلية النجاح", address: "حي المعاريف، الدار البيضاء" }
};

const PharmacyMedicines = () => {
  const { id } = useParams<{ id: string }>();
  const pharmacyId = id ? parseInt(id) : 0;
  const medicines = pharmacyMedicines[pharmacyId as keyof typeof pharmacyMedicines] || [];
  const pharmacy = pharmacies[pharmacyId as keyof typeof pharmacies] || { name: "صيدلية", address: "" };
  const { addToCart, items } = useCart();
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (medicine: typeof medicines[number]) => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
    }, pharmacyId);
    
    setAddedItems(prev => [...prev, medicine.id]);
    
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة ${medicine.name} إلى سلة التسوق`,
    });
    
    // Remove the success state after 3 seconds
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== medicine.id));
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/pharmacy-partners">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mr-4">أدوية {pharmacy.name}</h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground mb-4">{pharmacy.address}</p>
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن دواء..."
            className="pl-10 w-full md:w-1/3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{medicine.name}</CardTitle>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {medicine.category}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{medicine.price} درهم</p>
                  <p className="text-sm text-muted-foreground">
                    متوفر: {medicine.stock} علبة
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleAddToCart(medicine)}
                  disabled={addedItems.includes(medicine.id)}
                >
                  {addedItems.includes(medicine.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      تمت الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      أضف للسلة
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {medicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد أدوية متاحة حالياً في هذه الصيدلية</p>
        </div>
      )}
    </div>
  );
};

export default PharmacyMedicines;
