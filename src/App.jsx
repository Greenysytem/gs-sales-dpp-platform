 "import { useState, useMemo, useCallback } from "react";
import {
  BarChart3, Users, Package, ShieldCheck, QrCode, TrendingUp,
  Plus, Search, ChevronRight, ArrowLeft, Edit3, Trash2, Eye,
  CheckCircle2, AlertTriangle, Clock, Globe, Building2, Store,
  Tag, DollarSign, Percent, RotateCcw, FileText, Mail, Phone,
  Filter, Download, ArrowUpRight, ArrowDownRight, Minus,
  Star, Box, Truck, Shield, X, Check, ChevronDown
} from "lucide-react";

// ============================================================
// MOCK DATA
// ============================================================

const CATEGORIES = [
  { id: "cat-1", code: "ICT-LAPTOP", name: "ë¸í¸ë¶", icon: "ð»" },
  { id: "cat-2", code: "ICT-DESKTOP", name: "ë°ì¤í¬í", icon: "ð¥ï¸" },
  { id: "cat-3", code: "ICT-SERVER", name: "ìë²", icon: "ðï¸" },
  { id: "cat-4", code: "ICT-HDD", name: "HDD/SSD", icon: "ð¾" },
  { id: "cat-5", code: "ICT-NETWORK", name: "ë¤í¸ìí¬ì¥ë¹", icon: "ð" },
  { id: "cat-6", code: "ICT-MOBILE", name: "ëª¨ë°ì¼", icon: "ð±" },
  { id: "cat-7", code: "ICT-MONITOR", name: "ëª¨ëí°", icon: "ð¥ï¸" },
  { id: "cat-8", code: "ICT-PRINTER", name: "íë¦°í°/ë³µí©ê¸°", icon: "ð¨ï¸" },
];

const GRADES = [
  { code: "A", label: "ìµì", color: "#188038", bgColor: "#e6f4ea", factor: 1.0, marginTarget: 45 },
  { code: "B", label: "ì", color: "#1a73e8", bgColor: "#e8f0fe", factor: 0.75, marginTarget: 35 },
  { code: "C", label: "ì¤", color: "#f9ab00", bgColor: "#fef7e0", factor: 0.5, marginTarget: 25 },
  { code: "D", label: "í", color: "#e37400", bgColor: "#fce8e6", factor: 0.3, marginTarget: 15 },
  { code: "F", label: "íê¸°/ë¶í", color: "#d93025", bgColor: "#fce8e6", factor: 0.1, marginTarget: 5 },
];

const CHANNELS = [
  { id: "ch-1", code: "RETAIL", name: "ìë§¤ (ë¦¬í¼ë¹ì)", icon: Store, color: "#1a73e8" },
  { id: "ch-2", code: "WHOLESALE", name: "ëë§¤ (B2B)", icon: Building2, color: "#188038" },
  { id: "ch-3", code: "EXPORT", name: "ìì¶", icon: Globe, color: "#8430ce" },
];

const MOCK_CUSTOMERS = [
  { id: "org-1", name: "íí¬ë¦¬ì¬ì´í´ ì½ë¦¬ì", type: "CUSTOMER", channel: "WHOLESALE", country: "KR", regNo: "123-45-67890", contact: "ê¹ìì", email: "ys.kim@techrecycle.kr", phone: "02-1234-5678", totalOrders: 28, totalRevenue: 245000000 },
  { id: "org-2", name: "GreenIT Solutions GmbH", type: "CUSTOMER", channel: "EXPORT", country: "DE", regNo: "DE-987654321", contact: "Hans Mueller", email: "h.mueller@greenit.de", phone: "+49-30-1234567", totalOrders: 12, totalRevenue: 180000000 },
  { id: "org-3", name: "ë¦¬í¼ëª°", type: "CUSTOMER", channel: "RETAIL", country: "KR", regNo: "456-78-90123", contact: "ë°ì§ì", email: "jy.park@refurmall.co.kr", phone: "031-987-6543", totalOrders: 45, totalRevenue: 89000000 },
  { id: "org-4", name: "Asia Recycling Pte Ltd", type: "CUSTOMER", channel: "EXPORT", country: "SG", regNo: "SG-202312345", contact: "Lim Wei", email: "w.lim@asiarecycling.sg", phone: "+65-6789-0123", totalOrders: 8, totalRevenue: 320000000 },
  { id: "org-5", name: "ì¤ê³ ëë¼ íí¸ëì¤", type: "CUSTOMER", channel: "RETAIL", country: "KR", regNo: "789-01-23456", contact: "ì´ë¯¼í¸", email: "mh.lee@jnpartners.kr", phone: "010-9876-5432", totalOrders: 67, totalRevenue: 56000000 },
];

const MOCK_LEADS = [
  { id: "lead-1", orgId: "org-1", company: "íí¬ë¦¬ì¬ì´í´ ì½ë¦¬ì", contact: "ê¹ìì", status: "PROPOSAL", channel: "WHOLESALE", category: "ë¸í¸ë¶", value: 45000000, qty: 200, nextAction: "ê²¬ì ì ë°ì¡", nextDate: "2026-04-12", assignee: "ì¥ì¬í" },
  { id: "lead-2", orgId: "org-2", company: "GreenIT Solutions GmbH", contact: "Hans Mueller", status: "NEGOTIATION", channel: "EXPORT", category: "ìë²", value: 120000000, qty: 50, nextAction: "ê°ê²© íì ë¯¸í", nextDate: "2026-04-15", assignee: "ì¥ì¬í" },
  { id: "lead-3", orgId: "org-3", company: "ë¦¬í¼ëª°", contact: "ë°ì§ì", status: "QUALIFIED", channel: "RETAIL", category: "ë¸í¸ë¶", value: 12000000, qty: 30, nextAction: "ì í ìí ë°°ì¡", nextDate: "2026-04-10", assignee: "ê¹ë¯¼ì" },
  { id: "lead-4", orgId: "org-4", company: "Asia Recycling Pte Ltd", contact: "Lim Wei", status: "NEW", channel: "EXPORT", category: "HDD/SSD", value: 85000000, qty: 5000, nextAction: "ì´ê¸° ë¯¸í ì¤ì ", nextDate: "2026-04-20", assignee: "ì¥ì¬í" },
  { id: "lead-5", orgId: "org-5", company: "ì¤ê³ ëë¼ íí¸ëì¤", contact: "ì´ë¯¼í¸", status: "WON", channel: "RETAIL", category: "ëª¨ë°ì¼", value: 8000000, qty: 40, nextAction: "ì£¼ë¬¸ì ìì±", nextDate: "2026-04-08", assignee: "ê¹ë¯¼ì" },
];

const MOCK_ASSETS = [
  { id: "ast-1", product: "Dell Latitude 5520", category: "ë¸í¸ë¶", serial: "DL5520-KR-001", lot: "LOT-2026-04-001", grade: "A", status: "READY_FOR_SALE", cost: 180000, location: "GS-A-ST-R01-L2", dpp: true },
  { id: "ast-2", product: "HP ProBook 450 G8", category: "ë¸í¸ë¶", serial: "HP450-KR-012", lot: "LOT-2026-04-001", grade: "B", status: "READY_FOR_SALE", cost: 150000, location: "GS-A-ST-R01-L3", dpp: true },
  { id: "ast-3", product: "Lenovo ThinkPad T14", category: "ë¸í¸ë¶", serial: "LT14-KR-088", lot: "LOT-2026-04-002", grade: "A", status: "GRADED", cost: 200000, location: "GS-A-ST-R02-L1", dpp: false },
  { id: "ast-4", product: "Dell PowerEdge R740", category: "ìë²", serial: "PE740-KR-005", lot: "LOT-2026-03-015", grade: "B", status: "DATA_WIPING", cost: 450000, location: "GS-B-SV-R01-L1", dpp: false },
  { id: "ast-5", product: "Seagate Exos X18 18TB", category: "HDD/SSD", serial: "SG-X18-00234", lot: "LOT-2026-04-003", grade: "C", status: "READY_FOR_SALE", cost: 35000, location: "GS-A-HD-R01-L4", dpp: true },
  { id: "ast-6", product: "Samsung Galaxy S22", category: "ëª¨ë°ì¼", serial: "SGS22-KR-045", lot: "LOT-2026-04-004", grade: "A", status: "READY_FOR_SALE", cost: 120000, location: "GS-A-MB-R01-L1", dpp: true },
  { id: "ast-7", product: "Cisco Catalyst 9300", category: "ë¤í¸ìí¬ì¥ë¹", serial: "CC9300-KR-003", lot: "LOT-2026-03-020", grade: "D", status: "RECYCLING", cost: 80000, location: "GS-B-RC-R01-L1", dpp: true },
  { id: "ast-8", product: "Dell U2722D ëª¨ëí°", category: "ëª¨ëí°", serial: "DU27-KR-019", lot: "LOT-2026-04-002", grade: "B", status: "READY_FOR_SALE", cost: 65000, location: "GS-A-MN-R01-L2", dpp: false },
];

const MOCK_ORDERS = [
  { id: "ord-1", number: "GS-SO-20260408-001", channel: "WHOLESALE", customer: "íí¬ë¦¬ì¬ì´í´ ì½ë¦¬ì", status: "CONFIRMED", date: "2026-04-08", items: 200, total: 52000000, margin: 22, currency: "KRW" },
  { id: "ord-2", number: "GS-SO-20260407-003", channel: "EXPORT", customer: "GreenIT Solutions GmbH", status: "SHIPPED", date: "2026-04-07", items: 50, total: 95000, margin: 35, currency: "EUR", country: "DE" },
  { id: "ord-3", number: "GS-SO-20260406-002", channel: "RETAIL", customer: "ë¦¬í¼ëª°", status: "DELIVERED", date: "2026-04-06", items: 15, total: 4500000, margin: 42, currency: "KRW" },
  { id: "ord-4", number: "GS-SO-20260405-001", channel: "EXPORT", customer: "Asia Recycling Pte Ltd", status: "PROCESSING", date: "2026-04-05", items: 3000, total: 125000, margin: 28, currency: "USD", country: "SG" },
  { id: "ord-5", number: "GS-SO-20260404-004", channel: "RETAIL", customer: "ì¤ê³ ëë¼ íí¸ëì¤", status: "COMPLETED", date: "2026-04-04", items: 8, total: 2400000, margin: 48, currency: "KRW" },
];

