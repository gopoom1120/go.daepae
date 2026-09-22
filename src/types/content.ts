export interface ContactInfo {
  phone: string;
  instagram: string;
  instagramUrl: string;
}

export interface CompetencyItem {
  num: string;
  title: string;
  desc: string;
}

export interface TrustItem {
  label: string;
  desc: string;
}

export interface MeatItem {
  image: string;
  name: string;
}

export interface SelfbarItem {
  image: string;
  name: string;
}

export interface ProfitItem {
  name: string;
  open: string;
  salesWon: number;
  rate: number;
  tall: boolean;
}

export interface CostRow {
  item: string;
  detail: string;
  price: string;
}

export interface CostSection {
  head: CostRow;
  rows: CostRow[];
}

export interface StoreItem {
  name: string;
  date: string;
  image: string;
  mapUrl: string;
}

export interface ContentData {
  contact: ContactInfo;
  competency: CompetencyItem[];
  trust: TrustItem[];
  meat: MeatItem[];
  selfbar: SelfbarItem[];
  profit: ProfitItem[];
  cost: CostSection;
  stores: StoreItem[];
}
