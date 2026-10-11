// WhatsApp helper — builds wa.me URLs with pre-filled messages.
// Number is stored as the full international format without + (e.g. 919703686514).

import { getSiteSettings } from "@/lib/site";

export function normalizeWhatsappNumber(raw?: string | null): string {
  if (!raw) return "919703686514";
  const digits = raw.replace(/\D/g, "");
  // If user stored it as 9703686514 (10-digit Indian), prefix 91.
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function getWhatsappNumber(): Promise<string> {
  const s = await getSiteSettings();
  return normalizeWhatsappNumber(s.whatsapp);
}

export function buildWhatsappUrl(message: string, number: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

// Pre-filled message helpers for each context.
export const WHATSAPP_MESSAGES = {
  home: "Hi VertexIT, I'm interested in your training programs. I'd like to speak with a counsellor.",
  usIt: "Hi VertexIT, I'm interested in the US Mortgage Underwriting program.",
  usMortgage: "Hi VertexIT, I'm interested in the US Mortgage Underwriting program.",
  australia: "Hi VertexIT, I'm interested in the Australia Mortgage program.",
  jobs: "Hi VertexIT, I'd like to know about the current job opportunities.",
  contact: "Hi VertexIT, I'd like to get in touch regarding your courses.",
  apply: "Hi VertexIT, I'd like to apply and speak with a counsellor.",
  placement: "Hi VertexIT, I'd like to understand your placement assistance process.",
  generic: "Hi VertexIT, I'd like to know more about your programs.",
};

export async function whatsappUrl(
  context: keyof typeof WHATSAPP_MESSAGES = "generic",
  customMessage?: string,
): Promise<string> {
  const number = await getWhatsappNumber();
  const message = customMessage ?? WHATSAPP_MESSAGES[context];
  return buildWhatsappUrl(message, number);
}
