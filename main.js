document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // 1. 滾動淡入動畫 (Scroll Reveal)
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // 工具函式：等待延遲
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 2. 動態能力 AI Flow (四部曲)
  let flowRunning = false;
  const runFlowBtn = $('#runFlow');
  const resetFlowBtn = $('#resetFlow');
  const flowLog = $('#flowLog');

  if (runFlowBtn) {
    runFlowBtn.addEventListener('click', async () => {
      if (flowRunning) return;
      flowRunning = true;
      $$('.flow-node, .connector').forEach(x => x.classList.remove('active'));

      const labels = [
        '步驟 01：整合課表、天氣、歷史訂單與行事曆進行特徵輸入',
        '步驟 02：Sensing 感知需求熱點，啟動智慧集單與批量門檻',
        '步驟 03：Seizing 抓住離峰產能，向店家發出批量備餐與熱點配送指令',
        '步驟 04：Reconfiguring 重構物流，完成 3 個熱點巡迴並回傳取餐碼'
      ];

      for (let i = 0; i < 4; i++) {
        if (i > 0) {
          const line = document.querySelector(`[data-line="${i - 1}"]`);
          if (line) line.classList.add('active');
        }
        const node = document.querySelector(`[data-step="${i}"]`);
        if (node) node.classList.add('active');
        if (flowLog) flowLog.textContent = labels[i];
        await sleep(750);
      }

      if (flowLog) flowLog.textContent = '🎉 AI Flow 決策完成：已成功產生今日批量備餐指令與熱點巡迴時刻表！';
      flowRunning = false;
    });
  }

  if (resetFlowBtn) {
    resetFlowBtn.addEventListener('click', () => {
      $$('.flow-node, .connector').forEach(x => x.classList.remove('active'));
      if (flowLog) flowLog.textContent = '等待執行指令';
      flowRunning = false;
    });
  }

  // 3. 模組 1：AI 需求預測模擬器 (P.14)
  const studentCount = $('#studentCount');
  const studentOutput = $('#studentOutput');
  const predictBtn = $('#predictBtn');
  const prediction = $('#prediction');

  if (studentCount && studentOutput) {
    studentCount.addEventListener('input', e => {
      studentOutput.textContent = e.target.value;
    });
  }

  function animateText(el, target, prefix = '', suffix = '') {
    let start = 0, d = 700, t0 = performance.now();
    function f(t) {
      let p = Math.min((t - t0) / d, 1);
      let v = Math.round(start + (target - start) * p);
      el.textContent = prefix + v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  if (predictBtn && prediction) {
    predictBtn.addEventListener('click', () => {
      let n = Number($('#studentCount').value) * 0.35;
      const w = $('#weather').value;
      const e = $('#exam').value;

      if (w === 'cloudy') n *= 1.05;
      if (w === 'rain') n *= 1.145;
      if (e === 'yes') n *= 1.2;

      animateText(prediction, Math.round(n), '預測需求量：', ' 份');
    });
  }

  // 4. 模組 2：智慧團購門檻模擬 (P.15)
  let orders = 0;
  const progressBar = $('#progressBar');
  const orderCount = $('#orderCount');
  const groupStatus = $('#groupStatus');
  const addOrderBtn = $('#addOrder');
  const resetOrdersBtn = $('#resetOrders');

  function renderOrders() {
    const pct = orders * 10;
    if (progressBar) progressBar.style.width = pct + '%';
    if (orderCount) orderCount.textContent = `${orders} / 10`;
    if (groupStatus) {
      groupStatus.textContent = orders < 10
        ? `再加入 ${10 - orders} 份即可解鎖批量配送與免運門檻`
        : '🎉 團購門檻達成！批量專車配送已成功解鎖，享受免運直達！';
    }
  }

  if (addOrderBtn) {
    addOrderBtn.addEventListener('click', () => {
      orders = Math.min(10, orders + 1);
      renderOrders();
    });
  }

  if (resetOrdersBtn) {
    resetOrdersBtn.addEventListener('click', () => {
      orders = 0;
      renderOrders();
    });
  }

  // 5. 模組 3：校園熱點物流模擬 (SVG 校園專車巡迴 - P.16)
  const startDelivery = $('#startDelivery');
  const resetDelivery = $('#resetDelivery');
  const vehicle = $('#deliveryVehicle');
  const routeProgress = $('#deliveryProgress');
  const path = $('#deliveryPath');
  const deliveryBar = $('#deliveryBar');
  const deliveryPercent = $('#deliveryPercent');
  const deliveryTime = $('#deliveryTime');
  const deliveryTitle = $('#deliveryTitle');
  const deliveryMessage = $('#deliveryMessage');
  const pickupPanel = $('#pickupPanel');
  const pickupCode = $('#pickupCode');

  let deliveryRunning = false;
  let deliveryFrame = null;

  function setDeliveryState(progress) {
    const pct = Math.round(progress * 100);
    if (deliveryBar) deliveryBar.style.width = pct + '%';
    if (deliveryPercent) deliveryPercent.textContent = pct + '%';
    if (routeProgress) routeProgress.style.strokeDashoffset = 100 - pct;

    if (path && vehicle) {
      const len = path.getTotalLength();
      const point = path.getPointAtLength(len * progress);
      vehicle.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }

    const stops = [
      { p: 0.34, n: 1, title: '抵達管理學院', msg: '第一批餐點已進入管院保溫熱點櫃。' },
      { p: 0.72, n: 2, title: '抵達工程大樓', msg: '第二批餐點完成定點交付與簽收。' },
      { p: 0.98, n: 3, title: '抵達綜合教學館', msg: '最後一批餐點順利送達，全線配送完畢。' }
    ];

    stops.forEach(s => {
      if (progress >= s.p) {
        const stopNode = document.querySelector(`[data-stop="${s.n}"]`);
        if (stopNode) stopNode.classList.add('active');
        if (deliveryTitle) deliveryTitle.textContent = s.title;
        if (deliveryMessage) deliveryMessage.textContent = s.msg;
      }
    });
  }

  if (startDelivery) {
    startDelivery.addEventListener('click', () => {
      if (deliveryRunning) return;
      deliveryRunning = true;
      if (pickupPanel) pickupPanel.classList.remove('show');
      if (vehicle) vehicle.classList.add('running');
      if (deliveryTitle) deliveryTitle.textContent = '專車巡迴配送中';
      if (deliveryMessage) deliveryMessage.textContent = 'AI 智慧調度專車正沿最佳化路徑批量巡迴送餐。';
      if (deliveryTime) deliveryTime.textContent = '約 3 分鐘';

      const start = performance.now();
      const duration = 5200;

      function animate(t) {
        const p = Math.min((t - start) / duration, 1);
        setDeliveryState(p);
        if (p < 1) {
          deliveryFrame = requestAnimationFrame(animate);
        } else {
          deliveryRunning = false;
          if (deliveryTitle) deliveryTitle.textContent = '全線配送完成';
          if (deliveryMessage) deliveryMessage.textContent = '三個校園取餐熱點已全數完成交付。';
          if (deliveryTime) deliveryTime.textContent = '3 分鐘取餐';
          if (pickupCode) pickupCode.textContent = String(Math.floor(1000 + Math.random() * 9000));
          if (pickupPanel) pickupPanel.classList.add('show');
        }
      }
      deliveryFrame = requestAnimationFrame(animate);
    });
  }

  if (resetDelivery) {
    resetDelivery.addEventListener('click', () => {
      if (deliveryFrame) cancelAnimationFrame(deliveryFrame);
      deliveryRunning = false;
      setDeliveryState(0);
      if (vehicle) vehicle.classList.remove('running');
      $$('.hotspot').forEach(x => x.classList.remove('active'));
      if (deliveryTitle) deliveryTitle.textContent = '等待專車出發';
      if (deliveryMessage) deliveryMessage.textContent = '批量訂單已完成整併，可啟動校園巡迴配送。';
      if (deliveryTime) deliveryTime.textContent = '--';
      if (pickupPanel) pickupPanel.classList.remove('show');
      if (pickupCode) pickupCode.textContent = '----';
    });
  }

  // 6. 模組 4：營運決策儀表板 (P.17)
  const dashboardScenarios = {
    normal: {
      demand: 548,
      grouping: 88,
      pickup: 2.8,
      load: 72,
      peak: '12:10 尖峰',
      series: [18, 28, 46, 78, 100, 82, 52, 30],
      hotspots: [78, 66, 72],
      health: '目前各系館熱點容量充足，可平穩承接預測需求。'
    },
    rain: {
      demand: 627,
      grouping: 93,
      pickup: 3.0,
      load: 86,
      peak: '12:00 雨天尖峰提前',
      series: [22, 35, 58, 88, 100, 92, 70, 44],
      hotspots: [91, 82, 85],
      health: '雨天外帶需求大幅上升，系統已增加 30% 批量專車發車頻次。'
    },
    exam: {
      demand: 692,
      grouping: 95,
      pickup: 3.1,
      load: 91,
      peak: '11:50 考試週提早下課',
      series: [30, 43, 67, 94, 100, 96, 75, 50],
      hotspots: [94, 88, 91],
      health: '已啟動考試週尖峰調度，管院與工學院熱點已開設備援保溫櫃。'
    }
  };

  function animateDashboardNumber(el, target, suffix = '', decimals = 0) {
    if (!el) return;
    const startValue = parseFloat(el.textContent) || 0;
    const start = performance.now();
    function tick(t) {
      const p = Math.min((t - start) / 550, 1);
      const v = startValue + (target - startValue) * p;
      el.textContent = v.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function updateDemandChart(values) {
    const xs = [55, 150, 245, 340, 435, 530, 625, 720];
    const ys = values.map(v => 250 - (v / 100) * 205);
    const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');

    const demandLine = $('#demandLine');
    const demandArea = $('#demandArea');
    const demandDots = $('#demandDots');

    if (demandLine) demandLine.setAttribute('points', points);
    if (demandArea) demandArea.setAttribute('d', `M55 250 L${xs.map((x, i) => `${x} ${ys[i]}`).join(' L')} L720 250 Z`);
    if (demandDots) demandDots.innerHTML = xs.map((x, i) => `<circle cx="${x}" cy="${ys[i]}" r="6"/>`).join('');
  }

  function updateDashboard(key) {
    const s = dashboardScenarios[key];
    if (!s) return;
    animateDashboardNumber($('#dashDemand'), s.demand);
    animateDashboardNumber($('#dashGrouping'), s.grouping, '%');
    animateDashboardNumber($('#dashPickup'), s.pickup, '', 1);
    animateDashboardNumber($('#dashLoad'), s.load, '%');

    const peakLabel = $('#peakLabel');
    if (peakLabel) peakLabel.textContent = s.peak;

    updateDemandChart(s.series);

    ['A', 'B', 'C'].forEach((n, i) => {
      const bar = $(`#hotspot${n}`);
      const val = $(`#hotspot${n}Value`);
      if (bar) bar.style.width = s.hotspots[i] + '%';
      if (val) val.textContent = s.hotspots[i] + '%';
    });

    const healthText = $('#healthText');
    if (healthText) healthText.textContent = s.health;
  }

  $$('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.scenario-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      updateDashboard(btn.dataset.scenario);
    });
  });

  updateDashboard('normal');

  // 7. 理論架構地圖 (文獻 Linnenluecke 2017 與 5 大流派精確映射)
  const theoryData = {
    vdn: {
      number: 'CORE CONCEPT',
      title: 'AI 虛擬學餐網絡 (Virtual Dining Network)',
      text: '以 AI 需求預測、智慧湊單、熱點批量配送與 3 分鐘取餐，將分散之校園需求與校外店家供給整合成去中心化之供餐韌性網絡。',
      tags: ['去中心化', '商業模式適應性', '降低供應鏈脆弱性', '韌性供餐']
    },
    resilience: {
      number: 'THEORY 01',
      title: '降低供應鏈脆弱性與中斷之設計原則 (Linnenluecke 第 3 流派)',
      text: '落實去中心化（消除單點集中式學餐失效風險）、模組化標準接口、具備產能緩衝（離峰備餐吸收尖峰壓力），建立可複製的運作核心。',
      tags: ['去中心化', '模組化流程', '產能緩衝', '消除單點故障']
    },
    capability: {
      number: 'THEORY 02',
      title: '動態能力理論 (Dynamic Capabilities)',
      text: 'Sensing 感知校園課表與天氣需求、Seizing 抓住校外店家離峰產能與智慧湊單、Reconfiguring 重構校園最後一哩熱點配送路徑。',
      tags: ['Sensing (感知)', 'Seizing (把握機會)', 'Reconfiguring (重構能力)']
    },
    bullwhip: {
      number: 'THEORY 03',
      title: '牛鞭效應減緩 (Bullwhip Effect Mitigation)',
      text: '以提前聚合的訂購資訊取代逐層扭曲的猜測，提高店家需求可視性，讓備料由猜測性備料轉為確定性備料，顯著減少食材報廢。',
      tags: ['需求可視性 (Visibility)', '確定性備料', '降低剩食報廢']
    },
    lastmile: {
      number: 'THEORY 04',
      title: '最後一哩熱點物流 (Hotspot-Based Logistics)',
      text: '揚棄外送員個別進出建築的混亂模式，改為系館熱點集中批量直送，將學生取餐時間大幅壓縮至 3 分鐘內，同時減少校園交通負擔。',
      tags: ['批量專車配送', '系館熱點取餐', '3分鐘極速憑碼領餐']
    },
    learning: {
      number: 'THEORY 05',
      title: '商業模式的適應性 (Linnenluecke 第 5 流派)',
      text: '透過科技賦能，擺脫對固定實體食堂的剛性依賴。即使校內餐廳面臨長期整修，整個校園飲食生態也能展現敏捷的適應與轉移能力。',
      tags: ['科技賦能', '擺脫實體依賴', '適應性商業模式', '持續演化']
    }
  };

  $$('.theory-node').forEach(node => {
    node.addEventListener('click', () => {
      const d = theoryData[node.dataset.theory];
      if (!d) return;
      $$('.theory-node').forEach(x => x.classList.remove('active'));
      node.classList.add('active');

      const theoryNumber = $('#theoryNumber');
      const theoryTitle = $('#theoryTitle');
      const theoryText = $('#theoryText');
      const theoryTags = $('#theoryTags');

      if (theoryNumber) theoryNumber.textContent = d.number;
      if (theoryTitle) theoryTitle.textContent = d.title;
      if (theoryText) theoryText.textContent = d.text;
      if (theoryTags) {
        theoryTags.innerHTML = d.tags.map(t => `<i>${t}</i>`).join('');
      }
    });
  });

  // 8. 第七章：挑戰與因應對策 Tabs 切換
  const tabBtns = $$('.c-tab-btn');
  const tabPanels = $$('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = $('#' + btn.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // 9. 簡報投影模式切換 (Presentation Mode)
  const presentationBtn = $('#presentationMode');
  if (presentationBtn) {
    presentationBtn.addEventListener('click', () => {
      document.body.classList.toggle('presentation-active');
      const isActive = document.body.classList.contains('presentation-active');
      presentationBtn.innerHTML = isActive 
        ? '<span class="icon">✕</span> 退出簡報 (ESC)' 
        : '<span class="icon">🖥️</span> 簡報模式';
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('presentation-active')) {
      if (presentationBtn) presentationBtn.click();
    }
  });

  // 10. Canvas 暖色微光粒子背景 (Golden Warm Crumbs & Particles)
  const canvas = $('#particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let pts = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(65, Math.floor(window.innerWidth / 22));
      pts = [...Array(count)].map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.35 + 0.15
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 119, 6, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    draw();
  }
});
