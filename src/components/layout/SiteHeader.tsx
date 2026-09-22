"use client";

import { useEffect, useState } from "react";
import { scrollToSection } from "@/libs/scroll";
import { openInquirySheet } from "@/hooks/useInquirySheetTrigger";

const NAV_LINKS = [
  { id: "competitiveness", label: "경쟁력" },
  { id: "menu", label: "메뉴" },
  { id: "reviews", label: "소비자 찐후기" },
  { id: "profit", label: "수익분석" },
  { id: "cost", label: "창업비용" },
  { id: "location", label: "매장위치" },
];

export function SiteHeader() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setNavOpen(false);
  };

  return (
    <header
      className={`nav${scrolled ? " scrolled" : ""}${navOpen ? " nav-open" : ""}`}
      id="siteNav"
    >
      <div className="nav-logo">
        <img src="/assets/imgs/logo_gold.png" alt="고품격대패" /> 고품격대패
      </div>
      <nav className="nav-links" id="navLinks">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={activeId === link.id ? "active" : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <button type="button" className="nav-cta" onClick={openInquirySheet}>
        창업 상담
      </button>
      <button
        type="button"
        className="nav-toggle"
        id="navToggle"
        aria-label="메뉴 열기"
        onClick={() => setNavOpen((o) => !o)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
