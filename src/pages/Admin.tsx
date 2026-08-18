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
import { normalizePtNumberText, parsePtNumber, formatPtNumber } from '@/lib/numbers';
import { casaBusca, normalizaBusca } from '@/lib/busca';
import { CAMPOS_APLICAVEIS } from '@/lib/completude';
import { BuscaInput } from '@/components/BuscaInput';

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
  batente_cm: 'Batente (cm)',
  alizar_l: 'Alizar — L (cm)',
  alizar_a: 'Alizar — A (cm)',
};

// Campos numéricos: o valor é digitado, não escolhido numa lista de opções
const CAMPOS_NUMERICOS = new Set(['altura_cm', 'largura_cm', 'espessura_cm', 'batente_cm', 'alizar_l', 'alizar_a']);

// Campos com lista de opções cadastrável. Batente e alizar ficam de fora: são
// alvo de regra, mas a tela de Classificação não lê opções deles — cadastrar
// valores ali geraria dado morto.
const CAMPOS_COM_OPCOES = Object.keys(CAMPOS_LABEL).filter(
  c => !['batente_cm', 'alizar_l', 'alizar_a'].includes(c),
);

const TIPO_MATCH_LABEL: Record<string, string> = {
  contem: 'Contém',
  comeca_com: 'Começa com',
  exato: 'Exato',
  termina_com: 'Termina com',
  nao_contem: 'Não contém',
};

const STATUS_OPTS = [
  { value: 'ativos',   label: 'Ativos' },
  { value: 'inativos', label: 'Inativos' },
];

// ---------- peças de filtro compartilhadas pelas abas ----------

function PainelFiltros({ children, resumo }: { children: React.ReactNode; resumo?: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {resumo && <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">{resumo}</div>}
      </div>
    </div>
  );
}

function FiltroSelect({ label, value, onChange, options, padrao, className }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  padrao?: string;
  className?: string;
}) {
  const emUso = value !== (padrao ?? '');
  return (
    <Select value={value} onValueChange={v => onChange(v === '__all__' ? '' : v)}>
      <SelectTrigger className={cn('h-8 w-[150px] text-xs', emUso && 'border-primary text-primary', className)}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todos</SelectItem>
        {options.map(opt => {
          const v = typeof opt === 'string' ? opt : opt.value;
          const l = typeof opt === 'string' ? opt : opt.label;
          return <SelectItem key={v} value={v}>{l}</SelectItem>;
        })}
      </SelectContent>
    </Select>
  );
}


