import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Check, X } from 'lucide-react';
import { LabResults } from '@/components/medical/LabResults';
import { FileUpload } from '@/components/ui/file-upload';
import { ImageUpload } from '@/components/ui/image-upload';
import { PostTxForm } from '@/components/forms/post-tx-form';
import type { PatientFormData } from '@/lib/schemas';

interface PatientRecordProps {
  patient: PatientFormData;
  onSave?: (updatedPatient: PatientFormData) => void;
}

interface EditableFieldProps {
  label: string;
  value: string | number | boolean;
  onSave: (value: string) => void;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'boolean';
  className?: string;
}

function EditableField({ label, value, onSave, type = 'text', className }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  if (type === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onSave(e.target.checked.toString())}
          className="rounded border-gray-300"
        />
        <span>{value ? 'Sim' : 'Não'}</span>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between group">
        <span className="whitespace-pre-wrap">{value || '-'}</span>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      {type === 'textarea' ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="min-h-[100px]"
        />
      ) : (
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={className}
        />
      )}
      <div className="flex gap-1">
        <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
      <div className="font-medium text-gray-600">{label}:</div>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

const organOptions = [
  { value: "Heart", label: "Coração" },
  { value: "Kidney", label: "Rim" },
  { value: "Liver", label: "Fígado" },
] as const;

