 "장재혁" },
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
