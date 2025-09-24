import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">اسم الموقع</Label>
            <Input id="siteName" defaultValue="صيدلية الدار البيضاء" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
            <Input id="supportEmail" type="email" defaultValue="support@pharmadawa.ma" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
            <Switch id="maintenanceMode" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الدفع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">مفتاح API لبوابة الدفع</Label>
            <Input id="apiKey" type="password" defaultValue="************" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cashOnDelivery">الدفع عند الاستلام</Label>
            <Switch id="cashOnDelivery" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>حفظ الإعدادات</Button>
      </div>
    </div>
  );
};

export default Settings;
