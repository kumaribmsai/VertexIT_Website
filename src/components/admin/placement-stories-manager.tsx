"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Story = {
  id: string;
  studentName: string;
  course: string | null;
  previousBackground: string | null;
  newRole: string | null;
  company: string | null;
  package: string | null;
  location: string | null;
  year: number | null;
  shortStory: string;
  quote: string | null;
  offerLetterImage: string | null;
  photo: string | null;
  sortOrder: number;
  isPublished: boolean;
  isDemo: boolean;
};

const EMPTY = {
  studentName: "",
  course: "",
  previousBackground: "",
  newRole: "",
  company: "",
  package: "",
  location: "",
  year: "",
  shortStory: "",
  quote: "",
  offerLetterImage: "",
  photo: "",
  sortOrder: 0,
  isPublished: false,
  isDemo: false,
};

export function PlacementStoriesManager({ initial }: { initial: Story[] }) {
  const [items, setItems] = useState<Story[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(s: Story) {
    setEditing(s);
    setForm({
      studentName: s.studentName,
      course: s.course ?? "",
      previousBackground: s.previousBackground ?? "",
      newRole: s.newRole ?? "",
      company: s.company ?? "",
      package: s.package ?? "",
      location: s.location ?? "",
      year: s.year ? String(s.year) : "",
      shortStory: s.shortStory,
      quote: s.quote ?? "",
      offerLetterImage: s.offerLetterImage ?? "",
      photo: s.photo ?? "",
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
      isDemo: s.isDemo,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.studentName.trim()) {
      toast.error("Student name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        studentName: form.studentName.trim(),
        course: form.course.trim() || null,
        previousBackground: form.previousBackground.trim() || null,
        newRole: form.newRole.trim() || null,
        company: form.company.trim() || null,
        package: form.package.trim() || null,
        location: form.location.trim() || null,
        year: form.year ? Number(form.year) : null,
        shortStory: form.shortStory,
        quote: form.quote.trim() || null,
        offerLetterImage: form.offerLetterImage.trim() || null,
        photo: form.photo.trim() || null,
        sortOrder: form.sortOrder,
        isPublished: form.isPublished,
        isDemo: form.isDemo,
      };
      const url = editing ? `/api/admin/placement-stories/${editing.id}` : `/api/admin/placement-stories`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editing ? "Story updated" : "Story created");
      setOpen(false);
      startTransition(() => router.refresh());
      if (editing) {
        setItems((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...json.story } : s)));
      } else {
        setItems((prev) => [json.story, ...prev]);
      }
    } catch {
      toast.error("Couldn't save the placement story.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/placement-stories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Story deleted");
      setItems((prev) => prev.filter((s) => s.id !== id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the story.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Placement Stories"
        description="Detailed student success stories featured on the public site."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" /> New Story
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Placement Story" : "New Placement Story"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Student name *</Label>
                  <Input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Course</Label>
                  <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="US IT Underwriting" />
                </div>
                <div className="space-y-1.5">
                  <Label>Previous background</Label>
                  <Input value={form.previousBackground} onChange={(e) => setForm({ ...form, previousBackground: e.target.value })} placeholder="e.g. B.Com Graduate" />
                </div>
                <div className="space-y-1.5">
                  <Label>New role</Label>
                  <Input value={form.newRole} onChange={(e) => setForm({ ...form, newRole: e.target.value })} placeholder="e.g. Junior IT Underwriter" />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Package</Label>
                  <Input value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })} placeholder="e.g. 4.2 LPA" />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Input type="number" min={1990} max={2100} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Short story</Label>
                  <Textarea rows={4} value={form.shortStory} onChange={(e) => setForm({ ...form, shortStory: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Quote</Label>
                  <Textarea rows={2} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="A short highlight quote" />
                </div>
                <div className="space-y-1.5">
                  <Label>Photo URL</Label>
                  <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="/uploads/..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Offer letter image URL</Label>
                  <Input value={form.offerLetterImage} onChange={(e) => setForm({ ...form, offerLetterImage: e.target.value })} placeholder="/uploads/..." />
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
            <AdminEmpty message="No placement stories yet. Add the first success story." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden lg:table-cell">New role</TableHead>
                <TableHead className="hidden lg:table-cell">Company</TableHead>
                <TableHead className="hidden md:table-cell text-center">Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium text-navy">{s.studentName}</div>
                    {s.location && <div className="text-xs text-slate-500">{s.location}</div>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">{s.course || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600">{s.newRole || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600">{s.company || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-center text-slate-500">{s.year || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.isPublished ? <AdminBadge tone="green">Published</AdminBadge> : <AdminBadge tone="slate">Draft</AdminBadge>}
                      {s.isDemo && <AdminBadge tone="amber">Demo</AdminBadge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(s)} aria-label="Edit">
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
                            <AlertDialogTitle>Delete placement story?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove the story from {s.studentName}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => remove(s.id)}
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
