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

const SITE_URL = "https://xn--i89a2dz9q2p1bhpb.com";
const SITE_TITLE = "고품격대패 대패의 격이 다르다";
const SITE_DESCRIPTION =
  "해썹 인증 국내산 암퇘지와 UN 인증 친환경 브랜드 '아그로수퍼', 25종 이상 셀프바로 완성하는 고품격대패. 프랜차이즈 창업 문의는 지금 바로.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "고품격대패",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/assets/imgs/kakaoTalkthumbnail.png",
        width: 1600,
        height: 800,
        alt: "고품격대패 대패삼겹살 전문점",
      },
    ],
  },
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
