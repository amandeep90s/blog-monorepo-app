import React from "react";

import FooterSection from "@/components/app/footer";
import HeaderWrapper from "@/components/app/header-wrapper";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <HeaderWrapper />
      {children}
      <FooterSection />
    </>
  );
}
