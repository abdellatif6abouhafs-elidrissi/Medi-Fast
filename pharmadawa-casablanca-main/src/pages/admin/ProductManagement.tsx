import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, PlusCircle, Search, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'متوفر' | 'نفذ';
}

const ProductManagement = () => {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    category: '', 
    stock: 0, 
    price: 0, 
    status: 'متوفر' 
  });
  const [products, setProducts] = useState<Product[]>([
    { id: 'PROD001', name: 'Doliprane 1000mg', category: 'Painkiller', stock: 150, price: 25.50, status: 'متوفر' },
    { id: 'PROD002', name: 'Vitamin C 500mg', category: 'Vitamins', stock: 80, price: 45.00, status: 'متوفر' },
    { id: 'PROD003', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 0, price: 65.20, status: 'نفذ' },
    { id: 'PROD004', name: 'Cough Syrup', category: 'Cold & Flu', stock: 120, price: 38.00, status: 'متوفر' },
    { id: 'PROD005', name: 'Aspirin 100mg', category: 'Painkiller', stock: 200, price: 15.00, status: 'متوفر' },
  ]);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setProducts(products.filter(product => product.id !== productId));
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المنتج بنجاح",
        variant: "default",
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    
    setIsEditModalOpen(false);
    toast({
      title: "تم التحديث بنجاح",
      description: "تم تحديث المنتج بنجاح",
      variant: "default",
    });
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: field === 'stock' || field === 'price' ? Number(value) : value
    });
  };

  const handleNewProductChange = (field: keyof Omit<Product, 'id'>, value: string | number) => {
    setNewProduct({
      ...newProduct,
      [field]: field === 'stock' || field === 'price' ? Number(value) : value
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم المنتج والفئة",
        variant: "destructive",
      });
      return;
    }

    const newId = `PROD${String(products.length + 1).padStart(3, '0')}`;
    const productToAdd: Product = {
      ...newProduct,
      id: newId,
    };

    setProducts([productToAdd, ...products]);
    
    // Reset the form
    setNewProduct({ 
      name: '', 
      category: '', 
      stock: 0, 
      price: 0, 
      status: 'متوفر' 
    });
    
    setIsAddModalOpen(false);
    
    toast({
      title: "تمت الإضافة بنجاح",
      description: "تمت إضافة المنتج الجديد بنجاح",
      variant: "default",
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="text-2xl">إدارة المنتجات</span>
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة منتج جديد
            </Button>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ابحث عن منتج..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المعرف</TableHead>
                <TableHead>اسم المنتج</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>السعر (درهم)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'متوفر' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(product)}
                        className="flex items-center gap-1"
                      >
                        <span>تعديل</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>حذف</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  اسم المنتج
                </Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  الفئة
                </Label>
                <Input
                  id="category"
                  value={editingProduct.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  الكمية المتوفرة
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  السعر (درهم)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  الحالة
                </Label>
                <Select
                  value={editingProduct.status}
                  onValueChange={(value: 'متوفر' | 'نفذ') => handleInputChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="متوفر">متوفر</SelectItem>
                    <SelectItem value="نفذ">نفذ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" onClick={handleSaveEdit}>
              <Save className="ml-2 h-4 w-4" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة منتج جديد</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                اسم المنتج *
              </Label>
              <Input
                id="new-name"
                value={newProduct.name}
                onChange={(e) => handleNewProductChange('name', e.target.value)}
                className="col-span-3"
                placeholder="أدخل اسم المنتج"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category" className="text-right">
                الفئة *
              </Label>
              <Input
                id="new-category"
                value={newProduct.category}
                onChange={(e) => handleNewProductChange('category', e.target.value)}
                className="col-span-3"
                placeholder="أدخل فئة المنتج"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock" className="text-right">
                الكمية المتوفرة
              </Label>
              <Input
                id="new-stock"
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) => handleNewProductChange('stock', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-price" className="text-right">
                السعر (درهم)
              </Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => handleNewProductChange('price', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-right">
                الحالة
              </Label>
              <Select
                value={newProduct.status}
                onValueChange={(value: 'متوفر' | 'نفذ') => handleNewProductChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="متوفر">متوفر</SelectItem>
                  <SelectItem value="نفذ">نفذ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" onClick={handleAddProduct}>
              <Save className="ml-2 h-4 w-4" />
              إضافة المنتج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
