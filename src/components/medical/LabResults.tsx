import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import type { LabResults, LabResultValue } from '@/lib/schemas';

interface LabResultsProps {
  results?: LabResults;
  onUpdate: (results: LabResults) => void;
}

interface ResultGraphProps {
  data: LabResultValue[];
  title: string;
  unit?: string;
}

function ResultGraph({ data, title, unit }: ResultGraphProps) {
  const chartData = data
    .map(result => ({
      date: format(new Date(result.date), 'dd/MM/yyyy'),
      value: typeof result.value === 'number' ? result.value : parseFloat(result.value) || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit={unit} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={title}
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ResultInputProps {
  label: string;
  value: string;
  date: string;
  unit?: string;
  reference?: string;
  onChange: (value: string, date: string, unit?: string, reference?: string) => void;
}

function ResultInput({ label, value, date, unit, reference, onChange }: ResultInputProps) {
  return (
    <div className="grid grid-cols-4 gap-4 items-start">
      <div>
        <Label>{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value, date, unit, reference)}
        />
      </div>
      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onChange(value, e.target.value, unit, reference)}
        />
      </div>
      <div>
        <Label>Unidade</Label>
        <Input
          value={unit || ''}
          onChange={(e) => onChange(value, date, e.target.value, reference)}
        />
      </div>
      <div>
        <Label>Valor de Referência</Label>
        <Input
          value={reference || ''}
          onChange={(e) => onChange(value, date, unit, e.target.value)}
        />
      </div>
    </div>
  );
}

export function LabResults({ results = createEmptyLabResults(), onUpdate }: LabResultsProps) {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [newResult, setNewResult] = useState<{
    value: string;
    date: string;
    unit?: string;
    reference?: string;
  }>({
    value: '',
    date: new Date().toISOString().split('T')[0],
  });

  function addResult() {
    if (!selectedTest || !newResult.value || !newResult.date) return;

    const [category, test] = selectedTest.split('.');
    const updatedResults = { ...results };
    
    // @ts-ignore - Dynamic access
    updatedResults[category][test].push({
      value: parseFloat(newResult.value) || newResult.value,
      date: newResult.date,
      unit: newResult.unit,
      reference: newResult.reference,
    });

    onUpdate(updatedResults);
    setNewResult({
      value: '',
      date: new Date().toISOString().split('T')[0],
    });
  }

  return (
    <Tabs defaultValue="hemograma" className="w-full">
      <TabsList className="grid grid-cols-6">
        <TabsTrigger value="hemograma">Hemograma</TabsTrigger>
        <TabsTrigger value="coagulograma">Coagulograma</TabsTrigger>
        <TabsTrigger value="sorologias">Sorologias</TabsTrigger>
        <TabsTrigger value="bioquimica">Bioquímica</TabsTrigger>
        <TabsTrigger value="tacrolimus">Tacrolimus</TabsTrigger>
        <TabsTrigger value="everolimus">Everolimus</TabsTrigger>
        <TabsTrigger value="urina">Urina</TabsTrigger>
        <TabsTrigger value="outros">Outros Exames</TabsTrigger>
      </TabsList>

      <div className="my-4 p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Adicionar Novo Resultado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Exame</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
            >
              <option value="">Selecione um exame</option>
              {Object.entries(results).map(([category, tests]) =>
                Object.keys(tests).map((test) => (
                  <option key={`${category}.${test}`} value={`${category}.${test}`}>
                    {`${category} - ${test}`}
                  </option>
                ))
              )}
            </select>
          </div>
          {selectedTest && (
            <>
              <ResultInput
                label="Resultado"
                value={newResult.value}
                date={newResult.date}
                unit={newResult.unit}
                reference={newResult.reference}
                onChange={(value, date, unit, reference) =>
                  setNewResult({ value, date, unit, reference })
                }
              />
              <Button onClick={addResult} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Resultado
              </Button>
            </>
          )}
        </div>
      </div>

      <TabsContent value="hemograma">
        <Card>
          <CardHeader>
            <CardTitle>Hemograma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(results.hemograma).map(([test, values]) => (
              <div key={test} className="space-y-2">
                <h3 className="font-medium">{test}</h3>
                {values.length > 0 && (
                  <ResultGraph
                    data={values}
                    title={test}
                    unit={values[0].unit}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tacrolimus">
        <Card>
          <CardHeader>
            <CardTitle>Tacrolimus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(results.tacrolimus || {}).map(([test, values]) => (
              <div key={test} className="space-y-2">
                <h3 className="font-medium">{test}</h3>
                {values.length > 0 && (
                  <ResultGraph
                    data={values}
                    title={test}
                    unit={values[0].unit}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="everolimus">
        <Card>
          <CardHeader>
            <CardTitle>Everolimus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(results.everolimus || {}).map(([test, values]) => (
              <div key={test} className="space-y-2">
                <h3 className="font-medium">{test}</h3>
                {values.length > 0 && (
                  <ResultGraph
                    data={values}
                    title={test}
                    unit={values[0].unit}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function createEmptyLabResults(): LabResults {
  return {
    hemograma: { hb: [], ht: [], vcm: [], chcm: [], leucocitos: [], segmentados: [], plaquetas: [] },
    coagulograma: { tap: [], inr: [], ttpa: [], fibrinogenio: [] },
    sorologias: {
      hbsag: [], antiHbcTotal: [], antiHbs: [], hbeag: [], antiHbe: [], hbvDna: [],
      antiHcv: [], genotipoHcvRna: [], antiHavIgm: [], antiHavIgg: [], antiHiv: [],
      antiHtlv: [], cmvIgg: [], cmvIgm: [], vdrl: [], herpesIgm: [], herpesIgg: [],
      rubelaIgg: [], toxoIgm: [], toxoIgg: [], chagas: [], alfa1Antitripsina: [],
      ama: [], aml: [], fan: [], ceruloplasmina: [], ppd: [],
    },
    bioquimica: {
      aboRh: [], glicemia: [], hba1c: [], ureia: [], creatinina: [], clearence: [],
      sodio: [], potassio: [], calcio: [], fosforo: [], magnesio: [], ast: [], alt: [],
      fa: [], gamaGt: [], bt: [], bd: [], bi: [], albumina: [], protTotal: [], ferro: [],
      ferritina: [], satTransf: [], colesterol: [], hdl: [], triglicerideos: [], tsh: [],
      t4: [], pcr: [], alfaFetoproteina: [], psa: [],
    },
    urina: { eas: [], urocultura: [], sodioUrinario: [] },
    outrosExames: {
      ecg: [], ecocardiograma: [], cintilografiaMiocardica: [], cateterismo: [],
      gasometriaArterial: [], rxTorax: [], espirometria: [], eda: [], usAbdome: [],
      tcAbdome: [], rmAbdome: [],
    },
  };
}
