"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseOption = { id: string; title: string };

export function LeadForm({
  courses = [],
  defaultCourseId,
  compact = false,
  source = "website",
  className,
}: {
  courses?: CourseOption[];
  defaultCourseId?: string;
  compact?: boolean;
  source?: string;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      courseId: defaultCourseId ?? "",
      education: "",
      experienceLevel: "",
      preferredMode: "",
      message: "",
      howDidYouHear: "",
      website: "",
    },
  });

  const onSubmit = async (values: LeadInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Submission failed");
      }
      setSubmitted(true);
      reset();
    } catch (e) {
      setServerError(
        "We couldn't submit your request right now. Please try again or contact us on WhatsApp.",
      );
    }
  };

  if (submitted) {
    return (
      <div className={cn("rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center", className)}>
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold text-navy">Thank you. Your enquiry has been received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A VertexIT counsellor will contact you shortly. For urgent queries, reach us on WhatsApp at{" "}
          <a href="https://wa.me/919703686514" className="font-semibold text-teal" target="_blank" rel="noopener noreferrer">
            +91 97036 86514
          </a>
          .
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => setSubmitted(false)}
        >
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      noValidate
    >
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className={cn("grid", compact ? "gap-4" : "grid gap-4 sm:grid-cols-2")}>
        <Field label="Full Name" error={errors.fullName?.message} required>
          <Input
            {...register("fullName")}
            placeholder="Your name"
            autoComplete="name"
            className="h-11"
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message} required>
          <Input
            {...register("phone")}
            placeholder="10-digit mobile number"
            inputMode="tel"
            autoComplete="tel"
            className="h-11"
          />
        </Field>
      </div>

      <div className={cn("grid", compact ? "gap-4" : "grid gap-4 sm:grid-cols-2")}>
        <Field label="Email" error={errors.email?.message} hint="Optional">
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
          />
        </Field>

        <Field label="Interested Course" error={errors.courseId?.message}>
          <Select
            value={watch("courseId") ?? ""}
            onValueChange={(v) => setValue("courseId", v)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
              <SelectItem value="general">General enquiry</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className={cn("grid", compact ? "gap-4" : "grid gap-4 sm:grid-cols-2")}>
        <Field label="Education" error={errors.education?.message}>
          <Select
            value={watch("education") ?? ""}
            onValueChange={(v) => setValue("education", v)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Highest qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Graduate">Graduate</SelectItem>
              <SelectItem value="Postgraduate">Postgraduate</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Experience Level" error={errors.experienceLevel?.message}>
          <Select
            value={watch("experienceLevel") ?? ""}
            onValueChange={(v) => setValue("experienceLevel", v)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fresher">Fresher (0 years)</SelectItem>
              <SelectItem value="1-3 years">1-3 years</SelectItem>
              <SelectItem value="3-5 years">3-5 years</SelectItem>
              <SelectItem value="5+ years">5+ years</SelectItem>
              <SelectItem value="Career switcher">Career switcher</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Preferred Training Mode" error={errors.preferredMode?.message}>
        <Select
          value={watch("preferredMode") ?? ""}
          onValueChange={(v) => setValue("preferredMode", v)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Offline">Offline (Bengaluru)</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Live">Live online</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Message" error={errors.message?.message} hint="Optional">
        <Textarea
          {...register("message")}
          placeholder="Tell us about your career goals or any questions..."
          rows={4}
          className="resize-none"
        />
      </Field>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full bg-teal text-white hover:bg-teal/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit Enquiry
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting, you agree to be contacted by VertexIT regarding your enquiry.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm font-medium text-navy">
          {label} {required && <span className="text-teal">*</span>}
        </Label>
        {hint && <span className="text-[0.7rem] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
