// Medicine model interfaces
export interface Medicine {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  pharmacyId: string;
  image?: string;
  manufacturer?: string;
  expiryDate?: string;
  dosage?: string;
  sideEffects?: string[];
  instructions?: string;
  prescription?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicineRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  pharmacyId: string;
  image?: string;
  manufacturer?: string;
  expiryDate?: string;
  dosage?: string;
  sideEffects?: string[];
  instructions?: string;
  prescription?: boolean;
}

export interface UpdateMedicineRequest extends Partial<CreateMedicineRequest> {
  _id: string;
}

export interface MedicineFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  pharmacyId?: string;
}

export interface MedicineResponse {
  medicines: Medicine[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
