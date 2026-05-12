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
  sortOrder?: number;
  searchTags?: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  slug: string;
  sortOrder?: number;
  faq_items: FaqItem[];
}

export interface SupportConfig {
  heroTitle?: string;
  heroSubtitle?: string;
  contactEmail?: string;
  securityEmail?: string;
  responseTimeText?: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  role?: string;
  socialLinks?: Record<string, string>;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: BlogAuthor;
  category?: BlogCategory;
  publishedAt: string;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
}
