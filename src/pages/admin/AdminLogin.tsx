import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError('Invalid credentials or not an admin account');
      setIsSubmitting(false);
      return;
    }

    // Wait a moment for the role check to complete
    toast({ title: 'Verifying admin access...', description: 'Please wait' });

    // The useAdminAuth hook will redirect once it confirms admin role
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--navy-500) / 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, hsl(var(--navy-700) / 0.4) 0%, transparent 50%)`,
      }} />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent mb-4">
            <ShieldCheck className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-foreground">Admin Access</h1>
          <p className="text-primary-foreground/50 mt-2 text-sm">Simbaland Management Console</p>
        </div>

        {/* Login card */}
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-accent"
                  placeholder="admin@simbaland.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-accent hover:bg-amber-600 text-accent-foreground font-semibold text-base rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Sign In to Admin'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-primary-foreground/30 text-xs mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
