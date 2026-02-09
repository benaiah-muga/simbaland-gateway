import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Package,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Store,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { title: 'Products', path: '/admin/products', icon: Package },
  { title: 'Users', path: '/admin/users', icon: Users },
];

const SidebarContent = ({
  location,
  signOut,
  navigate,
  onNavigate,
}: {
  location: ReturnType<typeof useLocation>;
  signOut: () => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
  onNavigate?: () => void;
}) => (
  <>
    <div className="p-5 border-b border-primary-foreground/10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight">Simbaland</h1>
          <p className="text-xs text-primary-foreground/60">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 p-3 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
            {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
          </Link>
        );
      })}
    </nav>

    <div className="p-3 border-t border-primary-foreground/10 space-y-1">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all"
      >
        <Store className="h-5 w-5" />
        View Store
      </Link>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        onClick={async () => {
          onNavigate?.();
          await signOut();
          navigate('/admin/login');
        }}
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </Button>
    </div>
  </>
);

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAdminAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 bg-primary text-primary-foreground flex flex-col fixed h-full z-30">
          <SidebarContent location={location} signOut={signOut} navigate={navigate} />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 bg-primary text-primary-foreground border-none">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <SidebarContent
                location={location}
                signOut={signOut}
                navigate={navigate}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <main className={`flex-1 ${isMobile ? '' : 'ml-64'}`}>
        {/* Mobile header bar */}
        {isMobile && (
          <div className="sticky top-0 z-20 bg-primary text-primary-foreground flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="font-display font-bold text-sm">Simbaland Admin</span>
            </div>
          </div>
        )}
        <div className={isMobile ? 'p-4' : 'p-8'}>{children}</div>
      </main>
    </div>
  );
};