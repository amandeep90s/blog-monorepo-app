import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PostCardProps = {
  title: string;
  description: string;
  link?: string;
};

export default function PostCard({
  title,
  description,
  link = "https://github.com/meschacirung/cnblocks",
}: PostCardProps) {
  return (
    <Card className="p-6">
      <div className="relative">
        <div className="*:size-10">{/* TODO Image */}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button asChild variant="secondary" size="sm" className="gap-1 pr-2 shadow-none">
            <Link href={link}>
              Learn More
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
