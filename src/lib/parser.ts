function pf(s: string) { return parseFloat(s.replace(',', '.')); }

export function parseProduto(descricao: string) {
  const baseDescricao = descricao
    .replace(/^\s*\d{4,}\s*[-–—]\s*/u, '')
    .trim();
  const d = baseDescricao.toUpperCase();

  const tipo_produto =
      d.startsWith('KIT PORTA') ? 'KIT PORTA'
    : d.startsWith('PORTA')     ? 'PORTA'
    : d.startsWith('FOLHA')     ? 'FOLHA'
    : d.startsWith('ALIZAR')    ? 'ALIZAR'
    : d.startsWith('BATENTE')   ? 'BATENTE'
    : null;

  // ── Dimensões por tipo ───────────────────────────────────────────────────
  //
  // KIT PORTA / PORTA / FOLHA  →  {alt}x{larg}x{esp}CM   ex: 210x80x3,5CM
  // BATENTE                    →  {larg}x{esp}CM          ex: 12,0x3,5CM
  // ALIZAR                     →  {alt}x{l}x{a}x{esp}CM  ex: 224x5,0x8,5x1,0CM
  //
  let altura_cm:    number | null = null;
  let largura_cm:   number | null = null;
  let espessura_cm: number | null = null;
  let batente_cm:   number | null = null;
  let alizar_l:     number | null = null;
  let alizar_a:     number | null = null;
  let alizar_e:     number | null = null;

  const NUM = '(\\d+[,.]?\\d*)';

  if (tipo_produto === 'BATENTE') {
    // 2 partes: largura x espessura
    const m = baseDescricao.match(new RegExp(`${NUM}x${NUM}CM`, 'i'));
    if (m) {
      largura_cm   = pf(m[1]);
      espessura_cm = pf(m[2]);
      batente_cm   = largura_cm; // espelha para o filtro de batente funcionar
    }

  } else if (tipo_produto === 'ALIZAR') {
    // 4 partes: altura x largura x regulagem x espessura  ex: 224x5,0x8,5x1,0CM
    const m4 = baseDescricao.match(new RegExp(`${NUM}x${NUM}x${NUM}x${NUM}CM`, 'i'));
    if (m4) {
      altura_cm    = pf(m4[1]);
      alizar_l     = pf(m4[2]);   // largura
      alizar_a     = pf(m4[3]);   // regulagem
      espessura_cm = pf(m4[4]);
      alizar_e     = espessura_cm;
      largura_cm   = alizar_l;    // espelha para filtro de largura e coluna Dimensões
    } else {
      // 3 partes como fallback: altura x largura x regulagem
      const m3 = baseDescricao.match(new RegExp(`${NUM}x${NUM}x${NUM}CM`, 'i'));
      if (m3) {
        altura_cm  = pf(m3[1]);
        alizar_l   = pf(m3[2]);
        alizar_a   = pf(m3[3]);
        largura_cm = alizar_l;
      }
    }

  } else {
    // KIT PORTA / PORTA / FOLHA: 3 partes padrão
    const m = baseDescricao.match(/(\d{2,3})x(\d{2,3})x(\d+[,.]?\d*)CM/i);
    if (m) {
      altura_cm    = parseFloat(m[1]);
      largura_cm   = parseFloat(m[2]);
      espessura_cm = pf(m[3]);
    }

    // Batente no KIT PORTA: padrão Bat15CM dentro dos parênteses
    if (tipo_produto === 'KIT PORTA' && d.includes('BAT')) {
      const mb = baseDescricao.match(/Bat\s*(?:PET|AL)?(\d+(?:[,.]\d+)?)CM/i);
      if (mb) batente_cm = pf(mb[1]);
    }

    // Alizar no KIT PORTA: padrão AL5x8,5CM dentro dos parênteses
    if (tipo_produto === 'KIT PORTA') {
      const ma = baseDescricao.match(/AL(\d+[,.]?\d*)x(\d+[,.]?\d*)(?:x(\d+[,.]?\d*))?CM/i);
      if (ma) {
        alizar_l = pf(ma[1]);
        alizar_a = pf(ma[2]);
        alizar_e = ma[3] ? pf(ma[3]) : null;
      }
    }
  }

  return {
    tipo_produto,
    movimento: d.includes('CORRER') ? 'CORRER'
             : d.includes('PIVÔ') || d.includes('PIVO') ? 'PIVÔ'
             : null,
    linha: d.includes('INNOV.') ? 'Innovazione'
         : d.includes('ESSENZ.') ? 'Essenziale' : null,
    perfil: d.includes(' LS ') ? 'LISA'
          : d.includes(' CC ') ? 'FRISADA' : null,
    enchimento: d.includes('SEMI-OCA') ? 'Semi-oca'
              : d.includes('SOLIDA') || d.includes('SÓLIDA') ? 'Sólida'
              : d.includes('SARR. 6MM') ? 'Sarrafo 6mm'
              : d.includes('SARR. 3MM') ? 'Sarrafo 3mm' : null,
    revestimento: d.includes('LACCA TOUCH') ? 'Lacca Touch'
                : d.includes(' UV ') || d.endsWith(' UV') ? 'UV'
                : d.includes('NATURA') ? 'Natura' : null,
    cor: (() => {
      const m = baseDescricao.match(
        /(?:LACCA TOUCH|UV|NATURA|LACA)\s+([A-ZÀ-Ú][A-ZÀ-Ú\s]+?)(?:\s+\d|\s+C\/|\s+\(|$)/i
      );
      return m ? m[1].trim() : null;
    })(),
    protect_plus: d.includes('PROTECT+') ? 'Sim' : 'Não',
    veneziana:    d.includes('VENEZ.')    ? 'Sim' : 'Não',
    visor:        d.includes('C/ VISOR') ? 'Sim' : 'Não',
    tem_bandeira: d.includes('C/ BAND.'),
    tem_visor:    d.includes('C/ VISOR'),
    tem_veneziana: d.includes('VENEZ.'),
    batente_tipo: d.includes('BAT PET') ? 'PET'
                : d.includes('BAT') && d.includes('AL') ? 'AL' : null,
    altura_cm,
    largura_cm,
    espessura_cm,
    batente_cm,
    alizar_l,
    alizar_a,
    alizar_e,
  };
}
