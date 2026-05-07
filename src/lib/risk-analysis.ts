import type { DonorData, PatientFormData, RiskAnalysis } from './schemas';

interface RiskFactors {
  critical: string[];
  warning: string[];
}

export function calculateTransplantRisk(
  donor: DonorData,
  receptor: PatientFormData
): RiskAnalysis {
  const factors: RiskFactors = {
    critical: [],
    warning: [],
  };

  let riskScore = 0;

  const meldNa = receptor.meldNa || 0;
  const creatinine = receptor.clinicalData?.renalDiseaseCreatinine || 0;
  const collateralCirculation = receptor.clinicalData?.collateralCirculation || false;
  const hepatocellularCarcinoma = receptor.clinicalData?.hepatocellularCarcinoma || false;

  const donorAge = donor.age;
  const donorWeight = donor.weight;
  const receptorWeight = receptor.weight;
  const weightDifference = Math.abs(donorWeight - receptorWeight) / receptorWeight * 100;

  if (donor.activeInfections) {
    factors.critical.push('Doador com infecção ativa');
    riskScore += 40;
  }

  if (donor.hepaticSteatosis === 'grave') {
    factors.critical.push('Esteatose hepática grave no doador');
    riskScore += 35;
  }

  if (meldNa > 35) {
    factors.critical.push(`MELD-Na muito elevado (${meldNa})`);
    riskScore += 30;
  }

  if (donorAge > 70) {
    factors.warning.push(`Doador com idade avançada (${donorAge} anos)`);
    riskScore += 15;
  }

  if (collateralCirculation) {
    factors.warning.push('Receptor com circulação colateral (risco aumentado de sangramento)');
    riskScore += 12;
  }

  if (weightDifference > 25) {
    factors.warning.push(
      `Grande diferença de peso entre doador e receptor (${weightDifference.toFixed(1)}%)`
    );
    riskScore += 15;
  }

  if (donor.hepaticSteatosis === 'moderada') {
    factors.warning.push('Esteatose hepática moderada no doador');
    riskScore += 10;
  }

  if (creatinine > 2.0) {
    factors.warning.push(`Creatinina elevada no receptor (${creatinine} mg/dL)`);
    riskScore += 10;
  }

  if (hepatocellularCarcinoma) {
    factors.warning.push('Receptor com hepatocarcinoma');
    riskScore += 8;
  }

  if (meldNa >= 25 && meldNa <= 35) {
    factors.warning.push(`MELD-Na elevado (${meldNa})`);
    riskScore += 10;
  }

  let riskLevel: 'critical' | 'moderate' | 'favorable';

  if (factors.critical.length > 0 || riskScore >= 60) {
    riskLevel = 'critical';
  } else if (factors.warning.length > 0 || riskScore >= 30) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'favorable';
  }

  riskScore = Math.min(riskScore, 100);

  return {
    riskLevel,
    riskScore,
    criticalFactors: factors.critical,
    warningFactors: factors.warning,
    analysisDate: new Date().toISOString(),
    notes: generateRiskNotes(riskLevel, factors),
  };
}

function generateRiskNotes(
  riskLevel: 'critical' | 'moderate' | 'favorable',
  factors: RiskFactors
): string {
  if (riskLevel === 'critical') {
    return 'Transplante contraindicado ou de altíssimo risco. Requer avaliação criteriosa da equipe multidisciplinar e discussão com família sobre riscos de mortalidade perioperatória elevada.';
  }

  if (riskLevel === 'moderate') {
    return 'Transplante viável com precauções específicas. Planejamento cirúrgico detalhado necessário. Considerar estratégias para mitigação dos fatores de risco identificados.';
  }

  return 'Perfil favorável para transplante. Prosseguir com protocolo padrão de transplante hepático.';
}

export function getSurgicalComplexity(riskScore: number): {
  level: 'low' | 'medium' | 'high';
  label: string;
  color: string;
} {
  if (riskScore >= 60) {
    return {
      level: 'high',
      label: 'Alta Complexidade',
      color: 'bg-red-500',
    };
  }

  if (riskScore >= 30) {
    return {
      level: 'medium',
      label: 'Média Complexidade',
      color: 'bg-yellow-500',
    };
  }

  return {
    level: 'low',
    label: 'Baixa Complexidade',
    color: 'bg-green-500',
  };
}
