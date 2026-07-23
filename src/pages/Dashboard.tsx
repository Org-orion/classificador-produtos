import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAllProdutos, fetchAllCategorias } from '@/lib/supabase';
import { Produto, Categoria } from '@/types/database';
import { Package, CheckCircle, Clock, FolderTree, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['hsl(150,60%,26%)', 'hsl(200,60%,40%)', 'hsl(30,80%,50%)', 'hsl(280,50%,50%)', 'hsl(0,60%,50%)', 'hsl(170,50%,40%)', 'hsl(45,80%,45%)', 'hsl(320,50%,45%)', 'hsl(100,40%,40%)', 'hsl(220,50%,50%)'];

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllProdutos(), fetchAllCategorias()])
      .then(([p, c]) => { setProdutos(p); setCategorias(c); })
      .finally(() => setLoading(false));
  }, []);

  const classificados = useMemo(() => produtos.filter(p => p.situacao === 'classificado'), [produtos]);
  const pendentes = useMemo(() => produtos.filter(p => p.situacao === 'pendente'), [produtos]);

  const catMap = useMemo(() => {
    const m = new Map<string, string>();
    categorias.forEach(c => m.set(c.id, c.nome));
    return m;
  }, [categorias]);

  const porCategoria = useMemo(() => {
    const counts: Record<string, number> = {};
    produtos.forEach(p => {
      const name = p.categoria_id ? (catMap.get(p.categoria_id) || 'Desconhecida') : 'Sem Categoria';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [produtos, catMap]);

  const porTipo = useMemo(() => {
    const counts: Record<string, number> = {};
    produtos.forEach(p => {
      const t = p.tipo_produto || 'Outros';
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [produtos]);

  const porMovimento = useMemo(() => {
    const counts: Record<string, number> = {};
    produtos.forEach(p => {
      const m = p.movimento || 'N/D';
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [produtos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pctClassificados = produtos.length > 0 ? ((classificados.length / produtos.length) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Package} label="Total de Produtos" value={produtos.length} color="hsl(var(--primary))" />
        <MetricCard icon={CheckCircle} label="Classificados" value={`${classificados.length} (${pctClassificados}%)`} color="hsl(var(--success))" />
        <MetricCard icon={Clock} label="Pendentes" value={pendentes.length} color="hsl(var(--warning))" />
        <MetricCard icon={FolderTree} label="Categorias" value={categorias.filter(c => c.ativo).length} color="hsl(var(--chart-2))" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Produtos por Categoria (Top 10)" data={porCategoria} />
        <ChartCard title="Produtos por Tipo" data={porTipo} />
        <ChartCard title="Produtos por Movimento" data={porMovimento} />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
      <CardContent className="pt-5 pb-4 pl-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold tabular-nums">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={100} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
