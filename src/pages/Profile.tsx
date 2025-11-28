import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, School, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("Community High School");
  const { toast } = useToast();

  useEffect(() => {
    const teacherEmail = localStorage.getItem("teacherEmail");
    if (teacherEmail) {
      setEmail(teacherEmail);
    }
  }, []);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  School Name
                </Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Enter your school name"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your intervention history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-accent-foreground">24</p>
                <p className="text-sm text-muted-foreground">Students Monitored</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-accent-foreground">18</p>
                <p className="text-sm text-muted-foreground">Interventions Made</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-accent-foreground">12</p>
                <p className="text-sm text-muted-foreground">Students Improved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
