import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Users, Shield, Camera, Mail, Trash2 } from "lucide-react";

const teamMembers = [
  { id: "1", name: "Jordan Davis", email: "jordan@hirefield.com", role: "Owner", avatar: "JD", status: "Active" },
  { id: "2", name: "Alex Rivera", email: "alex@hirefield.com", role: "Admin", avatar: "AR", status: "Active" },
  { id: "3", name: "Maya Thompson", email: "maya@hirefield.com", role: "Editor", avatar: "MT", status: "Active" },
  { id: "4", name: "Chris Lee", email: "chris@hirefield.com", role: "Viewer", avatar: "CL", status: "Invited" },
];

const roleColors: Record<string, string> = {
  Owner: "bg-accent/15 text-accent",
  Admin: "bg-info/15 text-info",
  Editor: "bg-warning/15 text-warning",
  Viewer: "bg-muted text-muted-foreground",
};

export default function Settings() {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    firstName: "Jordan",
    lastName: "Davis",
    email: "jordan@hirefield.com",
    jobTitle: "Head of Talent Acquisition",
    department: "Human Resources",
    timezone: "America/New_York",
  });

  const [notifications, setNotifications] = useState({
    emailNewCandidate: true,
    emailInterviewScheduled: true,
    emailStageChange: false,
    emailWeeklyDigest: true,
    pushNewCandidate: false,
    pushInterviewReminder: true,
    pushOfferAccepted: true,
    pushTeamMention: true,
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const handleProfileSave = () => {
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    toast({ title: "Invitation Sent", description: `Invitation sent to ${inviteEmail}` });
    setInviteEmail("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, notifications, and team</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xl font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent flex items-center justify-center shadow-md">
                    <Camera className="h-3.5 w-3.5 text-accent-foreground" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-muted-foreground">{profile.jobTitle}</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs h-7">
                    Upload Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">GMT (London)</SelectItem>
                    <SelectItem value="Europe/Berlin">CET (Berlin)</SelectItem>
                    <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleProfileSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you receive</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailNewCandidate" as const, label: "New Candidate Applied", desc: "When a new candidate applies to an open position" },
                { key: "emailInterviewScheduled" as const, label: "Interview Scheduled", desc: "When an interview is booked or rescheduled" },
                { key: "emailStageChange" as const, label: "Stage Changes", desc: "When a candidate moves to a new pipeline stage" },
                { key: "emailWeeklyDigest" as const, label: "Weekly Digest", desc: "Summary of hiring activity each Monday" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Push Notifications</CardTitle>
                  <CardDescription>In-app notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "pushNewCandidate" as const, label: "New Candidates", desc: "Notify for every new application" },
                { key: "pushInterviewReminder" as const, label: "Interview Reminders", desc: "15 minutes before scheduled interviews" },
                { key: "pushOfferAccepted" as const, label: "Offer Accepted", desc: "When a candidate accepts an offer" },
                { key: "pushTeamMention" as const, label: "Team Mentions", desc: "When a team member mentions you in a note" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invite Team Member</CardTitle>
              <CardDescription>Add colleagues to your hiring team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="inviteEmail">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleInvite}>
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
              <CardDescription>{teamMembers.length} members in your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-secondary text-xs font-medium">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            {member.status === "Invited" && (
                              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-warning/15 text-warning">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={roleColors[member.role]}>
                          {member.role === "Owner" && <Shield className="h-3 w-3 mr-1" />}
                          {member.role}
                        </Badge>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
