import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LabResults } from './schemas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MeldNaCalculationResult {
  meldNa: number | null;
  meldOriginal: number | null;
  missingData: string[];
  values: {
    creatinina?: number;
    bilirrubina?: number;
    inr?: number;
    sodio?: number;
  };
}

export function calculateMeldNa(labResults?: LabResults): MeldNaCalculationResult {
  const missingData: string[] = [];
  const values: MeldNaCalculationResult['values'] = {};

  const getLatestValue = (array: Array<{ value?: string | number }> = []): number | null => {
    if (!array || array.length === 0) return null;
    const latest = array[array.length - 1];
    if (!latest?.value) return null;
    const num = typeof latest.value === 'string' ? parseFloat(latest.value) : latest.value;
    return isNaN(num) ? null : num;
  };

  const creatinina = getLatestValue(labResults?.bioquimica?.creatinina);
  const bilirrubina = getLatestValue(labResults?.bioquimica?.bt);
  const inr = getLatestValue(labResults?.coagulograma?.inr);
  const sodio = getLatestValue(labResults?.bioquimica?.sodio);

  if (creatinina === null) {
    missingData.push('Creatinina (Bioquímica)');
  } else {
    values.creatinina = creatinina;
  }

  if (bilirrubina === null) {
    missingData.push('Bilirrubina Total (Bioquímica)');
  } else {
    values.bilirrubina = bilirrubina;
  }

  if (inr === null) {
    missingData.push('INR (Coagulograma)');
  } else {
    values.inr = inr;
  }

  if (sodio === null) {
    missingData.push('Sódio (Bioquímica)');
  } else {
    values.sodio = sodio;
  }

  if (missingData.length > 0) {
    return {
      meldNa: null,
      meldOriginal: null,
      missingData,
      values,
    };
  }

  const creat = Math.max(1.0, Math.min(creatinina!, 4.0));
  const bili = Math.max(1.0, bilirrubina!);
  const inrValue = Math.max(1.0, inr!);
  const sod = Math.max(125, Math.min(sodio!, 137));

  const meldOriginal =
    0.957 * Math.log(creat) +
    0.378 * Math.log(bili) +
    1.120 * Math.log(inrValue) +
    0.643;

  let meldScore = Math.round(meldOriginal * 10);

  if (meldScore > 11) {
    const sodiumCorrection = 1.32 * (137 - sod) - (0.033 * meldScore * (137 - sod));
    meldScore = Math.round(meldScore + sodiumCorrection);
  }

  meldScore = Math.max(6, Math.min(40, meldScore));

  return {
    meldNa: meldScore,
    meldOriginal: Math.round(meldOriginal * 10),
    missingData: [],
    values,
  };
}
