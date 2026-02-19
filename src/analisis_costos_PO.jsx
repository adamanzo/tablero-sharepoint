importar { useState } de "react";
importar {
  Gráfico de barras, Barra, Eje X, Eje Y, Cuadrícula cartesiana, Información sobre herramientas, Leyenda,
  Contenedor responsivo, Línea de referencia, Celda, Lista de etiquetas,
  Gráfico compuesto, Gráfico de dispersión, Dispersión,
  Gráfico de radar, Radar, Cuadrícula polar, Eje de ángulo polar, Eje de radio polar,
} de "recharts";

// ═══════════════════════════════════════════════════════════════════
// DATOS — Proyección Obra (_PO), cols A–T de hoja Obras + Resumen_IC_VIV
// Costo Total PO = Costo Directo_PO × (1 + GG Empresa_PO) × (1 + IVA_PO)
// DS49: GG=11,8% | DS19/Privado: GG=5,0% | IVA real varía por proyecto
// Excluidos: PLV206 (urbanización), CLF63, MDP67, TB68 (sin IC activo)
// ═══════════════════════════════════════════════════════════════════
constante DATOS = {
  KPI: {
    ds49_n: 12, ds19priv_n: 6,
    ds49_avg_cd: 1017,2, ds49_avg_tot: 1258,8,
    ds49_med_tot: 1252,5, ds49_min_tot: 1079,6, ds49_max_tot: 1503,0,
    ds19_avg_cd: 1351.2, ds19_avg_tot: 1596.2, ds19_avg_m2: 22.54,
    priv_tot_viv: 1818,9, priv_tot_m2: 28,38,
    ds49_gg: 11.8, ds19_gg: 5.0,
  },

  etapa: [
    { e:"Obra Gruesa", d49cd:312.2, d49tot:390.8, d19cd:339.4, d19tot:404.1, d19m2:5.83 },
    { e:"GG de Obra", d49cd:261.2, d49tot:326.9, d19cd:315.1, d19tot:374.8, d19m2:5.42 },
    { e:"Terminaciones", d49cd:171.4, d49tot:214.5, d19cd:356.4, d19tot:423.8, d19m2:6.08 },
    { e:"Urbanización", d49cd:106.1, d49tot:132.8, d19cd:116.4, d19tot:138.3, d19m2:1.97 },
    { e:"Instalaciones", d49cd: 81.2, d49tot:101.7, d19cd:142.2, d19tot:169.3, d19m2:2.43 },
    { e:"Obras Prelim.", d49cd: 49.8, d49tot: 62.3, d19cd: 51.3, d19tot: 60.9, d19m2:0.88 },
    { e:"Entrega", d49cd: 27.6, d49tot: 34.6, d19cd: 40.3, d19tot: 48.0, d19m2:0.69 },
    { e:"Áreas Verdes", d49cd: 14.1, d49tot: 17.6, d19cd: 23.4, d19tot: 27.8, d19m2:0.40 },
  ],

  recurso: [
    { r:"Mano de Obra", d49cd:359.2, d49tot:449.4, d19cd:364.8, d19tot:433.4, d19m2:6.26 },
    { r:"Materiales", d49cd:318.1, d49tot:398.1, d19cd:389.7, d19tot:463.7, d19m2:6.67 },
    { r:"Subcontratos", d49cd:234.6, d49tot:293.6, d19cd:490.5, d19tot:584.2, d19m2:8.39 },
    { r:"Maq. y Equipos", d49cd: 91.7, d49tot:114.7, d19cd:115.2, d19tot:137.0, d19m2:1.97 },
    { r:"Otros", d49cd: 20.1, d49tot: 25.3, d19cd: 24.2, d19tot: 28.8, d19m2:0.42 },
  ],

  rango: [
    { rango:"< 120 viv", ppto:1190.1, po:1324.9, n:4 },
    { rango:"120–200 viv", ppto:1198.8, po:1343.4, n:2 },
    { rango:"> 500 viv", ppto:1064.8, po:1214.9, n:1 },
  ],

  obras: [
    { n:"PLV3", t:"DS49", viv:430, ppto:1069.3, po:1079.6, cd:871.4, dpct:1.0, dabs:10.3, gg:11.8, iva:12.1 },
    { n:"PLV2", t:"DS49", viv:320, ppto:1118.3, po:1148.8, cd:931.5, dpct:2.7, dabs:30.6, gg:11.8, iva:11.5 },
    { n:"PLV1", t:"DS49", viv:320, ppto:1132.9, po:1169.8, cd:945.6, dpct:3.3, dabs:36.9, gg:11.8, iva:11.9 },
    { n:"CDG", t:"DS49", viv:504, ppto:1064.8, po:1214.9, cd:982.1, dpct:14.1, dabs:150.1, gg:11.8, iva:11.9 },
    { n:"VT", t:"DS49", viv:160, ppto:1059.7, po:1233.4, cd:996.9, dpct:16.4, dabs:173.7, gg:11.8, iva:11.9 },
    { n:"LP", t:"DS49", viv:112, ppto:1249.6, po:1252.1, cd:1015.7, dpct:0.2, dabs:2.6, gg:11.8, iva:11.5 },
    { n:"ADE", t:"DS49", viv:320, ppto:1052.7, po:1252.8, cd:1017.9, dpct:19.0, dabs:200.1, gg:11.8, iva:11.3 },
    { n:"AGM", t:"DS49", viv:360, ppto:1128.7, po:1253.4, cd:1006.1, dpct:11.0, dabs:124.6, gg:11.8, iva:12.8 },
    { n:"VM", t:"DS49", viv:108, ppto:1238.3, po:1257.4, cd:1002.7, dpct:1.5, dabs:19.1, gg:11.8, iva:13.6 },
    { n:"LG", t:"DS49", viv:120, ppto:1111.6, po:1287.1, cd:1041.1, dpct:15.8, dabs:175.5, gg:11.8, iva:11.8 },
    { n:"DM", t:"DS49", viv:156, ppto:1337.9, po:1453.5, cd:1181.9, dpct:8.6, dabs:115.5, gg:11.8, iva:11.2 },
    { n:"MK", ​​t:"DS49", viv:96, ppto:1160.9, po:1503.0, cd:1213.9, dpct:29.5, dabs:342.1, gg:11.8, iva:12.0 },
    { n:"JDV", t:"DS19", viv:250, ppto:1411.8, po:1474.3, cd:1259.7, dpct:4.4, dabs:62.5, gg:5.0, iva:12.0, pm2p:20.21, pm2o:21.11 },
    { n:"AMAPU", t:"DS19", viv:168, ppto:1477.8, po:1499.4, cd:1273.9, dpct:1.5, dabs:21.5, gg:5.0, iva:12.7, pm2p:21.45, pm2o:21.76 },
    { n:"BM", t:"DS19", viv:192, ppto:1501.3, po:1540.5, cd:1291.4, dpct:2.6, dabs:39.1, gg:5.0, iva:14.3, pm2p:21.89, pm2o:22.47 },
    { n:"VP", t:"DS19", viv:264, ppto:1532.1, po:1589.6, cd:1332.2, dpct:3.8, dabs:57.5, gg:5.0, iva:14.3, pm2p:19.62, pm2o:20.36 },
    { n:"PB", t:"PRIVADO", viv:160, ppto:1895.6, po:1818.9, cd:1528.1, dpct:-4.0, dabs:-76.8, gg:5.0, iva:14.0, pm2p:29.58, pm2o:28.38 },
    { n:"CQ", t:"DS19", viv:128, ppto:1413.8, po:1877.1, cd:1598.6, dpct:32.8, dabs:463.3, gg:5.0, iva:12.4, pm2p:20.35, pm2o:27.01 },
  ],

  // Stacked por proyecto — Costo Directo _PO por etapa / vivienda
  s49cd: [
    { n:"PLV3", viv:430, "Prelim.":27.0,"Obra Gruesa":257.8,"Instal.":74.1,"Termin.":173.5,"Urbaniz.":73.8,"Áreas V.":9.9,"Entrega":35.1,"GG Obra":253.3 },
    { n:"PLV2", viv:320, "Prelim.":31.4,"Obra Gruesa":331.5,"Instal.":78.1,"Termin.":187.6,"Urbaniz.":85.5,"Áreas V.":7.3,"Entrega":21.4,"GG Obra":240.2 },
    { n:"PLV1", viv:320, "Prelim.":26.0,"Obra Gruesa":271.6,"Instal.":68.5,"Termin.":196.6,"Urbaniz.":84.2,"Áreas V.":11.1,"Entrega":11.8,"GG Obra":319.0 },
    { n:"CDG", viv:504, "Prelim.":61.5,"Obra Gruesa":355.8,"Instal.":74.0,"Termin.":178.5,"Urbaniz.":122.2,"Áreas V.":24.7,"Entrega":23.8,"GG Obra":148.2 },
    { n:"VT", viv:160, "Prelim.":35.5,"Obra Gruesa":338.9,"Instal.":80.7,"Termin.":166.9,"Urbaniz.":98.7,"Áreas V.":7.7,"Entrega":35.3,"GG Obra":234.1 },
    { n:"LP", viv:112, "Prelim.":37.8,"Obra Gruesa":325.4,"Instal.":78.6,"Termin.":159.1,"Urbaniz.":123.2,"Áreas V.":15.7,"Entrega":19.8,"GG Obra":252.0 },
    { n:"VM", viv:108, "Prelim.":55.7,"Obra Gruesa":298.6,"Instal.":77.5,"Termin.":152.2,"Urbaniz.":109.0,"Áreas V.":22.8,"Entrega":24.9,"GG Obra":261.0 },
    { n:"ADE", viv:320, "Prelim.":72.8,"Obra Gruesa":284.1,"Instal.":79.4,"Termin.":183.6,"Urbaniz.":82.7,"Áreas V.":13.6,"Entrega":69.5,"GG Obra":233.8 },
    { n:"AGM", viv:360, "Prelim.":41.3,"Obra Gruesa":362.3,"Instal.":91.6,"Termin.":171.1,"Urbaniz.":144.9,"Áreas V.":17.6,"Entrega":9.5,"GG Obra":195.2 },
    { n:"LG", viv:120, "Prelim.":41.6,"Obra Gruesa":286.8,"Instal.":85.8,"Termin.":121.7,"Urbaniz.":87.2,"Áreas V.":11.9,"Entrega":37.6,"GG Obra":368.0 },
    { n:"DM", viv:156, "Prelim.":31.2,"Obra Gruesa":355.2,"Instal.":89.1,"Termin.":220.5,"Urbaniz.":149.9,"Áreas V.":13.6,"Entrega":15.1,"GG Obra":325.7 },
    { n:"MK", ​​viv:96, "Prelim.":138.0,"Obra Gruesa":307.5,"Instal.":105.4,"Termin.":165.9,"Urbaniz.":120.3,"Áreas V.":13.8,"Entrega":30.6,"GG Obra":337.1 },
  ],
  // Apilado — Costo Total PO por etapa / vivienda (CD × factor GG+IVA)
  s49tot: [
    { n:"PLV3", viv:430, "Prelim.":33.8,"Obra Gruesa":322.7,"Instal.":92.8,"Termin.":217.3,"Urbaniz.":92.4,"Áreas V.":12.4,"Entrega":43.9,"GG Obra":317.2 },
    { n:"PLV2", viv:320, "Prelim.":39.2,"Obra Gruesa":413.8,"Instal.":97.5,"Termin.":234.2,"Urbaniz.":106.7,"Áreas V.":9.1,"Entrega":26.7,"GG Obra":299.8 },
    { n:"PLV1", viv:320, "Prelim.":32.5,"Obra Gruesa":339.6,"Instal.":85.6,"Termin.":245.8,"Urbaniz.":105.2,"Áreas V.":13.9,"Entrega":14.8,"GG Obra":398.8 },
    { n:"CDG", viv:504, "Prelim.":76.9,"Obra Gruesa":444.9,"Instal.":92.5,"Termin.":223.2,"Urbaniz.":152.8,"Áreas V.":30.9,"Entrega":29.8,"GG Obra":185.3 },
    { n:"VT", viv:160, "Prelim.":44.5,"Obra Gruesa":424.2,"Instal.":101.0,"Termin.":208.9,"Urbaniz.":123.5,"Áreas V.":9.6,"Entrega":44.2,"GG Obra":292.9 },
    { n:"LP", viv:112, "Prelim.":47.1,"Obra Gruesa":406.0,"Instal.":98.1,"Termin.":198.7,"Urbaniz.":153.8,"Áreas V.":19.6,"Entrega":24.7,"GG Obra":314.6 },
    { n:"VM", viv:108, "Prelim.":70.8,"Obra Gruesa":379.3,"Instal.":98.4,"Termin.":193.3,"Urbaniz.":138.4,"Áreas V.":28.9,"Entrega":31.6,"GG Obra":331.5 },
    { n:"ADE", viv:320, "Prelim.":90.3,"Obra Gruesa":353.0,"Instal.":98.6,"Termin.":228.5,"Urbaniz.":102.9,"Áreas V.":16.9,"Entrega":86.4,"GG Obra":291.0 },
    { n:"AGM", viv:360, "Prelim.":52.1,"Obra Gruesa":456.7,"Instal.":115.4,"Termin.":215.8,"Urbaniz.":182.6,"Áreas V.":22.2,"Entrega":11.9,"GG Obra":246.2 },
    { n:"LG", viv:120, "Prelim.":52.0,"Obra Gruesa":358.5,"Instal.":107.2,"Termin.":152.1,"Urbaniz.":109.0,"Áreas V.":14.9,"Entrega":47.0,"GG Obra":460.3 },
    { n:"DM", viv:156, "Prelim.":38.8,"Obra Gruesa":442.5,"Instal.":111.0,"Termin.":275.2,"Urbaniz.":186.8,"Áreas V.":16.9,"Entrega":18.9,"GG Obra":405.9 },
    { n:"MK", ​​viv:96, "Prelim.":172.8,"Obra Gruesa":384.8,"Instal.":131.8,"Termin.":207.5,"Urbaniz.":150.4,"Áreas V.":17.3,"Entrega":38.2,"GG Obra":421.5 },
  ],
  // DS19+Privado — Costo Total PO por etapa
  s19tot: [
    { n:"JDV", t:"DS19", "Prelim.":71.7,"Obra Gruesa":349.0,"Instal.":150.5,"Termin.":397.1,"Urbaniz.":189.9,"Áreas V.":47.1,"Entrega":21.9,"GG Obra":215.1 },
    { n:"AMAPU", t:"DS19", "Prelim.":51.1,"Obra Gruesa":357.3,"Instal.":154.3,"Termin.":464.1,"Urbaniz.":139.1,"Áreas V.":26.3,"Entrega":17.1,"GG Obra":294.9 },
    { n:"BM", t:"DS19", "Prelim.":55.7,"Obra Gruesa":406.0,"Instal.":128.8,"Termin.":398.7,"Urbaniz.":137.2,"Áreas V.":39.3,"Entrega":52.4,"GG Obra":323.5 },
    { n:"VP", t:"DS19", "Prelim.":29.9,"Obra Gruesa":407.5,"Instal.":208.8,"Termin.":433.9,"Urbaniz.":136.7,"Áreas V.":10.5,"Entrega":72.2,"GG Obra":307.5 },
    { n:"PB", t:"PRIVADO", "Prelim.":49.1,"Obra Gruesa":527.1,"Instal.":228.3,"Termin.":381.3,"Urbaniz.":74.6,"Áreas V.":17.3,"Entrega":74.0,"GG Obra":476.9 },
    { n:"CQ", t:"DS19", "Prelim.":58.8,"Obra Gruesa":394.1,"Instal.":150.6,"Termin.":486.7,"Urbaniz.":157.7,"Áreas V.":27.1,"Entrega":52.2,"GG Obra":656.3 },
  ],
  s19m2: [
    { n:"JDV", "Prelim.":1.03,"Obra Gruesa":5.00,"Instal.":2.16,"Termin.":5.69,"Urbaniz.":2.72,"Áreas V.":0.67,"Entrega":0.31,"GG Obra":3.08 },
    { n:"AMAPU", "Prelim.":0.74,"Obra Gruesa":5.19,"Instal.":2.24,"Termin.":6.74,"Urbaniz.":2.02,"Áreas V.":0.38,"Entrega":0.25,"GG Obra":4.29 },
    { n:"BM", "Prelim.":0.81,"Obra Gruesa":5.92,"Instal.":1.88,"Termin.":5.82,"Urbaniz.":2.00,"Áreas V.":0.57,"Entrega":0.76,"GG Obra":4.73 },
    { n:"VP", "Prelim.":0.38,"Obra Gruesa":5.21,"Instal.":2.67,"Termin.":5.55,"Urbaniz.":1.75,"Áreas V.":0.13,"Entrega":0.92,"GG Obra":3.93 },
    { n:"PB", "Prelim.":0.77,"Obra Gruesa":8.23,"Instal.":3.56,"Termin.":5.95,"Urbaniz.":1.16,"Áreas V.":0.27,"Entrega":1.15,"GG Obra":7.45 },
    { n:"CQ", "Prelim.":0.85,"Obra Gruesa":5.67,"Instal.":2.17,"Termin.":7.00,"Urbaniz.":2.27,"Áreas V.":0.39,"Entrega":0.75,"GG Obra":9.44 },
  ],
};

