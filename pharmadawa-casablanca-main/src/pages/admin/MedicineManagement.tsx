import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Pill, Plus, Save, X, Edit, Trash2, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedicines } from "@/hooks/useMedicines";
import { Medicine, CreateMedicineRequest } from "@/types/medicine";

const MedicineManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the medicines hook
  const {
    medicines,
    loading,
    error,
    total,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines,
    refetch
  } = useMedicines();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    manufacturer: "",
    dosage: "",
    prescription: "false",
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      manufacturer: "",
      dosage: "",
      prescription: "false",
    });
    setEditingMedicine(null);
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      description: medicine.description || "",
      price: medicine.price?.toString() || "",
      stock: medicine.stock?.toString() || "",
      category: medicine.category || "",
      manufacturer: medicine.manufacturer || "",
      dosage: medicine.dosage || "",
      prescription: medicine.prescription ? "true" : "false",
    });
    setEditingMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleDeleteMedicine = async (medicine: Medicine) => {
    if (medicine._id) {
      await deleteMedicine(medicine._id);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchMedicines(searchQuery, {
        category: selectedCategory !== "all" ? selectedCategory : undefined
      });
    } else {
      refetch();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الدواء",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار فئة الدواء",
        variant: "destructive",
      });
      return;
    }

    const medicineData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: formData.price ? parseFloat(formData.price) : 0,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      category: formData.category.trim(),
      manufacturer: formData.manufacturer.trim() || undefined,
      dosage: formData.dosage.trim() || undefined,
      prescription: formData.prescription === "true",
      pharmacyId: user?.pharmacy || user?.pharmacyId || user?.id || "default-pharmacy", // Use admin's pharmacy reference
    };

    try {
      if (editingMedicine && editingMedicine._id) {
        // Edit existing medicine
        await updateMedicine({
          _id: editingMedicine._id,
          ...medicineData,
        });
      } else {
        // Add new medicine
        await addMedicine(medicineData as CreateMedicineRequest);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting medicine:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>جاري تحميل الأدوية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للوحة التحكم
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">إدارة الأدوية</h1>
          <p className="text-muted-foreground">
            إدارة قائمة الأدوية المتوفرة في الصيدلية
          </p>
        </div>
        
        {/* Database Connection Status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
          <div className={`w-2 h-2 rounded-full ${
            error ? 'bg-red-500' : 'bg-green-500'
          }`}></div>
          <span className="text-sm">
            {error ? 'وضع تجريبي' : 'متصل بقاعدة البيانات'}
          </span>
        </div>
      </div>

      {/* Add Medicine Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMedicine}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة دواء جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMedicine ? "تعديل الدواء" : "إضافة دواء جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الدواء *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="مثال: باراسيتامول 500mg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="وصف الدواء واستخداماته"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (درهم) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">المخزون *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">الجرعة</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => handleInputChange("dosage", e.target.value)}
                    placeholder="500mg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">الشركة المصنعة</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                    placeholder="اسم الشركة المصنعة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prescription">يتطلب وصفة طبية؟</Label>
                  <Select
                    value={formData.prescription}
                    onValueChange={(value) => handleInputChange("prescription", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">لا</SelectItem>
                      <SelectItem value="true">نعم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 ml-2" />
                  )}
                  {editingMedicine ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
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
            <SelectValue placeholder="اختر الفئة" />
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
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 ml-2" />
          بحث
        </Button>
      </div>

      {/* Medicines List */}
      <div className="grid gap-4">
        {medicines.map((medicine) => (
          <Card key={medicine._id || medicine.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  {medicine.name}
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  medicine.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {medicine.stock > 0 ? `متوفر (${medicine.stock})` : 'غير متوفر'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <p className="text-muted-foreground">{medicine.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">السعر: </span>
                    {medicine.price} درهم
                  </div>
                  <div>
                    <span className="font-semibold">الفئة: </span>
                    {medicine.category}
                  </div>
                  {medicine.manufacturer && (
                    <div>
                      <span className="font-semibold">الشركة المصنعة: </span>
                      {medicine.manufacturer}
                    </div>
                  )}
                  {medicine.dosage && (
                    <div>
                      <span className="font-semibold">الجرعة: </span>
                      {medicine.dosage}
                    </div>
                  )}
                </div>

                {medicine.prescription && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                    <span className="text-yellow-800 text-sm font-medium">
                      ⚠️ يتطلب وصفة طبية
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditMedicine(medicine)}
                  >
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteMedicine(medicine)}
                  >
                    <Trash2 className="h-3 w-3 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {medicines.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أدوية</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة الأدوية المتوفرة في صيدليتك
            </p>
            <Button onClick={handleAddMedicine}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول دواء
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicineManagement;
