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

// Returns a breakdown of individual score components for the lead detail page.
export type ScoreComponent = {
  label: string;
  value: number;
  max: number;
  description: string;
};

export function getScoreBreakdown(lead: LeadForScoring): ScoreComponent[] {
  const components: ScoreComponent[] = [];

  // Course interest
  components.push({
    label: "Course interest",
    value: lead.courseId ? 20 : 0,
    max: 20,
    description: lead.courseId ? "Specific course selected" : "General enquiry (no course selected)",
  });

  // Email reachability
  components.push({
    label: "Email provided",
    value: lead.email && lead.email.trim() ? 15 : 0,
    max: 15,
    description: lead.email ? "Reachable via email" : "No email provided",
  });

  // Experience level
  const exp = (lead.experienceLevel || "").toLowerCase();
  let expScore = 0;
  let expDesc = "Not specified";
  if (exp.includes("5+") || exp.includes("5 +")) { expScore = 25; expDesc = "5+ years experience"; }
  else if (exp.includes("3-5") || exp.includes("3 - 5")) { expScore = 20; expDesc = "3-5 years experience"; }
  else if (exp.includes("1-3") || exp.includes("1 - 3")) { expScore = 15; expDesc = "1-3 years experience"; }
  else if (exp.includes("career switch") || exp.includes("switcher")) { expScore = 18; expDesc = "Career switcher"; }
  else if (exp.includes("fresher") || exp.includes("0")) { expScore = 10; expDesc = "Fresher"; }
  components.push({ label: "Experience", value: expScore, max: 25, description: expDesc });

  // Education
  const edu = (lead.education || "").toLowerCase();
  let eduScore = 0;
  let eduDesc = "Not specified";
  if (edu.includes("postgraduate")) { eduScore = 15; eduDesc = "Postgraduate"; }
  else if (edu.includes("graduate")) { eduScore = 12; eduDesc = "Graduate"; }
  else if (edu.includes("diploma")) { eduScore = 8; eduDesc = "Diploma"; }
  else if (edu) { eduScore = 5; eduDesc = lead.education || ""; }
  components.push({ label: "Education", value: eduScore, max: 15, description: eduDesc });

  // Preferred mode
  const mode = (lead.preferredMode || "").toLowerCase();
  let modeScore = 0;
  let modeDesc = "Not specified";
  if (mode.includes("offline") || mode.includes("hybrid")) { modeScore = 15; modeDesc = "Hybrid/Offline (high commitment)"; }
  else if (mode.includes("live")) { modeScore = 10; modeDesc = "Live online"; }
  else if (mode.includes("online")) { modeScore = 8; modeDesc = "Online"; }
  components.push({ label: "Training mode", value: modeScore, max: 15, description: modeDesc });

  // Message engagement
  const hasMessage = lead.message && lead.message.trim().length > 10;
  components.push({
    label: "Engagement",
    value: hasMessage ? 10 : 0,
    max: 10,
    description: hasMessage ? "Left a detailed message" : "No message / short message",
  });

  // Recency
  const created = new Date(lead.createdAt);
  const now = new Date();
  const daysSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  let recencyScore = 0;
  let recencyDesc = "Older than 7 days";
  if (daysSinceCreated <= 3) { recencyScore = 10; recencyDesc = "Recent (last 3 days)"; }
  else if (daysSinceCreated <= 7) { recencyScore = 5; recencyDesc = "Within last week"; }
  components.push({ label: "Recency", value: recencyScore, max: 10, description: recencyDesc });

  return components;
}

// Returns a recommended next action based on the lead's current status and score.
export type NextAction = {
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export function getRecommendedNextAction(status: string, score: number): NextAction {
  const tone = getScoreTone(score);

  switch (status) {
    case "NEW":
      if (tone === "hot")
        return { action: "Call within 24 hours", reason: "Hot lead — high intent signals. Reach out immediately before interest cools.", priority: "high" };
      return { action: "Send WhatsApp message", reason: "New lead — introduce yourself and confirm their interest via WhatsApp.", priority: "high" };
    case "CONTACTED":
      return { action: "Schedule counselling call", reason: "Lead has been contacted — move to a structured counselling conversation.", priority: "high" };
    case "COUNSELLING SCHEDULED":
      return { action: "Prepare for counselling", reason: "Review the lead's background and prepare course recommendations before the call.", priority: "medium" };
    case "COUNSELLING COMPLETED":
      return { action: "Share course details & fee", reason: "Counselling done — share specific course info, batch schedule and fee structure.", priority: "high" };
    case "DEMO SCHEDULED":
      return { action: "Send demo reminder", reason: "Send a WhatsApp reminder 1 hour before the demo session.", priority: "medium" };
    case "DEMO COMPLETED":
      return { action: "Ask for enrollment decision", reason: "Demo attended — this is the best time to close. Ask for enrollment.", priority: "high" };
    case "INTERESTED":
      return { action: "Share enrollment link", reason: "Lead is interested — move toward enrollment. Share next steps and payment info.", priority: "high" };
    case "FOLLOW-UP REQUIRED":
      if (tone === "hot")
        return { action: "Priority follow-up today", reason: "Hot lead needs follow-up — don't let it go cold. Call today.", priority: "high" };
      return { action: "Schedule next follow-up", reason: "Set a specific follow-up date and stick to it.", priority: "medium" };
    case "ENROLLED":
      return { action: "Onboard & share batch details", reason: "Lead enrolled — share batch schedule, materials and onboarding info.", priority: "medium" };
    case "TRAINING":
      return { action: "Check progress", reason: "Candidate in training — check on progress and address any concerns.", priority: "low" };
    case "PLACEMENT SUPPORT":
      return { action: "Share relevant job openings", reason: "Candidate ready for placement — share matching job openings and prep interviews.", priority: "high" };
    case "INTERVIEW SCHEDULED":
      return { action: "Send interview prep material", reason: "Interview scheduled — share prep resources and do a mock interview.", priority: "high" };
    case "PLACED":
      return { action: "Collect success story", reason: "Candidate placed — request a testimonial and placement story for the website.", priority: "low" };
    case "NOT INTERESTED":
      return { action: "Ask for feedback", reason: "Understand why they lost interest — feedback improves future conversions.", priority: "low" };
    case "NOT ELIGIBLE":
      return { action: "Suggest alternative path", reason: "Not eligible for current course — suggest alternatives or future batches.", priority: "low" };
    case "CLOSED":
      return { action: "Archive", reason: "Lead closed — no further action needed unless reopened.", priority: "low" };
    default:
      return { action: "Review lead", reason: "Assess the lead's current state and determine next steps.", priority: "medium" };
  }
}
