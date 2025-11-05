import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { StudentList } from "@/components/dashboard/StudentList";
import { Student } from "@/types/student";

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Aisha Kumar",
    riskLevel: "high",
    riskScore: 85,
    attendance: 65,
    assignmentCompletion: 45,
    lastActivity: "2 days ago",
    grade: "10th",
    interventionSuggestion: "Immediate mentor call + SMS reminder",
    riskFactors: ["Low attendance (65%)", "Missed 5 consecutive assignments", "No login in 3 days"],
    recommendedActivity: "Review basic algebra concepts",
  },
  {
    id: "2",
    name: "Rahul Patel",
    riskLevel: "medium",
    riskScore: 55,
    attendance: 78,
    assignmentCompletion: 70,
    lastActivity: "5 hours ago",
    grade: "9th",
    interventionSuggestion: "Send SMS reminder about upcoming deadline",
    riskFactors: ["Assignment completion declining", "Inconsistent login pattern"],
    recommendedActivity: "Practice exercises on geometry",
  },
  {
    id: "3",
    name: "Priya Sharma",
    riskLevel: "low",
    riskScore: 20,
    attendance: 95,
    assignmentCompletion: 92,
    lastActivity: "30 minutes ago",
    grade: "10th",
    interventionSuggestion: "Continue current engagement",
    riskFactors: [],
    recommendedActivity: "Advanced trigonometry challenges",
  },
  {
    id: "4",
    name: "Vikram Singh",
    riskLevel: "high",
    riskScore: 78,
    attendance: 70,
    assignmentCompletion: 50,
    lastActivity: "1 day ago",
    grade: "9th",
    interventionSuggestion: "Schedule parent meeting + mentor support",
    riskFactors: ["Multiple late submissions", "Declining test scores", "Low engagement"],
    recommendedActivity: "Foundational math review",
  },
  {
    id: "5",
    name: "Neha Reddy",
    riskLevel: "medium",
    riskScore: 45,
    attendance: 85,
    assignmentCompletion: 75,
    lastActivity: "3 hours ago",
    grade: "10th",
    interventionSuggestion: "Weekly check-in via SMS",
    riskFactors: ["Recent drop in participation"],
    recommendedActivity: "Statistics practice problems",
  },
  {
    id: "6",
    name: "Arjun Mehta",
    riskLevel: "low",
    riskScore: 15,
    attendance: 98,
    assignmentCompletion: 95,
    lastActivity: "1 hour ago",
    grade: "9th",
    interventionSuggestion: "Maintain current path",
    riskFactors: [],
    recommendedActivity: "Advanced calculus introduction",
  },
];

const Dashboard = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    navigate(`/student/${student.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor student engagement and intervention strategies
          </p>
        </div>

        <StatsCards students={students} />
        <StudentList students={students} onStudentClick={handleStudentClick} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