// ─────────── COLORES ────────────
constante C = {
  ds49:"#E8A838", ds19:"#38BFA8", priv:"#A078E8",
  fondo:"#0E1117", tarjeta:"#161B26", borde:"#242D40",
  texto:"#E8EDF5", atenuación:"#7A8599",
  rojo:"#E85C5C", verde:"#3EBF78",
  cuadrícula:"#1E2535",
};
constante ET_COLORS = {
  "Prelim.":"#5B8ECC","Obra Gruesa":"#E8A838","Instal.":"#38BFA8",
  "Termin.":"#A078E8","Urbaniz.":"#4CD964","Áreas V.":"#FF9F40",
  "Entrega":"#FF6B6B","GG Obra":"#94A3B8",
};
const ET_KEYS = ["Prelim.","Obra Gruesa","Instal.","Termin.","Urbaniz.","Áreas V.","Entrega","GG Obra"];

constante f1 = v => (v ?? 0).toFixed(1);
constante f2 = v => (v ?? 0).toFixed(2);

// ─────────── SUBCOMPONENTES ────────────
const Card = ({ hijos, estilo={} }) => (
  <div style={{ fondo:C.card, borde:`1px sólido ${C.border}`, radio del borde:12, relleno:"18px 20px", ...estilo }}>
    {niños}
  </div>
);

