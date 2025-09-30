import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    workingHours: "",
    specialties: "",
    image: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // Fetch pharmacy data from backend
  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const pharmacyId = user?.pharmacy || user?.pharmacyId || user?.id;

        if (!token || !pharmacyId) {
          // Use user profile data as fallback
          setFormData({
            name: user?.pharmacyName || (user?.name ? `صيدلية ${user.name}` : "صيدلية جديدة"),
            address: user?.pharmacyAddress || user?.address || "",
            phone: user?.pharmacyPhone || user?.phone || "",
            workingHours: user?.pharmacyWorkingHours || "8:00 ص - 9:00 م",
            specialties: user?.pharmacySpecialties?.join(", ") || "أدوية عامة",
            image: user?.pharmacyImage || "🏪",
          });
          setLoading(false);
          return;
        }

        // Fetch from backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
          const response = await fetch(`${API_BASE}/api/pharmacies/${pharmacyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const pharmacyData = await response.json();
            setFormData({
              name: pharmacyData.name || "",
              address: pharmacyData.address || "",
              phone: pharmacyData.phone || "",
              workingHours: pharmacyData.workingHours || "8:00 ص - 9:00 م",
              specialties: Array.isArray(pharmacyData.specialties)
                ? pharmacyData.specialties.join(", ")
                : pharmacyData.specialties || "",
              image: pharmacyData.image || "🏪",
            });
            toast({
              title: "تم تحميل البيانات",
              description: "تم تحميل بيانات الصيدلية من قاعدة البيانات",
            });
          } else {
            throw new Error("Failed to fetch pharmacy data");
          }
        } catch (fetchError: any) {
          console.log("Using user profile data as fallback:", fetchError.message);
          // Fallback to user profile data
          setFormData({
            name: user?.pharmacyName || (user?.name ? `صيدلية ${user.name}` : "صيدلية جديدة"),
            address: user?.pharmacyAddress || user?.address || "",
            phone: user?.pharmacyPhone || user?.phone || "",
            workingHours: user?.pharmacyWorkingHours || "8:00 ص - 9:00 م",
            specialties: user?.pharmacySpecialties?.join(", ") || "أدوية عامة",
            image: user?.pharmacyImage || "🏪",
          });
          toast({
            title: "تحميل البيانات المحلية",
            description: "تم استخدام البيانات المحلية من الملف الشخصي",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error loading pharmacy data:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات الصيدلية",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPharmacyData();
    } else {
      setLoading(false);
    }
  }, [user, API_BASE, toast]);

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
      const token = localStorage.getItem("token");
      const pharmacyId = user?.pharmacy || user?.pharmacyId || user?.id;

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
      console.log("Pharmacy ID:", pharmacyId);

      if (!token || !pharmacyId) {
        throw new Error("Missing authentication token or pharmacy ID");
      }

      // Update backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      try {
        const response = await fetch(`${API_BASE}/api/pharmacies/${pharmacyId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const updatedPharmacy = await response.json();
          console.log("Pharmacy updated successfully:", updatedPharmacy);

          // Update user context with new pharmacy data
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
            updateUser(updatedUser);
          }

          toast({
            title: "تم الحفظ بنجاح!",
            description: "تم تحديث معلومات الصيدلية في قاعدة البيانات",
          });

          // Navigate back to dashboard
          setTimeout(() => navigate("/admin/dashboard"), 1000);
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update pharmacy");
        }
      } catch (fetchError: any) {
        console.error("API Error:", fetchError);
        
        // Fallback: update user context only
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
          updateUser(updatedUser);
        }

        toast({
          title: "تم الحفظ محلياً",
          description: "تم تحديث معلومات الصيدلية محلياً (لم يتم الاتصال بقاعدة البيانات)",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error saving pharmacy data:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ معلومات الصيدلية",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل بيانات الصيدلية...</p>
          </div>
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
