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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
};

const CATEGORIES = ["General", "Eligibility", "Training", "Courses", "Placement", "Fees", "Contact"];
const CUSTOM = "__custom__";

const EMPTY = {
  question: "",
  answer: "",
  category: "General",
  customCategory: "",
  useCustom: false,
  sortOrder: 0,
  isPublished: true,
};

export function FaqsManager({ initial }: { initial: Faq[] }) {
  const [items, setItems] = useState<Faq[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(f: Faq) {
    const isPreset = CATEGORIES.includes(f.category);
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      category: isPreset ? f.category : CUSTOM,
      customCategory: isPreset ? "" : f.category,
      useCustom: !isPreset,
      sortOrder: f.sortOrder,
      isPublished: f.isPublished,
    });
    setOpen(true);
  }

  function resolveCategory() {
    if (form.useCustom) return form.customCategory.trim() || "General";
    return form.category;
  }

  async function save() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: resolveCategory(),
        sortOrder: form.sortOrder,
        isPublished: form.isPublished,
      };
      const url = editing ? `/api/admin/faqs/${editing.id}` : `/api/admin/faqs`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success(editing ? "FAQ updated" : "FAQ created");
      setOpen(false);
      startTransition(() => router.refresh());
      if (editing) {
        setItems((prev) => prev.map((f) => (f.id === editing.id ? { ...f, ...json.faq } : f)));
      } else {
        setItems((prev) => [json.faq, ...prev]);
      }
    } catch {
      toast.error("Couldn't save the FAQ.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("FAQ deleted");
      setItems((prev) => prev.filter((f) => f.id !== id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the FAQ.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Global frequently asked questions, grouped by category on the public site."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" /> New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label>Question *</Label>
                  <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Answer *</Label>
                  <Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={form.useCustom ? CUSTOM : form.category}
                      onValueChange={(v) => {
                        if (v === CUSTOM) setForm({ ...form, useCustom: true });
                        else setForm({ ...form, useCustom: false, category: v });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM}>Custom…</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.useCustom && (
                    <div className="space-y-1.5">
                      <Label>Custom category</Label>
                      <Input
                        value={form.customCategory}
                        onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                        placeholder="e.g. Schedule"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label>Sort order</Label>
                    <Input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-center gap-6 pt-6">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
                      Published
                    </label>
                  </div>
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
            <AdminEmpty message="No FAQs yet. Add one to start populating the public FAQ page." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-md">
                    <div className="font-medium text-navy line-clamp-2">{f.question}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{f.answer}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <AdminBadge tone="navy">{f.category}</AdminBadge>
                  </TableCell>
                  <TableCell className="text-center text-slate-500">{f.sortOrder}</TableCell>
                  <TableCell>
                    {f.isPublished ? <AdminBadge tone="green">Published</AdminBadge> : <AdminBadge tone="slate">Draft</AdminBadge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(f)} aria-label="Edit">
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
                            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently remove the FAQ.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => remove(f.id)}
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