const STATUS_COLORS = {
  NEW: { bg: "#e8f0fe", text: "#1a73e8" }, CONTACTED: { bg: "#e8f0fe", text: "#1a73e8" },
  QUALIFIED: { bg: "#fef7e0", text: "#f9ab00" }, PROPOSAL: { bg: "#fef7e0", text: "#e37400" },
  NEGOTIATION: { bg: "#f3e8fd", text: "#8430ce" }, WON: { bg: "#e6f4ea", text: "#188038" },
  LOST: { bg: "#fce8e6", text: "#d93025" }, DRAFT: { bg: "#f1f3f4", text: "#5f6368" },
  CONFIRMED: { bg: "#e8f0fe", text: "#1a73e8" }, PROCESSING: { bg: "#fef7e0", text: "#e37400" },
  SHIPPED: { bg: "#f3e8fd", text: "#8430ce" }, DELIVERED: { bg: "#e6f4ea", text: "#188038" },
  COMPLETED: { bg: "#e6f4ea", text: "#188038" }, CANCELLED: { bg: "#fce8e6", text: "#d93025" },
  RECEIVED: { bg: "#f1f3f4", text: "#5f6368" }, INSPECTING: { bg: "#e8f0fe", text: "#1a73e8" },
  GRADED: { bg: "#fef7e0", text: "#e37400" }, DATA_WIPING: { bg: "#fef7e0", text: "#f9ab00" },
  READY_FOR_SALE: { bg: "#e6f4ea", text: "#188038" }, RESERVED: { bg: "#f3e8fd", text: "#8430ce" },
  SOLD: { bg: "#e6f4ea", text: "#188038" }, RECYCLING: { bg: "#fce8e6", text: "#d93025" },
  DISPOSED: { bg: "#fce8e6", text: "#d93025" }, RETURNED: { bg: "#fce8e6", text: "#d93025" },
};

const STATUS_LABELS = {
  NEW: "ì ê·", CONTACTED: "ì ì´", QUALIFIED: "ê²ì¦", PROPOSAL: "ì ì",
  NEGOTIATION: "íì", WON: "ìì£¼", LOST: "ì¤ì£¼", DRAFT: "ì´ì",
  CONFIRMED: "íì ", PROCESSING: "ì²ë¦¬ì¤", SHIPPED: "ì¶í", DELIVERED: "ë°°ì¡ìë£",
  COMPLETED: "ìë£", CANCELLED: "ì·¨ì", RECEIVED: "ìê³ ", INSPECTING: "ê²ìì¤",
  GRADED: "ë±ê¸íì ", DATA_WIPING: "ë°ì´í°ì­ì ì¤", READY_FOR_SALE: "íë§¤ê°ë¥",
  RESERVED: "ìì½", SOLD: "íë§¤ìë£", RECYCLING: "ì¬íì©", DISPOSED: "íê¸°",
  RETURNED: "ë°í",
};

// ============================================================
// UTILITY COMPONENTS
// ============================================================

const Badge = ({ status, children }) => {
  const sc = STATUS_COLORS[status] || { bg: "#f1f3f4", text: "#5f6368" };
  return (
    <span style={{ background: sc.bg, color: sc.text, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {children || STATUS_LABELS[status] || status}
    </span>
  );
};

const GradeBadge = ({ gradeCode }) => {
  const g = GRADES.find(x => x.code === gradeCode);
  if (!g) return null;
  return (
    <span style={{ background: g.bgColor, color: g.color, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700, border: `1px solid ${g.color}30` }}>
      {g.code} ({g.label})
    </span>
  );
};

const ChannelBadge = ({ channelCode }) => {
  const ch = CHANNELS.find(x => x.code === channelCode);
  if (!ch) return <span>{channelCode}</span>;
  const Icon = ch.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: `${ch.color}12`, color: ch.color, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
      <Icon size={12} /> {ch.name}
    </span>
  );
};

const Card = ({ children, style, onClick, hover }) => (
  <div onClick={onClick} style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0",
    padding: 20, cursor: onClick ? "pointer" : "default",
    transition: "all 0.15s", ...(hover && onClick ? {} : {}), ...style
  }}>
    {children}
  </div>
);

