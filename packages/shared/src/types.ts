export type UserRole = 'admin' | 'veterinarian' | 'technician' | 'receptionist';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_exam'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type AppointmentType =
  | 'consultation'
  | 'vaccination'
  | 'surgery'
  | 'emergency'
  | 'grooming'
  | 'boarding'
  | 'follow_up'
  | 'other';

export type Species = 'dog' | 'cat' | 'rabbit' | 'bird' | 'reptile' | 'other';
export type Gender = 'male' | 'female';
export type ProductType = 'medication' | 'supply' | 'food' | 'service';

export type ToothStatus =
  | 'healthy'
  | 'fractured'
  | 'missing'
  | 'worn'
  | 'calculus'
  | 'gingivitis'
  | 'mobility'
  | 'retained_deciduous'
  | 'root_remnant'
  | 'caries'
  | 'pulp_exposure'
  | 'other';

export interface ToothCondition {
  toothNumber: number;
  status: ToothStatus;
  notes?: string;
}

export interface DentalRecordData {
  id?: number;
  patientId: number;
  teeth: ToothCondition[];
  notes?: string;
}
