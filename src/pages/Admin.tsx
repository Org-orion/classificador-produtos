import { useEffect, useState, useCallback } from 'react';
import { supabase, fetchAllCategorias, fetchAllSubcategorias, fetchAllRegras } from '@/lib/supabase';
import { usuariosApi } from '@/lib/usuarios-api';
import { Categoria, Subcategoria, RegraClassificacao, Usuario, OpcaoClassificacao, RegraAtributo, PapelUsuario } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Loader2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizePtNumberText } from '@/lib/numbers';

const CAMPOS_LABEL: Record<string, string> = {
  tipo_produto: 'Tipo Produto',
  movimento: 'Movimento',
  enchimento: 'Enchimento',
  revestimento: 'Revestimento',
  linha: 'Linha',
  perfil: 'Liso/Frisado',
  cor: 'Cor',
  protect_plus: 'Protect+',
  veneziana: 'Veneziana',
  visor: 'Visor',
  altura_cm: 'Altura (cm)',
  largura_cm: 'Largura (cm)',
  espessura_cm: 'Espessura (cm)',
};

const TIPO_MATCH_LABEL: Record<string, string> = {
  contem: 'Contém',
  comeca_com: 'Começa com',
  exato: 'Exato',
  termina_com: 'Termina com',
};

export default function Admin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [regras, setRegras] = useState<RegraClassificacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [opcoes, setOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [regrasAtributo, setRegrasAtributo] = useState<RegraAtributo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opcoes');
  const { toast } = useToast();

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [c, s, r] = await Promise.all([fetchAllCategorias(), fetchAllSubcategorias(), fetchAllRegras()]);
      setCategorias(c);
      setSubcategorias(s);
      setRegras(r);
      const [oRes, raRes] = await Promise.all([
        supabase.from('concremprodutos_opcoes_classificacao').select('*').order('campo').order('valor'),
        supabase.from('concremprodutos_regras_atributo').select('*').order('campo').order('prioridade', { ascending: false }),
      ]);
      setOpcoes(oRes.data || []);
      setRegrasAtributo(raRes.data || []);
      // Usuários vêm da Edge Function administrativa (JWT do Supabase Auth).
      try {
        setUsuarios(await usuariosApi.list());
      } catch (e) {
        setUsuarios([]);
        toast({ title: 'Erro', description: e instanceof Error ? e.message : 'Falha ao carregar usuários.', variant: 'destructive' });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Administração</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="opcoes">Opções de Classificação</TabsTrigger>
          <TabsTrigger value="regras_atributo">Regras de Atributo</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="subcategorias">Subcategorias</TabsTrigger>
          <TabsTrigger value="regras">Regras Categoria</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="opcoes">
          <OpcoesTab opcoes={opcoes} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
        <TabsContent value="regras_atributo">
          <RegrasAtributoTab regrasAtributo={regrasAtributo} opcoes={opcoes} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
        <TabsContent value="categorias">
          <CategoriasTab categorias={categorias} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
        <TabsContent value="subcategorias">
          <SubcategoriasTab subcategorias={subcategorias} categorias={categorias} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
        <TabsContent value="regras">
          <RegrasTab regras={regras} categorias={categorias} subcategorias={subcategorias} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
        <TabsContent value="usuarios">
          <UsuariosTab usuarios={usuarios} onRefresh={() => loadData(true)} toast={toast} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ===================== OPÇÕES DE CLASSIFICAÇÃO =====================
function OpcoesTab({ opcoes, onRefresh, toast }: { opcoes: OpcaoClassificacao[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<OpcaoClassificacao | null>(null);
  const [campo, setCampo] = useState('movimento');
  const [valor, setValor] = useState('');
  const [saving, setSaving] = useState(false);

  const campos = Object.keys(CAMPOS_LABEL);
  const grouped = campos.reduce((acc, c) => {
    acc[c] = opcoes.filter(o => o.campo === c);
    return acc;
  }, {} as Record<string, OpcaoClassificacao[]>);

  const openNew = () => { setEditItem(null); setCampo('movimento'); setValor(''); setOpen(true); };
  const openEdit = (o: OpcaoClassificacao) => { setEditItem(o); setCampo(o.campo); setValor(o.valor); setOpen(true); };

  const isNumericCampo = (c: string) => c === 'altura_cm' || c === 'largura_cm' || c === 'espessura_cm';

  const save = async () => {
    setSaving(true);
    const raw = valor.trim();
    const valorToSave = isNumericCampo(campo) ? normalizePtNumberText(raw) : raw;
    if (isNumericCampo(campo) && !valorToSave) {
      setSaving(false);
      toast({ title: 'Valor inválido', description: 'Informe um número (ex: 210 ou 3,5)', variant: 'destructive' });
      return;
    }
    if (editItem) {
      const { error } = await supabase.from('concremprodutos_opcoes_classificacao').update({ campo, valor: valorToSave }).eq('id', editItem.id);
      setSaving(false);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Opção atualizada' });
    } else {
      const { error } = await supabase.from('concremprodutos_opcoes_classificacao').insert({ campo, valor: valorToSave });
      setSaving(false);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Opção adicionada' });
    }
    setOpen(false);
    setValor('');
    onRefresh();
  };

  const toggleAtivo = async (o: OpcaoClassificacao) => {
    await supabase.from('concremprodutos_opcoes_classificacao').update({ ativo: !o.ativo }).eq('id', o.id);
    onRefresh();
  };

  const remove = async (o: OpcaoClassificacao) => {
    await supabase.from('concremprodutos_opcoes_classificacao').delete().eq('id', o.id);
    onRefresh();
    toast({ title: 'Opção removida' });
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Gerencie os valores possíveis para cada campo de classificação (Movimento, Enchimento, etc.)</p>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nova Opção</Button>
      </div>

      {campos.map(c => (
        <div key={c} className="space-y-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{CAMPOS_LABEL[c]}</h3>
          <div className="flex flex-wrap gap-2">
            {grouped[c]?.length ? grouped[c].map(o => (
              <div key={o.id} className="flex items-center gap-1.5 border rounded-md px-3 py-1.5 bg-card text-sm">
                <span className={o.ativo ? '' : 'line-through text-muted-foreground'}>{o.valor}</span>
                <Switch checked={o.ativo} onCheckedChange={() => toggleAtivo(o)} className="scale-75" />
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(o)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => remove(o)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            )) : <span className="text-xs text-muted-foreground italic">Nenhuma opção</span>}
          </div>
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Editar' : 'Nova'} Opção de Classificação</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Campo</Label>
              <Select value={campo} onValueChange={setCampo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {campos.map(c => <SelectItem key={c} value={c}>{CAMPOS_LABEL[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                value={valor}
                onChange={e => setValor(e.target.value)}
                placeholder={isNumericCampo(campo) ? 'Ex: 210 ou 3,5' : 'Ex: Dupla, Semi-oca...'}
                inputMode={isNumericCampo(campo) ? 'decimal' : undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !valor.trim()}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== REGRAS DE ATRIBUTO =====================
function RegrasAtributoTab({ regrasAtributo, opcoes, onRefresh, toast }: { regrasAtributo: RegraAtributo[]; opcoes: OpcaoClassificacao[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<RegraAtributo | null>(null);
  const [campo, setCampo] = useState('movimento');
  const [valor, setValor] = useState('');
  const [tipoMatch, setTipoMatch] = useState<string>('contem');
  const [criterio, setCriterio] = useState('');
  const [prioridade, setPrioridade] = useState('0');
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const campos = Object.keys(CAMPOS_LABEL);
  const valoresParaCampo = opcoes.filter(o => o.campo === campo && o.ativo);

  const openNew = () => { setEditItem(null); setCampo('movimento'); setValor(''); setTipoMatch('contem'); setCriterio(''); setPrioridade('0'); setOpen(true); };
  const openEdit = (r: RegraAtributo) => { setEditItem(r); setCampo(r.campo); setValor(r.valor); setTipoMatch(r.tipo_match); setCriterio(r.criterio); setPrioridade(String(r.prioridade)); setOpen(true); };

  const save = async () => {
    setSaving(true);
    const payload = { campo, valor, tipo_match: tipoMatch, criterio: criterio.trim(), prioridade: parseInt(prioridade) || 0 };
    if (editItem) {
      const { error } = await supabase.from('concremprodutos_regras_atributo').update(payload).eq('id', editItem.id);
      setSaving(false);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Regra atualizada' });
    } else {
      const { error } = await supabase.from('concremprodutos_regras_atributo').insert(payload);
      setSaving(false);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Regra criada' });
    }
    setOpen(false);
    setCriterio(''); setValor(''); setPrioridade('0');
    onRefresh();
  };

  const toggleAtivo = async (r: RegraAtributo) => {
    await supabase.from('concremprodutos_regras_atributo').update({ ativo: !r.ativo }).eq('id', r.id);
    onRefresh();
  };

  const remove = async (r: RegraAtributo) => {
    await supabase.from('concremprodutos_regras_atributo').delete().eq('id', r.id);
    onRefresh();
    toast({ title: 'Regra removida' });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Defina regras para preencher automaticamente atributos dos produtos com base na descrição.
          <br />Ex: Se descrição <strong>contém</strong> "CORR" → Movimento = "CORRER"
        </p>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nova Regra</Button>
      </div>

      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            {(['campo','tipo_match','criterio','valor'] as const).map(f => {
              const labels: Record<string, string> = { campo: 'Campo', tipo_match: 'Tipo Match', criterio: 'Critério', valor: '→ Valor' };
              const active = sortField === f;
              return (
                <th key={f} className="px-3 py-2 text-left cursor-pointer select-none hover:bg-muted/70 group whitespace-nowrap" onClick={() => handleSort(f)}>
                  <span className="flex items-center gap-1">
                    {labels[f]}
                    {active
                      ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      : <ChevronsUpDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                  </span>
                </th>
              );
            })}
            <th className="px-3 py-2 text-left">Prior.</th>
            <th className="px-3 py-2 text-left">Ativo</th>
            <th className="px-3 py-2 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {[...regrasAtributo].sort((a, b) => {
              if (!sortField) return 0;
              const av = (a as any)[sortField] ?? '';
              const bv = (b as any)[sortField] ?? '';
              const cmp = String(av).localeCompare(String(bv), 'pt-BR', { numeric: true });
              return sortDir === 'asc' ? cmp : -cmp;
            }).map(r => (
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{CAMPOS_LABEL[r.campo] || r.campo}</Badge></td>
                <td className="px-3 py-2 text-xs">{TIPO_MATCH_LABEL[r.tipo_match]}</td>
                <td className="px-3 py-2 font-mono text-xs">"{r.criterio}"</td>
                <td className="px-3 py-2 font-medium text-xs">{r.valor}</td>
                <td className="px-3 py-2 tabular-nums">{r.prioridade}</td>
                <td className="px-3 py-2"><Switch checked={r.ativo} onCheckedChange={() => toggleAtivo(r)} /></td>
                <td className="px-3 py-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(r)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {regrasAtributo.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Nenhuma regra de atributo cadastrada</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Editar' : 'Nova'} Regra de Atributo</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Campo</Label>
              <Select value={campo} onValueChange={v => { setCampo(v); setValor(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {campos.map(c => <SelectItem key={c} value={c}>{CAMPOS_LABEL[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor a atribuir</Label>
              <Select value={valor} onValueChange={setValor}>
                <SelectTrigger><SelectValue placeholder="Selecione o valor..." /></SelectTrigger>
                <SelectContent>
                  {valoresParaCampo.map(o => <SelectItem key={o.id} value={o.valor}>{o.valor}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de comparação</Label>
              <Select value={tipoMatch} onValueChange={setTipoMatch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contem">Contém</SelectItem>
                  <SelectItem value="comeca_com">Começa com</SelectItem>
                  <SelectItem value="exato">Exato</SelectItem>
                  <SelectItem value="termina_com">Termina com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Critério (texto a buscar na descrição)</Label><Input value={criterio} onChange={e => setCriterio(e.target.value)} placeholder="Ex: CORR, SEMI-OCA, INNOV." /></div>
            <div><Label>Prioridade (maior = aplicado primeiro)</Label><Input type="number" value={prioridade} onChange={e => setPrioridade(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !criterio.trim() || !valor}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== CATEGORIAS =====================
function CategoriasTab({ categorias, onRefresh, toast }: { categorias: Categoria[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Categoria | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('#6B7280');
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEdit(null); setNome(''); setDescricao(''); setCor('#6B7280'); setOpen(true); };
  const openEdit = (c: Categoria) => { setEdit(c); setNome(c.nome); setDescricao(c.descricao || ''); setCor(c.cor); setOpen(true); };

  const save = async () => {
    setSaving(true);
    if (edit) {
      await supabase.from('concremprodutos_categorias').update({ nome, descricao, cor }).eq('id', edit.id);
    } else {
      await supabase.from('concremprodutos_categorias').insert({ nome, descricao, cor });
    }
    setSaving(false);
    setOpen(false);
    onRefresh();
    toast({ title: edit ? 'Categoria atualizada' : 'Categoria criada' });
  };

  const toggleAtivo = async (c: Categoria) => {
    await supabase.from('concremprodutos_categorias').update({ ativo: !c.ativo }).eq('id', c.id);
    onRefresh();
  };

  return (
    <div className="space-y-4 mt-4">
      <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nova Categoria</Button>
      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">Descrição</th>
            <th className="px-3 py-2 text-left">Cor</th>
            <th className="px-3 py-2 text-left">Ativo</th>
            <th className="px-3 py-2 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {categorias.map(c => (
              <tr key={c.id} className="border-b">
                <td className="px-3 py-2 font-medium">{c.nome}</td>
                <td className="px-3 py-2 text-muted-foreground">{c.descricao || '—'}</td>
                <td className="px-3 py-2"><div className="w-5 h-5 rounded" style={{ background: c.cor }} /></td>
                <td className="px-3 py-2"><Switch checked={c.ativo} onCheckedChange={() => toggleAtivo(c)} /></td>
                <td className="px-3 py-2"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? 'Editar' : 'Nova'} Categoria</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
            <div><Label>Descrição</Label><Input value={descricao} onChange={e => setDescricao(e.target.value)} /></div>
            <div><Label>Cor</Label><Input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-16 h-9 p-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !nome}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== SUBCATEGORIAS =====================
function SubcategoriasTab({ subcategorias, categorias, onRefresh, toast }: { subcategorias: Subcategoria[]; categorias: Categoria[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subcategoria | null>(null);
  const [nome, setNome] = useState('');
  const [catId, setCatId] = useState('');
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditItem(null); setNome(''); setCatId(''); setOpen(true); };
  const openEdit = (s: Subcategoria) => { setEditItem(s); setNome(s.nome); setCatId(s.categoria_id); setOpen(true); };

  const save = async () => {
    setSaving(true);
    if (editItem) {
      await supabase.from('concremprodutos_subcategorias').update({ nome, categoria_id: catId }).eq('id', editItem.id);
      toast({ title: 'Subcategoria atualizada' });
    } else {
      await supabase.from('concremprodutos_subcategorias').insert({ nome, categoria_id: catId });
      toast({ title: 'Subcategoria criada' });
    }
    setSaving(false);
    setOpen(false);
    setNome(''); setCatId('');
    onRefresh();
  };

  const toggleAtivo = async (s: Subcategoria) => {
    await supabase.from('concremprodutos_subcategorias').update({ ativo: !s.ativo }).eq('id', s.id);
    onRefresh();
  };

  const remove = async (s: Subcategoria) => {
    await supabase.from('concremprodutos_subcategorias').delete().eq('id', s.id);
    onRefresh();
    toast({ title: 'Subcategoria removida' });
  };

  const catMap = new Map(categorias.map(c => [c.id, c.nome]));

  return (
    <div className="space-y-4 mt-4">
      <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nova Subcategoria</Button>
      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">Categoria</th>
            <th className="px-3 py-2 text-left">Ativo</th>
            <th className="px-3 py-2 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {subcategorias.map(s => (
              <tr key={s.id} className="border-b">
                <td className="px-3 py-2">{s.nome}</td>
                <td className="px-3 py-2 text-muted-foreground">{catMap.get(s.categoria_id) || '—'}</td>
                <td className="px-3 py-2"><Switch checked={s.ativo} onCheckedChange={() => toggleAtivo(s)} /></td>
                <td className="px-3 py-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(s)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Editar' : 'Nova'} Subcategoria</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
            <div>
              <Label>Categoria</Label>
              <Select value={catId} onValueChange={setCatId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {categorias.filter(c => c.ativo).map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !nome || !catId}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== REGRAS =====================
function RegrasTab({ regras, categorias, subcategorias, onRefresh, toast }: { regras: RegraClassificacao[]; categorias: Categoria[]; subcategorias: Subcategoria[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<RegraClassificacao | null>(null);
  const [tipo, setTipo] = useState<'codigo' | 'descricao'>('descricao');
  const [criterio, setCriterio] = useState('');
  const [catId, setCatId] = useState('');
  const [subcatId, setSubcatId] = useState('');
  const [prioridade, setPrioridade] = useState('0');
  const [saving, setSaving] = useState(false);

  const filteredSubs = subcategorias.filter(s => s.categoria_id === catId && s.ativo);
  const catMap = new Map(categorias.map(c => [c.id, c.nome]));

  const openNew = () => { setEditItem(null); setTipo('descricao'); setCriterio(''); setCatId(''); setSubcatId(''); setPrioridade('0'); setOpen(true); };
  const openEdit = (r: RegraClassificacao) => { setEditItem(r); setTipo(r.tipo as any); setCriterio(r.criterio); setCatId(r.categoria_id || ''); setSubcatId(r.subcategoria_id || ''); setPrioridade(String(r.prioridade)); setOpen(true); };

  const save = async () => {
    setSaving(true);
    const payload = { tipo, criterio, categoria_id: catId || null, subcategoria_id: subcatId || null, prioridade: parseInt(prioridade) || 0 };
    if (editItem) {
      await supabase.from('concremprodutos_regras_classificacao').update(payload).eq('id', editItem.id);
      toast({ title: 'Regra atualizada' });
    } else {
      await supabase.from('concremprodutos_regras_classificacao').insert(payload);
      toast({ title: 'Regra criada' });
    }
    setSaving(false);
    setOpen(false);
    setCriterio(''); setCatId(''); setSubcatId(''); setPrioridade('0');
    onRefresh();
  };

  const toggleAtivo = async (r: RegraClassificacao) => {
    await supabase.from('concremprodutos_regras_classificacao').update({ ativo: !r.ativo }).eq('id', r.id);
    onRefresh();
  };

  const remove = async (r: RegraClassificacao) => {
    await supabase.from('concremprodutos_regras_classificacao').delete().eq('id', r.id);
    onRefresh();
    toast({ title: 'Regra removida' });
  };

  return (
    <div className="space-y-4 mt-4">
      <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Nova Regra</Button>
      <p className="text-xs text-muted-foreground">Por Código = match exato | Por Descrição = contém o texto</p>
      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left">Tipo</th>
            <th className="px-3 py-2 text-left">Critério</th>
            <th className="px-3 py-2 text-left">Categoria</th>
            <th className="px-3 py-2 text-left">Prior.</th>
            <th className="px-3 py-2 text-left">Ativo</th>
            <th className="px-3 py-2 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {regras.map(r => (
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{r.tipo === 'codigo' ? 'Código' : 'Descrição'}</Badge></td>
                <td className="px-3 py-2 font-mono text-xs">{r.criterio}</td>
                <td className="px-3 py-2 text-xs">{r.categoria_id ? catMap.get(r.categoria_id) || '—' : '—'}</td>
                <td className="px-3 py-2 tabular-nums">{r.prioridade}</td>
                <td className="px-3 py-2"><Switch checked={r.ativo} onCheckedChange={() => toggleAtivo(r)} /></td>
                <td className="px-3 py-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(r)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Editar' : 'Nova'} Regra de Classificação</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={v => setTipo(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="codigo">Por Código</SelectItem>
                  <SelectItem value="descricao">Por Descrição</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Critério</Label><Input value={criterio} onChange={e => setCriterio(e.target.value)} /></div>
            <div>
              <Label>Categoria</Label>
              <Select value={catId} onValueChange={v => { setCatId(v); setSubcatId(''); }}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {categorias.filter(c => c.ativo).map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {catId && (
              <div>
                <Label>Subcategoria</Label>
                <Select value={subcatId} onValueChange={setSubcatId}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {filteredSubs.map(s => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div><Label>Prioridade</Label><Input type="number" value={prioridade} onChange={e => setPrioridade(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !criterio}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===================== USUÁRIOS =====================
// Gestão de ACESSO/PAPEL. A autenticação é o Supabase Auth compartilhado — aqui
// só se vincula uma conta JÁ existente (por e-mail) e se define papel/estado.
// Não há senha nesta tela (é responsabilidade do Supabase Auth).
function UsuariosTab({ usuarios, onRefresh, toast }: { usuarios: Usuario[]; onRefresh: () => void; toast: any }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState<PapelUsuario>('editor');
  const [saving, setSaving] = useState(false);

  const errMsg = (e: unknown) => e instanceof Error ? e.message : 'Falha na operação.';

  const openNew = () => { setNome(''); setEmail(''); setPapel('editor'); setOpen(true); };

  const add = async () => {
    setSaving(true);
    try {
      await usuariosApi.addByEmail({ email, nome: nome || undefined, papel });
      toast({ title: 'Acesso concedido' });
      setOpen(false);
      onRefresh();
    } catch (e) {
      toast({ title: 'Erro', description: errMsg(e), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const changePapel = async (u: Usuario, novo: PapelUsuario) => {
    try {
      await usuariosApi.setPapel(u.id, novo);
      onRefresh();
    } catch (e) {
      toast({ title: 'Erro', description: errMsg(e), variant: 'destructive' });
    }
  };

  const toggleAtivo = async (u: Usuario) => {
    try {
      await usuariosApi.toggle(u.id, !u.ativo);
      onRefresh();
    } catch (e) {
      toast({ title: 'Erro', description: errMsg(e), variant: 'destructive' });
    }
  };

  const remove = async (u: Usuario) => {
    try {
      await usuariosApi.remove(u.id);
      onRefresh();
      toast({ title: 'Acesso removido' });
    } catch (e) {
      toast({ title: 'Erro', description: errMsg(e), variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Conceder acesso</Button>
      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">E-mail</th>
            <th className="px-3 py-2 text-left">Papel</th>
            <th className="px-3 py-2 text-left">Ativo</th>
            <th className="px-3 py-2 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b">
                <td className="px-3 py-2">
                  {u.nome}
                  {u.proprietario && <Badge variant="secondary" className="ml-2">Proprietário</Badge>}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{u.auth_email || u.email}</td>
                <td className="px-3 py-2">
                  <Select value={u.papel} onValueChange={(v) => changePapel(u, v as PapelUsuario)} disabled={u.proprietario}>
                    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Switch checked={u.ativo} onCheckedChange={() => toggleAtivo(u)} disabled={u.proprietario} />
                </td>
                <td className="px-3 py-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(u)} disabled={u.proprietario}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conceder acesso ao classificador</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A conta precisa já existir no login corporativo (Supabase Auth). Informe o e-mail cadastrado lá.
            </p>
            <div><Label>E-mail corporativo</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@concrem.com.br" /></div>
            <div><Label>Nome (opcional)</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
            <div>
              <Label>Papel</Label>
              <Select value={papel} onValueChange={(v) => setPapel(v as PapelUsuario)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor (classifica produtos)</SelectItem>
                  <SelectItem value="admin">Administrador (gerencia regras e usuários)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={add} disabled={saving || !email}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Conceder'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
