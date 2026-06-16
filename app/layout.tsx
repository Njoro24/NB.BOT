import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nabo Capital",
  description: "Your investment partner in Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <script src="/nabo-companion.js" defer></script>
      </body>
    </html>
  );
}
