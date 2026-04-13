import { useState, useMemo, useCallback } from "react";
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
  { id: "cat-1", code: "ICT-LAPTOP", name: "노트북", icon: "💻" },
  { id: "cat-2", code: "ICT-DESKTOP", name: "데스크탑", icon: "🖥️" },
  { id: "cat-3", code: "ICT-SERVER", name: "서버", icon: "🗄️" },
  { id: "cat-4", code: "ICT-HDD", name: "HDD/SSD", icon: "💾" },
  { id: "cat-5", code: "ICT-NETWORK", name: "네트워크장비", icon: "🌐" },
  { id: "cat-6", code: "ICT-MOBILE", name: "모바일", icon: "📱" },
  { id: "cat-7", code: "ICT-MONITOR", name: "모니터", icon: "🖥️" },
  { id: "cat-8", code: "ICT-PRINTER", name: "프린터/복합기", icon: "🖨️" },
];

const GRADES = [
  { code: "A", label: "최상", color: "#188038", bgColor: "#e6f4ea", factor: 1.0, marginTarget: 45 },
  { code: "B", label: "상", color: "#1a73e8", bgColor: "#e8f0fe", factor: 0.75, marginTarget: 35 },
  { code: "C", label: "중", color: "#f9ab00", bgColor: "#fef7e0", factor: 0.5, marginTarget: 25 },
  { code: "D", label: "하", color: "#e37400", bgColor: "#fce8e6", factor: 0.3, marginTarget: 15 },
  { code: "F", label: "폐기/부품", color: "#d93025", bgColor: "#fce8e6", factor: 0.1, marginTarget: 5 },
];

const CHANNELS = [
  { id: "ch-1", code: "RETAIL", name: "소매 (리퍼비시)", icon: Store, color: "#1a73e8" },
  { id: "ch-2", code: "WHOLESALE", name: "도매 (B2B)", icon: Building2, color: "#188038" },
  { id: "ch-3", code: "EXPORT", name: "수출", icon: Globe, color: "#8430ce" },
];

const MOCK_CUSTOMERS = [
  { id: "org-1", name: "테크리사이클 코리아", type: "CUSTOMER", channel: "WHOLESALE", country: "KR", regNo: "123-45-67890", contact: "김영수", email: "ys.kim@techrecycle.kr", phone: "02-1234-5678", totalOrders: 28, totalRevenue: 245000000 },
  { id: "org-2", name: "GreenIT Solutions GmbH", type: "CUSTOMER", channel: "EXPORT", country: "DE", regNo: "DE-987654321", contact: "Hans Mueller", email: "h.mueller@greenit.de", phone: "+49-30-1234567", totalOrders: 12, totalRevenue: 180000000 },
  { id: "org-3", name: "리퍼몰", type: "CUSTOMER", channel: "RETAIL", country: "KR", regNo: "456-78-90123", contact: "박지영", email: "jy.park@refurmall.co.kr", phone: "031-987-6543", totalOrders: 45, totalRevenue: 89000000 },
  { id: "org-4", name: "Asia Recycling Pte Ltd", type: "CUSTOMER", channel: "EXPORT", country: "SG", regNo: "SG-202312345", contact: "Lim Wei", email: "w.lim@asiarecycling.sg", phone: "+65-6789-0123", totalOrders: 8, totalRevenue: 320000000 },
  { id: "org-5", name: "중고나라 파트너스", type: "CUSTOMER", channel: "RETAIL", country: "KR", regNo: "789-01-23456", contact: "이민호", email: "mh.lee@jnpartners.kr", phone: "010-9876-5432", totalOrders: 67, totalRevenue: 56000000 },
];

