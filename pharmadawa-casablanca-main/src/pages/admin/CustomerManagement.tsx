import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search } from "lucide-react";

// Mock data for customers
const mockCustomers = [
  { id: 'CUST001', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0611223344', totalOrders: 5, status: 'نشط' },
  { id: 'CUST002', name: 'فاطمة الزهراء', email: 'fatima@example.com', phone: '0655667788', totalOrders: 12, status: 'نشط' },
  { id: 'CUST003', name: 'يوسف العلوي', email: 'youssef@example.com', phone: '0699887766', totalOrders: 2, status: 'محظور' },
  { id: 'CUST004', name: 'سارة بناني', email: 'sara@example.com', phone: '0612345678', totalOrders: 8, status: 'نشط' },
  { id: 'CUST005', name: 'علي الكتاني', email: 'ali@example.com', phone: '0644332211', totalOrders: 1, status: 'نشط' },
];

const CustomerManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-2xl">إدارة العملاء</span>
            </CardTitle>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ابحث عن عميل..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المعرف</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>إجمالي الطلبات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${customer.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">عرض</Button>
                      <Button variant="destructive" size="sm">حظر</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
