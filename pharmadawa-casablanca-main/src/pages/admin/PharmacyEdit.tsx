import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Store, Save } from "lucide-react";

const PharmacyEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Initialize with user data immediately - NO useEffect
  const getInitialData = () => {
    if (!user) {
      return {
        name: "صيدلية جديدة",
        address: "",
        phone: "",
        workingHours: "8:00 ص - 9:00 م",
        specialties: "أدوية عامة",
        image: "🏪",
      };
    }
    
    return {
      name: user.pharmacyName || (user.name ? `صيدلية ${user.name}` : "صيدلية جديدة"),
      address: user.pharmacyAddress || user.address || "",
      phone: user.pharmacyPhone || user.phone || "",
      workingHours: user.pharmacyWorkingHours || "8:00 ص - 9:00 م",
      specialties: user.pharmacySpecialties?.join(", ") || "أدوية عامة",
      image: user.pharmacyImage || "🏪",
    };
  };
  
  const [formData, setFormData] = useState(getInitialData());

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        workingHours: formData.workingHours.trim(),
        specialties: formData.specialties.split(",").map(s => s.trim()).filter(s => s),
        image: formData.image.trim() || "🏪",
      };

      console.log("Saving pharmacy data:", updateData);

      // Update user context directly - NO API CALLS
      if (user && updateUser) {
        const updatedUser = {
          ...user,
          pharmacyName: updateData.name,
          pharmacyAddress: updateData.address,
          pharmacyPhone: updateData.phone,
          pharmacyWorkingHours: updateData.workingHours,
          pharmacySpecialties: updateData.specialties,
          pharmacyImage: updateData.image,
        };
        
        console.log("Updating user context:", updatedUser);
        updateUser(updatedUser);

        // Simulate a short delay to show saving state
        await new Promise(resolve => setTimeout(resolve, 500));

        toast({
          title: "تم الحفظ بنجاح!",
          description: "تم تحديث معلومات الصيدلية",
        });
      } else {
        throw new Error("User context not available");
      }
    } catch (error) {
      console.error("Error saving pharmacy data:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ معلومات الصيدلية",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Remove loading screen completely - always show the form

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
        <div>
          <h1 className="text-2xl font-bold">تعديل معلومات الصيدلية</h1>
          <p className="text-muted-foreground">
            قم بتحديث معلومات صيدليتك
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            معلومات الصيدلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الصيدلية</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="أدخل اسم الصيدلية"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0522123456"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="أدخل عنوان الصيدلية"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">ساعات العمل</Label>
              <Input
                id="workingHours"
                value={formData.workingHours}
                onChange={(e) => handleInputChange("workingHours", e.target.value)}
                placeholder="8:00 ص - 9:00 م"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">التخصصات</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => handleInputChange("specialties", e.target.value)}
                placeholder="أدوية عامة, أدوية الأطفال, مستحضرات التجميل (افصل بفاصلة)"
              />
              <p className="text-xs text-muted-foreground">
                أدخل التخصصات مفصولة بفاصلة
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/dashboard")}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyEdit;
