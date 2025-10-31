import Link from "next/link";
import StackIcon from "tech-stack-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TechStacksSection() {
  return (
    <section>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center sm:grid-cols-2">
            <div className="dark:bg-muted/50 relative mx-auto w-fit">
              <div
                aria-hidden
                className="to-muted dark:to-background absolute inset-0 z-10 bg-radial from-transparent to-75%"
              />
              <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <StackIcon name="nextjs2" />
                </IntegrationCard>
                <IntegrationCard>
                  <StackIcon name="prisma" />
                </IntegrationCard>
              </div>
              <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <StackIcon name="nestjs" />
                </IntegrationCard>
                <IntegrationCard
                  borderClassName="shadow-black-950/10 shadow-xl border-black/25 dark:border-white/25"
                  className="dark:bg-white/10"
                >
                  <StackIcon name="typescript" />
                </IntegrationCard>
                <IntegrationCard>
                  <StackIcon name="graphql" />
                </IntegrationCard>
              </div>

              <div className="mx-auto flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <StackIcon name="postgresql" />
                </IntegrationCard>

                <IntegrationCard>
                  <StackIcon name="tailwindcss" />
                </IntegrationCard>
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
              <h2 className="text-3xl font-semibold text-balance md:text-4xl">Built with Modern Technologies</h2>
              <p className="text-muted-foreground">
                Powered by Next.js, NestJS, Prisma, and more. A full-stack TypeScript solution with GraphQL API,
                ensuring type-safety and exceptional developer experience.
              </p>

              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-up">Join the Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  borderClassName,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}) => {
  return (
    <div className={cn("bg-background relative flex size-20 rounded-xl dark:bg-transparent", className)}>
      <div
        role="presentation"
        className={cn("absolute inset-0 rounded-xl border border-black/20 dark:border-white/25", borderClassName)}
      />
      <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
    </div>
  );
};
