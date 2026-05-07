import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, type PatientFormData } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabResults } from '@/components/medical/LabResults';
import { FileUpload } from '@/components/ui/file-upload';
import { ImageUpload } from '@/components/ui/image-upload';
import { MeldNaCalculator } from '@/components/forms/meld-na-calculator';

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmit: (data: PatientFormData) => void;
}

const organOptions = [
  { value: "Heart", label: "Coração" },
  { value: "Kidney", label: "Rim" },
  { value: "Liver", label: "Fígado" },
] as const;

const statusOptions = [
  { value: "critical", label: "Crítico" },
  { value: "stable", label: "Estável" },
  { value: "scheduled", label: "Agendado" },
] as const;

const priorityOptions = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
] as const;

const defaultValues: PatientFormData = {
  name: "", birthDate: "", gender: "M", recordNumber: "", motherName: "",
  consultationDate: new Date().toISOString().split('T')[0],
  cpf: "", rg: "", cnes: "", address: "", neighborhood: "", city: "", zipCode: "",
  age: 0, maritalStatus: "", phone: "", birthPlace: "", weight: 0, height: 0,
  profession: "", race: "", bloodType: "", doctor: "", meldNa: 0,
  txRegistration: "", rgct: "", currentDiseaseHistory: "", liverDiseaseEtiology: "",
  previousComorbidities: "", medications: "", surgicalHistory: "", familyHistory: "",
  smoking: { status: "no", packsPerDay: 0, yearsSmoked: 0, yearsStopped: 0 },
  alcohol: { status: "no", beverageType: "", quantity: "", yearsConsuming: 0, yearsStopped: 0 },
  illicitDrugs: "", ectoscopy: "",
  chest: { examination: "", heartRate: 0, bloodPressure: "", respiratoryRate: 0 },
  abdomen: { inspection: "", palpation: "", percussion: "", auscultation: "" },
  conduct: "",
  vaccines: { pneumo: false, influenza: false, hepatitisB: false, hepatitisA: false, dt: false },
  assessment: { nursing: "", socialService: "", psychology: "", dentistry: "", cardiology: "", anesthesiology: "", surgery: "" },
};

