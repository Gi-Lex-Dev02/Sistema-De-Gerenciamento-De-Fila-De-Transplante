import React, { createContext, useContext, useState } from 'react';
import type { PatientFormData } from '@/lib/schemas';

// Initial mock data
const initialPatients: Record<string, PatientFormData> = {
  "1": {
    name: "João Silva",
    status: "critical",
    priority: "high",
    organ: "Liver",
    age: 52,
    bloodType: "O+",
    meldNa: 28,
    liverDiseaseEtiology: "Cirrose hepática por hepatite C + CHC",
    birthDate: "1972-05-15",
    gender: "M",
    recordNumber: "123456",
    motherName: "Maria Silva",
    consultationDate: "2024-03-10",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    cnes: "1234567",
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    zipCode: "01234-567",
    maritalStatus: "Casado",
    phone: "(11) 98765-4321",
    birthPlace: "São Paulo",
    weight: 82.5,
    height: 175,
    profession: "Comerciante",
    race: "Branco",
    doctor: "Dra. Ana Santos",
    txRegistration: "TX123456",
    rgct: "RGCT123",
    currentDiseaseHistory: "Paciente com diagnóstico de cirrose hepática por HCV há 8 anos, Child C, com desenvolvimento recente de CHC.",
    previousComorbidities: "Hipertensão arterial, Diabetes mellitus tipo 2",
    medications: "Propranolol 40mg 2x/dia, Espironolactona 100mg/dia, Furosemida 40mg/dia",
    surgicalHistory: "Colecistectomia em 2015",
    familyHistory: "Pai falecido por câncer de fígado, mãe hipertensa",
    smoking: { status: "former", packsPerDay: 1, yearsSmoked: 20, yearsStopped: 5 },
    alcohol: { status: "former", beverageType: "Destilados", quantity: "1 garrafa/dia", yearsConsuming: 15, yearsStopped: 8 },
    illicitDrugs: "Nega uso",
    ectoscopy: "Paciente emagrecido, ictérico ++/4+, com asterixis",
    chest: { examination: "Murmúrio vesicular presente bilateralmente", heartRate: 82, bloodPressure: "110/70", respiratoryRate: 18 },
    abdomen: { inspection: "Abdome globoso, distendido", palpation: "Fígado palpável a 4cm do RCD", percussion: "Macicez móvel presente", auscultation: "RHA presentes, diminuídos" },
    conduct: "1. Manter medicações\n2. Paracentese de alívio",
    vaccines: { pneumo: true, influenza: true, hepatitisB: true, hepatitisA: true, dt: true },
    assessment: { nursing: "Paciente orientado, dependente para algumas AVDs", socialService: "Mora com esposa e filho", psychology: "Apresenta sintomas depressivos leves", dentistry: "Necessita tratamento periodontal", cardiology: "Risco cardiovascular intermediário", anesthesiology: "ASA III", surgery: "Candidato ao transplante" },
    labResults: {
      hemograma: {
        hb: [{ value: 10.2, date: "2024-03-01", unit: "g/dL", reference: "12-16" }],
        ht: [{ value: 31, date: "2024-03-01", unit: "%", reference: "36-46" }],
        vcm: [{ value: 88, date: "2024-03-01", unit: "fL", reference: "80-100" }],
        chcm: [{ value: 33, date: "2024-03-01", unit: "%", reference: "32-36" }],
        leucocitos: [{ value: 3800, date: "2024-03-01", unit: "/mm³", reference: "4000-10000" }],
        segmentados: [{ value: 65, date: "2024-03-01", unit: "%", reference: "45-75" }],
        plaquetas: [{ value: 65000, date: "2024-03-01", unit: "/mm³", reference: "150000-450000" }]
      },
      coagulograma: {
        tap: [{ value: 45, date: "2024-03-01", unit: "%", reference: "70-100" }],
        inr: [{ value: 1.8, date: "2024-03-01", unit: "", reference: "0.8-1.2" }],
        ttpa: [{ value: 35, date: "2024-03-01", unit: "seg", reference: "25-35" }],
        fibrinogenio: [{ value: 180, date: "2024-03-01", unit: "mg/dL", reference: "200-400" }]
      },
      sorologias: {
        antiHcv: [{ value: "Reagente", date: "2024-01-15", reference: "Não reagente" }],
        hbsag: [{ value: "Não reagente", date: "2024-01-15", reference: "Não reagente" }],
        antiHiv: [{ value: "Não reagente", date: "2024-01-15", reference: "Não reagente" }],
        antiHbcTotal: [{ value: "Reagente", date: "2024-01-15", reference: "Não reagente" }],
        antiHbs: [{ value: "Não reagente", date: "2024-01-15" }],
        hbeag: [{ value: "Não reagente", date: "2024-01-15" }],
        antiHbe: [{ value: "Reagente", date: "2024-01-15" }],
        hbvDna: [{ value: "Não detectado", date: "2024-01-15" }],
        genotipoHcvRna: [{ value: "Genótipo 1a", date: "2024-01-15" }],
        antiHavIgm: [{ value: "Não reagente", date: "2024-01-15" }],
        antiHavIgg: [{ value: "Reagente", date: "2024-01-15" }],
        antiHtlv: [{ value: "Não reagente", date: "2024-01-15" }],
        cmvIgg: [{ value: "Reagente", date: "2024-01-15" }],
        cmvIgm: [{ value: "Não reagente", date: "2024-01-15" }],
        vdrl: [{ value: "Não reagente", date: "2024-01-15" }],
        herpesIgm: [{ value: "Não reagente", date: "2024-01-15" }],
        herpesIgg: [{ value: "Reagente", date: "2024-01-15" }],
        rubelaIgg: [{ value: "Reagente", date: "2024-01-15" }],
        toxoIgm: [{ value: "Não reagente", date: "2024-01-15" }],
        toxoIgg: [{ value: "Reagente", date: "2024-01-15" }],
        chagas: [{ value: "Não reagente", date: "2024-01-15" }],
        alfa1Antitripsina: [{ value: "Normal", date: "2024-01-15" }],
        ama: [{ value: "Não reagente", date: "2024-01-15" }],
        aml: [{ value: "Não reagente", date: "2024-01-15" }],
        fan: [{ value: "Não reagente", date: "2024-01-15" }],
        ceruloplasmina: [{ value: "Normal", date: "2024-01-15" }],
        ppd: [{ value: "Não reator", date: "2024-01-15" }]
      },
      bioquimica: {
        ast: [{ value: 120, date: "2024-03-01", unit: "U/L", reference: "até 40" }],
        alt: [{ value: 85, date: "2024-03-01", unit: "U/L", reference: "até 41" }],
        fa: [{ value: 180, date: "2024-03-01", unit: "U/L", reference: "65-300" }],
        gamaGt: [{ value: 120, date: "2024-03-01", unit: "U/L", reference: "15-73" }],
        bt: [{ value: 3.8, date: "2024-03-01", unit: "mg/dL", reference: "até 1.2" }],
        bd: [{ value: 2.2, date: "2024-03-01", unit: "mg/dL", reference: "até 0.3" }],
        bi: [{ value: 1.6, date: "2024-03-01", unit: "mg/dL", reference: "até 0.9" }],
        albumina: [{ value: 2.8, date: "2024-03-01", unit: "g/dL", reference: "3.5-5.2" }],
        creatinina: [{ value: 1.1, date: "2024-03-01", unit: "mg/dL", reference: "0.7-1.3" }],
        ureia: [{ value: 45, date: "2024-03-01", unit: "mg/dL", reference: "15-45" }],
        sodio: [{ value: 134, date: "2024-03-01", unit: "mEq/L", reference: "135-145" }],
        potassio: [{ value: 4.2, date: "2024-03-01", unit: "mEq/L", reference: "3.5-5.0" }],
        glicemia: [{ value: 110, date: "2024-03-01", unit: "mg/dL", reference: "70-99" }],
        alfaFetoproteina: [{ value: 350, date: "2024-03-01", unit: "ng/mL", reference: "até 10" }],
        aboRh: [{ value: "O+", date: "2024-01-15" }],
        hba1c: [{ value: 6.2, date: "2024-03-01", unit: "%", reference: "4-5.6" }],
        clearence: [{ value: 85, date: "2024-03-01", unit: "mL/min", reference: ">90" }],
        calcio: [{ value: 8.8, date: "2024-03-01", unit: "mg/dL", reference: "8.5-10.5" }],
        fosforo: [{ value: 3.5, date: "2024-03-01", unit: "mg/dL", reference: "2.5-4.5" }],
        magnesio: [{ value: 2.0, date: "2024-03-01", unit: "mg/dL", reference: "1.8-2.4" }],
        protTotal: [{ value: 6.5, date: "2024-03-01", unit: "g/dL", reference: "6.0-8.0" }],
        ferro: [{ value: 70, date: "2024-03-01", unit: "µg/dL", reference: "59-158" }],
        ferritina: [{ value: 150, date: "2024-03-01", unit: "ng/mL", reference: "30-400" }],
        satTransf: [{ value: 25, date: "2024-03-01", unit: "%", reference: "20-50" }],
        colesterol: [{ value: 180, date: "2024-03-01", unit: "mg/dL", reference: "<200" }],
        hdl: [{ value: 45, date: "2024-03-01", unit: "mg/dL", reference: ">40" }],
        triglicerideos: [{ value: 150, date: "2024-03-01", unit: "mg/dL", reference: "<150" }],
        tsh: [{ value: 2.5, date: "2024-03-01", unit: "µUI/mL", reference: "0.4-4.0" }],
        t4: [{ value: 1.2, date: "2024-03-01", unit: "ng/dL", reference: "0.8-1.9" }],
        pcr: [{ value: 0.8, date: "2024-03-01", unit: "mg/dL", reference: "<0.5" }],
        psa: [{ value: 1.2, date: "2024-03-01", unit: "ng/mL", reference: "<4.0" }]
      },
      urina: {
        eas: [{ value: "Proteína +, Hemoglobina ++", date: "2024-03-01" }],
        urocultura: [{ value: "Negativa", date: "2024-03-01" }],
        sodioUrinario: [{ value: 85, date: "2024-03-01", unit: "mEq/L", reference: "40-220" }]
      },
      outrosExames: {
        ecg: [{ value: "Ritmo sinusal, FC 82bpm", date: "2024-02-15" }],
        rxTorax: [{ value: "Sem alterações significativas", date: "2024-02-15" }],
        usAbdome: [{ value: "Fígado cirrótico com nódulo de 3.2cm no segmento VI", date: "2024-02-01" }],
        tcAbdome: [{ value: "Nódulo hipervascular de 3.2cm compatível com CHC", date: "2024-02-15" }],
        rmAbdome: [{ value: "Lesão focal de 3.2cm com características típicas de CHC", date: "2024-02-20" }],
        ecocardiograma: [{ value: "Função sistólica normal. FE 65%", date: "2024-02-15" }],
        cintilografiaMiocardica: [{ value: "Sem evidências de isquemia", date: "2024-02-18" }],
        cateterismo: [],
        gasometriaArterial: [{ value: "pH 7.38, pO2 95mmHg", date: "2024-02-15" }],
        espirometria: [{ value: "Prova de função pulmonar normal", date: "2024-02-15" }],
        eda: [{ value: "Varizes esofágicas de médio calibre", date: "2024-02-10" }]
      }
    }
  },
  "2": {
    name: "Maria Santos",
    status: "critical",
    priority: "high",
    organ: "Liver",
    age: 45,
    bloodType: "A+",
    meldNa: 25,
    liverDiseaseEtiology: "Cirrose hepática autoimune + Síndrome hepatopulmonar",
    birthDate: "1979-08-22",
    gender: "F",
    recordNumber: "234567",
    motherName: "Ana Santos",
    consultationDate: "2024-03-12",
    cpf: "234.567.890-11",
    rg: "23.456.789-0",
    cnes: "2345678",
    address: "Avenida Brasil, 456",
    neighborhood: "Jardins",
    city: "São Paulo",
    zipCode: "04567-890",
    maritalStatus: "Solteira",
    phone: "(11) 97654-3210",
    birthPlace: "Rio de Janeiro",
    weight: 58,
    height: 162,
    profession: "Professora",
    race: "Parda",
    doctor: "Dr. Carlos Mendes",
    txRegistration: "TX234567",
    rgct: "RGCT234",
    currentDiseaseHistory: "Paciente com diagnóstico de cirrose hepática autoimune há 5 anos, Child B, com desenvolvimento de síndrome hepatopulmonar.",
    previousComorbidities: "Hipotireoidismo",
    medications: "Prednisona 10mg/dia, Azatioprina 100mg/dia, Levotiroxina 75mcg/dia",
    surgicalHistory: "Apendicectomia na infância",
    familyHistory: "Mãe com lúpus eritematoso sistêmico",
    smoking: { status: "no", packsPerDay: 0, yearsSmoked: 0, yearsStopped: 0 },
    alcohol: { status: "no", beverageType: "", quantity: "", yearsConsuming: 0, yearsStopped: 0 },
    illicitDrugs: "Nega uso",
    ectoscopy: "Paciente com bom estado geral, ictérica +/4+",
    chest: { examination: "Murmúrio vesicular presente bilateralmente", heartRate: 88, bloodPressure: "100/60", respiratoryRate: 22 },
    abdomen: { inspection: "Abdome globoso", palpation: "Fígado palpável a 2cm do RCD", percussion: "Macicez móvel presente", auscultation: "RHA presentes" },
    conduct: "1. Manter medicações\n2. Oxigenioterapia domiciliar",
    vaccines: { pneumo: true, influenza: true, hepatitisB: true, hepatitisA: true, dt: true },
    assessment: { nursing: "Paciente independente para AVDs", socialService: "Mora com a mãe", psychology: "Boa adaptação à doença", dentistry: "Sem necessidade de tratamento atual", cardiology: "Risco cardiovascular baixo", anesthesiology: "ASA III", surgery: "Candidata ao transplante" },
    labResults: {
      hemograma: {
        hb: [{ value: 11.5, date: "2024-03-01", unit: "g/dL", reference: "12-16" }],
        ht: [{ value: 34, date: "2024-03-01", unit: "%", reference: "36-46" }],
        leucocitos: [{ value: 4500, date: "2024-03-01", unit: "/mm³", reference: "4000-10000" }],
        plaquetas: [{ value: 85000, date: "2024-03-01", unit: "/mm³", reference: "150000-450000" }]
      },
      coagulograma: {
        tap: [{ value: 52, date: "2024-03-01", unit: "%", reference: "70-100" }],
        inr: [{ value: 1.6, date: "2024-03-01", unit: "", reference: "0.8-1.2" }]
      },
      bioquimica: {
        ast: [{ value: 95, date: "2024-03-01", unit: "U/L", reference: "até 40" }],
        alt: [{ value: 82, date: "2024-03-01", unit: "U/L", reference: "até 41" }],
        albumina: [{ value: 3.2, date: "2024-03-01", unit: "g/dL", reference: "3.5-5.2" }],
        bt: [{ value: 2.8, date: "2024-03-01", unit: "mg/dL", reference: "até 1.2" }]
      }
    }
  },
  "3": {
    name: "Pedro Oliveira",
    status: "critical",
    priority: "high",
    organ: "Liver",
    age: 62,
    bloodType: "B+",
    meldNa: 32,
    liverDiseaseEtiology: "Cirrose hepática alcoólica descompensada + Síndrome hepatorrenal",
    birthDate: "1962-03-10",
    gender: "M",
    recordNumber: "345678",
    motherName: "Rosa Oliveira",
    consultationDate: "2024-03-15",
    cpf: "345.678.901-22",
    rg: "34.567.890-1",
    cnes: "3456789",
    address: "Rua dos Pinheiros, 789",
    neighborhood: "Pinheiros",
    city: "São Paulo",
    zipCode: "05678-901",
    maritalStatus: "Divorciado",
    phone: "(11) 96543-2109",
    birthPlace: "Curitiba",
    weight: 68,
    height: 170,
    profession: "Aposentado",
    race: "Branco",
    doctor: "Dra. Mariana Costa",
    txRegistration: "TX345678",
    rgct: "RGCT345",
    currentDiseaseHistory: "Paciente com cirrose hepática por álcool, Child C, internado por descompensação com síndrome hepatorrenal tipo 1.",
    previousComorbidities: "Hipertensão arterial, Depressão",
    medications: "Propranolol 40mg 2x/dia, Terlipressina 1mg 4/4h, Albumina 20% 20g/dia",
    surgicalHistory: "Herniorrafia inguinal em 2010",
    familyHistory: "Pai falecido por infarto agudo do miocárdio",
    smoking: { status: "former", packsPerDay: 2, yearsSmoked: 30, yearsStopped: 2 },
    alcohol: { status: "former", beverageType: "Destilados e cerveja", quantity: "1 garrafa/dia", yearsConsuming: 35, yearsStopped: 1 },
    illicitDrugs: "Nega uso",
    ectoscopy: "Paciente emagrecido, ictérico +++/4+",
    chest: { examination: "Murmúrio vesicular presente bilateralmente", heartRate: 92, bloodPressure: "90/60", respiratoryRate: 20 },
    abdomen: { inspection: "Abdome tenso, distendido", palpation: "Ascite importante", percussion: "Macicez móvel presente", auscultation: "RHA diminuídos" },
    conduct: "1. Manter terlipressina e albumina\n2. Priorizar transplante",
    vaccines: { pneumo: true, influenza: true, hepatitisB: true, hepatitisA: true, dt: true },
    assessment: { nursing: "Paciente dependente para AVDs", socialService: "Mora com a filha", psychology: "Sintomas depressivos moderados", dentistry: "Necessita tratamento periodontal", cardiology: "Risco cardiovascular intermediário", anesthesiology: "ASA IV", surgery: "Candidato ao transplante" },
    labResults: {
      hemograma: {
        hb: [{ value: 9.0, date: "2024-03-01", unit: "g/dL", reference: "12-16" }],
        ht: [{ value: 27, date: "2024-03-01", unit: "%", reference: "36-46" }],
        leucocitos: [{ value: 12500, date: "2024-03-01", unit: "/mm³", reference: "4000-10000" }],
        plaquetas: [{ value: 45000, date: "2024-03-01", unit: "/mm³", reference: "150000-450000" }]
      },
      coagulograma: {
        tap: [{ value: 35, date: "2024-03-01", unit: "%", reference: "70-100" }],
        inr: [{ value: 2.2, date: "2024-03-01", unit: "", reference: "0.8-1.2" }]
      },
      bioquimica: {
        creatinina: [{ value: 3.8, date: "2024-03-01", unit: "mg/dL", reference: "0.7-1.3" }],
        ureia: [{ value: 185, date: "2024-03-01", unit: "mg/dL", reference: "15-45" }],
        sodio: [{ value: 128, date: "2024-03-01", unit: "mEq/L", reference: "135-145" }],
        albumina: [{ value: 2.2, date: "2024-03-01", unit: "g/dL", reference: "3.5-5.2" }],
        bt: [{ value: 5.8, date: "2024-03-01", unit: "mg/dL", reference: "até 1.2" }]
      }
    }
  },
  "4": {
    name: "Ana Rodrigues",
    status: "critical",
    priority: "high",
    organ: "Liver",
    age: 35,
    bloodType: "AB+",
    meldNa: 30,
    liverDiseaseEtiology: "Hepatite fulminante por medicamento (Paracetamol)",
    birthDate: "1989-11-25",
    gender: "F",
    recordNumber: "456789",
    motherName: "Clara Rodrigues",
    consultationDate: "2024-03-16",
    cpf: "456.789.012-33",
    rg: "45.678.901-2",
    cnes: "4567890",
    address: "Rua Augusta, 1234",
    neighborhood: "Consolação",
    city: "São Paulo",
    zipCode: "01234-567",
    maritalStatus: "Casada",
    phone: "(11) 95432-1098",
    birthPlace: "Salvador",
    weight: 55,
    height: 165,
    profession: "Advogada",
    race: "Parda",
    doctor: "Dr. Ricardo Lima",
    txRegistration: "TX456789",
    rgct: "RGCT456",
    currentDiseaseHistory: "Paciente com insuficiência hepática aguda após ingestão de doses elevadas de paracetamol. Evoluiu com encefalopatia hepática grau III.",
    previousComorbidities: "Transtorno depressivo maior",
    medications: "N-acetilcisteína EV, Lactulose, Omeprazol",
    surgicalHistory: "Cesárea em 2020",
    familyHistory: "Mãe com transtorno bipolar",
    smoking: { status: "no", packsPerDay: 0, yearsSmoked: 0, yearsStopped: 0 },
    alcohol: { status: "no", beverageType: "", quantity: "", yearsConsuming: 0, yearsStopped: 0 },
    illicitDrugs: "Nega uso",
    ectoscopy: "Paciente sonolenta, ictérica ++/4+, com asterixis",
    chest: { examination: "Murmúrio vesicular presente bilateralmente", heartRate: 105, bloodPressure: "110/70", respiratoryRate: 24 },
    abdomen: { inspection: "Abdome plano", palpation: "Fígado palpável a 2cm do RCD, doloroso", percussion: "Sem ascite", auscultation: "RHA presentes" },
    conduct: "1. Manter N-acetilcisteína\n2. Monitorização neurológica",
    vaccines: { pneumo: true, influenza: true, hepatitisB: true, hepatitisA: true, dt: true },
    assessment: { nursing: "Paciente necessita monitorização contínua", socialService: "Mora com marido", psychology: "Avaliação prejudicada", dentistry: "Avaliação postergada", cardiology: "Risco cardiovascular baixo", anesthesiology: "ASA IV", surgery: "Candidata ao transplante" },
    labResults: {
      hemograma: {
        hb: [{ value: 12.5, date: "2024-03-16", unit: "g/dL", reference: "12-16" }],
        ht: [{ value: 37, date: "2024-03-16", unit: "%", reference: "36-46" }],
        leucocitos: [{ value: 15500, date: "2024-03-16", unit: "/mm³", reference: "4000-10000" }],
        plaquetas: [{ value: 95000, date: "2024-03-16", unit: "/mm³", reference: "150000-450000" }]
      },
      coagulograma: {
        tap: [{ value: 15, date: "2024-03-16", unit: "%", reference: "70-100" }],
        inr: [{ value: 4.8, date: "2024-03-16", unit: "", reference: "0.8-1.2" }]
      },
      bioquimica: {
        ast: [{ value: 3500, date: "2024-03-16", unit: "U/L", reference: "até 40" }],
        alt: [{ value: 4200, date: "2024-03-16", unit: "U/L", reference: "até 41" }],
        bt: [{ value: 12.5, date: "2024-03-16", unit: "mg/dL", reference: "até 1.2" }],
        creatinina: [{ value: 0.9, date: "2024-03-16", unit: "mg/dL", reference: "0.7-1.3" }]
      }
    }
  },
};

interface PatientContextType {
  patients: Record<string, PatientFormData>;
  updatePatient: (id: string, data: PatientFormData) => void;
  addPatient: (data: PatientFormData) => string;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Record<string, PatientFormData>>(initialPatients);

  const updatePatient = (id: string, data: PatientFormData) => {
    setPatients(prev => ({ ...prev, [id]: data }));
  };

  const addPatient = (data: PatientFormData) => {
    const id = (Math.max(0, ...Object.keys(patients).map(Number)) + 1).toString();
    setPatients(prev => ({ ...prev, [id]: data }));
    return id;
  };

  return (
    <PatientContext.Provider value={{ patients, updatePatient, addPatient }}>
      {children}
    </PatientContext.Provider>
  );
}

function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

export { PatientProvider, usePatients };
