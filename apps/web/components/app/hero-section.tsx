"use client";

import React from "react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { ArrowRight, Menu, Rocket, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoIcon } from "@/components/app/logo";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
];

export default function HeroSection() {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link href="/" aria-label="home" className="flex items-center space-x-2">
                  <LogoIcon />
                  <span className="text-foreground text-xl font-medium dark:text-white">{APP_NAME}</span>
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                  <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
                </button>
              </div>

              <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <ThemeToggle />
                  <Button asChild variant="outline" size="default">
                    <Link href="/sign-in">
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button asChild size="default">
                    <Link href="/sign-up">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
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
    </>
  );
}
