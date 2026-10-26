import type { Metadata } from "next";

import "@car-cutter/demo/styles.css";

export const metadata: Metadata = {
  title: "Next.js · CarCutter WebPlayer demo",
  description: "Test page for @car-cutter/next-webplayer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