const Kpi = ({ etiqueta, valor, sub, color }) => (
  <div style={{ fondo:C.card, borde:`1px sólido ${C.border}`, radio del borde:12, relleno:"16px 20px", flex:1, ancho mínimo:0 }}>
    <div style={{fontSize:10, color:C.dim, textTransform:"mayúsculas", espaciado entre letras:"0.06em", margen inferior:4}}>{etiqueta}</div>
    <div style={{fontSize:25, fontFamily:"monospace", fontWeight:700, color:color||C.text, lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:C.dim, marginTop:4 }}>{sub}</div>}
  </div>
);

const Btn = ({ activo, onClick, hijos }) => (
  <botón al hacer clic={al hacer clic} estilo={{
    relleno: "4px 12px", radio del borde: 6, tamaño de fuente: 11, peso de fuente: 600, cursor: "puntero",
    Fondo: ¿activo? C.ds49: "transparente",
    color: ¿activo? "#0E1117": C.dim,
    borde:`1px sólido ${activo ? C.ds49 : C.border}`,
    textTransform: "mayúsculas", espaciado entre letras: "0,04 em",
  }}>{hijos}</button>
);

const Sección = ({ título, pista }) => (
  <div style={{ margen inferior:12 }}>
    <div style={{fontSize:15, fontWeight:700, color:C.text }}>{título}</div>
    {pista && <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>{pista}</div>}
  </div>
);

const Nota = ({ hijos }) => (
  <div style={{ fondo:"#1A2035", radio del borde:8, relleno:"9px 14px", margen superior:10, tamaño de fuente:11, color:C.dim, altura de línea:1.65 }}>
    {niños}
  </div>
);

const Legend2 = ({ elementos }) => (
  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:8 }}>
    {items.map(({ color, etiqueta }) => (
      <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.dim }}>
        <div style={{ ancho:10, alto:10, radio del borde:2, fondo:color }}/>{etiqueta}
      </div>
    ))}
  </div>
);

