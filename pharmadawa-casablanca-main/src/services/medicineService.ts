import { 
  Medicine, 
  CreateMedicineRequest, 
  UpdateMedicineRequest, 
  MedicineFilters, 
  MedicineResponse,
  ApiResponse 
} from '@/types/medicine';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class MedicineService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Get all medicines with optional filters
  async getMedicines(filters?: MedicineFilters): Promise<ApiResponse<MedicineResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE}/api/medicines${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching medicines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch medicines'
      };
    }
  }

  // Get medicines by pharmacy ID
  async getMedicinesByPharmacy(pharmacyId: string, filters?: MedicineFilters): Promise<ApiResponse<MedicineResponse>> {
    try {
      const queryParams = new URLSearchParams({ pharmacyId });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE}/api/medicines/pharmacy?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching pharmacy medicines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pharmacy medicines'
      };
    }
  }

  // Get single medicine by ID
  async getMedicineById(id: string): Promise<ApiResponse<Medicine>> {
    try {
      const response = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching medicine:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch medicine'
      };
    }
  }

  // Create new medicine
  async createMedicine(medicineData: CreateMedicineRequest): Promise<ApiResponse<Medicine>> {
    try {
      const response = await fetch(`${API_BASE}/api/medicines`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(medicineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Medicine created successfully'
      };
    } catch (error) {
      console.error('Error creating medicine:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create medicine'
      };
    }
  }

  // Update medicine
  async updateMedicine(medicineData: UpdateMedicineRequest): Promise<ApiResponse<Medicine>> {
    try {
      const { _id, ...updateData } = medicineData;
      
      const response = await fetch(`${API_BASE}/api/medicines/${_id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Medicine updated successfully'
      };
    } catch (error) {
      console.error('Error updating medicine:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update medicine'
      };
    }
  }

  // Delete medicine
  async deleteMedicine(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Medicine deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting medicine:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete medicine'
      };
    }
  }

  // Update medicine stock
  async updateStock(id: string, stock: number): Promise<ApiResponse<Medicine>> {
    try {
      const response = await fetch(`${API_BASE}/api/medicines/${id}/stock`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ stock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Stock updated successfully'
      };
    } catch (error) {
      console.error('Error updating stock:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stock'
      };
    }
  }

  // Search medicines
  async searchMedicines(query: string, filters?: MedicineFilters): Promise<ApiResponse<MedicineResponse>> {
    try {
      const searchFilters = { ...filters, search: query };
      return await this.getMedicines(searchFilters);
    } catch (error) {
      console.error('Error searching medicines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search medicines'
      };
    }
  }

  // Get medicine categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_BASE}/api/medicines/categories`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      };
    }
  }
}

export const medicineService = new MedicineService();
export default medicineService;
