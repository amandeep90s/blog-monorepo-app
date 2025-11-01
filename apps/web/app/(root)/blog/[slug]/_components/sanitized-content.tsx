"use client";

import sanitizeHtml from "sanitize-html";

type SanitizedContentProps = {
  htmlContent: string;
  className?: string;
};

export default function SanitizedContent({ htmlContent }: SanitizedContentProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(htmlContent, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1"]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "title", "width", "height"],
          },
        }),
      }}
    />
  );
}
