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

type Trainer = {
  id: string;
  name: string;
  designation: string;
  specialization: string;
  experience: string | null;
  bio: string;
  photo: string | null;
  linkedinUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  isDemo: boolean;
};

const EMPTY = {
  name: "",
  designation: "",
  experience: "",
  specialization: "",
  bio: "",
  photo: "",
  linkedinUrl: "",
  sortOrder: 0,
  isPublished: false,
  isDemo: false,
};

export function TrainersManager({ initialTrainers }: { initialTrainers: Trainer[] }) {
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(t: Trainer) {
    setEditing(t);
    setForm({
      name: t.name,
      designation: t.designation,
      experience: t.experience ?? "",
      specialization: t.specialization,
      bio: t.bio,
      photo: t.photo ?? "",
      linkedinUrl: t.linkedinUrl ?? "",
      sortOrder: t.sortOrder,
      isPublished: t.isPublished,
      isDemo: t.isDemo,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.designation.trim() || !form.specialization.trim()) {
      toast.error("Name, designation and specialization are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: form.experience.trim() || null,
        photo: form.photo.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
      };
      const url = editing ? `/api/admin/trainers/${editing.id}` : `/api/admin/trainers`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Save failed");
      }
      toast.success(editing ? "Trainer updated" : "Trainer created");
      setOpen(false);
      startTransition(() => router.refresh());
      // Optimistic local update
      if (editing) {
        setTrainers((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...json.trainer } : t)));
      } else {
        setTrainers((prev) => [json.trainer, ...prev]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save the trainer. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/trainers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Trainer deleted");
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the trainer.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Trainers"
        description="Manage mentors featured on the public site."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" /> New Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Trainer" : "New Trainer"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Designation *</Label>
                  <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Senior Mortgage Trainer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Experience</Label>
                  <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 12+ years" />
                </div>
                <div className="space-y-1.5">
                  <Label>Specialization *</Label>
                  <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. US Mortgage Underwriting" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Bio</Label>
                  <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Photo URL</Label>
                  <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="/uploads/..." />
                </div>
                <div className="space-y-1.5">
                  <Label>LinkedIn URL</Label>
                  <Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
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
        {trainers.length === 0 ? (
          <div className="p-5">
            <AdminEmpty message="No trainers yet. Click 'New Trainer' to add one." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Designation</TableHead>
                <TableHead className="hidden lg:table-cell">Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-navy">{t.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">{t.designation}</TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600">{t.specialization}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.isPublished ? (
                        <AdminBadge tone="green">Published</AdminBadge>
                      ) : (
                        <AdminBadge tone="slate">Draft</AdminBadge>
                      )}
                      {t.isDemo && <AdminBadge tone="amber">Demo</AdminBadge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-slate-500">{t.sortOrder}</TableCell>
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
                            <AlertDialogTitle>Delete trainer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove {t.name}. This action cannot be undone.
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
