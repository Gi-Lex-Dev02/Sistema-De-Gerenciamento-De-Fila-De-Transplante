import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calculator, CheckCircle, Info } from 'lucide-react';
import { calculateMeldNa } from '@/lib/utils';
import type { LabResults } from '@/lib/schemas';

interface MeldNaCalculatorProps {
  value: number;
  labResults?: LabResults;
  onChange: (value: number) => void;
  error?: string;
}

export function MeldNaCalculator({ value, labResults, onChange, error }: MeldNaCalculatorProps) {
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculationResult, setCalculationResult] = useState<ReturnType<typeof calculateMeldNa> | null>(null);

  const handleCalculate = () => {
    const result = calculateMeldNa(labResults);
    setCalculationResult(result);
    setShowCalculation(true);

    if (result.meldNa !== null) {
      onChange(result.meldNa);
    }
  };

  const getMeldColor = (meld: number) => {
    if (meld >= 30) return 'text-red-600';
    if (meld >= 20) return 'text-orange-600';
    if (meld >= 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMeldSeverity = (meld: number) => {
    if (meld >= 30) return 'Muito Alto';
    if (meld >= 20) return 'Alto';
    if (meld >= 15) return 'Moderado';
    return 'Baixo';
  };

  return (
    <Card className="border-2 border-blue-300 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
          <Calculator className="h-5 w-5" />
          Score MELD-Na (Model for End-Stage Liver Disease)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              O MELD-Na é um score crítico que determina a prioridade do paciente na fila de transplante hepático.
              Pode ser calculado automaticamente a partir dos exames laboratoriais ou inserido manualmente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meldNa" className="font-semibold">
                Valor MELD-Na
              </Label>
              <div className="flex gap-2">
                <Input
                  id="meldNa"
                  type="number"
                  value={value || ''}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  error={error}
                  placeholder="Ex: 25"
                  className="text-lg font-semibold"
                />
                <Button
                  type="button"
                  onClick={handleCalculate}
                  variant="default"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Calculator className="h-4 w-4" />
                  Calcular
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {value > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Classificação:</p>
                <p className={`text-2xl font-bold ${getMeldColor(value)}`}>
                  {getMeldSeverity(value)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Score: <span className="font-semibold">{value}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {showCalculation && calculationResult && (
          <div className="space-y-3">
            {calculationResult.missingData.length > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Dados Insuficientes para Cálculo
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {calculationResult.missingData.map((data, index) => (
                        <li key={index} className="text-sm text-yellow-900 font-medium">
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Cálculo Realizado com Sucesso
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded p-2 border border-green-200">
                        <span className="text-green-700">MELD-Na Final:</span>
                        <p className="text-2xl font-bold text-green-900">
                          {calculationResult.meldNa}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-green-200">
                        <span className="text-green-700">MELD Original:</span>
                        <p className="text-lg font-semibold text-green-900">
                          {calculationResult.meldOriginal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Fórmula:</strong> MELD = 0.957 × ln(Creatinina) + 0.378 × ln(Bilirrubina) + 1.120 × ln(INR) + 0.643
            <br />
            <strong>Correção de Sódio:</strong> Aplicada quando MELD {'>'} 11
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
