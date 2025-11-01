import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { ArrowRight, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="relative py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center sm:mx-auto sm:w-10/12 lg:mt-0 lg:mr-auto lg:w-4/5">
              <Link href="/" className="mx-auto flex w-fit items-center gap-2 rounded-(--radius) border p-1 pr-3">
                <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                <span className="text-sm">Community Launch 2025</span>
                <span className="block h-4 w-px bg-(--color-border)"></span>

                <ArrowRight className="size-4" />
              </Link>

              <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                Where Developers <br /> Share Their Stories
              </h1>
              <p className="mx-auto mt-8 hidden max-w-2xl text-lg text-wrap sm:block">
                {APP_NAME} is a thriving community platform where developers connect, share insights, and inspire each
                other through their experiences and thoughts. Join the conversation today.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                Connect with developers worldwide. Share your insights, learn from others, and grow together in our
                vibrant community.
              </p>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    <Rocket className="relative size-4" />
                    <span className="text-nowrap">Join the Community</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
