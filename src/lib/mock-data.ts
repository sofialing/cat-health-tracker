import type {
  Cat,
  WeightLog,
  NutritionLog,
  Incident,
  MedicalRecord,
} from "@/types";

export const mockCats: Cat[] = [
  {
    id: "cat-1",
    userId: "user-1",
    name: "Luna",
    birthday: "2020-03-15",
    initialWeight: 3.2,
    weightUnit: "kg",
    profilePicture: "https://placecats.com/200/200",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    userId: "user-1",
    name: "Mochi",
    birthday: "2021-08-22",
    initialWeight: 4.1,
    weightUnit: "kg",
    profilePicture: "https://placecats.com/201/200",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const mockWeightLogs: Record<string, WeightLog[]> = {
  "cat-1": [
    {
      id: "w1",
      catId: "cat-1",
      weight: 3.2,
      unit: "kg",
      date: "2024-01-10",
      notes: "Initial weight",
      createdAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "w2",
      catId: "cat-1",
      weight: 3.4,
      unit: "kg",
      date: "2024-02-10",
      createdAt: "2024-02-10T00:00:00Z",
    },
    {
      id: "w3",
      catId: "cat-1",
      weight: 3.5,
      unit: "kg",
      date: "2024-03-10",
      createdAt: "2024-03-10T00:00:00Z",
    },
    {
      id: "w4",
      catId: "cat-1",
      weight: 3.6,
      unit: "kg",
      date: "2024-04-10",
      createdAt: "2024-04-10T00:00:00Z",
    },
    {
      id: "w5",
      catId: "cat-1",
      weight: 3.55,
      unit: "kg",
      date: "2024-05-10",
      notes: "Slight drop after illness",
      createdAt: "2024-05-10T00:00:00Z",
    },
    {
      id: "w6",
      catId: "cat-1",
      weight: 3.7,
      unit: "kg",
      date: "2024-06-10",
      createdAt: "2024-06-10T00:00:00Z",
    },
  ],
  "cat-2": [
    {
      id: "w7",
      catId: "cat-2",
      weight: 4.1,
      unit: "kg",
      date: "2024-01-15",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "w8",
      catId: "cat-2",
      weight: 4.3,
      unit: "kg",
      date: "2024-03-15",
      createdAt: "2024-03-15T00:00:00Z",
    },
    {
      id: "w9",
      catId: "cat-2",
      weight: 4.2,
      unit: "kg",
      date: "2024-06-15",
      createdAt: "2024-06-15T00:00:00Z",
    },
  ],
};

export const mockNutritionLogs: Record<string, NutritionLog[]> = {
  "cat-1": [
    {
      id: "n1",
      catId: "cat-1",
      foodType: "wet",
      brand: "Sheba",
      dailyAmount: 80,
      frequency: "2x daily",
      notes: "Loves the chicken flavour",
      date: "2024-06-01",
      createdAt: "2024-06-01T00:00:00Z",
    },
    {
      id: "n2",
      catId: "cat-1",
      foodType: "dry",
      brand: "Royal Canin",
      dailyAmount: 30,
      frequency: "Free feed",
      date: "2024-05-01",
      createdAt: "2024-05-01T00:00:00Z",
    },
  ],
  "cat-2": [
    {
      id: "n3",
      catId: "cat-2",
      foodType: "mixed",
      brand: "Whiskas",
      dailyAmount: 100,
      frequency: "3x daily",
      date: "2024-06-01",
      createdAt: "2024-06-01T00:00:00Z",
    },
  ],
};

export const mockIncidents: Record<string, Incident[]> = {
  "cat-1": [
    {
      id: "i1",
      catId: "cat-1",
      type: "vomiting",
      description: "Vomited twice after eating too fast",
      severity: "low",
      date: "2024-05-20",
      createdAt: "2024-05-20T00:00:00Z",
    },
    {
      id: "i2",
      catId: "cat-1",
      type: "illness",
      description: "Upper respiratory infection, sneezing",
      severity: "medium",
      date: "2024-04-05",
      createdAt: "2024-04-05T00:00:00Z",
    },
  ],
  "cat-2": [
    {
      id: "i3",
      catId: "cat-2",
      type: "symptom",
      description: "Scratching ears frequently",
      severity: "low",
      date: "2024-06-10",
      createdAt: "2024-06-10T00:00:00Z",
    },
  ],
};

export const mockMedicalRecords: Record<string, MedicalRecord[]> = {
  "cat-1": [
    {
      id: "m1",
      catId: "cat-1",
      type: "vaccination",
      vetName: "Dr. Patel",
      clinic: "City Vet Clinic",
      notes: "Annual FVRCP booster",
      date: "2024-01-20",
      nextDueDate: "2025-01-20",
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "m2",
      catId: "cat-1",
      type: "vet_visit",
      vetName: "Dr. Patel",
      clinic: "City Vet Clinic",
      notes: "Annual check-up, all good",
      date: "2024-01-20",
      createdAt: "2024-01-20T00:00:00Z",
    },
  ],
  "cat-2": [
    {
      id: "m3",
      catId: "cat-2",
      type: "vaccination",
      vetName: "Dr. Kim",
      clinic: "Happy Paws Vet",
      notes: "Rabies vaccine",
      date: "2023-08-22",
      nextDueDate: "2026-08-22",
      createdAt: "2023-08-22T00:00:00Z",
    },
    {
      id: "m4",
      catId: "cat-2",
      type: "vet_visit",
      vetName: "Dr. Kim",
      clinic: "Happy Paws Vet",
      notes: "Ear check, mild infection treated",
      date: "2024-06-12",
      createdAt: "2024-06-12T00:00:00Z",
    },
  ],
};
