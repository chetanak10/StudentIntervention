export interface Student {
  id: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  attendance: number;
  assignmentCompletion: number;
  lastActivity: string;
  grade: string;
  interventionSuggestion: string;
  riskFactors: string[];
  recommendedActivity: string;
}
