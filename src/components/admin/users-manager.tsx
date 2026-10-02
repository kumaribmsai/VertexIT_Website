"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, KeyRound, Trash2 } from "lucide-react";
import { format } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const ROLES = [
  { value: "CONTENT_EDITOR", label: "Content Editor" },
  { value: "COUNSELLOR", label: "Counsellor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const EMPTY = { name: "", email: "", role: "CONTENT_EDITOR", initialPassword: "" };

export function UsersManager({ initial, currentUserId }: { initial: User[]; currentUserId: string }) {
  const [users, setUsers] = useState<User[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function createUser() {
    if (!form.name.trim() || !form.email.trim() || !form.initialPassword.trim()) {
      toast.error("All fields are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          initialPassword: form.initialPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      toast.success("User created");
      setUsers((prev) => [json.user, ...prev]);
      setForm(EMPTY);
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't create the user.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u: User) {
    if (u.id === currentUserId) {
      toast.error("You can't deactivate your own account.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      toast.success(u.isActive ? "User deactivated" : "User activated");
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't update the user.");
    }
  }

  async function changeRole(u: User, role: string) {
    if (u.id === currentUserId) {
      toast.error("You can't change your own role.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      toast.success("Role updated");
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't update the role.");
    }
  }

  async function resetPassword(u: User) {
    const pwd = prompt(`Enter a new password for ${u.name} (min 6 characters):`);
    if (pwd === null) return;
    if (pwd.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPassword: pwd }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      toast.success("Password reset");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't reset password.";
      toast.error(msg);
    }
  }

  async function remove(u: User) {
    if (u.id === currentUserId) {
      toast.error("You can't delete your own account.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User deleted");
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the user.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage admin accounts and roles. Super-admin only."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm(EMPTY); setOpen(true); }} className="bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" /> New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create admin user</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Initial password *</Label>
                  <Input
                    type="password"
                    value={form.initialPassword}
                    onChange={(e) => setForm({ ...form, initialPassword: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={createUser} disabled={saving} className="bg-navy text-white hover:bg-navy/90">
                  {saving ? "Creating..." : "Create user"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        {users.length === 0 ? (
          <div className="p-5">
            <AdminEmpty message="No admin users yet." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="hidden lg:table-cell">Last login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium text-navy">
                        {u.name}
                        {isSelf && <span className="ml-2 text-xs text-teal">you</span>}
                      </div>
                      <div className="text-xs text-slate-500 md:hidden">{u.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600">{u.email}</TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={(v) => changeRole(u, v)} disabled={isSelf}>
                        <SelectTrigger className="h-8 w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={u.isActive} onCheckedChange={() => toggleActive(u)} disabled={isSelf} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-500 text-sm">
                      {u.lastLoginAt ? format(new Date(u.lastLoginAt), "d MMM yyyy, h:mm a") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => resetPassword(u)} aria-label="Reset password">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={isSelf}
                              aria-label="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete user?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {u.name} ({u.email}). They will lose access immediately.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => remove(u)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <AdminBadge tone="amber">Tip</AdminBadge> <span className="ml-1">Super-admin can't deactivate, demote, or delete their own account.</span>
      </p>
    </div>
  );
}
