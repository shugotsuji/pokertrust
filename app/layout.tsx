import "./globals.css";   
export const metadata = { title: "PokerTrust Demo" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
