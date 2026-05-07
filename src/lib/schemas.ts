import { z } from "zod";

// Lab result schemas
const labResultValue = z.object({
  value: z.number().or(z.string()),
  date: z.string(),
  unit: z.string().optional(),
  reference: z.string().optional(),
});

const fileAttachment = z.object({
  name: z.string(),
  url: z.string(),
  type: z.enum(["application/pdf", "image/png", "image/jpeg"]),
  uploadedAt: z.string(),
});

const postTxSerologiesSchema = z.object({
  antiHcv: z.boolean().optional(),
  cmvIgg: z.boolean().optional(),
  antiHbs: z.boolean().optional(),
  antiHbcTotal: z.boolean().optional(),
  antiHbe: z.boolean().optional(),
  toxoplasmose: z.boolean().optional(),
  chagas: z.boolean().optional(),
  pcrVhc: z.boolean().optional(),
  hiv: z.boolean().optional(),
});

const postTxSerologyExamSchema = z.object({
  examDate: z.string(),
  hbsag: z.string().optional(),
  antiHbs: z.string().optional(),
  hbeag: z.string().optional(),
  antiHbe: z.string().optional(),
  antiHbcTotal: z.string().optional(),
  hbvDna: z.string().optional(),
  antiHcv: z.string().optional(),
  hcvRna: z.string().optional(),
  antiHavIgm: z.string().optional(),
  antiHavTotal: z.string().optional(),
  antiDelta: z.string().optional(),
  hdvRna: z.string().optional(),
  genotype: z.string().optional(),
});

const abdominalUsgSchema = z.object({
  date: z.string(),
  afb: z.string(),
  usgAbdominal: z.string(),
});

const liverBiopsySchema = z.object({
  number: z.string(),
  date: z.string(),
  report: z.string(),
});

const upperEndoscopySchema = z.object({
  date: z.string(),
  findings: z.string(),
});

const otherExamSchema = z.object({
  date: z.string(),
  examType: z.string(),
  result: z.string(),
});

const clinicalEvolutionSchema = z.object({
  date: z.string(),
  evolution: z.string(),
  clinic: z.string().optional(),
  ambulatory: z.string().optional(),
  ward: z.string().optional(),
  bed: z.string().optional(),
});

const postTxLabExamsSchema = z.object({
  date: z.string(),
  tgo: z.number().optional(),
  tgp: z.number().optional(),
  bt: z.number().optional(),
  bd: z.number().optional(),
  bi: z.number().optional(),
  fa: z.number().optional(),
  ggt: z.number().optional(),
  ap: z.number().optional(),
  pt: z.number().optional(),
  albumin: z.number().optional(),
  alpha1: z.number().optional(),
  beta: z.number().optional(),
  gamma: z.number().optional(),
  hbHt: z.string().optional(),
  reticulocytes: z.number().optional(),
  leukocytes: z.number().optional(),
  neutrophils: z.number().optional(),
  differential: z.string().optional(),
  platelets: z.number().optional(),
  glucose: z.number().optional(),
  urea: z.number().optional(),
  creatinine: z.number().optional(),
  cholesterol: z.number().optional(),
  hdlLdl: z.string().optional(),
  triglycerides: z.number().optional(),
  transferrinSat: z.number().optional(),
  ferritin: z.number().optional(),
  iron: z.number().optional(),
  t3t4: z.string().optional(),
  tsh: z.number().optional(),
  antiMl: z.string().optional(),
  antiLkm: z.string().optional(),
  antiMitochondrial: z.string().optional(),
  urineI: z.string().optional(),
});

const hemogramaSchema = z.object({
  hb: z.array(labResultValue),
  ht: z.array(labResultValue),
  vcm: z.array(labResultValue),
  chcm: z.array(labResultValue),
  leucocitos: z.array(labResultValue),
  segmentados: z.array(labResultValue),
  plaquetas: z.array(labResultValue),
});

const coagulogramaSchema = z.object({
  tap: z.array(labResultValue),
  inr: z.array(labResultValue),
  ttpa: z.array(labResultValue),
  fibrinogenio: z.array(labResultValue),
});