export function PatientRecord({ patient: initialPatient, onSave }: PatientRecordProps) {
  const [patient, setPatient] = useState(initialPatient);
  const [mainTab, setMainTab] = useState<'personal' | 'pre-tx' | 'post-tx'>('personal');

  const handleFieldUpdate = (path: string[], value: any) => {
    const newPatient = { ...patient };
    let current = newPatient;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setPatient(newPatient);
    onSave?.(newPatient);
  };

  return (
    <Tabs value={mainTab} onValueChange={(value: 'personal' | 'pre-tx' | 'post-tx') => setMainTab(value)} className="w-full">
      <TabsList className="flex w-full space-x-2 overflow-x-auto scrollbar-thin p-1 border-b">
        <TabsTrigger value="personal" className="min-w-[120px] shrink-0">Dados Pessoais</TabsTrigger>
        <TabsTrigger value="pre-tx" className="min-w-[120px] shrink-0">PRÉ TX</TabsTrigger>
        <TabsTrigger value="post-tx" className="min-w-[120px] shrink-0">PÓS TX</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataRow label="Órgão Alvo">
              <Select
                value={patient.organ}
                onValueChange={(value) => handleFieldUpdate(['organ'], value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o órgão" />
                </SelectTrigger>
                <SelectContent>
                  {organOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DataRow>
            <DataRow label="Nome">
              <EditableField
                label="Nome"
                value={patient.name}
                onSave={(value) => handleFieldUpdate(['name'], value)}
              />
            </DataRow>
            <DataRow label="Data de Nascimento">
              <EditableField
                label="Data de Nascimento"
                value={patient.birthDate}
                type="date"
                onSave={(value) => handleFieldUpdate(['birthDate'], value)}
              />
            </DataRow>
            <DataRow label="Sexo">
              <RadioGroup
                value={patient.gender}
                onValueChange={(value: 'M' | 'F') => handleFieldUpdate(['gender'], value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="gender-m" />
                  <Label htmlFor="gender-m">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="gender-f" />
                  <Label htmlFor="gender-f">Feminino</Label>
                </div>
              </RadioGroup>
            </DataRow>
            <DataRow label="Prontuário">
              <EditableField
                label="Prontuário"
                value={patient.recordNumber}
                onSave={(value) => handleFieldUpdate(['recordNumber'], value)}
              />
            </DataRow>
            <DataRow label="Nome da Mãe">
              <EditableField
                label="Nome da Mãe"
                value={patient.motherName}
                onSave={(value) => handleFieldUpdate(['motherName'], value)}
              />
            </DataRow>
            <DataRow label="CPF">
              <EditableField
                label="CPF"
                value={patient.cpf}
                onSave={(value) => handleFieldUpdate(['cpf'], value)}
              />
            </DataRow>
            <DataRow label="RG">
              <EditableField
                label="RG"
                value={patient.rg}
                onSave={(value) => handleFieldUpdate(['rg'], value)}
              />
            </DataRow>
            <DataRow label="Endereço">
              <EditableField
                label="Endereço"
                value={patient.address}
                onSave={(value) => handleFieldUpdate(['address'], value)}
              />
            </DataRow>
            <DataRow label="Cidade">
              <EditableField
                label="Cidade"
                value={patient.city}
                onSave={(value) => handleFieldUpdate(['city'], value)}
              />
            </DataRow>
            <DataRow label="Telefone">
              <EditableField
                label="Telefone"
                value={patient.phone}
                onSave={(value) => handleFieldUpdate(['phone'], value)}
              />
            </DataRow>

            <div className="space-y-4">
              <h3 className="font-medium">Fotos do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataRow label="Foto de Identificação">
                  <ImageUpload
                    image={patient.identificationPhoto}
                    onUpload={(file) => {
                      const newFile = {
                        name: file.name,
                        url: URL.createObjectURL(file),
                        type: file.type as "image/png" | "image/jpeg",
                        uploadedAt: new Date().toISOString()
                      };
                      handleFieldUpdate(['identificationPhoto'], newFile);
                    }}
                    onRemove={() => handleFieldUpdate(['identificationPhoto'], undefined)}
                    label="Foto de Identificação"
                  />
                </DataRow>
                <DataRow label="Foto do Abdômen">
                  <ImageUpload
                    image={patient.abdomenPhoto}
                    onUpload={(file) => {
                      const newFile = {
                        name: file.name,
                        url: URL.createObjectURL(file),
                        type: file.type as "image/png" | "image/jpeg",
                        uploadedAt: new Date().toISOString()
                      };
                      handleFieldUpdate(['abdomenPhoto'], newFile);
                    }}
                    onRemove={() => handleFieldUpdate(['abdomenPhoto'], undefined)}
                    label="Foto do Abdômen"
                  />
                </DataRow>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pre-tx">
        <Tabs defaultValue="clinical" className="w-full">
          <TabsList className="flex w-full space-x-2 overflow-x-auto scrollbar-thin p-1 border-b">
            <TabsTrigger value="clinical" className="min-w-[160px] shrink-0">História Clínica</TabsTrigger>
            <TabsTrigger value="physical" className="min-w-[160px] shrink-0">Exame Físico</TabsTrigger>
            <TabsTrigger value="vaccines" className="min-w-[160px] shrink-0">Vacinas</TabsTrigger>
            <TabsTrigger value="assessment" className="min-w-[160px] shrink-0">Avaliação</TabsTrigger>
            <TabsTrigger value="lab-results" className="min-w-[160px] shrink-0">Exames</TabsTrigger>
          </TabsList>

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>História Clínica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <DataRow label="História da Doença Atual">
                    <EditableField
                      label="História da Doença Atual"
                      value={patient.currentDiseaseHistory}
                      type="textarea"
                      onSave={(value) => handleFieldUpdate(['currentDiseaseHistory'], value)}
                    />
                  </DataRow>
                  <DataRow label="Etiologia da Doença Hepática">
                    <EditableField
                      label="Etiologia da Doença Hepática"
                      value={patient.liverDiseaseEtiology}
                      type="textarea"
                      onSave={(value) => handleFieldUpdate(['liverDiseaseEtiology'], value)}
                    />
                  </DataRow>
                  <DataRow label="Comorbidades Prévias">
                    <EditableField
                      label="Comorbidades Prévias"
                      value={patient.previousComorbidities}
                      type="textarea"
                      onSave={(value) => handleFieldUpdate(['previousComorbidities'], value)}
                    />
                  </DataRow>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical">
            <Card>
              <CardHeader>
                <CardTitle>Exame Físico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <DataRow label="Ectoscopia">
                    <EditableField
                      label="Ectoscopia"
                      value={patient.ectoscopy}
                      type="textarea"
                      onSave={(value) => handleFieldUpdate(['ectoscopy'], value)}
                    />
                  </DataRow>
                  <div className="space-y-4">
                    <h3 className="font-medium">Tórax</h3>
                    <DataRow label="Exame">
                      <EditableField
                        label="Exame"
                        value={patient.chest.examination}
                        type="textarea"
                        onSave={(value) => handleFieldUpdate(['chest', 'examination'], value)}
                      />
                    </DataRow>
                    <DataRow label="Frequência Cardíaca">
                      <EditableField
                        label="Frequência Cardíaca"
                        value={patient.chest.heartRate}
                        type="number"
                        onSave={(value) => handleFieldUpdate(['chest', 'heartRate'], parseInt(value))}
                      />
                    </DataRow>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Abdômen</h3>
                    <DataRow label="Inspeção">
                      <EditableField
                        label="Inspeção"
                        value={patient.abdomen.inspection}
                        type="textarea"
                        onSave={(value) => handleFieldUpdate(['abdomen', 'inspection'], value)}
                      />
                    </DataRow>
                    <DataRow label="Palpação">
                      <EditableField
                        label="Palpação"
                        value={patient.abdomen.palpation}
                        type="textarea"
                        onSave={(value) => handleFieldUpdate(['abdomen', 'palpation'], value)}
                      />
                    </DataRow>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines">
            <Card>
              <CardHeader>
                <CardTitle>Vacinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <DataRow label="Pneumo">
                    <EditableField label="Pneumo" value={patient.vaccines.pneumo} type="boolean"
                      onSave={(value) => handleFieldUpdate(['vaccines', 'pneumo'], value === 'true')} />
                  </DataRow>
                  <DataRow label="Influenza">
                    <EditableField label="Influenza" value={patient.vaccines.influenza} type="boolean"
                      onSave={(value) => handleFieldUpdate(['vaccines', 'influenza'], value === 'true')} />
                  </DataRow>
                  <DataRow label="Hepatite B">
                    <EditableField label="Hepatite B" value={patient.vaccines.hepatitisB} type="boolean"
                      onSave={(value) => handleFieldUpdate(['vaccines', 'hepatitisB'], value === 'true')} />
                  </DataRow>
                  <DataRow label="Hepatite A">
                    <EditableField label="Hepatite A" value={patient.vaccines.hepatitisA} type="boolean"
                      onSave={(value) => handleFieldUpdate(['vaccines', 'hepatitisA'], value === 'true')} />
                  </DataRow>
                  <DataRow label="dT">
                    <EditableField label="dT" value={patient.vaccines.dt} type="boolean"
                      onSave={(value) => handleFieldUpdate(['vaccines', 'dt'], value === 'true')} />
                  </DataRow>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle>Avaliação Multidisciplinar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <DataRow label="Enfermagem">
                    <EditableField label="Enfermagem" value={patient.assessment.nursing} type="textarea"
                      onSave={(value) => handleFieldUpdate(['assessment', 'nursing'], value)} />
                  </DataRow>
                  <DataRow label="Serviço Social">
                    <EditableField label="Serviço Social" value={patient.assessment.socialService} type="textarea"
                      onSave={(value) => handleFieldUpdate(['assessment', 'socialService'], value)} />
                  </DataRow>
                  <DataRow label="Psicologia">
                    <EditableField label="Psicologia" value={patient.assessment.psychology} type="textarea"
                      onSave={(value) => handleFieldUpdate(['assessment', 'psychology'], value)} />
                  </DataRow>
                  <DataRow label="Odontologia">
                    <EditableField label="Odontologia" value={patient.assessment.dentistry} type="textarea"
                      onSave={(value) => handleFieldUpdate(['assessment', 'dentistry'], value)} />
                  </DataRow>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab-results">
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Exames</CardTitle>
              </CardHeader>
              <CardContent>
                <LabResults
                  results={patient.labResults}
                  onUpdate={(results) => handleFieldUpdate(['labResults'], results)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="post-tx">
        <PostTxForm 
          patient={patient} 
          onUpdate={(updatedPatient) => {
            setPatient(updatedPatient);
            onSave?.(updatedPatient);
          }} 
        />
      </TabsContent>
    </Tabs>
  );
}
