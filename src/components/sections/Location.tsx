import { StoreCarousel } from "@/components/sections/StoreCarousel";
import { InlineInquiryForm } from "@/components/inquiry/InlineInquiryForm";
import type { ContactInfo, StoreItem } from "@/types/content";

interface LocationProps {
  stores: StoreItem[];
  contact: ContactInfo;
}

export function Location({ stores, contact }: LocationProps) {
  return (
    <section className="location" id="location">
      <div className="location-bg-frame" aria-hidden="true">
        <div className="location-bg"></div>
      </div>
      <div className="location-overlay" aria-hidden="true"></div>
      <div className="wrap">
        <StoreCarousel stores={stores} />
      </div>

      <div className="wrap">
        <InlineInquiryForm contact={contact} />
      </div>
    </section>
  );
}
