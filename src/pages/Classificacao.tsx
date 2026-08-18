import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase, fetchAllProdutos, fetchAllRegras } from '@/lib/supabase';
import { parseProduto } from '@/lib/parser';
import { Produto, OpcaoClassificacao, RegraAtributo } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Save, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, Columns3, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPtNumber, parsePtNumber } from '@/lib/numbers';
import { casaRegraAtributo } from '@/lib/match-regras';
import { casaBusca } from '@/lib/busca';
import { emLotes, agruparPorAtualizacao } from '@/lib/lotes';
import { marcarRegra, marcarManual, limparCamposDeRegra } from '@/lib/origem';
import {
  ATTR_FIELDS, DIM_FIELDS, type AttrField, isBlank, inativo, seAplica,
  camposFaltando, situacaoCorreta, montarAplicabilidade, APLICABILIDADE_PADRAO,
  type Aplicabilidade,
} from '@/lib/completude';
import { BuscaInput } from '@/components/BuscaInput';

const PAGE_SIZE = 50;


// Sentinela dos filtros: "campo sem valor preenchido"
const EMPTY = '__empty__';

const LOTE_UPDATE = 200;   // ids por UPDATE em massa

// "Todos", que o próprio FilterSelect acrescenta, equivale a ativos + inativos
const USO_OPTS = [
  { value: 'ativos',   label: 'Ativos' },
  { value: 'inativos', label: 'Inativos' },
];

// 0 numa medida significa "não tem" (convenção das regras "não contém")
const medidaTexto = (v: number | null | undefined) => (v === 0 ? 'não tem' : formatPtNumber(v));


const FALTA_ATTR = new Set<string>(ATTR_FIELDS);

// Avalia o filtro "Classificação" (completude dos atributos, não a situação)
function matchClassificacao(p: Produto, modo: string, aplicabilidade: Aplicabilidade): boolean {
  if (!modo) return true;
  const faltando = camposFaltando(p, aplicabilidade);
  switch (modo) {
    case 'incompleto':    return faltando.length > 0;
    case 'completo':      return faltando.length === 0;
    case 'sem_atributo':  return faltando.some(f => FALTA_ATTR.has(f));
    case 'sem_dimensao':  return faltando.some(f => !FALTA_ATTR.has(f));
    default:              return true;
  }
}

const CLASSIF_OPTS = [
  { value: 'incompleto',   label: 'Incompletos' },
  { value: 'completo',     label: 'Completos' },
  { value: 'sem_atributo', label: 'Sem atributos' },
  { value: 'sem_dimensao', label: 'Sem dimensões' },
];


const ATTR_LABELS: Record<AttrField, string> = {
  tipo_produto:  'Tipo',
  movimento:     'Movimento',
  enchimento:    'Enchimento',
  revestimento:  'Revestimento',
  linha:         'Linha',
  perfil:        'Liso/Frisado',
  cor:           'Cor',
  protect_plus:  'Protect+',
  veneziana:     'Veneziana',
  visor:         'Visor',
};

// Cada medida ganha sua própria coluna (antes as 3 dimensões dividiam uma célula
// só, com os números cortados)
const MEDIDA_COLS = [
  { key: 'altura_cm',    label: 'Alt',     sort: 'altura_cm'  },
  { key: 'largura_cm',   label: 'Larg',    sort: 'largura_cm' },
  { key: 'espessura_cm', label: 'Esp',     sort: 'espessura_cm' },
  { key: 'batente_cm',   label: 'Batente', sort: 'batente_cm' },
  { key: 'alizar',       label: 'Alizar',  sort: 'alizar_l'   },
] as const;

// Nomes completos para o menu "Colunas"
const COL_LABELS: Record<string, string> = {
  ...ATTR_LABELS,
  altura_cm: 'Altura', largura_cm: 'Largura', espessura_cm: 'Espessura',
  batente_cm: 'Batente', alizar: 'Alizar (L×A)',
};

const COLS_KEY = 'classificacao:colunas-ocultas';
const DESC_W_KEY = 'classificacao:largura-descricao';
const DESC_W_MIN = 150;
const DESC_W_MAX = 640;
const DESC_W_COMPACTA = 230;
const DESC_W_LARGA = 480;

const STATUS_OPTS = [
  { value: 'pendente',     label: 'Pendente' },
  { value: 'classificado', label: 'Classificado' },
];

// Controles "fantasma": o valor lê como texto e a moldura só aparece no
// hover/foco — evita a parede de caixas que embaralhava a leitura da grade.
const GHOST_SELECT =
  'h-7 w-full gap-0.5 rounded border-transparent bg-transparent px-1.5 text-[11px] shadow-none ' +
  'focus:ring-1 focus:ring-offset-0 hover:border-input hover:bg-background ' +
  'data-[state=open]:border-input data-[state=open]:bg-background ' +
  'data-[placeholder]:text-muted-foreground/50 ' +
  '[&>svg]:h-3 [&>svg]:w-3 [&>svg]:opacity-0 hover:[&>svg]:opacity-50 data-[state=open]:[&>svg]:opacity-50 ' +
  '[&>span]:truncate';
const GHOST_INPUT =
  'h-7 w-full rounded border-transparent bg-transparent pl-1 pr-1.5 text-right text-[11px] tabular-nums shadow-none ' +
  'placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-offset-0 ' +
  'hover:border-input hover:bg-background ' +
  // o Chromium desenha uma seta dentro de todo input com datalist e ela comia o
  // último dígito da medida ("210" virava "21("). O !important é necessário: sem ele
  // o estilo do próprio navegador vence. As sugestões continuam aparecendo ao digitar.
  '[&::-webkit-calendar-picker-indicator]:!hidden';

// Cabeçalho fixo em 2 níveis: faixa de grupos (24px) + colunas (30px).
// Bordas viram box-shadow porque border-collapse não pinta borda em célula sticky.
const LINHA_HEADER = 'shadow-[inset_0_-1px_0_hsl(var(--border))]';
const BAND  = 'sticky top-0 z-20 h-6 bg-secondary px-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground';
const TH    = `sticky top-6 z-20 h-[30px] bg-muted ${LINHA_HEADER}`;
const TD    = 'px-1.5 py-1 align-middle';
const GRUPO = 'border-l border-border';        // separador entre grupos de colunas
const DIVISOR_STICKY = 'shadow-[inset_-1px_0_0_hsl(var(--border))]';
const DIVISOR_ESQ    = 'shadow-[inset_1px_0_0_hsl(var(--border))]';
// header sticky precisa das duas linhas (lateral + base) num único box-shadow
const DIVISOR_TH     = 'shadow-[inset_-1px_0_0_hsl(var(--border)),inset_0_-1px_0_hsl(var(--border))]';
const DIVISOR_ESQ_TH = 'shadow-[inset_1px_0_0_hsl(var(--border)),inset_0_-1px_0_hsl(var(--border))]';
const W_CODIGO = 'w-[74px] min-w-[74px] max-w-[74px]';
const W_STATUS = 'w-[106px] min-w-[106px]';
const W_ACAO   = 'w-[74px] min-w-[74px]';

interface ModifiedFields {
  tipo_produto?: string | null;
  movimento?: string | null;
  enchimento?: string | null;
  revestimento?: string | null;
  linha?: string | null;
  perfil?: string | null;
  cor?: string | null;
  altura_cm?: number | null;
  largura_cm?: number | null;
  espessura_cm?: number | null;
  protect_plus?: string | null;
  veneziana?: string | null;
  visor?: string | null;
  batente_cm?: number | null;
  alizar_l?: number | null;
  alizar_a?: number | null;
}

