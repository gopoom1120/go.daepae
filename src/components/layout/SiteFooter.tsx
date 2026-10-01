import content from "@/data/content.json";

export function SiteFooter() {
  const { instagram, instagramUrl } = content.contact;

  return (
    <footer>
      <div className="wrap footer-grid">
        <div className="footer-logo">
          <img src="/assets/imgs/logo_gold.png" alt="logo" /> <span>고품격대패</span>
        </div>
        <div className="meta">
          고품격대패 · 창업문의 1877-1960
          <br />© gopoomgyeok daepae. All rights reserved.
        </div>
        <div className="socials">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`인스타그램 ${instagram} (새 창)`}
          >
            Instagram
          </a>
          <a href="#">창업안내</a>
        </div>
      </div>
    </footer>
  );
}