export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || defaultValues,
  });

  const smokingStatus = watch('smoking.status');
  const alcoholStatus = watch('alcohol.status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="flex w-full space-x-2 overflow-x-auto p-1 border-b">
          <TabsTrigger value="personal" className="min-w-[120px]">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="pre-tx" className="min-w-[120px]">PRÉ TX</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Órgão para Transplante</Label>
                  <Select defaultValue={initialData?.organ} onValueChange={(value) => setValue('organ', value as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o órgão" /></SelectTrigger>
                    <SelectContent>
                      {organOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={initialData?.status} onValueChange={(value) => setValue('status', value as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select defaultValue={initialData?.priority} onValueChange={(value) => setValue('priority', value as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecione a prioridade" /></SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...register("name")} error={errors.name?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" {...register("birthDate")} error={errors.birthDate?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <RadioGroup defaultValue={initialData?.gender || "M"}
                    onValueChange={(value) => register("gender").onChange({ target: { value } })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="gender-m" />
                      <Label htmlFor="gender-m">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="gender-f" />
                      <Label htmlFor="gender-f">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recordNumber">Prontuário</Label>
                  <Input id="recordNumber" {...register("recordNumber")} error={errors.recordNumber?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Nome da Mãe</Label>
                  <Input id="motherName" {...register("motherName")} error={errors.motherName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationDate">Data da Consulta</Label>
                  <Input id="consultationDate" type="date" {...register("consultationDate")} error={errors.consultationDate?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" {...register("cpf")} error={errors.cpf?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" {...register("rg")} error={errors.rg?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnes">CNES</Label>
                  <Input id="cnes" {...register("cnes")} error={errors.cnes?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" {...register("address")} error={errors.address?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" {...register("neighborhood")} error={errors.neighborhood?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city")} error={errors.city?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" {...register("zipCode")} error={errors.zipCode?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input id="age" type="number" {...register("age", { valueAsNumber: true })} error={errors.age?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Input id="maritalStatus" {...register("maritalStatus")} error={errors.maritalStatus?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...register("phone")} error={errors.phone?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Naturalidade</Label>
                  <Input id="birthPlace" {...register("birthPlace")} error={errors.birthPlace?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" step="0.1" {...register("weight", { valueAsNumber: true })} error={errors.weight?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input id="height" type="number" {...register("height", { valueAsNumber: true })} error={errors.height?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão</Label>
                  <Input id="profession" {...register("profession")} error={errors.profession?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="race">Raça</Label>
                  <Input id="race" {...register("race")} error={errors.race?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                  <Input id="bloodType" {...register("bloodType")} error={errors.bloodType?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Médico</Label>
                  <Input id="doctor" {...register("doctor")} error={errors.doctor?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="txRegistration">Inscrição Tx</Label>
                  <Input id="txRegistration" {...register("txRegistration")} error={errors.txRegistration?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgct">RGCT</Label>
                  <Input id="rgct" {...register("rgct")} error={errors.rgct?.message} />
                </div>
              </div>

              <div className="mt-6">
                <MeldNaCalculator
                  value={watch('meldNa') || 0}
                  labResults={watch('labResults')}
                  onChange={(value) => setValue('meldNa', value)}
                  error={errors.meldNa?.message}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pre-tx">
          <Tabs defaultValue="clinical" className="w-full">
            <div className="relative">
              <TabsList className="flex w-full space-x-2 overflow-x-auto scrollbar-thin p-1 border-b">
                <TabsTrigger value="clinical" className="min-w-[160px] shrink-0">História Clínica</TabsTrigger>
                <TabsTrigger value="clinical-advanced" className="min-w-[180px] shrink-0">Dados Clínicos Avançados</TabsTrigger>
                <TabsTrigger value="physical" className="min-w-[160px] shrink-0">Exame Físico</TabsTrigger>
                <TabsTrigger value="vaccines" className="min-w-[160px] shrink-0">Vacinas</TabsTrigger>
                <TabsTrigger value="assessment" className="min-w-[160px] shrink-0">Avaliação</TabsTrigger>
                <TabsTrigger value="lab-results" className="min-w-[160px] shrink-0">Exames</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="clinical">
              <Card>
                <CardHeader><CardTitle>História Clínica</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentDiseaseHistory">História da Doença Atual</Label>
                      <Textarea id="currentDiseaseHistory" {...register("currentDiseaseHistory")} error={errors.currentDiseaseHistory?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="liverDiseaseEtiology">Etiologia da Doença Hepática e complicações</Label>
                      <Textarea id="liverDiseaseEtiology" {...register("liverDiseaseEtiology")} error={errors.liverDiseaseEtiology?.message}
                        placeholder="Ascite/PBE, Encefalopatia, HDA, SHR, CHC, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousComorbidities">Comorbidades prévias / alergias / histórico</Label>
                      <Textarea id="previousComorbidities" {...register("previousComorbidities")} error={errors.previousComorbidities?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medications">Medicamentos em Uso</Label>
                      <Textarea id="medications" {...register("medications")} error={errors.medications?.message}
                        placeholder="Nome, dose, frequência, tempo de uso" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surgicalHistory">Passado cirúrgico / traumáticos / internamentos</Label>
                      <Textarea id="surgicalHistory" {...register("surgicalHistory")} error={errors.surgicalHistory?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="familyHistory">Antecedentes familiares</Label>
                      <Textarea id="familyHistory" {...register("familyHistory")} error={errors.familyHistory?.message} />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Tabagismo</h3>
                      <RadioGroup value={smokingStatus}
                        onValueChange={(value) => setValue('smoking.status', value as 'no' | 'yes' | 'former')}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="smoking-no" /><Label htmlFor="smoking-no">Não</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="smoking-yes" /><Label htmlFor="smoking-yes">Sim</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="former" id="smoking-former" /><Label htmlFor="smoking-former">Ex-fumante</Label></div>
                      </RadioGroup>
                      {(smokingStatus === 'yes' || smokingStatus === 'former') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smoking.packsPerDay">Maços por dia</Label>
                            <Input id="smoking.packsPerDay" type="number" step="0.5" {...register("smoking.packsPerDay", { valueAsNumber: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smoking.yearsSmoked">Anos fumando</Label>
                            <Input id="smoking.yearsSmoked" type="number" {...register("smoking.yearsSmoked", { valueAsNumber: true })} />
                          </div>
                          {smokingStatus === 'former' && (
                            <div className="space-y-2">
                              <Label htmlFor="smoking.yearsStopped">Anos que parou</Label>
                              <Input id="smoking.yearsStopped" type="number" {...register("smoking.yearsStopped", { valueAsNumber: true })} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Álcool</h3>
                      <RadioGroup value={alcoholStatus}
                        onValueChange={(value) => setValue('alcohol.status', value as 'no' | 'yes' | 'former')}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="alcohol-no" /><Label htmlFor="alcohol-no">Não</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="alcohol-yes" /><Label htmlFor="alcohol-yes">Sim</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="former" id="alcohol-former" /><Label htmlFor="alcohol-former">Ex-etilista</Label></div>
                      </RadioGroup>
                      {(alcoholStatus === 'yes' || alcoholStatus === 'former') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="alcohol.beverageType">Tipo de bebida</Label>
                            <Input id="alcohol.beverageType" {...register("alcohol.beverageType")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="alcohol.quantity">Quantidade</Label>
                            <Input id="alcohol.quantity" {...register("alcohol.quantity")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="alcohol.yearsConsuming">Anos consumindo</Label>
                            <Input id="alcohol.yearsConsuming" type="number" {...register("alcohol.yearsConsuming", { valueAsNumber: true })} />
                          </div>
                          {alcoholStatus === 'former' && (
                            <div className="space-y-2">
                              <Label htmlFor="alcohol.yearsStopped">Anos que parou</Label>
                              <Input id="alcohol.yearsStopped" type="number" {...register("alcohol.yearsStopped", { valueAsNumber: true })} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="illicitDrugs">Drogas ilícitas</Label>
                      <Textarea id="illicitDrugs" {...register("illicitDrugs")} error={errors.illicitDrugs?.message} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clinical-advanced">
              <Card>
                <CardHeader><CardTitle>Dados Clínicos Avançados para Análise de Transplante</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Informação:</strong> Estes dados serão utilizados no algoritmo avançado de análise de viabilidade do transplante hepático.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="renalDiseaseCreatinine">Creatinina Sérica (mg/dL)</Label>
                      <Input id="renalDiseaseCreatinine" type="number" step="0.1"
                        {...register("clinicalData.renalDiseaseCreatinine", { valueAsNumber: true })}
                        placeholder="Ex: 1.2" />
                      <p className="text-xs text-gray-500">Valores normais: 0.7 - 1.3 mg/dL</p>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="collateralCirculation"
                          {...register("clinicalData.collateralCirculation")}
                          className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor="collateralCirculation" className="font-medium">Circulação Colateral Presente</Label>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="hepatocellularCarcinoma"
                          {...register("clinicalData.hepatocellularCarcinoma")}
                          className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor="hepatocellularCarcinoma" className="font-medium">Hepatocarcinoma / Câncer de Fígado</Label>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2">Resumo dos Dados do Receptor</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm text-yellow-800">
                      <div><span className="font-medium">Idade:</span> {watch('age')} anos</div>
                      <div><span className="font-medium">Sexo:</span> {watch('gender') === 'M' ? 'Masculino' : 'Feminino'}</div>
                      <div><span className="font-medium">Peso:</span> {watch('weight')} kg</div>
                      <div><span className="font-medium">Altura:</span> {watch('height')} cm</div>
                      <div><span className="font-medium">MELD-Na:</span> {watch('meldNa')}</div>
                      <div><span className="font-medium">Tipo Sanguíneo:</span> {watch('bloodType')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical">
              <Card>
                <CardHeader><CardTitle>Exame Físico</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ectoscopy">Ectoscopia / Odontologia</Label>
                      <Textarea id="ectoscopy" {...register("ectoscopy")} error={errors.ectoscopy?.message} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Tórax</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="chest.examination">ACV e AR</Label>
                          <Textarea id="chest.examination" {...register("chest.examination")} error={errors.chest?.examination?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chest.heartRate">Frequência Cardíaca (bpm)</Label>
                          <Input id="chest.heartRate" type="number" {...register("chest.heartRate", { valueAsNumber: true })} error={errors.chest?.heartRate?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chest.bloodPressure">PA (mmHg)</Label>
                          <Input id="chest.bloodPressure" {...register("chest.bloodPressure")} error={errors.chest?.bloodPressure?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chest.respiratoryRate">Frequência Respiratória (irpm)</Label>
                          <Input id="chest.respiratoryRate" type="number" {...register("chest.respiratoryRate", { valueAsNumber: true })} error={errors.chest?.respiratoryRate?.message} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Abdômen</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="abdomen.inspection">Inspeção</Label>
                          <Textarea id="abdomen.inspection" {...register("abdomen.inspection")} error={errors.abdomen?.inspection?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abdomen.palpation">Palpação</Label>
                          <Textarea id="abdomen.palpation" {...register("abdomen.palpation")} error={errors.abdomen?.palpation?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abdomen.percussion">Percussão</Label>
                          <Textarea id="abdomen.percussion" {...register("abdomen.percussion")} error={errors.abdomen?.percussion?.message} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abdomen.auscultation">Ausculta</Label>
                          <Textarea id="abdomen.auscultation" {...register("abdomen.auscultation")} error={errors.abdomen?.auscultation?.message} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conduct">Conduta</Label>
                      <Textarea id="conduct" {...register("conduct")} error={errors.conduct?.message} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Anexos do Exame Físico</h3>
                      <FileUpload
                        files={watch('physicalExamFiles') || []}
                        onUpload={(files) => {
                          const newFiles = files.map(file => ({
                            name: file.name,
                            url: URL.createObjectURL(file),
                            type: file.type as "application/pdf" | "image/png" | "image/jpeg",
                            uploadedAt: new Date().toISOString()
                          }));
                          setValue('physicalExamFiles', [...(watch('physicalExamFiles') || []), ...newFiles]);
                        }}
                        onRemove={(file) => {
                          setValue('physicalExamFiles', (watch('physicalExamFiles') || []).filter(f => f.url !== file.url));
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Fotos do Paciente</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Foto de Identificação</Label>
                          <ImageUpload
                            image={watch('identificationPhoto')}
                            onUpload={(file) => {
                              setValue('identificationPhoto', {
                                name: file.name,
                                url: URL.createObjectURL(file),
                                type: file.type as "image/png" | "image/jpeg",
                                uploadedAt: new Date().toISOString()
                              });
                            }}
                            onRemove={() => setValue('identificationPhoto', undefined)}
                            label="Foto de Identificação"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Foto do Abdômen</Label>
                          <ImageUpload
                            image={watch('abdomenPhoto')}
                            onUpload={(file) => {
                              setValue('abdomenPhoto', {
                                name: file.name,
                                url: URL.createObjectURL(file),
                                type: file.type as "image/png" | "image/jpeg",
                                uploadedAt: new Date().toISOString()
                              });
                            }}
                            onRemove={() => setValue('abdomenPhoto', undefined)}
                            label="Foto do Abdômen"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vaccines">
              <Card>
                <CardHeader><CardTitle>Vacinas</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ key: 'pneumo', label: 'Pneumo' }, { key: 'influenza', label: 'Influenza' },
                      { key: 'hepatitisB', label: 'Hepatite B' }, { key: 'hepatitisA', label: 'Hepatite A' },
                      { key: 'dt', label: 'dT' }].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input type="checkbox" id={`vaccines.${key}`}
                          {...register(`vaccines.${key}` as any)}
                          className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor={`vaccines.${key}`}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment">
              <Card>
                <CardHeader><CardTitle>Avaliação Multidisciplinar</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[{ key: 'nursing', label: 'Enfermagem' }, { key: 'socialService', label: 'Serviço Social' },
                      { key: 'psychology', label: 'Psicologia' }, { key: 'dentistry', label: 'Odontologia' },
                      { key: 'cardiology', label: 'Cardiologia' }, { key: 'anesthesiology', label: 'Anestesiologia' },
                      { key: 'surgery', label: 'Cirurgia' }].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`assessment.${key}`}>{label}</Label>
                        <Textarea id={`assessment.${key}`}
                          {...register(`assessment.${key}` as any)}
                          error={(errors.assessment as any)?.[key]?.message} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-results">
              <Card>
                <CardHeader><CardTitle>Resultados de Exames</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Anexos de Exames</h3>
                      <FileUpload
                        files={watch('otherExamFiles') || []}
                        onUpload={(files) => {
                          const newFiles = files.map(file => ({
                            name: file.name,
                            url: URL.createObjectURL(file),
                            type: file.type as "application/pdf" | "image/png" | "image/jpeg",
                            uploadedAt: new Date().toISOString()
                          }));
                          setValue('otherExamFiles', [...(watch('otherExamFiles') || []), ...newFiles]);
                        }}
                        onRemove={(file) => {
                          setValue('otherExamFiles', (watch('otherExamFiles') || []).filter(f => f.url !== file.url));
                        }}
                      />
                    </div>
                    <LabResults
                      results={watch('labResults')}
                      onUpdate={(results) => setValue('labResults', results)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
