import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { DonorData } from '@/lib/schemas';

const donorFormSchema = z.object({
  name: z.string().min(1, "Nome do doador é obrigatório"),
  age: z.number().min(0).max(150),
  gender: z.enum(["M", "F"]),
  weight: z.number().min(0),
  height: z.number().min(0),
  hepaticSteatosis: z.enum(["ausente", "leve", "moderada", "grave"]),
  activeInfections: z.boolean(),
  bloodType: z.string().optional(),
});

type DonorFormData = z.infer<typeof donorFormSchema>;

interface DonorFormProps {
  initialData?: DonorData;
  onSubmit: (data: DonorData) => void;
  onCancel?: () => void;
}

const defaultValues: DonorFormData = {
  name: "",
  age: 0,
  gender: "M",
  weight: 0,
  height: 0,
  hepaticSteatosis: "ausente",
  activeInfections: false,
  bloodType: "",
};

export function DonorForm({ initialData, onSubmit, onCancel }: DonorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: initialData || defaultValues,
  });

  const activeInfections = watch('activeInfections');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Doador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="donor-name">Nome do Doador</Label>
              <Input
                id="donor-name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Nome completo do doador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-age">Idade</Label>
              <Input
                id="donor-age"
                type="number"
                {...register("age", { valueAsNumber: true })}
                error={errors.age?.message}
                placeholder="Idade em anos"
              />
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <RadioGroup
                defaultValue={initialData?.gender || "M"}
                onValueChange={(value) => setValue("gender", value as "M" | "F")}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="donor-gender-m" />
                    <Label htmlFor="donor-gender-m">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="donor-gender-f" />
                    <Label htmlFor="donor-gender-f">Feminino</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-weight">Peso (kg)</Label>
              <Input
                id="donor-weight"
                type="number"
                step="0.1"
                {...register("weight", { valueAsNumber: true })}
                error={errors.weight?.message}
                placeholder="Peso em quilogramas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-height">Altura (cm)</Label>
              <Input
                id="donor-height"
                type="number"
                {...register("height", { valueAsNumber: true })}
                error={errors.height?.message}
                placeholder="Altura em centímetros"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-bloodType">Tipo Sanguíneo</Label>
              <Input
                id="donor-bloodType"
                {...register("bloodType")}
                placeholder="Ex: O+, A-, AB+"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-hepaticSteatosis">Esteatose Hepática</Label>
              <Select
                defaultValue={initialData?.hepaticSteatosis || "ausente"}
                onValueChange={(value) => setValue("hepaticSteatosis", value as any)}
              >
                <SelectTrigger id="donor-hepaticSteatosis">
                  <SelectValue placeholder="Selecione o grau de esteatose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ausente">Ausente</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="grave">Grave</SelectItem>
                </SelectContent>
              </Select>
              {errors.hepaticSteatosis && (
                <p className="text-sm text-red-500">{errors.hepaticSteatosis.message}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="donor-activeInfections"
                  {...register("activeInfections")}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="donor-activeInfections" className="font-medium">
                  Doador possui infecções ativas
                </Label>
              </div>
              {activeInfections && (
                <p className="text-sm text-red-600 font-medium">
                  ATENÇÃO: Infecções ativas no doador são fatores críticos de risco
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Salvar Dados do Doador</Button>
      </div>
    </form>
  );
}
