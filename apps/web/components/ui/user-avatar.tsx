"use client";

import * as React from "react";
import { User as UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  showIcon?: boolean;
}

export function UserAvatar({ src, alt = "User", fallback, showIcon = false, className, ...props }: UserAvatarProps) {
  // Generate initials from alt text if no fallback provided
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = fallback || (alt !== "User" ? getInitials(alt) : "");

  return (
    <Avatar className={cn("", className)} {...props}>
      <AvatarImage
        src={src || undefined}
        alt={alt}
        onError={(e) => {
          // Hide broken images gracefully
          e.currentTarget.style.display = "none";
        }}
      />
      <AvatarFallback className="bg-muted text-muted-foreground">
        {initials || (showIcon ? <UserIcon className="h-4 w-4" /> : "U")}
      </AvatarFallback>
    </Avatar>
  );
}
