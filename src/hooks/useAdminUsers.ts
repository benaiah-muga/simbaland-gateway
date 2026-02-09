import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  last_sign_in: string | null;
}

const callManageAdmins = async (body: Record<string, unknown>) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await supabase.functions.invoke('manage-admins', {
    body,
  });

  if (res.error) throw new Error(res.error.message);
  if (res.data?.error) throw new Error(res.data.error);
  return res.data;
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const data = await callManageAdmins({ action: 'list' });
      return data.users as AdminUser[];
    },
  });
};

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { email: string; password: string; full_name?: string }) =>
      callManageAdmins({ action: 'create', ...params }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useUpdateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { user_id: string; full_name?: string; password?: string }) =>
      callManageAdmins({ action: 'update', ...params }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (user_id: string) =>
      callManageAdmins({ action: 'delete', user_id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};