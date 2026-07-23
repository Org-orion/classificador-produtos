import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Tags, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoConcrem from '@/assets/logo-concrem.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { to: '/classificacao', label: 'Categorização', icon: Tags, adminOnly: false },
  { to: '/admin', label: 'Administração', icon: Settings, adminOnly: true },
];

export default function MainLayout() {
  const { perfil, isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Administração só aparece para admin (o gate real está na RLS/rota).
  const items = navItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-primary transition-all duration-300 ease-out shrink-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center h-16 border-b shrink-0 cursor-pointer px-3"
          style={{ borderColor: 'hsl(var(--primary-hover))' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img
            src={logoConcrem}
            alt="Concrem"
            className={cn(
              'object-contain transition-all duration-300',
              collapsed ? 'h-8 w-10' : 'h-10 w-full max-w-[180px]'
            )}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {items.map(item => {
            const active = isActive(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-primary-foreground',
                  active ? 'bg-[hsl(var(--primary-hover))]' : 'hover:bg-[hsl(var(--primary-hover))]',
                  collapsed && 'justify-center px-0'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="border-t px-3 py-3 space-y-2 shrink-0"
          style={{ borderColor: 'hsl(var(--primary-hover))' }}
        >
          {!collapsed && perfil && (
            <div className="px-1">
              <p className="text-sm font-medium text-primary-foreground truncate">
                {perfil.nome}
              </p>
              <p className="text-xs text-primary-foreground/70 truncate">
                {perfil.papel === 'admin' ? 'Administrador' : 'Editor'} · {perfil.email}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors w-full',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
