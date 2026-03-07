import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import {
  Calendar as CalendarIcon, Clock, User, Plus, Video, MapPin, Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const interviewers = [
  { id: "1", name: "Alex Rivera", role: "Engineering Manager", avatar: "AR", available: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
  { id: "2", name: "Morgan Lee", role: "Senior Developer", avatar: "ML", available: ["10:00", "11:00", "13:00", "14:00"] },
  { id: "3", name: "Jordan Kim", role: "Tech Lead", avatar: "JK", available: ["09:00", "11:00", "13:00", "15:00", "16:00"] },
  { id: "4", name: "Taylor Smith", role: "HR Director", avatar: "TS", available: ["09:00", "10:00", "11:00", "14:00"] },
];

const existingSlots = [
  { date: new Date(2026, 2, 9), time: "09:00", candidate: "Sarah Chen", interviewer: "Alex Rivera", type: "Technical", status: "Confirmed" },
  { date: new Date(2026, 2, 9), time: "14:00", candidate: "James Wilson", interviewer: "Morgan Lee", type: "Behavioral", status: "Pending" },
  { date: new Date(2026, 2, 10), time: "10:00", candidate: "Emily Park", interviewer: "Jordan Kim", type: "System Design", status: "Confirmed" },
  { date: new Date(2026, 2, 10), time: "15:00", candidate: "Michael Brown", interviewer: "Taylor Smith", type: "Cultural Fit", status: "Confirmed" },
  { date: new Date(2026, 2, 11), time: "11:00", candidate: "Lisa Zhang", interviewer: "Alex Rivera", type: "Technical", status: "Pending" },
  { date: new Date(2026, 2, 12), time: "13:00", candidate: "David Kim", interviewer: "Morgan Lee", type: "Technical", status: "Confirmed" },
  { date: new Date(2026, 2, 13), time: "09:00", candidate: "Anna Lee", interviewer: "Jordan Kim", type: "Final Round", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
};

const typeIcons: Record<string, typeof Video> = {
  Technical: Video,
  Behavioral: User,
  "System Design": MapPin,
  "Cultural Fit": User,
  "Final Round": Check,
};

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 9));
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ candidate: "", interviewer: "", time: "", type: "Technical" });

  const slotsForDate = existingSlots.filter((s) => isSameDay(s.date, selectedDate));
  const datesWithSlots = existingSlots.map((s) => s.date);

  const selectedInterviewer = interviewers.find((i) => i.id === bookingData.interviewer);

  const handleBook = () => {
    if (!bookingData.candidate || !bookingData.interviewer || !bookingData.time) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Interview Scheduled", description: `${bookingData.candidate} booked for ${format(selectedDate, "MMM d")} at ${bookingData.time}` });
    setBookingOpen(false);
    setBookingData({ candidate: "", interviewer: "", time: "", type: "Technical" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scheduling</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage interview slots and interviewer availability</p>
        </div>
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" /> Book Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book Interview — {format(selectedDate, "MMMM d, yyyy")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Candidate Name</Label>
                <Input
                  placeholder="Enter candidate name"
                  value={bookingData.candidate}
                  onChange={(e) => setBookingData({ ...bookingData, candidate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Interviewer</Label>
                <Select value={bookingData.interviewer} onValueChange={(v) => setBookingData({ ...bookingData, interviewer: v, time: "" })}>
                  <SelectTrigger><SelectValue placeholder="Select interviewer" /></SelectTrigger>
                  <SelectContent>
                    {interviewers.map((i) => (
                      <SelectItem key={i.id} value={i.id}>{i.name} — {i.role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedInterviewer && (
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterviewer.available.map((t) => (
                      <Button
                        key={t}
                        size="sm"
                        variant={bookingData.time === t ? "default" : "outline"}
                        className={bookingData.time === t ? "bg-accent text-accent-foreground" : ""}
                        onClick={() => setBookingData({ ...bookingData, time: t })}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select value={bookingData.type} onValueChange={(v) => setBookingData({ ...bookingData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Technical", "Behavioral", "System Design", "Cultural Fit", "Final Round"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleBook} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{ hasSlot: datesWithSlots }}
              modifiersClassNames={{ hasSlot: "bg-accent/15 font-bold text-accent" }}
            />
          </CardContent>
        </Card>

        {/* Day Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-accent" />
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
                <Badge variant="secondary" className="ml-auto">{slotsForDate.length} interviews</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {slotsForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No interviews scheduled for this date.</p>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {slotsForDate.map((slot, i) => {
                      const Icon = typeIcons[slot.type] || Video;
                      return (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="text-center min-w-[50px]">
                            <p className="text-sm font-semibold">{slot.time}</p>
                            <p className="text-[10px] text-muted-foreground">1 hr</p>
                          </div>
                          <div className="h-10 w-px bg-border" />
                          <div className="p-2 rounded-lg bg-accent/10">
                            <Icon className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{slot.candidate}</p>
                            <p className="text-xs text-muted-foreground">{slot.type} · {slot.interviewer}</p>
                          </div>
                          <Badge variant="secondary" className={statusStyles[slot.status] || ""}>
                            {slot.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Interviewer Availability */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-accent" /> Interviewer Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interviewers.map((interviewer) => (
                  <div key={interviewer.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                      {interviewer.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{interviewer.name}</p>
                      <p className="text-xs text-muted-foreground">{interviewer.role}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {interviewer.available.map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
