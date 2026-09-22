import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@/styles/legacy/init.css";
import "@/styles/legacy/fonts.css";
import "@/styles/legacy/animations.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "@/styles/legacy/style.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InquiryFab } from "@/components/inquiry/InquiryFab";
import { InquirySheet } from "@/components/inquiry/InquirySheet";
import { StickyInquiryBar } from "@/components/inquiry/StickyInquiryBar";
import { CmsPopupModal } from "@/components/popup/CmsPopupModal";

export const metadata: Metadata = {
  title: "고품격대패 대패의 격이 다르다",
  description: "고품격대패 프랜차이즈 창업 랜딩페이지",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        {children}
        <InquiryFab />
        <InquirySheet />
        <CmsPopupModal />
        <StickyInquiryBar />
        <SiteFooter />
      </body>
    </html>
  );
}
