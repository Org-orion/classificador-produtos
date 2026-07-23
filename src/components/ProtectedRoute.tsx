import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">{children}</div>;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, perfil, isAdmin, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Não autenticado → login.
  if (!user) return <Navigate to="/login" replace />;

  // Autenticado, mas sem perfil ativo no classificador → acesso negado (default deny).
  if (!perfil) {
    return (
      <Centered>
        <p className="text-lg font-medium">Sua conta não tem acesso ao Classificador de Produtos.</p>
        <p className="text-sm text-muted-foreground">Fale com um administrador para liberar seu acesso.</p>
        <Button variant="outline" onClick={() => logout()}>Sair</Button>
      </Centered>
    );
  }

  // Rota que exige administrador.
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
