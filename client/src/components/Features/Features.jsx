import { Calendar, CalendarSearch, MessageSquareDot, Star, UsersRound, Zap } from "lucide-react";
import React from "react";

export default function Features() {
  const features = [
    {
      icon: <CalendarSearch className="size-8"/>,
      heading: "Easy Event Discovery",
      content:
        "Explore upcoming college events, workshops, and club activities in one place.",
    },
    {
      icon: <Zap className="size-8"/>,
      heading: "Quick Registrations",
      content:
        "Register for events directly through the platform with a simple process.",
    },
    {
      icon: <UsersRound className="size-8"/>,
      heading: "Club Engagement",
      content:
        "View details of different clubs, join them, and participate in their activities.",
    },
    {
      icon: <Calendar className="size-8"/>,
      heading: "Event Calendar",
      content:
        "Stay organized with a clear view of all upcoming events and deadlines.",
    },
    {
      icon: <MessageSquareDot className="size-8"/>,
      heading: "Interactive Forums",
      content:
        "Connect with peers, share ideas, and discuss events with fellow participants.",
    },
    {
      icon: <Star className="size-8" />,
      heading: "Feedback & Ratings",
      content:
        "Provide feedback after events to help improve future experiences.",
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {features.map((feature, index) => {
        return (
          <div key={index} className="px-8 py-8 flex rounded-xl bg-indigo-800/10 hover:drop-shadow-2xl hover:bg-indigo-500/60 border border-indigo-400/50 hover:scale-102 transition-all duration-200 items-center gap-4 cursor-default">
            <i className="size-10">{feature.icon}</i>
            <div className="flex flex-col">
              <h1 className="text-xl">{feature.heading}</h1>
              <p>
                {feature.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
