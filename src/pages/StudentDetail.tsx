import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle, CheckCircle2, TrendingDown, MessageSquare, Phone, Mail } from "lucide-react";
import { Student } from "@/types/student";

// Mock data - same as Dashboard
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

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find((s) => s.id === id);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Student not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
            <p className="text-muted-foreground">Grade {student.grade} • Last active {student.lastActivity}</p>
          </div>
          <Badge variant={getRiskColor(student.riskLevel)} className="text-sm px-3 py-1">
            {student.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Risk Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Risk Analysis
              </CardTitle>
              <CardDescription>Current dropout risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className="text-sm font-bold">{student.riskScore}%</span>
                </div>
                <Progress value={student.riskScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Key Risk Factors:</p>
                {student.riskFactors.length > 0 ? (
                  <ul className="space-y-2">
                    {student.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-success flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    No significant risk factors detected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Current academic standing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm font-bold">{student.attendance}%</span>
                </div>
                <Progress value={student.attendance} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Assignment Completion</span>
                  <span className="text-sm font-bold">{student.assignmentCompletion}%</span>
                </div>
                <Progress value={student.assignmentCompletion} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recommended Intervention Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Intervention</CardTitle>
              <CardDescription>AI-suggested next action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{student.interventionSuggestion}</p>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Student
                </Button>
                <Button size="sm" variant="secondary" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Send SMS
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email Parent
                </Button>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Override Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Learning Recommendation Card */}
          <Card>
            <CardHeader>
              <CardTitle>Next Learning Activity</CardTitle>
              <CardDescription>Adaptive curriculum recommendation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="font-medium text-accent-foreground">{student.recommendedActivity}</p>
              </div>
              
              <Button className="w-full">
                Assign Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetail;
