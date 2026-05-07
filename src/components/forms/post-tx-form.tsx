import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { LabResults } from '@/components/medical/LabResults';
import { ViabilityAnalysis } from '@/components/analysis/ViabilityAnalysis';
import type {
  PatientFormData,
  PostTxSerologyExam,
  AbdominalUsg,
  LiverBiopsy,
  UpperEndoscopy,
  OtherExam,
  PostTxLabExam,
  ClinicalEvolution,
} from '@/lib/schemas';

interface PostTxFormProps {
  patient: PatientFormData;
  onUpdate: (data: PatientFormData) => void;
}

export function PostTxForm({ patient, onUpdate }: PostTxFormProps) {
  const handleUpdate = (path: string[], value: any) => {
    const newPatient = { ...patient };
    if (!newPatient.postTx) {
      newPatient.postTx = {
        serologies: {},
        serologyExams: [],
        abdominalUsgs: [],
        liverBiopsies: [],
        upperEndoscopies: [],
        otherExams: [],
        labExams: [],
        clinicalEvolution: [],
      };
    }
    
    let current = newPatient;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    onUpdate(newPatient);
  };

  const addSerologyExam = () => {
    const newExam: PostTxSerologyExam = { examDate: new Date().toISOString().split('T')[0] };
    handleUpdate(['postTx', 'serologyExams'], [...(patient.postTx?.serologyExams || []), newExam]);
  };

  const addAbdominalUsg = () => {
    const newUsg: AbdominalUsg = { date: new Date().toISOString().split('T')[0], afb: '', usgAbdominal: '' };
    handleUpdate(['postTx', 'abdominalUsgs'], [...(patient.postTx?.abdominalUsgs || []), newUsg]);
  };

  const addLiverBiopsy = () => {
    const newBiopsy: LiverBiopsy = { number: '', date: new Date().toISOString().split('T')[0], report: '' };
    handleUpdate(['postTx', 'liverBiopsies'], [...(patient.postTx?.liverBiopsies || []), newBiopsy]);
  };

  const addUpperEndoscopy = () => {
    const newEndoscopy: UpperEndoscopy = { date: new Date().toISOString().split('T')[0], findings: '' };
    handleUpdate(['postTx', 'upperEndoscopies'], [...(patient.postTx?.upperEndoscopies || []), newEndoscopy]);
  };

  const addOtherExam = () => {
    const newExam: OtherExam = { date: new Date().toISOString().split('T')[0], examType: '', result: '' };
    handleUpdate(['postTx', 'otherExams'], [...(patient.postTx?.otherExams || []), newExam]);
  };

  const addClinicalEvolution = () => {
    const newEvolution: ClinicalEvolution = { date: new Date().toISOString().split('T')[0], evolution: '' };
    handleUpdate(['postTx', 'clinicalEvolution'], [...(patient.postTx?.clinicalEvolution || []), newEvolution]);
  };

  return (
    <Tabs defaultValue="analysis" className="w-full">
      <div className="relative">
        <TabsList className="flex w-full space-x-2 overflow-x-auto scrollbar-thin p-1 border-b">
          <TabsTrigger value="analysis" className="min-w-[160px] shrink-0">Análise de Viabilidade</TabsTrigger>
          <TabsTrigger value="serologies" className="min-w-[160px] shrink-0">Sorologias</TabsTrigger>
          <TabsTrigger value="serology-exams" className="min-w-[160px] shrink-0">Exames Sorologias</TabsTrigger>
          <TabsTrigger value="lab-results" className="min-w-[160px] shrink-0">Exames</TabsTrigger>
          <TabsTrigger value="usg" className="min-w-[160px] shrink-0">USG Abdominal</TabsTrigger>
          <TabsTrigger value="biopsy" className="min-w-[160px] shrink-0">Biópsia Hepática</TabsTrigger>
          <TabsTrigger value="endoscopy" className="min-w-[160px] shrink-0">Endoscopia</TabsTrigger>
          <TabsTrigger value="other-exams" className="min-w-[160px] shrink-0">Outros</TabsTrigger>
          <TabsTrigger value="evolution" className="min-w-[160px] shrink-0">Evolução</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="analysis">
        <ViabilityAnalysis patient={patient} onUpdate={onUpdate} />
      </TabsContent>

      <TabsContent value="serologies">
        <Card>
          <CardHeader><CardTitle>Sorologias</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'antiHcv', label: 'ANTI HCV' },
                { key: 'cmvIgg', label: 'CMV IGG' },
                { key: 'antiHbs', label: 'ANTI HBS' },
                { key: 'antiHbcTotal', label: 'ANTI HBC TOTAL' },
                { key: 'antiHbe', label: 'ANTI HBE' },
                { key: 'toxoplasmose', label: 'TOXOPLASMOSE' },
                { key: 'chagas', label: 'CHAGAS' },
                { key: 'pcrVhc', label: 'PCR VHC' },
                { key: 'hiv', label: 'HIV' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`serologies.${key}`}
                    checked={patient.postTx?.serologies?.[key] || false}
                    onChange={(e) => handleUpdate(['postTx', 'serologies', key], e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`serologies.${key}`}>{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="serology-exams">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exames Sorologias</CardTitle>
            <Button onClick={addSerologyExam} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.postTx?.serologyExams?.map((exam, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={exam.examDate}
                          onChange={(e) => {
                            const newExams = [...(patient.postTx?.serologyExams || [])];
                            newExams[index] = { ...exam, examDate: e.target.value };
                            handleUpdate(['postTx', 'serologyExams'], newExams);
                          }}
                        />
                      </div>
                      {[{ key: 'hbsag', label: 'HBsAg' }, { key: 'antiHbs', label: 'Anti-HBs' }, { key: 'hbeag', label: 'HBeAg' },
                        { key: 'antiHbe', label: 'Anti-HBe' }, { key: 'antiHbcTotal', label: 'Anti-HBc tot.' }, { key: 'hbvDna', label: 'HBV DNA' },
                        { key: 'antiHcv', label: 'Anti-HCV' }, { key: 'hcvRna', label: 'HCV RNA' }, { key: 'antiHavIgm', label: 'Anti-HAV IgM' },
                        { key: 'antiHavTotal', label: 'Anti-HAV total' }, { key: 'antiDelta', label: 'Anti-delta' },
                        { key: 'hdvRna', label: 'HDV RNA' }, { key: 'genotype', label: 'GENÓTIPO' },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input value={exam[key] || ''}
                            onChange={(e) => {
                              const newExams = [...(patient.postTx?.serologyExams || [])];
                              newExams[index] = { ...exam, [key]: e.target.value };
                              handleUpdate(['postTx', 'serologyExams'], newExams);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newExams = [...(patient.postTx?.serologyExams || [])];
                        newExams.splice(index, 1);
                        handleUpdate(['postTx', 'serologyExams'], newExams);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="lab-results">
        <Card>
          <CardHeader><CardTitle>Exames Laboratoriais</CardTitle></CardHeader>
          <CardContent>
            <LabResults
              results={patient.postTx?.labResults}
              onUpdate={(results) => handleUpdate(['postTx', 'labResults'], results)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="usg">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ultrassonografia Abdominal</CardTitle>
            <Button onClick={addAbdominalUsg} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.postTx?.abdominalUsgs?.map((usg, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={usg.date}
                          onChange={(e) => {
                            const newUsgs = [...(patient.postTx?.abdominalUsgs || [])];
                            newUsgs[index] = { ...usg, date: e.target.value };
                            handleUpdate(['postTx', 'abdominalUsgs'], newUsgs);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>AFB</Label>
                        <Input value={usg.afb}
                          onChange={(e) => {
                            const newUsgs = [...(patient.postTx?.abdominalUsgs || [])];
                            newUsgs[index] = { ...usg, afb: e.target.value };
                            handleUpdate(['postTx', 'abdominalUsgs'], newUsgs);
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>USG Abdominal</Label>
                        <Textarea value={usg.usgAbdominal}
                          onChange={(e) => {
                            const newUsgs = [...(patient.postTx?.abdominalUsgs || [])];
                            newUsgs[index] = { ...usg, usgAbdominal: e.target.value };
                            handleUpdate(['postTx', 'abdominalUsgs'], newUsgs);
                          }}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newUsgs = [...(patient.postTx?.abdominalUsgs || [])];
                        newUsgs.splice(index, 1);
                        handleUpdate(['postTx', 'abdominalUsgs'], newUsgs);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="biopsy">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Biópsia Hepática</CardTitle>
            <Button onClick={addLiverBiopsy} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.postTx?.liverBiopsies?.map((biopsy, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Número</Label>
                        <Input value={biopsy.number}
                          onChange={(e) => {
                            const newBiopsies = [...(patient.postTx?.liverBiopsies || [])];
                            newBiopsies[index] = { ...biopsy, number: e.target.value };
                            handleUpdate(['postTx', 'liverBiopsies'], newBiopsies);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={biopsy.date}
                          onChange={(e) => {
                            const newBiopsies = [...(patient.postTx?.liverBiopsies || [])];
                            newBiopsies[index] = { ...biopsy, date: e.target.value };
                            handleUpdate(['postTx', 'liverBiopsies'], newBiopsies);
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Laudo</Label>
                        <Textarea value={biopsy.report}
                          onChange={(e) => {
                            const newBiopsies = [...(patient.postTx?.liverBiopsies || [])];
                            newBiopsies[index] = { ...biopsy, report: e.target.value };
                            handleUpdate(['postTx', 'liverBiopsies'], newBiopsies);
                          }}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newBiopsies = [...(patient.postTx?.liverBiopsies || [])];
                        newBiopsies.splice(index, 1);
                        handleUpdate(['postTx', 'liverBiopsies'], newBiopsies);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="endoscopy">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endoscopia Digestiva Alta</CardTitle>
            <Button onClick={addUpperEndoscopy} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.postTx?.upperEndoscopies?.map((endoscopy, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={endoscopy.date}
                          onChange={(e) => {
                            const newEndoscopies = [...(patient.postTx?.upperEndoscopies || [])];
                            newEndoscopies[index] = { ...endoscopy, date: e.target.value };
                            handleUpdate(['postTx', 'upperEndoscopies'], newEndoscopies);
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Achados</Label>
                        <Textarea value={endoscopy.findings}
                          onChange={(e) => {
                            const newEndoscopies = [...(patient.postTx?.upperEndoscopies || [])];
                            newEndoscopies[index] = { ...endoscopy, findings: e.target.value };
                            handleUpdate(['postTx', 'upperEndoscopies'], newEndoscopies);
                          }}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newEndoscopies = [...(patient.postTx?.upperEndoscopies || [])];
                        newEndoscopies.splice(index, 1);
                        handleUpdate(['postTx', 'upperEndoscopies'], newEndoscopies);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="other-exams">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Outros Exames</CardTitle>
            <Button onClick={addOtherExam} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.postTx?.otherExams?.map((exam, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={exam.date}
                          onChange={(e) => {
                            const newExams = [...(patient.postTx?.otherExams || [])];
                            newExams[index] = { ...exam, date: e.target.value };
                            handleUpdate(['postTx', 'otherExams'], newExams);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Exame</Label>
                        <Input value={exam.examType}
                          onChange={(e) => {
                            const newExams = [...(patient.postTx?.otherExams || [])];
                            newExams[index] = { ...exam, examType: e.target.value };
                            handleUpdate(['postTx', 'otherExams'], newExams);
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Resultado</Label>
                        <Textarea value={exam.result}
                          onChange={(e) => {
                            const newExams = [...(patient.postTx?.otherExams || [])];
                            newExams[index] = { ...exam, result: e.target.value };
                            handleUpdate(['postTx', 'otherExams'], newExams);
                          }}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newExams = [...(patient.postTx?.otherExams || [])];
                        newExams.splice(index, 1);
                        handleUpdate(['postTx', 'otherExams'], newExams);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="evolution">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Evolução Clínica</CardTitle>
            <Button onClick={addClinicalEvolution} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prontuário</Label>
                  <Input value={patient.postTx?.recordNumber || ''}
                    onChange={(e) => handleUpdate(['postTx', 'recordNumber'], e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Clínica</Label>
                  <Input value={patient.postTx?.clinic || ''}
                    onChange={(e) => handleUpdate(['postTx', 'clinic'], e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amb. / Sala</Label>
                  <Input value={patient.postTx?.ambulatory || ''}
                    onChange={(e) => handleUpdate(['postTx', 'ambulatory'], e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Enfermaria</Label>
                  <Input value={patient.postTx?.ward || ''}
                    onChange={(e) => handleUpdate(['postTx', 'ward'], e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Leito</Label>
                  <Input value={patient.postTx?.bed || ''}
                    onChange={(e) => handleUpdate(['postTx', 'bed'], e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                {patient.postTx?.clinicalEvolution?.map((evolution, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="space-y-2">
                          <Label>Data</Label>
                          <Input type="date" value={evolution.date}
                            onChange={(e) => {
                              const newEvolutions = [...(patient.postTx?.clinicalEvolution || [])];
                              newEvolutions[index] = { ...evolution, date: e.target.value };
                              handleUpdate(['postTx', 'clinicalEvolution'], newEvolutions);
                            }}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Evolução</Label>
                          <Textarea value={evolution.evolution}
                            onChange={(e) => {
                              const newEvolutions = [...(patient.postTx?.clinicalEvolution || [])];
                              newEvolutions[index] = { ...evolution, evolution: e.target.value };
                              handleUpdate(['postTx', 'clinicalEvolution'], newEvolutions);
                            }}
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          const newEvolutions = [...(patient.postTx?.clinicalEvolution || [])];
                          newEvolutions.splice(index, 1);
                          handleUpdate(['postTx', 'clinicalEvolution'], newEvolutions);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
