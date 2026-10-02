// Lead scoring system — auto-assigns a score (0-100) to leads based on their
// attributes. Higher score = higher priority for counsellors to follow up.
// Scoring criteria:
// - Has a specific course selected (not general): +20
// - Has email provided: +15 (more reachable)
// - Experience level (experienced candidates are hotter):
//   - 5+ years: +25
//   - 3-5 years: +20
//   - 1-3 years: +15
//   - Career switcher: +18
//   - Fresher: +10
// - Education (postgraduate slightly higher):
//   - Postgraduate: +15
//   - Graduate: +12
//   - Diploma: +8
//   - Other/Undergraduate: +5
// - Preferred mode indicates commitment:
//   - Offline/Hybrid: +15 (willing to travel)
//   - Live: +10
//   - Online: +8
// - Has a message (shows engagement): +10
// - Recency bonus: leads from last 3 days get +10, last 7 days +5

export type LeadForScoring = {
  courseId?: string | null;
  email?: string | null;
  experienceLevel?: string | null;
  education?: string | null;
  preferredMode?: string | null;
  message?: string | null;
  createdAt: Date | string;
};

export function computeLeadScore(lead: LeadForScoring): number {
  let score = 0;

  // Has a specific course selected
  if (lead.courseId) score += 20;

  // Has email (more reachable)
  if (lead.email && lead.email.trim()) score += 15;

  // Experience level
  const exp = (lead.experienceLevel || "").toLowerCase();
  if (exp.includes("5+") || exp.includes("5 +")) score += 25;
  else if (exp.includes("3-5") || exp.includes("3 - 5")) score += 20;
  else if (exp.includes("1-3") || exp.includes("1 - 3")) score += 15;
  else if (exp.includes("career switch") || exp.includes("switcher")) score += 18;
  else if (exp.includes("fresher") || exp.includes("0")) score += 10;

  // Education
  const edu = (lead.education || "").toLowerCase();
  if (edu.includes("postgraduate")) score += 15;
  else if (edu.includes("graduate")) score += 12;
  else if (edu.includes("diploma")) score += 8;
  else if (edu) score += 5;

  // Preferred training mode
  const mode = (lead.preferredMode || "").toLowerCase();
  if (mode.includes("offline") || mode.includes("hybrid")) score += 15;
  else if (mode.includes("live")) score += 10;
  else if (mode.includes("online")) score += 8;

  // Has a message (engagement signal)
  if (lead.message && lead.message.trim().length > 10) score += 10;

  // Recency bonus
  const created = new Date(lead.createdAt);
  const now = new Date();
  const daysSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= 3) score += 10;
  else if (daysSinceCreated <= 7) score += 5;

  return Math.min(score, 100);
}

export function getScoreTone(score: number): "hot" | "warm" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}
