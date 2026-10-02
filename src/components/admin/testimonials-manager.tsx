"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Testimonial = {
  id: string;
  studentName: string;
  course: string | null;
  quote: string;
  rating: number;
  photo: string | null;
  sortOrder: number;
  isPublished: boolean;
  isDemo: boolean;
};

const EMPTY = {
  studentName: "",
  course: "",
  quote: "",
  rating: 5,
  photo: "",
  sortOrder: 0,
  isPublished: false,
  isDemo: false,
};

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      studentName: t.studentName,
      course: t.course ?? "",
      quote: t.quote,
      rating: t.rating,
      photo: t.photo ?? "",
      sortOrder: t.sortOrder,
      isPublished: t.isPublished,
      isDemo: t.isDemo,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.studentName.trim() || !form.quote.trim()) {
      toast.error("Student name and quote are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        course: form.course.trim() || null,
        photo: form.photo.trim() || null,
      };
      const url = editing ? `/api/admin/testimonials/${editing.id}` : `/api/admin/testimonials`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setOpen(false);
      startTransition(() => router.refresh());
      if (editing) {
        setItems((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...json.testimonial } : t)));
      } else {
        setItems((prev) => [json.testimonial, ...prev]);
      }
    } catch {
      toast.error("Couldn't save the testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Testimonial deleted");
      setItems((prev) => prev.filter((t) => t.id !== id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the testimonial.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Student reviews shown across the public site."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" /> New Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Student name *</Label>
                  <Input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Course</Label>
                  <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="US Mortgage Underwriting" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Quote *</Label>
                  <Textarea rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating</Label>
                  <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} star{n > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Photo URL</Label>
                  <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="/uploads/..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort order</Label>
                  <Input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={form.isDemo} onCheckedChange={(v) => setForm({ ...form, isDemo: v })} />
                    Demo
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={save} disabled={saving} className="bg-navy text-white hover:bg-navy/90">
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        {items.length === 0 ? (
          <div className="p-5">
            <AdminEmpty message="No testimonials yet. Add one to feature student reviews." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium text-navy">{t.studentName}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{t.quote}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">{t.course || "—"}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.isPublished ? <AdminBadge tone="green">Published</AdminBadge> : <AdminBadge tone="slate">Draft</AdminBadge>}
                      {t.isDemo && <AdminBadge tone="amber">Demo</AdminBadge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(t)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label="Delete" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove the testimonial from {t.studentName}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => remove(t.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
