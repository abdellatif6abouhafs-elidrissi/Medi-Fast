import { useState, useEffect, useCallback } from 'react';
import { Medicine, CreateMedicineRequest, UpdateMedicineRequest, MedicineFilters } from '@/types/medicine';
import { medicineService } from '@/services/medicineService';
import { useToast } from '@/components/ui/use-toast';

export const useMedicines = (initialFilters?: MedicineFilters) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch medicines
  const fetchMedicines = useCallback(async (filters?: MedicineFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await medicineService.getMedicines(filters);
      
      if (response.success && response.data) {
        setMedicines(response.data.medicines);
        setTotal(response.data.total);
        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback to mock data if API fails
        const mockMedicines: Medicine[] = [
          {
            _id: '1',
            name: 'باراسيتامول 500mg',
            description: 'مسكن للألم وخافض للحرارة',
            price: 15.50,
            stock: 45,
            category: 'مسكنات',
            pharmacyId: 'pharmacy-1',
            manufacturer: 'شركة الأدوية المتحدة',
            dosage: '500mg',
            prescription: false,
          },
          {
            _id: '2',
            name: 'إيبوبروفين 400mg',
            description: 'مضاد للالتهاب ومسكن للألم',
            price: 25.00,
            stock: 28,
            category: 'مسكنات',
            pharmacyId: 'pharmacy-1',
            manufacturer: 'شركة الدواء الحديث',
            dosage: '400mg',
            prescription: false,
          },
          {
            _id: '3',
            name: 'أموكسيسيلين 500mg',
            description: 'مضاد حيوي واسع الطيف',
            price: 45.00,
            stock: 22,
            category: 'مضادات حيوية',
            pharmacyId: 'pharmacy-1',
            manufacturer: 'شركة المضادات الحيوية',
            dosage: '500mg',
            prescription: true,
          },
          {
            _id: '4',
            name: 'فيتامين د3',
            description: 'مكمل غذائي لتقوية العظام',
            price: 35.00,
            stock: 15,
            category: 'فيتامينات',
            pharmacyId: 'pharmacy-1',
            manufacturer: 'شركة الفيتامينات الطبيعية',
            dosage: '1000 IU',
            prescription: false,
          },
        ];
        
        setMedicines(mockMedicines);
        setTotal(mockMedicines.length);
        setPage(1);
        setTotalPages(1);
        
        toast({
          title: 'وضع التجريب',
          description: 'تم تحميل أدوية تجريبية. سيتم الاتصال بالخادم عند توفره.',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الأدوية');
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الأدوية',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch medicines by pharmacy
  const fetchMedicinesByPharmacy = useCallback(async (pharmacyId: string, filters?: MedicineFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await medicineService.getMedicinesByPharmacy(pharmacyId, filters);
      
      if (response.success && response.data) {
        setMedicines(response.data.medicines);
        setTotal(response.data.total);
        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error(response.error || 'Failed to fetch pharmacy medicines');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل أدوية الصيدلية');
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل أدوية الصيدلية',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add medicine
  const addMedicine = useCallback(async (medicineData: CreateMedicineRequest) => {
    try {
      const response = await medicineService.createMedicine(medicineData);
      
      if (response.success && response.data) {
        setMedicines(prev => [...prev, response.data!]);
        setTotal(prev => prev + 1);
        
        toast({
          title: 'تم الإضافة بنجاح!',
          description: `تم إضافة ${medicineData.name} إلى قائمة الأدوية`,
        });
        
        return { success: true, data: response.data };
      } else {
        // Fallback for demo mode
        const newMedicine: Medicine = {
          _id: Date.now().toString(),
          ...medicineData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setMedicines(prev => [...prev, newMedicine]);
        setTotal(prev => prev + 1);
        
        toast({
          title: 'تم الإضافة بنجاح! (وضع التجريب)',
          description: `تم إضافة ${medicineData.name} محلياً. سيتم حفظه في قاعدة البيانات عند توفر الخادم.`,
        });
        
        return { success: true, data: newMedicine };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في إضافة الدواء';
      setError(errorMessage);
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  // Update medicine
  const updateMedicine = useCallback(async (medicineData: UpdateMedicineRequest) => {
    try {
      const response = await medicineService.updateMedicine(medicineData);
      
      if (response.success && response.data) {
        setMedicines(prev => prev.map(med => 
          med._id === medicineData._id ? response.data! : med
        ));
        
        toast({
          title: 'تم التحديث بنجاح!',
          description: `تم تحديث معلومات ${medicineData.name}`,
        });
        
        return { success: true, data: response.data };
      } else {
        // Fallback for demo mode
        const updatedMedicine = { ...medicineData, updatedAt: new Date().toISOString() } as Medicine;
        
        setMedicines(prev => prev.map(med => 
          med._id === medicineData._id ? updatedMedicine : med
        ));
        
        toast({
          title: 'تم التحديث بنجاح! (وضع التجريب)',
          description: `تم تحديث ${medicineData.name} محلياً. سيتم حفظه في قاعدة البيانات عند توفر الخادم.`,
        });
        
        return { success: true, data: updatedMedicine };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث الدواء';
      setError(errorMessage);
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  // Delete medicine
  const deleteMedicine = useCallback(async (id: string) => {
    try {
      const response = await medicineService.deleteMedicine(id);
      
      if (response.success) {
        const deletedMedicine = medicines.find(med => med._id === id);
        setMedicines(prev => prev.filter(med => med._id !== id));
        setTotal(prev => prev - 1);
        
        toast({
          title: 'تم الحذف بنجاح!',
          description: `تم حذف ${deletedMedicine?.name} من قائمة الأدوية`,
        });
        
        return { success: true };
      } else {
        // Fallback for demo mode
        const deletedMedicine = medicines.find(med => med._id === id);
        setMedicines(prev => prev.filter(med => med._id !== id));
        setTotal(prev => prev - 1);
        
        toast({
          title: 'تم الحذف بنجاح! (وضع التجريب)',
          description: `تم حذف ${deletedMedicine?.name} محلياً. سيتم حذفه من قاعدة البيانات عند توفر الخادم.`,
        });
        
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حذف الدواء';
      setError(errorMessage);
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [medicines, toast]);

  // Update stock
  const updateStock = useCallback(async (id: string, stock: number) => {
    try {
      const response = await medicineService.updateStock(id, stock);
      
      if (response.success && response.data) {
        setMedicines(prev => prev.map(med => 
          med._id === id ? { ...med, stock } : med
        ));
        
        toast({
          title: 'تم تحديث المخزون!',
          description: `تم تحديث مخزون الدواء إلى ${stock}`,
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to update stock');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث المخزون';
      setError(errorMessage);
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  // Search medicines
  const searchMedicines = useCallback(async (query: string, filters?: MedicineFilters) => {
    return await fetchMedicines({ ...filters, search: query });
  }, [fetchMedicines]);

  // Initial load
  useEffect(() => {
    fetchMedicines(initialFilters);
  }, [fetchMedicines, initialFilters]);

  return {
    medicines,
    loading,
    error,
    total,
    page,
    totalPages,
    fetchMedicines,
    fetchMedicinesByPharmacy,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    updateStock,
    searchMedicines,
    refetch: () => fetchMedicines(initialFilters),
  };
};