const sorologiasSchema = z.object({
  hbsag: z.array(labResultValue),
  antiHbcTotal: z.array(labResultValue),
  antiHbs: z.array(labResultValue),
  hbeag: z.array(labResultValue),
  antiHbe: z.array(labResultValue),
  hbvDna: z.array(labResultValue),
  antiHcv: z.array(labResultValue),
  genotipoHcvRna: z.array(labResultValue),
  antiHavIgm: z.array(labResultValue),
  antiHavIgg: z.array(labResultValue),
  antiHiv: z.array(labResultValue),
  antiHtlv: z.array(labResultValue),
  cmvIgg: z.array(labResultValue),
  cmvIgm: z.array(labResultValue),
  vdrl: z.array(labResultValue),
  herpesIgm: z.array(labResultValue),
  herpesIgg: z.array(labResultValue),
  rubelaIgg: z.array(labResultValue),
  toxoIgm: z.array(labResultValue),
  toxoIgg: z.array(labResultValue),
  chagas: z.array(labResultValue),
  alfa1Antitripsina: z.array(labResultValue),
  ama: z.array(labResultValue),
  aml: z.array(labResultValue),
  fan: z.array(labResultValue),
  ceruloplasmina: z.array(labResultValue),
  ppd: z.array(labResultValue),
});

const bioquimicaSchema = z.object({
  aboRh: z.array(labResultValue),
  glicemia: z.array(labResultValue),
  hba1c: z.array(labResultValue),
  ureia: z.array(labResultValue),
  creatinina: z.array(labResultValue),
  clearence: z.array(labResultValue),
  sodio: z.array(labResultValue),
  potassio: z.array(labResultValue),
  calcio: z.array(labResultValue),
  fosforo: z.array(labResultValue),
  magnesio: z.array(labResultValue),
  ast: z.array(labResultValue),
  alt: z.array(labResultValue),
  fa: z.array(labResultValue),
  gamaGt: z.array(labResultValue),
  bt: z.array(labResultValue),
  bd: z.array(labResultValue),
  bi: z.array(labResultValue),
  albumina: z.array(labResultValue),
  protTotal: z.array(labResultValue),
  ferro: z.array(labResultValue),
  ferritina: z.array(labResultValue),
  satTransf: z.array(labResultValue),
  colesterol: z.array(labResultValue),
  hdl: z.array(labResultValue),
  triglicerideos: z.array(labResultValue),
  tsh: z.array(labResultValue),
  t4: z.array(labResultValue),
  pcr: z.array(labResultValue),
  alfaFetoproteina: z.array(labResultValue),
  psa: z.array(labResultValue),
});

const tacrolimusSchema = z.object({
  nivel: z.array(labResultValue),
  dose: z.array(labResultValue),
});

const everolimusSchema = z.object({
  nivel: z.array(labResultValue),
  dose: z.array(labResultValue),
});

const urinaSchema = z.object({
  eas: z.array(labResultValue),
  urocultura: z.array(labResultValue),
  sodioUrinario: z.array(labResultValue),
});

const outrosExamesSchema = z.object({
  ecg: z.array(labResultValue),
  ecocardiograma: z.array(labResultValue),
  cintilografiaMiocardica: z.array(labResultValue),
  cateterismo: z.array(labResultValue),
  gasometriaArterial: z.array(labResultValue),
  rxTorax: z.array(labResultValue),
  espirometria: z.array(labResultValue),
  eda: z.array(labResultValue),
  usAbdome: z.array(labResultValue),
  tcAbdome: z.array(labResultValue),
  rmAbdome: z.array(labResultValue),
});

const labResultsSchema = z.object({
  hemograma: hemogramaSchema,
  coagulograma: coagulogramaSchema,
  sorologias: sorologiasSchema,
  bioquimica: bioquimicaSchema,
  tacrolimus: tacrolimusSchema,
  everolimus: everolimusSchema,
  urina: urinaSchema,
  outrosExames: outrosExamesSchema,
});

const donorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do doador é obrigatório"),
  age: z.number().min(0).max(150),
  gender: z.enum(["M", "F"]),
  weight: z.number().min(0),
  height: z.number().min(0),
  hepaticSteatosis: z.enum(["ausente", "leve", "moderada", "grave"]),
  activeInfections: z.boolean(),
  bloodType: z.string().optional(),
});

const receptorClinicalDataSchema = z.object({
  renalDiseaseCreatinine: z.number().min(0).optional(),
  collateralCirculation: z.boolean().optional(),
  hepatocellularCarcinoma: z.boolean().optional(),
});

const riskAnalysisSchema = z.object({
  riskLevel: z.enum(["critical", "moderate", "favorable"]),
  riskScore: z.number().min(0).max(100),
  criticalFactors: z.array(z.string()),
  warningFactors: z.array(z.string()),
  analysisDate: z.string(),
  notes: z.string().optional(),
});

