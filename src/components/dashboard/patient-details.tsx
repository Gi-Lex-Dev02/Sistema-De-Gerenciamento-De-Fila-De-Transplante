import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageViewer } from '@/components/medical/ImageViewer';
import { Activity, Calendar, FileText, Heart, User } from 'lucide-react';

interface PatientDetailsProps {
  patient: {
    id: string;
    name: string;
    age: number;
    bloodType: string;
    organ: string;
    waitingTime: string;
    status: "critical" | "stable" | "scheduled";
    priority: "high" | "medium" | "low";
    medicalHistory?: string;
    nextAppointment?: string;
    recentTests?: Array<{
      id: string;
      name: string;
      date: string;
      result: string;
    }>;
  };
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm text-gray-500">{patient.age} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Blood Type</p>
                <p className="text-sm text-gray-500">{patient.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-gray-500">{patient.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Waiting Time</p>
                <p className="text-sm text-gray-500">{patient.waitingTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="medical-history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medical-history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FileText className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm">{patient.medicalHistory || 'No medical history available.'}</p>
                  </div>
                </div>
                {patient.recentTests && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Recent Tests</h4>
                    <div className="space-y-3">
                      {patient.recentTests.map(test => (
                        <div key={test.id} className="flex items-center justify-between text-sm">
                          <span>{test.name}</span>
                          <span className="text-gray-500">{test.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging">
          <Card>
            <CardHeader>
              <CardTitle>Medical Imaging</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageViewer 
                imageId="example://1" 
                className="rounded-lg overflow-hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Medical reports and documents will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
