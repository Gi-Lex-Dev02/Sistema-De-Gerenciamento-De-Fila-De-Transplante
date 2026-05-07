import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Heart, User } from "lucide-react";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    bloodType: string;
    organ: string;
    waitingTime: string;
    status: "critical" | "stable" | "scheduled";
    priority: "high" | "medium" | "low";
  };
}

export function PatientCard({ patient }: PatientCardProps) {
  const statusColors = {
    critical: "text-red-500",
    stable: "text-green-500",
    scheduled: "text-blue-500",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{patient.name}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[patient.priority]}`}>
            {patient.priority.toUpperCase()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.age} years • {patient.bloodType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.organ}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.waitingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className={`text-sm ${statusColors[patient.status]}`}>
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
