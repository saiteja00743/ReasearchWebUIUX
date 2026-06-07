export const researchCategories = [
  "Artificial Intelligence",
  "Data Science",
  "Computer Science",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Business",
  "Design",
  "Social Impact"
] as const;

export type ResearchCategory = (typeof researchCategories)[number];

export type UserRole = "student" | "reviewer" | "admin";

export type PublicationStatus = "draft" | "in_review" | "published" | "rejected" | "removed";

export interface PublicAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  university?: string;
}

export interface PublicationCard {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  category: ResearchCategory;
  tags: string[];
  coverImageUrl?: string;
  author: PublicAuthor;
  views: number;
  downloads: number;
  likes: number;
  publishedAt: string;
}
