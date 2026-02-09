import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminUsers, useCreateAdmin, useUpdateAdmin, useDeleteAdmin, AdminUser } from '@/hooks/useAdminUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, UserPlus, ShieldCheck, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsers = () => {
  const { data: users, isLoading } = useAdminUsers();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setEditUser(null);
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setFullName(u.full_name || '');
    setEmail(u.email);
    setPassword('');
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        await updateAdmin.mutateAsync({
          user_id: editUser.id,
          full_name: fullName,
          ...(password ? { password } : {}),
        });
        toast({ title: 'Admin updated' });
      } else {
        if (!email || !password) {
          toast({ title: 'Email and password are required', variant: 'destructive' });
          return;
        }
        await createAdmin.mutateAsync({ email, password, full_name: fullName });
        toast({ title: 'Admin created' });
      }
      setFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdmin.mutateAsync(deleteId);
      toast({ title: 'Admin deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const formatDate = (d: string | null) => {
    if (!d) return 'Never';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage admin accounts</p>
          </div>
          <Button
            className="bg-accent hover:bg-amber-600 text-accent-foreground gap-2 w-full sm:w-auto"
            onClick={openCreate}
          >
            <UserPlus className="h-4 w-4" />
            Add Admin
          </Button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading users...</div>
        ) : !users?.length ? (
          <div className="p-12 text-center text-muted-foreground">No admin users found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <Card key={u.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">
                            {u.full_name || 'Admin'}
                          </h3>
                          {isSelf && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Last sign in: {formatDate(u.last_sign_in)}</p>
                        </div>
                        <Badge className="mt-2 bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 capitalize">
                          {u.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-1"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive gap-1"
                        disabled={isSelf}
                        onClick={() => setDeleteId(u.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editUser ? 'Edit Admin' : 'Add New Admin'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Admin name" />
            </div>

            {!editUser && (
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
              </div>
            )}

            <div className="space-y-2">
              <Label>{editUser ? 'New Password (leave blank to keep)' : 'Password *'}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editUser}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setFormOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-amber-600 text-accent-foreground"
                disabled={createAdmin.isPending || updateAdmin.isPending}
              >
                {createAdmin.isPending || updateAdmin.isPending ? 'Saving...' : editUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this admin account and revoke all access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;