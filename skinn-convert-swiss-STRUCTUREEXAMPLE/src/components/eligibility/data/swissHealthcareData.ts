import { SelectOption } from './types';

// Swiss Healthcare Data Constants
export const SWISS_INSURERS: SelectOption[] = [
  { value: "css", label: "CSS Versicherung" },
  { value: "helsana", label: "Helsana" },
  { value: "swica", label: "SWICA" },
  { value: "sanitas", label: "Sanitas" },
  { value: "groupe-mutuel", label: "Groupe Mutuel" },
  { value: "visana", label: "Visana" },
  { value: "concordia", label: "Concordia" },
  { value: "other", label: "Andere" }
];

export const getSymptomOptions = (t: any): SelectOption[] => [
  { value: 'palpitations', label: t.symptoms.palpitations },
  { value: 'dizziness', label: t.symptoms.dizziness },
  { value: 'chest-pain', label: t.symptoms.chestPain },
  { value: 'shortness', label: t.symptoms.shortness },
  { value: 'none', label: t.symptoms.none }
];

export const getRiskFactorOptions = (t: any): SelectOption[] => [
  { value: 'family-history', label: t.riskFactors.familyHistory },
  { value: 'hypertension', label: t.riskFactors.hypertension },
  { value: 'diabetes', label: t.riskFactors.diabetes },
  { value: 'age-over-50', label: t.riskFactors.ageOver50 },
  { value: 'none', label: t.riskFactors.none }
];

export const getInsuranceModelOptions = (t: any): SelectOption[] => [
  { value: 'standard', label: t.insuranceModels.standard },
  { value: 'gp-model', label: t.insuranceModels.gpModel },
  { value: 'hmo', label: t.insuranceModels.hmo },
  { value: 'telmed', label: t.insuranceModels.telmed },
  { value: 'unsure', label: t.insuranceModels.unsure }
];