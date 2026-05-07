import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { DonorForm } from '@/components/forms/donor-form';
import { calculateTransplantRisk, getSurgicalComplexity } from '@/lib/risk-analysis';
import type { DonorData, PatientFormData } from '@/lib/schemas';

interface ViabilityAnalysisProps {
  patient: PatientFormData;
  onUpdate: (data: PatientFormData) => void;
}

export function ViabilityAnalysis({ patient, onUpdate }: ViabilityAnalysisProps) {
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [analysis, setAnalysis] = useState(patient.riskAnalysis);
  const donor = patient.matchedDonor;

  const handleDonorSubmit = (donorData: DonorData) => {
    const riskAnalysis = calculateTransplantRisk(donorData, patient);
    onUpdate({ ...patient, matchedDonor: donorData, riskAnalysis });
    setAnalysis(riskAnalysis);
    setShowDonorForm(false);
  };

  const getRiskColor = () => {
    if (!analysis) return 'bg-gray-100 border-gray-300';
    switch (analysis.riskLevel) {
      case 'critical': return 'bg-red-50 border-red-300';
      case 'moderate': return 'bg-yellow-50 border-yellow-300';
      case 'favorable': return 'bg-green-50 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getRiskIcon = () => {
    if (!analysis) return <Activity className="h-8 w-8 text-gray-400" />;
    switch (analysis.riskLevel) {
      case 'critical': return <AlertCircle className="h-8 w-8 text-red-600" />;
      case 'moderate': return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      case 'favorable': return <CheckCircle className="h-8 w-8 text-green-600" />;
      default: return <Activity className="h-8 w-8 text-gray-400" />;
    }
  };

  const getRiskTitle = () => {
    if (!analysis) return 'Análise Pendente';
    switch (analysis.riskLevel) {
      case 'critical': return 'TRANSPLANTE CONTRAINDICADO OU ALTO RISCO DE ÓBITO';
      case 'moderate': return 'VIÁVEL COM PRECAUÇÕES ESPECÍFICAS';
      case 'favorable': return 'PERFIL FAVORÁVEL';
      default: return 'Análise Pendente';
    }
  };

  const getRiskTextColor = () => {
    if (!analysis) return 'text-gray-700';
    switch (analysis.riskLevel) {
      case 'critical': return 'text-red-900';
      case 'moderate': return 'text-yellow-900';
      case 'favorable': return 'text-green-900';
      default: return 'text-gray-700';
    }
  };

  if (showDonorForm) {
    return (
      <div className="space-y-6">
        <DonorForm initialData={donor} onSubmit={handleDonorSubmit} onCancel={() => setShowDonorForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!donor && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Activity className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-2">Análise de Viabilidade de Transplante</h3>
                <p className="text-sm text-blue-800 mb-4">Para realizar a análise de viabilidade, é necessário cadastrar os dados do doador compatível.</p>
                <Button onClick={() => setShowDonorForm(true)}>Cadastrar Dados do Doador</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {donor && (
        <>
          <Card>
            <CardHeader><CardTitle>Dados do Doador</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div><span className="text-sm text-gray-500">Nome:</span><p className="font-medium">{donor.name}</p></div>
                <div><span className="text-sm text-gray-500">Idade:</span><p className="font-medium">{donor.age} anos</p></div>
                <div><span className="text-sm text-gray-500">Sexo:</span><p className="font-medium">{donor.gender === 'M' ? 'Masculino' : 'Feminino'}</p></div>
                <div><span className="text-sm text-gray-500">Peso:</span><p className="font-medium">{donor.weight} kg</p></div>
                <div><span className="text-sm text-gray-500">Altura:</span><p className="font-medium">{donor.height} cm</p></div>
                <div><span className="text-sm text-gray-500">Tipo Sanguíneo:</span><p className="font-medium">{donor.bloodType || 'Não informado'}</p></div>
                <div><span className="text-sm text-gray-500">Esteatose Hepática:</span><p className="font-medium capitalize">{donor.hepaticSteatosis}</p></div>
                <div><span className="text-sm text-gray-500">Infecções Ativas:</span><p className="font-medium">{donor.activeInfections ? 'Sim' : 'Não'}</p></div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowDonorForm(true)}>Editar Dados do Doador</Button>
            </CardContent>
          </Card>

          {analysis && (
            <>
              <Card className={`border-2 ${getRiskColor()}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getRiskIcon()}
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold mb-2 ${getRiskTextColor()}`}>{getRiskTitle()}</h2>
                      <p className={`text-sm ${getRiskTextColor()} mb-4`}>{analysis.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Score MELD-Na</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-2">{patient.meldNa || 0}</div>
                      <p className="text-sm text-gray-600">
                        {patient.meldNa > 35 && 'MELD-Na muito elevado'}
                        {patient.meldNa >= 25 && patient.meldNa <= 35 && 'MELD-Na elevado'}
                        {patient.meldNa < 25 && 'MELD-Na moderado'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Complexidade Cirúrgica</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{getSurgicalComplexity(analysis.riskScore).label}</span>
                        <span className="text-2xl font-bold">{analysis.riskScore.toFixed(0)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className={`h-full ${getSurgicalComplexity(analysis.riskScore).color} transition-all duration-500`} style={{ width: `${Math.min(analysis.riskScore, 100)}%` }} />
                      </div>
                      <p className="text-xs text-gray-600">Score de 0 a 100 (quanto maior, maior a complexidade)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysis.criticalFactors.length > 0 && (
                <Card className="border-red-300 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Fatores Críticos de Risco
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.criticalFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-900">
                          <span className="text-red-600 font-bold mt-1">•</span>
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.warningFactors.length > 0 && (
                <Card className="border-yellow-300 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-900 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Pontos de Atenção
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.warningFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2 text-yellow-900">
                          <span className="text-yellow-600 font-bold mt-1">•</span>
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.criticalFactors.length === 0 && analysis.warningFactors.length === 0 && (
                <Card className="border-green-300 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Análise Favorável
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-900">Nenhum fator crítico ou de atenção identificado. O perfil doador-receptor é favorável para o transplante hepático.</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle className="text-lg">Resumo da Compatibilidade</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Diferença de Peso:</span>
                      <p className="font-medium">{Math.abs(donor.weight - patient.weight).toFixed(1)} kg ({((Math.abs(donor.weight - patient.weight) / patient.weight) * 100).toFixed(1)}%)</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data da Análise:</span>
                      <p className="font-medium">{new Date(analysis.analysisDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
