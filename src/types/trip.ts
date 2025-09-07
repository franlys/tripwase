// src/types/trip.ts - Tipos unificados

export interface SimplePlan {
  id: number;
  name: string;
  tier: string;
  type: string;
  description: string;
  duration: string;
  totalCost: number;
  currency: string;
  highlights: string[];
  transportation: string;
  accommodation: string;
  activities?: string[];
  meals?: string[];
}

export interface PlanInput {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  interests: string[];
}
