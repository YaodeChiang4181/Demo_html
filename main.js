
document.addEventListener('DOMContentLoaded',()=>{
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('active');revealObserver.unobserve(e.target)}}),{threshold:.14});
 $$('.reveal').forEach(el=>revealObserver.observe(el));
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)); let running=false;
 $('#runFlow').addEventListener('click',async()=>{if(running)return;running=true;$$('.flow-node,.connector').forEach(x=>x.classList.remove('active'));const labels=['整合課表、天氣、歷史訂單與行事曆','Sensing：分析需求熱點','Seizing：發出備餐與湊單指令','Reconfiguring：完成熱點配送決策'];for(let i=0;i<4;i++){if(i>0) document.querySelector(`[data-line="${i-1}"]`).classList.add('active');document.querySelector(`[data-step="${i}"]`).classList.add('active');$('#flowLog').textContent=labels[i];await sleep(700)}$('#flowLog').textContent='AI Flow 完成：已產生批量配送與取餐熱點決策';running=false});
 $('#resetFlow').addEventListener('click',()=>{$$('.flow-node,.connector').forEach(x=>x.classList.remove('active'));$('#flowLog').textContent='等待執行'});
 $('#studentCount').addEventListener('input',e=>$('#studentOutput').textContent=e.target.value);
 $('#predictBtn').addEventListener('click',()=>{let n=Number($('#studentCount').value)*.35;const w=$('#weather').value,e=$('#exam').value;if(w==='cloudy')n*=1.05;if(w==='rain')n*=1.145;if(e==='yes')n*=1.2;animateText($('#prediction'),Math.round(n),'預測需求量：',' 份')});
 function animateText(el,target,prefix='',suffix=''){let start=0,d=700,t0=performance.now();function f(t){let p=Math.min((t-t0)/d,1),v=Math.round(start+(target-start)*p);el.textContent=prefix+v.toLocaleString()+suffix;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
 let orders=0;function renderOrders(){const pct=orders*10;$('#progressBar').style.width=pct+'%';$('#orderCount').textContent=`${orders} / 10`;$('#groupStatus').textContent=orders<10?`再加入 ${10-orders} 份即可解鎖批量配送`:'🎉 團購門檻達成，批量配送已解鎖'}
 $('#addOrder').addEventListener('click',()=>{orders=Math.min(10,orders+1);renderOrders()});$('#resetOrders').addEventListener('click',()=>{orders=0;renderOrders()});
 const kpiObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=Number(el.dataset.count),suffix=el.dataset.suffix||'';let t0=performance.now();function step(t){let p=Math.min((t-t0)/1000,1);el.textContent=Math.round(target*p)+suffix;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);kpiObserver.unobserve(el)}),{threshold:.5});$$('[data-count]').forEach(el=>kpiObserver.observe(el));

 const startDelivery=$('#startDelivery'),resetDelivery=$('#resetDelivery'),vehicle=$('#deliveryVehicle'),routeProgress=$('#deliveryProgress'),path=$('#deliveryPath');
 let deliveryRunning=false,deliveryFrame=null;
 function setDeliveryState(progress){
   const pct=Math.round(progress*100);$('#deliveryBar').style.width=pct+'%';$('#deliveryPercent').textContent=pct+'%';routeProgress.style.strokeDashoffset=100-pct;
   const len=path.getTotalLength(),point=path.getPointAtLength(len*progress);vehicle.setAttribute('transform',`translate(${point.x} ${point.y})`);
   const stops=[{p:.34,n:1,title:'抵達管理學院',msg:'第一批餐點已進入熱點取餐櫃。'},{p:.72,n:2,title:'抵達工程大樓',msg:'第二批餐點完成定點交付。'},{p:.98,n:3,title:'抵達綜合教學館',msg:'最後一批餐點配送完成。'}];
   stops.forEach(s=>{if(progress>=s.p){document.querySelector(`[data-stop="${s.n}"]`).classList.add('active');$('#deliveryTitle').textContent=s.title;$('#deliveryMessage').textContent=s.msg}});
 }
 startDelivery.addEventListener('click',()=>{if(deliveryRunning)return;deliveryRunning=true;$('#pickupPanel').classList.remove('show');vehicle.classList.add('running');$('#deliveryTitle').textContent='專車配送中';$('#deliveryMessage').textContent='AI 正依照熱點需求執行批量配送。';$('#deliveryTime').textContent='約 3 分鐘';const start=performance.now(),duration=5200;function animate(t){const p=Math.min((t-start)/duration,1);setDeliveryState(p);if(p<1){deliveryFrame=requestAnimationFrame(animate)}else{deliveryRunning=false;$('#deliveryTitle').textContent='配送完成';$('#deliveryMessage').textContent='三個取餐熱點已完成交付。';$('#deliveryTime').textContent='3 分鐘';$('#pickupCode').textContent=String(Math.floor(1000+Math.random()*9000));$('#pickupPanel').classList.add('show')}}deliveryFrame=requestAnimationFrame(animate)});
 resetDelivery.addEventListener('click',()=>{if(deliveryFrame)cancelAnimationFrame(deliveryFrame);deliveryRunning=false;setDeliveryState(0);vehicle.classList.remove('running');$$('.hotspot').forEach(x=>x.classList.remove('active'));$('#deliveryTitle').textContent='等待配送';$('#deliveryMessage').textContent='批量訂單已完成整併，可啟動校園專車。';$('#deliveryTime').textContent='--';$('#pickupPanel').classList.remove('show');$('#pickupCode').textContent='----'});


 const dashboardScenarios={
   normal:{demand:548,grouping:88,pickup:2.8,load:72,peak:'12:10 尖峰',series:[18,28,46,78,100,82,52,30],hotspots:[78,66,72],health:'目前容量足以承接預測需求。'},
   rain:{demand:627,grouping:93,pickup:3.0,load:86,peak:'12:00 雨天尖峰',series:[22,35,58,88,100,92,70,44],hotspots:[91,82,85],health:'需求升高，系統已增加批量配送頻率。'},
   exam:{demand:692,grouping:95,pickup:3.1,load:91,peak:'11:50 考試週尖峰',series:[30,43,67,94,100,96,75,50],hotspots:[94,88,91],health:'已啟動尖峰調度與備援容量。'}
 };
 function animateDashboardNumber(el,target,suffix='',decimals=0){const startValue=parseFloat(el.textContent)||0,start=performance.now();function tick(t){const p=Math.min((t-start)/550,1),v=startValue+(target-startValue)*p;el.textContent=v.toFixed(decimals)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
 function updateDemandChart(values){const xs=[55,150,245,340,435,530,625,720],ys=values.map(v=>250-(v/100)*205),points=xs.map((x,i)=>`${x},${ys[i]}`).join(' ');$('#demandLine').setAttribute('points',points);$('#demandArea').setAttribute('d',`M55 250 L${xs.map((x,i)=>`${x} ${ys[i]}`).join(' L')} L720 250 Z`);$('#demandDots').innerHTML=xs.map((x,i)=>`<circle cx="${x}" cy="${ys[i]}" r="7"/>`).join('')}
 function updateDashboard(key){const s=dashboardScenarios[key];animateDashboardNumber($('#dashDemand'),s.demand);animateDashboardNumber($('#dashGrouping'),s.grouping,'%');animateDashboardNumber($('#dashPickup'),s.pickup,'',1);animateDashboardNumber($('#dashLoad'),s.load,'%');$('#peakLabel').textContent=s.peak;updateDemandChart(s.series);['A','B','C'].forEach((n,i)=>{$(`#hotspot${n}`).style.width=s.hotspots[i]+'%';$(`#hotspot${n}Value`).textContent=s.hotspots[i]+'%'});$('#healthText').textContent=s.health}
 $$('.scenario-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.scenario-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');updateDashboard(btn.dataset.scenario)}));
 updateDashboard('normal');


 const theoryData={
  vdn:{number:'CORE CONCEPT',title:'AI 虛擬學餐網絡',text:'以 AI 預測、智慧團購、批量配送與數位取餐，將分散需求與校外供給整合成去中心化供餐網絡。',tags:['去中心化','需求可視性','韌性供餐']},
  resilience:{number:'THEORY 01',title:'供應鏈韌性',text:'透過彈性、敏捷、冗餘與協同能力，降低集中式供餐節點中斷造成的脆性。',tags:['Flexibility','Agility','Redundancy']},
  capability:{number:'THEORY 02',title:'動態能力',text:'Sensing 感知需求、Seizing 抓住離峰產能、Reconfiguring 重構最後一哩物流。',tags:['Sensing','Seizing','Reconfiguring']},
  bullwhip:{number:'THEORY 03',title:'牛鞭效應減緩',text:'以聚合需求與提前備餐指令提高需求可視性，降低過度備料及臨時爆單。',tags:['Demand Visibility','Demand Smoothing','Prescriptive Prep']},
  lastmile:{number:'THEORY 04',title:'最後一哩物流',text:'將散戶配送改為系館熱點批量直送，降低找路、等待與個別配送成本。',tags:['Batch Delivery','Hotspots','3-minute Pickup']},
  learning:{number:'THEORY 05',title:'組織學習',text:'每天蒐集訂單、延遲、湊單失敗與評價資料，形成模型修正與營運優化閉環。',tags:['Feedback Loop','Incremental Training','Optimization']}
 };
 $$('.theory-node').forEach(node=>node.addEventListener('click',()=>{const d=theoryData[node.dataset.theory];$$('.theory-node').forEach(x=>x.classList.remove('active'));node.classList.add('active');$('#theoryNumber').textContent=d.number;$('#theoryTitle').textContent=d.title;$('#theoryText').textContent=d.text;$('#theoryTags').innerHTML=d.tags.map(t=>`<i>${t}</i>`).join('')}));
 const riskData={food:'建立合作店家食安履歷、恆溫保溫箱、責任險與隨機測溫機制。',sla:'設定 15 分鐘寬限期、信用積分與未取餐再分配機制。',cloud:'採用自動擴展、負載均衡與熱備援架構，維持服務可用性。'};
 $$('.risk-list button').forEach(btn=>btn.addEventListener('click',()=>{$$('.risk-list button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#riskDetail').textContent=riskData[btn.dataset.risk]}));
 $('#runLearning').addEventListener('click',async()=>{const nodes=$$('.learning-loop b');nodes.forEach(x=>x.classList.remove('active'));for(const node of nodes){node.classList.add('active');$('#learningStatus').textContent='執行中：'+node.textContent;await sleep(550)}$('#learningStatus').textContent='閉環完成：預測與物流參數已完成模擬更新。'});
 $('#presentationMode').addEventListener('click',()=>{document.body.classList.toggle('presentation-active');$('#presentationMode').textContent=document.body.classList.contains('presentation-active')?'退出簡報':'簡報模式'});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('presentation-active')){$('#presentationMode').click()}});

 const c=$('#particleCanvas'),ctx=c.getContext('2d');let pts=[];function resize(){c.width=innerWidth;c.height=innerHeight;pts=[...Array(Math.min(70,Math.floor(innerWidth/20)))].map(()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}))}resize();addEventListener('resize',resize);function draw(){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='rgba(37,99,235,.12)';pts.forEach(p=>{p.x=(p.x+p.vx+c.width)%c.width;p.y=(p.y+p.vy+c.height)%c.height;ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}draw();
});
