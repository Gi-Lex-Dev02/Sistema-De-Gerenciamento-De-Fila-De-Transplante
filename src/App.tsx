import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatients } from '@/lib/context/PatientContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LiverIcon, KidneyIcon, HeartIcon } from '@/components/ui/organ-icons';
import type { PatientFormData } from '@/lib/schemas';

const organIcons = {
  'Heart': HeartIcon,
  'Kidney': KidneyIcon,
  'Liver': LiverIcon,
} as const;

const statusColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  stable: 'bg-green-100 text-green-800 border-green-200',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
} as const;

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
} as const;

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'critical', label: 'Crítico' },
  { value: 'stable', label: 'Estável' },
  { value: 'scheduled', label: 'Agendado' },
];

const priorityOptions = [
  { value: 'all', label: 'Todas as Prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

function OrganBadge({ organ }: { organ: keyof typeof organIcons }) {
  const Icon = organIcons[organ];
  return (
    <Badge variant="outline" className="flex items-center gap-1 text-gray-700">
      <Icon className="h-3 w-3" />
      {organ}
    </Badge>
  );
}

function StatusBadge({ status }: { status: keyof typeof statusColors }) {
  return (
    <Badge variant="outline" className={cn('font-medium', statusColors[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { patients } = usePatients();

  const filteredPatients = Object.entries(patients)
    .filter(([_, patient]) => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || patient.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => (b[1].meldNa || 0) - (a[1].meldNa || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:h-16 gap-4 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Transplant Queue Management
            </h1>
            <Link to="/patient/new">
              <Button className="w-full sm:w-auto flex items-center gap-2 justify-center">
                <Plus className="h-4 w-4" />
                Novo Paciente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar pacientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prioridade</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {filteredPatients.map(([id, patient]) => (
            <Link key={id} to={`/patient/${id}`}>
              <Card className={cn(
                "hover:shadow-lg transition-shadow border-l-4",
                patient.priority ? priorityColors[patient.priority] : 'border-l-gray-500'
              )}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                        <p className="text-sm text-gray-500">
                          {patient.age} anos • {patient.bloodType}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {patient.organ && <OrganBadge organ={patient.organ} />}
                        {patient.status && <StatusBadge status={patient.status} />}
                      </div>
                    </div>
                    <div className="text-left sm:text-right space-y-2">
                      <div className="text-sm font-medium text-gray-900">
                        MELD-Na: {patient.meldNa || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 break-words">
                        {patient.liverDiseaseEtiology ? (
                          <span title={patient.liverDiseaseEtiology}>
                            {patient.liverDiseaseEtiology.length > 50
                              ? `${patient.liverDiseaseEtiology.slice(0, 50)}...`
                              : patient.liverDiseaseEtiology}
                          </span>
                        ) : 'Sem etiologia registrada'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
