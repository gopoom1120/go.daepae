import content from "@/data/content.json";
import type { ContentData } from "@/types/content";
import { Hero } from "@/components/sections/Hero";
import { Competitiveness } from "@/components/sections/Competitiveness";
import { Menu } from "@/components/sections/Menu";
import { Reviews } from "@/components/sections/Reviews";
import { Interior } from "@/components/sections/Interior";
import { Profit } from "@/components/sections/Profit";
import { PromiseBanner } from "@/components/sections/PromiseBanner";
import { Cost } from "@/components/sections/Cost";
import { Location } from "@/components/sections/Location";

const data = content as ContentData;

export default function Home() {
  return (
    <>
      <Hero />
      <Competitiveness competency={data.competency} trust={data.trust} />
      <Menu meat={data.meat} selfbar={data.selfbar} />
      <Reviews />
      <Interior />
      <Profit profit={data.profit} />
      <PromiseBanner />
      <Cost cost={data.cost} />
      <Location stores={data.stores} contact={data.contact} />
    </>
  );
}