export default function Classificacao() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [opcoes, setOpcoes] = useState<OpcaoClassificacao[]>([]);
  // Quais campos não se aplicam a cada tipo. Vem da tabela; enquanto não carrega
  // (ou em base sem a migration) usa o padrão, que reproduz o comportamento antigo.
  const [aplicabilidade, setAplicabilidade] = useState<Aplicabilidade>(APLICABILIDADE_PADRAO);
  const [loading, setLoading] = useState(true);
  const [modified, setModified] = useState<Map<string, ModifiedFields>>(new Map());
  const [page, setPage] = useState(0);

  const [fTipo, setFTipo] = useState('');
  const [fMov, setFMov] = useState('');
  const [fEnch, setFEnch] = useState('');
  const [fRev, setFRev] = useState('');
  const [fLinha, setFLinha] = useState('');
  const [fPerfil, setFPerfil] = useState('');
  const [fCor, setFCor] = useState('');
  const [fAltura, setFAltura] = useState('');
  const [fLargura, setFLargura] = useState('');
  const [fBatente, setFBatente] = useState('');
  const [fAlizar, setFAlizar] = useState('');
  const [fProtect, setFProtect] = useState('');
  const [fVeneziana, setFVeneziana] = useState('');
  const [fVisor, setFVisor] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fClassif, setFClassif] = useState('');
  const [fUso, setFUso] = useState('ativos');   // produtos fora de linha ficam fora por padrão
  const [busca, setBusca] = useState('');
  const [showRevisao, setShowRevisao] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoResult, setAutoResult] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<string | null>(null);   // progresso do Aplicar Regras
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [nullsFirst, setNullsFirst] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);
  const [colsOcultas, setColsOcultas] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(COLS_KEY);
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch { return new Set<string>(); }
  });
  const [descW, setDescW] = useState<number>(() => {
    const salvo = Number(localStorage.getItem(DESC_W_KEY));
    return salvo >= DESC_W_MIN && salvo <= DESC_W_MAX ? salvo : DESC_W_COMPACTA;
  });
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try { localStorage.setItem(COLS_KEY, JSON.stringify([...colsOcultas])); } catch { /* modo privado */ }
  }, [colsOcultas]);

  useEffect(() => {
    try { localStorage.setItem(DESC_W_KEY, String(descW)); } catch { /* modo privado */ }
  }, [descW]);

  // Arraste da borda do cabeçalho "Descrição" para ler a descrição inteira
  const arraste = useRef<{ x: number; w: number } | null>(null);
  const iniciarArraste = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    arraste.current = { x: e.clientX, w: descW };
    const mover = (ev: PointerEvent) => {
      const inicio = arraste.current;
      if (!inicio) return;
      setDescW(Math.min(DESC_W_MAX, Math.max(DESC_W_MIN, inicio.w + ev.clientX - inicio.x)));
    };
    const soltar = () => {
      arraste.current = null;
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
  };

  const toggleCol = (key: string) => setColsOcultas(prev => {
    const n = new Set(prev);
    if (n.has(key)) n.delete(key); else n.add(key);
    return n;
  });

  const attrCols   = ATTR_FIELDS.filter(f => !colsOcultas.has(f));
  const medidaCols = MEDIDA_COLS.filter(c => !colsOcultas.has(c.key));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, oRes, aplRes] = await Promise.all([
        fetchAllProdutos(),
        supabase.from('concremprodutos_opcoes_classificacao').select('*').eq('ativo', true).order('campo').order('valor'),
        supabase.from('concremprodutos_aplicabilidade').select('tipo_produto, campo'),
      ]);
      setProdutos(p);
      setOpcoes(oRes.data || []);
      // erro (tabela ainda não criada) cai no padrão, sem quebrar a tela
      setAplicabilidade(montarAplicabilidade(aplRes.error ? null : aplRes.data));
    } catch {
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  // Group options by field
  const opcoesPorCampo = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const f of ATTR_FIELDS) map[f] = [];
    for (const f of DIM_FIELDS) map[f] = [];
    for (const o of opcoes) {
      if (map[o.campo]) map[o.campo].push(o.valor);
    }
    return map;
  }, [opcoes]);

  const filtered = useMemo(() => {
    // Cada filtro aceita '' (todos), EMPTY (só sem valor) ou um valor exato
    const matchTexto = (valor: unknown, filtro: string) =>
      !filtro || (filtro === EMPTY ? isBlank(valor) : valor === filtro);
    const matchNum = (valor: number | null | undefined, filtro: string) =>
      !filtro || (filtro === EMPTY ? isBlank(valor) : valor === parsePtNumber(filtro));

    return produtos.filter(p => {
      if (fUso === 'ativos'   && inativo(p)) return false;
      if (fUso === 'inativos' && !inativo(p)) return false;
      if (!casaBusca(busca, p.codigo, p.descricao)) return false;

      if (!matchTexto(p.tipo_produto, fTipo))    return false;
      if (!matchTexto(p.movimento,    fMov))     return false;
      if (!matchTexto(p.enchimento,   fEnch))    return false;
      if (!matchTexto(p.revestimento, fRev))     return false;
      if (!matchTexto(p.linha,        fLinha))   return false;
      if (!matchTexto(p.perfil,       fPerfil))  return false;
      if (!matchTexto(p.cor,          fCor))     return false;
      if (!matchNum(p.altura_cm,      fAltura))  return false;
      if (!matchNum(p.largura_cm,     fLargura)) return false;
      if (!matchNum(p.batente_cm,     fBatente)) return false;
      if (fAlizar === EMPTY) {
        if (!isBlank(p.alizar_l) && !isBlank(p.alizar_a)) return false;
      } else if (fAlizar) {
        const [lStr, aStr] = fAlizar.split('x');
        if (p.alizar_l !== parsePtNumber(lStr) || p.alizar_a !== parsePtNumber(aStr)) return false;
      }
      if (!matchTexto(p.protect_plus, fProtect))   return false;
      if (!matchTexto(p.veneziana,    fVeneziana)) return false;
      if (!matchTexto(p.visor,        fVisor))     return false;
      if (fStatus  && p.situacao     !== fStatus)  return false;
      if (!matchClassificacao(p, fClassif, aplicabilidade)) return false;
      return true;
    });
  }, [produtos, fTipo, fMov, fEnch, fRev, fLinha, fPerfil, fCor, fAltura, fLargura, fBatente, fAlizar, fProtect, fVeneziana, fVisor, fStatus, fClassif, fUso, busca]);

  // Produto fora de linha não precisa de classificação: não conta como pendência
  const incompletos = useMemo(
    () => filtered.filter(p => !inativo(p) && camposFaltando(p, aplicabilidade).length > 0).length,
    [filtered],
  );

  const comOrigemRegra = useMemo(
    () => produtos.filter(p => !inativo(p) && (p.campos_regra?.length ?? 0) > 0).length,
    [produtos],
  );

  // Status gravado em desacordo com a completude, separado por direção: promover
  // é seguro; rebaixar tira o produto do portal, então é decisão do usuário.
  const desalinhados = useMemo(() => {
    const aPromover: Produto[] = [];
    const aRebaixar: Produto[] = [];
    for (const p of produtos) {
      if (inativo(p)) continue;
      const correta = situacaoCorreta(p, aplicabilidade);
      if (p.situacao === correta) continue;
      (correta === 'classificado' ? aPromover : aRebaixar).push(p);
    }
    return { aPromover, aRebaixar };
  }, [produtos]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else if (!nullsFirst) {
        setNullsFirst(true);   // 3º clique: vazios primeiro
        setSortDir('asc');
      } else {
        setNullsFirst(false);  // 4º clique: volta ao estado inicial
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDir('asc');
      setNullsFirst(false);
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as any)[sortField];
      const bv = (b as any)[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return nullsFirst ? -1 : 1;
      if (bv == null) return nullsFirst ? 1 : -1;
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), 'pt-BR', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir, nullsFirst]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const tipos = useMemo(() => [...new Set(produtos.map(p => p.tipo_produto).filter(Boolean))].sort() as string[], [produtos]);
  const cores = useMemo(() => [...new Set(produtos.map(p => p.cor).filter(Boolean))].sort() as string[], [produtos]);

  const alturaOpts  = useMemo(() => [...new Set(produtos.map(p => p.altura_cm).filter(v => v != null))].sort((a, b) => a! - b!) .map(v => formatPtNumber(v)), [produtos]);
  const larguraOpts = useMemo(() => [...new Set(produtos.map(p => p.largura_cm).filter(v => v != null))].sort((a, b) => a! - b!).map(v => formatPtNumber(v)), [produtos]);
  const batenteOpts = useMemo(() => [...new Set(produtos.map(p => p.batente_cm).filter(v => v != null))].sort((a, b) => a! - b!).map(v => formatPtNumber(v)), [produtos]);
  const alizarOpts  = useMemo(() => [...new Set(
    produtos
      .filter(p => p.alizar_l != null && p.alizar_a != null)
      .map(p => `${formatPtNumber(p.alizar_l)}x${formatPtNumber(p.alizar_a)}`)
  )].sort(), [produtos]);

  const handleFieldChange = (prodId: string, field: string, value: string | number | null) => {
    setModified(prev => {
      const n = new Map(prev);
      const existing = n.get(prodId) || {};
      const update = { ...existing, [field]: value };
      n.set(prodId, update);
      return n;
    });
  };

  const getField = (p: Produto, field: string) => {
    const m = modified.get(p.id);
    if (m && field in m) return (m as any)[field];
    return (p as any)[field];
  };

  const saveSingle = async (prodId: string) => {
    const m = modified.get(prodId);
    const prod = produtos.find(pp => pp.id === prodId);
    if (!prod) return;

    // situação vem da completude do produto já com as edições aplicadas
    const updatePayload: any = { ...(m || {}) };
    updatePayload.situacao = situacaoCorreta({ ...prod, ...(m || {}) } as Produto, aplicabilidade);
    // o que foi mexido à mão deixa de ser de regra — Revisão não toca mais nele
    updatePayload.campos_regra = marcarManual(prod.campos_regra, Object.keys(m || {}));

    const { error } = await supabase
      .from('concremprodutos_produtos')
      .update(updatePayload)
      .eq('id', prodId);
    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({
        title: 'Produto salvo!',
        description: updatePayload.situacao === 'pendente'
          ? `Segue pendente: falta ${camposFaltando({ ...prod, ...(m || {}) } as Produto, aplicabilidade).map(f => COL_LABELS[f] || f).join(', ')}.`
          : undefined,
      });
      setModified(prev => { const n = new Map(prev); n.delete(prodId); return n; });
      setProdutos(prev => prev.map(p => p.id === prodId ? { ...p, ...updatePayload } : p));
    }
  };

  /**
   * Alinha `situacao` à completude, em lote. Muta os objetos recebidos (o motor
   * de regras trabalha na mesma lista).
   *
   * `rebaixar` é opt-in de propósito: rebaixar para 'pendente' **remove o produto
   * da view de publicação**, ou seja, tira o item do portal do representante.
   * Como só ALIZAR e BATENTE têm campos declarados como "não se aplica", tipos
   * como RODAPE nunca fecham — rebaixar automaticamente despublicaria famílias
   * inteiras sem ninguém pedir. Promover é sempre seguro.
   */
  const sincronizarSituacao = async (
    lista: Produto[],
    { rebaixar = false }: { rebaixar?: boolean } = {},
  ) => {
    const promover: Produto[] = [];
    const rebaixarLista: Produto[] = [];
    for (const p of lista) {
      if (inativo(p)) continue;
      const correta = situacaoCorreta(p, aplicabilidade);
      if (p.situacao === correta) continue;
      (correta === 'classificado' ? promover : rebaixarLista).push(p);
    }

    const alvos: [string, Produto[]][] = [['classificado', promover]];
    if (rebaixar) alvos.push(['pendente', rebaixarLista]);

    let mudados = 0;
    let falhas = 0;
    for (const [situacao, produtosAlvo] of alvos) {
      for (const lote of emLotes(produtosAlvo, LOTE_UPDATE)) {
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update({ situacao })
          .in('id', lote.map(p => p.id));
        if (error) { falhas += lote.length; continue; }
        for (const p of lote) {
          p.situacao = situacao;
          mudados++;
        }
      }
    }
    return { mudados, falhas, aRebaixar: rebaixarLista.length };
  };

  // Botões do aviso: corrigem o status sem rodar as regras inteiras
  const corrigirStatus = async (rebaixar: boolean) => {
    setAutoLoading(true);
    try {
      const copia = produtos.map(p => ({ ...p }));
      const { mudados, falhas } = await sincronizarSituacao(copia, { rebaixar });
      setProdutos(copia);
      if (falhas) {
        toast({
          title: `Falha ao atualizar ${falhas} produto(s)`,
          description: mudados ? `${mudados} foram atualizados antes da falha.` : 'Nenhum status foi alterado.',
          variant: 'destructive',
        });
      } else {
        toast({ title: mudados ? `${mudados} status corrigido(s)` : 'Nada a corrigir' });
      }
    } finally {
      setAutoLoading(false);
    }
  };

  // Inativar/reativar: gravação imediata, fora do fluxo de "modificados"
  const toggleAtivoProduto = async (p: Produto) => {
    const novoAtivo = inativo(p);
    const { error } = await supabase
      .from('concremprodutos_produtos')
      .update({ ativo: novoAtivo })
      .eq('id', p.id);
    if (error) {
      toast({
        title: 'Não foi possível alterar o uso do produto',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setProdutos(prev => prev.map(x => (x.id === p.id ? { ...x, ativo: novoAtivo } : x)));
    toast({ title: novoAtivo ? 'Produto reativado' : 'Produto inativado' });
  };

  const saveAll = async () => {
    const entries = Array.from(modified.entries());
    if (entries.length === 0) return;
    let ok = 0, fail = 0;
    for (const [id, m] of entries) {
      const prod = produtos.find(pp => pp.id === id);
      const updatePayload: any = { ...m };
      updatePayload.situacao = situacaoCorreta({ ...(prod || {}), ...m } as Produto, aplicabilidade);
      updatePayload.campos_regra = marcarManual(prod?.campos_regra, Object.keys(m));
      const { error } = await supabase
        .from('concremprodutos_produtos')
        .update(updatePayload)
        .eq('id', id);
      if (error) fail++; else ok++;
    }
    toast({ title: `${ok} salvos, ${fail} erros` });
    setModified(new Map());
    loadData();
  };

  /**
   * Revisão: limpa o que veio de regra e reaplica tudo. É o que faz uma regra
   * apagada ou alterada refletir nos produtos — o motor normal só preenche
   * campo vazio, então sem esta limpeza o valor antigo ficaria para sempre.
   * Campo editado à mão não está em `campos_regra` e não é tocado.
   */
  const limparOrigemRegra = async (lista: Produto[]) => {
    const grupos = agruparPorAtualizacao(lista.filter(p => !inativo(p)), p => {
      const limpeza = limparCamposDeRegra(p.campos_regra);
      return limpeza ? { ...limpeza, situacao: 'pendente' } : {};
    });
    let limpos = 0;
    for (const { updates, itens } of grupos) {
      for (const lote of emLotes(itens, LOTE_UPDATE)) {
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update(updates)
          .in('id', lote.map(p => p.id));
        if (error) continue;
        for (const p of lote) {
          Object.assign(p, updates);
          limpos++;
        }
      }
    }
    return limpos;
  };

  const runAutoClassify = async ({ revisao = false }: { revisao?: boolean } = {}) => {
    setAutoLoading(true);
    setAutoResult(null);
    setEtapa(revisao ? 'limpando o que veio de regra…' : 'carregando regras…');
    try {
      if (revisao) {
        const limpos = await limparOrigemRegra(produtos);
        setEtapa(`revisão: ${limpos.toLocaleString('pt-BR')} produtos limpos — reaplicando`);
      }
      // Fetch both rule types in parallel
      const [regras, raRes] = await Promise.all([
        fetchAllRegras(),
        supabase.from('concremprodutos_regras_atributo').select('*').eq('ativo', true).order('prioridade', { ascending: false }),
      ]);
      const regrasAtributo: RegraAtributo[] = raRes.data || [];

      let catCount = 0;
      let attrCount = 0;

      const shouldDefaultMovimento = (p: Produto) => {
        if (inativo(p)) return false;
        const t = (p.tipo_produto || '').toUpperCase().trim();
        return (t === 'KIT PORTA' || t === 'PORTA') && !p.movimento;
      };

      // 1) Apply ATTRIBUTE rules first
      let regraAtual = 0;
      for (const regra of regrasAtributo) {
        regraAtual++;
        if (regraAtual % 5 === 1) {
          setEtapa(`1/5 — regras de atributo (${regraAtual} de ${regrasAtributo.length})`);
          await new Promise(r => setTimeout(r, 0));   // deixa a tela repintar
        }
        const numericFields = new Set<string>([...DIM_FIELDS, 'batente_cm', 'alizar_l', 'alizar_a', 'alizar_e', 'preco']);

        // Varre o catálogo inteiro; com "não contém" o alvo é todo produto cuja
        // descrição não traz o critério (ver casamento em lib/match-regras).
        const matched = produtos.filter(p => {
          if (inativo(p)) return false;
          // Só preenche campo vazio. Atenção: `isBlank` e não teste de verdade —
          // medida 0 significa "não tem" e é valor preenchido, não vazio.
          if (!isBlank((p as any)[regra.campo])) return false;
          return casaRegraAtributo(p.descricao, regra.criterio, regra.tipo_match);
        });

        const valueToSet = numericFields.has(regra.campo) ? parsePtNumber(regra.valor) : regra.valor;
        if (numericFields.has(regra.campo) && valueToSet === null) continue;

        // Gravação em lote: com "não contém" o alvo é o catálogo todo, e um UPDATE
        // por produto deixaria "Aplicar Regras" inviável. O payload leva também a
        // origem do campo, e o agrupamento junta quem fica com a mesma lista.
        const grupos = agruparPorAtualizacao(matched, p => ({
          [regra.campo]: valueToSet,
          campos_regra: marcarRegra(p.campos_regra, [regra.campo]),
        }));
        for (const { updates, itens } of grupos) {
          for (const lote of emLotes(itens, LOTE_UPDATE)) {
            const { error } = await supabase
              .from('concremprodutos_produtos')
              .update(updates)
              .in('id', lote.map(p => p.id));
            if (error) continue;
            for (const p of lote) {
              Object.assign(p, updates);
              attrCount++;
            }
          }
        }
      }

      // Só considera vazio o que é null/undefined: medida 0 = "não tem", declarada
      // por regra "não contém", e não deve ser sobrescrita pelo parser.
      const porPreencher = (p: Produto, campo: string, valor: number | null | undefined) =>
        isBlank((p as unknown as Record<string, unknown>)[campo]) && valor != null;

      const tipoEh = (p: Produto, t: string) => (p.tipo_produto || '').toUpperCase().trim() === t;

      // 1b) Medidas lidas da descrição, por tipo.
      // As medidas se repetem muito no catálogo (210x80 BAT15CM AL5x8,5…), então
      // agrupamos por payload idêntico: em vez de um UPDATE por produto — inviável
      // numa carga grande — sai um UPDATE por combinação distinta de medidas.
      const gravarMedidas = async (lista: Produto[], calcular: (p: Produto) => Record<string, number | null>) => {
        const comOrigem = (p: Produto) => {
          const medidas = calcular(p);
          const campos = Object.keys(medidas);
          if (campos.length === 0) return {};
          return { ...medidas, campos_regra: marcarRegra(p.campos_regra, campos) };
        };
        for (const { updates, itens } of agruparPorAtualizacao(lista, comOrigem)) {
          for (const lote of emLotes(itens, LOTE_UPDATE)) {
            const { error } = await supabase
              .from('concremprodutos_produtos')
              .update(updates)
              .in('id', lote.map(p => p.id));
            if (error) continue;
            for (const p of lote) {
              Object.assign(p, updates);
              attrCount += Object.keys(updates).length - 1;   // desconta campos_regra
            }
          }
        }
      };

      const ativos = produtos.filter(p => !inativo(p));
      setEtapa(`2/5 — medidas pela descrição (${ativos.length.toLocaleString('pt-BR')} produtos)`);

      await gravarMedidas(ativos.filter(p => tipoEh(p, 'KIT PORTA')), p => {
        const parsed = parseProduto(p.descricao);
        const u: Record<string, number | null> = {};
        if (porPreencher(p, 'batente_cm', parsed.batente_cm)) u.batente_cm = parsed.batente_cm;
        if (porPreencher(p, 'alizar_l',   parsed.alizar_l))   u.alizar_l   = parsed.alizar_l;
        if (porPreencher(p, 'alizar_a',   parsed.alizar_a))   u.alizar_a   = parsed.alizar_a;
        return u;
      });

      await gravarMedidas(ativos.filter(p => tipoEh(p, 'BATENTE')), p => {
        const parsed = parseProduto(p.descricao);
        const u: Record<string, number | null> = {};
        if (porPreencher(p, 'largura_cm',   parsed.largura_cm))   u.largura_cm   = parsed.largura_cm;
        if (porPreencher(p, 'espessura_cm', parsed.espessura_cm)) u.espessura_cm = parsed.espessura_cm;
        if (porPreencher(p, 'batente_cm',   parsed.batente_cm))   u.batente_cm   = parsed.batente_cm;
        return u;
      });

      await gravarMedidas(ativos.filter(p => tipoEh(p, 'ALIZAR')), p => {
        const parsed = parseProduto(p.descricao);
        const u: Record<string, number | null> = {};
        if (porPreencher(p, 'altura_cm',    parsed.altura_cm))    u.altura_cm    = parsed.altura_cm;
        if (porPreencher(p, 'alizar_l',     parsed.alizar_l))     u.alizar_l     = parsed.alizar_l;
        if (porPreencher(p, 'alizar_a',     parsed.alizar_a))     u.alizar_a     = parsed.alizar_a;
        if (porPreencher(p, 'espessura_cm', parsed.espessura_cm)) u.espessura_cm = parsed.espessura_cm;
        return u;
      });

      // 1c) Default Protect+, Veneziana, Visor = 'Não' when still null
      setEtapa('3/5 — padrões (Protect+, veneziana, visor, movimento)');
      const defaultNao = ['protect_plus', 'veneziana', 'visor'] as const;
      // O padrão também é decisão do motor, então conta como origem "regra".
      const gravarPadrao = async (lista: Produto[], campo: string, valor: string) => {
        const grupos = agruparPorAtualizacao(lista, p => ({
          [campo]: valor,
          campos_regra: marcarRegra(p.campos_regra, [campo]),
        }));
        for (const { updates, itens } of grupos) {
          for (const lote of emLotes(itens, LOTE_UPDATE)) {
            const { error } = await supabase
              .from('concremprodutos_produtos')
              .update(updates)
              .in('id', lote.map(p => p.id));
            if (error) continue;
            for (const p of lote) {
              Object.assign(p, updates);
              attrCount++;
            }
          }
        }
      };

      for (const campo of defaultNao) {
        await gravarPadrao(produtos.filter(p => !inativo(p) && !(p as any)[campo]), campo, 'Não');
      }

      // 1d) Default movimento = GIRO when no rule filled it (only KIT PORTA / PORTA)
      await gravarPadrao(produtos.filter(shouldDefaultMovimento), 'movimento', 'GIRO');

      // 2) Apply CATEGORY rules
      // Não mexe mais em `situacao`: quem decide isso é a completude, no passo 3.
      // Antes esta etapa marcava 'classificado' mesmo com atributos vazios.
      setEtapa('4/5 — categorias');
      const ativas = regras.filter(r => r.ativo).sort((a, b) => b.prioridade - a.prioridade);
      const semCategoria = produtos.filter(p => !inativo(p) && !p.categoria_id);

      for (const regra of ativas) {
        const matched = semCategoria.filter(p => {
          if (p.categoria_id) return false;   // já categorizado por regra de maior prioridade
          if (regra.tipo === 'codigo') return p.codigo?.toUpperCase().trim() === regra.criterio.toUpperCase().trim();
          return p.descricao.toUpperCase().includes(regra.criterio.toUpperCase().trim());
        });

        for (const lote of emLotes(matched, LOTE_UPDATE)) {
          const { error } = await supabase
            .from('concremprodutos_produtos')
            .update({ categoria_id: regra.categoria_id, subcategoria_id: regra.subcategoria_id })
            .in('id', lote.map(p => p.id));
          if (error) continue;
          for (const p of lote) {
            p.categoria_id = regra.categoria_id;
            p.subcategoria_id = regra.subcategoria_id;
            catCount++;
          }
        }
      }

      // 3) Situação = completude. Só promove: rebaixar despublica, e isso fica
      //    como decisão explícita no aviso da tela.
      setEtapa('5/5 — status pela completude');
      const { mudados: sincronizados, falhas, aRebaixar } = await sincronizarSituacao(produtos);

      const n = (v: number) => v.toLocaleString('pt-BR');
      setAutoResult(
        `✅ ${n(attrCount)} atributos preenchidos · ${n(catCount)} produtos categorizados · ` +
        `${n(sincronizados)} marcados como classificados` +
        (falhas ? ` · ⚠️ ${n(falhas)} falharam ao gravar o status` : '') +
        (aRebaixar ? ` · ${n(aRebaixar)} constam classificados com campo em branco (veja o aviso acima)` : '')
      );
      loadData();
    } catch (e) {
      setAutoResult(`❌ Erro ao aplicar regras${e instanceof Error ? `: ${e.message}` : ''}. ` +
        'O que já foi gravado permanece — pode rodar de novo que ele continua de onde parou.');
    } finally {
      setEtapa(null);
      setAutoLoading(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const items = JSON.parse(importJson);
      if (!Array.isArray(items)) throw new Error('Esperado array');

      const parsed = items.map((item: any) => {
        const p = parseProduto(item.descricao || '');
        const tipo = (p.tipo_produto || '').toUpperCase().trim();
        const movimentoDefault = (!p.movimento && (tipo === 'KIT PORTA' || tipo === 'PORTA')) ? 'GIRO' : p.movimento;
        return {
          codigo: item.codigo || null,
          descricao: item.descricao,
          unidade: item.unidade || null,
          codigo_barras: item.codigo_barras || null,
          preco: item.preco || 0,
          ...p,
          movimento: movimentoDefault,
        };
      });

      const { error } = await supabase
        .from('concremprodutos_produtos')
        .upsert(parsed, { onConflict: 'codigo' });

      if (error) throw error;
      toast({ title: `${parsed.length} produtos importados com sucesso!` });
      setShowImport(false);
      setImportJson('');
      loadData();
    } catch (err: any) {
      toast({ title: 'Erro na importação', description: err.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  // Filtros: os 3 primeiros ficam sempre à vista; o resto abre em "Mais filtros"
  const aplicar = (set: (v: string) => void) => (v: string) => { set(v); setPage(0); };
  const filtros = [
    { key: 'tipo',       label: 'Tipo',          value: fTipo,      set: setFTipo,      options: tipos,                          allowEmpty: true, primary: true },
    { key: 'status',     label: 'Status',        value: fStatus,    set: setFStatus,    options: STATUS_OPTS,                    primary: true },
    { key: 'classif',    label: 'Classificação', value: fClassif,   set: setFClassif,   options: CLASSIF_OPTS,                   primary: true, width: 'w-[150px]' },
    { key: 'uso',        label: 'Uso',           value: fUso,       set: setFUso,       options: USO_OPTS,                       primary: true, width: 'w-[130px]', padrao: 'ativos' },
    { key: 'mov',        label: 'Movimento',     value: fMov,       set: setFMov,       options: opcoesPorCampo.movimento,       allowEmpty: true },
    { key: 'ench',       label: 'Enchimento',    value: fEnch,      set: setFEnch,      options: opcoesPorCampo.enchimento,      allowEmpty: true },
    { key: 'rev',        label: 'Revestimento',  value: fRev,       set: setFRev,       options: opcoesPorCampo.revestimento,    allowEmpty: true },
    { key: 'linha',      label: 'Linha',         value: fLinha,     set: setFLinha,     options: opcoesPorCampo.linha,           allowEmpty: true },
    { key: 'perfil',     label: 'Liso/Frisado',  value: fPerfil,    set: setFPerfil,    options: opcoesPorCampo.perfil,          allowEmpty: true },
    { key: 'cor',        label: 'Cor',           value: fCor,       set: setFCor,       options: cores,                          allowEmpty: true },
    { key: 'altura',     label: 'Altura (cm)',   value: fAltura,    set: setFAltura,    options: alturaOpts,                     allowEmpty: true },
    { key: 'largura',    label: 'Largura (cm)',  value: fLargura,   set: setFLargura,   options: larguraOpts,                    allowEmpty: true },
    { key: 'batente',    label: 'Batente (cm)',  value: fBatente,   set: setFBatente,   options: batenteOpts,                    allowEmpty: true },
    { key: 'alizar',     label: 'Alizar',        value: fAlizar,    set: setFAlizar,    options: alizarOpts,                     allowEmpty: true },
    { key: 'protect',    label: 'Protect+',      value: fProtect,   set: setFProtect,   options: ['Sim', 'Não'],                 allowEmpty: true },
    { key: 'veneziana',  label: 'Veneziana',     value: fVeneziana, set: setFVeneziana, options: ['Sim', 'Não'],                 allowEmpty: true },
    { key: 'visor',      label: 'Visor',         value: fVisor,     set: setFVisor,     options: ['Sim', 'Não'],                 allowEmpty: true },
  ];
  const detalhe = detalheId ? produtos.find(p => p.id === detalheId) : undefined;
  const faltandoDetalhe = detalhe ? camposFaltando(detalhe, aplicabilidade) : [];
  const avancados = filtros.filter(f => !f.primary);
  // "ativo" = diferente do padrão (o filtro Uso começa em 'ativos', não vazio)
  const ativos = filtros.filter(f => f.value !== (f.padrao ?? ''));
  const ocultosAtivos = avancados.filter(f => f.value);
  const temFiltro = ativos.length > 0 || !!busca;
  const limparTudo = () => {
    for (const f of filtros) f.set(f.padrao ?? '');
    setBusca('');
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2.5 px-4 py-3">
      <datalist id="altura_cm-options">
        {[...new Set(opcoesPorCampo.altura_cm || [])]
          .sort((a, b) => (Number.parseFloat(a.replace(',', '.')) || 0) - (Number.parseFloat(b.replace(',', '.')) || 0))
          .map(v => <option key={v} value={v} />)}
      </datalist>
      <datalist id="largura_cm-options">
        {[...new Set(opcoesPorCampo.largura_cm || [])]
          .sort((a, b) => (Number.parseFloat(a.replace(',', '.')) || 0) - (Number.parseFloat(b.replace(',', '.')) || 0))
          .map(v => <option key={v} value={v} />)}
      </datalist>
      <datalist id="espessura_cm-options">
        {[...new Set(opcoesPorCampo.espessura_cm || [])]
          .sort((a, b) => (Number.parseFloat(a.replace(',', '.')) || 0) - (Number.parseFloat(b.replace(',', '.')) || 0))
          .map(v => <option key={v} value={v} />)}
      </datalist>
      <datalist id="batente_cm-options">
        {batenteOpts.map(v => <option key={v} value={v} />)}
      </datalist>
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Classificação de Produtos</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="mr-1 h-4 w-4" /> Colunas
                {colsOcultas.size > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{colsOcultas.size} oculta(s)</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Atributos</DropdownMenuLabel>
              {ATTR_FIELDS.map(f => (
                <DropdownMenuCheckboxItem
                  key={f}
                  checked={!colsOcultas.has(f)}
                  onCheckedChange={() => toggleCol(f)}
                  onSelect={e => e.preventDefault()}
                >
                  {COL_LABELS[f]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Medidas</DropdownMenuLabel>
              {MEDIDA_COLS.map(c => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={!colsOcultas.has(c.key)}
                  onCheckedChange={() => toggleCol(c.key)}
                  onSelect={e => e.preventDefault()}
                >
                  {COL_LABELS[c.key]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setColsOcultas(new Set())}>Mostrar todas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="mr-1 h-4 w-4" /> Importar JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowRevisao(true)} disabled={autoLoading}>
            <RefreshCw className="mr-1 h-4 w-4" /> Revisão
          </Button>
          <Button size="sm" onClick={() => runAutoClassify()} disabled={autoLoading}>
            {autoLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Wand2 className="mr-1 h-4 w-4" />}
            Aplicar Regras
          </Button>
        </div>
      </div>

      {/* Numa carga grande a rotina leva minutos: mostra em que etapa está */}
      {etapa && (
        <div className="flex shrink-0 items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <span>Aplicando regras — {etapa}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Mantenha esta aba aberta. Se parar no meio, o que já foi gravado permanece.
          </span>
        </div>
      )}

      {autoResult && !etapa && (
        <div className="shrink-0 rounded-md bg-muted px-4 py-2 text-sm">{autoResult}</div>
      )}

      {/* Filtros — 3 principais + painel recolhível, para não empilhar 16 selects */}
      <div className="shrink-0 rounded-lg border bg-card px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <BuscaInput
            value={busca}
            onChange={v => { setBusca(v); setPage(0); }}
            placeholder="Buscar código ou descrição..."
            className="w-[250px]"
          />
          {filtros.filter(f => f.primary).map(f => (
            <FilterSelect
              key={f.key}
              label={f.label}
              value={f.value}
              onChange={aplicar(f.set)}
              options={f.options}
              allowEmpty={f.allowEmpty}
              className={f.width}
              padrao={f.padrao}
            />
          ))}

          <Button
            variant={showFiltros ? 'secondary' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowFiltros(v => !v)}
          >
            <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
            Mais filtros
            {ocultosAtivos.length > 0 && (
              <Badge className="ml-1.5 h-4 bg-primary px-1 text-[10px]">{ocultosAtivos.length}</Badge>
            )}
          </Button>

          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span><strong className="font-semibold text-foreground">{filtered.length}</strong> produto(s)</span>
            {incompletos > 0 && (
              <button
                type="button"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
                onClick={() => { setFClassif('incompleto'); setPage(0); }}
              >
                {incompletos} incompleto(s)
              </button>
            )}
            {temFiltro && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={limparTudo}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {showFiltros && (
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-2">
            {avancados.map(f => (
              <FilterSelect
                key={f.key}
                label={f.label}
                value={f.value}
                onChange={aplicar(f.set)}
                options={f.options}
                allowEmpty={f.allowEmpty}
              />
            ))}
          </div>
        )}

        {/* Recolhido: mostra em chips o que continua filtrando */}
        {!showFiltros && ocultosAtivos.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t pt-2">
            {ocultosAtivos.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => aplicar(f.set)('')}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary hover:bg-primary/10"
                title="Remover filtro"
              >
                {f.label}: {rotuloValor(f.value, f.options)}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status gravado em desacordo com a completude — dado das versões anteriores */}
      {(desalinhados.aPromover.length > 0 || desalinhados.aRebaixar.length > 0) && (
        <div className="shrink-0 space-y-1.5 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm">
          {desalinhados.aPromover.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span>
                <strong>{desalinhados.aPromover.length} produto(s)</strong> estão completos mas
                constam como pendentes.
              </span>
              <Button size="sm" variant="outline" onClick={() => corrigirStatus(false)} disabled={autoLoading}>
                {autoLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                Marcar como classificados
              </Button>
            </div>
          )}
          {desalinhados.aRebaixar.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span>
                <strong>{desalinhados.aRebaixar.length} produto(s)</strong> constam como
                classificados mas têm campo em branco.{' '}
                <span className="text-amber-800">
                  Rebaixar para pendente <strong>remove esses itens do portal</strong> até que sejam
                  preenchidos — confira antes pelo filtro Classificação = Incompletos.
                </span>
              </span>
              <Button size="sm" variant="outline" onClick={() => corrigirStatus(true)} disabled={autoLoading}>
                Rebaixar para pendente
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Save All */}
      {modified.size > 0 && (
        <div className="flex shrink-0 items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="text-sm font-medium">{modified.size} produto(s) modificado(s)</span>
          <Button size="sm" onClick={saveAll}>
            <Save className="mr-1 h-4 w-4" /> Salvar Todos
          </Button>
        </div>
      )}

      {/* Tabela — cabeçalho fixo em 2 níveis e colunas Código/Descrição congeladas */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            {/* faixa de grupos */}
            <tr>
              <th colSpan={2} className={cn(BAND, 'left-0 z-30', DIVISOR_STICKY)}>Produto</th>
              {attrCols.length > 0 && (
                <th colSpan={attrCols.length} className={cn(BAND, GRUPO)}>Atributos</th>
              )}
              {medidaCols.length > 0 && (
                <th colSpan={medidaCols.length} className={cn(BAND, GRUPO)}>Medidas (cm)</th>
              )}
              <th colSpan={2} className={cn(BAND, 'right-0 z-30', DIVISOR_ESQ)}>Situação</th>
            </tr>
            <tr>
              <SortTh field="codigo"    label="Código"    sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className={cn(TH, 'left-0 z-30 whitespace-nowrap', W_CODIGO)} />
              <SortTh
                field="descricao" label="Descrição"
                sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort}
                className={cn(TH, 'left-[74px] z-30', DIVISOR_TH)}
                style={{ width: descW, minWidth: descW, maxWidth: descW }}
              >
                <span
                  onPointerDown={iniciarArraste}
                  onClick={e => e.stopPropagation()}
                  onDoubleClick={e => {
                    e.stopPropagation();
                    setDescW(w => (w >= DESC_W_LARGA ? DESC_W_COMPACTA : DESC_W_LARGA));
                  }}
                  title="Arraste para alargar a descrição (duplo clique alterna compacta/larga)"
                  className="absolute right-0 top-0 z-10 h-full w-2 cursor-col-resize hover:bg-primary/40"
                />
              </SortTh>
              {attrCols.map((f, i) => (
                <SortTh key={f} field={f} label={ATTR_LABELS[f]} sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className={cn(TH, 'min-w-[84px] whitespace-nowrap', i === 0 && GRUPO)} />
              ))}
              {medidaCols.map((c, i) => (
                <SortTh key={c.key} field={c.sort} label={c.label} sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className={cn(TH, 'whitespace-nowrap text-right [&>span]:justify-end', c.key === 'alizar' ? 'min-w-[94px]' : 'min-w-[58px]', i === 0 && GRUPO)} />
              ))}
              <SortTh field="situacao"  label="Status"    sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className={cn(TH, 'sticky right-[74px] z-30 whitespace-nowrap', W_STATUS, DIVISOR_ESQ_TH)} />
              <th className={cn(TH, 'right-0 z-30 px-1.5 text-left text-xs font-semibold', W_ACAO)}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(p => {
              const isModified = modified.has(p.id);
              const tipo = getField(p, 'tipo_produto');
              const pendente = p.situacao !== 'classificado';
              const foraDeLinha = inativo(p);

              return (
                <tr
                  key={p.id}
                  className={cn(
                    'border-b border-border/70 transition-colors',
                    isModified ? 'bg-amber-50' : 'bg-card hover:bg-muted',
                    // atenua o TEXTO, não a linha: `opacity` deixaria o fundo das
                    // colunas congeladas translúcido e o conteúdo por baixo vazaria
                    foraDeLinha && 'text-muted-foreground'
                  )}
                >
                  {/* largura interna fixa: garante que a coluna meça exatamente o
                      previsto, senão o `left` das colunas congeladas desalinha */}
                  <td className={cn(TD, 'sticky left-0 z-10 bg-inherit', W_CODIGO)}>
                    <button
                      type="button"
                      onClick={() => setDetalheId(p.id)}
                      title="Ver detalhes do produto"
                      className={cn(
                        'block w-[62px] truncate text-left font-mono text-[11px] hover:underline',
                        foraDeLinha ? 'text-muted-foreground' : 'text-primary',
                      )}
                    >
                      {p.codigo || '—'}
                    </button>
                  </td>
                  <td
                    className={cn(TD, 'sticky left-[74px] z-10 bg-inherit', DIVISOR_STICKY)}
                    style={{ width: descW, minWidth: descW, maxWidth: descW }}
                  >
                    <span className="block truncate text-xs" style={{ width: descW - 12 }} title={p.descricao}>
                      {p.descricao}
                    </span>
                  </td>

                  {attrCols.map((field, i) => {
                    const cls = cn(TD, i === 0 && GRUPO);
                    if (!seAplica(tipo, field, aplicabilidade)) return <td key={field} className={cls}><NaoAplica /></td>;
                    const currentVal = getField(p, field) || '';
                    const fieldOptions = opcoesPorCampo[field] || [];
                    return (
                      <td key={field} className={cls}>
                        <Select value={currentVal} onValueChange={v => handleFieldChange(p.id, field, v === '__clear__' ? null : v)}>
                          <SelectTrigger className={GHOST_SELECT}>
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__clear__">— Limpar</SelectItem>
                            {fieldOptions.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    );
                  })}

                  {medidaCols.map((c, i) => {
                    const cls = cn(TD, i === 0 && GRUPO);
                    const aplica =
                      c.key === 'alizar'     ? seAplica(tipo, 'alizar', aplicabilidade)  :
                      c.key === 'batente_cm' ? seAplica(tipo, 'batente_cm', aplicabilidade) :
                      seAplica(tipo, c.key, aplicabilidade);
                    if (!aplica) return <td key={c.key} className={cls}><NaoAplica /></td>;
                    if (c.key === 'alizar') {
                      return (
                        <td key={c.key} className={cls}>
                          <div className="flex items-center gap-0.5">
                            <NumCell value={getField(p, 'alizar_l')} onChange={v => handleFieldChange(p.id, 'alizar_l', v)} placeholder="L" />
                            <span className="text-[10px] text-muted-foreground/50">×</span>
                            <NumCell value={getField(p, 'alizar_a')} onChange={v => handleFieldChange(p.id, 'alizar_a', v)} placeholder="A" />
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={c.key} className={cls}>
                        <NumCell
                          value={getField(p, c.key)}
                          onChange={v => handleFieldChange(p.id, c.key, v)}
                          list={`${c.key}-options`}
                        />
                      </td>
                    );
                  })}

                  {/* Status e Ação congelados à direita: continuam à vista com a rolagem horizontal */}
                  <td className={cn(TD, 'sticky right-[74px] z-10 bg-inherit', W_STATUS, DIVISOR_ESQ)}>
                    <span className="block w-[94px]">
                      {foraDeLinha ? (
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          Inativo
                        </Badge>
                      ) : (
                        <Badge
                          variant={pendente ? 'secondary' : 'default'}
                          className={cn('text-[10px] font-normal', !pendente && 'bg-primary')}
                        >
                          {pendente ? 'Pendente' : 'Classificado'}
                        </Badge>
                      )}
                    </span>
                  </td>
                  <td className={cn(TD, 'sticky right-0 z-10 bg-inherit', W_ACAO)}>
                    {/* Sem botão quando já está classificado e intacto — antes ficava um "OK" inútil em toda linha */}
                    <span className="block h-7 w-[62px]">
                      {(isModified || (pendente && !foraDeLinha)) && (
                        <Button
                          size="sm"
                          variant={isModified ? 'default' : 'outline'}
                          className="h-7 px-2 text-xs"
                          onClick={() => saveSingle(p.id)}
                        >
                          Salvar
                        </Button>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={4 + attrCols.length + medidaCols.length} className="py-12 text-center text-muted-foreground">
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex shrink-0 items-center justify-between text-sm text-muted-foreground">
        <span>
          {sorted.length > 0
            ? <>Mostrando <strong className="font-medium text-foreground">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)}</strong> de {sorted.length}</>
            : 'Nenhum resultado'}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs">Página {page + 1} de {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Detalhes do produto — descrição inteira + campos que não cabem na tabela */}
      <Sheet open={!!detalheId} onOpenChange={aberto => { if (!aberto) setDetalheId(null); }}>
        <SheetContent className="w-[440px] overflow-y-auto sm:max-w-[440px]">
          {detalhe && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-base">
                  <span className="font-mono">{detalhe.codigo || 'sem código'}</span>
                  <Badge
                    variant={detalhe.situacao === 'classificado' ? 'default' : 'secondary'}
                    className={cn('text-[10px] font-normal', detalhe.situacao === 'classificado' && 'bg-primary')}
                  >
                    {detalhe.situacao === 'classificado' ? 'Classificado' : 'Pendente'}
                  </Badge>
                  {inativo(detalhe) && (
                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">Inativo</Badge>
                  )}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-5">
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm leading-relaxed">
                  {detalhe.descricao}
                </div>

                {/* Produto fora de linha: sai da classificação e da publicação */}
                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">Produto em uso</p>
                    <p className="text-xs text-muted-foreground">
                      Desligue para produtos antigos: saem da lista, não contam como pendência
                      e deixam de ser publicados ao portal.
                    </p>
                  </div>
                  <Switch
                    checked={!inativo(detalhe)}
                    onCheckedChange={() => toggleAtivoProduto(detalhe)}
                    aria-label="Produto em uso"
                  />
                </div>

                {!inativo(detalhe) && faltandoDetalhe.length > 0 && (
                  <p className="text-xs text-amber-700">
                    Faltam preencher: {faltandoDetalhe.map(f => COL_LABELS[f] || f).join(', ')}.
                  </p>
                )}

                <Secao titulo="Atributos">
                  {ATTR_FIELDS.map(f => (
                    <DetalheLinha
                      key={f}
                      rotulo={ATTR_LABELS[f]}
                      valor={seAplica(detalhe.tipo_produto, f, aplicabilidade) ? getField(detalhe, f) : undefined}
                    />
                  ))}
                </Secao>

                <Secao titulo="Medidas (cm)">
                  <DetalheLinha rotulo="Altura"    valor={seAplica(detalhe.tipo_produto, 'altura_cm', aplicabilidade)    ? formatPtNumber(getField(detalhe, 'altura_cm'))    : undefined} />
                  <DetalheLinha rotulo="Largura"   valor={seAplica(detalhe.tipo_produto, 'largura_cm', aplicabilidade)   ? formatPtNumber(getField(detalhe, 'largura_cm'))   : undefined} />
                  <DetalheLinha rotulo="Espessura" valor={seAplica(detalhe.tipo_produto, 'espessura_cm', aplicabilidade) ? formatPtNumber(getField(detalhe, 'espessura_cm')) : undefined} />
                  <DetalheLinha rotulo="Batente"   valor={seAplica(detalhe.tipo_produto, 'batente_cm', aplicabilidade) ? medidaTexto(getField(detalhe, 'batente_cm')) : undefined} />
                  <DetalheLinha rotulo="Batente (tipo)" valor={detalhe.batente_tipo} />
                  <DetalheLinha
                    rotulo="Alizar L × A × E"
                    valor={
                      !seAplica(detalhe.tipo_produto, 'alizar', aplicabilidade) ? undefined
                      : getField(detalhe, 'alizar_l') === 0 || getField(detalhe, 'alizar_a') === 0 ? 'não tem'
                      : [getField(detalhe, 'alizar_l'), getField(detalhe, 'alizar_a'), detalhe.alizar_e]
                          .map(v => formatPtNumber(v) || '—').join(' × ')
                    }
                  />
                </Secao>

                <Secao titulo="Cadastro">
                  <DetalheLinha rotulo="Unidade" valor={detalhe.unidade} />
                  <DetalheLinha rotulo="Preço" valor={detalhe.preco != null ? detalhe.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null} />
                  <DetalheLinha rotulo="Código de barras" valor={detalhe.codigo_barras} />
                  <DetalheLinha rotulo="Atualizado em" valor={new Date(detalhe.updated_at).toLocaleString('pt-BR')} />
                </Secao>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Revisão: confirma antes, porque reescreve o catálogo inteiro */}
      <Dialog open={showRevisao} onOpenChange={setShowRevisao}>
        <DialogContent>
          <DialogHeader><DialogTitle>Revisão geral das regras</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              Serve para quando uma regra foi <strong>alterada ou apagada</strong>. O motor normal
              só preenche campo vazio, então o valor antigo ficaria para sempre; a revisão limpa e
              refaz.
            </p>
            <div className="rounded-md border bg-muted/40 px-3 py-2">
              <p className="font-medium">O que vai acontecer</p>
              <ol className="ml-4 list-decimal space-y-0.5 text-muted-foreground">
                <li>Limpa os campos que <strong>vieram de regra</strong> ({comOrigemRegra.toLocaleString('pt-BR')} produto(s)).</li>
                <li>Reaplica todas as regras ativas e os padrões.</li>
                <li>Recalcula a situação de cada produto.</li>
              </ol>
            </div>
            <p className="text-muted-foreground">
              O que você editou à mão <strong>não é tocado</strong> — ao salvar na tela, o campo
              deixa de contar como de regra.
            </p>
            <p className="text-amber-700">
              Durante a revisão os produtos ficam pendentes por alguns instantes, e produto pendente
              não aparece no portal do representante. Rode em horário combinado.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevisao(false)}>Cancelar</Button>
            <Button
              onClick={() => { setShowRevisao(false); runAutoClassify({ revisao: true }); }}
              disabled={autoLoading}
            >
              Revisar agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Importar Produtos (JSON)</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={10}
            placeholder={'[\n  { "codigo": "00001", "descricao": "KIT PORTA...", "unidade": "CJ", "preco": 0 }\n]'}
            value={importJson}
            onChange={e => setImportJson(e.target.value)}
            className="font-mono text-xs"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancelar</Button>
            <Button onClick={handleImport} disabled={importing || !importJson.trim()}>
              {importing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Bloco do painel de detalhes
function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{titulo}</h3>
      <dl className="divide-y rounded-md border">{children}</dl>
    </div>
  );
}

// `valor === undefined` = campo não se aplica ao tipo; `null`/'' = ainda vazio
function DetalheLinha({ rotulo, valor }: { rotulo: string; valor?: string | number | null }) {
  const naoAplica = valor === undefined;
  const vazio = !naoAplica && (valor === null || valor === '');
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-1.5">
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className={cn('text-right text-xs', naoAplica && 'text-muted-foreground/40', vazio && 'text-amber-600')}>
        {naoAplica ? 'não se aplica' : vazio ? 'vazio' : valor}
      </dd>
    </div>
  );
}

// Célula de medida: número alinhado à direita, moldura só no hover/foco
function NumCell({ value, onChange, list, placeholder = '—' }: {
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  list?: string;
  placeholder?: string;
}) {
  return (
    <Input
      className={GHOST_INPUT}
      value={formatPtNumber(value)}
      onChange={e => onChange(parsePtNumber(e.target.value))}
      inputMode="decimal"
      placeholder={placeholder}
      list={list}
    />
  );
}

// Campo que não se aplica ao tipo do produto (ex.: movimento num ALIZAR)
function NaoAplica() {
  return <span className="block text-center text-[11px] text-muted-foreground/40" title="Não se aplica a este tipo">—</span>;
}

// Rótulo legível de um valor de filtro, para os chips
function rotuloValor(value: string, options?: (string | { value: string; label: string })[]) {
  if (value === EMPTY) return 'vazio';
  const found = options?.find(o => (typeof o === 'string' ? o : o.value) === value);
  if (!found) return value;
  return typeof found === 'string' ? found : found.label;
}

function SortTh({ field, label, sortField, sortDir, nullsFirst, onSort, className, style, children }: {
  field: string;
  label: string;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  nullsFirst: boolean;
  onSort: (f: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;   // ex.: alça de redimensionamento
}) {
  const active = sortField === field;
  return (
    <th
      style={style}
      className={cn('group cursor-pointer select-none px-1.5 py-1.5 text-left text-[11px] font-semibold hover:bg-secondary', className)}
      onClick={() => onSort(field)}
      title={active ? (nullsFirst ? 'Vazios primeiro' : 'Vazios por último') : 'Ordenar'}
    >
      <span className="flex items-center gap-1">
        {label}
        {active
          ? sortDir === 'asc'
            ? <ChevronUp className={cn('h-3 w-3', nullsFirst ? 'text-amber-500' : 'text-primary')} />
            : <ChevronDown className={cn('h-3 w-3', nullsFirst ? 'text-amber-500' : 'text-primary')} />
          : <ChevronsUpDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
        }
      </span>
    </th>
  );
}

function FilterSelect({ label, value, onChange, options, allowEmpty, className, padrao }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  allowEmpty?: boolean;
  className?: string;
  padrao?: string;   // valor neutro do filtro (não recebe destaque)
}) {
  const emUso = value !== (padrao ?? '');
  return (
    <Select value={value} onValueChange={v => onChange(v === '__all__' ? '' : v)}>
      <SelectTrigger className={cn('h-8 w-[120px] text-xs', emUso && 'border-primary text-primary', className)}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todos</SelectItem>
        {allowEmpty && <SelectItem value={EMPTY}>— Sem {label}</SelectItem>}
        {options.map(opt => {
          const v = typeof opt === 'string' ? opt : opt.value;
          const l = typeof opt === 'string' ? opt : opt.label;
          return <SelectItem key={v} value={v}>{l}</SelectItem>;
        })}
      </SelectContent>
    </Select>
  );
}
