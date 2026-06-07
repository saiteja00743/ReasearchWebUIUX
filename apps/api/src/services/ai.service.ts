export async function generateAbstract(input: string) {
  return `This study explores ${input.slice(0, 180)}. It summarizes the problem context, method, results, and expected impact for an academic reader.`;
}

export async function generateKeywords(input: string) {
  return Array.from(new Set(input.toLowerCase().match(/[a-z]{5,}/g)?.slice(0, 8) ?? ["research", "innovation", "student"]));
}

export async function generateSummary(input: string) {
  return `Summary: ${input.slice(0, 500)}${input.length > 500 ? "..." : ""}`;
}

export async function generateCitation(data: { title: string; authors: string[]; year?: number; url?: string }) {
  const authors = data.authors.join(", ");
  return `${authors}. (${data.year ?? new Date().getFullYear()}). ${data.title}. ResearchHub.${data.url ? ` ${data.url}` : ""}`;
}