export const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["M", "F"]),
  recordNumber: z.string().min(1, "Número do prontuário é obrigatório"),
  motherName: z.string().min(1, "Nome da mãe é obrigatório"),
  consultationDate: z.string(),
  cpf: z.string().min(11, "CPF inválido").max(14),
  rg: z.string(),
  cnes: z.string(),
  status: z.enum(["critical", "stable", "scheduled"]).optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  organ: z.enum(["Heart", "Kidney", "Liver"]).optional(),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  zipCode: z.string(),
  age: z.number().min(0),
  maritalStatus: z.string(),
  phone: z.string(),
  birthPlace: z.string(),
  weight: z.number().min(0),
  height: z.number().min(0),
  profession: z.string(),
  race: z.string(),
  bloodType: z.string(),
  doctor: z.string(),
  meldNa: z.number().min(0),
  txRegistration: z.string(),
  rgct: z.string(),
  currentDiseaseHistory: z.string(),
  liverDiseaseEtiology: z.string(),
  previousComorbidities: z.string(),
  medications: z.string(),
  surgicalHistory: z.string(),
  familyHistory: z.string(),
  smoking: z.object({
    status: z.enum(["no", "yes", "former"]),
    packsPerDay: z.number().optional(),
    yearsSmoked: z.number().optional(),
    yearsStopped: z.number().optional(),
  }),
  alcohol: z.object({
    status: z.enum(["no", "yes", "former"]),
    beverageType: z.string().optional(),
    quantity: z.string().optional(),
    yearsConsuming: z.number().optional(),
    yearsStopped: z.number().optional(),
  }),
  illicitDrugs: z.string(),
  ectoscopy: z.string(),
  chest: z.object({
    examination: z.string(),
    heartRate: z.number(),
    bloodPressure: z.string(),
    respiratoryRate: z.number(),
  }),
  abdomen: z.object({
    inspection: z.string(),
    palpation: z.string(),
    percussion: z.string(),
    auscultation: z.string(),
  }),
  conduct: z.string(),
  physicalExamFiles: z.array(fileAttachment).optional(),
  otherExamFiles: z.array(fileAttachment).optional(),
  identificationPhoto: fileAttachment.optional(),
  abdomenPhoto: fileAttachment.optional(),
  vaccines: z.object({
    pneumo: z.boolean(),
    influenza: z.boolean(),
    hepatitisB: z.boolean(),
    hepatitisA: z.boolean(),
    dt: z.boolean(),
  }),
  assessment: z.object({
    nursing: z.string(),
    socialService: z.string(),
    psychology: z.string(),
    dentistry: z.string(),
    cardiology: z.string(),
    anesthesiology: z.string(),
    surgery: z.string(),
  }),
  labResults: labResultsSchema.optional(),
  postTx: z.object({
    serologies: postTxSerologiesSchema,
    serologyExams: z.array(postTxSerologyExamSchema),
    abdominalUsgs: z.array(abdominalUsgSchema),
    liverBiopsies: z.array(liverBiopsySchema),
    upperEndoscopies: z.array(upperEndoscopySchema),
    otherExams: z.array(otherExamSchema),
    labExams: z.array(postTxLabExamsSchema),
    clinicalEvolution: z.array(clinicalEvolutionSchema),
    labResults: labResultsSchema.optional(),
    recordNumber: z.string().optional(),
    clinic: z.string().optional(),
    ambulatory: z.string().optional(),
    ward: z.string().optional(),
    bed: z.string().optional(),
  }).optional(),
  clinicalData: receptorClinicalDataSchema.optional(),
  matchedDonor: donorSchema.optional(),
  riskAnalysis: riskAnalysisSchema.optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
export type LabResults = z.infer<typeof labResultsSchema>;
export type LabResultValue = z.infer<typeof labResultValue>;
export type FileAttachment = z.infer<typeof fileAttachment>;
export type PostTxSerologies = z.infer<typeof postTxSerologiesSchema>;
export type PostTxSerologyExam = z.infer<typeof postTxSerologyExamSchema>;
export type AbdominalUsg = z.infer<typeof abdominalUsgSchema>;
export type LiverBiopsy = z.infer<typeof liverBiopsySchema>;
export type UpperEndoscopy = z.infer<typeof upperEndoscopySchema>;
export type OtherExam = z.infer<typeof otherExamSchema>;
export type PostTxLabExam = z.infer<typeof postTxLabExamsSchema>;
export type ClinicalEvolution = z.infer<typeof clinicalEvolutionSchema>;
export type DonorData = z.infer<typeof donorSchema>;
export type ReceptorClinicalData = z.infer<typeof receptorClinicalDataSchema>;
export type RiskAnalysis = z.infer<typeof riskAnalysisSchema>;
