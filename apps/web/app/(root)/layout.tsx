import React from "react";

import FooterSection from "@/components/app/footer";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
      <FooterSection />
    </>
  );
}
