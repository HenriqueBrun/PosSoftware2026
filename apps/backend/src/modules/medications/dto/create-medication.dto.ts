export class CreateMedicationDto {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string; // ISO date string
  endDate?: string;
  criticality: string;
  notifyApp?: boolean;
  notifySms?: boolean;
  notifyWa?: boolean;
  notifyEmail?: boolean;
}