const MOCK_LEADS = [
  { id: "lead-1", orgId: "org-1", company: "테크리사이클 코리아", contact: "김영수", status: "PROPOSAL", channel: "WHOLESALE", category: "노트북", value: 45000000, qty: 200, nextAction: "견적서 발송", nextDate: "2026-04-12", assignee: "장재혁" },
  { id: "lead-2", orgId: "org-2", company: "GreenIT Solutions GmbH", contact: "Hans Mueller", status: "NEGOTIATION", channel: "EXPORT", category: "서버", value: 120000000, qty: 50, nextAction: "가격 협상 미팅", nextDate: "2026-04-15", assignee: "장재혁" },
  { id: "lead-3", orgId: "org-3", company: "리퍼몰", contact: "박지영", status: "QUALIFIED", channel: "RETAIL", category: "노트북", value: 12000000, qty: 30, nextAction: "제품 샘플 배송", nextDate: "2026-04-10", assignee: "김민수" },
  { id: "lead-4", orgId: "org-4", company: "Asia Recycling Pte Ltd", contact: "Lim Wei", status: "NEW", channel: "EXPORT", category: "HDD/SSD", value: 85000000, qty: 5000, nextAction: "초기 미팅 설정", nextDate: "2026-04-20", assignee: "장재혁" },
  { id: "lead-5", orgId: "org-5", company: "중고나라 파트너스", contact: "이민호", status: "WON", channel: "RETAIL", category: "모바일", value: 8000000, qty: 40, nextAction: "주문서 작성", nextDate: "2026-04-08", assignee: "김민수" },
];

const MOCK_ASSETS = [
  { id: "ast-1", product: "Dell Latitude 5520", category: "노트북", serial: "DL5520-KR-001", lot: "LOT-2026-04-001", grade: "A", status: "READY_FOR_SALE", cost: 180000, location: "GS-A-ST-R01-L2", dpp: true },
  { id: "ast-2", product: "HP ProBook 450 G8", category: "노트북", serial: "HP450-KR-012", lot: "LOT-2026-04-001", grade: "B", status: "READY_FOR_SALE", cost: 150000, location: "GS-A-ST-R01-L3", dpp: true },
  { id: "ast-3", product: "Lenovo ThinkPad T14", category: "노트북", serial: "LT14-KR-088", lot: "LOT-2026-04-002", grade: "A", status: "GRADED", cost: 200000, location: "GS-A-ST-R02-L1", dpp: false },
  { id: "ast-4", product: "Dell PowerEdge R740", category: "서버", serial: "PE740-KR-005", lot: "LOT-2026-03-015", grade: "B", status: "DATA_WIPING", cost: 450000, location: "GS-B-SV-R01-L1", dpp: false },
  { id: "ast-5", product: "Seagate Exos X18 18TB", category: "HDD/SSD", serial: "SG-X18-00234", lot: "LOT-2026-04-003", grade: "C", status: "READY_FOR_SALE", cost: 35000, location: "GS-A-HD-R01-L4", dpp: true },
  { id: "ast-6", product: "Samsung Galaxy S22", category: "모바일", serial: "SGS22-KR-045", lot: "LOT-2026-04-004", grade: "A", status: "READY_FOR_SALE", cost: 120000, location: "GS-A-MB-R01-L1", dpp: true },
  { id: "ast-7", product: "Cisco Catalyst 9300", category: "네트워크장비", serial: "CC9300-KR-003", lot: "LOT-2026-03-020", grade: "D", status: "RECYCLING", cost: 80000, location: "GS-B-RC-R01-L1", dpp: true },
  { id: "ast-8", product: "Dell U2722D 모니터", category: "모니터", serial: "DU27-KR-019", lot: "LOT-2026-04-002", grade: "B", status: "READY_FOR_SALE", cost: 65000, location: "GS-A-MN-R01-L2", dpp: false },
];

