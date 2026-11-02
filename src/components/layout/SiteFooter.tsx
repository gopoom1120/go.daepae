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
        </div>
        <div className="socials">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`인스타그램 ${instagram} (새 창)`}
            className="footer-instagram-btn"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>Copyrights ©고품격대패. All Right Reserved</span>
        <a
          href="https://gospelfix-ashy.vercel.app/layer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CREATED BY GOSPELFIX (새 창)"
        >
          CREATED BY GOSPELFIX
        </a>
      </div>
    </footer>
  );
}
