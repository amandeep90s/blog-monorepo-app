import React from "react";

import FooterSection from "@/components/app/footer";
import HeaderSection from "@/components/app/header";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <HeaderSection />
      {children}
      <FooterSection />
    </>
  );
}