const MOCK_ORDERS = [
  { id: "ord-1", number: "GS-SO-20260408-001", channel: "WHOLESALE", customer: "테크리사이클 코리아", status: "CONFIRMED", date: "2026-04-08", items: 200, total: 52000000, margin: 22, currency: "KRW" },
  { id: "ord-2", number: "GS-SO-20260407-003", channel: "EXPORT", customer: "GreenIT Solutions GmbH", status: "SHIPPED", date: "2026-04-07", items: 50, total: 95000, margin: 35, currency: "EUR", country: "DE" },
  { id: "ord-3", number: "GS-SO-20260406-002", channel: "RETAIL", customer: "리퍼몰", status: "DELIVERED", date: "2026-04-06", items: 15, total: 4500000, margin: 42, currency: "KRW" },
  { id: "ord-4", number: "GS-SO-20260405-001", channel: "EXPORT", customer: "Asia Recycling Pte Ltd", status: "PROCESSING", date: "2026-04-05", items: 3000, total: 125000, margin: 28, currency: "USD", country: "SG" },
  { id: "ord-5", number: "GS-SO-20260404-004", channel: "RETAIL", customer: "중고나라 파트너스", status: "COMPLETED", date: "2026-04-04", items: 8, total: 2400000, margin: 48, currency: "KRW" },
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
  NEW: "신규", CONTACTED: "접촉", QUALIFIED: "검증", PROPOSAL: "제안",
  NEGOTIATION: "협상", WON: "수주", LOST: "실주", DRAFT: "초안",
  CONFIRMED: "확정", PROCESSING: "처리중", SHIPPED: "출하", DELIVERED: "배송완료",
  COMPLETED: "완료", CANCELLED: "취소", RECEIVED: "입고", INSPECTING: "검수중",
  GRADED: "등급판정", DATA_WIPING: "데이터삭제중", READY_FOR_SALE: "판매가능",
  RESERVED: "예약", SOLD: "판매완료", RECYCLING: "재활용", DISPOSED: "폐기",
  RETURNED: "반품",
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
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: "center", color: "#9aa0a6" }}>데이터가 없습니다</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
    <Search size={16} color="#9aa0a6" style={{ position: "absolute", left: 12, top: 10 }} />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "검색..."}
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
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
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
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "crm", label: "CRM/영업", icon: Users },
  { id: "sales", label: "판매관리", icon: DollarSign },
  { id: "inventory", label: "재고/등급", icon: Package },
  { id: "dpp", label: "DPP 여권", icon: QrCode },
  { id: "compliance", label: "컴플라이언스", icon: ShieldCheck },
];

// ============================================================
// DASHBOARD PAGE
// ============================================================