const KPICard = ({ title, value, sub, icon: Icon, color, trend, trendValue }) => (
  <Card style={{ flex: 1, minWidth: 180 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: "#5f6368", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#202124" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>{sub}</div>}
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 4, fontSize: 12, color: trend === "up" ? "#188038" : trend === "down" ? "#d93025" : "#5f6368" }}>
            {trend === "up" ? <ArrowUpRight size={14} /> : trend === "down" ? <ArrowDownRight size={14} /> : <Minus size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
    </div>
  </Card>
);

const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #e0e0e0" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "#f8f9fa" }}>
          {columns.map((col, i) => (
            <th key={i} style={{ padding: "10px 12px", textAlign: col.align || "left", fontWeight: 600, color: "#5f6368", borderBottom: "2px solid #e0e0e0", whiteSpace: "nowrap" }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, ri) => (
          <tr key={ri} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? "pointer" : "default", borderBottom: "1px solid #f1f3f4" }}
              onMouseEnter={e => { if(onRowClick) e.currentTarget.style.background = "#f8f9fa"; }}
              onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
            {columns.map((col, ci) => (
              <td key={ci} style={{ padding: "10px 12px", textAlign: col.align || "left", whiteSpace: col.nowrap ? "nowrap" : "normal" }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && (
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: "center", color: "#9aa0a6" }}>ë°ì´í°ê° ììµëë¤</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
    <Search size={16} color="#9aa0a6" style={{ position: "absolute", left: 12, top: 10 }} />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "ê²ì..."}
      style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13, outline: "none", background: "#f8f9fa", boxSizing: "border-box" }}
    />
  </div>
);

const Btn = ({ children, onClick, variant = "default", size = "md", icon: Icon, style: st }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, transition: "all 0.15s", whiteSpace: "nowrap" };
  const sizes = { sm: { padding: "5px 10px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "10px 20px", fontSize: 14 } };
  const variants = {
    primary: { background: "#1a73e8", color: "#fff" },
    success: { background: "#188038", color: "#fff" },
    danger: { background: "#d93025", color: "#fff" },
    default: { background: "#f1f3f4", color: "#5f6368" },
    outline: { background: "transparent", color: "#1a73e8", border: "1px solid #1a73e8" },
    ghost: { background: "transparent", color: "#5f6368" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...st }}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

const formatKRW = (n) => {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}ìµ`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}ë§`;
  return n?.toLocaleString();
};

const ProgressBar = ({ value, max, color }) => (
  <div style={{ width: "100%", height: 6, background: "#f1f3f4", borderRadius: 3, overflow: "hidden" }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", background: color || "#1a73e8", borderRadius: 3, transition: "width 0.3s" }} />
  </div>
);

// ============================================================
// NAV ITEMS
// ============================================================

const NAV_ITEMS = [
  { id: "dashboard", label: "ëìë³´ë", icon: BarChart3 },
  { id: "crm", label: "CRM/ìì", icon: Users },
  { id: "sales", label: "íë§¤ê´ë¦¬", icon: DollarSign },
  { id: "inventory", label: "ì¬ê³ /ë±ê¸", icon: Package },
  { id: "dpp", label: "DPP ì¬ê¶", icon: QrCode },
  { id: "compliance", label: "ì»´íë¼ì´ì¸ì¤", icon: ShieldCheck },
];

// ============================================================
// DASHBOARD PAGE
// ============================================================

const DashboardPage = ({ setPage }) => {
  const pipelineData = [
    { stage: "ì ê·", count: 12, value: 280000000, color: "#e8f0fe" },
    { stage: "ê²ì¦", count: 8, value: 195000000, color: "#fef7e0" },
    { stage: "ì ì", count: 5, value: 320000000, color: "#f3e8fd" },
    { stage: "íì", count: 3, value: 180000000, color: "#fce8e6" },
    { stage: "ìì£¼", count: 7, value: 410000000, color: "#e6f4ea" },
  ];
  const maxPipeline = Math.max(...pipelineData.map(d => d.value));

  const channelPerf = [
    { channel: "ìë§¤", revenue: 89000000, margin: 42, orders: 112, turnover: 2.8 },
    { channel: "ëë§¤", revenue: 245000000, margin: 24, orders: 28, turnover: 4.2 },
    { channel: "ìì¶", revenue: 500000000, margin: 31, orders: 20, turnover: 3.5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>ëìë³´ë</h2>
          <div style={{ color: "#5f6368", fontSize: 13, marginTop: 2 }}>2026ë 4ì ì¤ìê° íí©</div>
        </div>
        <Btn variant="outline" icon={Download}>ë¦¬í¨í¸ ë¤ì´ë¡ë</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="ì´ë² ë¬ ë§¤ì¶" value="8.34ìµ" sub="ëª©í 10ìµ ëë¹ 83%" icon={DollarSign} color="#1a73e8" trend="up" trendValue="+12.5% vs ì ì" />
        <KPICard title="íê·  ë§ì§ì¨" value="31.2%" sub="ì±ë ê°ì¤ íê· " icon={Percent} color="#188038" trend="up" trendValue="+2.1%p" />
        <KPICard title="íë§¤ ê°ë¥ ì¬ê³ " value="1,247" sub="ë±ê¸ íì  ìë£" icon={Package} color="#f9ab00" trend="down" trendValue="-8.3% (íë§¤ í¸ì¡°)" />
        <KPICard title="ì¬ê³  íì ì¨" value="3.5x" sub="ìê° ê¸°ì¤" icon={RotateCcw} color="#8430ce" trend="up" trendValue="+0.3x" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card style={{ flex: 2, minWidth: 360 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>ìì íì´íë¼ì¸</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pipelineData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, fontSize: 12, color: "#5f6368", textAlign: "right" }}>{d.stage}</div>
                <div style={{ flex: 1, height: 28, background: "#f8f9fa", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${(d.value / maxPipeline) * 100}%`, height: "100%", background: d.color, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#202124" }}>{d.count}ê±´ Â· {formatKRW(d.value)}ì</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ flex: 1.2, minWidth: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>ì±ëë³ ì±ê³¼</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {channelPerf.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.channel}</span>
                  <span style={{ fontSize: 13, color: "#5f6368" }}>{formatKRW(c.revenue)}ì</span>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#5f6368", marginBottom: 4 }}>
                  <span>ë§ì§ {c.margin}%</span>
                  <span>ì£¼ë¬¸ {c.orders}ê±´</span>
                  <span>íì ì¨ {c.turnover}x</span>
                </div>
                <ProgressBar value={c.revenue} max={500000000} color={CHANNELS[i]?.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>ë±ê¸ë³ ì¬ê³  ë¶í¬</span>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>ìì¸ë³´ê¸° â</Btn>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { grade: "A", qty: 312, pct: 25 },
              { grade: "B", qty: 425, pct: 34 },
              { grade: "C", qty: 287, pct: 23 },
              { grade: "D", qty: 148, pct: 12 },
              { grade: "F", qty: 75, pct: 6 },
            ].map((d, i) => {
              const g = GRADES[i];
              return (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: 10, background: g.bgColor, borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: g.color }}>{d.grade}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{d.qty}</div>
                  <div style={{ fontSize: 11, color: "#5f6368" }}>{d.pct}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>ê¸´ê¸ ìë¦¼</span>
            <Badge status="PROCESSING">5ê±´</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: AlertTriangle, color: "#d93025", text: "R2 ì¸ì¦ ë§ë£ D-15 (2026-04-24)", type: "ì¸ì¦" },
              { icon: Clock, color: "#e37400", text: "ë°ì´í°ì­ì  ëê¸° ìì° 23ê±´", type: "ë³´ì" },
              { icon: Truck, color: "#1a73e8", text: "GreenIT GmbH ìì¶ ê±´ ì ì  ìì  (04/11)", type: "ìì¶" },
              { icon: Shield, color: "#8430ce", text: "ìì¶ê·ì  ê²í  íì 3ê±´ (ì±ê°í¬ë¥´)", type: "ê·ì " },
              { icon: Star, color: "#f9ab00", text: "Aë±ê¸ ë¸í¸ë¶ ì¬ê³  ë¶ì¡± (ëª©í ëë¹ 60%)", type: "ì¬ê³ " },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#f8f9fa", borderRadius: 6 }}>
                <a.icon size={16} color={a.color} />
                <span style={{ fontSize: 12, flex: 1 }}>{a.text}</span>
                <span style={{ fontSize: 10, color: "#9aa0a6", background: "#f1f3f4", padding: "2px 6px", borderRadius: 4 }}>{a.type}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// CRM PAGE
// ============================================================

const CRMPage = () => {
  const [tab, setTab] = useState("pipeline");
  const [search, setSearch] = useState("");

  const filteredLeads = MOCK_LEADS.filter(l =>
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.contact.toLowerCase().includes(search.toLowerCase())
  );

  const pipeline = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"];
  const pipelineLabels = { NEW: "ì ê·", CONTACTED: "ì ì´", QUALIFIED: "ê²ì¦", PROPOSAL: "ì ì", NEGOTIATION: "íì", WON: "ìì£¼" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>CRM / ììê´ë¦¬</h2>
        <Btn variant="primary" icon={Plus}>ì ê· ë¦¬ë ë±ë¡</Btn>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["pipeline", "íì´íë¼ì¸"], ["customers", "ê³ ê°ì¬"], ["activities", "íëë´ì­"]].map(([key, label]) => (
          <Btn key={key} variant={tab === key ? "primary" : "default"} size="sm" onClick={() => setTab(key)}>{label}</Btn>
        ))}
      </div>

      {tab === "pipeline" && (
        <>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {pipeline.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.status === stage);
              const sc = STATUS_COLORS[stage];
              return (
                <div key={stage} style={{ minWidth: 220, flex: 1, background: "#f8f9fa", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{pipelineLabels[stage]}</span>
                    <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "1px 8px", borderRadius: 10, fontWeight: 600 }}>{stageLeads.length}</span>
                  </div>
                  {stageLeads.map(lead => (
                    <Card key={lead.id} style={{ padding: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{lead.company}</div>
                      <div style={{ fontSize: 11, color: "#5f6368", marginBottom: 6 }}>{lead.contact} Â· {lead.category}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <ChannelBadge channelCode={lead.channel} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#188038" }}>{formatKRW(lead.value)}ì</span>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 11, color: "#5f6368", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} /> {lead.nextDate} Â· {lead.nextAction}
                      </div>
                    </Card>
                  ))}
                  {stageLeads.length === 0 && <div style={{ textAlign: "center", color: "#9aa0a6", fontSize: 12, padding: 20 }}>ìì</div>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="ê³ ê°ì¬/ë´ë¹ì ê²ì..." />
          </div>
        </>
      )}

      {tab === "customers" && (
        <Table
          columns={[
            { label: "ê³ ê°ì¬", key: "name", render: r => <div><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.regNo}</div></div> },
            { label: "ì í", render: r => <ChannelBadge channelCode={r.channel} />, nowrap: true },
            { label: "êµ­ê°", key: "country", nowrap: true },
            { label: "ë´ë¹ì", render: r => <div><div>{r.contact}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.email}</div></div> },
            { label: "ì£¼ë¬¸", key: "totalOrders", align: "right", nowrap: true },
            { label: "ëì ë§¤ì¶", render: r => <span style={{ fontWeight: 600 }}>{formatKRW(r.totalRevenue)}ì</span>, align: "right", nowrap: true },
          ]}
          data={MOCK_CUSTOMERS}
        />
      )}

      {tab === "activities" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { type: "CALL", icon: Phone, time: "ì¤ë 14:30", target: "íí¬ë¦¬ì¬ì´í´ ì½ë¦¬ì Â· ê¹ìì", desc: "LOT-2026-04-001 ë¸í¸ë¶ 200ë ê²¬ì  ë¼ì. Bë±ê¸ ë¨ê° ì¡°ì  ìì²­ (260,000â240,000)", assignee: "ì¥ì¬í" },
            { type: "EMAIL", icon: Mail, time: "ì¤ë 11:00", target: "GreenIT Solutions GmbH Â· Hans Mueller", desc: "ìë² 50ë ìì¶ ê³ì½ì ì´ì ë°ì¡. Incoterms FOB Incheon íì¸", assignee: "ì¥ì¬í" },
            { type: "MEETING", icon: Users, time: "ì´ì  16:00", target: "ë¦¬í¼ëª° Â· ë°ì§ì", desc: "Aë±ê¸ ë¸í¸ë¶ ìí 3ë ì ë¬. ë¦¬í¼ë¹ì í¸ì§ ê¸°ì¤ í©ì", assignee: "ê¹ë¯¼ì" },
            { type: "NOTE", icon: FileText, time: "04/07", target: "Asia Recycling Pte Ltd", desc: "ì±ê°í¬ë¥´ ìì¶ê·ì  íì¸ íì. Dual-use íëª© í¬í¨ ì¬ë¶ ê°í  ì¤", assignee: "ì¥ì¬í" },
          ].map((a, i) => (
            <Card key={i} style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f3f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <a.icon size={16} color="#5f6368" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.target}</span>
                  <span style={{ fontSize: 11, color: "#9aa0a6" }}>{a.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: "#9aa0a6", marginTop: 4 }}>ë´ë¹: {a.assignee}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// SALES PAGE
// ============================================================

const SalesPage = () => {
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = channelFilter === "ALL" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.channel === channelFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>íë§¤ê´ë¦¬</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={FileText}>ê²¬ì ì ìì±</Btn>
          <Btn variant="primary" icon={Plus}>ì ê· ì£¼ë¬¸</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn variant={channelFilter === "ALL" ? "primary" : "default"} size="sm" onClick={() => setChannelFilter("ALL")}>ì ì²´</Btn>
        {CHANNELS.map(ch => (
          <Btn key={ch.code} variant={channelFilter === ch.code ? "primary" : "default"} size="sm" onClick={() => setChannelFilter(ch.code)}>
            {ch.name}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="ì´ë² ë¬ ì£¼ë¬¸" value={`${filtered.length}ê±´`} icon={FileText} color="#1a73e8" />
        <KPICard title="ì´ ë§¤ì¶" value={channelFilter === "ALL" ? "8.34ìµ" : formatKRW(filtered.reduce((s, o) => s + (o.currency === "KRW" ? o.total : o.total * 1350), 0)) + "ì"} icon={DollarSign} color="#188038" />
        <KPICard title="íê·  ë§ì§" value={`${(filtered.reduce((s, o) => s + o.margin, 0) / Math.max(filtered.length, 1)).toFixed(1)}%`} icon={Percent} color="#f9ab00" />
      </div>

      {selectedOrder ? (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedOrder(null)}>ëª©ë¡ì¼ë¡</Btn>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" icon={Edit3}>ìì </Btn>
              <Btn variant="success" icon={Truck}>ì¶íì²ë¦¬</Btn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ì£¼ë¬¸ë²í¸</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedOrder.number}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ê³ ê°ì¬</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedOrder.customer}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ì±ë</div>
              <ChannelBadge channelCode={selectedOrder.channel} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ìí</div>
              <Badge status={selectedOrder.status} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ê¸ì¡</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#188038" }}>
                {selectedOrder.currency === "KRW" ? formatKRW(selectedOrder.total) + "ì" : `${selectedOrder.currency} ${selectedOrder.total.toLocaleString()}`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>ë§ì§ì¨</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: selectedOrder.margin >= 30 ? "#188038" : "#e37400" }}>{selectedOrder.margin}%</div>
            </div>
          </div>
          {selectedOrder.channel === "EXPORT" && selectedOrder.country && (
            <div style={{ marginTop: 16, padding: 12, background: "#f3e8fd", borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#8430ce", marginBottom: 4 }}>ìì¶ ì ë³´</div>
              <div style={{ fontSize: 12, color: "#5f6368" }}>ëìêµ­: {selectedOrder.country} Â· Incoterms: FOB Â· ìì¶ê·ì  ê²í°: ìë£</div>
            </div>
          )}
        </Card>
      ) : (
        <Table
          columns={[
            { label: "ì£¼ë¬¸ë²í¸", render: r => <span style={{ fontWeight: 600, color: "#1a73e8" }}>{r.number}</span>, nowrap: true },
            { label: "ì±ë", render: r => <ChannelBadge channelCode={r.channel} />, nowrap: true },
            { label: "ê³ ê°ì¬", key: "customer" },
            { label: "ìí", render: r => <Badge status={r.status} />, nowrap: true },
            { label: "ìë", key: "items", align: "right", nowrap: true, render: r => `${r.items}ê±´` },
            { label: "ê¸ì¡", align: "right", nowrap: true, render: r => (
              <span style={{ fontWeight: 600 }}>
                {r.currency === "KRW" ? formatKRW(r.total) + "ì" : `${r.currency} ${r.total.toLocaleString()}`}
              </span>
            )},
            { label: "ë§ì§", align: "right", nowrap: true, render: r => (
              <span style={{ color: r.margin >= 30 ? "#188038" : r.margin >= 20 ? "#e37400" : "#d93025", fontWeight: 600 }}>{r.margin}%</span>
            )},
            { label: "ì¼ì", key: "date", nowrap: true },
          ]}
          data={filtered}
          onRowClick={setSelectedOrder}
        />
      )}
    </div>
  );
};

// ============================================================
// INVENTORY & GRADE PAGE
// ============================================================

const InventoryPage = () => {
  const [view, setView] = useState("assets");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredAssets = MOCK_ASSETS.filter(a => {
    if (gradeFilter !== "ALL" && a.grade !== gradeFilter) return false;
    if (search && !a.product.toLowerCase().includes(search.toLowerCase()) && !a.serial.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const gradeMatrix = CATEGORIES.slice(0, 6).map(cat => {
    const catAssets = MOCK_ASSETS.filter(a => a.category === cat.name);
    return {
      category: cat.name,
      icon: cat.icon,
      grades: GRADES.map(g => ({
        ...g,
        count: catAssets.filter(a => a.grade === g.code).length,
        sellPrice: Math.round(350000 * g.factor),
        margin: g.marginTarget,
      })),
      total: catAssets.length,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>ì¬ê³  / ë±ê¸ê´ë¦¬</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={Tag}>ë±ê¸ ê¸°ì¤ ì¤ì </Btn>
          <Btn variant="primary" icon={Plus}>ìì° ìê³ </Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["assets", "ìì° ëª©ë¡"], ["gradeMatrix", "ë±ê¸ ë§¤í¸ë¦­ì¤"], ["turnover", "íì ì¨ ë¶ì"]].map(([key, label]) => (
          <Btn key={key} variant={view === key ? "primary" : "default"} size="sm" onClick={() => setView(key)}>{label}</Btn>
        ))}
      </div>

      {view === "assets" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="ì íëª/ìë¦¬ì¼ ê²ì..." />
            <Btn variant={gradeFilter === "ALL" ? "primary" : "default"} size="sm" onClick={() => setGradeFilter("ALL")}>ì ì²´</Btn>
            {GRADES.map(g => (
              <Btn key={g.code} variant={gradeFilter === g.code ? "primary" : "default"} size="sm" onClick={() => setGradeFilter(g.code)}
                style={gradeFilter === g.code ? {} : { background: g.bgColor, color: g.color }}>
                {g.code}ë±ê¸
              </Btn>
            ))}
          </div>
          <Table
            columns={[
              { label: "ì í", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
              { label: "ë¶ë¥", key: "category", nowrap: true },
              { label: "LOT", key: "lot", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.lot}</span> },
              { label: "ë±ê¸", render: r => <GradeBadge gradeCode={r.grade} />, nowrap: true },
              { label: "ìí", render: r => <Badge status={r.status} />, nowrap: true },
              { label: "ìê°", align: "right", nowrap: true, render: r => `â©${r.cost.toLocaleString()}` },
              { label: "ìì¹", key: "location", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.location}</span> },
              { label: "DPP", align: "center", nowrap: true, render: r => r.dpp ? <CheckCircle2 size={16} color="#188038" /> : <span style={{ color: "#9aa0a6" }}>â</span> },
            ]}
            data={filteredAssets}
          />
        </>
      )}

      {view === "gradeMatrix" && (
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>íëª©ë³ ë±ê¸ ë§¤í¸ë¦­ì¤ â ì¬ê³ ìë / ìì íë§¤ë¨ê° / ëª©í ë§ì§ì¨</div>
          <div style={{ fontSize: 12, color: "#5f6368", marginBottom: 16 }}>ë±ê¸ë³ ê°ê²© ê³ìì ë§ì§ ëª©íê° ë°ìë íëª©Ãë±ê¸ ë§¤í¸ë¦­ì¤</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "2px solid #e0e0e0" }}>íëª©</th>
                  {GRADES.map(g => (
                    <th key={g.code} style={{ padding: "8px 12px", textAlign: "center", borderBottom: `2px solid ${g.color}`, minWidth: 100 }}>
                      <span style={{ color: g.color, fontWeight: 700 }}>{g.code}</span> ({g.label})
                    </th>
                  ))}
                  <th style={{ padding: "8px 12px", textAlign: "center", borderBottom: "2px solid #e0e0e0" }}>í©ê³</th>
                </tr>
              </thead>
              <tbody>
                {gradeMatrix.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f1f3f4" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.icon} {row.category}</td>
                    {row.grades.map((g, gi) => (
                      <td key={gi} style={{ padding: "8px 12px", textAlign: "center", background: g.count > 0 ? `${g.bgColor}80` : "" }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{g.count}</div>
                        <div style={{ color: "#5f6368", fontSize: 10 }}>â©{(g.sellPrice / 10000).toFixed(0)}ë§</div>
                        <div style={{ color: g.color, fontSize: 10, fontWeight: 600 }}>ë§ì§ {g.margin}%</div>
                      </td>
                    ))}
                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, fontSize: 16 }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === "turnover" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <KPICard title="ì ì²´ ì¬ê³ íì ì¨" value="3.5x" sub="ìê° íê· " icon={RotateCcw} color="#1a73e8" trend="up" trendValue="+0.3x" />
            <KPICard title="Aë±ê¸ íì ì¨" value="5.2x" sub="ê°ì¥ ë¹ ë¦" icon={Star} color="#188038" trend="up" trendValue="+0.8x" />
            <KPICard title="Dë±ê¸ ì²´ë¥ì¼" value="45ì¼" sub="íê·  ì¬ê³  ì²´ë¥" icon={Clock} color="#d93025" trend="down" trendValue="-5ì¼" />
          </div>
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>ë±ê¸ë³ ì¬ê³  íì ì¨ (30ì¼ ê¸°ì¤)</div>
            {GRADES.map((g, i) => {
                    const turnover = [5.2, 3.8, 2.4, 1.2, 0.5][i];
              const days = [6, 8, 13, 25, 60][i];
              return (
                <div key={g.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f3f4" }}>
                  <GradeBadge gradeCode={g.code} />
                  <div style={{ flex: 1 }}>
                    <ProgressBar value={turnover} max={6} color={g.color} />
                  </div>
                  <div style={{ width: 60, textAlign: "right", fontWeight: 700, fontSize: 14 }}>{turnover}x</div>
                  <div style={{ width: 60, textAlign: "right", fontSize: 12, color: "#5f6368" }}>{days}ì¼</div>
                </div>
              );
            })}
          </Card>
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>íì ì¨ ê°ì  ì¶ì²</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { action: "Dë±ê¸ HDD/SSD ì¼ê´ ìì¶ ê°ê²© ì ì", target: "Asia Recycling Pte Ltd", impact: "ì¬ê³  -148ê±´, íì ì¨ +0.8x", priority: "ëì" },
                { action: "Cë±ê¸ ë¸í¸ë¶ ëë§¤ ë²ë¤ íë¡ëª¨ì", target: "íí¬ë¦¬ì¬ì´í´ ì½ë¦¬ì", impact: "ë§ì§ +3%p, ì²´ë¥ì¼ -4ì¼", priority: "ì¤ê°" },
                { action: "Aë±ê¸ ëª¨ë°ì¼ ìë§¤ ë¨ê° 5% ì¸ì", target: "ì  ìë§¤ ì±ë", impact: "ë§ì§ +5%p, íì ì¨ ì ì§", priority: "ì¤ê°" },
              ].map((rec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#f8f9fa", borderRadius: 8 }}>
                  <TrendingUp size={16} color="#188038" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.action}</div>
                    <div style={{ fontSize: 11, color: "#5f6368" }}>ëì: {rec.target} Â· ììí¨ê³¼: {rec.impact}</div>
                  </div>
                  <Badge status={rec.priority === "ëì" ? "NEGOTIATION" : "QUALIFIED"}>{rec.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ============================================================
// DPP PAGE
// ============================================================

const DPPPage = () => {
  const [selectedDpp, setSelectedDpp] = useState(null);
  const dppAssets = MOCK_ASSETS.filter(a => a.dpp);

  const mockPassport = {
    uid: "urn:epc:id:sgtin:8801234.056789.001",
    publicUrl: "https://dpp.greenysystem.com/passport/ast-1",
    product: "Dell Latitude 5520",
    manufacturer: "Dell Technologies",
    category: "ICT-LAPTOP",
    grade: "A",
    materials: [
      { name: "ìë£¨ë¯¸ë", pct: 32, recycled: 18 },
      { name: "ê°ì² ", pct: 18, recycled: 45 },
      { name: "íë¼ì¤í± (ABS)", pct: 22, recycled: 8 },
      { name: "êµ¬ë¦¬", pct: 8, recycled: 30 },
      { name: "ê¸°í", pct: 20, recycled: 12 },
    ],
    substances: [{ name: "ë© (Pb)", cas: "7439-92-1", conc: "0.001%" }],
    repairScore: 7.8,
    recyclability: 0.87,
    lifecycle: [
      { event: "ì ì¡°", date: "2023-06-15", location: "Suzhou, China", performer: "Dell Inc." },
      { event: "1ì°¨ ì¬ì©", date: "2023-07~2025-12", location: "Seoul, Korea", performer: "ì¼ì±ì ì (ITìì°)" },
      { event: "ITAD ìê±°", date: "2026-01-20", location: "ììì", performer: "Greeny System" },
      { event: "ë°ì´í° ì­ì ", date: "2026-02-01", location: "ììì", performer: "Greeny System", detail: "NIST 800-88 Clear" },
      { event: "ê²ì/ë±ê¸íì ", date: "2026-02-05", location: "ììì", performer: "Greeny System", detail: "Aë±ê¸ íì " },
      { event: "DPP ë°ê¸", date: "2026-02-06", location: "â", performer: "DPP System", detail: "ì¬ê¶ íì±í" },
    ],
    endOfLife: {
      disassembly: "https://dpp.greenysystem.com/docs/latitude5520-disassembly",
      hazardous: ["ë°°í°ë¦¬ (Li-ion 54Wh)", "LCD í¨ë"],
      recommendation: "ë¦¬í¼ë¹ì â ì¬íë§¤ (Aë±ê¸)",
    },
  };

  if (selectedDpp) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedDpp(null)}>ëª©ë¡ì¼ë¡</Btn>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>ëì§í¸ ì íì¬ê¶ (DPP)</h2>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0a6" }}>ì í</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{mockPassport.product}</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{mockPassport.manufacturer} Â· {mockPassport.category}</div>
              </div>
              <GradeBadge gradeCode={mockPassport.grade} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><span style={{ color: "#9aa0a6" }}>UPI: </span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{mockPassport.uid}</span></div>
              <div><span style={{ color: "#9aa0a6" }}>ìë¦¬ê°ë¥ì±: </span><span style={{ fontWeight: 600 }}>{mockPassport.repairScore}/10</span></div>
              <div><span style={{ color: "#9aa0a6" }}>ì¬íì©ë¥ : </span><span style={{ fontWeight: 600 }}>{(mockPassport.recyclability * 100).toFixed(0)}%</span></div>
              <div><span style={{ color: "#9aa0a6" }}>ìí: </span><Badge status="COMPLETED">íì±</Badge></div>
            </div>

            <div style={{ marginTop: 20 }}>
              <divÝ[O^ÞÈÛÙZYÚ
X\Ú[ÝÛN_O»!£;'«:­k;!,OÙ]Û[ØÚÔ\ÜÜÜX]\X[ËX\

KJHO
]Ù^O^Ú_HÝ[O^ÞÈ\Ü^N^[YÛ][\ÎÙ[\Ø\Y[Î_OÜ[Ý[O^ÞÈÚYLÛÚ^NL_OÛK[Y_OÜÜ[]Ý[O^ÞÈ^KZYÚMXÚÙÜÝ[ÙYÙÜ\Y]\Î
Ý\ÝÎY[ÜÚ][Û[]]H_O]Ý[O^ÞÈÚY	ÛKÝIXZYÚL	HXÚÙÜÝ[ÌXMÌÙNÜ\Y]\Î
ÜXÚ]NÈ_HÏ]Ý[O^ÞÈÚY	ÛKXÞXÛYIXZYÚL	HXÚÙÜÝ[ÌNÎÜ\Y]\Î
ÜÚ][ÛXÛÛ]HÜY_HÏÙ]Ü[Ý[O^ÞÈÛÚ^NLKÚYÌ^[YÛYÚ_OÛKÝIOÜÜ[Ü[Ý[O^ÞÈÛÚ^NLÛÛÜÌNÎÚY
L_O¸¦nûî#ÈÛKXÞXÛYIOÜÜ[Ù]
J_B]Ý[O^ÞÈÛÚ^NLÛÛÜÎXXLMX\Ú[Ü
_OÜ[Ý[O^ÞÈÛÛÜÌXMÌÙN_O¸¥¨ÜÜ[;(!;,­:îa;'*	ÜÂÜ[Ý[O^ÞÈÛÛÜÌNÎ_O¸¥¨ÜÜ[;'«;fg;&ªH;!£;'«:îa;'*Ù]Ù]ÐØ\Ø\Ý[O^ÞÈ^KZ[ÚYÌ_O]Ý[O^ÞÈÛÙZYÚ
X\Ú[ÝÛNL_Oºço;'m;e!; «;'m;`m;`à;'¡:ço;'nÙ]]Ý[O^ÞÈÜÚ][Û[]]HY[ÓY_O]Ý[O^ÞÈÜÚ][ÛXÛÛ]HYÜ
ÝÛN
ÚYXÚÙÜÝ[ÙLLL_HÏÛ[ØÚÔ\ÜÜÜYXÞXÛKX\

]JHO
]Ù^O^Ú_HÝ[O^ÞÈÜÚ][Û[]]HY[ÐÝÛNMY[ÓYM_O]Ý[O^ÞÈÜÚ][ÛXÛÛ]HYLÜÚYLZYÚLÜ\Y]\Î
XÚÙÜÝ[HOOH[ØÚÔ\ÜÜÜYXÞXÛK[ÝHHÈÌNÎÌXMÌÙNÜ\ÛÛYÙ_HÏ]Ý[O^ÞÈÛÚ^NLËÛÙZYÚ
_OÙ]][OÙ]]Ý[O^ÞÈÛÚ^NLKÛÛÜÍYÍ_OÙ]]_H0­ÈÙ]ØØ][ÛOÙ]]Ý[O^ÞÈÛÚ^NLKÛÛÜÍYÍ_OÙ]\ÜY\^Ù]]Z[È8 %	Ù]]Z[XOÙ]Ù]
J_BÙ]]Ý[O^ÞÈX\Ú[ÜY[ÎLXÚÙÜÝ[ÙMXHÜ\Y]\Î_O]Ý[O^ÞÈÛÚ^NLÛÙZYÚ
ÛÛÜÌNÎX\Ú[ÝÛN
_O»"&:ê¡{(¡zèã:¬ ;'m:äçÙ]]Ý[O^ÞÈÛÚ^NLKÛÛÜÍYÍ_O]»-¥;,§Û[ØÚÔ\ÜÜÜ[ÙYKXÛÛ[Y[][ÛOÙ]]»'(;em:í ;d¢Û[ØÚÔ\ÜÜÜ[ÙYK^\Ý\ËÚ[_OÙ]Ù]Ù]ÐØ\Ù]Ø\Ý[O^ÞÈY[ÎLXÚÙÜÝ[ÙYH\Ü^N^[YÛ][\ÎÙ[\Ø\L_O\ÛÙHÚ^O^ÍHÛÛÜHÌXMÌÙNÏ]Ý[O^ÞÈ^H_O]Ý[O^ÞÈÛÚ^NLÛÙZYÚ
_OT;/e:äç:èg:¬íz¬';(l;f£Ù]]Ý[O^ÞÈÛÚ^NLKÛÛÜÍYÍÛ[Z[N[ÛÜÜXÙH_OÛ[ØÚÔ\ÜÜÜXXÕ\OÙ]Ù]\X[HÝ][HÚ^OHÛHXÛÛ^ÑÝÛØYOT:âé;&­:èg:äçÐ\X[H[X\HÚ^OHÛHXÛÛ^ÑÛØ_Oº¬íz¬';c¦;'m;)àÐÐØ\Ù]
NÂB]\
]Ý[O^ÞÈ\Ü^N^^\XÝ[ÛÛÛ[[Ø\M_O]Ý[O^ÞÈ\Ü^N^\ÝYPÛÛ[ÜXÙKX]ÙY[[YÛ][\ÎÙ[\_O]Ý[O^ÞÈX\Ú[ÛÚ^NÛÙZYÚ
Ì_O:å%;)à;a.;(';d¢;%ë:­£Ú]Ý[O^ÞÈÛÚ^NLÛÛÜÍYÍ_OUHTÔ:­ç;(%H;) ;"&8 %ÔÌHYÚ][[È:®,:ì&Ù]Ù]\X[H[X\HXÛÛ^Ô\ßO»%ë:­£:ì':®"OÐÙ]]Ý[O^ÞÈ\Ü^N^Ø\L^Ü\Ü\_OÔPØ\]OHºì':®"zä';%ë:­£[YO^Ø	Ù\ÜÙ]Ë[Ýz¬mHXÛÛ^Ô\ÛÙ_HÛÛÜHÌXMÌÙNÏÔPØ\]OH»fg;!,H; à{`ç[YO^Ø	Ù\ÜÙ]Ë[Ýz¬mHXÛÛ^ÐÚXÚÐÚ\ÛLHÛÛÜHÌNÎÏÔPØ\]OHºëî:ì':®"H;'¤; ¬[YO^Ø	ÓSÐÒ×ÐTÔÑUË[\HOXK
K[Ýz¬mHXÛÛ^Ð[\X[Û_HÛÛÜHÙXXÏÙ]XBÛÛ[[Ï^ÖÂÈX[»(';d¢[\O]]Ý[O^ÞÈÛÙZYÚ
_OÜÙXÝOÙ]]Ý[O^ÞÈÛÚ^NLKÛÛÜÍYÍ_OÜÙ\X[OÙ]Ù]KÈX[ºí¡:éfÙ^NØ]YÛÜHÝÜ\YHKÈX[ºäìz®"H[\OÜYPYÙHÜYPÛÙO^ÜÜY_HÏÝÜ\YHKÈX[» à{`ç[\OYÙHÝ]\Ï^ÜÝ]\ßHÏÝÜ\YHKÈX[[\OÈÜ[Ý[O^ÞÈÛÛÜÌNÎÛÙZYÚ
_O¸§$È:ì':®"zä*ÜÜ[Ü[Ý[O^ÞÈÛÛÜÎXXLM_Oºëï:ì':®"OÜÜ[KÈX[[\OÈ\X[HÚÜÝÚ^OHÛHXÛÛ^Ñ^Y_O»(l;f£Ð\X[HÝ][HÚ^OHÛHXÛÛ^Ô\ßOºì':®"OÐ[YÛYÚK_B]O^ÓSÐÒ×ÐTÔÑUßBÛÝÐÛXÚÏ^ÊHOÈY

HÙ]Ù[XÝY
NÈ_BÏÙ]
NÂNÂËÈOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOBËÈÓÓTPSÑHQÑBËÈOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOBÛÛÝÛÛ\X[ÙTYÙHH

HOÂÛÛÝÝXÙ]XHH\ÙTÝ]JÝ\Y]ÈNÂ]\
]Ý[O^ÞÈ\Ü^N^^\XÝ[ÛÛÛ[[Ø\M_O]Ý[O^ÞÈ\Ü^N^\ÝYPÛÛ[ÜXÙKX]ÙY[[YÛ][\ÎÙ[\_OÝ[O^ÞÈX\Ú[ÛÚ^NÛÙZYÚ
Ì_Oºìí;%b;.í;e#:ço;'m;%®;"©Ú\X[H[X\HXÛÛ^ÔÚY[Oº­ç;(':¬ ;)§H;"é;e¢OÐÙ]]Ý[O^ÞÈ\Ü^N^Ø\_OÖÖÈÝ\Y]È»(¡{ej{f!;fjHKÈÚ\Hºãl;'m;a,; «{('KÈ^Ü»"&;-§:­ç;('KÈÙ\»'n;)§z­ :é«WKX\

ÚÙ^KX[JHO
Ù^O^ÚÙ^_H\X[^ÝXOOHÙ^HÈ[X\HY][HÚ^OHÛHÛÛXÚÏ^Ê
HOÙ]XÙ^J_OÛX[OÐ
J_BÙ]ÝXOOHÝ\Y]È	
]Ý[O^ÞÈ\Ü^N^^\XÝ[ÛÛÛ[[Ø\M_O]Ý[O^ÞÈ\Ü^N^Ø\L^Ü\Ü\_OÔPØ\]OHºãl;'m;a,; «{(';&a:èã;'*[YOHMHÝXH»'m:ì¢:âë;'¡z¬è:®,;) XÛÛ^ÔÚY[HÛÛÜHÌNÎ[H\[[YOHÌK	\ÏÔPØ\]OH» «{(':ã :®,;'¤; ¬[YOHú¬mÝXH»)¢{"ç;,¦:é«;ea;&¥XÛÛ^ÐÛØÚßHÛÛÜHÙLÍÍÏÔPØ\]OH»"&;-§:­ç;(':¬ ;a¨[YOHú¬mÝXHº¬ ;a¨:ã :®,XÛÛ^ÑÛØ_HÛÛÜHÎ
ÌÙHÏÔPØ\]OH»'n;)§H:éã:èã;&";(%H[YOHz¬mÝXHÌ;'o;'m:à­XÛÛ^Ð[\X[Û_HÛÛÜHÙLÌHÏÙ]Ø\]Ý[O^ÞÈÛÙZYÚ
X\Ú[ÝÛNL_O».í;e#:ço;'m;%®;"©;,­;oz»Þ®¬ì¤í¸</div>
            {[
              { area: "ë°ì´í° ë³´ì", items: [
                { name: "NIST 800-88 ê¸°ë° ì­ì  íë¡ì¸ì¤", status: "pass" },
                { name: "ì­ì  ì¸ì¦ì ìë ìì± ë° ë³´ê´", status: "pass" },
                { name: "ê³ ê° ë°ì´í° ìì¡´ ê²ì¦ (ëë¤ ìíë§)", status: "pass" },
                { name: "ì­ì  ë¶ê° ìì° ë¬¼ë¦¬ì  íì ì²ë¦¬", status: "warn" },
              ]},
              { area: "ìì¶ ê·ì ", items: [
                { name: "ì´ì¤ì©ë(Dual-Use) íëª© ì¤í¬ë¦¬ë", status: "pass" },
                { name: "ìì¶ ëìêµ­ ì ì¬ ëª©ë¡ íì¸", status: "review" },
                { name: "ìì¶íê° ë¬¸ì ìë¹", status: "pass" },
              ]},
              { area: "íê²½ ê·ì ", items: [
                { name: "EU WEEE ë³´ê³  ë°ì´í° ì¤ë¹", status: "pass" },
                { name: "RoHS ì í´ë¬¸ì§ ê²ì¬ ê¸°ë¡", status: "pass" },
                { name: "ESPR DPP ë°ì´í° êµ¬ì¡° ì¤ì", status: "pass" },
              ]},
              { area: "ì¸ì¦", items: [
                { name: "R2v3 ì¸ì¦ ì í¨ (ë§ë£: 2026-04-24)", status: "warn" },
                { name: "ISO 14001 ì í¨", status: "pass" },
                { name: "ISO 27001 ì í¨", status: "pass" },
              ]},
            ].map((section, si) => (
              <div key={si} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5f6368", marginBottom: 6 }}>{section.area}</div>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f8f9fa" }}>
                    {item.status === "pass" && <CheckCircle2 size={16} color="#188038" />}
                    {item.status === "warn" && <AlertTriangle size={16} color="#e37400" />}
                    {item.status === "review" && <Clock size={16} color="#8430ce" />}
                    <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                    <Badge status={item.status === "pass" ? "COMPLETED" : item.status === "warn" ? "PROCESSING" : "NEGOTIATION"}>
                      {item.status === "pass" ? "ìë£" : item.status === "warn" ? "ì£¼ì" : "ê°í ì¤"}
                    </Badge>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "wipe" && (
        <Table
          columns={[
            { label: "ìì°", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
            { label: "ì­ì  íì¤", nowrap: true, render: () => "NIST 800-88 Clear" },
            { label: "ìí", render: r => <Badge status={r.status === "DATA_WIPING" ? "PROCESSING" : r.status === "READY_FOR_SALE" ? "COMPLETED" : "DRAFT"}>
              {r.status === "DATA_WIPING" ? "ì­ì ì¤" : r.status === "READY_FOR_SALE" ? "ìë£" : "ëê¸°"}
            </Badge>, nowrap: true },
            { label: "ì¸ì¦ì", render: r => r.status === "READY_FOR_SALE" ? <Btn variant="ghost" size="sm" icon={FileText}>ë¤ì´ë¡ë</Btn> : <span style={{ color: "#9aa0a6" }}>â</span> },
          ]}
          data={MOCK_ASSETS}
        />
      )}

      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_ORDERS.filter(o => o.channel === "EXPORT").map(o => (
            <Card key={o.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
              <Globe size={24} color="#8430ce" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{o.number}</div>
                <div style={{ fontSize: 12, color: "#5f6368" }}>{o.customer} Â· {o.country || "â"} Â· {o.items}ê±´</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <Badge status="COMPLETED">Dual-Use íµê³¼</Badge>
                <Badge status="COMPLETED">ì ì¬ ëª©ë¡ íì¸</Badge>
              </div>
              <Btn variant="outline" size="sm" icon={Eye}>ìì¸</Btn>
            </Card>
          ))}
        </div>
      )}

      {tab === "cert" && (
        <Table
          columns={[
            { label: "ì¸ì¦", render: () => <span style={{ fontWeight: 600 }}>R2v3</span> },
            { label: "ì¸ì¦ë²í¸", render: () => "R2-2024-KR-0456" },
            { label: "ë°ê¸ê¸°ê´", render: () => "SERI (Sustainable Electronics Recycling International)" },
            { label: "ë§ë£ì¼", render: () => <span style={{ color: "#e37400", fontWeight: 600 }}>2026-04-24</span> },
            { label: "ìí", render: () => <Badge status="PROCESSING">ê°±ì  íì</Badge> },
            { label: "", render: () => <Btn variant="outline" size="sm" icon={FileText}>ì¸ì¦ì</Btn> },
          ]}
          data={[1]}
        />
      )}
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage setPage={setPage} />;
      case "crm": return <CRMPage />;
      case "sales": return <SalesPage />;
      case "inventory": return <InventoryPage />;
      case "dpp": return <DPPPage />;
      case "compliance": return <CompliancePage />;
      default: return <DashboardPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#202124", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 60 : 220, background: "#1a1a2e", color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "16px 10px" : "16px 16px", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#188038", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
            G
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>Greeny System</div>
              <div style={{ fontSize: 10, color: "#9aa0a6", whiteSpace: "nowrap" }}>íµí© SCM + DPP</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <div key={item.id} onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: sidebarCollapsed ? "10px 18px" : "10px 16px",
                  cursor: "pointer", transition: "all 0.15s",
                  background: active ? "#2a2a4a" : "transparent",
                  borderLeft: active ? "3px solid #1a73e8" : "3px solid transparent",
                  color: active ? "#fff" : "#9aa0a6",
                }}>
                <Icon size={18} />
                {!sidebarCollapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: 16, borderTop: "1px solid #2a2a4a", fontSize: 10, color: "#5f6368" }}>
            <div>DPP Platform v1.0</div>
            <div>EU ESPR Ready</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e0e0e0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#5f6368" }}>
            {NAV_ITEMS.find(n => n.id === page)?.label || "ëìë³´ë"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#5f6368" }}>2026-04-09</span>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "#1a73e8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
              JH
            </div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
장재혁" },
          ].map((a, i) => (
            <Card key={i} style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f3f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <a.icon size={16} color="#5f6368" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.target}</span>
                  <span style={{ fontSize: 11, color: "#9aa0a6" }}>{a.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: "#9aa0a6", marginTop: 4 }}>담당자: {a.assigned}</div>
              </div>
            </Card>
          ))}        </div>
      </div>
    </div>
  );
};

// ================================================================
// SALES PAGE
// ================================================================

const SalesPage = () => {
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = channelFilter === "ALL" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.channel === channelFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>매출 현황</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={FileText}>거래처 목록 조회</Btn>
          <Btn variant="primary" icon={Plus}>신규 추가</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn variant={channelFilter === "ALL" ? "primary" : "default"} size="sm" onClick={() => setChannelFilter("ALL")}>전체</Btn>
        {CHANNELS.map(ch => (
          <Btn key={ch.code} variant={channelFilter === ch.code ? "primary" : "default"} size="sm" onClick={() => setChannelFilter(ch.code)}>
            {ch.name}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="조회된 거래건수" value={`${filtered.length}건`} icon={FileText} color="#1a73e8" />
        <KPICard title="매출액" value={channelFilter === "ALL" ? "8.35억원" : formatKRW(filtered.reduce((s, o) => s + (o.currency === "KRW" ? o.total : o.total * 1350), 0)) + "원"} icon={DollarSign} color="#188038" />
        <KPICard title="평균마진율" value={`${((filtered.reduce((s, o) => s + o.margin, 0) / Math.max(filtered.length, 1)).toFixed(1)}%`} icon={Percent} color="#f9ab00" />
      </div>

      {selectedOrder ? (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedOrder(null)}>돌아가기</Btn>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" icon={Edit3}>수정</Btn>
              <Btn variant="success" icon={Truck}>배송</Btn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>거래번호</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedOrder.number}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>고객사</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedOrder.customer}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>채널</div>
              <ChannelBadge channelCode={selectedOrder.channel} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>상태</div>
              <Badge status={selectedOrder.status} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>금액</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#188038" }}>
                {selectedOrder.currency === "KRW" ? formatKRW(selectedOrder.total) + "원" : `${selectedOrder.currency} ${selectedOrder.total.toLocaleString()}`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>마진율</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: selectedOrder.margin >= 30 ? "#188038" : "#e37400" }}>{selectedOrder.margin}%</div>
            </div>
          </div>
          {selectedOrder.channel === "EXPORT" && selectedOrder.country && (
            <div style={{ marginTop: 16, padding: 12, background: "#f3e8fd", borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#8430ce", marginBottom: 4 }}>수출정보</div>
              <div style={{ fontSize: 12, color: "#5f6368" }}>국가: {selectedOrder.country} ‧ Incoterms: FOB ‧ 담당: {selectedOrder.customerName || "정보없음"}</div>
            </div>
          )}
        </Card>
      ) : (
        <Table
          columns={[
            { label: "거래번호", render: r => <span style={{ fontWeight: 600, color: "#1a73e8" }}>{r.number}</span>, nowrap: true },
            { label: "채널", render: r => <ChannelBadge channelCode={r.channel} />, nowrap: true },
            { label: "고객사", key: "customer" },
            { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
            { label: "아이템", key: "items", align: "right", nowrap: true, render: r => `${r.items}건` },
            { label: "금액", align: "right", nowrap: true, render: r => (
              <span style={{ fontWeight: 600 }}>
                {r.currency === "KRW" ? formatKRW(r.total) + "원" : `${r.currency} ${r.total.toLocaleString()}`}
              </span>
            )},
            { label: "마진율", align: "right", nowrap: true, render: r => (
              <span style={{ color: r.margin >= 30 ? "#188038" : r.margin >= 20 ? "#e37400" : "#d93025", fontWeight: 600 }}>{r.margin}%</span>
            )},
            { label: "등록일", key: "date", nowrap: true },
          ]}
          data={filtered}
          onRowClick={setSelectedOrder}
        />
      )}
    </div>
  );
};

// ==============================================================
// INVENTORY & GRADE PAGE
// ==============================================================

const InventoryPage = () => {
  const [view, setView] = useState("assets");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredAssets = MOCK_ASSETS.filter(a => {
    if (gradeFilter !== "ALL" && a.grade !== gradeFilter) return false;
    if (search && !a.product.toLowerCase().includes(search.toLowerCase()) && !a.serial.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const gradeMatrix = CATEGORIES.slice(0, 6).map(cat => {
    const catAssets = MOCK_ASSETS.filter(a => a.category === cat.name);
    return {
      category: cat.name,
      icon: cat.icon,
      grades: GRADES.map(g => ({
        ...g,
        count: catAssets.filter(a => a.grade === g.code).length,
        sellPrice: Math.round(3500000 * g.factor),
        margin: g.marginTarget,
      })),
      total: catAssets.length,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>자산 / 등급평가</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={Tag}>자산 태그 편집</Btn>
          <Btn variant="primary" icon={Plus}>신규 추가</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["assets", "자산 조회"], ["gradeMatrix", "등급별 현황"], ["turnover", "회전율"]].map(([key, label]) => (
          <Btn key={key} variant={view === key ? "primary" : "default"} size="sm" onClick={() => setView(key)}>{label}</Btn>
        ))}
      </div>

      {view === "assets" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="상품명/시리얼 검색..." />
            <Btn variant={gradeFilter === "ALL" ? "primary" : "default"} size="sm" onClick={() => setGradeFilter("ALL")}>전체</Btn>
            {GRADES.map(g => (
              <Btn key={g.code} variant={gradeFilter === g.code ? "primary" : "default"} size="sm" onClick={() => setGradeFilter(g.code)}
                style={gradeFilter === g.code ? {} : { background: g.bgColor, color: g.color }}>
                {g.code}등급
              </Btn>
            ))}
          </div>
          <Table
            columns={[
              { label: "상품명", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
              { label: "분류", key: "category", nowrap: true },
              { label: "LOT", key: "lot", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.lot}</span> },
              { label: "등급", render: r => <GradeBadge gradeCode={r.grade} />, nowrap: true },
              { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
              { label: "원가", align: "right", nowrap: true, render: r => `₩${r.cost.toLocaleString()}` },
              { label: "위치", key: "location", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.location}</span> },
              { label: "DPA", align: "center", nowrap: true, render: r => r.dpp ? <CheckCircle2 size={16} color="#188038" /> : <span style={{ color: "#9aa0a6" }}>—</span> },
            ]}
            data={filteredAssets}
          />
        </>
      )}

      {view === "gradeMatrix" && (
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>한눈에 보는 등급별 현황 - 합계 • 판매가(A급기준) / 마진율</div>
          <div style={{ fontSize: 12, color: "#5f6368", marginBottom: 16 }}>상품분류별 자산 현황 및 등급별 재고, 판매가 현황을 한눈에 확인할 수 있습니다</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "2px solid #e0e0e0" }}>카테고리</th>
                  {GRADES.map(g => (
                    <th key={g.code} style={{ padding: "8px 12px", textAlign: "center", borderBottom: `2px solid ${g.color}`, minWidth: 100 }}>
                      <span style={{ color: g.color, fontWeight: 700 }}>{g.code}</span> ({g.label})
                    </th>
                  ))}
                  <th style={{ padding: "8px 12px", textAlign: "center", borderBottom: "2px solid #e0e0e0" }}>합계</th>
                </tr>
              </thead>
              <tbody>
                {gradeMatrix.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f1f3f4" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.icon} {row.category}</td>
                    {row.grades.map((g, gi) => (
                      <td key={gi} style={{ padding: "8px 12px", textAlign: "center", background: g.count > 0 ? `${g.bgColor}80` : "" }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{g.count}</div>
                        <div style={{ color: "#5f6368", fontSize: 10 }}>₩{(g.sellPrice / 10000).toFixed(0)}만</div>
                        <div style={{ color: g.color, fontSize: 10, fontWeight: 600 }}>마진율 {g.margin}%</div>
                      </td>
                    ))}
                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, fontSize: 16 }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === "turnover" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <KPICard title="재고 회전율(전체)" value="3.5x" sub="지난달 대비" icon={RotateCcw} color="#1a73e8" trend="up" trendValue="+0.3x" />
            <KPICard title="A급 회전율" value="5.2x" sub="평균 경과일수" icon={Star} color="#188038" trend="up" trendValue="+0.8x" />
            <KPICard title="D급 회전일수" value="45일" sub="지난달 대비 평균 경과일수" icon={Clock} color="#d93025" trend="down" trendValue="-10일" />
          </div>
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>최근 30일 회전율 추이</div>
            {GRADES.map((g, i) => {
              const turnover = [5.2, 3.8, 2.4, 1.2, 0.5][i];
              const days = [6, 8, 13, 25, 60][i];
              return (
                <div key={g.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f3f4" }}>
                  <GradeBadge gradeCode={g.code} />
                  <div style={{ flex: 1 }}>
                    <ProgressBar value={turnover} max={6} color={g.color} />
                  </div>
                  <div style={{ width: 60, textAlign: "right", fontWeight: 700, fontSize: 14 }}>{turnover}x</div>
                  <div style={{ width: 60, textAlign: "right", fontSize: 12, color: "#5f6368" }}>{days}일</div>
                </div>
              );
            })}
          </Card>
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>추천 활동</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { action: "D급 HDD/SSD 데이터 삭제 신청건수 증가 -148건도, 매출액 +0.8x", target: "Asia Recycling Pte Ltd", impact: "매출액 -148건도, 회전율 +0.8x", priority: "협상중" },
                { action: "C급 메모리 렌탈/파워 공급 검토 안내", target: "한국폐전자제품 정보관리(IT)", impact: "마진율 +3%p, 회전율 -10일", priority: "협상중" },
                { action: "A급 전문 판매처 신규 협력 확보 5% 신청", target: "서울 IT폐기물 처리센터", impact: "마진율 +5%p, 회전율 -일정업", priority: "협상중" },
              ].map((rec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#f8f9fa", borderRadius: 8 }}>
                  <TrendingUp size={16} color="#188038" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.action}</div>
                    <div style={{ fontSize: 11, color: "#5f6368" }}>대상: {rec.target} ‧ 기대효과: {rec.impact}</div>
                  </div>
                  <Badge status={rec.priority === "협상중" ? "NEGOTIATION" : "QUALIFIED"}>{rec.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==============================================================
// DPP PAGE
// ==============================================================

const DPPPage = () => {
  const [selectedDpp, setSelectedDpp] = useState(null);
  const dppAssets = MOCK_ASSETS.filter(a => a.dpp);

  const mockPassport = {
    uid: "urn:epc:id:sgtin:8801234.056789.001",
    publicUrl: "https://dpp.greenysystem.com/passport/ast-1",
    product: "Dell Latitude 5520",
    manufacturer: "Dell Technologies",
    category: "ICT-LAPTOP",
    grade: "A",
    materials: [
      { name: "철강금속", pct: 32, recycled: 18 },
      { name: "알루미늄", pct: 18, recycled: 45 },
      { name: "플라스틱(ABS)", pct: 22, recycled: 8 },
      { name: "구리선재", pct: 8, recycled: 30 },
      { name: "유리디스플레이", pct: 20, recycled: 12 },
    ],
    substances: [{ name: "납(Pb)", cas: "7439-92-1", conc: "0.001%" }],
    repairScore: 7.8,
    recyclability: 0.87,
    lifecycle: [
      { event: "제조완료", date: "2023-06-15", location: "Suzhou, China", performer: "Dell Inc." },
      { event: "1차 사용", date: "2023-07~2025-12", location: "Seoul, Korea", performer: "기업(IT자산관리)" },
      { event: "ITAD 회수", date: "2026-01-20", location: "서울-인천", performer: "Greeny System" },
      { event: "데이터삭제", date: "2026-02-01", location: "서울-인천", performer: "Greeny System", detail: "NIST 800-88 Clear" },
      { event: "A급 판매/출고", date: "2026-02-05", location: "서울-인천", performer: "Greeny System", detail: "A급 판매완료" },
      { event: "DPP 생성", date: "2026-02-06", location: "—", performer: "DPP System", detail: "등록번호 발급 완료" },
    ],
    endOfLife: {
      disassembly: "https://dpp.greenysystem.com/docs/latitude5520-disassembly",
      hazardous: ["납(Pb) (Li-ion 54Wh)", "LCD 패널"],
      recommendation: "재자원화 절차(A급기준) 준수, ⚠ 취급주의(지정폐기물 분류 필요)",
    },
  };

  if (selectedDpp) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedDpp(null)}>돌아가기</Btn>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>디지털 제품 여권 (DPP)</h2>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0a6" }}>상품명</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{mockPassport.product}</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{mockPassport.manufacturer} ‧ {mockPassport.category}</div>
              </div>
              <GradeBadge gradeCode={mockPassport.grade} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><span style={{ color: "#9aa0a6" }}>UPI: </span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{mockPassport.uid}</span></div>
              <div><span style={{ color: "#9aa0a6" }}>수리용이도: </span><span style={{ fontWeight: 600 }}>{mockPassport.repairScore}/10</span></div>
              <div><span style={{ color: "#9aa0a6" }}>재활용률: </span><span style={{ fontWeight: 600 }}>{(mockPassport.recyclability * 100).toFixed(0)}%</span></div>
              <div><span style={{ color: "#9aa0a6" }}>상태: </span><Badge status="COMPLETED">완료</Badge></div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>구성 소재</div>
              {mockPassport.materials.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span style={{ width: 100, fontSize: 12 }}>{m.name}</span>
                  <div style={{ flex: 1, height: 14, background: "#f1f3f4", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${m.pct}%`, height: "100%", background: "#1a73e8", borderRadius: 4, opacity: 0.7 }} />
                    <div style={{ width: `${m.recycled}%`, height: "100%", background: "#188038", borderRadius: 4, position: "absolute", top: 0, left: 0 }} />
                  </div>
                  <span style={{ fontSize: 11, width: 30, textAlign: "right" }}>{m.pct}%</span>
                  <span style={{ fontSize: 10, color: "#188038", width: 50 }}>♻ {m.recycled}%</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: "#9aa0a6", marginTop: 4 }}>
                <span style={{ color: "#1a73e8" }}>🔷</span> 사용비율 &nbsp;
                <span style={{ color: "#188038" }}>🔷</span> 재활용 재료율
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>라이프사이클</div>
              <div style={{ position: "relative", paddingLeft: 24 }}>
                <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "#e0e0e0" }} />
                {mockPassport.lifecycle.map((evt, i) => (
                  <div key={i} style={{ position: "relative", paddingBottom: 16, paddingLeft: 16 }}>
                    <div style={{ position: "absolute", left: -20, top: 2, width: 12, height: 12, borderRadius: 6, background: i === mockPassport.lifecycle.length - 1 ? "#188038" : "#1a73e8", border: "2px solid #fff" }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{evt.event}</div>
                    <div style={{ fontSize: 11, color: "#5f6368" }}>{evt.date} ‧ {evt.location}</div>
                    <div style={{ fontSize: 11, color: "#5f6368" }}>{evt.performer}{evt.detail ? ` — ${evt.detail}` : ""}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, padding: 12, background: "#e6f4ea", borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#188038", marginBottom: 4 }}>폐기처분 권고사항</div>
                <div style={{ fontSize: 11, color: "#5f6368" }}>
                  <div>권고: {mockPassport.endOfLife.recommendation}</div>
                  <div>위험물질: {mockPassport.endOfLife.hazardous.join(", ")}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ padding: 12, background: "#f8f9fa", display: "flex", alignItems: "center", gap: 12 }}>
            <QrCode size={40} color="#1a73e8" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>QR 다운로드 및 조회</div>
              <div style={{ fontSize: 11, color: "#5f6368", fontFamily: "monospace" }}>{mockPassport.publicUrl}</div>
            </div>
            <Btn variant="outline" size="sm" icon={Download}>QR 다운로드</Btn>
            <Btn variant="primary" size="sm" icon={Globe}>링크 열기</Btn>
          </Card>
        </div>

        <Card style={{ padding: 12, background: "#f8f9fa", display: "flex", alignItems: "center", gap: 12 }}>
          <QrCode size={40} color="#1a73e8" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>QR 다운로드 및 조회</div>
            <div style={{ fontSize: 11, color: "#5f6368", fontFamily: "monospace" }}>{mockPassport.publicUrl}</div>
          </div>
          <Btn variant="outline" size="sm" icon={Download}>QR 다운로드</Btn>
          <Btn variant="primary" size="sm" icon={Globe}>링크 열기</Btn>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>DPP 디지털 상품여권</h2>
          <div style={{ fontSize: 12, color: "#5f6368" }}>EU ESPR 준수 · GS1 Digital Link 준비</div>
        </div>
        <Btn variant="primary" icon={Plus}>제품 여권 추가</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="등록된 상품여권" value={`${dppAssets.length}건`} icon={QrCode} color="#1a73e8" />
        <KPICard title="완료 상태" value={`${dppAssets.length}건`} icon={CheckCircle2} color="#188038" />
        <KPICard title="미등록 상품" value={`${MOCK_ASSETS.filter(a => !a.dpp).length}건`} icon={AlertTriangle} color="#f9ab00" />
      </div>

      <Table
        columns={[
          { label: "상품명", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
          { label: "분류", key: "category", nowrap: true },
          { label: "등급", render: r => <GradeBadge gradeCode={r.grade} />, nowrap: true },
          { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
          { label: "DPP", render: r => r.dpp ? <span style={{ color: "#188038", fontWeight: 600 }}>✔ 등록됨</span> : <span style={{ color: "#9aa0a6" }}>미등록</span> },
          { label: "", render: r => r.dpp ? <Btn variant="ghost" size="sm" icon={Eye}>조회</Btn> : <Btn variant="outline" size="sm" icon={Plus}>추가</Btn>, align: "right" },
        ]}
        data={MOCK_ASSETS}
        onRowClick={(r) => { if (r.dpp) setSelectedDpp(r); }}
      />
    </div>
  );
};

// ==============================================================
// COMPLIANCE PAGE
// ==============================================================

const CompliancePage = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>규제준수 현황</h2>
        <Btn variant="primary" icon={Shield}>규제준수 신청</Btn>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["overview", "준수현황"], ["wipe", "데이터 삭제 현황"], ["export", "수출인증"], ["cert", "인증서"]].map(([key, label]) => (
          <Btn key={key} variant={tab === key ? "primary" : "default"} size="sm" onClick={() => setTab(key)}>{label}</Btn>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <KPICard title="규제준수 현황(전체)" value="94.2%" sub="조회된 거래건수" icon={Shield} color="#188038" trend="up" trendValue="+1.8%p" />
            <KPICard title="미처리 거래건수" value="23건도" sub="담당자별 미처리 거래" icon={Clock} color="#e37400" />
            <KPICard title="경고중인 미해결" value="1건" sub="30건도 미처리 거래" icon={AlertTriangle} color="#d93025" />
          </div>

          <Card>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>규제준수 항목별 현황</div>
            {[
              { area: "자료안전성", items: [
                { name: "NIST 800-88 데이터삭제 준수", status: "pass" },
                { name: "마더보드 수리완화 및 검수 기록", status: "pass" },
                { name: "폐기물 처리 상태 및 추적(API연동)", status: "pass" },
                { name: "환경/보안 이력 손상 불가 인증", status: "warn" },
              ]},
              { area: "수출인증", items: [
                { name: "Dual-Use 규제 중량 검토", status: "pass" },
                { name: "수출허가 제한 대상 수정 검토", status: "review" },
                { name: "환경마크 취득 거래처 확인", status: "pass" },
              ]},
              { area: "데이터보호", items: [
                { name: "R2v3 인증 심사중", status: "warn" },
                { name: "ISO 14001 인증", status: "pass" },
                { name: "ISO 27001 인증", status: "pass" },
              ]},
            ].map((section, si) => (
              <div key={si} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5f6368", marginBottom: 6 }}>{section.area}</div>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f8f9fa" }}>
                    {item.status === "pass" && <CheckCircle2 size={16} color="#188038" />}
                    {item.status === "warn" && <AlertTriangle size={16} color="#e37400" />}
                    {item.status === "review" && <Clock size={16} color="#8430ce" />}
                    <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                    <Badge status={item.status === "pass" ? "COMPLETED" : item.status === "warn" ? "PROCESSING" : "NEGOTIATION"}>
                      {item.status === "pass" ? "완료됨" : item.status === "warn" ? "검토중" : "협상중"}
                    </Badge>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "wipe" && (
        <Table
          columns={[
            { label: "자산명", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
            { label: "삭제 방식", nowrap: true, render: () => "NIST 800-88 Clear" },
            { label: "상태", render: r => <Badge status={r.status === "DATA_WIPING" ? "PROCESSING" : r.status === "READY_FOR_SALE" ? "COMPLETED" : "DRAFT"}>
              {r.status === "DATA_WIPING" ? "삭제중" : r.status === "READY_FOR_SALE" ? "완료됨" : "초안"}
            </Badge>, nowrap: true },
            { label: "수출인증", render: r => r.status === "READY_FOR_SALE" ? <Btn variant="ghost" size="sm" icon={FileText}>거래서</Btn> : <span style={{ color: "#9aa0a6" }}>—</span> },
          ]}
          data={MOCK_ASSETS}
        />
      )}

      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_ORDERS.filter(o => o.channel === "EXPORT").map(o => (
            <Card key={o.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
              <Globe size={24} color="#8430ce" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{o.number}</div>
                <div style={{ fontSize: 12, color: "#5f6368" }}>{o.customer} ‧ {o.country || "—"} ‧ {o.items}건</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <Badge status="COMPLETED">Dual-Use 완료</Badge>
                <Badge status="COMPLETED">수출처 검증완료</Badge>
              </div>
              <Btn variant="outline" size="sm" icon={Eye}>조회</Btn>
            </Card>
          ))}
        </div>
      )}

      {tab === "cert" && (
        <Table
          columns={[
            { label: "인증명", render: () => <span style={{ fontWeight: 600 }}>R2v3</span> },
            { label: "인증번호", render: () => "R2-2024-KR-0456" },
            { label: "인증기관", render: () => "SERI (Sustainable Electronics Recycling International)" },
            { label: "만료일", render: () => <span style={{ color: "#e37400", fontWeight: 600 }}>2026-04-24</span> },
            { label: "상태", render: () => <Badge status="PROCESSING">처리중</Badge> },
            { label: "", render: () => <Btn variant="outline" size="sm" icon={FileText}>증명</Btn> },
          ]}
          data={[1]}
        />
      )}
    </div>
  );
};

// ==============================================================
// MAIN APP
// ==============================================================

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage setPage={setPage} />;
      case "crm": return <CRMPage />;
      case "sales": return <SalesPage />;
      case "inventory": return <InventoryPage />;
      case "dpp": return <DPPPage />;
      case "compliance": return <CompliancePage />;
      default: return <DashboardPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#202124", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 60 : 220, background: "#1a1a2e", color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "16px 10px" : "16px 16px", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#188038", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
            G
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>Greeny System</div>
              <div style={{ fontSize: 10, color: "#9aa0a6", whiteSpace: "nowrap" }}>통합 SCM + DPP</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <div key={item.id} onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: sidebarCollapsed ? "10px 18px" : "10px 16px",
                  cursor: "pointer", transition: "all 0.15s",
                  background: active ? "#2a2a4a" : "transparent",
                  borderLeft: active ? "3px solid #1a73e8" : "3px solid transparent",
                  color: active ? "#fff" : "#9aa0a6",
                }}>
                <Icon size={18} />
                {!sidebarCollapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: 16, borderTop: "1px solid #2a2a4a", fontSize: 10, color: "#5f6368" }}>
            <div>DPP Platform v1.0</div>
            <div>EU ESPR Ready</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e0e0e0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#5f6368" }}>
            {NAV_ITEMS.find(n => n.id === page)?.label || "대시보드"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#5f6368" }}>2026-04-09</span>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "#1a73e8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
              JH
            </div>
          </div>
        </div>
        <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
              }
