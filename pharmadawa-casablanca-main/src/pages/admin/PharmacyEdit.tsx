import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Store, Save, Loader2 } from "lucide-react";

const PharmacyEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    workingHours: "",
    specialties: "",
    image: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // Load pharmacy data on component mount
  useEffect(() => {
    const loadPharmacyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // Get pharmacy ID from user.pharmacy field (ObjectId reference)
        const pharmacyId = user?.pharmacy || user?.pharmacyId;

        console.log("Loading pharmacy data for user:", user);
        console.log("Pharmacy ID:", pharmacyId);
        console.log("Token exists:", !!token);

        if (!token || !pharmacyId) {
          console.log("No token or pharmacy ID, using user profile data");
          const fallbackData = {
            name: user?.pharmacyName || `صيدلية ${user?.name}` || "",
            address: user?.pharmacyAddress || "",
            phone: user?.pharmacyPhone || user?.phone || "",
            workingHours: user?.pharmacyWorkingHours || "8:00 ص - 9:00 م",
            specialties: user?.pharmacySpecialties?.join(", ") || "",
            image: user?.pharmacyImage || "🏪",
          };
          console.log("Fallback form data:", fallbackData);
          setFormData(fallbackData);
          setLoading(false);
          return;
        }

        // Try to fetch from API
        try {
          const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log("API Response status:", response.status);
          
          if (response.ok) {
            const pharmacyData = await response.json();
            console.log("API pharmacy data:", pharmacyData);
            const apiFormData = {
              name: pharmacyData.name || "",
              address: pharmacyData.address || "",
              phone: pharmacyData.phone || "",
              workingHours: pharmacyData.workingHours || "8:00 ص - 9:00 م",
              specialties: Array.isArray(pharmacyData.specialties) 
                ? pharmacyData.specialties.join(", ") 
                : pharmacyData.specialties || "",
              image: pharmacyData.image || "🏪",
            };
            console.log("Setting form data from API:", apiFormData);
            setFormData(apiFormData);
          } else {
            console.log("API failed, using user profile data");
            // Fallback to user profile data
            const userFormData = {
              name: user?.pharmacyName || `صيدلية ${user?.name}` || "",
              address: user?.pharmacyAddress || "",
              phone: user?.pharmacyPhone || user?.phone || "",
              workingHours: user?.pharmacyWorkingHours || "8:00 ص - 9:00 م",
              specialties: user?.pharmacySpecialties?.join(", ") || "",
              image: user?.pharmacyImage || "🏪",
            };
            console.log("Setting form data from user profile:", userFormData);
            setFormData(userFormData);
          }
        } catch (apiError) {
          console.log("API not available, using user profile data");
          // Fallback to user profile data
          setFormData({
            name: user?.pharmacyName || `صيدلية ${user?.name}` || "",
            address: user?.pharmacyAddress || "",
            phone: user?.pharmacyPhone || user?.phone || "",
            workingHours: user?.pharmacyWorkingHours || "8:00 ص - 9:00 م",
            specialties: user?.pharmacySpecialties?.join(", ") || "",
            image: user?.pharmacyImage || "🏪",
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
      loadPharmacyData();
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
      const pharmacyId = user?.pharmacy || user?.pharmacyId;

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
      console.log("API Base:", API_BASE);

      // Try to update via API
      try {
        const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        console.log("API Response status:", response.status);
        const responseText = await response.text();
        console.log("API Response:", responseText);

        if (response.ok) {
          let updatedPharmacy;
          try {
            updatedPharmacy = JSON.parse(responseText);
          } catch (e) {
            console.log("Response is not JSON, treating as success");
          }
          
          // Update user context with new pharmacy data
          if (user) {
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
          }

          toast({
            title: "تم الحفظ بنجاح!",
            description: "تم تحديث معلومات الصيدلية",
          });
        } else {
          console.error("API update failed with status:", response.status, responseText);
          throw new Error(`API update failed: ${response.status}`);
        }
      } catch (apiError) {
        console.log("API Error:", apiError);
        console.log("Falling back to user profile update only");
        
        // Fallback: update user profile data
        if (user) {
          const updatedUser = {
            ...user,
            pharmacyName: updateData.name,
            pharmacyAddress: updateData.address,
            pharmacyPhone: updateData.phone,
            pharmacyWorkingHours: updateData.workingHours,
            pharmacySpecialties: updateData.specialties,
            pharmacyImage: updateData.image,
          };
          console.log("Updating user context (fallback):", updatedUser);
          updateUser(updatedUser);
        }

        toast({
          title: "تم الحفظ محلياً!",
          description: "تم تحديث معلومات الصيدلية في الملف الشخصي",
        });
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
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
