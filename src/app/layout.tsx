import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const pretendard = localFont({
  src: [
    { path: "./fonts/Pretendard-Medium.subset.woff2", weight: "500" },
    { path: "./fonts/Pretendard-SemiBold.subset.woff2", weight: "600" },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "히든카이스 스토어",
  description: "히든카이스 교재와 패스 상품을 만나보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans font-medium">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
