export interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: '4h' | '6h' | '8h' | '12h' | 'daily';
  criticality: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface AnalyzePrescriptionResponseDto {
  medications: ExtractedMedication[];
  doctorName?: string;
  patientName?: string;
}
