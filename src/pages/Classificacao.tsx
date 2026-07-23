import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase, fetchAllProdutos, fetchAllRegras } from '@/lib/supabase';
import { parseProduto } from '@/lib/parser';
import { Produto, OpcaoClassificacao, RegraAtributo } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Save, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPtNumber, parsePtNumber } from '@/lib/numbers';

const PAGE_SIZE = 50;

const ATTR_FIELDS = ['tipo_produto', 'movimento', 'enchimento', 'revestimento', 'linha', 'perfil', 'cor', 'protect_plus', 'veneziana', 'visor'] as const;

// Campos visíveis por tipo de produto
// ALIZAR  → revestimento, cor + dimensões (alt×larg×esp)
// BATENTE → revestimento    + dimensões (larg×esp)
// demais  → tudo
const HIDDEN_ATTR: Record<string, Set<string>> = {
  ALIZAR:  new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus', 'veneziana', 'visor']),
  BATENTE: new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus', 'veneziana', 'visor']),
};
const HIDDEN_DIM: Record<string, Set<string>> = {
  BATENTE: new Set(['altura_cm']),
  ALIZAR:  new Set(['largura_cm']),  // largura aparece no campo Alizar (L × regulagem)
};
function attrVisible(tipo: string | null | undefined, field: string) {
  const t = (tipo || '').toUpperCase().trim();
  return !HIDDEN_ATTR[t]?.has(field);
}
function dimVisible(tipo: string | null | undefined, field: string) {
  const t = (tipo || '').toUpperCase().trim();
  return !HIDDEN_DIM[t]?.has(field);
}
// Mostra coluna Alizar para KIT PORTA (bat+alizar inclusos) e para ALIZAR (largura×regulagem)
function alizarColVisible(tipo: string | null | undefined) {
  const t = (tipo || '').toUpperCase().trim();
  return t === 'KIT PORTA' || t === 'ALIZAR';
}
// Coluna Batente só para KIT PORTA
function batenteColVisible(tipo: string | null | undefined) {
  return (tipo || '').toUpperCase().trim() === 'KIT PORTA';
}
type AttrField = typeof ATTR_FIELDS[number];

