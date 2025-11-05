import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight } from "lucide-react";
import { Student } from "@/types/student";

interface StudentListProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export const StudentList = ({ students, onStudentClick }: StudentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === "all" || student.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

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
    <Card>
      <CardHeader>
        <CardTitle>Student Overview</CardTitle>
        <CardDescription>Track and manage student engagement</CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => onStudentClick(student)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-medium truncate">{student.name}</p>
                  <Badge variant={getRiskColor(student.riskLevel)} className="text-xs">
                    {student.riskLevel}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Grade {student.grade}</span>
                  <span>•</span>
                  <span>Attendance: {student.attendance}%</span>
                  <span>•</span>
                  <span>Last active: {student.lastActivity}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0 ml-2">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          ))}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