const DashboardPage = ({ setPage }) => {
  const pipelineData = [
    { stage: "신규", count: 12, value: 280000000, color: "#e8f0fe" },
    { stage: "검증", count: 8, value: 195000000, color: "#fef7e0" },
    { stage: "제안", count: 5, value: 320000000, color: "#f3e8fd" },
    { stage: "협상", count: 3, value: 180000000, color: "#fce8e6" },
    { stage: "수주", count: 7, value: 410000000, color: "#e6f4ea" },
  ];
  const maxPipeline = Math.max(...pipelineData.map(d => d.value));

  const channelPerf = [
    { channel: "소매", revenue: 89000000, margin: 42, orders: 112, turnover: 2.8 },
    { channel: "도매", revenue: 245000000, margin: 24, orders: 28, turnover: 4.2 },
    { channel: "수출", revenue: 500000000, margin: 31, orders: 20, turnover: 3.5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>대시보드</h2>
          <div style={{ color: "#5f6368", fontSize: 13, marginTop: 2 }}>2026년 4월 실시간 현황</div>
        </div>
        <Btn variant="outline" icon={Download}>리포트 다운로드</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="이번 달 매출" value="8.34억" sub="목표 10억 대비 83%" icon={DollarSign} color="#1a73e8" trend="up" trendValue="+12.5% vs 전월" />
        <KPICard title="평균 마진율" value="31.2%" sub="채널 가중 평균" icon={Percent} color="#188038" trend="up" trendValue="+2.1%p" />
        <KPICard title="판매 가능 재고" value="1,247" sub="등급 판정 완료" icon={Package} color="#f9ab00" trend="down" trendValue="-8.3% (판매 호조)" />
        <KPICard title="재고 회전율" value="3.5x" sub="월간 기준" icon={RotateCcw} color="#8430ce" trend="up" trendValue="+0.3x" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card style={{ flex: 2, minWidth: 360 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>영업 파이프라인</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pipelineData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, fontSize: 12, color: "#5f6368", textAlign: "right" }}>{d.stage}</div>
                <div style={{ flex: 1, height: 28, background: "#f8f9fa", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${(d.value / maxPipeline) * 100}%`, height: "100%", background: d.color, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#202124" }}>{d.count}건 · {formatKRW(d.value)}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ flex: 1.2, minWidth: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>채널별 성과</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {channelPerf.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.channel}</span>
                  <span style={{ fontSize: 13, color: "#5f6368" }}>{formatKRW(c.revenue)}원</span>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#5f6368", marginBottom: 4 }}>
                  <span>마진 {c.margin}%</span>
                  <span>주문 {c.orders}건</span>
                  <span>회전율 {c.turnover}x</span>
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
            <span style={{ fontWeight: 600 }}>등급별 재고 분포</span>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>상세보기 →</Btn>
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
            <span style={{ fontWeight: 600 }}>긴급 알림</span>
            <Badge status="PROCESSING">5건</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: AlertTriangle, color: "#d93025", text: "R2 인증 만료 D-15 (2026-04-24)", type: "인증" },
              { icon: Clock, color: "#e37400", text: "데이터삭제 대기 자산 23건", type: "보안" },
              { icon: Truck, color: "#1a73e8", text: "GreenIT GmbH 수출 건 선적 예정 (04/11)", type: "수출" },
              { icon: Shield, color: "#8430ce", text: "수출규제 검토 필요 3건 (싱가포르)", type: "규제" },
              { icon: Star, color: "#f9ab00", text: "A등급 노트북 재고 부족 (목표 대비 60%)", type: "재고" },
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
  const pipelineLabels = { NEW: "신규", CONTACTED: "접촉", QUALIFIED: "검증", PROPOSAL: "제안", NEGOTIATION: "협상", WON: "수주" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>CRM / 영업관리</h2>
        <Btn variant="primary" icon={Plus}>신규 리드 등록</Btn>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["pipeline", "파이프라인"], ["customers", "고객사"], ["activities", "활동내역"]].map(([key, label]) => (
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
                      <div style={{ fontSize: 11, color: "#5f6368", marginBottom: 6 }}>{lead.contact} · {lead.category}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <ChannelBadge channelCode={lead.channel} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#188038" }}>{formatKRW(lead.value)}원</span>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 11, color: "#5f6368", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} /> {lead.nextDate} · {lead.nextAction}
                      </div>
                    </Card>
                  ))}
                  {stageLeads.length === 0 && <div style={{ textAlign: "center", color: "#9aa0a6", fontSize: 12, padding: 20 }}>없음</div>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="고객사/담당자 검색..." />
          </div>
        </>
      )}

      {tab === "customers" && (
        <Table
          columns={[
            { label: "고객사", key: "name", render: r => <div><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.regNo}</div></div> },
            { label: "유형", render: r => <ChannelBadge channelCode={r.channel} />, nowrap: true },
            { label: "국가", key: "country", nowrap: true },
            { label: "담당자", render: r => <div><div>{r.contact}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.email}</div></div> },
            { label: "주문", key: "totalOrders", align: "right", nowrap: true },
            { label: "누적매출", render: r => <span style={{ fontWeight: 600 }}>{formatKRW(r.totalRevenue)}원</span>, align: "right", nowrap: true },
          ]}
          data={MOCK_CUSTOMERS}
        />
      )}

      {tab === "activities" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { type: "CALL", icon: Phone, time: "오늘 14:30", target: "테크리사이클 코리아 · 김영수", desc: "LOT-2026-04-001 노트북 200대 견적 논의. B등급 단가 조정 요청 (260,000→240,000)", assignee: "장재혁" },
            { type: "EMAIL", icon: Mail, time: "오늘 11:00", target: "GreenIT Solutions GmbH · Hans Mueller", desc: "서버 50대 수출 계약서 초안 발송. Incoterms FOB Incheon 확인", assignee: "장재혁" },
            { type: "MEETING", icon: Users, time: "어제 16:00", target: "리퍼몰 · 박지영", desc: "A등급 노트북 샘플 3대 전달. 리퍼비시 품질 기준 합의", assignee: "김민수" },
            { type: "NOTE", icon: FileText, time: "04/07", target: "Asia Recycling Pte Ltd", desc: "싱가포르 수출규제 확인 필요. Dual-use 품목 포함 여부 검토 중", assignee: "장재혁" },
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
                <div style={{ fontSize: 11, color: "#9aa0a6", marginTop: 4 }}>담당: {a.assignee}</div>
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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>판매관리</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={FileText}>견적서 작성</Btn>
          <Btn variant="primary" icon={Plus}>신규 주문</Btn>
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
        <KPICard title="이번 달 주문" value={`${filtered.length}건`} icon={FileText} color="#1a73e8" />
        <KPICard title="총 매출" value={channelFilter === "ALL" ? "8.34억" : formatKRW(filtered.reduce((s, o) => s + (o.currency === "KRW" ? o.total : o.total * 1350), 0)) + "원"} icon={DollarSign} color="#188038" />
        <KPICard title="평균 마진" value={`${(filtered.reduce((s, o) => s + o.margin, 0) / Math.max(filtered.length, 1)).toFixed(1)}%`} icon={Percent} color="#f9ab00" />
      </div>

      {selectedOrder ? (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedOrder(null)}>목록으로</Btn>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" icon={Edit3}>수정</Btn>
              <Btn variant="success" icon={Truck}>출하처리</Btn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0a6" }}>주문번호</div>
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
              <div style={{ fontSize: 12, fontWeight: 600, color: "#8430ce", marginBottom: 4 }}>수출 정보</div>
              <div style={{ fontSize: 12, color: "#5f6368" }}>대상국: {selectedOrder.country} · Incoterms: FOB · 수출규제 검토: 완료</div>
            </div>
          )}
        </Card>
      ) : (
        <Table
          columns={[
            { label: "주문번호", render: r => <span style={{ fontWeight: 600, color: "#1a73e8" }}>{r.number}</span>, nowrap: true },
            { label: "채널", render: r => <ChannelBadge channelCode={r.channel} />, nowrap: true },
            { label: "고객사", key: "customer" },
            { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
            { label: "수량", key: "items", align: "right", nowrap: true, render: r => `${r.items}건` },
            { label: "금액", align: "right", nowrap: true, render: r => (
              <span style={{ fontWeight: 600 }}>
                {r.currency === "KRW" ? formatKRW(r.total) + "원" : `${r.currency} ${r.total.toLocaleString()}`}
              </span>
            )},
            { label: "마진", align: "right", nowrap: true, render: r => (
              <span style={{ color: r.margin >= 30 ? "#188038" : r.margin >= 20 ? "#e37400" : "#d93025", fontWeight: 600 }}>{r.margin}%</span>
            )},
            { label: "일자", key: "date", nowrap: true },
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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>재고 / 등급관리</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" icon={Tag}>등급 기준 설정</Btn>
          <Btn variant="primary" icon={Plus}>자산 입고</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["assets", "자산 목록"], ["gradeMatrix", "등급 매트릭스"], ["turnover", "회전율 분석"]].map(([key, label]) => (
          <Btn key={key} variant={view === key ? "primary" : "default"} size="sm" onClick={() => setView(key)}>{label}</Btn>
        ))}
      </div>

      {view === "assets" && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="제품명/시리얼 검색..." />
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
              { label: "제품", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
              { label: "분류", key: "category", nowrap: true },
              { label: "LOT", key: "lot", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.lot}</span> },
              { label: "등급", render: r => <GradeBadge gradeCode={r.grade} />, nowrap: true },
              { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
              { label: "원가", align: "right", nowrap: true, render: r => `₩${r.cost.toLocaleString()}` },
              { label: "위치", key: "location", nowrap: true, render: r => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{r.location}</span> },
              { label: "DPP", align: "center", nowrap: true, render: r => r.dpp ? <CheckCircle2 size={16} color="#188038" /> : <span style={{ color: "#9aa0a6" }}>—</span> },
            ]}
            data={filteredAssets}
          />
        </>
      )}

      {view === "gradeMatrix" && (
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>품목별 등급 매트릭스 — 재고수량 / 예상 판매단가 / 목표 마진율</div>
          <div style={{ fontSize: 12, color: "#5f6368", marginBottom: 16 }}>등급별 가격 계수와 마진 목표가 반영된 품목×등급 매트릭스</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "2px solid #e0e0e0" }}>품목</th>
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
                        <div style={{ color: g.color, fontSize: 10, fontWeight: 600 }}>마진 {g.margin}%</div>
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
            <KPICard title="전체 재고회전율" value="3.5x" sub="월간 평균" icon={RotateCcw} color="#1a73e8" trend="up" trendValue="+0.3x" />
            <KPICard title="A등급 회전율" value="5.2x" sub="가장 빠름" icon={Star} color="#188038" trend="up" trendValue="+0.8x" />
            <KPICard title="D등급 체류일" value="45일" sub="평균 재고 체류" icon={Clock} color="#d93025" trend="down" trendValue="-5일" />
          </div>
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>등급별 재고 회전율 (30일 기준)</div>
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
            <div style={{ fontWeight: 600, marginBottom: 8 }}>회전율 개선 추천</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { action: "D등급 HDD/SSD 일괄 수출 가격 제안", target: "Asia Recycling Pte Ltd", impact: "재고 -148건, 회전율 +0.8x", priority: "높음" },
                { action: "C등급 노트북 도매 번들 프로모션", target: "테크리사이클 코리아", impact: "마진 +3%p, 체류일 -8일", priority: "중간" },
                { action: "A등급 모바일 소매 단가 5% 인상", target: "전 소매 채널", impact: "마진 +5%p, 회전율 유지", priority: "중간" },
              ].map((rec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#f8f9fa", borderRadius: 8 }}>
                  <TrendingUp size={16} color="#188038" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.action}</div>
                    <div style={{ fontSize: 11, color: "#5f6368" }}>대상: {rec.target} · 예상효과: {rec.impact}</div>
                  </div>
                  <Badge status={rec.priority === "높음" ? "NEGOTIATION" : "QUALIFIED"}>{rec.priority}</Badge>
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
      { name: "알루미늄", pct: 32, recycled: 18 },
      { name: "강철", pct: 18, recycled: 45 },
      { name: "플라스틱 (ABS)", pct: 22, recycled: 8 },
      { name: "구리", pct: 8, recycled: 30 },
      { name: "기타", pct: 20, recycled: 12 },
    ],
    substances: [{ name: "납 (Pb)", cas: "7439-92-1", conc: "0.001%" }],
    repairScore: 7.8,
    recyclability: 0.87,
    lifecycle: [
      { event: "제조", date: "2023-06-15", location: "Suzhou, China", performer: "Dell Inc." },
      { event: "1차 사용", date: "2023-07~2025-12", location: "Seoul, Korea", performer: "삼성전자 (IT자산)" },
      { event: "ITAD 수거", date: "2026-01-20", location: "안양시", performer: "Greeny System" },
      { event: "데이터 삭제", date: "2026-02-01", location: "안양시", performer: "Greeny System", detail: "NIST 800-88 Clear" },
      { event: "검수/등급판정", date: "2026-02-05", location: "안양시", performer: "Greeny System", detail: "A등급 판정" },
      { event: "DPP 발급", date: "2026-02-06", location: "—", performer: "DPP System", detail: "여권 활성화" },
    ],
    endOfLife: {
      disassembly: "https://dpp.greenysystem.com/docs/latitude5520-disassembly",
      hazardous: ["배터리 (Li-ion 54Wh)", "LCD 패널"],
      recommendation: "리퍼비시 → 재판매 (A등급)",
    },
  };

  if (selectedDpp) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="ghost" icon={ArrowLeft} onClick={() => setSelectedDpp(null)}>목록으로</Btn>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>디지털 제품 여권 (DPP)</h2>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0a6" }}>제품</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{mockPassport.product}</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{mockPassport.manufacturer} · {mockPassport.category}</div>
              </div>
              <GradeBadge gradeCode={mockPassport.grade} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><span style={{ color: "#9aa0a6" }}>UPI: </span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{mockPassport.uid}</span></div>
              <div><span style={{ color: "#9aa0a6" }}>수리가능성: </span><span style={{ fontWeight: 600 }}>{mockPassport.repairScore}/10</span></div>
              <div><span style={{ color: "#9aa0a6" }}>재활용률: </span><span style={{ fontWeight: 600 }}>{(mockPassport.recyclability * 100).toFixed(0)}%</span></div>
              <div><span style={{ color: "#9aa0a6" }}>상태: </span><Badge status="COMPLETED">활성</Badge></div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>소재 구성</div>
              {mockPassport.materials.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span style={{ width: 100, fontSize: 12 }}>{m.name}</span>
                  <div style={{ flex: 1, height: 14, background: "#f1f3f4", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${m.pct}%`, height: "100%", background: "#1a73e8", borderRadius: 4, opacity: 0.7 }} />
                    <div style={{ width: `${m.recycled}%`, height: "100%", background: "#188038", borderRadius: 4, position: "absolute", top: 0, left: 0 }} />
                  </div>
                  <span style={{ fontSize: 11, width: 30, textAlign: "right" }}>{m.pct}%</span>
                  <span style={{ fontSize: 10, color: "#188038", width: 50 }}>♻️ {m.recycled}%</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: "#9aa0a6", marginTop: 4 }}>
                <span style={{ color: "#1a73e8" }}>■</span> 전체 비율 &nbsp;
                <span style={{ color: "#188038" }}>■</span> 재활용 소재 비율
              </div>
            </div>
          </Card>

          <Card style={{ flex: 1, minWidth: 320 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>라이프사이클 타임라인</div>
            <div style={{ position: "relative", paddingLeft: 24 }}>
              <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "#e0e0e0" }} />
              {mockPassport.lifecycle.map((evt, i) => (
                <div key={i} style={{ position: "relative", paddingBottom: 16, paddingLeft: 16 }}>
                  <div style={{ position: "absolute", left: -20, top: 2, width: 12, height: 12, borderRadius: 6, background: i === mockPassport.lifecycle.length - 1 ? "#188038" : "#1a73e8", border: "2px solid #fff" }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{evt.event}</div>
                  <div style={{ fontSize: 11, color: "#5f6368" }}>{evt.date} · {evt.location}</div>
                  <div style={{ fontSize: 11, color: "#5f6368" }}>{evt.performer}{evt.detail ? ` — ${evt.detail}` : ""}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, padding: 12, background: "#e6f4ea", borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#188038", marginBottom: 4 }}>수명종료 가이드</div>
              <div style={{ fontSize: 11, color: "#5f6368" }}>
                <div>추천: {mockPassport.endOfLife.recommendation}</div>
                <div>유해부품: {mockPassport.endOfLife.hazardous.join(", ")}</div>
              </div>
            </div>
          </Card>
        </div>

        <Card style={{ padding: 12, background: "#f8f9fa", display: "flex", alignItems: "center", gap: 12 }}>
          <QrCode size={40} color="#1a73e8" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>QR 코드로 공개 조회</div>
            <div style={{ fontSize: 11, color: "#5f6368", fontFamily: "monospace" }}>{mockPassport.publicUrl}</div>
          </div>
          <Btn variant="outline" size="sm" icon={Download}>QR 다운로드</Btn>
          <Btn variant="primary" size="sm" icon={Globe}>공개 페이지</Btn>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>DPP 디지털 제품여권</h2>
          <div style={{ fontSize: 12, color: "#5f6368" }}>EU ESPR 규제 준수 — GS1 Digital Link 기반</div>
        </div>
        <Btn variant="primary" icon={Plus}>여권 발급</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard title="발급된 여권" value={`${dppAssets.length}건`} icon={QrCode} color="#1a73e8" />
        <KPICard title="활성 상태" value={`${dppAssets.length}건`} icon={CheckCircle2} color="#188038" />
        <KPICard title="미발급 자산" value={`${MOCK_ASSETS.filter(a => !a.dpp).length}건`} icon={AlertTriangle} color="#f9ab00" />
      </div>

      <Table
        columns={[
          { label: "제품", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
          { label: "분류", key: "category", nowrap: true },
          { label: "등급", render: r => <GradeBadge gradeCode={r.grade} />, nowrap: true },
          { label: "상태", render: r => <Badge status={r.status} />, nowrap: true },
          { label: "DPP", render: r => r.dpp ? <span style={{ color: "#188038", fontWeight: 600 }}>✓ 발급됨</span> : <span style={{ color: "#9aa0a6" }}>미발급</span> },
          { label: "", render: r => r.dpp ? <Btn variant="ghost" size="sm" icon={Eye}>조회</Btn> : <Btn variant="outline" size="sm" icon={Plus}>발급</Btn>, align: "right" },
        ]}
        data={MOCK_ASSETS}
        onRowClick={(r) => { if (r.dpp) setSelectedDpp(r); }}
      />
    </div>
  );
};

// ============================================================
// COMPLIANCE PAGE
// ============================================================

const CompliancePage = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>보안 컴플라이언스</h2>
        <Btn variant="primary" icon={Shield}>규제 검증 실행</Btn>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["overview", "종합현황"], ["wipe", "데이터삭제"], ["export", "수출규제"], ["cert", "인증관리"]].map(([key, label]) => (
          <Btn key={key} variant={tab === key ? "primary" : "default"} size="sm" onClick={() => setTab(key)}>{label}</Btn>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <KPICard title="데이터삭제 완료율" value="94.2%" sub="이번 달 입고 기준" icon={Shield} color="#188038" trend="up" trendValue="+1.8%p" />
            <KPICard title="삭제 대기 자산" value="23건" sub="즉시 처리 필요" icon={Clock} color="#e37400" />
            <KPICard title="수출규제 검토" value="3건" sub="검토 대기" icon={Globe} color="#8430ce" />
            <KPICard title="인증 만료 예정" value="1건" sub="30일 이내" icon={AlertTriangle} color="#d93025" />
          </div>

          <Card>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>컴플라이언스 체크리스트</div>
            {[
              { area: "데이터 보안", items: [
                { name: "NIST 800-88 기반 삭제 프로세스", status: "pass" },
                { name: "삭제 인증서 자동 생성 및 보관", status: "pass" },
                { name: "고객 데이터 잔존 검증 (랜덤 샘플링)", status: "pass" },
                { name: "삭제 불가 자산 물리적 파쇄 처리", status: "warn" },
              ]},
              { area: "수출 규제", items: [
                { name: "이중용도(Dual-Use) 품목 스크리닝", status: "pass" },
                { name: "수출 대상국 제재 목록 확인", status: "review" },
                { name: "수출허가 문서 완비", status: "pass" },
              ]},
              { area: "환경 규제", items: [
                { name: "EU WEEE 보고 데이터 준비", status: "pass" },
                { name: "RoHS 유해물질 검사 기록", status: "pass" },
                { name: "ESPR DPP 데이터 구조 준수", status: "pass" },
              ]},
              { area: "인증", items: [
                { name: "R2v3 인증 유효 (만료: 2026-04-24)", status: "warn" },
                { name: "ISO 14001 유효", status: "pass" },
                { name: "ISO 27001 유효", status: "pass" },
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
                      {item.status === "pass" ? "완료" : item.status === "warn" ? "주의" : "검토중"}
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
            { label: "자산", render: r => <div><div style={{ fontWeight: 600 }}>{r.product}</div><div style={{ fontSize: 11, color: "#5f6368" }}>{r.serial}</div></div> },
            { label: "삭제 표준", nowrap: true, render: () => "NIST 800-88 Clear" },
            { label: "상태", render: r => <Badge status={r.status === "DATA_WIPING" ? "PROCESSING" : r.status === "READY_FOR_SALE" ? "COMPLETED" : "DRAFT"}>
              {r.status === "DATA_WIPING" ? "삭제중" : r.status === "READY_FOR_SALE" ? "완료" : "대기"}
            </Badge>, nowrap: true },
            { label: "인증서", render: r => r.status === "READY_FOR_SALE" ? <Btn variant="ghost" size="sm" icon={FileText}>다운로드</Btn> : <span style={{ color: "#9aa0a6" }}>—</span> },
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
                <div style={{ fontSize: 12, color: "#5f6368" }}>{o.customer} · {o.country || "—"} · {o.items}건</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <Badge status="COMPLETED">Dual-Use 통과</Badge>
                <Badge status="COMPLETED">제재 목록 확인</Badge>
              </div>
              <Btn variant="outline" size="sm" icon={Eye}>상세</Btn>
            </Card>
          ))}
        </div>
      )}

      {tab === "cert" && (
        <Table
          columns={[
            { label: "인증", render: () => <span style={{ fontWeight: 600 }}>R2v3</span> },
            { label: "인증번호", render: () => "R2-2024-KR-0456" },
            { label: "발급기관", render: () => "SERI (Sustainable Electronics Recycling International)" },
            { label: "만료일", render: () => <span style={{ color: "#e37400", fontWeight: 600 }}>2026-04-24</span> },
            { label: "상태", render: () => <Badge status="PROCESSING">갱신 필요</Badge> },
            { label: "", render: () => <Btn variant="outline" size="sm" icon={FileText}>인증서</Btn> },
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
