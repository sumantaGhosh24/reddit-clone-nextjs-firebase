import {CalendarIcon} from "lucide-react";

import {Card} from "@/components/ui/card";

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

const eventsData: CommunityEvent[] = [
  {
    id: "1",
    title: "Community Meeting",
    description:
      "Join us for our community meeting on Wednesday, July 15th at 10:00 AM.",
    startDate: new Date("2023-07-15T10:00:00"),
    endDate: new Date("2023-07-15T11:00:00"),
    location: "Online",
  },
  {
    id: "2",
    title: "Community Meeting",
    description:
      "Join us for our community meeting on Wednesday, July 15th at 10:00 AM.",
    startDate: new Date("2023-07-15T10:00:00"),
    endDate: new Date("2023-07-15T11:00:00"),
    location: "Online",
  },
  {
    id: "3",
    title: "Community Meeting",
    description:
      "Join us for our community meeting on Wednesday, July 15th at 10:00 AM.",
    startDate: new Date("2023-07-15T10:00:00"),
    endDate: new Date("2023-07-15T11:00:00"),
    location: "Online",
  },
];

export default function CommunityEvents() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
      </div>
      <div className="space-y-4">
        {eventsData.map((event) => (
          <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-muted-foreground">
              {event.startDate.toLocaleDateString()} -{" "}
              {event.endDate.toLocaleDateString()}
            </p>
            <p className="text-sm mt-1">{event.description}</p>
            {event.location && (
              <p className="text-sm text-muted-foreground mt-1">
                📍 {event.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
