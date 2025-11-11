import React from "react";

type PostsLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function PostsLayout({ children, modal }: PostsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
