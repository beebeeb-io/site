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