// Información sobre herramientas genérica
const TT = ({ activo, carga útil, etiqueta, unidad="UF/viv" }) => {
  si (!activo || !carga útil?.longitud) devuelve nulo;
  devolver (
    <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 12 }}>
      <div style={{fontWeight:700, color:C.text, marginBottom:5}}>{etiqueta}</div>
      {payload.map((p,i) => p.value != null && (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:16, color:p.color||p.fill||C.text }}>
          <span>{p.nombre}</span>
          <span style={{ fontFamily:"monospace", fontWeight:600 }}>{f1(p.value)} {unidad}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
exportar función predeterminada Dashboard() {
  const [etView, setEtView] = useState("tot_viv"); // tot_viv | cd_viv | d19m2
  constante [recView, setRecView] = useState("tot_viv");
  const [stackType, setStackType] = useState("s49tot"); // s49cd | s49tot | s19tot | s19m2
  constante [desvKey, setDesvKey] = useState("dpct"); // dpct | dabs
  const [mostrarCD, establecerMostrarCD] = useState(false);
  const [d19unit, setD19unit] = useState("viv"); //viv | m2

  const { kpi, etapa, recurso, rango, obras } = DATOS;

  const ds49 = [...obras].filter(o=>ot==="DS49").sort((a,b)=>a.po-b.po);
  const ds19pr = [...obras].filter(o=>ot!=="DS49").sort((a,b)=>a.po-b.po);
  const allDesv = [...obras].sort((a,b)=> desvKey==="dpct" ? a.dpct-b.dpct : a.dabs-b.dabs);

  // Pre-transformar datos con claves FIJOS para evitar problemas de re-render en Recharts
  const etUnit = etView==="d19m2" ? "UF/m²" : "UF/viv";
  const recUnit = recView==="d19m2" ? "UF/m²" : "UF/viv";

  const etChartData = etapa.map(d => ({
    e: de,
    DS49: etView==="cd_viv" ? d.d49cd : d.d49tot,
    "DS19+Priv": etView==="d19m2" ? d.d19m2 : etView==="cd_viv" ? d.d19cd : d.d19tot,
  }));
  const showEtDS49 = etView !== "d19m2";

  const recChartData = recurso.map(d => ({
    r: doctor,
    DS49: recView==="cd_viv" ? d.d49cd : d.d49tot,
    "DS19+Priv": recView==="d19m2" ? d.d19m2 : recView==="cd_viv" ? d.d19cd : d.d19tot,
  }));
  constante showRecDS49 = recView !== "d19m2";

  // Datos del gráfico DS19 con claves siempre iguales
  constante d19ChartData = ds19pr.map(d => ({
    n: dn,
    t:dt,
    viv: d.viv,
    gg: d.gg,
    iva: d.iva,
    ppto: d19unit==="viv"? d.ppto: d.pm2p,
    po: d19unit==="viv"? d.po : d.pm2o,
    dpct: d.dpct,
    toques: d.dabs,
  }));
  constante d19Dominio = d19unidad==="viv" ? [1100,2200] : [17,32];
  constante d19Fmt = d19unit==="viv" ? f1 : f2;
  const d19Unit = d19unit==="viv" ? "UF/viv" : "UF/m²";

  constante stackData = DATOS[tipopila];
  constante stackUnit = stackType==="s19m2" ? "UF/m²" : "UF/viv";

  devolver (
    <div style={{ fondo:C.bg, altura mínima:"100vh", relleno:"26px 30px", familia de fuentes:"'Segoe UI', system-ui, sans-serif", color:C.text }}>

      {/* ── CABECERA ── */}
      <div style={{ margen inferior:18 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:3 }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:700 }}>Análisis de Costos — Proyección Obra (PO)</h1>
          <span style={{ fontSize:12, color:C.dim }}>Hoja Obras cols A–T · Resumen IC VIV · dic 2025</span>
        </div>
        <p estilo={{ margen:0, tamaño de fuente:12, color:C.dim, ancho máximo:800 }}>
          Costo PO directo desde <b style={{color:C.text}}>Resumen_IC_VIV</b> (Proyección Total a Término) escalado con ratio
          <b style={{color:C.text}}> Costo Directo_PO / Costo Directo_POF</b> de la hoja Obras.
          Costo Total PO = CD_PO × (1 + GG_PO) × (1 + IVA_PO), usando únicamente columnas hasta
          <b style={{color:C.text}}>Costo_Total_PO (col T)</b>.
        </p>
      </div>

      {/* ── CASCADA ── */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        {[
          { etiqueta:"CD Promedio DS49", val:"1.017 UF/viv", color:"#4A5568" },
          { etiqueta:"× GG Empresa 11.8%", val:"+120 UF", color:"#805AD5" },
          { etiqueta:"× IVA ≈ 12,0%", val:"+122 UF", color:"#2B6CB0" },
          { etiqueta: "= Total PO DS49", val: "1.259 UF/viv", color:C.ds49, resaltado:verdadero },
        ].map((elemento,i) => (
          <div clave={i} estilo={{ visualización:"flexible", alignItems:"centro", espacio:8 }}>
            {i>0 && <span style={{ color:C.dim, fontSize:16 }}>→</span>}
            <div style={{ fondo:C.card, borde:`1px sólido ${item.highlight?item.color:C.border}`,
              radio del borde: 10, relleno: "10px 16px"
              <div style={{fontSize:9, color:C.dim, textTransform:"mayúsculas", espaciado entre letras:"0.05em" }}>{item.label}</div>
              <div style={{fontSize:18, fontFamily:"monospace", fontWeight:700, color:item.color }}>{item.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── KPI DS49 ── */}
      <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:C.ds49, marginBottom:8, textTransform:"uppercase" }}>
        DS49 · {kpi.ds49_n} proyectos · GG Empresa {kpi.ds49_gg}%
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <Kpi label="C. Total PO promedio" value={`${f1(kpi.ds49_avg_tot)} UF/viv`} sub="incl. GG+IVA" color={C.ds49} />
        <Kpi label="C. Directo PO prom." valor={`${f1(kpi.ds49_avg_cd)} UF/viv`} sub="sin GG ni IVA" color={`${C.ds49}bb`} />
        <Kpi label="Mediana total" valor={`${f1(kpi.ds49_med_tot)} UF/viv`} sub="" color={C.ds49} />
        <Kpi label="Rango" valor={`${f1(kpi.ds49_min_tot)}–${f1(kpi.ds49_max_tot)}`} sub="UF/viv mín–máx" color={C.ds49} />
      </div>

      {/* ── KPI DS19 / PRIVADO ── */}
      <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:C.ds19, marginBottom:8, textTransform:"uppercase" }}>
        DS19 · 5 proyectos · GG {kpi.ds19_gg}%  |  <span style={{color:C.priv}}>Privado · 1 proyecto · GG {kpi.ds19_gg}%</span>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:28 }}>
        <Kpi label="DS19 C.Total PO prom." valor={`${f1(kpi.ds19_avg_tot)} UF/viv`} sub="incl. GG+IVA" color={C.ds19} />
        <Kpi label="DS19 C.Directo PO" value={`${f1(kpi.ds19_avg_cd)} UF/viv`} sub="sin GG ni IVA" color={`${C.ds19}bb`} />
        <Kpi label="DS19 promedio /m²" value={`${f2(kpi.ds19_avg_m2)} UF/m²`} sub="incl. GG+IVA" color={C.ds19} />
        <Kpi label="PB (Privado) total" valor={`${f1(kpi.priv_tot_viv)} UF/viv`} sub={`${f2(kpi.priv_tot_m2)} UF/m²`} color={C.priv} />
      </div>

      {/* ── FILA 1: Por proyecto ── */}
      <div style={{ display:"cuadrícula", columnasdeplantilladecuadrícula:"1fr 1fr", espacio:14, margeninferior:14 }}>

        {/* DS49 */}
        <Tarjeta>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <Section title="DS49 — Costo por Proyecto" hind="Proyección Obra (PO) · UF/viv · incl. GG+IVA" />
            <Btn active={showCD} onClick={()=>setShowCD(!showCD)}>+ C.Directo</Btn>
          </div>
          <Contenedor responsivo ancho="100%" alto={320}>
            <BarChart data={ds49} layout="vertical" margin={{ left:4, right:60, top:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} horizontal={false} />
              <XAxis type="number" domain={[700,1700]} tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false} unit=" UF" />
              <YAxis type="category" dataKey="n" tick={{ fontSize:12, fill:C.text, fontWeight:600 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                const fila = obras.find(o=>on===label);
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{ fontWeight:700, marginBottom:4 }}>{etiqueta} <span style={{color:C.dim}}>({fila?.viv} viv)</span></div>
                    {payload.map((p,i) => <div key={i} style={{ color:p.fill, display:"flex", justifyContent:"space-between", gap:12 }}>
                      <span>{p.name}</span><span style={{ fontFamily:"monospace", fontWeight:600 }}>{f1(p.value)} UF</span>
                    </div>)}
                    {fila && <div style={{ color:C.dim, marginTop:4 }}>GG {fila.gg}% · IVA {fila.iva}%</div>}
                  </div>
                );
              }} />
              <Bar dataKey="ppto" name="Presupuesto" fill={`${C.ds49}28`} radio={[0,3,3,0]} tamaño de barra={8} />
              {showCD && <Bar dataKey="cd" name="C.Directo PO" fill={`${C.ds49}70`} radio={[0,3,3,0]} tamaño de barra={8} />}
              <Bar dataKey="po" name="Total PO" fill={C.ds49} radio={[0,3,3,0]} tamaño de barra={8}>
                <LabelList dataKey="po" position="right" formatter={f1} style={{ fontSize:10, fill:C.dim }} />
              </Barra>
            Gráfico de barras
          </ContenedorResponsivo>
          <Legend2 items={[{color:`${C.ds49}28`,label:"Presupuesto"},{color:`${C.ds49}70`,label:"C.Directo PO"},{color:C.ds49,label:"Total PO"}]} />
        </Tarjeta>

        {/* DS19 + Privado */}
        <Tarjeta>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <Section title="DS19 + Privado — Costo por Proyecto" sugerencia="Proyección Obra (PO) · incl. GG+IVA" />
            <div style={{ display:"flex", gap:6 }}>
              <Btn activo={d19unit==="viv"} al hacer clic={()=>establecerD19unit("viv")}>UF/viv</Btn>
              <Btn active={d19unit==="m2"} onClick={()=>setD19unit("m2")}>UF/m²</Btn>
            </div>
          </div>
          <Contenedor responsivo ancho="100%" alto={300}>
            <BarChart data={d19ChartData} layout="vertical" margin={{ izquierda:4, derecha:62, arriba:4, abajo:4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} horizontal={false} />
              <XAxis tipo="número" dominio={d19Dominio}
                tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="n" tick={{ fontSize:12, fill:C.text, fontWeight:600 }} tickLine={false} axisLine={false} width={52} />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                constante fila = d19ChartData.find(o=>on===label);
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{ fontWeight:700, marginBottom:4 }}>{etiqueta} <span style={{color:C.dim}}>({fila?.t} · {fila?.viv} viv)</span></div>
                    {payload.map((p,i) => p.value != null && (
                      <div key={i} style={{ color:p.fill||C.ds19, display:"flex", justifyContent:"space-between", gap:12 }}>
                        <span>{p.nombre}</span>
                        <span style={{ fontFamily:"monospace", fontWeight:600 }}>{d19Fmt(p.value)} {d19Unit}</span>
                      </div>
                    ))}
                    {fila && <div style={{ color:C.dim, marginTop:4 }}>GG {fila.gg}% · IVA {fila.iva}%</div>}
                  </div>
                );
              }} />
              <Bar dataKey="ppto" name="Presupuesto" fill={`${C.ds19}30`} radio={[0,3,3,0]} tamaño de barra={12} />
              <Bar dataKey="po" name="Total PO" radio={[0,3,3,0]} tamaño de barra={12}>
                {d19ChartData.map((e,i)=><Clave de celda={i} relleno={et==="PRIVADO"?C.priv:C.ds19} />)}
                <LabelList dataKey="po" position="right" formatter={d19Fmt} style={{ fontSize:10, fill:C.dim }} />
              </Barra>
            Gráfico de barras
          </ContenedorResponsivo>
          <Legend2 items={[{color:`${C.ds19}30`,label:"Presupuesto"},{color:C.ds19,label:"PO DS19"},{color:C.priv,label:"PO Privado"}]} />
          <div style={{fontSize:10, color:C.dim, marginTop:5 }}>
            m²/viv — VP 78.1 · JDV 69.9 · CQ 69.5 · BM 68.6 · AMAPU 68.9 · PB 64.1
          </div>
        </Tarjeta>
      </div>

      {/* ── FILA 2: Etapa + Recursos ── */}
      <div style={{ display:"cuadrícula", columnasdeplantilladecuadrícula:"1fr 1fr", espacio:14, margeninferior:14 }}>

        {/*ETAPAS*/}
        <Tarjeta>
          <Section title="Desglose por Etapa — DS49 vs DS19+Privado"
            sugerencia="Promedio entre proyectos del mismo tipo · fuente: Resumen_IC_VIV" />
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            <Btn active={etView==="tot_viv"} onClick={()=>setEtView("tot_viv")}>Total UF/viv</Btn>
            <Btn active={etView==="cd_viv"} onClick={()=>setEtView("cd_viv")}>C.Dir. UF/viv</Btn>
            <Btn active={etView==="d19m2"} onClick={()=>setEtView("d19m2")}>DS19 UF/m²</Btn>
          </div>
          <Contenedor responsivo ancho="100%" alto={270}>
            <Datos del gráfico de barras={etChartData}
              margen={{ izquierda:4, derecha:8, arriba:4, abajo:50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="e"
                marca={{fontSize:10, fill:C.dim }}
                tickLine={false} axisLine={false}
                ángulo={-38} textAnchor="fin" intervalo={0} altura={54} />
              <YAxis tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false} unit=" UF" width={40} />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{fontWeight:700, color:C.text, marginBottom:5}}>{etiqueta}</div>
                    {payload.map((p,i) => p.value != null && (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:16, color:p.fill||C.text }}>
                        <span>{p.nombre}</span>
                        <span style={{ fontFamily:"monospace", fontWeight:600 }}>{etUnit==="UF/m²"?f2(p.value):f1(p.value)} {etUnit}</span>
                      </div>
                    ))}
                  </div>
                );
              }} />
              {showEtDS49 && <Bar dataKey="DS49" fill={C.ds49} radio={[4,4,0,0]} tamaño de barra={20} />}
              <Bar dataKey="DS19+Priv" fill={C.ds19} radio={[4,4,0,0]} tamaño de barra={20} />
            Gráfico de barras
          </ContenedorResponsivo>
          <Leyenda2 elementos={showEtDS49
            ? [{color:C.ds49,etiqueta:"DS49"},{color:C.ds19,etiqueta:"DS19+Privado"}]
            : [{color:C.ds19,etiqueta:"DS19+Privado UF/m²"}]} />
          <Nota>
            💡 <b style={{color:C.text}}>Terminaciones</b>: DS49 <b style={{color:C.ds49}}>
            {etView==="cd_viv"?"171":"215"} UF/viv</b> frente a DS19 <b style={{color:C.ds19}}>
            {etView==="cd_viv"?"356":"424"} UF/viv</b> — brecha principal entre tipologías.
            GG de Obra es el 2° componente más grande en DS49 ({etView==="cd_viv"?"261":"327"} UF).
          </Nota>
        </Tarjeta>

        {/* RECURSOS */}
        <Tarjeta>
          <Section title="Desglose por Recurso — DS49 vs DS19+Privado"
            sugerencia="Promedio entre proyectos del mismo tipo · fuente: Resumen_IC_VIV" />
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            <Btn active={recView==="tot_viv"} onClick={()=>setRecView("tot_viv")}>Total UF/viv</Btn>
            <Btn active={recView==="cd_viv"} onClick={()=>setRecView("cd_viv")}>C.Dir. UF/viv</Btn>
            <Btn active={recView==="d19m2"} onClick={()=>setRecView("d19m2")}>DS19 UF/m²</Btn>
          </div>
          <Contenedor responsivo ancho="100%" alto={270}>
            <Datos del gráfico de barras={recChartData}
              margen={{ izquierda:4, derecha:8, arriba:4, abajo:50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <Clave de datos del eje X="r"
                marca={{fontSize:10, fill:C.dim }}
                tickLine={false} axisLine={false}
                ángulo={-38} textAnchor="fin" intervalo={0} altura={54} />
              <YAxis tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false} unit=" UF" width={40} />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{fontWeight:700, color:C.text, marginBottom:5}}>{etiqueta}</div>
                    {payload.map((p,i) => p.value != null && (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:16, color:p.fill||C.text }}>
                        <span>{p.nombre}</span>
                        <span style={{ fontFamily:"monospace", fontWeight:600 }}>{recUnit==="UF/m²"?f2(p.value):f1(p.value)} {recUnit}</span>
                      </div>
                    ))}
                  </div>
                );
              }} />
              {showRecDS49 && <Bar dataKey="DS49" fill={C.ds49} radio={[4,4,0,0]} tamaño de barra={26} />}
              <Bar dataKey="DS19+Priv" fill={C.ds19} radio={[4,4,0,0]} tamaño de barra={26} />
            Gráfico de barras
          </ContenedorResponsivo>
          <Leyenda2 elementos={showRecDS49
            ? [{color:C.ds49,etiqueta:"DS49"},{color:C.ds19,etiqueta:"DS19+Privado"}]
            : [{color:C.ds19,etiqueta:"DS19+Privado UF/m²"}]} />
          <Nota>
            💡 <b style={{color:C.ds49}}>DS49</b>: Mano de Obra lidera (449 UF/viv total), refleja alta mano de obra en GG de Obra.
            <b style={{color:C.ds19}}> DS19+Privado</b>: Subcontratos dominan claramente (584 UF/viv).
          </Nota>
        </Tarjeta>
      </div>

      {/* ── FILA 3: Desviaciones + Rango ── */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>

        {/* DESVIACIONES */}
        <Tarjeta>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <Section title="Desviación Presupuestaria — Costo Total PO vs PPTO"
              sugerencia="(Costo_Total_PO − Costo_Total_PPTO) por vivienda · datos directos de hoja Obras" />
            <div style={{ display:"flex", gap:6 }}>
              <Btn active={desvKey==="dpct"} onClick={()=>setDesvKey("dpct")}>% relativo</Btn>
              <Btn active={desvKey==="dabs"} onClick={()=>setDesvKey("dabs")}>UF/viv absoluto</Btn>
            </div>
          </div>
          <Contenedor responsivo ancho="100%" alto={280}>
            <BarChart data={allDesv} margin={{ izquierda:0, derecha:8, arriba:8, abajo:52 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="n"
                marca={{fontSize:11, fill:C.text, fontWeight:600 }}
                tickLine={false} axisLine={false}
                ángulo={-38} textAnchor="fin" intervalo={0} />
              <YAxis tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false}
                unidad={desvKey==="dpct"?"%":" UF"} />
              <Línea de referencia y={0} trazo={C.border} ancho del trazo={2} />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                const fila = obras.find(o=>on===label);
                const v = carga útil[0].valor;
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{fontWeight:700, marginBottom:4}}>{etiqueta} <span style={{color:C.dim}}>({fila?.t})</span></div>
                    <div style={{fontFamily:"monospace", fontWeight:700, color:v>=0?C.red:C.green, fontSize:15 }}>
                      {v>=0?"+":""}{desvKey==="dpct"?f1(v)+"%":f1(v)+" UF/viv"}
                    </div>
                    {desvKey==="dpct"&&row && <div style={{color:C.dim}}>Absoluto: {row.dabs>=0?"+":""}{f1(row.dabs)} UF/viv</div>}
                    {desvKey==="dabs"&&row && <div style={{color:C.dim}}>Relativo: {row.dpct>=0?"+":""}{f1(row.dpct)}%</div>}
                  </div>
                );
              }} />
              <Clave de datos de la barra={clavedesv} radio={[3,3,0,0]} tamaño de la barra={26}>
                {allDesv.map((e,i) => (
                  <Clave de celda={i} relleno={(desvKey==="dpct"?e.dpct:e.dabs)>=0 ? C.rojo : C.verde} opacidad de relleno={0.85} />
                ))}
              </Barra>
            Gráfico de barras
          </ContenedorResponsivo>
          <Legend2 items={[{color:C.red,label:"Sobre presupuesto"},{color:C.green,label:"Bajo presupuesto"}]} />
          <Nota>
            💡 <b style={{color:C.red}}>CQ +32.8%</b> (+463 UF/viv) y <b style={{color:C.red}}>MK +29.5%</b> (+342 UF/viv) son los outliers críticos.
            Nota: CQ_PO vs CQ_POF difieren en ~9.853 UF (ratio 0.954), lo que reduce la desviación respecto al análisis _POF.
            Solo <b style={{color:C.green}}>PB</b> está bajo presupuesto (−4.0%).
          </Nota>
        </Tarjeta>

        {/*RANGO*/}
        <Tarjeta>
          <Section title="Costo Total PO por Tamaño (DS49)"
            sugerencia="Promedio por rango de viviendas" />
          <Contenedor responsivo ancho="100%" alto={230}>
            <ComposedChart data={rango} margin={{ izquierda:0, derecha:20, arriba:8, abajo:30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="rango"
                tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false}
                etiqueta={{ valor:"Rango viv.", posición:"insideBottom", desplazamiento:-16, relleno:C.dim, tamaño de fuente:10 }} />
              <Dominio del eje Y={[900,1600]} marca={{ tamaño de fuente:10, relleno:C.dim }} línea de marca={falso} línea de eje={falso} unidad=" UF" />
              <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                const d = rango.find(r=>r.rango===etiqueta);
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{ fontWeight:700, marginBottom:4 }}>{etiqueta} <span style={{color:C.dim}}>({d?.n} proy.)</span></div>
                    {payload.map((p,i)=><div key={i} style={{color:p.fill,display:"flex",justifyContent:"space-between",gap:10}}>
                      <span>{p.name}</span><span style={{fontFamily:"monospace",fontWeight:600}}>{f1(p.value)} UF/viv</span>
                    </div>)}
                  </div>
                );
              }} />
              <Bar dataKey="ppto" name="Presupuesto" fill={`${C.ds49}40`} radio={[4,4,0,0]} tamaño de barra={26} />
              <Bar dataKey="po" name="Total PO" fill={C.ds49} radio={[4,4,0,0]} tamaño de barra={26}>
                <LabelList dataKey="po" position="top" formatter={f1} style={{ fontSize:9, fill:C.dim }} />
              </Barra>
            </GráficoCompuesto>
          </ContenedorResponsivo>
          <Legend2 items={[{color:`${C.ds49}44`,label:"Presupuesto"},{color:C.ds49,label:"Total PO"}]} />
          <Nota>
            💡 <b style={{color:C.ds49}}>>500 viv (CDG, 504)</b> es el más eficiente con 1.215 UF/viv.
            Los proyectos pequeños (<200 viv) promedian ~1.333 UF/viv.
          </Nota>
        </Tarjeta>
      </div>

      {/* ── FILA 4: Apilado ── */}
      <Estilo de tarjeta={{ margen inferior: 14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <Section title="Desglose por Etapa y Proyecto"
            sugerencia="Composición del costo por proyecto · fuente: Resumen_IC_VIV escalado a _PO" />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
            <Pulsador active={stackType==="s49cd"} onClick={()=>setStackType("s49cd")}>DS49 C.Dir.</Pulsador>
            <Btn active={stackType==="s49tot"} onClick={()=>setStackType("s49tot")}>DS49 Total</Btn>
            <Pulsador active={stackType==="s19tot"} onClick={()=>setStackType("s19tot")}>DS19+Priv Total</Pulsador>
            <Pulsador active={stackType==="s19m2"} onClick={()=>setStackType("s19m2")}>DS19+Priv UF/m²</Pulsador>
          </div>
        </div>
        <Contenedor responsivo ancho="100%" alto={290}>
          <BarChart data={stackData} margen={{ izquierda:0, derecha:8, arriba:0, abajo:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
            <XAxis dataKey="n" tick={{ tamaño de fuente: 12, relleno: C.texto, peso de fuente: 600 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false} unit=" UF" />
            <Tooltip cursor={{ fill:"#ffffff08" }} contenido={({ activo, carga útil, etiqueta })=>{
              si (!activo||!carga útil?.longitud) devuelve nulo;
              constante total = carga útil.reduce((s,p)=>s+(p.value||0),0);
              devolver (
                <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11, ancho mínimo: 180 }}>
                  <div style={{fontWeight:700, marginBottom:6, color:C.text}}>{etiqueta}</div>
                  {[...carga útil].reverse().map((p,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:12, color:p.fill }}>
                      <span>{p.dataKey}</span>
                      <span style={{fontFamily:"monospace", fontWeight:600 }}>
                        {stackType==="s19m2"?f2(p.valor):f1(p.valor)}
                      </span>
                    </div>
                  ))}
                  <div style={{borde superior:`1px sólido ${C.border}`, margen superior:5, relleno superior:5,
                    pantalla: "flexible", contenido justificado: "espacio entre", peso de fuente: 700, color: C.text
                    Total
                    <span style={{fontFamily:"monospace" }}>
                      {tipo de pila==="s19m2"?f2(total):f1(total)} {unidad de pila}
                    </span>
                  </div>
                </div>
              );
            }} />
            {ET_KEYS.map(k => <Clave de barra={k} clave de datos={k} stackId="a" relleno={ET_COLORS[k]} />)}
          Gráfico de barras
        </ContenedorResponsivo>
        <div style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
          {ET_KEYS.map(k => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.dim }}>
              <div style={{ ancho:11, alto:11, radio del borde:2, fondo:ET_COLORS[k] }}/>{k}
            </div>
          ))}
        </div>
      </Tarjeta>

      {/* ── FILA 5: Dispersión + Radar ── */}
      <div style={{ display:"cuadrícula", columnasdeplantilladecuadrícula:"1fr 1fr", espacio:14, margeninferior:14 }}>

        {/* DISPERSIÓN DS19+Privado */}
        <Tarjeta>
          Título de la sección="UF/viv vs. UF/m² — DS19 + Privado"
            sugerencia="Costo Total PO · incl. GG+IVA" />
          <Contenedor responsivo ancho="100%" alto={260}>
            <ScatterChart margin={{ izquierda:14, derecha:20, arriba:10, abajo:24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis tipo="número" clave de datos="po" nombre="UF/viv" dominio={[1300,2100]}
                tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false}
                etiqueta={{ valor:"UF / viv", posición:"insideBottom", desplazamiento:-10, relleno:C.dim, tamaño de fuente:10 }} />
              <YAxis tipo="número" clave de datos="pm2o" nombre="UF/m²" dominio={[18,30]}
                tick={{ fontSize:10, fill:C.dim }} tickLine={false} axisLine={false}
                etiqueta={{ valor:"UF / m²", ángulo:-90, posición:"insideLeft", relleno:C.dim, tamaño de fuente:10 }} />
              <Contenido de la información sobre herramientas={({ activo, carga útil })=>{
                si (!activo||!carga útil?.longitud) devuelve nulo;
                constante d = carga útil[0].carga útil;
                devolver (
                  <div style={{ fondo:"#1A2035", borde:`1px sólido ${C.border}`, radio del borde: 8, relleno:"10px 14px", tamaño de fuente: 11 }}>
                    <div style={{fontWeight:700, marginBottom:3}}>{dn}</div>
                    <div style={{ color:dt==="PRIVADO"?C.priv:C.ds19 }}>{dt}</div>
                    <div>{f1(d.po)} UF/viv · {f2(d.pm2o)} UF/m²</div>
                    <div style={{color:C.dim}}>Desv: {d.dpct>=0?"+":""}{f1(d.dpct)}%</div>
                  </div>
                );
              }} />
              {ds19pr.map((d,i) => (
                <Clave de dispersión={i} datos={[d]} relleno={dt==="PRIVADO"?C.priv:C.ds19}
                  forma={({ cx, cy }) => (
                    <g>
                      <circle cx={cx} cy={cy} r={9} fill={dt==="PRIVADO"?C.priv:C.ds19} fillOpacity={0.85} />
                      <texto x={cx+13} y={cy+4} tamaño de fuente={11} relleno={C.texto} peso de fuente={600}>{dn}</texto>
                    </g>
                  )} />
              ))}
            Gráfico de dispersión
          </ContenedorResponsivo>
          <Nota>
            💡 <b style={{color:C.red}}>CQ</b> (1.877 UF/viv · 27.0 UF/m²) sigue siendo el valor atípico en ambos ejes con _PO.
            <b style={{color:C.priv}}> PB</b> lidera en m² (28.4) pero terminó bajo presupuesto.
          </Nota>
        </Tarjeta>

        {/* RADAR */}
        <Tarjeta>
          <Section title="Perfil Proporcional por Etapa (% del total)"
            sugerencia="Qué peso relativo tiene cada etapa en el costo total PO" />
          <Contenedor responsivo ancho="100%" alto={260}>
            <Datos del gráfico de radar={etapa.map(d => {
              const t49 = etapa.reduce((s,e)=>s+e.d49tot,0);
              const t19pr = etapa.reduce((s,e)=>s+e.d19tot,0);
              devolver { ...d, p49:+(d.d49tot/t49*100).toFixed(1), p19:+(d.d19tot/t19pr*100).toFixed(1) };
            })} cx="50%" cy="50%" radio exterior={90}>
              <Trazo de PolarGrid={C.grid} />
              <PolarAngleAxis dataKey="e" tick={{ fontSize:10, fill:C.dim }} />
              <PolarRadiusAxis ángulo={90} dominio={[0,35]} marca={{ fontSize:8, fill:C.dim }} />
              <Radar name="DS49" dataKey="p49" stroke={C.ds49} fill={C.ds49} fillOpacity={0.18} strokeWidth={2} />
              <Radar name="DS19+Priv" dataKey="p19" stroke={C.ds19} fill={C.ds19} fillOpacity={0.18} strokeWidth={2} />
            Gráfico de radar
          </ContenedorResponsivo>
          <Leyenda2 elementos={[{color:C.ds49,etiqueta:"DS49"},{color:C.ds19,etiqueta:"DS19+Priv"}]} />
          <Nota>
            💡 <b style={{color:C.ds49}}>DS49</b>: Obra Gruesa (31%) + GG Obra (26%) + Terminaciones (17%) = 74% del total.
            <b style={{color:C.ds19}}> DS19+Priv</b>: Terminaciones lidera (27%) · GG Obra (24%) · Obra Gruesa (26%).
          </Nota>
        </Tarjeta>
      </div>

      {/* ── TABLA RESUMEN ── */}
      <Tarjeta>
        <Section title="Tabla Resumen — Todos los Proyectos (Proyección Obra _PO)"
          sugerencia="Costo Total incluye GG Empresa_PO + IVA_PO · Hoja Obras cols hasta T" />
        <div style={{ overflowX:"auto" }}>
          <estilo de tabla={{ ancho:"100%", bordeCollapse:"colapsar", tamaño de fuente:11 }}>
            <cabeza>
              <tr style={{borde inferior:`2px sólido ${C.border}`}>
                {["Proyecto","Tipo","Viv","Presup. Total","PO C.Directo","PO Total","GG_PO","IVA_PO","Desv.%","Desv. UF/viv","PO UF/m²"].map(h=>(
                  <th key={h} style={{ relleno:"7px 10px", alineación del texto:"izquierda", tamaño de fuente:9, peso de fuente:700,
                    Espaciado entre letras: "0.06em", color: C.dim, transformación de texto: "mayúsculas", espacio en blanco: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </cabeza>
            <cuerpo>
              {[...obras].sort((a,b)=>atlocaleCompare(bt)||a.po-b.po).map((row,i)=>(
                <tr clave={i} estilo={{ bordeInferior:`1px sólido ${C.border}20`, fondo:i%2===0?"transparente":"#ffffff03" }}>
                  <td style={{padding:"7px 10px", fontWeight:700, color:C.text }}>{fila.n}</td>
                  <td style={{ relleno:"7px 10px" }}>
                    <span style={{ relleno: "2px 8px", radio del borde: 4, tamaño de fuente: 9, peso de fuente: 700,
                      fondo:fila.t==="DS49"?`${C.ds49}22`:fila.t==="DS19"?`${C.ds19}22`:`${C.priv}22`,
                      color: fila.t==="DS49"?C.ds49 :fila.t==="DS19"?C.ds19 :C.priv }}>
                      {fila.t}
                    </span>
                  </td>
                  <td style={{ relleno:"7px 10px", color:C.dim, fontFamily:"monospace" }}>{fila.viv}</td>
                  <td style={{padding:"7px 10px", fontFamily:"monospace", color:C.dim }}>{f1(row.ppto)}</td>
                  <td style={{padding:"7px 10px", fontFamily:"monospace", color:`${row.t==="DS49"?C.ds49:C.ds19}aa` }}>{f1(row.cd)}</td>
                  <td style={{ relleno: "7px 10px", familia de fuentes: "monoespaciado", peso de fuente: 700,
                    color:fila.t==="DS49"?C.ds49:fila.t==="DS19"?C.ds19:C.priv }}>{f1(fila.po)}</td>
                  <td style={{ padding:"7px 10px", fontFamily:"monospace", color:"#A78BFA" }}>{row.gg}%</td>
                  <td style={{ padding:"7px 10px", fontFamily:"monospace", color:"#60A5FA" }}>{row.iva}%</td>
                  <td style={{ relleno: "7px 10px", familia de fuentes: "monoespaciado", peso de fuente: 700,
                    color:fila.dpct>15?C.rojo:fila.dpct>5?`${C.rojo}bb`:fila.dpct<0?C.verde:C.dim }}>
                    {fila.dpct>=0?"+":""}{f1(fila.dpct)}%
                  </td>
                  <td style={{ relleno:"7px 10px", fontFamily:"monospace", color:row.dabs>=0?C.red:C.green }}>
                    {fila.dabs>=0?"+":""}{f1(fila.dabs)}
                  </td>
                  <td style={{ relleno: "7px 10px", familia de fuentes: "monoespaciado", color: C.dim }}>
                    {fila.pm2o? f2(fila.pm2o): "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </tabla>
        </div>
      </Tarjeta>

      {/* PIE DE PÁGINA */}
      <div style={{fontSize:10, color:C.dim, textAlign:"center", paddingTop:14, marginTop:12,
        borde superior:`1px sólido ${C.border}` }}>
        Fuente: Hoja Obras (cols A–T, Costo_Total_PO) + Resumen_IC_VIV · dic 2025 ·
        Costo Total PO = CD_PO × (1+GG_PO) × (1+IVA_PO) ·
        DS49: GG 11.8% · DS19/Privado: GG 5% · IVA varía por proyecto ·
        Excluidos: PLV206, CLF63, MDP67, TB68
      </div>
    </div>
  );
}