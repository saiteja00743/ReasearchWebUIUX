import type { PublicationCard } from "@researchhub/shared";

export const featuredPublications: PublicationCard[] = [
  {
    id: "1",
    slug: "student-placement-prediction",
    title: "Student Placement Prediction Using Machine Learning",
    abstract: "A practical comparison of supervised models for predicting campus placement outcomes using academic, skills, and internship signals.",
    category: "Artificial Intelligence",
    tags: ["ML", "Placement", "Education"],
    author: { id: "u1", name: "Aarav Mehta", username: "aarav", university: "PES University" },
    views: 18420,
    downloads: 3210,
    likes: 862,
    publishedAt: "2026-05-10"
  },
  {
    id: "2",
    slug: "low-cost-water-quality-sensor",
    title: "Low-Cost IoT Water Quality Monitoring System",
    abstract: "An affordable sensor network that tracks pH, turbidity, and temperature for rural water safety programs.",
    category: "Electronics",
    tags: ["IoT", "Sensors", "Water"],
    author: { id: "u2", name: "Nisha Rao", username: "nisha", university: "VIT" },
    views: 12590,
    downloads: 1988,
    likes: 534,
    publishedAt: "2026-04-27"
  },
  {
    id: "3",
    slug: "ai-mental-health-chatbot",
    title: "AI-Assisted Mental Health Support Chatbot",
    abstract: "A responsible design proposal for student wellness chatbots with escalation, safety, and privacy controls.",
    category: "Social Impact",
    tags: ["AI", "Mental Health", "Safety"],
    author: { id: "u3", name: "Kavya Sharma", username: "kavya", university: "SRM Institute" },
    views: 9860,
    downloads: 1420,
    likes: 401,
    publishedAt: "2026-05-22"
  }
];
