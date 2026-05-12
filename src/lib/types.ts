export interface StrapiBlock {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export interface PageData {
  title: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
  blocks: StrapiBlock[];
}

export interface GlobalData {
  site_name: string;
  company_name: string;
  kvk: string;
  btw_id: string;
  address: string;
  email: string;
  navigation: NavItem[];
  footer_columns: FooterColumn[];
}

export interface NavItem {
  label: string;
  href: string;
  cta?: boolean;
}

export interface FooterColumn {
  title: string;
  items: { label: string; href: string }[];
}

export interface ChangelogEntry {
  title: string;
  date: string;
  tags: string[];
  body: string;
  publishedAt: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface FaqCategory {
  id: number;
  name: string;
  slug: string;
  order?: number;
  faqs: FaqItem[];
}

export interface SupportConfig {
  hero_title?: string;
  hero_subtitle?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_hours?: string;
  contact_response_time?: string;
}