const DIM_FIELDS = ['altura_cm', 'largura_cm', 'espessura_cm'] as const;


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
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoResult, setAutoResult] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [nullsFirst, setNullsFirst] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, oRes] = await Promise.all([
        fetchAllProdutos(),
        supabase.from('concremprodutos_opcoes_classificacao').select('*').eq('ativo', true).order('campo').order('valor'),
      ]);
      setProdutos(p);
      setOpcoes(oRes.data || []);
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
    return produtos.filter(p => {

      if (fTipo   && p.tipo_produto  !== fTipo)   return false;
      if (fMov    && p.movimento     !== fMov)    return false;
      if (fEnch   && p.enchimento    !== fEnch)   return false;
      if (fRev    && p.revestimento  !== fRev)    return false;
      if (fLinha   && p.linha        !== fLinha)                           return false;
      if (fPerfil  && p.perfil       !== fPerfil)                          return false;
      if (fCor     && p.cor          !== fCor)                             return false;
      if (fAltura  && p.altura_cm    !== parsePtNumber(fAltura))           return false;
      if (fLargura && p.largura_cm   !== parsePtNumber(fLargura))          return false;
      if (fBatente && p.batente_cm   !== parsePtNumber(fBatente))          return false;
      if (fAlizar) {
        const [lStr, aStr] = fAlizar.split('x');
        if (p.alizar_l !== parsePtNumber(lStr) || p.alizar_a !== parsePtNumber(aStr)) return false;
      }
      if (fProtect   && p.protect_plus !== fProtect)                         return false;
      if (fVeneziana && p.veneziana    !== fVeneziana)                       return false;
      if (fVisor     && p.visor        !== fVisor)                           return false;
      if (fStatus  && p.situacao     !== fStatus)                          return false;
      return true;
    });
  }, [produtos, fTipo, fMov, fEnch, fRev, fLinha, fPerfil, fCor, fAltura, fLargura, fBatente, fAlizar, fProtect, fVeneziana, fVisor, fStatus]);

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
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const tipos = useMemo(() => [...new Set(produtos.map(p => p.tipo_produto).filter(Boolean))].sort() as string[], [produtos]);

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

    const updatePayload: any = { ...(m || {}) };
    updatePayload.situacao = 'classificado';

    const { error } = await supabase
      .from('concremprodutos_produtos')
      .update(updatePayload)
      .eq('id', prodId);
    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Produto salvo!' });
      setModified(prev => { const n = new Map(prev); n.delete(prodId); return n; });
      setProdutos(prev => prev.map(p => p.id === prodId ? { ...p, ...updatePayload } : p));
    }
  };

  const saveAll = async () => {
    const entries = Array.from(modified.entries());
    if (entries.length === 0) return;
    let ok = 0, fail = 0;
    for (const [id, m] of entries) {
      const updatePayload: any = { ...m };
      updatePayload.situacao = 'classificado';
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

  const runAutoClassify = async () => {
    setAutoLoading(true);
    setAutoResult(null);
    try {
      // Fetch both rule types in parallel
      const [regras, raRes] = await Promise.all([
        fetchAllRegras(),
        supabase.from('concremprodutos_regras_atributo').select('*').eq('ativo', true).order('prioridade', { ascending: false }),
      ]);
      const regrasAtributo: RegraAtributo[] = raRes.data || [];

      let catCount = 0;
      let attrCount = 0;

      const shouldDefaultMovimento = (p: Produto) => {
        const t = (p.tipo_produto || '').toUpperCase().trim();
        return (t === 'KIT PORTA' || t === 'PORTA') && !p.movimento;
      };

      // 1) Apply ATTRIBUTE rules first
      for (const regra of regrasAtributo) {
        const criterioUpper = regra.criterio.toUpperCase().trim();

        const numericFields = new Set<string>([...DIM_FIELDS, 'batente_cm', 'alizar_l', 'alizar_a', 'alizar_e', 'preco']);

        const matched = produtos.filter(p => {
          // Only apply if field is currently empty
          const currentVal = (p as any)[regra.campo];
          if (currentVal) return false;

          const desc = p.descricao.toUpperCase();
          switch (regra.tipo_match) {
            case 'contem': return desc.includes(criterioUpper);
            case 'comeca_com': return desc.startsWith(criterioUpper);
            case 'termina_com': return desc.endsWith(criterioUpper);
            case 'exato': return desc === criterioUpper;
            default: return false;
          }
        });

        for (const p of matched) {
          const valueToSet = numericFields.has(regra.campo) ? parsePtNumber(regra.valor) : regra.valor;
          if (numericFields.has(regra.campo) && valueToSet === null) continue;
          const { error } = await supabase
            .from('concremprodutos_produtos')
            .update({ [regra.campo]: valueToSet })
            .eq('id', p.id);
          if (!error) {
            (p as any)[regra.campo] = valueToSet;
            attrCount++;
          }
        }
      }

      // 1b) Parse batente_cm / alizar_l / alizar_a for KIT PORTA via parser
      const kitPortas = produtos.filter(p => (p.tipo_produto || '').toUpperCase().trim() === 'KIT PORTA');
      for (const p of kitPortas) {
        const parsed = parseProduto(p.descricao);
        const updates: Record<string, number | null> = {};
        if (!p.batente_cm && parsed.batente_cm != null) updates.batente_cm = parsed.batente_cm;
        if (!p.alizar_l   && parsed.alizar_l   != null) updates.alizar_l   = parsed.alizar_l;
        if (!p.alizar_a   && parsed.alizar_a   != null) updates.alizar_a   = parsed.alizar_a;
        if (Object.keys(updates).length === 0) continue;
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update(updates)
          .eq('id', p.id);
        if (!error) {
          Object.assign(p, updates);
          attrCount += Object.keys(updates).length;
        }
      }

      // 1b-2) Parse dimensões de BATENTE via parser (largura, espessura, batente_cm)
      const batentes = produtos.filter(p => (p.tipo_produto || '').toUpperCase().trim() === 'BATENTE');
      for (const p of batentes) {
        const parsed = parseProduto(p.descricao);
        const updates: Record<string, number | null> = {};
        if (!p.largura_cm   && parsed.largura_cm   != null) updates.largura_cm   = parsed.largura_cm;
        if (!p.espessura_cm && parsed.espessura_cm != null) updates.espessura_cm = parsed.espessura_cm;
        if (!p.batente_cm   && parsed.batente_cm   != null) updates.batente_cm   = parsed.batente_cm;
        if (Object.keys(updates).length === 0) continue;
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update(updates)
          .eq('id', p.id);
        if (!error) { Object.assign(p, updates); attrCount += Object.keys(updates).length; }
      }

      // 1b-3) Parse dimensões de ALIZAR via parser (altura, alizar_l, alizar_a, espessura)
      const alizares = produtos.filter(p => (p.tipo_produto || '').toUpperCase().trim() === 'ALIZAR');
      for (const p of alizares) {
        const parsed = parseProduto(p.descricao);
        const updates: Record<string, number | null> = {};
        if (!p.altura_cm    && parsed.altura_cm    != null) updates.altura_cm    = parsed.altura_cm;
        if (!p.alizar_l     && parsed.alizar_l     != null) updates.alizar_l     = parsed.alizar_l;
        if (!p.alizar_a     && parsed.alizar_a     != null) updates.alizar_a     = parsed.alizar_a;
        if (!p.espessura_cm && parsed.espessura_cm != null) updates.espessura_cm = parsed.espessura_cm;
        if (Object.keys(updates).length === 0) continue;
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update(updates)
          .eq('id', p.id);
        if (!error) { Object.assign(p, updates); attrCount += Object.keys(updates).length; }
      }

      // 1c) Default Protect+, Veneziana, Visor = 'Não' when still null
      const defaultNao = ['protect_plus', 'veneziana', 'visor'] as const;
      for (const campo of defaultNao) {
        const semValor = produtos.filter(p => !(p as any)[campo]);
        for (const p of semValor) {
          const { error } = await supabase
            .from('concremprodutos_produtos')
            .update({ [campo]: 'Não' })
            .eq('id', p.id);
          if (!error) {
            (p as any)[campo] = 'Não';
            attrCount++;
          }
        }
      }

      // 1d) Default movimento = GIRO when no rule filled it (only KIT PORTA / PORTA)
      const semMovimento = produtos.filter(shouldDefaultMovimento);
      for (const p of semMovimento) {
        const { error } = await supabase
          .from('concremprodutos_produtos')
          .update({ movimento: 'GIRO' })
          .eq('id', p.id);
        if (!error) {
          p.movimento = 'GIRO';
          attrCount++;
        }
      }

      // 2) Apply CATEGORY rules
      const ativas = regras.filter(r => r.ativo).sort((a, b) => b.prioridade - a.prioridade);
      const pendentes = produtos.filter(p => p.situacao === 'pendente');

      for (const regra of ativas) {
        const matched = pendentes.filter(p => {
          if (regra.tipo === 'codigo') return p.codigo?.toUpperCase().trim() === regra.criterio.toUpperCase().trim();
          return p.descricao.toUpperCase().includes(regra.criterio.toUpperCase().trim());
        });

        for (const p of matched) {
          const { error } = await supabase
            .from('concremprodutos_produtos')
            .update({ categoria_id: regra.categoria_id, subcategoria_id: regra.subcategoria_id, situacao: 'classificado' })
            .eq('id', p.id);
          if (!error) {
            catCount++;
            p.situacao = 'classificado';
          }
        }
      }

      setAutoResult(`✅ ${attrCount} atributos preenchidos, ${catCount} produtos categorizados`);
      loadData();
    } catch {
      setAutoResult('❌ Erro ao aplicar regras');
    } finally {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3 w-full">
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Classificação de Produtos</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-1" /> Importar JSON
          </Button>
          <Button size="sm" onClick={runAutoClassify} disabled={autoLoading}>
            {autoLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Wand2 className="h-4 w-4 mr-1" />}
            Aplicar Regras
          </Button>
        </div>
      </div>

      {autoResult && (
        <div className="bg-muted rounded-md px-4 py-2 text-sm">{autoResult}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-end">
        <FilterSelect label="Tipo"         value={fTipo}   onChange={v => { setFTipo(v);   setPage(0); }} options={tipos} />
        <FilterSelect label="Movimento"    value={fMov}    onChange={v => { setFMov(v);    setPage(0); }} options={opcoesPorCampo.movimento} />
        <FilterSelect label="Enchimento"   value={fEnch}   onChange={v => { setFEnch(v);   setPage(0); }} options={opcoesPorCampo.enchimento} />
        <FilterSelect label="Revestimento" value={fRev}    onChange={v => { setFRev(v);    setPage(0); }} options={opcoesPorCampo.revestimento} />
        <FilterSelect label="Linha"        value={fLinha}   onChange={v => { setFLinha(v);   setPage(0); }} options={opcoesPorCampo.linha} />
        <FilterSelect label="Liso/Frisado" value={fPerfil}  onChange={v => { setFPerfil(v);  setPage(0); }} options={opcoesPorCampo.perfil} />
        <FilterSelect label="Cor"          value={fCor}     onChange={v => { setFCor(v);     setPage(0); }} options={[...new Set(produtos.map(p => p.cor).filter(Boolean) as string[])].sort()} />
        <FilterSelect label="Altura (cm)"  value={fAltura}  onChange={v => { setFAltura(v);  setPage(0); }} options={alturaOpts} />
        <FilterSelect label="Largura (cm)" value={fLargura} onChange={v => { setFLargura(v); setPage(0); }} options={larguraOpts} />
        <FilterSelect label="Batente (cm)" value={fBatente} onChange={v => { setFBatente(v); setPage(0); }} options={batenteOpts} />
        <FilterSelect label="Alizar"       value={fAlizar}  onChange={v => { setFAlizar(v);  setPage(0); }} options={alizarOpts} />
        <FilterSelect label="Protect+"     value={fProtect}   onChange={v => { setFProtect(v);   setPage(0); }} options={['Sim', 'Não']} />
        <FilterSelect label="Veneziana"    value={fVeneziana} onChange={v => { setFVeneziana(v); setPage(0); }} options={['Sim', 'Não']} />
        <FilterSelect label="Visor"        value={fVisor}     onChange={v => { setFVisor(v);     setPage(0); }} options={['Sim', 'Não']} />
        <FilterSelect label="Status"       value={fStatus}  onChange={v => { setFStatus(v);  setPage(0); }} options={[{ value: 'pendente', label: 'Pendente' }, { value: 'classificado', label: 'Classificado' }]} />
      </div>

      {/* Save All */}
      {modified.size > 0 && (
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-md px-4 py-2">
          <span className="text-sm font-medium">{modified.size} produto(s) modificado(s)</span>
          <Button size="sm" onClick={saveAll}>
            <Save className="h-4 w-4 mr-1" /> Salvar Todos
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-auto bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <SortTh field="codigo"      label="Código"    sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="whitespace-nowrap" />
              <SortTh field="descricao"   label="Descrição" sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="min-w-[180px]" />
              {ATTR_FIELDS.map(f => (
                <SortTh key={f} field={f} label={ATTR_LABELS[f]} sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="min-w-[100px] whitespace-nowrap" />
              ))}
              <SortTh field="altura_cm"   label="Dimensões" sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="min-w-[170px] whitespace-nowrap" />
              <SortTh field="batente_cm"  label="Batente"   sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="min-w-[70px] whitespace-nowrap" />
              <SortTh field="alizar_l"    label="Alizar"    sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} className="min-w-[100px] whitespace-nowrap" />
              <SortTh field="situacao"    label="Status"    sortField={sortField} sortDir={sortDir} nullsFirst={nullsFirst} onSort={handleSort} />
              <th className="px-2 py-2 text-left font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p, i) => {
              const isModified = modified.has(p.id);

              return (
                <tr
                  key={p.id}
                  className={cn(
                    'border-b transition-colors',
                    isModified ? 'bg-amber-50/80' : i % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                  )}
                >
                  <td className="px-2 py-1.5 font-mono text-xs">{p.codigo || '—'}</td>
                  <td className="px-2 py-1.5 max-w-[300px]">
                    <span className="line-clamp-2 text-xs" title={p.descricao}>{p.descricao}</span>
                  </td>
                  {ATTR_FIELDS.map(field => {
                    const tipo = getField(p, 'tipo_produto');
                    if (!attrVisible(tipo, field)) {
                      return <td key={field} className="px-2 py-1.5"><span className="text-muted-foreground text-[11px]">—</span></td>;
                    }
                    const currentVal = getField(p, field) || '';
                    const fieldOptions = opcoesPorCampo[field] || [];
                    return (
                      <td key={field} className="px-2 py-1.5">
                        <Select value={currentVal} onValueChange={v => handleFieldChange(p.id, field, v === '__clear__' ? null : v)}>
                          <SelectTrigger className="h-7 text-[11px] w-full">
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
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1">
                      {dimVisible(getField(p, 'tipo_produto'), 'altura_cm') && <>
                        <Input
                          className="h-7 w-14 px-2 text-[11px]"
                          value={formatPtNumber(getField(p, 'altura_cm'))}
                          onChange={e => handleFieldChange(p.id, 'altura_cm', parsePtNumber(e.target.value))}
                          inputMode="decimal"
                          placeholder="Alt"
                          list="altura_cm-options"
                        />
                        <span className="text-muted-foreground text-[11px]">×</span>
                      </>}
                      <Input
                        className="h-7 w-14 px-2 text-[11px]"
                        value={formatPtNumber(getField(p, 'largura_cm'))}
                        onChange={e => handleFieldChange(p.id, 'largura_cm', parsePtNumber(e.target.value))}
                        inputMode="decimal"
                        placeholder="Larg"
                        list="largura_cm-options"
                      />
                      <span className="text-muted-foreground text-[11px]">×</span>
                      <Input
                        className="h-7 w-14 px-2 text-[11px]"
                        value={formatPtNumber(getField(p, 'espessura_cm'))}
                        onChange={e => handleFieldChange(p.id, 'espessura_cm', parsePtNumber(e.target.value))}
                        inputMode="decimal"
                        placeholder="Esp"
                        list="espessura_cm-options"
                      />
                    </div>
                  </td>
                  {/* Batente — só para KIT PORTA */}
                  <td className="px-2 py-1.5">
                    {batenteColVisible(getField(p, 'tipo_produto')) ? (
                      <div className="flex items-center gap-1">
                        <Input
                          className="h-7 w-16 px-2 text-[11px]"
                          value={formatPtNumber(getField(p, 'batente_cm'))}
                          onChange={e => handleFieldChange(p.id, 'batente_cm', parsePtNumber(e.target.value))}
                          inputMode="decimal"
                          placeholder="cm"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">—</span>
                    )}
                  </td>
                  {/* Alizar — KIT PORTA e ALIZAR */}
                  <td className="px-2 py-1.5">
                    {alizarColVisible(getField(p, 'tipo_produto')) ? (
                      <div className="flex items-center gap-1">
                        <Input
                          className="h-7 w-14 px-2 text-[11px]"
                          value={formatPtNumber(getField(p, 'alizar_l'))}
                          onChange={e => handleFieldChange(p.id, 'alizar_l', parsePtNumber(e.target.value))}
                          inputMode="decimal"
                          placeholder="L"
                        />
                        <span className="text-muted-foreground text-[11px]">×</span>
                        <Input
                          className="h-7 w-14 px-2 text-[11px]"
                          value={formatPtNumber(getField(p, 'alizar_a'))}
                          onChange={e => handleFieldChange(p.id, 'alizar_a', parsePtNumber(e.target.value))}
                          inputMode="decimal"
                          placeholder="A"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">—</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    <Badge variant={p.situacao === 'classificado' ? 'default' : 'secondary'} className={cn('text-[10px]', p.situacao === 'classificado' ? 'bg-primary' : '')}>
                      {p.situacao === 'classificado' ? 'Classificado' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="px-2 py-1.5">
                    <Button
                      size="sm"
                      variant={p.situacao === 'classificado' && !isModified ? 'ghost' : 'outline'}
                      className={cn('h-7 text-xs', p.situacao === 'classificado' && !isModified && 'text-muted-foreground')}
                      onClick={() => saveSingle(p.id)}
                    >
                      {p.situacao === 'classificado' && !isModified ? 'OK' : 'Salvar'}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr><td colSpan={14} className="text-center py-12 text-muted-foreground">Nenhum produto encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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

function SortTh({ field, label, sortField, sortDir, nullsFirst, onSort, className }: {
  field: string;
  label: string;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  nullsFirst: boolean;
  onSort: (f: string) => void;
  className?: string;
}) {
  const active = sortField === field;
  return (
    <th
      className={cn('px-2 py-2 text-left font-medium cursor-pointer select-none hover:bg-muted/70 group', className)}
      onClick={() => onSort(field)}
      title={active ? (nullsFirst ? 'Vazios primeiro' : 'Vazios por último') : ''}
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

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <Select value={value} onValueChange={v => onChange(v === '__all__' ? '' : v)}>
      <SelectTrigger className="h-8 w-[120px] text-xs">
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
