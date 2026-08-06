(function(){
  // ฉีด HTML เนื้อหาทั้งหมดเข้า container — แก้ไข/อัปเดตเนื้อหาที่ไฟล์นี้แทน ไม่ต้องแตะ index.html อีกต่อไป
  document.getElementById('app').innerHTML = `
<header>
  <div class="wrap bar">
    <div class="brand">
      <span class="mark">คุ้มทุน<span style="color:var(--primary)">.</span></span>
      <span class="tag">ROI CALC — v1</span>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--ink-faint);">
      เครื่องคำนวณการลงทุนพลังงาน
    </div>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <h1>คำนวณว่าการลงทุน <em>ประหยัดพลังงาน</em><br/>ของคุณคุ้มทุนเมื่อไหร่ แม่นยำแค่ไหน</h1>
    <p>ใส่ตัวเลขจริงของอุปกรณ์ที่สนใจ ระบบจะคำนวณให้ครบทุกปัจจัย — เงินลงทุนสุทธิ ดอกเบี้ยเงินกู้ ค่าไฟที่เพิ่มขึ้นทุกปี ค่าบำรุงรักษา การเสื่อมประสิทธิภาพของอุปกรณ์ มูลค่าซาก ไปจนถึงมูลค่าเงินตามเวลา (NPV/IRR) เพื่อให้เห็นภาพการคืนทุนที่ใกล้เคียงความจริงที่สุด</p>
    <div class="hero-meta">
      <span>เลือกได้ <b>8</b> ประเภทอุปกรณ์</span>
      <span>คำนวณ <b>9</b> ตัวชี้วัดทางการเงิน</span>
      <span>อัปเดตผลลัพธ์ <b>ทันที</b></span>
    </div>
  </div>
</section>

<div class="wrap">
  <!-- Equipment tabs -->
  <div class="tabs" id="tabs"></div>

  <!-- AD SLOT 1: top banner — อยู่หลังแท็บเลือกอุปกรณ์ ก่อนเริ่มฟอร์มกรอกข้อมูล -->
  <div class="ad-slot">
    <span class="ad-label">โฆษณา · Advertisement</span>
    <div class="ad-box" id="ad-slot-top">728×90 / responsive banner</div>
  </div>

  <div class="grid-main">
    <!-- INPUT COLUMN -->
    <div>
      <div class="panel" id="subcalc-panel">
        <!-- injected sub-calculator per equipment type -->
      </div>

      <div class="panel">
        <h2>เงินลงทุนและแหล่งเงินทุน</h2>
        <p class="desc">ต้นทุนอุปกรณ์สุทธิหลังหักส่วนลด และวิธีการชำระเงิน</p>

        <div class="field-row">
          <div class="field">
            <label id="f-cost-label">เงินลงทุนเริ่มต้น <span class="hint">บาท</span></label>
            <input type="number" id="f-cost" value="150000" min="0" />
            <span class="note" id="f-cost-note" style="display:none;">คำนวณอัตโนมัติจากข้อมูลในแท็บที่เลือกด้านซ้าย (แก้ไขตัวเลขต้นทางด้านบนแทน)</span>
          </div>
          <div class="field" id="f-subsidy-field">
            <label>เงินอุดหนุน/ส่วนลด <span class="hint">บาท</span></label>
            <input type="number" id="f-subsidy" value="0" min="0" />
          </div>
        </div>

        <div class="toggle-row" id="f-loan-toggle-row">
          <input type="checkbox" id="f-loan-enabled" />
          <label for="f-loan-enabled">ผ่อนชำระผ่านสินเชื่อ (ไม่จ่ายเงินสดเต็มจำนวน)</label>
        </div>

        <div id="loan-fields" style="display:none;">
          <div class="field-row">
            <div class="field">
              <label>เงินดาวน์ <span class="hint">%</span></label>
              <input type="number" id="f-downpayment" value="20" min="0" max="100" />
            </div>
            <div class="field">
              <label>อัตราดอกเบี้ยเงินกู้ <span class="hint">% / ปี</span></label>
              <input type="number" id="f-loan-rate" value="5" min="0" step="0.1" />
            </div>
          </div>
          <div class="field-row single">
            <div class="field">
              <label>ระยะเวลาผ่อน <span class="hint">ปี</span></label>
              <input type="number" id="f-loan-term" value="5" min="1" />
            </div>
          </div>
        </div>

        <div class="advanced-toggle" id="capex-toggle" style="border-top:1px dashed var(--line);margin-top:14px;padding-top:14px;">
          <span><b>ค่าเปลี่ยนอะไหล่/บำรุงรักษาใหญ่ระหว่างทาง</b> — เช่น เปลี่ยนเมมเบรน, อินเวอร์เตอร์, แบตเตอรี่ (ถ้ามี)</span>
          <span class="chev" id="capex-chev">›</span>
        </div>
        <div class="advanced-body" id="capex-body" style="border-top:none;padding-top:0;">
          <div id="capex-rows"></div>
          <div class="period-actions">
            <button type="button" class="btn-add-period" id="capex-add-btn">+ เพิ่มรายการ</button>
            <span class="note" id="capex-empty-note">ไม่มีรายการ (จะไม่มีผลต่อการคำนวณ)</span>
          </div>
          <span class="note" id="capex-range-warning" style="display:none;color:var(--rust);"></span>
          <span class="note">แต่ละรายการจะถูกหักออกจากกระแสเงินสดเป็นก้อนเดียวในปีที่ระบุ ต่างจาก "ค่าบำรุงรักษา" ด้านล่างที่หักซ้ำทุกปี</span>
        </div>
      </div>

      <div class="panel">
        <h2 id="energy-panel-title">ค่าไฟฟ้าและพลังงาน</h2>
        <p class="desc" id="energy-panel-desc">ใช้คำนวณมูลค่าเงินที่ประหยัดได้ และปริมาณ CO2 ที่ลดได้</p>
        <div class="field-row">
          <div class="field" id="f-elec-rate-field">
            <label>อัตราค่าไฟฟ้าปัจจุบัน <span class="hint">บาท/หน่วย</span></label>
            <input type="number" id="f-elec-rate" value="4.4" min="0" step="0.01" />
          </div>
          <div class="field">
            <label id="f-escalation-label">อัตราค่าไฟเพิ่มขึ้นเฉลี่ย <span class="hint">% / ปี</span></label>
            <input type="number" id="f-escalation" value="3" min="0" step="0.1" />
          </div>
        </div>
      </div>

      <div class="panel">
        <h2>ค่าบำรุงรักษาและค่าใช้จ่ายอื่นๆ</h2>
        <p class="desc" id="maint-panel-desc">ค่าใช้จ่ายที่เกิดขึ้นทุกปีตลอดอายุการใช้งาน (แยกจากเงินลงทุนก้อนแรก)</p>
        <div class="field-row">
          <div class="field">
            <label id="f-maintenance-label">ค่าบำรุงรักษา <span class="hint">บาท/ปี</span></label>
            <input type="number" id="f-maintenance" value="1500" />
            <span class="note" id="f-maintenance-note" style="display:none;">คำนวณอัตโนมัติจากส่วนต่างค่าบำรุงรักษาในแท็บด้านซ้าย (แก้ไขตัวเลขต้นทางด้านบนแทน)</span>
          </div>
          <div class="field">
            <label id="f-other-cost-label">ค่าใช้จ่ายอื่นๆ ต่อปี <span class="hint">บาท/ปี</span></label>
            <input type="number" id="f-other-cost" value="0" />
            <span class="note" id="f-other-cost-note">เช่น ค่าประกันภัยรถยนต์/อุปกรณ์, ภาษีประจำปี, ค่าธรรมเนียมต่างๆ ที่ไม่ใช่ค่าบำรุงรักษาโดยตรง แต่ต้องจ่ายทุกปี</span>
          </div>
        </div>
        <div class="field-row single">
          <div class="field">
            <label>เงินเฟ้อค่าบำรุงรักษา/ค่าใช้จ่ายอื่นๆ <span class="hint">% / ปี</span></label>
            <input type="number" id="f-maint-inflation" value="2" min="0" step="0.1" />
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="advanced-toggle" id="advanced-toggle">
          <span><b>สมมติฐานขั้นสูง</b> — อายุใช้งาน, การเสื่อมสภาพ, มูลค่าซาก, อัตราคิดลด</span>
          <span class="chev" id="advanced-chev">›</span>
        </div>
        <div class="advanced-body" id="advanced-body">
          <div class="field-row">
            <div class="field">
              <label>อายุการใช้งานอุปกรณ์ <span class="hint">ปี</span></label>
              <input type="number" id="f-lifespan" value="20" min="1" />
              <span class="note" id="f-lifespan-note" style="display:none;">ในแท็บรถยนต์ ค่านี้คำนวณอัตโนมัติจาก “จำนวนปีที่จะใช้รถ” ด้านซ้าย เพราะขายรถไปแล้วเทียบต่อไม่ได้ (แก้ไขตัวเลขต้นทางด้านบนแทน)</span>
            </div>
            <div class="field">
              <label>ประสิทธิภาพลดลงต่อปี <span class="hint">% / ปี</span></label>
              <input type="number" id="f-degradation" value="0.5" min="0" step="0.1" />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>มูลค่าซากเมื่อหมดอายุ <span class="hint">% ของทุน</span></label>
              <input type="number" id="f-salvage" value="5" min="0" max="100" />
              <span class="note" id="f-salvage-note" style="display:none;">ในแท็บนี้ ตัวเลข % นี้เป็นค่าอ้างอิงเท่านั้น ระบบใช้มูลค่าซากที่เป็นบาทจริง (ดูในกล่องพรีวิวด้านซ้าย) ไปคำนวณเสมอ แม้ % จะแสดง 0 ได้ในบางกรณี</span>
            </div>
            <div class="field">
              <label>ปีที่จะขาย/รับมูลค่าซาก <span class="hint">ปี</span></label>
              <input type="number" id="f-sell-year" value="20" min="1" />
              <span class="note" id="f-sell-year-note">ถ้าขายก่อนครบอายุใช้งาน ระบบจะหยุดนับเงินประหยัดหลังปีนี้ และรับมูลค่าซากเป็นเงินก้อนในปีนี้แทน ค่าเริ่มต้น = อายุการใช้งานอุปกรณ์</span>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>อัตราคิดลด (สำหรับ NPV/IRR) <span class="hint">% / ปี</span></label>
              <input type="number" id="f-discount" value="7" min="0" step="0.1" />
            </div>
            <div class="field">
              <label>ค่าปล่อย CO2 ต่อหน่วยไฟฟ้า <span class="hint">kg/kWh</span></label>
              <input type="number" id="f-co2" value="0.4999" min="0" step="0.0001" />
              <span class="note">ค่าเริ่มต้นอ้างอิงค่าเฉลี่ยระบบไฟฟ้าไทย (Grid Emission Factor)</span>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-recalc" id="recalc-btn">คำนวณผลลัพธ์</button>
    </div>

    <!-- RESULTS COLUMN -->
    <div>
      <div class="print-header">
        <div class="brand-line">คุ้มทุน. — รายงานผลการวิเคราะห์ ROI</div>
        <div class="meta-line" id="print-meta">—</div>
      </div>
      <div class="print-summary">
        <h3>สรุปสมมติฐานที่ใช้คำนวณ</h3>
        <div class="grid" id="print-summary-grid"></div>
      </div>

      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
          <div>
            <h2>ผลการวิเคราะห์ความคุ้มค่า</h2>
            <p class="desc" id="active-equipment-desc" style="margin-bottom:0;">—</p>
          </div>
          <button class="btn-export" id="export-btn" title="เปิดหน้าต่างพิมพ์ — เลือก “บันทึกเป็น PDF” เพื่อดาวน์โหลด หรือแชร์ไฟล์ให้คนอื่นดู">
            📄 Export / Share PDF
          </button>
        </div>

        <div class="kpi-grid">
          <div class="kpi accent">
            <div class="lbl">คืนทุนแบบธรรมดา</div>
            <div class="val" id="kpi-payback">—<span>ปี</span></div>
          </div>
          <div class="kpi">
            <div class="lbl">คืนทุนแบบคิดลด</div>
            <div class="val" id="kpi-dpayback">—<span>ปี</span></div>
          </div>
          <div class="kpi">
            <div class="lbl">ROI ตลอดอายุใช้งาน</div>
            <div class="val" id="kpi-roi">—<span>%</span></div>
          </div>
          <div class="kpi accent">
            <div class="lbl">NPV (มูลค่าปัจจุบันสุทธิ)</div>
            <div class="val" id="kpi-npv">—<span>บาท</span></div>
          </div>
          <div class="kpi">
            <div class="lbl">IRR (อัตราผลตอบแทน)</div>
            <div class="val" id="kpi-irr">—<span>%/ปี</span></div>
          </div>
          <div class="kpi">
            <div class="lbl">ประหยัดรวมตลอดอายุ</div>
            <div class="val" id="kpi-total-savings">—<span>บาท</span></div>
          </div>
        </div>

        <div class="chart-wrap">
          <h3>กระแสเงินสดสะสม</h3>
          <p class="sub">เส้นตัดศูนย์คือจุดคืนทุน — พื้นที่ใต้เส้นสีเขียวคือกำไรสุทธิตลอดอายุอุปกรณ์</p>
          <div style="position:relative;height:260px;">
            <canvas id="cashflow-chart"></canvas>
          </div>
          <p class="sub" id="chart-fallback" style="display:none;color:var(--rust);margin-top:10px;">ไม่สามารถโหลดกราฟได้ (เช่น ไม่มีการเชื่อมต่ออินเทอร์เน็ต) — ตัวเลขและใบสรุปด้านล่างยังคำนวณให้ตามปกติ</p>
        </div>

        <div class="kpi-grid" style="margin-top:14px;grid-template-columns:1fr 1fr;">
          <div class="kpi warn">
            <div class="lbl" id="kpi-co2-label">CO2 ที่ลดได้ตลอดอายุใช้งาน</div>
            <div class="val" id="kpi-co2">—<span id="kpi-co2-unit">ตัน</span></div>
          </div>
          <div class="kpi">
            <div class="lbl">ประหยัดเดือนแรก</div>
            <div class="val" id="kpi-monthly">—<span>บาท</span></div>
          </div>
        </div>
      </div>

      <div class="receipt-outer">
        <div class="receipt">
          <h3>ใบสรุปกระแสเงินสดรายปี</h3>
          <div class="sub" id="receipt-sub">—</div>
          <div class="receipt-table-scroll">
            <table class="receipt-table">
              <thead>
                <tr><th>ปี</th><th>ประหยัด</th><th>ค่าใช้จ่าย</th><th>สุทธิ</th><th>สะสม</th></tr>
              </thead>
              <tbody id="receipt-body"></tbody>
            </table>
          </div>
          <div class="receipt-total">
            <span>รวมกำไรสุทธิตลอดอายุ</span>
            <span id="receipt-total-val">—</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- AD SLOT 2: mid-content — จุดพักตามธรรมชาติ หลังผลลัพธ์ ก่อนอภิธานศัพท์ ไม่แทรกกลางฟอร์ม/ผลลัพธ์ -->
  <div class="ad-slot">
    <span class="ad-label">โฆษณา · Advertisement</span>
    <div class="ad-box" id="ad-slot-mid">728×90 / responsive banner</div>
  </div>

  <!-- GLOSSARY -->
  <section class="glossary">
    <h2>อ่านผลลัพธ์ให้เข้าใจ</h2>
    <div class="glossary-grid">
      <div class="gterm">
        <div class="t">คืนทุนแบบธรรมดา (Simple Payback)</div>
        <p>ระยะเวลาที่เงินประหยัดสะสม (ยังไม่คิดมูลค่าเงินตามเวลา) เท่ากับเงินลงทุนที่จ่ายไป ยิ่งสั้นยิ่งดี เป็นตัวเลขที่เข้าใจง่ายที่สุด</p>
      </div>
      <div class="gterm">
        <div class="t">คืนทุนแบบคิดลด (Discounted Payback)</div>
        <p>เหมือนข้อข้างบน แต่ปรับมูลค่าเงินในอนาคตให้เป็นมูลค่าปัจจุบันก่อน จึงมักนานกว่าคืนทุนแบบธรรมดาเสมอ และแม่นยำกว่าในการเทียบกับทางเลือกการลงทุนอื่น</p>
      </div>
      <div class="gterm">
        <div class="t">NPV — มูลค่าปัจจุบันสุทธิ</div>
        <p>มูลค่าเป็นเงินบาท ณ วันนี้ของกำไรทั้งหมดตลอดอายุการใช้งาน หลังหักเงินลงทุนแล้ว หากเป็นบวก แปลว่าการลงทุนนี้คุ้มค่ากว่าการฝากเงินไว้เฉยๆ ที่อัตราคิดลดที่กำหนด</p>
      </div>
      <div class="gterm">
        <div class="t">IRR — อัตราผลตอบแทนภายใน</div>
        <p>อัตราผลตอบแทนต่อปีของเงินลงทุนนี้ เทียบได้กับดอกเบี้ยเงินฝากหรือผลตอบแทนกองทุน ถ้า IRR สูงกว่าอัตราคิดลดที่ตั้งไว้ แปลว่าคุ้มค่าลงทุน</p>
      </div>
      <div class="gterm">
        <div class="t">ROI — ผลตอบแทนรวม</div>
        <p>เปอร์เซ็นต์กำไรสุทธิเทียบกับเงินลงทุนตั้งต้น ตลอดอายุการใช้งานทั้งหมด ไม่ได้คำนึงถึงเวลา จึงเหมาะใช้คู่กับ IRR ไม่ใช้แทนกัน</p>
      </div>
      <div class="gterm">
        <div class="t">การเสื่อมประสิทธิภาพ</div>
        <p>อุปกรณ์ส่วนใหญ่ (โดยเฉพาะแผงโซลาร์) ผลิต/ประหยัดพลังงานได้ลดลงทุกปี ระบบนี้คำนวณผลกระทบสะสมของการเสื่อมสภาพไว้ในทุกตัวเลขแล้ว</p>
      </div>
    </div>
  </section>
</div>

<!-- AD SLOT 3: footer banner -->
<div class="wrap">
  <div class="ad-slot">
    <span class="ad-label">โฆษณา · Advertisement</span>
    <div class="ad-box" id="ad-slot-footer">728×90 / responsive banner</div>
  </div>
</div>

<footer>
  <div class="wrap">
    <div id="footer-links" style="display:none;margin-bottom:14px;"></div>
    <p>ตัวเลขทั้งหมดเป็นการประมาณการเพื่อประกอบการตัดสินใจเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำทางการเงินหรือการลงทุน ราคาอุปกรณ์ ค่าไฟ อัตราดอกเบี้ย และเงื่อนไขเงินอุดหนุนจริงอาจแตกต่างกันตามผู้ให้บริการและช่วงเวลา ควรขอใบเสนอราคาจริงและปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน</p>
  </div>
</footer>
`;


  /* ---------------- Equipment presets ---------------- */
  const EQUIPMENT = {
    solar: {
      label:'โซลาร์เซลล์', desc:'ระบบผลิตไฟฟ้าจากแสงอาทิตย์บนหลังคา',
      subcalc:'solar',
      defaults:{cost:150000, subsidy:0, lifespan:25, maintenance:1800, degradation:0.5, salvage:5}
    },
    bev: {
      label:'รถยนต์ไฟฟ้า (BEV)', desc:'เทียบต้นทุนส่วนเพิ่มของรถ BEV กับรถน้ำมันที่จะซื้อแทน',
      subcalc:'bev',
      defaults:{cost:250000, subsidy:0, lifespan:8, maintenance:-3000, degradation:2, salvage:20}
    },
    hybrid: {
      label:'รถยนต์ไฮบริด', desc:'เทียบต้นทุนส่วนเพิ่มของรถไฮบริดกับรถน้ำมันทั่วไป',
      subcalc:'hybrid',
      defaults:{cost:150000, subsidy:0, lifespan:8, maintenance:0, degradation:0.5, salvage:20}
    },
    other: {
      label:'เครื่องใช้ไฟฟ้าอื่นๆ', desc:'เครื่องทำน้ำอุ่น ฮีทปั๊ม เครื่องใช้ไฟฟ้าทั่วไป หรืออุปกรณ์อื่นๆ ที่ไม่มีในรายการ',
      subcalc:'other',
      defaults:{cost:30000, subsidy:0, lifespan:10, maintenance:500, degradation:0.5, salvage:0,
        savingsPlaceholder:'800', savingsNote:'เช่น เครื่องทำน้ำอุ่นโซลาร์ (~400–1,200 บาท/เดือน) ฮีทปั๊มน้ำร้อน (~1,500–3,000 บาท/เดือน) หรืออุปกรณ์อื่นๆ ตามจริง'}
    },
    led: {
      label:'ไฟ LED ทั้งอาคาร', desc:'เปลี่ยนหลอดไฟ/โคมไฟเดิมเป็น LED ทั้งหมด',
      subcalc:'led',
      defaults:{cost:20000, subsidy:0, lifespan:8, maintenance:0, degradation:1, salvage:0}
    },
    insulation: {
      label:'ฉนวนกันความร้อน', desc:'ฉนวนหลังคา/ผนัง ลดภาระเครื่องปรับอากาศ',
      subcalc:'direct',
      defaults:{cost:35000, subsidy:0, lifespan:20, maintenance:0, degradation:0.2, salvage:0,
        savingsPlaceholder:'450', savingsNote:'ประมาณจากค่าไฟแอร์ที่ลดลงเมื่อบ้านเย็นขึ้น'}
    },
    water: {
      label:'เครื่องกรองน้ำ', desc:'เทียบกับค่าน้ำดื่มบรรจุขวด/ถังที่ไม่ต้องซื้ออีกต่อไป',
      subcalc:'water',
      defaults:{cost:15000, subsidy:0, lifespan:5, maintenance:1800, degradation:0, salvage:0}
    },
    waterrecycle: {
      label:'ระบบรีไซเคิลน้ำ (RO/UF)', desc:'ระบบบำบัดน้ำกลับมาใช้ใหม่ระดับโรงงาน/อาคาร วิเคราะห์แบบ CAPEX/OPEX เต็มรูปแบบ',
      subcalc:'waterrecycle',
      defaults:{cost:2700000, subsidy:0, lifespan:10, maintenance:0, degradation:1, salvage:5}
    }
  };

  let activeTab = 'solar';
  let vehicleSalvageOverrideBaht = null; // มูลค่าซากที่คำนวณจากราคาขายคืนจริง (ใช้แทน % เมื่ออยู่ในแท็บรถยนต์)

  /* ---------------- Build tabs ---------------- */
  const tabsEl = document.getElementById('tabs');
  Object.keys(EQUIPMENT).forEach((key, i)=>{
    const b = document.createElement('button');
    b.className = 'tab-btn' + (key===activeTab ? ' active' : '');
    b.dataset.key = key;
    b.innerHTML = '<span class="num">'+String(i+1).padStart(2,'0')+'</span><span class="name">'+EQUIPMENT[key].label+'</span>';
    b.addEventListener('click', ()=> setActiveTab(key));
    tabsEl.appendChild(b);
  });

  function setActiveTab(key){
    activeTab = key;
    document.querySelectorAll('.tab-btn').forEach(el=>{
      el.classList.toggle('active', el.dataset.key===key);
    });
    document.getElementById('active-equipment-desc').textContent = EQUIPMENT[key].desc;
    const d = EQUIPMENT[key].defaults;
    const isVehicle = (EQUIPMENT[key].subcalc==='bev' || EQUIPMENT[key].subcalc==='hybrid' || EQUIPMENT[key].subcalc==='waterrecycle');
    const isAutoCost = isVehicle || EQUIPMENT[key].subcalc==='led'; // แท็บที่คำนวณ "เงินลงทุนเริ่มต้น" ให้อัตโนมัติจากข้อมูลในแท็บเอง
    const isCarWithHoldYears = (EQUIPMENT[key].subcalc==='bev' || EQUIPMENT[key].subcalc==='hybrid');
    const isLifespanAutoComputed = isCarWithHoldYears || EQUIPMENT[key].subcalc==='led'; // แท็บที่คำนวณ "อายุการใช้งานอุปกรณ์" อัตโนมัติจากข้อมูลในแท็บเอง
    const noSalvage = ['led','insulation','water'].includes(key); // อุปกรณ์ที่ไม่มีตลาดขายซากจริง (เช็คจากรหัสแท็บ ไม่ใช่ subcalc type เพราะบางแท็บใช้ type ร่วมกัน)
    document.getElementById('f-cost').value = d.cost;
    document.getElementById('f-subsidy').value = d.subsidy;
    document.getElementById('f-lifespan').value = d.lifespan;
    document.getElementById('f-sell-year').value = d.lifespan;
    document.getElementById('f-maintenance').value = d.maintenance;
    document.getElementById('f-other-cost').value = 0;
    document.getElementById('f-degradation').value = d.degradation;
    document.getElementById('f-salvage').value = noSalvage ? 0 : d.salvage;
    document.getElementById('f-cost').readOnly = isAutoCost;
    document.getElementById('f-salvage').readOnly = isVehicle || noSalvage;
    document.getElementById('f-cost').classList.toggle('auto-filled', isAutoCost);
    document.getElementById('f-salvage').classList.toggle('auto-filled', isVehicle || noSalvage);
    document.getElementById('f-lifespan').readOnly = isLifespanAutoComputed;
    document.getElementById('f-sell-year').readOnly = isCarWithHoldYears;
    document.getElementById('f-lifespan').classList.toggle('auto-filled', isLifespanAutoComputed);
    document.getElementById('f-sell-year').classList.toggle('auto-filled', isCarWithHoldYears);
    document.getElementById('f-lifespan-note').style.display = isLifespanAutoComputed ? 'block' : 'none';
    document.getElementById('f-lifespan-note').textContent = (EQUIPMENT[key].subcalc==='led')
      ? 'คำนวณอัตโนมัติจาก “อายุการใช้งานหลอด LED (ชั่วโมง) ÷ ชั่วโมงใช้งานต่อวัน ÷ 365” ในแท็บด้านซ้าย (แก้ไขตัวเลขต้นทางด้านบนแทน)'
      : 'ในแท็บรถยนต์ ค่านี้คำนวณอัตโนมัติจาก “จำนวนปีที่จะใช้รถ” ด้านซ้าย เพราะขายรถไปแล้วเทียบต่อไม่ได้ (แก้ไขตัวเลขต้นทางด้านบนแทน)';
    document.getElementById('f-sell-year-note').textContent = isCarWithHoldYears
      ? 'คำนวณอัตโนมัติจาก “จำนวนปีที่จะใช้รถ” ด้านซ้าย (แก้ไขตัวเลขต้นทางด้านบนแทน)'
      : 'ถ้าขายก่อนครบอายุใช้งาน ระบบจะหยุดนับเงินประหยัดหลังปีนี้ และรับมูลค่าซากเป็นเงินก้อนในปีนี้แทน ค่าเริ่มต้น = อายุการใช้งานอุปกรณ์';
    document.getElementById('f-cost-note').style.display = isAutoCost ? 'block' : 'none';
    document.getElementById('f-salvage-note').style.display = (isVehicle || noSalvage) ? 'block' : 'none';
    document.getElementById('f-salvage-note').textContent = noSalvage
      ? 'อุปกรณ์ประเภทนี้ไม่มีตลาดขายซาก ระบบล็อกไว้ที่ 0 อัตโนมัติ'
      : 'ในแท็บนี้ ตัวเลข % นี้เป็นค่าอ้างอิงเท่านั้น ระบบใช้มูลค่าซากที่เป็นบาทจริง (ดูในกล่องพรีวิวด้านซ้าย) ไปคำนวณเสมอ แม้ % จะแสดง 0 ได้ในบางกรณี';
    document.getElementById('f-maintenance').readOnly = isCarWithHoldYears;
    document.getElementById('f-other-cost').readOnly = isCarWithHoldYears;
    document.getElementById('f-maintenance').classList.toggle('auto-filled', isCarWithHoldYears);
    document.getElementById('f-other-cost').classList.toggle('auto-filled', isCarWithHoldYears);
    document.getElementById('f-maintenance-note').style.display = isCarWithHoldYears ? 'block' : 'none';
    document.getElementById('f-other-cost-note').textContent = isCarWithHoldYears
      ? 'คำนวณอัตโนมัติจากส่วนต่างค่าใช้จ่ายอื่นๆ ในแท็บด้านซ้าย (แก้ไขตัวเลขต้นทางด้านบนแทน)'
      : 'เช่น ค่าประกันภัยรถยนต์/อุปกรณ์, ภาษีประจำปี, ค่าธรรมเนียมต่างๆ ที่ไม่ใช่ค่าบำรุงรักษาโดยตรง แต่ต้องจ่ายทุกปี';
    vehicleSalvageOverrideBaht = null;

    // เครื่องกรองน้ำ: ประหยัด "ค่าน้ำ" ไม่ใช่พลังงานไฟฟ้า — ปรับข้อความ/ซ่อนฟิลด์ที่ไม่เกี่ยวข้อง
    const isWater = (EQUIPMENT[key].subcalc==='water');
    const isWaterRecycle = (EQUIPMENT[key].subcalc==='waterrecycle');
    document.getElementById('energy-panel-title').textContent = isWater ? 'ราคาน้ำและอัตราการเพิ่มขึ้น' : (isWaterRecycle ? 'ต้นทุนพลังงานและอัตราการเพิ่มขึ้น' : 'ค่าไฟฟ้าและพลังงาน');
    document.getElementById('energy-panel-desc').textContent = isWater
      ? 'เครื่องกรองน้ำประหยัด “ค่าน้ำดื่ม” ไม่ใช่พลังงานไฟฟ้า จึงไม่ใช้อัตราค่าไฟฟ้า และไม่มีตัวเลข CO2 จากไฟฟ้า'
      : (isWaterRecycle ? 'อัตราค่าไฟฟ้าใช้คำนวณต้นทุนไฟฟ้าของระบบ RO/UF (ตัวแปร C) ส่วนอัตราเพิ่มขึ้นเฉลี่ยใช้กับผลประหยัดสุทธิทั้งโครงการ'
      : 'ใช้คำนวณมูลค่าเงินที่ประหยัดได้ และปริมาณ CO2 ที่ลดได้');
    document.getElementById('f-elec-rate-field').style.display = isWater ? 'none' : 'flex';
    document.getElementById('f-elec-rate-field').parentElement.style.gridTemplateColumns = isWater ? '1fr' : '1fr 1fr';
    document.getElementById('f-escalation-label').innerHTML = isWater
      ? 'อัตราราคาน้ำดื่มเพิ่มขึ้นเฉลี่ย <span class="hint">% / ปี</span>'
      : (isWaterRecycle ? 'อัตราต้นทุนเพิ่มขึ้นเฉลี่ย (น้ำ/ไฟ/สารเคมี) <span class="hint">% / ปี</span>'
      : 'อัตราค่าไฟเพิ่มขึ้นเฉลี่ย <span class="hint">% / ปี</span>');

    applyIceModeUI(false); // รีเซ็ตให้ค่าเริ่มต้น (แสดงผ่อน/ส่วนลด, label ปกติ) — แท็บ BEV/Hybrid จะตั้งค่าที่ถูกต้องเองด้านล่าง
    renderSubcalc(key);
    updateRangeWarning('capex-rows','capex-range-warning');
    calculate();
  }

  /* ---------------- Sub-calculators ---------------- */
  function renderSubcalc(key){
    const panel = document.getElementById('subcalc-panel');
    const type = EQUIPMENT[key].subcalc;
    const d = EQUIPMENT[key].defaults;

    if(type==='solar'){
      const suggestedLoad = (4500/4.4/30).toFixed(1);
      panel.innerHTML = [
        '<h2>ระบบโซลาร์เซลล์</h2>',
        '<p class="desc">คำนวณพลังงานที่ผลิตได้ การใช้เอง แบตเตอรี่ และอัตรา TOU โดยอัตโนมัติ</p>',
        '<div class="field-row">',
          '<div class="field"><label>ขนาดระบบ <span class="hint">kWp</span></label><input type="number" id="s-size" value="5" min="0" step="0.1"/></div>',
          '<div class="field"><label>ชั่วโมงแดดเฉลี่ย <span class="hint">ชม./วัน</span></label><input type="number" id="s-sun" value="4.2" min="0" step="0.1"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ค่าไฟปัจจุบันต่อเดือน (ถ้ามี) <span class="hint">บาท</span></label><input type="number" id="s-bill" value="4500" min="0"/>',
          '<span class="note">ใช้จำกัดเพดานเงินประหยัด กรณีผลิตไฟได้มากกว่าที่ใช้จริง (ไม่คิดขายไฟคืน)</span></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ปริมาณการใช้ไฟเฉลี่ยต่อวัน <span class="hint">หน่วย/วัน</span></label><input type="number" id="s-load" value="'+suggestedLoad+'" min="0" step="0.1"/>',
          '<span class="note">ค่าเริ่มต้นประมาณจากบิลด้านบน ปรับได้ตามหน่วยจริงในบิลค่าไฟ</span></div>',
        '</div>',

        '<div class="field-row single">',
          '<div class="field"><label>ช่วงเวลาการใช้ไฟ (ระบุเองได้ทุกช่วง)</label>',
          '<div id="s-periods"></div>',
          '<div class="period-actions">',
            '<button type="button" id="s-period-add" class="btn-add-period">+ เพิ่มช่วงเวลา</button>',
            '<span id="s-period-sum" class="note"></span>',
          '</div>',
          '<span class="note">ระบุว่าโหลดไฟฟ้าในบ้านเกิดขึ้นช่วงไหนของวันกี่ % สัดส่วนรวมกันไม่ควรเกิน 100% ใช้รูปแบบเวลา 00:00–23:59 ระบบจะจับคู่กับช่วงที่มีแดด (06:00–18:00) และช่วง On-Peak (09:00–22:00) ให้อัตโนมัติ — ช่วงที่มีแดดแต่ไม่ได้ระบุโหลดไว้ ไฟที่ผลิตได้จะถือเป็นไฟส่วนเกินสำหรับชาร์จแบตเตอรี่หรือส่งออกเช่นกัน</span></div>',
        '</div>',

        '<div class="toggle-row"><input type="checkbox" id="s-battery-enabled"/><label for="s-battery-enabled">ติดตั้งแบตเตอรี่กักเก็บพลังงาน</label></div>',
        '<div id="s-battery-fields" style="display:none;">',
          '<div class="field-row">',
            '<div class="field"><label>ความจุแบตเตอรี่ <span class="hint">kWh</span></label><input type="number" id="s-battery-capacity" value="5" min="0" step="0.5"/></div>',
            '<div class="field"><label>ประสิทธิภาพรอบชาร์จ <span class="hint">%</span></label><input type="number" id="s-battery-efficiency" value="90" min="0" max="100"/></div>',
          '</div>',
          '<div class="field-row single"><span class="note">แบตเตอรี่จะเก็บไฟส่วนเกินจากช่วงที่มีแดดไว้ใช้ในช่วงที่ขาดแคลน ราคาแบตเตอรี่โดยประมาณ 15,000–25,000 บาท/kWh ควรรวมในช่อง “เงินลงทุนเริ่มต้น” ด้านล่างด้วย</span></div>',
        '</div>',

        '<div class="toggle-row"><input type="checkbox" id="s-tou-enabled"/><label for="s-tou-enabled">ใช้มิเตอร์ TOU (Time of Use)</label></div>',
        '<div id="s-tou-fields" style="display:none;">',
          '<div class="field-row">',
            '<div class="field"><label>อัตรา On-Peak <span class="hint">บาท/หน่วย</span></label><input type="number" id="s-tou-peak-rate" value="5.7982" min="0" step="0.0001"/></div>',
            '<div class="field"><label>อัตรา Off-Peak <span class="hint">บาท/หน่วย</span></label><input type="number" id="s-tou-offpeak-rate" value="2.6369" min="0" step="0.0001"/></div>',
          '</div>',
          '<div class="field-row single"><span class="note">On-Peak คือ 09:00–22:00 วันจันทร์–ศุกร์ นอกเวลานี้ถือเป็น Off-Peak — หากช่วงเวลาที่ระบุคาบเกี่ยวทั้งสองช่วง ระบบจะคำนวณอัตราถัวเฉลี่ยตามสัดส่วนชั่วโมงให้อัตโนมัติ</span></div>',
        '</div>',

        '<div class="sub-preview" id="s-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');

      document.getElementById('s-battery-enabled').addEventListener('change', function(){
        document.getElementById('s-battery-fields').style.display = this.checked ? 'block' : 'none';
        updateSolarPreview(); calculate();
      });
      document.getElementById('s-tou-enabled').addEventListener('change', function(){
        document.getElementById('s-tou-fields').style.display = this.checked ? 'block' : 'none';
        updateSolarPreview(); calculate();
      });
      document.getElementById('s-period-add').addEventListener('click', function(){
        document.getElementById('s-periods').appendChild(createPeriodRow('12:00','13:00',0));
        updatePeriodSum(); updateSolarPreview(); calculate();
      });
      initPeriods(document.getElementById('s-periods'));
      ['s-size','s-sun','s-bill','s-load','s-battery-capacity','s-battery-efficiency','s-tou-peak-rate','s-tou-offpeak-rate'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateSolarPreview(); calculate(); });
      });
      updateSolarPreview();
    }

    if(type==='other'){
      const d = EQUIPMENT[key].defaults;
      panel.innerHTML = [
        '<h2>เครื่องใช้ไฟฟ้าอื่นๆ</h2>',
        '<p class="desc">'+EQUIPMENT[key].desc+'</p>',
        '<div class="field-row single">',
          '<div class="field"><label>วิธีกรอกข้อมูล</label>',
          '<select id="o-mode">',
            '<option value="direct">กรอกยอดประหยัดเอง</option>',
            '<option value="appliance">คำนวณจากกำลังไฟเครื่องเก่า-ใหม่ (วัตต์)</option>',
          '</select></div>',
        '</div>',
        '<div id="o-direct-fields">',
          '<div class="field-row single">',
            '<div class="field"><label>ประหยัดค่าพลังงานโดยประมาณ <span class="hint">บาท/เดือน (ปีแรก)</span></label>',
            '<input type="number" id="o-savings" value="'+d.savingsPlaceholder+'" min="0"/>',
            '<span class="note">'+d.savingsNote+'</span></div>',
          '</div>',
        '</div>',
        '<div id="o-appliance-fields" style="display:none;">',
          '<div class="field-row">',
            '<div class="field"><label>กำลังไฟเครื่องเดิม <span class="hint">วัตต์</span></label><input type="number" id="o-old" value="1800" min="0"/></div>',
            '<div class="field"><label>กำลังไฟเครื่องใหม่ <span class="hint">วัตต์</span></label><input type="number" id="o-new" value="1100" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ชั่วโมงใช้งานเฉลี่ย <span class="hint">ชม./วัน</span></label><input type="number" id="o-hours" value="8" min="0" step="0.5"/></div>',
          '</div>',
        '</div>',
        '<div class="sub-preview" id="o-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');
      document.getElementById('o-mode').addEventListener('change', function(){
        document.getElementById('o-direct-fields').style.display = this.value==='direct' ? 'block' : 'none';
        document.getElementById('o-appliance-fields').style.display = this.value==='appliance' ? 'block' : 'none';
        updateOtherPreview(); calculate();
      });
      ['o-savings','o-old','o-new','o-hours'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateOtherPreview(); calculate(); });
      });
      updateOtherPreview();
    }

    if(type==='bev'){
      panel.innerHTML = [
        '<h2>รถยนต์ไฟฟ้า (BEV)</h2>',
        '<p class="desc">กรอกราคาซื้อและจำนวนปีที่จะใช้รถ ระบบจะคำนวณ “เงินลงทุนเริ่มต้น”, “อายุการใช้งาน”, “ปีที่จะขาย” และ “มูลค่าซาก” ในหัวข้อด้านล่างให้อัตโนมัติ</p>',
        '<div class="field-row">',
          '<div class="field"><label>ราคารถ BEV ที่จะซื้อ <span class="hint">บาท</span></label><input type="number" id="v-bev-price" value="900000" min="0"/></div>',
          '<div class="field"><label>จำนวนปีที่จะใช้รถ <span class="hint">ปี</span></label><input type="number" id="v-hold-years" value="8" min="1"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ราคาขาย BEV เมื่อถือครองครบตามจำนวนปีข้างต้น <span class="hint">บาท</span></label><input type="number" id="v-bev-resale" value="300000" min="0"/></div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>ค่าบำรุงรักษา BEV <span class="hint">บาท/ปี</span></label><input type="number" id="v-bev-maint" value="2000" min="0"/></div>',
          '<div class="field"><label>ค่าใช้จ่ายอื่นๆ BEV <span class="hint">บาท/ปี</span></label><input type="number" id="v-bev-other" value="12000" min="0"/>',
          '<span class="note">เช่น ค่าประกันภัย, ภาษีประจำปี</span></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>เทียบกับ</label>',
          '<select id="v-compare-mode">',
            '<option value="ice">ซื้อรถน้ำมัน</option>',
            '<option value="nocar">ไม่มีรถ ใช้บริการเดินทางแทน</option>',
            '<option value="keepold">ไม่ซื้อรถ ใช้รถเดิมต่อ</option>',
          '</select></div>',
        '</div>',
        '<div id="v-ice-fields" class="ref-box">',
          '<div class="ref-box-label">ข้อมูลอ้างอิง — รถที่เอามาเปรียบเทียบ (ไม่ใช่รถ BEV)</div>',
          '<div class="field-row">',
            '<div class="field"><label>ราคารถน้ำมันที่เทียบเคียง <span class="hint">บาท</span></label><input type="number" id="v-ref-price" value="650000" min="0"/></div>',
            '<div class="field"><label>ราคาขายเมื่อถือครองครบเท่ากัน <span class="hint">บาท</span></label><input type="number" id="v-ref-resale" value="150000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>อัตราสิ้นเปลืองรถน้ำมันที่เทียบเคียง <span class="hint">กม./ลิตร</span></label><input type="number" id="v-kmpl" value="12" min="0.1" step="0.1"/></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ค่าบำรุงรักษารถน้ำมันที่เทียบเคียง <span class="hint">บาท/ปี</span></label><input type="number" id="v-ref-maint" value="6000" min="0"/></div>',
            '<div class="field"><label>ค่าใช้จ่ายอื่นๆ รถน้ำมันที่เทียบเคียง <span class="hint">บาท/ปี</span></label><input type="number" id="v-ref-other" value="10000" min="0"/></div>',
          '</div>',
        '</div>',
        '<div id="v-nocar-fields" style="display:none;">',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าใช้จ่ายเดินทางทางเลือกต่อเดือน (ถ้าไม่มีรถ) <span class="hint">บาท/เดือน</span></label><input type="number" id="v-nocar-cost" value="3500" min="0"/>',
            '<span class="note">รวมค่ารถไฟฟ้า/รถเมล์/แท็กซี่/มอเตอร์ไซค์รับจ้าง/Grab ที่ต้องจ่ายทั้งเดือนถ้าไม่มีรถส่วนตัว</span></div>',
          '</div>',
        '</div>',
        '<div id="v-keepold-fields" class="ref-box" style="display:none;">',
          '<div class="ref-box-label">ข้อมูลอ้างอิง — รถเดิมที่ใช้อยู่ (ไม่ใช่รถ BEV)</div>',
          '<div class="field-row single">',
            '<div class="field"><label>อัตราสิ้นเปลืองรถเดิมที่ใช้อยู่ <span class="hint">กม./ลิตร</span></label><input type="number" id="v-keepold-kmpl" value="10" min="0.1" step="0.1"/>',
            '<span class="note">ยิ่งรถเก่ากินน้ำมันมากขึ้น ให้ปรับตัวเลขนี้ลงตามจริง</span></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ค่าบำรุงรักษารถเดิม <span class="hint">บาท/ปี</span></label><input type="number" id="v-keepold-maint" value="8000" min="0"/>',
            '<span class="note">รถเก่ามักบำรุงรักษาแพงกว่ารถใหม่</span></div>',
            '<div class="field"><label>ค่าใช้จ่ายอื่นๆ รถเดิม <span class="hint">บาท/ปี</span></label><input type="number" id="v-keepold-other" value="10000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าอะไหล่ชิ้นใหญ่ที่รถเดิมน่าจะต้องเปลี่ยน (ระบุปีได้)</label>',
            '<div id="v-repair-rows"></div>',
            '<div class="period-actions">',
              '<button type="button" class="btn-add-period" id="v-repair-add-btn">+ เพิ่มรายการ</button>',
              '<span class="note" id="v-repair-empty-note">ไม่มีรายการ</span>',
            '</div>',
            '<span class="note" id="v-repair-range-warning" style="display:none;color:var(--rust);"></span>',
            '<span class="note">เช่น เปลี่ยนแบตเตอรี่ 12V, ช่วงล่าง, ระบบเกียร์, แอร์ — ค่าใช้จ่ายเหล่านี้จะ “ประหยัดได้” ถ้าเปลี่ยนมาใช้รถใหม่แทน จึงถูกนับเป็นผลประหยัดในปีที่ระบุ นอกเหนือจากค่าน้ำมันที่ประหยัดได้ทุกเดือน — รายการที่เกินปีที่จะขายจะไม่ถูกนับ</span></div>',
          '</div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>ระยะทางขับเฉลี่ย <span class="hint">กม./เดือน</span></label><input type="number" id="v-distance" value="1200" min="0"/></div>',
          '<div class="field"><label>ราคาน้ำมัน <span class="hint">บาท/ลิตร</span></label><input type="number" id="v-fuel-price" value="36" min="0" step="0.1"/></div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>อัตราการใช้ไฟฟ้ารถ BEV <span class="hint">kWh/100กม.</span></label><input type="number" id="v-kwh100" value="15" min="0" step="0.5"/></div>',
          '<div class="field"><label>สัดส่วนชาร์จที่บ้าน <span class="hint">%</span></label><input type="number" id="v-home-share" value="80" min="0" max="100"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ค่าไฟชาร์จสาธารณะ/หัวชาร์จเร็ว <span class="hint">บาท/หน่วย</span></label><input type="number" id="v-public-rate" value="7.5" min="0" step="0.1"/></div>',
        '</div>',
        '<span class="note">ค่าไฟชาร์จที่บ้านใช้อัตราค่าไฟฟ้าปัจจุบันในหัวข้อ “ค่าไฟฟ้าและพลังงาน” ด้านล่าง</span>',
        '<div class="sub-preview" id="v-bev-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');
      document.getElementById('v-compare-mode').addEventListener('change', function(){
        document.getElementById('v-ice-fields').style.display = this.value==='ice' ? 'block' : 'none';
        document.getElementById('v-nocar-fields').style.display = this.value==='nocar' ? 'block' : 'none';
        document.getElementById('v-keepold-fields').style.display = this.value==='keepold' ? 'block' : 'none';
        applyIceModeUI(this.value==='ice');
        updateBevPreview(); calculate();
      });
      applyIceModeUI(document.getElementById('v-compare-mode').value==='ice');
      document.getElementById('v-repair-add-btn').addEventListener('click', function(){
        document.getElementById('v-repair-rows').appendChild(createYearAmountRow(5, 15000, ()=>{
          updateEmptyNote('v-repair-rows','v-repair-empty-note');
          updateRangeWarning('v-repair-rows','v-repair-range-warning');
          updateBevPreview(); calculate();
        }));
        updateEmptyNote('v-repair-rows','v-repair-empty-note');
        updateRangeWarning('v-repair-rows','v-repair-range-warning');
        calculate();
      });
      updateEmptyNote('v-repair-rows','v-repair-empty-note');
      updateRangeWarning('v-repair-rows','v-repair-range-warning');
      ['v-bev-price','v-bev-resale','v-bev-maint','v-bev-other','v-ref-price','v-ref-resale','v-ref-maint','v-ref-other',
       'v-kmpl','v-nocar-cost','v-keepold-kmpl','v-keepold-maint','v-keepold-other',
       'v-distance','v-fuel-price','v-kwh100','v-home-share','v-public-rate'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateBevPreview(); calculate(); });
      });
      document.getElementById('v-hold-years').addEventListener('input', ()=>{
        syncHoldYears('v-hold-years');
        updateRangeWarning('v-repair-rows','v-repair-range-warning');
        updateRangeWarning('capex-rows','capex-range-warning');
        updateBevPreview(); calculate();
      });
      updateBevPreview();
    }

    if(type==='hybrid'){
      panel.innerHTML = [
        '<h2>รถยนต์ไฮบริด</h2>',
        '<p class="desc">กรอกราคาซื้อและจำนวนปีที่จะใช้รถ ระบบจะคำนวณ “เงินลงทุนเริ่มต้น”, “อายุการใช้งาน”, “ปีที่จะขาย” และ “มูลค่าซาก” ในหัวข้อด้านล่างให้อัตโนมัติ</p>',
        '<div class="field-row">',
          '<div class="field"><label>ราคารถไฮบริดที่จะซื้อ <span class="hint">บาท</span></label><input type="number" id="h-price" value="850000" min="0"/></div>',
          '<div class="field"><label>จำนวนปีที่จะใช้รถ <span class="hint">ปี</span></label><input type="number" id="h-hold-years" value="8" min="1"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ราคาขายไฮบริดเมื่อถือครองครบตามจำนวนปีข้างต้น <span class="hint">บาท</span></label><input type="number" id="h-resale" value="280000" min="0"/></div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>ค่าบำรุงรักษาไฮบริด <span class="hint">บาท/ปี</span></label><input type="number" id="h-maint" value="4000" min="0"/></div>',
          '<div class="field"><label>ค่าใช้จ่ายอื่นๆ ไฮบริด <span class="hint">บาท/ปี</span></label><input type="number" id="h-other" value="11000" min="0"/>',
          '<span class="note">เช่น ค่าประกันภัย, ภาษีประจำปี</span></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>เทียบกับ</label>',
          '<select id="h-compare-mode">',
            '<option value="ice">ซื้อรถน้ำมัน</option>',
            '<option value="nocar">ไม่มีรถ ใช้บริการเดินทางแทน</option>',
            '<option value="keepold">ไม่ซื้อรถ ใช้รถเดิมต่อ</option>',
          '</select></div>',
        '</div>',
        '<div id="h-ice-fields" class="ref-box">',
          '<div class="ref-box-label">ข้อมูลอ้างอิง — รถที่เอามาเปรียบเทียบ (ไม่ใช่รถไฮบริด)</div>',
          '<div class="field-row">',
            '<div class="field"><label>ราคารถรุ่นเครื่องยนต์ปกติ <span class="hint">บาท</span></label><input type="number" id="h-ref-price" value="750000" min="0"/></div>',
            '<div class="field"><label>ราคาขายเมื่อถือครองครบเท่ากัน <span class="hint">บาท</span></label><input type="number" id="h-ref-resale" value="200000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>อัตราสิ้นเปลืองรถรุ่นเครื่องยนต์ปกติ <span class="hint">กม./ลิตร</span></label><input type="number" id="h-kmpl-old" value="12" min="0.1" step="0.1"/></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ค่าบำรุงรักษารุ่นเครื่องยนต์ปกติ <span class="hint">บาท/ปี</span></label><input type="number" id="h-ref-maint" value="5000" min="0"/></div>',
            '<div class="field"><label>ค่าใช้จ่ายอื่นๆ รุ่นเครื่องยนต์ปกติ <span class="hint">บาท/ปี</span></label><input type="number" id="h-ref-other" value="10000" min="0"/></div>',
          '</div>',
        '</div>',
        '<div id="h-nocar-fields" style="display:none;">',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าใช้จ่ายเดินทางทางเลือกต่อเดือน (ถ้าไม่มีรถ) <span class="hint">บาท/เดือน</span></label><input type="number" id="h-nocar-cost" value="3500" min="0"/>',
            '<span class="note">รวมค่ารถไฟฟ้า/รถเมล์/แท็กซี่/มอเตอร์ไซค์รับจ้าง/Grab ที่ต้องจ่ายทั้งเดือนถ้าไม่มีรถส่วนตัว</span></div>',
          '</div>',
        '</div>',
        '<div id="h-keepold-fields" class="ref-box" style="display:none;">',
          '<div class="ref-box-label">ข้อมูลอ้างอิง — รถเดิมที่ใช้อยู่ (ไม่ใช่รถไฮบริด)</div>',
          '<div class="field-row single">',
            '<div class="field"><label>อัตราสิ้นเปลืองรถเดิมที่ใช้อยู่ <span class="hint">กม./ลิตร</span></label><input type="number" id="h-keepold-kmpl" value="10" min="0.1" step="0.1"/>',
            '<span class="note">ยิ่งรถเก่ากินน้ำมันมากขึ้น ให้ปรับตัวเลขนี้ลงตามจริง</span></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ค่าบำรุงรักษารถเดิม <span class="hint">บาท/ปี</span></label><input type="number" id="h-keepold-maint" value="8000" min="0"/>',
            '<span class="note">รถเก่ามักบำรุงรักษาแพงกว่ารถใหม่</span></div>',
            '<div class="field"><label>ค่าใช้จ่ายอื่นๆ รถเดิม <span class="hint">บาท/ปี</span></label><input type="number" id="h-keepold-other" value="10000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าอะไหล่ชิ้นใหญ่ที่รถเดิมน่าจะต้องเปลี่ยน (ระบุปีได้)</label>',
            '<div id="h-repair-rows"></div>',
            '<div class="period-actions">',
              '<button type="button" class="btn-add-period" id="h-repair-add-btn">+ เพิ่มรายการ</button>',
              '<span class="note" id="h-repair-empty-note">ไม่มีรายการ</span>',
            '</div>',
            '<span class="note" id="h-repair-range-warning" style="display:none;color:var(--rust);"></span>',
            '<span class="note">เช่น เปลี่ยนแบตเตอรี่ 12V, ช่วงล่าง, ระบบเกียร์, แอร์ — ค่าใช้จ่ายเหล่านี้จะ “ประหยัดได้” ถ้าเปลี่ยนมาใช้รถใหม่แทน จึงถูกนับเป็นผลประหยัดในปีที่ระบุ นอกเหนือจากค่าน้ำมันที่ประหยัดได้ทุกเดือน — รายการที่เกินปีที่จะขายจะไม่ถูกนับ</span></div>',
          '</div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>ระยะทางขับเฉลี่ย <span class="hint">กม./เดือน</span></label><input type="number" id="h-distance" value="1200" min="0"/></div>',
          '<div class="field"><label>ราคาน้ำมัน <span class="hint">บาท/ลิตร</span></label><input type="number" id="h-fuel-price" value="36" min="0" step="0.1"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>อัตราสิ้นเปลืองรถไฮบริด (โหมดน้ำมัน) <span class="hint">กม./ลิตร</span></label><input type="number" id="h-kmpl-new" value="20" min="0.1" step="0.1"/>',
          '<span class="note">สำหรับ HEV ทั่วไป (ไม่มีปลั๊กชาร์จ) ใส่ตัวเลขนี้แล้วปล่อยตัวเลือกด้านล่างว่าง “ไม่มีปลั๊กชาร์จ” ได้เลย</span></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ประเภทไฮบริด</label>',
          '<select id="h-phev-mode">',
            '<option value="hev">HEV — ไม่มีปลั๊กชาร์จ (ชาร์จจากเบรก/เครื่องยนต์เท่านั้น)</option>',
            '<option value="phev">PHEV — มีปลั๊กชาร์จไฟ ขับด้วยไฟฟ้าล้วนได้บางส่วน</option>',
          '</select></div>',
        '</div>',
        '<div id="h-phev-fields" style="display:none;">',
          '<div class="field-row">',
            '<div class="field"><label>สัดส่วนระยะทางที่ขับด้วยไฟฟ้าล้วน <span class="hint">%</span></label><input type="number" id="h-ev-share" value="30" min="0" max="100"/></div>',
            '<div class="field"><label>อัตราการใช้ไฟฟ้าโหมด EV <span class="hint">kWh/100กม.</span></label><input type="number" id="h-ev-kwh100" value="18" min="0" step="0.5"/></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>สัดส่วนชาร์จที่บ้าน <span class="hint">%</span></label><input type="number" id="h-home-share" value="80" min="0" max="100"/></div>',
            '<div class="field"><label>ค่าไฟชาร์จสาธารณะ/หัวชาร์จเร็ว <span class="hint">บาท/หน่วย</span></label><input type="number" id="h-public-rate" value="7.5" min="0" step="0.1"/></div>',
          '</div>',
          '<span class="note">ค่าไฟชาร์จที่บ้านใช้อัตราค่าไฟฟ้าปัจจุบันในหัวข้อ “ค่าไฟฟ้าและพลังงาน” ด้านล่าง — ระยะทางส่วนที่เหลือ (ไม่ใช่ไฟฟ้าล้วน) จะใช้อัตราสิ้นเปลือง “โหมดน้ำมัน” ด้านบนตามปกติ</span>',
        '</div>',
        '<span class="note">CO2 คำนวณจากปริมาณน้ำมันที่ประหยัด/ใช้จริง (~2.31 kgCO2/ลิตร) รวมกับ CO2 จากไฟฟ้าที่ใช้ชาร์จ (ถ้าเป็น PHEV)</span>',
        '<div class="sub-preview" id="v-hybrid-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');
      document.getElementById('h-compare-mode').addEventListener('change', function(){
        document.getElementById('h-ice-fields').style.display = this.value==='ice' ? 'block' : 'none';
        document.getElementById('h-nocar-fields').style.display = this.value==='nocar' ? 'block' : 'none';
        document.getElementById('h-keepold-fields').style.display = this.value==='keepold' ? 'block' : 'none';
        applyIceModeUI(this.value==='ice');
        updateHybridPreview(); calculate();
      });
      applyIceModeUI(document.getElementById('h-compare-mode').value==='ice');
      document.getElementById('h-phev-mode').addEventListener('change', function(){
        document.getElementById('h-phev-fields').style.display = this.value==='phev' ? 'block' : 'none';
        updateHybridPreview(); calculate();
      });
      document.getElementById('h-repair-add-btn').addEventListener('click', function(){
        document.getElementById('h-repair-rows').appendChild(createYearAmountRow(5, 15000, ()=>{
          updateEmptyNote('h-repair-rows','h-repair-empty-note');
          updateRangeWarning('h-repair-rows','h-repair-range-warning');
          updateHybridPreview(); calculate();
        }));
        updateEmptyNote('h-repair-rows','h-repair-empty-note');
        updateRangeWarning('h-repair-rows','h-repair-range-warning');
        calculate();
      });
      updateEmptyNote('h-repair-rows','h-repair-empty-note');
      updateRangeWarning('h-repair-rows','h-repair-range-warning');
      ['h-price','h-resale','h-maint','h-other','h-ref-price','h-ref-resale','h-ref-maint','h-ref-other',
       'h-kmpl-old','h-nocar-cost','h-keepold-kmpl','h-keepold-maint','h-keepold-other',
       'h-distance','h-fuel-price','h-kmpl-new','h-ev-share','h-ev-kwh100','h-home-share','h-public-rate'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateHybridPreview(); calculate(); });
      });
      document.getElementById('h-hold-years').addEventListener('input', ()=>{
        syncHoldYears('h-hold-years');
        updateRangeWarning('h-repair-rows','h-repair-range-warning');
        updateRangeWarning('capex-rows','capex-range-warning');
        updateHybridPreview(); calculate();
      });
      updateHybridPreview();
    }

    if(type==='water'){
      panel.innerHTML = [
        '<h2>เครื่องกรองน้ำ</h2>',
        '<p class="desc">เทียบกับค่าน้ำดื่มบรรจุขวด/ถังที่ไม่ต้องซื้ออีกต่อไป (ค่าไส้กรอง/บำรุงรักษาให้กรอกในช่อง “ค่าบำรุงรักษา” ด้านล่างแยกต่างหาก)</p>',
        '<div class="field-row">',
          '<div class="field"><label>จำนวนคนที่ใช้น้ำดื่ม <span class="hint">คน</span></label><input type="number" id="w-people" value="4" min="0"/></div>',
          '<div class="field"><label>ปริมาณน้ำดื่มเฉลี่ย <span class="hint">ลิตร/คน/วัน</span></label><input type="number" id="w-liters" value="2" min="0" step="0.1"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ราคาน้ำดื่มบรรจุขวด/ถังเดิม <span class="hint">บาท/ลิตร</span></label><input type="number" id="w-price" value="6" min="0" step="0.1"/>',
          '<span class="note">น้ำถังใหญ่ ~4–6 บาท/ลิตร ส่วนน้ำขวดปลีก ~10–15 บาท/ลิตร</span></div>',
        '</div>',
        '<div class="sub-preview" id="v-water-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');
      ['w-people','w-liters','w-price'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateWaterPreview(); calculate(); });
      });
      updateWaterPreview();
    }

    if(type==='waterrecycle'){
      panel.innerHTML = [
        '<h2>ระบบรีไซเคิลน้ำ (RO/UF)</h2>',
        '<p class="desc">วิเคราะห์แบบ CAPEX/OPEX เต็มรูปแบบ — เงินลงทุนและมูลค่าประหยัดจะคำนวณเข้าหัวข้อ “เงินลงทุนและแหล่งเงินทุน” ด้านล่างให้อัตโนมัติ ค่าไฟฟ้าใช้อัตราจากหัวข้อ “ค่าไฟฟ้าและพลังงาน” ด้านล่าง (ตัวแปร C)</p>',

        '<div class="ref-box">',
          '<div class="ref-box-label">ส่วนที่ 1 — ข้อมูลพื้นฐาน</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ประเภทระบบ</label>',
            '<select id="wr-type">',
              '<option value="ufro" selected>UF + RO (คุณภาพน้ำสูง กำจัดเกลือแร่ได้)</option>',
              '<option value="uf">UF อย่างเดียว (กรองตะกอน/แบคทีเรีย ไม่กำจัดเกลือแร่)</option>',
            '</select>',
            '<span class="note">ระบบจะแนะนำอัตราค่าไฟฟ้า/สารเคมีให้ตามประเภท และตัดรายการที่ไม่เกี่ยวข้องออกให้อัตโนมัติเมื่อเลือก UF อย่างเดียว</span></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ปริมาณน้ำรีไซเคิลที่ต้องการผลิต (A) <span class="hint">ลบ.ม./วัน</span></label><input type="number" id="wr-a" value="100" min="0"/></div>',
            '<div class="field"><label>อัตราค่าน้ำประปาปัจจุบัน (B) <span class="hint">บาท/ลบ.ม.</span></label><input type="number" id="wr-b" value="30" min="0" step="0.1"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>จำนวนวันเดินระบบต่อปี (D) <span class="hint">วัน/ปี</span></label><input type="number" id="wr-d" value="300" min="1" max="366"/></div>',
          '</div>',
        '</div>',

        '<div class="ref-box">',
          '<div class="ref-box-label">ส่วนที่ 2 — เงินลงทุนเริ่มต้น (CAPEX)</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าเครื่องจักร อุปกรณ์ (ถัง/ปั๊ม/UF/RO) — E1 <span class="hint">บาท</span></label><input type="number" id="wr-e1" value="2000000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าติดตั้ง เดินท่อ ระบบไฟฟ้าควบคุม — E2 <span class="hint">บาท</span></label><input type="number" id="wr-e2" value="500000" min="0"/></div>',
          '</div>',
          '<div class="field-row single">',
            '<div class="field"><label>ค่าใช้จ่ายอื่นๆ (ปรับพื้นที่/ขออนุญาต) — E3 <span class="hint">บาท</span></label><input type="number" id="wr-e3" value="200000" min="0"/></div>',
          '</div>',
          '<div class="sub-preview" id="wr-e-total">รวมเงินลงทุน (E): — บาท</div>',
        '</div>',

        '<div class="ref-box">',
          '<div class="ref-box-label">ส่วนที่ 3 — ต้นทุนการดำเนินงาน (OPEX ต่อวัน)</div>',
          '<div class="field-row">',
            '<div class="field"><label>สัดส่วนไฟฟ้าที่ใช้ต่อหน่วยน้ำ <span class="hint">kWh/ลบ.ม.</span></label><input type="number" id="wr-f1-factor" value="1.65" min="0" step="0.05"/>',
            '<span class="note" id="wr-f1-range">ช่วงอ้างอิง UF+RO: ~1.5–1.8 kWh/ลบ.ม.</span></div>',
            '<div class="field"><label>ค่าสารเคมี & ไส้กรองต่อหน่วยน้ำ <span class="hint">บาท/ลบ.ม.</span></label><input type="number" id="wr-f2-rate" value="8" min="0" step="0.1"/>',
            '<span class="note" id="wr-f2-range">ช่วงอ้างอิง UF+RO: ~6–10 บาท/ลบ.ม.</span></div>',
          '</div>',
          '<div class="sub-preview" id="wr-f1f2-live">F1 (ค่าไฟฟ้า) = — บาท/วัน · F2 (สารเคมี/ไส้กรอง) = — บาท/วัน</div>',
          '<div class="field-row single" id="wr-f3-wrap" style="margin-top:14px;">',
            '<div class="field"><label>ค่าจัดการน้ำทิ้ง RO — F3 <span class="hint">บาท/วัน</span></label><input type="number" id="wr-f3" value="500" min="0"/>',
            '<span class="note">กรอกเองตามจริง — ค่าประเมินทั่วไป ~500 บาท/วัน ถ้าวนกลับบ่อเดิม ไม่มีสูตรตายตัวเพราะขึ้นกับวิธีจัดการหน้างาน</span></div>',
          '</div>',
          '<div class="sub-preview" id="wr-f-total">รวมต้นทุนเดินระบบ (F): — บาท/วัน</div>',
        '</div>',

        '<div class="ref-box">',
          '<div class="ref-box-label">ส่วนที่ 4 — ผลประหยัดที่ได้รับ (บาท/วัน)</div>',
          '<div class="sub-preview" id="wr-s1-live">S1 (ประหยัดค่าน้ำประปา = A × B) = — บาท/วัน</div>',
          '<div id="wr-s2-wrap">',
            '<div class="field-row single" style="margin-top:14px;">',
              '<div class="field"><label>ค่าเคมี Cooling Tower ต่อหน่วยน้ำ <span class="hint">บาท/ลบ.ม.</span></label><input type="number" id="wr-s2-rate" value="10" min="0" step="0.1"/>',
              '<span class="note">ค่าแนะนำ ~10 บาท/ลบ.ม. (ปรับตามชนิด/ปริมาณสารเคมีที่ใช้จริงในระบบ Cooling Tower ของแต่ละโรงงาน)</span></div>',
            '</div>',
            '<div class="sub-preview" id="wr-s2-live">S2 (ประหยัดค่าเคมี Cooling Tower) = — บาท/วัน</div>',
          '</div>',
          '<div class="field-row single" style="margin-top:14px;">',
            '<div class="field"><label>ประหยัดค่าบำบัดน้ำเสียทิ้ง (ถ้ามี) — S3 <span class="hint">บาท/วัน</span></label><input type="number" id="wr-s3" value="0" min="0"/>',
            '<span class="note">กรอกเองตามจริง — ไม่มีสูตรตายตัว ใส่ 0 ถ้าไม่มี</span></div>',
          '</div>',
          '<div class="sub-preview" id="wr-s-total">รวมผลประหยัด (S): — บาท/วัน</div>',
        '</div>',

        '<div class="sub-preview" id="wr-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');

      const WR_TYPE_DEFAULTS = {
        ufro: { f1:1.65, f1range:'1.5–1.8', f2:8, f2range:'6–10' },
        uf:   { f1:0.4,  f1range:'0.3–0.5', f2:2.75, f2range:'2–3.5' }
      };
      function applyWrTypeDefaults(){
        const t = document.getElementById('wr-type').value;
        const d = WR_TYPE_DEFAULTS[t];
        document.getElementById('wr-f1-factor').value = d.f1;
        document.getElementById('wr-f2-rate').value = d.f2;
        document.getElementById('wr-f1-range').textContent = 'ช่วงอ้างอิง '+(t==='uf'?'UF':'UF+RO')+': ~'+d.f1range+' kWh/ลบ.ม.';
        document.getElementById('wr-f2-range').textContent = 'ช่วงอ้างอิง '+(t==='uf'?'UF':'UF+RO')+': ~'+d.f2range+' บาท/ลบ.ม.';
        const isUfOnly = (t==='uf');
        document.getElementById('wr-f3-wrap').style.display = isUfOnly ? 'none' : '';
        document.getElementById('wr-s2-wrap').style.display = isUfOnly ? 'none' : 'block';
        if(isUfOnly){
          document.getElementById('wr-f3').value = 0;
          document.getElementById('wr-s2-rate').value = 0;
        } else {
          document.getElementById('wr-f3').value = 500;
          document.getElementById('wr-s2-rate').value = 10;
        }
      }
      document.getElementById('wr-type').addEventListener('change', ()=>{
        applyWrTypeDefaults();
        updateWaterRecyclePreview(); calculate();
      });

      ['wr-a','wr-b','wr-d','wr-e1','wr-e2','wr-e3','wr-f1-factor','wr-f2-rate','wr-f3','wr-s2-rate','wr-s3'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateWaterRecyclePreview(); calculate(); });
      });
      updateWaterRecyclePreview();
    }

    if(type==='led'){
      panel.innerHTML = [
        '<h2>ไฟ LED ทั้งอาคาร</h2>',
        '<p class="desc">กรอกจำนวนหลอด กำลังไฟ ราคา และอายุการใช้งานของหลอดเดิมเทียบกับหลอด LED ใหม่ ระบบจะคำนวณ “เงินลงทุนเริ่มต้น” ในหัวข้อด้านล่างให้อัตโนมัติ พร้อมทั้งค่าไฟและค่าเปลี่ยนหลอดที่ประหยัดได้</p>',
        '<div class="field-row single">',
          '<div class="field"><label>จำนวนหลอด/โคมที่จะเปลี่ยน <span class="hint">หลอด</span></label><input type="number" id="l-count" value="20" min="0"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>สถานะหลอดเดิม</label>',
          '<select id="l-old-status">',
            '<option value="working">ยังใช้งานได้ดี — เปลี่ยนก่อนกำหนดเพื่อประหยัดไฟ</option>',
            '<option value="expiring">ใกล้หมดอายุแล้ว — ต้องเปลี่ยนอยู่ดีไม่ว่าจะเปลี่ยนเป็น LED หรือไม่ (คิดแค่ส่วนต่างราคา LED ลบราคาหลอดเดิม)</option>',
          '</select>',
          '<span class="note">ถ้าหลอดเดิมใกล้หมดอายุอยู่แล้ว ต่อให้ไม่เปลี่ยนเป็น LED ก็ต้องซื้อหลอดใหม่มาเปลี่ยนอยู่ดี เงินลงทุนที่แท้จริงของการเลือก LED จึงเป็นแค่ส่วนต่างราคา ไม่ใช่ราคาเต็ม</span></div>',
        '</div>',
        '<div class="field-row single" id="l-remaining-life-wrap">',
          '<div class="field"><label>อายุคงเหลือของหลอดเดิม (โดยประมาณ) <span class="hint">ชั่วโมง</span></label><input type="number" id="l-remaining-life" value="10000" min="0"/>',
          '<span class="note">ถ้าหลอดเดิมยังใช้งานได้ดีและถูกถอดทิ้งก่อนหมดอายุ ถือว่าเสียมูลค่าที่ยังเหลืออยู่ไปเปล่าๆ ส่วนนี้จะถูกนับเป็นต้นทุนเพิ่มของการเปลี่ยนก่อนกำหนด (ยิ่งเหลืออายุเยอะ ยิ่งเสียดายมาก) ใส่ 0 ถ้าไม่ทราบหรือไม่ต้องการคิดส่วนนี้</span></div>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>กำลังไฟหลอดเดิม <span class="hint">วัตต์/หลอด</span></label><input type="number" id="l-old-watt" value="36" min="0"/></div>',
          '<div class="field"><label>กำลังไฟหลอด LED ใหม่ <span class="hint">วัตต์/หลอด</span></label><input type="number" id="l-new-watt" value="18" min="0"/></div>',
        '</div>',
        '<div class="field-row single">',
          '<div class="field"><label>ชั่วโมงใช้งานเฉลี่ย <span class="hint">ชม./วัน</span></label><input type="number" id="l-hours" value="10" min="0" step="0.5"/></div>',
        '</div>',
        '<div class="ref-box">',
          '<div class="ref-box-label">ราคา &amp; อายุการใช้งานหลอด — ไว้เทียบค่าเปลี่ยนหลอด</div>',
          '<div class="field-row">',
            '<div class="field"><label>ราคาหลอดเดิม/หลอด <span class="hint">บาท</span></label><input type="number" id="l-old-price" value="120" min="0"/></div>',
            '<div class="field"><label>อายุการใช้งานหลอดเดิม <span class="hint">ชั่วโมง</span></label><input type="number" id="l-old-life" value="10000" min="500" step="500"/></div>',
          '</div>',
          '<div class="field-row">',
            '<div class="field"><label>ราคาหลอด LED ใหม่/หลอด <span class="hint">บาท</span></label><input type="number" id="l-new-price" value="150" min="0"/></div>',
            '<div class="field"><label>อายุการใช้งานหลอด LED <span class="hint">ชั่วโมง</span></label><input type="number" id="l-new-life" value="30000" min="500" step="500"/></div>',
          '</div>',
          '<span class="note" id="l-life-warning" style="display:none;color:var(--rust);"></span>',
        '</div>',
        '<div class="field-row">',
          '<div class="field"><label>ค่าติดตั้งเริ่มต้น (ครั้งเดียว) <span class="hint">บาท</span></label><input type="number" id="l-install-cost" value="0" min="0"/>',
          '<span class="note">นอกเหนือจากค่าหลอด เช่น ค่าอุปกรณ์/สายไฟเพิ่มเติมตอนติดตั้งครั้งแรก — นับรวมในเงินลงทุนเริ่มต้นครั้งเดียว</span></div>',
          '<div class="field"><label>ค่าแรงเปลี่ยนหลอดต่อครั้ง <span class="hint">บาท/หลอด/ครั้ง</span></label><input type="number" id="l-labor-cost" value="0" min="0"/>',
          '<span class="note">ค่าช่าง/ค่าแรงทุกครั้งที่ต้องเปลี่ยนหลอด (ทั้งหลอดเดิมและหลอด LED) นับซ้ำทุกครั้งที่ถึงรอบเปลี่ยน ต่างจากค่าติดตั้งเริ่มต้นด้านซ้ายที่นับครั้งเดียว</span></div>',
        '</div>',
        '<div class="sub-preview" id="l-preview">ประหยัดโดยประมาณ: — บาท/เดือน</div>'
      ].join('');
      document.getElementById('l-old-status').addEventListener('change', function(){
        document.getElementById('l-remaining-life-wrap').style.display = this.value==='working' ? 'block' : 'none';
        updateLedPreview(); calculate();
      });
      document.getElementById('l-remaining-life-wrap').style.display =
        document.getElementById('l-old-status').value==='working' ? 'block' : 'none';
      ['l-count','l-old-watt','l-new-watt','l-old-price','l-old-life','l-new-price','l-install-cost','l-labor-cost','l-remaining-life'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{ updateLedPreview(); calculate(); });
      });
      ['l-new-life','l-hours'].forEach(id=>{
        document.getElementById(id).addEventListener('input', ()=>{
          syncLedLifespan();
          updateLedPreview(); calculate();
        });
      });
      syncLedLifespan();
      updateLedPreview();
    }

    if(type==='direct'){
      panel.innerHTML = [
        '<h2>'+EQUIPMENT[key].label+'</h2>',
        '<p class="desc">'+EQUIPMENT[key].desc+'</p>',
        '<div class="field-row single">',
          '<div class="field"><label>ประหยัดค่าพลังงานโดยประมาณ <span class="hint">บาท/เดือน (ปีแรก)</span></label>',
          '<input type="number" id="d-savings" value="'+d.savingsPlaceholder+'" min="0"/>',
          '<span class="note">'+d.savingsNote+'</span></div>',
        '</div>'
      ].join('');
      document.getElementById('d-savings').addEventListener('input', calculate);
    }
  }

  /* ---------- Time-period helpers (replaces the old day/night preset) ---------- */
  const SUN_WINDOW = [6, 18];     // ช่วงเวลาที่มีแดด (สมมติฐาน 06:00–18:00)
  const ONPEAK_WINDOW = [9, 22];  // ช่วง On-Peak มาตรฐาน (09:00–22:00)

  function parseTimeStr(v){
    if(!v) return 0;
    const parts = v.split(':').map(Number);
    return (parts[0]||0) + (parts[1]||0)/60;
  }
  function periodLength(s,e){
    return e>s ? e-s : (24-s+e); // รองรับช่วงข้ามเที่ยงคืน เช่น 22:00–06:00
  }
  function overlapHours(aS,aE,bS,bE){
    function seg(s,e){ if(e>s) return [[s,e]]; if(e===s) return [[0,24]]; return [[s,24],[0,e]]; }
    const A=seg(aS,aE), B=seg(bS,bE);
    let total=0;
    A.forEach(a=> B.forEach(b=>{ const lo=Math.max(a[0],b[0]), hi=Math.min(a[1],b[1]); if(hi>lo) total+=hi-lo; }));
    return total;
  }

  function sanitizeTimeInput(el){
    const m = (el.value||'').trim().match(/^(\d{1,2}):?(\d{0,2})$/);
    if(!m){ el.value = el.dataset.prev || '00:00'; return; }
    const h = Math.min(23, Math.max(0, parseInt(m[1],10)||0));
    const mi = Math.min(59, Math.max(0, parseInt(m[2],10)||0));
    const val = String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0');
    el.value = val;
    el.dataset.prev = val;
  }

  /* ---------- Generic "ปีที่ / จำนวนเงิน" row list (ใช้ร่วมกันหลายจุด) ---------- */
  function createYearAmountRow(year, amount, onChange){
    const row = document.createElement('div');
    row.className = 'capex-row';
    row.innerHTML = [
      '<div class="cx-year-wrap"><span>ปีที่</span><input type="number" class="cx-year" value="'+year+'" min="1"/></div>',
      '<div class="cx-amount-wrap"><input type="number" class="cx-amount" value="'+amount+'" min="0"/><span>บาท</span></div>',
      '<button type="button" class="cx-remove" title="ลบรายการนี้">✕</button>'
    ].join('');
    row.querySelectorAll('input').forEach(inp=>{
      inp.addEventListener('input', onChange);
    });
    row.querySelector('.cx-remove').addEventListener('click', ()=>{
      row.remove();
      onChange();
    });
    return row;
  }

  function updateEmptyNote(containerId, noteId){
    const count = document.querySelectorAll('#'+containerId+' .capex-row').length;
    const el = document.getElementById(noteId);
    if(el) el.style.display = count===0 ? 'inline' : 'none';
  }

  function getEventsFromContainer(containerId){
    const rows = document.querySelectorAll('#'+containerId+' .capex-row');
    const events = [];
    rows.forEach(r=>{
      const year = parseInt(r.querySelector('.cx-year').value)||0;
      const amount = parseFloat(r.querySelector('.cx-amount').value)||0;
      if(year>0 && amount>0) events.push({year, amount});
    });
    return events;
  }

  // ปีสุดท้ายที่ระบบยังนับกระแสเงินสดอยู่จริง (เท่ากับ calculate() ใช้ภายใน) — ปีที่เกินกว่านี้ถือว่า "ขายไปแล้ว" ไม่นับต่อ
  function getEffectiveYearsCap(){
    const lifespan = Math.max(parseInt(document.getElementById('f-lifespan').value)||1, 1);
    const sellYearRaw = parseInt(document.getElementById('f-sell-year').value)||lifespan;
    return Math.min(Math.max(sellYearRaw,1), lifespan);
  }

  function updateRangeWarning(containerId, warningId){
    const el = document.getElementById(warningId);
    if(!el) return;
    const cap = getEffectiveYearsCap();
    const outOfRange = getEventsFromContainer(containerId).filter(e=>e.year>cap);
    if(outOfRange.length>0){
      el.style.display = 'block';
      el.textContent = '⚠ รายการปีที่ '+outOfRange.map(e=>e.year).join(', ')+' เกินปีที่จะขาย/อายุใช้งาน ('+cap+' ปี) จะไม่ถูกนับในการคำนวณ';
    } else {
      el.style.display = 'none';
    }
  }

  /* ---------- Major CAPEX events (เปลี่ยนอะไหล่/บำรุงรักษาใหญ่ ระบุปีได้ — หัวข้อเงินลงทุนกลาง) ---------- */
  function createCapexRow(year, amount){
    return createYearAmountRow(year, amount, ()=>{
      updateEmptyNote('capex-rows','capex-empty-note');
      updateRangeWarning('capex-rows','capex-range-warning');
      calculate();
    });
  }

  function updateCapexEmptyNote(){
    updateEmptyNote('capex-rows','capex-empty-note');
  }

  function getMajorCapexEvents(){
    return getEventsFromContainer('capex-rows');
  }

  function createPeriodRow(start,end,pct){
    const row = document.createElement('div');
    row.className = 'period-row';
    row.innerHTML = [
      '<div class="period-time-group">',
        '<input type="text" inputmode="numeric" class="p-start" value="'+start+'" placeholder="00:00" maxlength="5"/>',
        '<span class="p-sep">–</span>',
        '<input type="text" inputmode="numeric" class="p-end" value="'+end+'" placeholder="23:59" maxlength="5"/>',
      '</div>',
      '<div class="period-pct-group">',
        '<input type="number" class="p-pct" value="'+pct+'" min="0" max="100" step="1"/><span class="p-pct-suffix">%</span>',
        '<button type="button" class="p-remove" title="ลบช่วงเวลานี้">✕</button>',
      '</div>'
    ].join('');
    row.querySelector('.p-start').dataset.prev = start;
    row.querySelector('.p-end').dataset.prev = end;
    row.querySelectorAll('.p-start,.p-end').forEach(inp=>{
      inp.addEventListener('blur', ()=>{ sanitizeTimeInput(inp); updatePeriodSum(); updateSolarPreview(); calculate(); });
    });
    row.querySelectorAll('input').forEach(inp=>{
      inp.addEventListener('input', ()=>{ updatePeriodSum(); updateSolarPreview(); calculate(); });
    });
    row.querySelector('.p-remove').addEventListener('click', ()=>{
      row.remove(); updatePeriodSum(); updateSolarPreview(); calculate();
    });
    return row;
  }

  function initPeriods(container){
    container.innerHTML='';
    const defaults = [['06:00','09:00',15],['09:00','17:00',35],['17:00','22:00',30],['22:00','06:00',20]];
    defaults.forEach(([s,e,p])=> container.appendChild(createPeriodRow(s,e,p)));
    updatePeriodSum();
  }

  function updatePeriodSum(){
    const el = document.getElementById('s-period-sum');
    if(!el) return;
    const rows = document.querySelectorAll('#s-periods .period-row');
    let sum=0;
    rows.forEach(r=> sum += parseFloat(r.querySelector('.p-pct').value)||0);
    if(sum>100){
      el.textContent = 'รวม '+sum+'% — เกิน 100% ระบบจะปรับสัดส่วนลงให้อัตโนมัติ';
      el.style.color = 'var(--rust)';
    } else if(sum<100){
      el.textContent = 'รวม '+sum+'% (เหลือ '+(100-sum)+'% ที่ยังไม่ได้ระบุ)';
      el.style.color = 'var(--ink-faint)';
    } else {
      el.textContent = 'รวม 100% ✓';
      el.style.color = 'var(--primary-dark)';
    }
  }

  function getPeriods(){
    const rows = document.querySelectorAll('#s-periods .period-row');
    const periods = [];
    rows.forEach(r=>{
      const start = parseTimeStr(r.querySelector('.p-start').value);
      const end = parseTimeStr(r.querySelector('.p-end').value);
      const pct = parseFloat(r.querySelector('.p-pct').value)||0;
      if(pct>0) periods.push({start,end,pct});
    });
    const sum = periods.reduce((s,p)=>s+p.pct,0);
    if(sum>100){ // ปรับสัดส่วนลงให้ไม่เกิน 100% โดยรักษาสัดส่วนสัมพัทธ์เดิม
      periods.forEach(p=> p.pct = p.pct*100/sum);
    }
    return periods;
  }

  function computeSolarDetail(){
    const size = parseFloat(document.getElementById('s-size').value)||0;
    const sun = parseFloat(document.getElementById('s-sun').value)||0;
    const bill = parseFloat(document.getElementById('s-bill').value)||0;
    const dailyLoad = parseFloat(document.getElementById('s-load').value)||0;
    const periods = getPeriods();

    const batteryEnabled = document.getElementById('s-battery-enabled').checked;
    const batteryCap = batteryEnabled ? (parseFloat(document.getElementById('s-battery-capacity').value)||0) : 0;
    const batteryEff = (parseFloat(document.getElementById('s-battery-efficiency').value)||90)/100;

    const touEnabled = document.getElementById('s-tou-enabled').checked;
    const flatRate = parseFloat(document.getElementById('f-elec-rate').value)||0;
    const peakRate = touEnabled ? (parseFloat(document.getElementById('s-tou-peak-rate').value)||flatRate) : flatRate;
    const offpeakRate = touEnabled ? (parseFloat(document.getElementById('s-tou-offpeak-rate').value)||flatRate) : flatRate;

    const dailyGen = size*sun;
    const sunWindowLen = SUN_WINDOW[1]-SUN_WINDOW[0]; // 12 ชม.
    const genRatePerHour = sunWindowLen>0 ? dailyGen/sunWindowLen : 0; // สมมติผลิตไฟสม่ำเสมอตลอดช่วงที่มีแดด

    // กระจายพลังงานที่ผลิตได้ไปยังแต่ละช่วงเวลาตามจำนวนชั่วโมงที่ทับซ้อนกับช่วงมีแดด (ในอัตราคงที่ genRatePerHour)
    // เพื่อไม่ให้พลังงานหายไปเฉยๆ เมื่อผู้ใช้ไม่ได้กรอกช่วงเวลากลางวันไว้เลย (เช่น กรอกแต่ช่วงกลางคืน 100%)
    const sunOverlaps = periods.map(p=> overlapHours(p.start,p.end,SUN_WINDOW[0],SUN_WINDOW[1]));

    const periodCalc = periods.map((p,i)=>{
      const len = periodLength(p.start,p.end);
      const loadKwh = dailyLoad*p.pct/100;
      const genKwh = genRatePerHour*sunOverlaps[i];
      const onOverlap = overlapHours(p.start,p.end,ONPEAK_WINDOW[0],ONPEAK_WINDOW[1]);
      const onFrac = len>0 ? onOverlap/len : 0;
      const rate = touEnabled ? (peakRate*onFrac + offpeakRate*(1-onFrac)) : flatRate;
      return {
        ...p, loadKwh, genKwh, rate,
        selfC: Math.min(genKwh, loadKwh),
        excess: Math.max(genKwh-loadKwh, 0),
        deficit: Math.max(loadKwh-genKwh, 0)
      };
    });

    // ชั่วโมงที่มีแดดแต่ไม่ถูกครอบคลุมโดยช่วงเวลาใดๆ ที่ผู้ใช้กรอกไว้ ก็ยังผลิตไฟได้ตามจริง
    // พลังงานส่วนนี้ถือเป็น "ส่วนเกิน" ทันที (ไม่มีโหลดมารองรับ) และนำไปชาร์จแบตเตอรี่ได้เช่นกัน
    const coveredSunOverlap = Math.min(sunOverlaps.reduce((a,b)=>a+b,0), sunWindowLen);
    const gapSunOverlap = Math.max(sunWindowLen - coveredSunOverlap, 0);
    const gapExcessKwh = genRatePerHour*gapSunOverlap;

    const totalExcess = periodCalc.reduce((s,p)=>s+p.excess,0) + gapExcessKwh;
    const totalDeficit = periodCalc.reduce((s,p)=>s+p.deficit,0);
    const batteryCharge = Math.min(totalExcess, batteryCap);
    const batteryDischarge = batteryCharge*batteryEff;
    const batteryServedTotal = Math.min(batteryDischarge, totalDeficit);

    let dailySavingsBaht=0, dailyKwhSaved=0, selfCTotal=0;
    periodCalc.forEach(p=>{
      const bServed = totalDeficit>0 ? batteryServedTotal*(p.deficit/totalDeficit) : 0;
      dailySavingsBaht += (p.selfC + bServed)*p.rate;
      dailyKwhSaved += (p.selfC + bServed);
      selfCTotal += p.selfC;
      p.batteryServed = bServed;
    });

    let monthlySavings = dailySavingsBaht*30;
    if(bill>0 && monthlySavings>bill) monthlySavings = bill;

    return {
      monthlyGenKwh: dailyGen*30,
      monthlyKwhSaved: dailyKwhSaved*30,
      monthlySavings,
      monthlySelfConsumption: selfCTotal*30,
      monthlyBatteryServed: batteryServedTotal*30,
      monthlyExport: (totalExcess-batteryCharge)*30,
      batteryEnabled, touEnabled,
      hasPeriods: periods.length>0
    };
  }

  function updateSolarPreview(){
    const r = computeSolarDetail();
    if(!r.hasPeriods){
      document.getElementById('s-preview').innerHTML = '<div>เพิ่มอย่างน้อย 1 ช่วงเวลาเพื่อคำนวณ</div>';
      return;
    }
    const rows = [
      'ผลิตไฟ ~'+Math.round(r.monthlyGenKwh).toLocaleString('th-TH')+' หน่วย/เดือน',
      'ใช้เองจากแดดโดยตรง ~'+Math.round(r.monthlySelfConsumption).toLocaleString('th-TH')+' หน่วย/เดือน'
    ];
    if(r.batteryEnabled){
      rows.push('แบตเตอรี่จ่ายไฟในช่วงที่ขาดแคลน ~'+Math.round(r.monthlyBatteryServed).toLocaleString('th-TH')+' หน่วย/เดือน');
    }
    if(r.monthlyExport>0.5){
      rows.push('เหลือใช้ไม่หมด/ไม่ได้คิดมูลค่า ~'+Math.round(r.monthlyExport).toLocaleString('th-TH')+' หน่วย/เดือน');
    }
    rows.push('<b>ประหยัดโดยประมาณ: '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน</b>');
    document.getElementById('s-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');
  }

  function computeLedDetail(){
    const count = parseFloat(document.getElementById('l-count').value)||0;
    const oldWatt = parseFloat(document.getElementById('l-old-watt').value)||0;
    const newWatt = parseFloat(document.getElementById('l-new-watt').value)||0;
    const hours = parseFloat(document.getElementById('l-hours').value)||0;
    const rate = parseFloat(document.getElementById('f-elec-rate').value)||0;
    const oldPrice = parseFloat(document.getElementById('l-old-price').value)||0;
    const oldLife = parseFloat(document.getElementById('l-old-life').value)||1;
    const newPrice = parseFloat(document.getElementById('l-new-price').value)||0;
    const newLife = parseFloat(document.getElementById('l-new-life').value)||1;

    const diffW = Math.max(oldWatt-newWatt,0)*count;
    const kwhMonth = diffW/1000*hours*30;
    const elecSavingsMonth = kwhMonth*rate;

    // ค่าเปลี่ยนหลอดเฉลี่ยต่อปี = จำนวนครั้งที่ต้องเปลี่ยนต่อปี (ตามชั่วโมงใช้งานจริง หารด้วยอายุใช้งานหลอด) × จำนวนหลอด × (ราคาหลอด + ค่าแรงต่อครั้ง)
    const laborCost = parseFloat(document.getElementById('l-labor-cost').value)||0;
    const annualHours = hours*365;
    const oldReplacementsPerYear = annualHours/oldLife;
    const newReplacementsPerYear = annualHours/newLife;
    const oldMaterialCostYear = oldReplacementsPerYear*count*oldPrice;
    const newMaterialCostYear = newReplacementsPerYear*count*newPrice;
    const oldLaborCostYear = oldReplacementsPerYear*count*laborCost;
    const newLaborCostYear = newReplacementsPerYear*count*laborCost;
    const oldReplacementCostYear = oldMaterialCostYear + oldLaborCostYear;
    const newReplacementCostYear = newMaterialCostYear + newLaborCostYear;
    const materialSavingsYear = oldMaterialCostYear - newMaterialCostYear;
    const laborSavingsYear = oldLaborCostYear - newLaborCostYear;
    const replacementSavingsMonth = (oldReplacementCostYear-newReplacementCostYear)/12;

    const monthlySavings = elecSavingsMonth + replacementSavingsMonth;
    const installCost = parseFloat(document.getElementById('l-install-cost').value)||0;
    const oldStatus = document.getElementById('l-old-status').value;
    // ถ้าหลอดเดิมใกล้หมดอายุอยู่แล้ว ต้องซื้อหลอดใหม่มาเปลี่ยนอยู่ดีไม่ว่าจะเลือก LED หรือไม่ เงินลงทุนที่แท้จริงของ LED
    // จึงเป็นแค่ "ส่วนต่างราคา" ไม่ใช่ราคาเต็ม — ถ้ายังใช้งานได้ดีอยู่ (เปลี่ยนก่อนกำหนด) ถึงจะคิดราคาเต็ม
    // บวกมูลค่าที่เสียไปเปล่าๆ จากการทิ้งหลอดเดิมที่ยังมีอายุคงเหลืออยู่ (สัดส่วนอายุคงเหลือ × ราคาหลอดเดิม)
    let wastedValue = 0;
    if(oldStatus==='working'){
      const remainingLife = parseFloat(document.getElementById('l-remaining-life').value)||0;
      const remainingFraction = oldLife>0 ? Math.min(Math.max(remainingLife/oldLife,0),1) : 0;
      wastedValue = remainingFraction*oldPrice*count;
    }
    const bulbCost = (oldStatus==='expiring') ? (newPrice-oldPrice)*count : count*newPrice + wastedValue;
    const investmentTotal = bulbCost + installCost;
    return { monthlySavings, monthlyKwh: kwhMonth, elecSavingsMonth, oldReplacementCostYear, newReplacementCostYear, replacementSavingsMonth, oldReplacementsPerYear, newReplacementsPerYear, investmentTotal, oldStatus, materialSavingsYear, laborSavingsYear, laborCost, wastedValue };
  }

  function updateLedPreview(){
    const r = computeLedDetail();
    const costEl = document.getElementById('f-cost');
    if(costEl) costEl.value = Math.round(r.investmentTotal);
    const investLabel = r.oldStatus==='expiring'
      ? 'เงินลงทุนเริ่มต้นที่คำนวณให้ (คิดเฉพาะส่วนต่างราคา เพราะหลอดเดิมต้องเปลี่ยนอยู่ดี): '
      : 'เงินลงทุนเริ่มต้นที่คำนวณให้ (ราคาเต็มหลอด LED'+(r.wastedValue>0?' + มูลค่าหลอดเดิมที่เสียไป':'')+'): ';
    const rows = [
      'ลดการใช้ไฟ ~'+r.monthlyKwh.toFixed(1)+' หน่วย/เดือน (ประหยัด '+fmt0(r.elecSavingsMonth)+' บาท/เดือน)',
      'ค่าซื้อหลอดทดแทนตลอดปี (รวมค่าแรงถ้ามี) — หลอดเดิม ~'+fmt0(r.oldReplacementCostYear)+' บาท/ปี · หลอด LED ~'+fmt0(r.newReplacementCostYear)+' บาท/ปี',
    ];
    if(r.laborCost>0){
      rows.push('แยกเฉพาะส่วนค่าแรง: ประหยัดได้ ~'+fmt0(r.laborSavingsYear)+' บาท/ปี (จากค่าหลอดล้วนๆ ประหยัดอีก ~'+fmt0(r.materialSavingsYear)+' บาท/ปี)');
    }
    if(r.wastedValue>0){
      rows.push('มูลค่าหลอดเดิมที่ยังเหลืออยู่แต่ต้องทิ้งไปเปล่าๆ: ~'+fmt0(r.wastedValue)+' บาท (นับเป็นต้นทุนเพิ่มของการเปลี่ยนก่อนกำหนด)');
    }
    rows.push(
      '<b>ประหยัดรวม: '+fmt0(r.monthlySavings)+' บาท/เดือน</b>',
      investLabel+fmt0(r.investmentTotal)+' บาท'
    );
    if(r.investmentTotal<=0){
      rows.push('<span style="color:var(--primary-dark);">หลอด LED ถูกกว่าหรือเท่ากับหลอดเดิมที่ต้องซื้ออยู่ดี จึงไม่มีเงินลงทุนส่วนเพิ่ม (ประหยัดตั้งแต่วันแรก)</span>');
    }
    document.getElementById('l-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');

    const warnEl = document.getElementById('l-life-warning');
    if(warnEl){
      if(r.oldReplacementsPerYear>2 || r.newReplacementsPerYear>2){
        warnEl.style.display = 'block';
        const parts = [];
        if(r.oldReplacementsPerYear>2) parts.push('หลอดเดิมต้องเปลี่ยน ~'+r.oldReplacementsPerYear.toFixed(1)+' ครั้ง/ปี');
        if(r.newReplacementsPerYear>2) parts.push('หลอด LED ต้องเปลี่ยน ~'+r.newReplacementsPerYear.toFixed(1)+' ครั้ง/ปี');
        warnEl.textContent = '⚠ '+parts.join(' และ ')+' — อายุการใช้งานที่กรอกไว้สั้นผิดปกติ (น้อยกว่า 6 เดือนต่อการเปลี่ยนหนึ่งครั้ง) ทำให้ยอดประหยัดพุ่งสูงเกินจริง ลองตรวจสอบตัวเลขอายุหลอดอีกครั้ง';
      } else {
        warnEl.style.display = 'none';
      }
    }
  }

  function computeOtherDetail(){
    const mode = document.getElementById('o-mode').value;
    const rate = parseFloat(document.getElementById('f-elec-rate').value)||0.0001;
    if(mode==='appliance'){
      const oldW = parseFloat(document.getElementById('o-old').value)||0;
      const newW = parseFloat(document.getElementById('o-new').value)||0;
      const hours = parseFloat(document.getElementById('o-hours').value)||0;
      const diffW = Math.max(oldW-newW,0);
      const kwhMonth = diffW/1000*hours*30;
      return { mode, monthlySavings: kwhMonth*rate, monthlyKwh: kwhMonth };
    }
    const savings = parseFloat(document.getElementById('o-savings').value)||0;
    return { mode, monthlySavings: savings, monthlyKwh: savings/rate };
  }

  function updateOtherPreview(){
    const r = computeOtherDetail();
    if(r.mode==='appliance'){
      document.getElementById('o-preview').textContent = 'ลดการใช้ไฟ ~'+r.monthlyKwh.toFixed(1)+' หน่วย/เดือน · ประหยัดโดยประมาณ '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน';
    } else {
      document.getElementById('o-preview').textContent = 'ประหยัดโดยประมาณ: '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน';
    }
  }

  const PETROL_CO2_PER_LITER = 2.31; // kgCO2 ต่อน้ำมัน 1 ลิตร (ค่ามาตรฐานทั่วไปสำหรับเบนซิน)

  // เขียนเงินลงทุนเริ่มต้น/มูลค่าซาก ที่คำนวณได้ ลงในช่องกลาง f-cost / f-salvage ให้อัตโนมัติ
  // เขียนเงินลงทุนเริ่มต้นที่คำนวณได้ ลงในช่องกลาง f-cost ให้อัตโนมัติ
  // ส่วนมูลค่าซาก ใช้ตัวเงินจริง (vehicleSalvageOverrideBaht) เป็นค่าที่นำไปคำนวณจริงเสมอ
  // ช่อง f-salvage (%) ใช้แสดงผลเพื่อความเข้าใจเท่านั้น ไม่ใช่ค่าที่ระบบใช้คำนวณอีกต่อไป
  // โหมด "ซื้อรถน้ำมัน" (ice) เทียบราคาส่วนต่างระหว่างสองคัน — ตัวเลือกผ่อนชำระ/เงินอุดหนุนจึงไม่เข้ากับตัวเลข "ส่วนต่าง" นี้ ซ่อนไว้
  // ส่วนโหมดอื่น (ไม่มีรถ/ใช้รถเดิม) เงินลงทุนคือราคาเต็มของรถจริงๆ ตัวเลือกผ่อน/ส่วนลดยังใช้ได้ตามปกติ
  function applyIceModeUI(isIce){
    document.getElementById('f-subsidy-field').style.display = isIce ? 'none' : 'flex';
    document.getElementById('f-subsidy-field').parentElement.style.gridTemplateColumns = isIce ? '1fr' : '1fr 1fr';
    document.getElementById('f-loan-toggle-row').style.display = isIce ? 'none' : 'flex';
    if(isIce){
      document.getElementById('loan-fields').style.display = 'none';
      document.getElementById('f-loan-enabled').checked = false;
    }
    document.getElementById('f-cost-label').innerHTML = isIce
      ? 'เงินทุนส่วนต่างราคา <span class="hint">บาท</span>'
      : 'เงินลงทุนเริ่มต้น <span class="hint">บาท</span>';
  }

  function applyVehicleInvestment(investmentPremium, salvageBaht){
    const costEl = document.getElementById('f-cost');
    const salvageEl = document.getElementById('f-salvage');
    if(!costEl || !salvageEl) return;
    costEl.value = Math.round(investmentPremium);
    vehicleSalvageOverrideBaht = salvageBaht;
    if(investmentPremium!==0){
      salvageEl.value = Math.round((salvageBaht/investmentPremium*100)*10)/10;
    } else {
      salvageEl.value = 0; // แสดงเป็น % ไม่ได้เมื่อเงินลงทุนเป็น 0 — ตัวเลขจริงที่ใช้คำนวณคือ salvageBaht ด้านบน (ดูในกล่องพรีวิว)
    }
  }

  // เขียนส่วนต่างค่าบำรุงรักษา/ค่าใช้จ่ายอื่นๆ (ของใหม่ ลบ ของเทียบเคียง) ลงในช่องกลาง f-maintenance / f-other-cost
  function applyVehicleMaintenance(maintDiff, otherDiff){
    const maintEl = document.getElementById('f-maintenance');
    const otherEl = document.getElementById('f-other-cost');
    if(!maintEl || !otherEl) return;
    maintEl.value = Math.round(maintDiff);
    otherEl.value = Math.round(otherDiff);
  }

  // ซิงก์ "จำนวนปีที่จะใช้รถ" เข้ากับ "อายุการใช้งานอุปกรณ์" และ "ปีที่จะขาย" ที่ใช้ร่วมกันทั้งระบบ
  // เพราะราคาขายที่กรอกในแท็บรถยนต์ตอนนี้หมายถึงมูลค่า ณ ปีที่ระบุนี้โดยตรง ไม่ต้องคำนวณค่าเสื่อมราคาอีกชั้น
  function syncHoldYears(fieldId){
    const years = Math.max(parseInt(document.getElementById(fieldId).value)||1, 1);
    document.getElementById('f-lifespan').value = years;
    document.getElementById('f-sell-year').value = years;
    // หมายเหตุ: ในแท็บรถยนต์ ราคาขายที่กรอกไว้คือมูลค่า ณ ปีที่ขายเท่านั้น เกินกว่านั้นไม่มีความหมาย (ขายไปแล้วเทียบต่อไม่ได้)
    // จึง sync อายุการใช้งานอุปกรณ์ให้เท่ากับปีที่จะขายเสมอ ต่างจากอุปกรณ์ทั่วไปที่อายุใช้งานกับปีที่ขายเป็นคนละเรื่องกันได้
  }

  // คำนวณ "อายุการใช้งานอุปกรณ์" (ปี) จากอายุหลอด LED (ชั่วโมง) หารด้วยชั่วโมงใช้งานจริงต่อปี
  // แล้ว sync ล็อกเข้ากับช่องกลาง เพื่อให้ระยะเวลาวิเคราะห์ทั้งโครงการตรงกับอายุใช้งานจริงของหลอดที่ติดตั้ง
  function syncLedLifespan(){
    const newLife = parseFloat(document.getElementById('l-new-life').value)||1;
    const hours = parseFloat(document.getElementById('l-hours').value)||1;
    const years = Math.max(newLife/(hours*365), 0.5);
    document.getElementById('f-lifespan').value = Math.round(years*10)/10;
  }

  function computeBevDetail(){
    const bevPrice = parseFloat(document.getElementById('v-bev-price').value)||0;
    const bevResale = parseFloat(document.getElementById('v-bev-resale').value)||0;
    const compareMode = document.getElementById('v-compare-mode').value;
    const distance = parseFloat(document.getElementById('v-distance').value)||0;
    const fuelPrice = parseFloat(document.getElementById('v-fuel-price').value)||0;
    const kwh100 = parseFloat(document.getElementById('v-kwh100').value)||0;
    const homeShare = (parseFloat(document.getElementById('v-home-share').value)||0)/100;
    const publicRate = parseFloat(document.getElementById('v-public-rate').value)||0;
    const homeRate = parseFloat(document.getElementById('f-elec-rate').value)||0;
    const co2Factor = parseFloat(document.getElementById('f-co2').value)||0;

    let refPrice=0, refResale=0, baselineCostAvoided=0, litersAvoided=0, repairEvents=[];
    if(compareMode==='ice'){
      refPrice = parseFloat(document.getElementById('v-ref-price').value)||0;
      refResale = parseFloat(document.getElementById('v-ref-resale').value)||0;
      const kmpl = parseFloat(document.getElementById('v-kmpl').value)||0.1;
      litersAvoided = kmpl>0 ? distance/kmpl : 0;
      baselineCostAvoided = litersAvoided*fuelPrice;
    } else if(compareMode==='keepold'){
      const kmpl = parseFloat(document.getElementById('v-keepold-kmpl').value)||0.1;
      litersAvoided = kmpl>0 ? distance/kmpl : 0;
      baselineCostAvoided = litersAvoided*fuelPrice;
      repairEvents = getEventsFromContainer('v-repair-rows'); // ไม่มีรถเทียบเคียงให้ซื้อ ไม่มีราคาซื้อ/ขายคืนฝั่งเทียบเคียง
    } else { // nocar
      baselineCostAvoided = parseFloat(document.getElementById('v-nocar-cost').value)||0;
    }

    const kwhUsed = distance/100*kwh100;
    const elecCost = kwhUsed*homeShare*homeRate + kwhUsed*(1-homeShare)*publicRate;
    const monthlySavings = baselineCostAvoided - elecCost;
    const monthlyCo2Kg = (compareMode==='ice' || compareMode==='keepold' ? litersAvoided*PETROL_CO2_PER_LITER : 0) - kwhUsed*co2Factor;

    const bevMaint = parseFloat(document.getElementById('v-bev-maint').value)||0;
    const bevOther = parseFloat(document.getElementById('v-bev-other').value)||0;
    let refMaint=0, refOther=0;
    if(compareMode==='ice'){
      refMaint = parseFloat(document.getElementById('v-ref-maint').value)||0;
      refOther = parseFloat(document.getElementById('v-ref-other').value)||0;
    } else if(compareMode==='keepold'){
      refMaint = parseFloat(document.getElementById('v-keepold-maint').value)||0;
      refOther = parseFloat(document.getElementById('v-keepold-other').value)||0;
    } // nocar: ไม่มีรถเทียบเคียง refMaint/refOther = 0

    const investmentPremium = bevPrice - refPrice;
    const salvageBaht = bevResale - refResale; // ทั้งสองค่าคือราคาขาย ณ ปีที่ใช้จริง (จำนวนปีที่จะใช้รถ) ไม่ต้องคำนวณค่าเสื่อมราคาซ้อน
    const maintDiff = bevMaint - refMaint;
    const otherDiff = bevOther - refOther;

    return { baselineCostAvoided, elecCost, monthlySavings, monthlyCo2Kg, kwhUsed, investmentPremium, salvageBaht, compareMode, repairEvents, maintDiff, otherDiff };
  }

  function investmentWarningRow(investmentPremium, compareMode){
    if(investmentPremium===0){
      return compareMode==='ice'
        ? '<span style="color:var(--rust);">⚠ ราคารถทั้งสองคันเท่ากันพอดี เงินลงทุนส่วนเพิ่มจึงเป็น 0 บาท — ถ้าไม่ตั้งใจ ลองเช็คราคารถทั้งสองช่องด้านบนอีกครั้ง</span>'
        : '<span style="color:var(--rust);">⚠ ราคารถเป็น 0 บาท ลองเช็คช่อง “ราคารถที่จะซื้อ” ด้านบนอีกครั้ง</span>';
    }
    if(investmentPremium<0){
      return '<span style="color:var(--primary-dark);">รถคันที่จะซื้อถูกกว่ารถที่เทียบเคียงอยู่แล้ว จึงไม่มีเงินลงทุนส่วนเพิ่ม (ประหยัดตั้งแต่วันแรก)</span>';
    }
    return '';
  }

  function updateBevPreview(){
    const r = computeBevDetail();
    applyVehicleInvestment(r.investmentPremium, r.salvageBaht);
    applyVehicleMaintenance(r.maintDiff, r.otherDiff);
    const baselineLabel = r.compareMode==='ice' ? 'ค่าน้ำมันที่ประหยัดได้'
      : (r.compareMode==='keepold' ? 'ค่าน้ำมันรถเดิมที่ประหยัดได้' : 'ค่าเดินทางทางเลือกที่ไม่ต้องจ่าย');
    const rows = [
      baselineLabel+' ~'+Math.round(r.baselineCostAvoided).toLocaleString('th-TH')+' บาท/เดือน',
      'ค่าไฟชาร์จที่ต้องจ่าย ~'+Math.round(r.elecCost).toLocaleString('th-TH')+' บาท/เดือน ('+r.kwhUsed.toFixed(0)+' หน่วย)',
      '<b>ประหยัดสุทธิ: '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน</b>',
      'เงินลงทุนเริ่มต้นที่คำนวณให้: '+Math.round(r.investmentPremium).toLocaleString('th-TH')+' บาท · มูลค่าซากสุทธิ (ราคาขาย ณ ปีที่ระบุ): '+Math.round(r.salvageBaht).toLocaleString('th-TH')+' บาท',
      'ส่วนต่างค่าบำรุงรักษา/ปี: '+fmt0(r.maintDiff)+' บาท · ส่วนต่างค่าใช้จ่ายอื่นๆ/ปี: '+fmt0(r.otherDiff)+' บาท'
    ];
    if(r.compareMode==='keepold' && r.repairEvents.length>0){
      const total = r.repairEvents.reduce((s,e)=>s+e.amount,0);
      rows.push('ค่าอะไหล่รถเดิมที่ประหยัดได้เพิ่ม: '+fmt0(total)+' บาท รวม '+r.repairEvents.length+' รายการ (นับในปีที่ระบุแต่ละรายการ)');
    }
    const warn = investmentWarningRow(Math.round(r.investmentPremium), r.compareMode);
    if(warn) rows.push(warn);
    document.getElementById('v-bev-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');
  }

  function computeHybridDetail(){
    const hybridPrice = parseFloat(document.getElementById('h-price').value)||0;
    const hybridResale = parseFloat(document.getElementById('h-resale').value)||0;
    const compareMode = document.getElementById('h-compare-mode').value;
    const distance = parseFloat(document.getElementById('h-distance').value)||0;
    const fuelPrice = parseFloat(document.getElementById('h-fuel-price').value)||0;
    const kmplNew = parseFloat(document.getElementById('h-kmpl-new').value)||0.1;
    const phevMode = document.getElementById('h-phev-mode').value; // 'hev' หรือ 'phev'
    const homeRate = parseFloat(document.getElementById('f-elec-rate').value)||0;
    const co2Factor = parseFloat(document.getElementById('f-co2').value)||0;

    let evShare=0, kwhUsed=0, elecCost=0, evDistance=0;
    if(phevMode==='phev'){
      evShare = (parseFloat(document.getElementById('h-ev-share').value)||0)/100;
      const evKwh100 = parseFloat(document.getElementById('h-ev-kwh100').value)||0;
      const homeShare = (parseFloat(document.getElementById('h-home-share').value)||0)/100;
      const publicRate = parseFloat(document.getElementById('h-public-rate').value)||0;
      evDistance = distance*evShare;
      kwhUsed = evDistance/100*evKwh100;
      elecCost = kwhUsed*homeShare*homeRate + kwhUsed*(1-homeShare)*publicRate;
    }
    const fuelDistance = distance - evDistance; // ระยะทางส่วนที่เหลือ ใช้อัตราสิ้นเปลืองโหมดน้ำมันตามปกติ
    const litersNew = kmplNew>0 ? fuelDistance/kmplNew : 0;
    const hybridFuelCost = litersNew*fuelPrice;
    // อัตราสิ้นเปลืองเทียบเท่าตลอดทั้งทริป (รวมช่วงที่ขับด้วยไฟฟ้าล้วนซึ่งไม่ใช้น้ำมันเลย)
    const effectiveKmpl = litersNew>0 ? distance/litersNew : null;

    let refPrice=0, refResale=0, monthlySavings=0, monthlyCo2Kg=0, litersSaved=0, repairEvents=[];
    if(compareMode==='ice'){
      refPrice = parseFloat(document.getElementById('h-ref-price').value)||0;
      refResale = parseFloat(document.getElementById('h-ref-resale').value)||0;
      const kmplOld = parseFloat(document.getElementById('h-kmpl-old').value)||0.1;
      const litersOld = kmplOld>0 ? distance/kmplOld : 0;
      litersSaved = Math.max(litersOld-litersNew,0);
      monthlySavings = litersSaved*fuelPrice - elecCost;
      monthlyCo2Kg = litersSaved*PETROL_CO2_PER_LITER - kwhUsed*co2Factor;
    } else if(compareMode==='keepold'){
      const kmplOld = parseFloat(document.getElementById('h-keepold-kmpl').value)||0.1;
      const litersOld = kmplOld>0 ? distance/kmplOld : 0;
      litersSaved = Math.max(litersOld-litersNew,0);
      monthlySavings = litersSaved*fuelPrice - elecCost;
      monthlyCo2Kg = litersSaved*PETROL_CO2_PER_LITER - kwhUsed*co2Factor;
      repairEvents = getEventsFromContainer('h-repair-rows'); // ไม่มีรถเทียบเคียงให้ซื้อ ไม่มีราคาซื้อ/ขายคืนฝั่งเทียบเคียง
    } else { // nocar
      const noCarCost = parseFloat(document.getElementById('h-nocar-cost').value)||0;
      monthlySavings = noCarCost - hybridFuelCost - elecCost;
      monthlyCo2Kg = -(litersNew*PETROL_CO2_PER_LITER + kwhUsed*co2Factor);
    }

    const hMaint = parseFloat(document.getElementById('h-maint').value)||0;
    const hOther = parseFloat(document.getElementById('h-other').value)||0;
    let hRefMaint=0, hRefOther=0;
    if(compareMode==='ice'){
      hRefMaint = parseFloat(document.getElementById('h-ref-maint').value)||0;
      hRefOther = parseFloat(document.getElementById('h-ref-other').value)||0;
    } else if(compareMode==='keepold'){
      hRefMaint = parseFloat(document.getElementById('h-keepold-maint').value)||0;
      hRefOther = parseFloat(document.getElementById('h-keepold-other').value)||0;
    } // nocar: ไม่มีรถเทียบเคียง

    const investmentPremium = hybridPrice - refPrice;
    const salvageBaht = hybridResale - refResale; // ทั้งสองค่าคือราคาขาย ณ ปีที่ใช้จริง (จำนวนปีที่จะใช้รถ) ไม่ต้องคำนวณค่าเสื่อมราคาซ้อน
    const maintDiff = hMaint - hRefMaint;
    const otherDiff = hOther - hRefOther;

    return { litersSaved, hybridFuelCost, elecCost, effectiveKmpl, phevMode, monthlySavings, monthlyCo2Kg, investmentPremium, salvageBaht, compareMode, repairEvents, maintDiff, otherDiff };
  }

  function updateHybridPreview(){
    const r = computeHybridDetail();
    applyVehicleInvestment(r.investmentPremium, r.salvageBaht);
    applyVehicleMaintenance(r.maintDiff, r.otherDiff);
    const rows = (r.compareMode==='ice' || r.compareMode==='keepold')
      ? ['ลดการใช้น้ำมัน ~'+r.litersSaved.toFixed(1)+' ลิตร/เดือน']
      : ['ค่าน้ำมันที่ต้องจ่ายเอง ~'+Math.round(r.hybridFuelCost).toLocaleString('th-TH')+' บาท/เดือน'];
    if(r.phevMode==='phev'){
      rows.push('ค่าไฟชาร์จที่ต้องจ่าย ~'+Math.round(r.elecCost).toLocaleString('th-TH')+' บาท/เดือน');
      rows.push('อัตราสิ้นเปลืองเทียบเท่า (รวมโหมดไฟฟ้า) ~'+(r.effectiveKmpl===null ? '∞ (ไม่ใช้น้ำมันเลย)' : r.effectiveKmpl.toFixed(1)+' กม./ลิตร'));
    }
    rows.push('<b>ประหยัดสุทธิ: '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน</b>');
    rows.push('เงินลงทุนเริ่มต้นที่คำนวณให้: '+Math.round(r.investmentPremium).toLocaleString('th-TH')+' บาท · มูลค่าซากสุทธิ (ราคาขาย ณ ปีที่ระบุ): '+Math.round(r.salvageBaht).toLocaleString('th-TH')+' บาท');
    rows.push('ส่วนต่างค่าบำรุงรักษา/ปี: '+fmt0(r.maintDiff)+' บาท · ส่วนต่างค่าใช้จ่ายอื่นๆ/ปี: '+fmt0(r.otherDiff)+' บาท');
    if(r.compareMode==='keepold' && r.repairEvents.length>0){
      const total = r.repairEvents.reduce((s,e)=>s+e.amount,0);
      rows.push('ค่าอะไหล่รถเดิมที่ประหยัดได้เพิ่ม: '+fmt0(total)+' บาท รวม '+r.repairEvents.length+' รายการ (นับในปีที่ระบุแต่ละรายการ)');
    }
    const warn = investmentWarningRow(Math.round(r.investmentPremium), r.compareMode);
    if(warn) rows.push(warn);
    document.getElementById('v-hybrid-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');
  }

  function computeWaterRecycleDetail(){
    const waterType = (document.getElementById('wr-type')||{}).value || 'ufro';
    const isUfOnly = (waterType==='uf');
    const A = parseFloat(document.getElementById('wr-a').value)||0;
    const B = parseFloat(document.getElementById('wr-b').value)||0;
    const C = parseFloat(document.getElementById('f-elec-rate').value)||0;
    const D = parseFloat(document.getElementById('wr-d').value)||0;
    const E1 = parseFloat(document.getElementById('wr-e1').value)||0;
    const E2 = parseFloat(document.getElementById('wr-e2').value)||0;
    const E3 = parseFloat(document.getElementById('wr-e3').value)||0;
    const f1Factor = parseFloat(document.getElementById('wr-f1-factor').value)||0;
    const f2Rate = parseFloat(document.getElementById('wr-f2-rate').value)||0;
    const F3 = isUfOnly ? 0 : (parseFloat(document.getElementById('wr-f3').value)||0);
    const s2Rate = isUfOnly ? 0 : (parseFloat(document.getElementById('wr-s2-rate').value)||0);
    const S3 = parseFloat(document.getElementById('wr-s3').value)||0;

    const F1 = A*f1Factor*C;   // ค่าไฟฟ้าระบบ RO/UF = A × สัดส่วนไฟฟ้าต่อหน่วยน้ำ (kWh/ลบ.ม.) × C
    const F2 = A*f2Rate;       // ค่าสารเคมี/ไส้กรอง = A × อัตราต่อหน่วยน้ำ
    const S1 = A*B;            // ประหยัดค่าน้ำประปา = A × B (สูตรตรง ไม่ใช่ค่าประเมิน)
    const S2 = A*s2Rate;       // ประหยัดค่าเคมี Cooling Tower = A × อัตราต่อหน่วยน้ำ (0 ถ้าเป็น UF อย่างเดียว)

    const E = E1+E2+E3;
    const F = F1+F2+F3;
    const S = S1+S2+S3;
    const netPerDay = S-F;
    const netAnnual = netPerDay*D;
    const monthlySavings = netAnnual/12;
    const volumeAnnual = A*D; // ลบ.ม./ปี ที่รีไซเคิลได้จริง
    const volumeMonth = volumeAnnual/12;

    return { E, F, S, F1, F2, S1, S2, netPerDay, netAnnual, monthlySavings, volumeMonth, A, D };
  }

  function updateWaterRecyclePreview(){
    const r = computeWaterRecycleDetail();
    document.getElementById('wr-f1f2-live').textContent = 'F1 (ค่าไฟฟ้า) = '+fmt0(r.F1)+' บาท/วัน · F2 (สารเคมี/ไส้กรอง) = '+fmt0(r.F2)+' บาท/วัน';
    document.getElementById('wr-s1-live').textContent = 'S1 (ประหยัดค่าน้ำประปา = A × B) = '+fmt0(r.S1)+' บาท/วัน';
    document.getElementById('wr-s2-live').textContent = 'S2 (ประหยัดค่าเคมี Cooling Tower) = '+fmt0(r.S2)+' บาท/วัน';
    document.getElementById('wr-e-total').textContent = 'รวมเงินลงทุน (E): '+fmt0(r.E)+' บาท';
    document.getElementById('wr-f-total').textContent = 'รวมต้นทุนเดินระบบ (F): '+fmt0(r.F)+' บาท/วัน';
    document.getElementById('wr-s-total').textContent = 'รวมผลประหยัด (S): '+fmt0(r.S)+' บาท/วัน';
    applyVehicleInvestment(r.E, r.E*0.05); // ใช้กลไกเดียวกับแท็บรถยนต์: เติมเงินลงทุนอัตโนมัติ (มูลค่าซากประเมิน 5% ของทุน)
    const rows = [
      'ผลประหยัดสุทธิ (S-F) × D = '+fmt0(r.netAnnual)+' บาท/ปี',
      'เทียบเท่า '+fmt0(r.monthlySavings)+' บาท/เดือน',
      'ปริมาณน้ำรีไซเคิลได้ ~'+fmt0(r.volumeMonth)+' ลบ.ม./เดือน',
      '<b>เงินลงทุนที่คำนวณให้ (E): '+fmt0(r.E)+' บาท</b>'
    ];
    document.getElementById('wr-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');
  }

  function computeWaterDetail(){
    const people = parseFloat(document.getElementById('w-people').value)||0;
    const liters = parseFloat(document.getElementById('w-liters').value)||0;
    const price = parseFloat(document.getElementById('w-price').value)||0;
    const litersMonth = people*liters*30;
    const monthlySavings = litersMonth*price;
    const bottlesMonth = litersMonth/0.6; // อ้างอิงขนาดขวดน้ำดื่มมาตรฐาน 600 มล./ขวด
    return { litersMonth, monthlySavings, bottlesMonth };
  }

  function updateWaterPreview(){
    const r = computeWaterDetail();
    const rows = [
      'น้ำดื่มที่ไม่ต้องซื้อ ~'+Math.round(r.litersMonth).toLocaleString('th-TH')+' ลิตร/เดือน',
      'ลดขวดพลาสติก ~'+Math.round(r.bottlesMonth).toLocaleString('th-TH')+' ขวด/เดือน (อ้างอิงขวด 600 มล.)',
      '<b>ประหยัดโดยประมาณ: '+Math.round(r.monthlySavings).toLocaleString('th-TH')+' บาท/เดือน</b>'
    ];
    document.getElementById('v-water-preview').innerHTML = rows.map(x=>'<div>'+x+'</div>').join('');
  }

  function getMonthlySavings(){
    const type = EQUIPMENT[activeTab].subcalc;
    const rate = parseFloat(document.getElementById('f-elec-rate').value)||0;
    if(type==='solar'){
      return computeSolarDetail().monthlySavings;
    }
    if(type==='other'){
      return computeOtherDetail().monthlySavings;
    }
    if(type==='led'){
      return computeLedDetail().monthlySavings;
    }
    if(type==='bev') return computeBevDetail().monthlySavings;
    if(type==='hybrid') return computeHybridDetail().monthlySavings;
    if(type==='water') return computeWaterDetail().monthlySavings;
    if(type==='waterrecycle') return computeWaterRecycleDetail().monthlySavings;
    return parseFloat(document.getElementById('d-savings').value)||0;
  }

  // คืนค่า kgCO2 ที่ลดได้ต่อเดือน — คำนวณต่างกันตามประเภทอุปกรณ์ (ไฟฟ้าที่ไม่ใช้จากกริด vs. น้ำมันที่ไม่เผาผลาญ)
  function getMonthlyCo2Kg(){
    const type = EQUIPMENT[activeTab].subcalc;
    const rate = parseFloat(document.getElementById('f-elec-rate').value)||0.0001;
    const co2Factor = parseFloat(document.getElementById('f-co2').value)||0;
    if(type==='solar'){
      return computeSolarDetail().monthlyKwhSaved*co2Factor;
    }
    if(type==='other'){
      return computeOtherDetail().monthlyKwh*co2Factor;
    }
    if(type==='led'){
      return computeLedDetail().monthlyKwh*co2Factor;
    }
    if(type==='bev') return computeBevDetail().monthlyCo2Kg;
    if(type==='hybrid') return computeHybridDetail().monthlyCo2Kg;
    if(type==='water') return 0; // ไม่คำนวณ CO2 จากขวด/ถังพลาสติกในรุ่นนี้
    if(type==='waterrecycle') return 0; // ใช้การ์ด "ปริมาณน้ำที่รีไซเคิลได้" แทน CO2
    return ((parseFloat(document.getElementById('d-savings').value)||0)/rate)*co2Factor;
  }

  /* ---------------- Financing / advanced UI wiring ---------------- */
  document.getElementById('f-loan-enabled').addEventListener('change', function(){
    document.getElementById('loan-fields').style.display = this.checked ? 'block' : 'none';
    calculate();
  });
  document.getElementById('advanced-toggle').addEventListener('click', function(){
    const body = document.getElementById('advanced-body');
    const chev = document.getElementById('advanced-chev');
    body.classList.toggle('open');
    chev.classList.toggle('open');
  });
  document.getElementById('capex-toggle').addEventListener('click', function(){
    const body = document.getElementById('capex-body');
    const chev = document.getElementById('capex-chev');
    body.classList.toggle('open');
    chev.classList.toggle('open');
  });
  document.getElementById('capex-add-btn').addEventListener('click', function(){
    document.getElementById('capex-rows').appendChild(createCapexRow(5, 20000));
    updateCapexEmptyNote();
    updateRangeWarning('capex-rows','capex-range-warning');
    calculate();
  });
  updateCapexEmptyNote();
  updateRangeWarning('capex-rows','capex-range-warning');
  document.getElementById('f-elec-rate').addEventListener('input', ()=>{
    if(EQUIPMENT[activeTab].subcalc==='solar') updateSolarPreview();
    if(EQUIPMENT[activeTab].subcalc==='other') updateOtherPreview();
    if(EQUIPMENT[activeTab].subcalc==='led') updateLedPreview();
    if(EQUIPMENT[activeTab].subcalc==='bev') updateBevPreview();
    if(EQUIPMENT[activeTab].subcalc==='hybrid') updateHybridPreview();
    if(EQUIPMENT[activeTab].subcalc==='waterrecycle') updateWaterRecyclePreview();
    calculate();
  });
  ['f-sell-year','f-lifespan'].forEach(id=>{
    document.getElementById(id).addEventListener('input', ()=>{
      // ปีที่จะขาย/อายุการใช้งาน กระทบมูลค่าซากแบบค่าเสื่อมราคาเส้นตรงของแท็บรถยนต์ ต้องคำนวณเงินลงทุน/มูลค่าซากใหม่
      if(EQUIPMENT[activeTab].subcalc==='bev') updateBevPreview();
      if(EQUIPMENT[activeTab].subcalc==='hybrid') updateHybridPreview();
      updateRangeWarning('capex-rows','capex-range-warning');
      updateRangeWarning('v-repair-rows','v-repair-range-warning');
      updateRangeWarning('h-repair-rows','h-repair-range-warning');
      calculate();
    });
  });
  document.getElementById('recalc-btn').addEventListener('click', calculate);
  document.getElementById('export-btn').addEventListener('click', prepareAndPrint);

  function prepareAndPrint(){
    const isWaterCalc = (EQUIPMENT[activeTab].subcalc==='water');
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', {year:'numeric', month:'long', day:'numeric'});
    document.getElementById('print-meta').textContent =
      EQUIPMENT[activeTab].label + ' · สร้างรายงานเมื่อ ' + dateStr;

    const val = id => { const el = document.getElementById(id); return el ? el.value : null; };
    const loanEnabled = document.getElementById('f-loan-enabled').checked;

    const items = [
      ['เงินลงทุนเริ่มต้น', fmt0(parseFloat(val('f-cost'))||0)+' บาท'],
      ['เงินอุดหนุน/ส่วนลด', fmt0(parseFloat(val('f-subsidy'))||0)+' บาท'],
      ['วิธีชำระเงิน', loanEnabled ? ('ผ่อนชำระ (ดาวน์ '+val('f-downpayment')+'%, ดอกเบี้ย '+val('f-loan-rate')+'%, '+val('f-loan-term')+' ปี)') : 'เงินสดเต็มจำนวน'],
    ];
    const capexEvents = getMajorCapexEvents();
    if(capexEvents.length>0){
      items.push(['ค่าเปลี่ยนอะไหล่/บำรุงรักษาใหญ่', capexEvents.map(e=> 'ปี '+e.year+': '+fmt0(e.amount)+' บาท').join(', ')]);
    }
    if(EQUIPMENT[activeTab].subcalc==='bev' && val('v-compare-mode')==='keepold'){
      const rEvents = getEventsFromContainer('v-repair-rows');
      if(rEvents.length>0) items.push(['ค่าอะไหล่รถเดิมที่ประหยัดได้', rEvents.map(e=>'ปี '+e.year+': '+fmt0(e.amount)+' บาท').join(', ')]);
    }
    if(EQUIPMENT[activeTab].subcalc==='hybrid' && val('h-compare-mode')==='keepold'){
      const rEvents = getEventsFromContainer('h-repair-rows');
      if(rEvents.length>0) items.push(['ค่าอะไหล่รถเดิมที่ประหยัดได้', rEvents.map(e=>'ปี '+e.year+': '+fmt0(e.amount)+' บาท').join(', ')]);
    }
    if(!isWaterCalc){
      items.push(['อัตราค่าไฟฟ้าปัจจุบัน', val('f-elec-rate')+' บาท/หน่วย']);
    }
    items.push(
      [isWaterCalc ? 'อัตราราคาน้ำดื่มเพิ่มขึ้นเฉลี่ย' : 'อัตราค่าไฟเพิ่มขึ้นเฉลี่ย', val('f-escalation')+' %/ปี'],
      ['อายุการใช้งานอุปกรณ์', val('f-lifespan')+' ปี'],
      ['ปีที่จะขาย/รับมูลค่าซาก', val('f-sell-year')+' ปี'],
      ['ค่าบำรุงรักษา', fmt0(parseFloat(val('f-maintenance'))||0)+' บาท/ปี'],
      ['ค่าใช้จ่ายอื่นๆ (ประกัน/ภาษี/ค่าธรรมเนียม)', fmt0(parseFloat(val('f-other-cost'))||0)+' บาท/ปี'],
      ['เงินเฟ้อค่าบำรุงรักษา', val('f-maint-inflation')+' %/ปี'],
      ['ประสิทธิภาพลดลงต่อปี', val('f-degradation')+' %/ปี'],
      ['มูลค่าซากเมื่อหมดอายุ', val('f-salvage')+' % ของทุน'],
      ['อัตราคิดลด (NPV/IRR)', val('f-discount')+' %/ปี'],
      ['ประหยัดเดือนแรก (ปีที่ 1)', fmt0(getMonthlySavings())+' บาท/เดือน']
    );
    if(!isWaterCalc){
      items.push(['ค่าปล่อย CO2 ต่อหน่วยไฟฟ้า', val('f-co2')+' kg/kWh']);
    }

    document.getElementById('print-summary-grid').innerHTML = items.map(([k,v])=>
      '<div class="item"><span class="k">'+k+'</span><span class="v">'+v+'</span></div>'
    ).join('');

    window.print();
  }

  ['f-cost','f-subsidy','f-downpayment','f-loan-rate','f-loan-term','f-escalation',
   'f-lifespan','f-maintenance','f-maint-inflation','f-other-cost','f-degradation','f-salvage','f-sell-year','f-discount','f-co2']
   .forEach(id=> document.getElementById(id).addEventListener('input', calculate));

  /* ---------------- Finance helpers ---------------- */
  function pmt(rate, nper, pv){
    if(nper<=0) return 0;
    if(rate===0) return pv/nper;
    return pv*rate/(1-Math.pow(1+rate,-nper));
  }
  function npvOf(rate, flows){ // flows[0] is year0
    return flows.reduce((s,cf,t)=> s + cf/Math.pow(1+rate,t), 0);
  }
  function irrOf(flows){
    let lo=-0.99, hi=5;
    const flo=npvOf(lo,flows), fhi=npvOf(hi,flows);
    if((flo>0 && fhi>0) || (flo<0 && fhi<0)) return null;
    for(let i=0;i<80;i++){
      const mid=(lo+hi)/2;
      const fm=npvOf(mid,flows);
      if(Math.abs(fm)<1e-6) return mid;
      if((fm>0)===(flo>0)) lo=mid; else hi=mid;
    }
    return (lo+hi)/2;
  }
  const fmt0 = n => Math.round(n).toLocaleString('th-TH');
  const fmt1 = n => n.toLocaleString('th-TH',{maximumFractionDigits:1,minimumFractionDigits:1});

  /* ---------------- Master calculation ---------------- */
  let chart;
  function calculate(){
    const cost = parseFloat(document.getElementById('f-cost').value)||0;
    const subsidy = Math.min(parseFloat(document.getElementById('f-subsidy').value)||0, cost);
    const netInvestment = Math.max(cost - subsidy, 0);

    const loanEnabled = document.getElementById('f-loan-enabled').checked;
    const downPct = parseFloat(document.getElementById('f-downpayment').value)||0;
    const loanRate = (parseFloat(document.getElementById('f-loan-rate').value)||0)/100;
    const loanTerm = parseInt(document.getElementById('f-loan-term').value)||0;

    const elecRate = parseFloat(document.getElementById('f-elec-rate').value)||0.0001;
    const escalation = (parseFloat(document.getElementById('f-escalation').value)||0)/100;
    const lifespan = Math.max(parseInt(document.getElementById('f-lifespan').value)||1,1);
    const maintenance0 = parseFloat(document.getElementById('f-maintenance').value)||0;
    const otherCost0 = parseFloat(document.getElementById('f-other-cost').value)||0;
    const maintInflation = (parseFloat(document.getElementById('f-maint-inflation').value)||0)/100;
    const degradation = (parseFloat(document.getElementById('f-degradation').value)||0)/100;
    const salvagePct = parseFloat(document.getElementById('f-salvage').value)||0;
    const sellYearRaw = parseInt(document.getElementById('f-sell-year').value)||lifespan;
    const effectiveYears = Math.min(Math.max(sellYearRaw,1), lifespan); // ปีสุดท้ายที่ยังถือครองอุปกรณ์อยู่จริง
    const discount = (parseFloat(document.getElementById('f-discount').value)||0)/100;
    const co2Factor = parseFloat(document.getElementById('f-co2').value)||0;

    const monthlySavings0 = getMonthlySavings();
    const annualSavings0 = monthlySavings0*12;
    const annualCo2Kg0 = getMonthlyCo2Kg()*12;

    let upfrontOutflow, loanAmount=0, downPayment=0, annualLoanPayment=0;
    if(loanEnabled){
      downPayment = netInvestment * downPct/100;
      loanAmount = netInvestment - downPayment;
      annualLoanPayment = pmt(loanRate, loanTerm, loanAmount);
      upfrontOutflow = downPayment;
    } else {
      upfrontOutflow = netInvestment;
    }

    // การ์ด KPI พิเศษแทน CO2 สำหรับอุปกรณ์ที่ไม่เกี่ยวกับไฟฟ้าโดยตรง (เครื่องกรองน้ำ/ระบบรีไซเคิลน้ำ)
    const specialKpiBySubcalc = {
      water: { label:'ขวดพลาสติกที่ลดได้ตลอดอายุใช้งาน', unit:'ขวด', decimals:0, monthlyAmount: ()=> computeWaterDetail().bottlesMonth },
      waterrecycle: { label:'ปริมาณน้ำที่รีไซเคิลได้ตลอดอายุโครงการ', unit:'ลบ.ม.', decimals:0, monthlyAmount: ()=> computeWaterRecycleDetail().volumeMonth }
    };
    const specialKpi = specialKpiBySubcalc[EQUIPMENT[activeTab].subcalc] || null;
    const annualSpecial0 = specialKpi ? specialKpi.monthlyAmount()*12 : 0;
    const majorCapexEvents = getMajorCapexEvents();

    // ค่าอะไหล่ชิ้นใหญ่ของ "รถเดิม" ที่จะประหยัดได้ ถ้าเปลี่ยนมาใช้รถใหม่แทน (เฉพาะโหมด "ไม่ซื้อรถ ใช้รถเดิมต่อ")
    let vehicleRepairEvents = [];
    if(EQUIPMENT[activeTab].subcalc==='bev' && document.getElementById('v-compare-mode').value==='keepold'){
      vehicleRepairEvents = getEventsFromContainer('v-repair-rows');
    } else if(EQUIPMENT[activeTab].subcalc==='hybrid' && document.getElementById('h-compare-mode').value==='keepold'){
      vehicleRepairEvents = getEventsFromContainer('h-repair-rows');
    }

    const years=[], grossSavingsArr=[], maintArr=[], netCFArr=[], ownerCFArr=[];
    let cumUndiscounted = -netInvestment; // asset-level payback (ignores financing structure)
    let cumOwner = -upfrontOutflow;
    let cumDiscounted = -upfrontOutflow;
    let simplePaybackYear=null, discPaybackYear=null;
    let totalLifetimeSavings=0, totalCo2Kg=0, totalSpecial=0;

    for(let t=1;t<=effectiveYears;t++){
      const savings_t = annualSavings0 * Math.pow(1+escalation,t-1) * Math.pow(1-degradation,t-1);
      const maint_t = maintenance0 * Math.pow(1+maintInflation,t-1);
      const otherCost_t = otherCost0 * Math.pow(1+maintInflation,t-1);
      const co2_t = annualCo2Kg0 * Math.pow(1-degradation,t-1);
      const special_t = annualSpecial0 * Math.pow(1-degradation,t-1);
      const capex_t = majorCapexEvents.filter(e=>e.year===t).reduce((s,e)=>s+e.amount,0);
      const repairAvoided_t = vehicleRepairEvents.filter(e=>e.year===t).reduce((s,e)=>s+e.amount,0);
      let assetNet_t = savings_t - maint_t - otherCost_t - capex_t + repairAvoided_t;
      let ownerNet_t = assetNet_t - ((loanEnabled && t<=loanTerm) ? annualLoanPayment : 0);
      if(t===effectiveYears){
        const salvage = vehicleSalvageOverrideBaht!==null ? vehicleSalvageOverrideBaht : (cost*salvagePct/100);
        assetNet_t += salvage;
        ownerNet_t += salvage;
      }

      const prevCum = cumUndiscounted;
      cumUndiscounted += assetNet_t;
      if(simplePaybackYear===null && cumUndiscounted>=0){
        const frac = assetNet_t!==0 ? (-prevCum)/assetNet_t : 0;
        simplePaybackYear = (t-1)+Math.min(Math.max(frac,0),1);
      }

      const discountedCF = ownerNet_t/Math.pow(1+discount,t);
      const prevDisc = cumDiscounted;
      cumDiscounted += discountedCF;
      if(discPaybackYear===null && cumDiscounted>=0){
        const frac = discountedCF!==0 ? (-prevDisc)/discountedCF : 0;
        discPaybackYear = (t-1)+Math.min(Math.max(frac,0),1);
      }

      cumOwner += ownerNet_t;
      totalLifetimeSavings += savings_t;
      totalCo2Kg += co2_t;
      totalSpecial += special_t;

      years.push(t);
      grossSavingsArr.push(savings_t);
      maintArr.push(maint_t + otherCost_t + capex_t - repairAvoided_t + ((loanEnabled && t<=loanTerm)?annualLoanPayment:0));
      netCFArr.push(ownerNet_t);
      ownerCFArr.push(cumOwner);
    }

    if(simplePaybackYear===null) simplePaybackYear = effectiveYears; // never paid back within holding period -> cap for display
    const paybackDisplay = cumUndiscounted< -0.0001 && simplePaybackYear>=effectiveYears ? null : simplePaybackYear;

    // owner cash flow series for IRR (year0 + years1..N)
    const ownerFlows = [-upfrontOutflow, ...netCFArr];
    const irr = irrOf(ownerFlows);
    const npv = npvOf(discount, ownerFlows);
    const roiPct = upfrontOutflow>0 ? ((netCFArr.reduce((a,b)=>a+b,0) - upfrontOutflow)/upfrontOutflow*100) : 0;

    // ---- render KPIs ----
    document.getElementById('kpi-payback').innerHTML = (paybackDisplay===null ? 'เกินอายุใช้งาน' : fmt1(paybackDisplay)) + (paybackDisplay===null?'':'<span>ปี</span>');
    document.getElementById('kpi-dpayback').innerHTML = (discPaybackYear===null ? 'เกินอายุใช้งาน' : fmt1(discPaybackYear)) + (discPaybackYear===null?'':'<span>ปี</span>');
    document.getElementById('kpi-roi').innerHTML = fmt0(roiPct)+'<span>%</span>';
    document.getElementById('kpi-npv').innerHTML = fmt0(npv)+'<span>บาท</span>';
    document.getElementById('kpi-irr').innerHTML = (irr===null? 'N/A' : fmt1(irr*100)+'<span>%/ปี</span>');
    document.getElementById('kpi-total-savings').innerHTML = fmt0(totalLifetimeSavings)+'<span>บาท</span>';
    if(specialKpi){
      document.getElementById('kpi-co2-label').textContent = specialKpi.label;
      document.getElementById('kpi-co2').innerHTML = fmt0(totalSpecial)+'<span id="kpi-co2-unit">'+specialKpi.unit+'</span>';
    } else {
      document.getElementById('kpi-co2-label').textContent = 'CO2 ที่ลดได้ตลอดอายุใช้งาน';
      document.getElementById('kpi-co2').innerHTML = fmt1(totalCo2Kg/1000)+'<span id="kpi-co2-unit">ตัน</span>';
    }
    document.getElementById('kpi-monthly').innerHTML = fmt0(monthlySavings0)+'<span>บาท</span>';

    document.getElementById('kpi-npv').parentElement.classList.toggle('warn', npv<0);
    document.getElementById('kpi-npv').parentElement.classList.toggle('accent', npv>=0);

    // ---- receipt (render first so a chart failure never blocks this) ----
    document.getElementById('receipt-sub').textContent = EQUIPMENT[activeTab].label + ' · ' +
      (effectiveYears<lifespan ? ('ถือครอง '+effectiveYears+' ปี แล้วขาย (จากอายุใช้งานสูงสุด '+lifespan+' ปี)') : ('อายุใช้งาน '+lifespan+' ปี'));
    const tbody = document.getElementById('receipt-body');
    tbody.innerHTML='';
    let breakevenMarked=false;
    for(let i=0;i<years.length;i++){
      const tr=document.createElement('tr');
      const isBreak = !breakevenMarked && ownerCFArr[i]>=0;
      if(isBreak) breakevenMarked=true;
      if(isBreak) tr.classList.add('breakeven');
      tr.innerHTML = '<td>ปี '+years[i]+'</td><td>'+fmt0(grossSavingsArr[i])+'</td><td>'+fmt0(maintArr[i])+'</td><td>'+fmt0(netCFArr[i])+'</td><td>'+fmt0(ownerCFArr[i])+'</td>';
      tbody.appendChild(tr);
    }
    document.getElementById('receipt-total-val').textContent = fmt0(netCFArr.reduce((a,b)=>a+b,0)-upfrontOutflow)+' บาท';

    // ---- chart (wrapped defensively so a rendering/library issue never hides the results above) ----
    const fallbackEl = document.getElementById('chart-fallback');
    try{
      if(typeof Chart === 'undefined') throw new Error('Chart.js ไม่พร้อมใช้งาน');
      const ctx = document.getElementById('cashflow-chart').getContext('2d');
      const chartData = [-upfrontOutflow, ...ownerCFArr];
      const chartLabels = ['0', ...years.map(String)];
      if(chart) chart.destroy();
      chart = new Chart(ctx, {
        type:'line',
        data:{
          labels: chartLabels,
          datasets:[{
            data: chartData,
            borderColor:'#1F6F54',
            backgroundColor:'rgba(31,111,84,0.12)',
            fill:true,
            tension:0.25,
            pointRadius:0,
            borderWidth:2.5
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          plugins:{legend:{display:false}, tooltip:{callbacks:{label:(c)=> fmt0(c.parsed.y)+' บาท'}}},
          scales:{
            x:{grid:{display:false}, ticks:{font:{family:'JetBrains Mono',size:10}, maxTicksLimit:12}, title:{display:true,text:'ปีที่',font:{size:11}}},
            y:{grid:{color:'#DEE5DC'}, ticks:{font:{family:'JetBrains Mono',size:10}, callback:(v)=> (v/1000)+'k'}}
          }
        }
      });
      fallbackEl.style.display = 'none';
    }catch(err){
      console.warn('คำนวณผลลัพธ์ได้ตามปกติ แต่วาดกราฟไม่สำเร็จ:', err);
      fallbackEl.style.display = 'block';
    }
  }

  /* ---------------- Ads & links loader (อ่านจาก ads-config.json) ---------------- */
  function renderAdSlot(slotId, cfg){
    const box = document.getElementById('ad-slot-'+slotId);
    if(!box) return;
    const wrapper = box.closest('.ad-slot');
    if(!cfg || !cfg.type || cfg.type==='none'){
      if(wrapper) wrapper.style.display = 'none'; // ไม่ตั้งค่า/ปิดใช้งาน -> ไม่แสดงกล่องเปล่าบนเว็บจริง
      return;
    }
    if(wrapper) wrapper.style.display = '';
    if(cfg.type==='adsense' && cfg.client && cfg.slot){
      ensureAdsenseScript(cfg.client);
      box.innerHTML = '<ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="'+cfg.client+'" data-ad-slot="'+cfg.slot+'" data-ad-format="'+(cfg.format||'auto')+'" data-full-width-responsive="true"></ins>';
      try{ (window.adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){ console.warn('AdSense push failed', e); }
    } else if(cfg.type==='custom' && cfg.imageUrl){
      const a = document.createElement('a');
      a.href = cfg.linkUrl || '#';
      a.target = '_blank'; a.rel = 'noopener sponsored';
      a.style.display='block'; a.style.width='100%';
      const img = document.createElement('img');
      img.src = cfg.imageUrl; img.alt = cfg.alt || 'sponsor';
      img.style.maxWidth='100%'; img.style.height='auto'; img.style.display='block'; img.style.margin='0 auto';
      a.appendChild(img);
      box.innerHTML=''; box.appendChild(a);
    } else if(cfg.type==='html' && cfg.html){
      box.innerHTML = cfg.html; // เนื้อหาที่เจ้าของเว็บกำหนดเอง (ไม่ใช่ข้อมูลจากผู้เยี่ยมชม จึงไม่มีความเสี่ยง XSS)
    } else {
      if(wrapper) wrapper.style.display = 'none';
    }
  }

  function ensureAdsenseScript(client){
    if(document.querySelector('script[data-adsbygoogle-loader]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+client;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-adsbygoogle-loader','1');
    document.head.appendChild(s);
  }

  function renderFooterLinks(links){
    const el = document.getElementById('footer-links');
    if(!el) return;
    if(!Array.isArray(links) || links.length===0){ el.style.display='none'; return; }
    el.innerHTML = links.map(l=> '<a href="'+l.url+'" target="_blank" rel="noopener">'+l.label+'</a>').join('');
    el.style.display = 'flex';
  }

  function loadAdsConfig(){
    fetch('ads-config.json', {cache:'no-store'})
      .then(r=> r.ok ? r.json() : null)
      .then(cfg=>{
        if(!cfg) return;
        const slots = cfg.slots || {};
        renderAdSlot('top', slots.top);
        renderAdSlot('mid', slots.mid);
        renderAdSlot('footer', slots.footer);
        renderFooterLinks(cfg.links);
      })
      .catch(()=>{ /* เปิดไฟล์ตรงๆ ผ่าน file:// หรือยังไม่มีไฟล์ ads-config.json -> คงกล่อง placeholder ไว้ให้เห็นตำแหน่ง */ });
  }

  /* ---------------- init ---------------- */
  setActiveTab('solar');
  loadAdsConfig();
})();
