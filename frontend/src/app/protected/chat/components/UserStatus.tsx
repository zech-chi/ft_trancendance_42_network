// component  user status

// import types
import React from "react";
import {Contact} from "../types/typesChat";

function formatLastSeenDate(time: number | Date): string {
  const date = new Date(time);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Check if the date is today
  if (isSameDay(date, now)) {
    return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Check if the date was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Check if the date was within the last 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  if (date > sevenDaysAgo) {
    // Return the day of the week, e.g., "Tuesday"
    return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  // For anything older, return the full date
  //"10/27/2023"
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UserStatus({ user }: { user: Contact }) {
  let statusText: string;
  let statusColor: string = "text-gray-400";
  
  // it user null return 
  if (!user) {
    return ;
  }

  if (user.online) {
    statusText = "Online";
    statusColor = "text-green-500";
  } else if (user.lastSeen) {
    // call Format the last seen date function
    statusText = `last seen ${formatLastSeenDate(user.lastSeen)}`;
  } else {
    statusText = "Offline";
  }

  return <p className={`text-[12px] md:text-sm ${statusColor}`}>{statusText}</p>;
}