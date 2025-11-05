import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Users, CheckCircle } from "lucide-react";
import { Student } from "@/types/student";

interface StatsCardsProps {
  students: Student[];
}

export const StatsCards = ({ students }: StatsCardsProps) => {
  const highRiskCount = students.filter((s) => s.riskLevel === "high").length;
  const mediumRiskCount = students.filter((s) => s.riskLevel === "medium").length;
  const lowRiskCount = students.filter((s) => s.riskLevel === "low").length;
  const totalStudents = students.length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      description: "Under monitoring",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "High Risk",
      value: highRiskCount,
      icon: AlertTriangle,
      description: "Immediate attention needed",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Medium Risk",
      value: mediumRiskCount,
      icon: TrendingDown,
      description: "Monitor closely",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "On Track",
      value: lowRiskCount,
      icon: CheckCircle,
      description: "Performing well",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