export default function Admin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [regras, setRegras] = useState<RegraClassificacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [opcoes, setOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [regrasAtributo, setRegrasAtributo] = useState<RegraAtributo[]>([]);
  const [aplicabilidade, setAplicabilidade] = useState<{ tipo_produto: string; campo: string }[]>([]);
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
      const aplRes = await supabase.from('concremprodutos_aplicabilidade').select('tipo_produto, campo');
      setAplicabilidade(aplRes.error ? [] : (aplRes.data || []));
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
    <div className="mx-auto max-w-[1500px] space-y-4 p-6">
      <h1 className="text-2xl font-bold">Administração</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="opcoes">Opções de Classificação</TabsTrigger>
          <TabsTrigger value="regras_atributo">Regras de Atributo</TabsTrigger>
          <TabsTrigger value="aplicabilidade">Campos por Tipo</TabsTrigger>
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
        <TabsContent value="aplicabilidade">
          <AplicabilidadeTab
            aplicabilidade={aplicabilidade}
            opcoes={opcoes}
            onRefresh={() => loadData(true)}
            toast={toast}
          />
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

  const [busca, setBusca] = useState('');
  const [fCampo, setFCampo] = useState('');
  const [fStatus, setFStatus] = useState('');

  const campos = CAMPOS_COM_OPCOES;

  // Cada campo vira um cartão; a busca filtra os valores dentro deles
  const visiveis = opcoes.filter(o =>
    (!fCampo || o.campo === fCampo) &&
    (!fStatus || (fStatus === 'ativos' ? o.ativo : !o.ativo)) &&
    casaBusca(busca, o.valor)
  );
  const grouped = campos.reduce((acc, c) => {
    const lista = visiveis.filter(o => o.campo === c);
    // Campo numérico vinha ordenado como texto — 7.5 e 92 caíam depois de 240.
    // Maior primeiro, que é a ordem em que se procura uma medida.
    acc[c] = CAMPOS_NUMERICOS.has(c)
      ? [...lista].sort((a, b) => (parsePtNumber(b.valor) ?? 0) - (parsePtNumber(a.valor) ?? 0))
      : lista;
    return acc;
  }, {} as Record<string, OpcaoClassificacao[]>);
  const camposComResultado = campos.filter(c => grouped[c].length > 0);
  const filtrando = !!(busca || fCampo || fStatus);
  // Sem filtro, mostra todos os campos (inclusive vazios, para dar onde clicar em "+")
  const camposNaTela = filtrando ? camposComResultado : campos;

  const openNew = (campoInicial?: string) => { setEditItem(null); setCampo(campoInicial || 'movimento'); setValor(''); setOpen(true); };
  const openEdit = (o: OpcaoClassificacao) => { setEditItem(o); setCampo(o.campo); setValor(o.valor); setOpen(true); };

  const isNumericCampo = (c: string) => CAMPOS_NUMERICOS.has(c);

  /**
   * Já existe essa opção no campo? Compara pelo valor normalizado: em campo
   * numérico "7,5" e "7.5" são a mesma medida; em texto, "Branco" e "BRANCO"
   * são a mesma cor. Ignora o próprio item quando se está editando.
   */
  const jaExiste = (campoAlvo: string, valorBruto: string, ignorarId?: string) => {
    const bruto = valorBruto.trim();
    if (!bruto) return false;
    const numerico = isNumericCampo(campoAlvo);
    const alvo = numerico ? parsePtNumber(bruto) : normalizaBusca(bruto);
    if (alvo === null) return false;
    return opcoes.some(o =>
      o.campo === campoAlvo &&
      o.id !== ignorarId &&
      (numerico ? parsePtNumber(o.valor) === alvo : normalizaBusca(o.valor) === alvo));
  };

  const duplicado = jaExiste(campo, valor, editItem?.id);

  const save = async () => {
    const raw = valor.trim();
    if (jaExiste(campo, raw, editItem?.id)) {
      toast({
        title: 'Essa opção já existe',
        description: `"${raw}" já está cadastrado em ${CAMPOS_LABEL[campo]}.`,
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
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
    <div className="mt-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">Gerencie os valores possíveis para cada campo de classificação (Movimento, Enchimento, etc.)</p>
        <Button size="sm" onClick={() => openNew()}><Plus className="mr-1 h-4 w-4" /> Nova Opção</Button>
      </div>

      <PainelFiltros
        resumo={
          <>
            <span>
              <strong className="font-semibold text-foreground">{visiveis.length}</strong> de {opcoes.length} opções
              {filtrando && ` · ${camposComResultado.length} campo(s)`}
            </span>
            {filtrando && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"
                onClick={() => { setBusca(''); setFCampo(''); setFStatus(''); }}>
                Limpar filtros
              </Button>
            )}
          </>
        }
      >
        <BuscaInput value={busca} onChange={setBusca} placeholder="Buscar valor..." className="w-[220px]" />
        <FiltroSelect label="Campo"  value={fCampo}  onChange={setFCampo}
          options={campos.map(c => ({ value: c, label: CAMPOS_LABEL[c] }))} />
        <FiltroSelect label="Status" value={fStatus} onChange={setFStatus} options={STATUS_OPTS} className="w-[120px]" />
      </PainelFiltros>

      {/* Um cartão por campo. Multi-coluna em vez de grid: os cartões têm alturas
          bem diferentes (Cor tem 18 valores, Liso/Frisado tem 2) e o grid deixaria
          buracos alinhando a altura da linha ao cartão mais alto. */}
      <div className="columns-1 gap-3 lg:columns-2 2xl:columns-3">
        {camposNaTela.map(c => (
          <div key={c} className="mb-3 break-inside-avoid rounded-lg border bg-card">
            <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-1.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {CAMPOS_LABEL[c]}
              </h3>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] tabular-nums">{grouped[c].length}</Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6" title={`Nova opção em ${CAMPOS_LABEL[c]}`}
                  onClick={() => openNew(c)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2">
              {grouped[c].length ? grouped[c].map(o => (
                <div key={o.id} className="flex items-center gap-1 rounded-md border bg-background py-1 pl-2 pr-1 text-xs">
                  <span className={o.ativo ? '' : 'text-muted-foreground line-through'}>
                    {CAMPOS_NUMERICOS.has(c) ? formatPtNumber(parsePtNumber(o.valor)) || o.valor : o.valor}
                  </span>
                  <Switch checked={o.ativo} onCheckedChange={() => toggleAtivo(o)} className="scale-[0.6]" />
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(o)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => remove(o)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              )) : <span className="px-1 py-0.5 text-xs italic text-muted-foreground">Nenhuma opção</span>}
            </div>
          </div>
        ))}
      </div>

      {filtrando && camposComResultado.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma opção encontrada</p>
      )}

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
                className={cn(duplicado && 'border-destructive')}
              />
              {duplicado && (
                <p className="mt-1 text-xs text-destructive">
                  Já existe em {CAMPOS_LABEL[campo]}.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !valor.trim() || duplicado}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
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
  const [busca, setBusca] = useState('');
  const [fCampo, setFCampo] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [fStatus, setFStatus] = useState('');

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const campos = Object.keys(CAMPOS_LABEL);
  const valoresParaCampo = opcoes.filter(o => o.campo === campo && o.ativo);

  const filtrando = !!(busca || fCampo || fTipo || fStatus);
  const limparFiltros = () => { setBusca(''); setFCampo(''); setFTipo(''); setFStatus(''); };

  // Campos que realmente têm regra, com a contagem — o filtro só oferece o que existe
  const contagemPorCampo = regrasAtributo.reduce((acc, r) => {
    acc[r.campo] = (acc[r.campo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const camposComRegra = campos.filter(c => contagemPorCampo[c]);

  const visiveis = regrasAtributo
    .filter(r =>
      (!fCampo || r.campo === fCampo) &&
      (!fTipo || r.tipo_match === fTipo) &&
      (!fStatus || (fStatus === 'ativos' ? r.ativo : !r.ativo)) &&
      casaBusca(busca, r.criterio, r.valor)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const av = (a as unknown as Record<string, unknown>)[sortField] ?? '';
      const bv = (b as unknown as Record<string, unknown>)[sortField] ?? '';
      const cmp = String(av).localeCompare(String(bv), 'pt-BR', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const openNew = () => { setEditItem(null); setCampo('movimento'); setValor(''); setTipoMatch('contem'); setCriterio(''); setPrioridade('0'); setOpen(true); };
  const openEdit = (r: RegraAtributo) => { setEditItem(r); setCampo(r.campo); setValor(r.valor); setTipoMatch(r.tipo_match); setCriterio(r.criterio); setPrioridade(String(r.prioridade)); setOpen(true); };

  // Campo numérico virou texto livre (para aceitar 0 = "não tem"), então precisa
  // de guarda: valor não numérico salva, mas o motor descarta a regra em silêncio.
  const valorNumericoInvalido =
    CAMPOS_NUMERICOS.has(campo) && normalizePtNumberText(valor.trim()) === null;

  const save = async () => {
    if (valorNumericoInvalido) {
      toast({ title: 'Valor inválido', description: 'Informe um número (ex: 15, 3,5 ou 0).', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const valorFinal = CAMPOS_NUMERICOS.has(campo) ? normalizePtNumberText(valor.trim())! : valor;
    const payload = { campo, valor: valorFinal, tipo_match: tipoMatch, criterio: criterio.trim(), prioridade: parseInt(prioridade) || 0 };
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

      <PainelFiltros
        resumo={
          <>
            <span>
              <strong className="font-semibold text-foreground">{visiveis.length}</strong> de {regrasAtributo.length} regras
            </span>
            {filtrando && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            )}
          </>
        }
      >
        <BuscaInput value={busca} onChange={setBusca} placeholder="Buscar critério ou valor..." className="w-[240px]" />
        <FiltroSelect
          label="Campo" value={fCampo} onChange={setFCampo}
          options={camposComRegra.map(c => ({ value: c, label: `${CAMPOS_LABEL[c]} (${contagemPorCampo[c]})` }))}
          className="w-[190px]"
        />
        <FiltroSelect
          label="Tipo de comparação" value={fTipo} onChange={setFTipo}
          options={Object.entries(TIPO_MATCH_LABEL).map(([value, label]) => ({ value, label }))}
          className="w-[170px]"
        />
        <FiltroSelect label="Status" value={fStatus} onChange={setFStatus} options={STATUS_OPTS} className="w-[120px]" />
      </PainelFiltros>

      {/* rolagem própria + cabeçalho fixo: a lista passa de 300 regras */}
      <div className="max-h-[calc(100vh-330px)] overflow-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead><tr>
            {(['campo','tipo_match','criterio','valor'] as const).map(f => {
              const labels: Record<string, string> = { campo: 'Campo', tipo_match: 'Tipo Match', criterio: 'Critério', valor: '→ Valor' };
              const active = sortField === f;
              return (
                <th
                  key={f}
                  className="group sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap bg-muted px-3 py-2 text-left shadow-[inset_0_-1px_0_hsl(var(--border))] hover:bg-secondary"
                  onClick={() => handleSort(f)}
                >
                  <span className="flex items-center gap-1">
                    {labels[f]}
                    {active
                      ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      : <ChevronsUpDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                  </span>
                </th>
              );
            })}
            {['Prior.', 'Ativo', 'Ações'].map(h => (
              <th key={h} className="sticky top-0 z-10 whitespace-nowrap bg-muted px-3 py-2 text-left shadow-[inset_0_-1px_0_hsl(var(--border))]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {visiveis.map(r => (
              <tr key={r.id} className={cn('border-b transition-colors hover:bg-muted', !r.ativo && 'text-muted-foreground')}>
                <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{CAMPOS_LABEL[r.campo] || r.campo}</Badge></td>
                <td className="px-3 py-2 text-xs">{TIPO_MATCH_LABEL[r.tipo_match] || r.tipo_match}</td>
                <td className="px-3 py-2 font-mono text-xs">"{r.criterio}"</td>
                <td className="px-3 py-2 text-xs font-medium">{r.valor}</td>
                <td className="px-3 py-2 tabular-nums">{r.prioridade}</td>
                <td className="px-3 py-2"><Switch checked={r.ativo} onCheckedChange={() => toggleAtivo(r)} /></td>
                <td className="flex gap-1 px-3 py-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(r)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                {regrasAtributo.length === 0 ? 'Nenhuma regra de atributo cadastrada' : 'Nenhuma regra encontrada com esses filtros'}
              </td></tr>
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
              {CAMPOS_NUMERICOS.has(campo) ? (
                <>
                  <Input
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    inputMode="decimal"
                    placeholder="Ex: 15  •  use 0 para “não tem”"
                    className={cn(valor.trim() && valorNumericoInvalido && 'border-destructive')}
                  />
                  {valor.trim() && valorNumericoInvalido && (
                    <p className="mt-1 text-xs text-destructive">Precisa ser um número (ex: 15, 3,5 ou 0).</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Medida com <strong>0</strong> significa que o produto não tem essa característica —
                    e por ser um valor preenchido, ele deixa de aparecer como incompleto.
                  </p>
                </>
              ) : (
                <Select value={valor} onValueChange={setValor}>
                  <SelectTrigger><SelectValue placeholder="Selecione o valor..." /></SelectTrigger>
                  <SelectContent>
                    {valoresParaCampo.map(o => <SelectItem key={o.id} value={o.valor}>{o.valor}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label>Tipo de comparação</Label>
              <Select value={tipoMatch} onValueChange={setTipoMatch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contem">Contém</SelectItem>
                  <SelectItem value="nao_contem">Não contém</SelectItem>
                  <SelectItem value="comeca_com">Começa com</SelectItem>
                  <SelectItem value="exato">Exato</SelectItem>
                  <SelectItem value="termina_com">Termina com</SelectItem>
                </SelectContent>
              </Select>
              {tipoMatch === 'nao_contem' && (
                <div className="mt-1 space-y-1 rounded-md border border-amber-200 bg-amber-50/60 px-2.5 py-2 text-xs text-muted-foreground">
                  <p>
                    Varre <strong>todo o catálogo</strong>: aplica o valor a cada produto cuja
                    descrição não traz o critério (só onde o campo ainda está vazio, para não
                    apagar o que foi classificado à mão).
                  </p>
                  <p>
                    O critério é buscado <strong>iniciando uma palavra</strong> — a sigla que você
                    digitar, e não um trecho no meio de outra palavra. Com <code>AL</code>:
                    encontra <code>AL5x8,5CM</code> e <code>ALIZAR</code>; ignora <code>METAL</code> e{' '}
                    <code>GERAL</code>.
                  </p>
                  <p className="text-amber-800">
                    <strong>Cuidado:</strong> por isso o critério precisa ser o começo do termo.
                    <code>15CM</code> seria considerado ausente em <code>(BAT15CM)</code>, porque ali
                    ele vem colado depois de <code>BAT</code> — e a regra gravaria o valor em produtos
                    que têm a característica. Use a sigla que inicia o termo (<code>BAT</code>).
                  </p>
                  <p>
                    Ex.: campo <strong>Alizar — L (cm)</strong>, critério <code>AL</code>,
                    valor <code>0</code> → marca “sem alizar” todo produto sem AL na descrição.
                  </p>
                </div>
              )}
            </div>
            <div><Label>Critério (texto a buscar na descrição)</Label><Input value={criterio} onChange={e => setCriterio(e.target.value)} placeholder="Ex: CORR, SEMI-OCA, INNOV." /></div>
            <div><Label>Prioridade (maior = aplicado primeiro)</Label><Input type="number" value={prioridade} onChange={e => setPrioridade(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || !criterio.trim() || !valor.trim() || valorNumericoInvalido}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// ===================== CAMPOS POR TIPO (APLICABILIDADE) =====================
function AplicabilidadeTab({ aplicabilidade, opcoes, onRefresh, toast }: {
  aplicabilidade: { tipo_produto: string; campo: string }[];
  opcoes: OpcaoClassificacao[];
  onRefresh: () => void;
  toast: any;
}) {
  const [salvando, setSalvando] = useState<string | null>(null);

  // Os tipos vêm das opções cadastradas em "Tipo Produto"
  const tipos = opcoes
    .filter(o => o.campo === 'tipo_produto')
    .map(o => o.valor.toUpperCase().trim())
    .sort();

  const naoSeAplica = new Set(aplicabilidade.map(a => `${a.tipo_produto.toUpperCase().trim()}|${a.campo}`));

  const alternar = async (tipo: string, campo: string, aplicaAgora: boolean) => {
    const chave = `${tipo}|${campo}`;
    setSalvando(chave);
    const { error } = aplicaAgora
      // passou a NÃO se aplicar → grava a exceção
      ? await supabase.from('concremprodutos_aplicabilidade').insert({ tipo_produto: tipo, campo })
      // voltou a se aplicar → remove a exceção
      : await supabase.from('concremprodutos_aplicabilidade')
          .delete().eq('tipo_produto', tipo).eq('campo', campo);
    setSalvando(null);
    if (error) {
      toast({ title: 'Não foi possível salvar', description: error.message, variant: 'destructive' });
      return;
    }
    onRefresh();
  };

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-muted-foreground">
        Marque os campos que <strong>se aplicam</strong> a cada tipo de produto. Campo desmarcado
        some da tela de classificação e nunca conta como pendência — é assim que um ALIZAR não é
        cobrado por movimento. Vale para produto novo e antigo, na hora.
      </p>

      {tipos.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Cadastre os valores de "Tipo Produto" em Opções de Classificação primeiro.
        </p>
      )}

      <div className="columns-1 gap-3 lg:columns-2 2xl:columns-3">
        {tipos.map(tipo => {
          const aplicaveis = CAMPOS_APLICAVEIS.filter(c => !naoSeAplica.has(`${tipo}|${c}`)).length;
          return (
            <div key={tipo} className="mb-3 break-inside-avoid rounded-lg border bg-card">
              <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{tipo}</h3>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] tabular-nums">
                  {aplicaveis}/{CAMPOS_APLICAVEIS.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-2">
                {CAMPOS_APLICAVEIS.map(campo => {
                  const chave = `${tipo}|${campo}`;
                  const aplica = !naoSeAplica.has(chave);
                  return (
                    <label key={campo} className="flex items-center gap-1.5 text-xs">
                      <Switch
                        checked={aplica}
                        disabled={salvando === chave}
                        onCheckedChange={() => alternar(tipo, campo, aplica)}
                        className="scale-[0.6]"
                      />
                      <span className={aplica ? '' : 'text-muted-foreground line-through'}>
                        {CAMPOS_LABEL[campo] || (campo === 'alizar' ? 'Alizar (L×A)' : campo)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
