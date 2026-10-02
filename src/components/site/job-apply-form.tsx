"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppButton } from "@/components/site/buttons";

type Status = "idle" | "submitting" | "success" | "error";

const ACCEPTED = ".pdf,.doc,.docx";
const MAX_BYTES = 5 * 1024 * 1024;

export function JobApplyForm({
  jobId,
  jobTitle,
  whatsappHref,
}: {
  jobId: string;
  jobTitle: string;
  whatsappHref: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const f = e.target.files?.[0];
    if (!f) {
      setFileName(null);
      return;
    }
    const okType =
      f.type === "application/pdf" ||
      f.type === "application/msword" ||
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!okType) {
      setFileError("Resume must be a PDF, DOC or DOCX file.");
      e.target.value = "";
      setFileName(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError("Resume file must be under 5MB.");
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(f.name);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("jobId", jobId);

    // Honeypot — must be empty
    if (data.get("website")) {
      setStatus("error");
      setError("Spam detected. Please refresh and try again.");
      return;
    }

    // Client-side resume check (server validates too)
    if (fileError) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/job-applications", {
        method: "POST",
        body: data,
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        issues?: unknown;
      };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(
          json.error ||
            "We couldn't submit your application right now. Please try again or contact us on WhatsApp.",
        );
        return;
      }
      setStatus("success");
      form.reset();
      setFileName(null);
    } catch {
      setStatus("error");
      setError(
        "We couldn't submit your application right now. Please try again or contact us on WhatsApp.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-teal/30 bg-teal/5 p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-4 font-heading text-lg font-bold text-navy">
            Thank you for applying
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Our team will review your application and reach out if your profile matches this role.
            We appreciate your interest in VertexIT.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Reference role: <span className="font-medium text-navy">{jobTitle}</span>
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton href={whatsappHref} size="sm">
              Speak to our team
            </WhatsAppButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot — visually hidden, must remain empty */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <input type="hidden" name="jobId" value={jobId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="candidateName">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="candidateName"
            name="candidateName"
            placeholder="Your name"
            autoComplete="name"
            required
            maxLength={80}
            disabled={status === "submitting"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile"
            autoComplete="tel"
            pattern="[6-9][0-9]{9}"
            title="Enter a valid 10-digit Indian mobile number"
            required
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={status === "submitting"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">
          Resume <span className="text-muted-foreground font-normal">(PDF / DOC / DOCX, max 5MB)</span>
        </Label>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="resume"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-navy/15 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
            >
              <Upload className="h-4 w-4" />
              Choose file
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept={ACCEPTED}
              className="sr-only"
              onChange={onFileChange}
              disabled={status === "submitting"}
            />
            {fileName ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                <span className="truncate max-w-[180px] sm:max-w-[260px]">{fileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFileName(null);
                    const inp = document.getElementById("resume") as HTMLInputElement | null;
                    if (inp) inp.value = "";
                  }}
                  className="text-slate-400 hover:text-destructive"
                  aria-label="Remove selected file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">No file chosen</span>
            )}
          </div>
          {fileError && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverMessage">
          Cover message <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="coverMessage"
          name="coverMessage"
          rows={4}
          placeholder="Tell us briefly why you're a great fit for this role."
          maxLength={2000}
          disabled={status === "submitting"}
        />
        <p className="text-[0.7rem] text-muted-foreground">
          We'll review every application. Please don't share sensitive personal data like Aadhaar numbers.
        </p>
      </div>

      {status === "error" && error && (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-800"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">We couldn't submit your application</p>
            <p className="mt-1 leading-relaxed">{error}</p>
            <div className="mt-3">
              <WhatsAppButton href={whatsappHref} size="sm" variant="outline">
                Reach us on WhatsApp instead
              </WhatsAppButton>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Application"
          )}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal hover:text-teal/80"
        >
          Prefer WhatsApp? Reach us here →
        </a>
      </div>
    </form>
  );
}
