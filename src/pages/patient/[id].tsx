import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PatientForm } from '@/components/forms/patient-form';
import { PatientRecord } from '@/components/patient/PatientRecord';
import { Button } from '@/components/ui/button';
import { FileEdit, Eye, ArrowLeft } from 'lucide-react';
import { usePatients } from '@/lib/context/PatientContext';
import type { PatientFormData } from '@/lib/schemas';

export default function PatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'view' | 'edit'>(id ? 'view' : 'edit');
  const { patients, updatePatient, addPatient } = usePatients();
  
  const patient = id ? patients[id] : undefined;

  const handleSave = (data: PatientFormData) => {
    if (id) {
      updatePatient(id, data);
      setMode('view');
    } else {
      const newId = addPatient(data);
      navigate(`/patient/${newId}`);
    }
  };

  if (id && !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paciente não encontrado</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {id ? `Paciente: ${patient?.name}` : 'Novo Paciente'}
              </h1>
            </div>
            {id && (
              <Button
                onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}
                variant="outline"
                className="flex items-center gap-2"
              >
                {mode === 'view' ? (
                  <>
                    <FileEdit className="h-4 w-4" />
                    Editar
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'edit' || !id ? (
          <PatientForm 
            initialData={patient} 
            onSubmit={handleSave}
          />
        ) : patient ? (
          <PatientRecord 
            patient={patient} 
            onSave={(updatedData) => {
              updatePatient(id, updatedData);
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
