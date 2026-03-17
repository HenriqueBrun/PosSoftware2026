export class UpdateMedicationDto {
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  criticality?: string;
  notifyApp?: boolean;
  notifySms?: boolean;
  notifyWa?: boolean;
  notifyEmail?: boolean;
}
