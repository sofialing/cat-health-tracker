export interface Cat {
  id: string;
  userId: string;
  name: string;
  birthday: string; // ISO date string YYYY-MM-DD
  initialWeight: number;
  weightUnit: "kg" | "lbs";
  profilePicture?: string;
  createdAt: string;
}

export interface WeightLog {
  id: string;
  catId: string;
  weight: number;
  unit: "kg" | "lbs";
  date: string;
  notes?: string;
  createdAt: string;
}

export interface NutritionLog {
  id: string;
  catId: string;
  foodType: "dry" | "wet" | "raw" | "mixed";
  brand?: string;
  dailyAmount?: number;
  frequency?: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  catId: string;
  type: "vomiting" | "symptom" | "illness";
  description: string;
  severity: "low" | "medium" | "high";
  date: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  catId: string;
  type: "vet_visit" | "vaccination";
  title?: string;
  status?: "upcoming" | "completed" | "cancelled";
  vetName?: string;
  clinic?: string;
  notes?: string;
  date: string;
  nextDueDate?: string;
  createdAt: string;
}

export interface BreathingLog {
  id: string;
  catId: string;
  breathsPerMinute: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  catId: string;
  name: string;
  dose: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface CatAge {
  years: number;
  months: number;
  label: string;
}
