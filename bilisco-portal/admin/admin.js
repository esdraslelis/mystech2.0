(() => {
  const API_BASE="https://ilccoqqhgrsqgbglyiha.supabase.co/functions/v1/bilisco-admin";
  const TOKEN_KEY="bilisco_admin_token";
  const $=id=>document.getElementById(id);
  const loginView=$("login-view"), dashboardView=$("dashboard-view"), loginForm=$("login-form"), loginMessage=$("login-message");
  const tbody=$("leads-body"), empty=$("empty"), statusText=$("status-text"), search=$("search"), periodFilter=$("period-filter"), startDate=$("start-date"), endDate=$("end-date");
  let leads=[];

  const token=()=>sessionStorage.getItem(TOKEN_KEY)||"";
  const authHeaders=()=>token()?{"Authorization":"Bearer "+token()}:{};
  const fmtDate=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?"—":new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(d)};
  const localKey=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  const monthKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
  const isToday=v=>{const d=new Date(v),n=new Date();return localKey(d)===localKey(n)};
  const isThisMonth=v=>{const d=new Date(v),n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()};

  function filteredLeads(){
    const q=search.value.trim().toLowerCase();
    const mode=periodFilter.value;
    const now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const start=startDate.value?new Date(startDate.value+"T00:00:00"):null;
    const end=endDate.value?new Date(endDate.value+"T23:59:59"):null;
    return leads.filter(x=>{
      const d=new Date(x.createdAt);
      const hay=[x.firstName,x.lastName,x.phone,x.ip,x.mac].join(" ").toLowerCase();
      if(q&&!hay.includes(q))return false;
      if(mode==="today"&&localKey(d)!==localKey(now))return false;
      if(mode==="7"&&d<new Date(today.getTime()-6*86400000))return false;
      if(mode==="30"&&d<new Date(today.getTime()-29*86400000))return false;
      if(mode==="month"&&!isThisMonth(x.createdAt))return false;
      if(mode==="custom"){
        if(start&&d<start)return false;
        if(end&&d>end)return false;
      }
      return true;
    });
  }

  function renderMetrics(filtered){
    $("total-leads").textContent=leads.length;
    $("today-leads").textContent=leads.filter(x=>isToday(x.createdAt)).length;
    $("month-leads").textContent=leads.filter(x=>isThisMonth(x.createdAt)).length;
    $("period-leads").textContent=filtered.length;
    $("unique-devices").textContent=new Set(filtered.map(x=>x.mac).filter(Boolean)).size;
  }

  function renderTable(filtered){
    tbody.innerHTML="";
    filtered.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).forEach(item=>{
      const tr=document.createElement("tr");
      const full=[item.firstName,item.lastName].filter(Boolean).join(" ")||"—";
      tr.innerHTML='<td><span class="name"></span><span class="sub"></span></td><td></td><td></td><td></td><td></td>';
      tr.children[0].querySelector(".name").textContent=full;
      tr.children[0].querySelector(".sub").textContent=item.source||"Bilisco Wi‑Fi";
      tr.children[1].textContent=item.phone||"—";
      tr.children[2].textContent=fmtDate(item.createdAt);
      tr.children[3].textContent=item.ip||"—";
      tr.children[4].textContent=item.mac||"—";
      tbody.appendChild(tr);
    });
    empty.hidden=filtered.length!==0;
    statusText.textContent=filtered.length+" cadastro(s) encontrado(s)";
  }

  function svgBars(items,labels,alt=false){
    if(!items.some(v=>v>0))return '<div class="chart-empty">Ainda não há dados suficientes nesse período.</div>';
    const w=720,h=250,padL=34,padR=12,padT=18,padB=34,innerW=w-padL-padR,innerH=h-padT-padB,max=Math.max(...items,1),gap=6,barW=Math.max(4,(innerW/items.length)-gap);
    let s='<svg viewBox="0 0 '+w+' '+h+'" role="img">';
    for(let i=0;i<4;i++){const y=padT+(innerH/3)*i;s+='<line class="chart-grid" x1="'+padL+'" x2="'+(w-padR)+'" y1="'+y+'" y2="'+y+'"/>'}
    items.forEach((v,i)=>{const x=padL+i*(innerW/items.length)+(gap/2),bh=(v/max)*(innerH-8),y=padT+innerH-bh;s+='<rect class="chart-bar '+(alt?'alt':'')+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+barW.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="4"><title>'+labels[i]+': '+v+' lead(s)</title></rect>';if(v>0&&items.length<=12)s+='<text class="chart-value" x="'+(x+barW/2).toFixed(1)+'" y="'+Math.max(12,y-5).toFixed(1)+'" text-anchor="middle">'+v+'</text>';if((items.length<=12||i%5===0||i===items.length-1))s+='<text class="chart-axis" x="'+(x+barW/2).toFixed(1)+'" y="'+(h-10)+'" text-anchor="middle">'+labels[i]+'</text>'});
    return s+'</svg>';
  }

  function renderCharts(filtered){
    const now=new Date(),dailyValues=[],dailyLabels=[];
    for(let i=29;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i),key=localKey(d);dailyLabels.push(String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0"));dailyValues.push(filtered.filter(x=>localKey(new Date(x.createdAt))===key).length)}
    $("daily-chart").innerHTML=svgBars(dailyValues,dailyLabels,false);
    const activeDays=dailyValues.filter(v=>v>0).length,total30=dailyValues.reduce((a,b)=>a+b,0),avg=activeDays?total30/activeDays:0;
    $("daily-summary").textContent=avg.toFixed(1).replace(".",",")+" / dia ativo";

    const monthValues=[],monthLabels=[];
    for(let i=11;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1),key=monthKey(d);monthLabels.push(new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(d).replace(".",""));monthValues.push(filtered.filter(x=>monthKey(new Date(x.createdAt))===key).length)}
    $("monthly-chart").innerHTML=svgBars(monthValues,monthLabels,true);
    const best=Math.max(...monthValues,0),idx=monthValues.indexOf(best);
    $("monthly-summary").textContent=best?("pico: "+monthLabels[idx]+" · "+best):"sem dados";
  }

  function render(){
    const filtered=filteredLeads();
    renderMetrics(filtered);renderCharts(filtered);renderTable(filtered);
  }

  async function loadLeads(){
    statusText.textContent="Atualizando...";
    try{
      const r=await fetch(API_BASE+"/leads",{headers:authHeaders()});
      if(r.status===401){showLogin();return}
      if(!r.ok)throw new Error("Falha ao carregar leads");
      const data=await r.json();leads=Array.isArray(data.leads)?data.leads:[];render();
    }catch(e){statusText.textContent="Não foi possível carregar os leads.";leads=[];render()}
  }

  function showDashboard(){loginView.hidden=true;dashboardView.hidden=false;loadLeads()}
  function showLogin(){sessionStorage.removeItem(TOKEN_KEY);dashboardView.hidden=true;loginView.hidden=false}

  loginForm.addEventListener("submit",async e=>{
    e.preventDefault();loginMessage.textContent="";const btn=loginForm.querySelector("button");btn.disabled=true;
    try{const r=await fetch(API_BASE+"/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:$("username").value.trim(),password:$("password").value})});const data=await r.json().catch(()=>({}));if(!r.ok||!data.token)throw new Error("Usuário ou senha inválidos.");sessionStorage.setItem(TOKEN_KEY,data.token);showDashboard()}catch(err){loginMessage.textContent=err.message||"Não foi possível entrar."}finally{btn.disabled=false}
  });

  $("logout").addEventListener("click",async()=>{try{await fetch(API_BASE+"/logout",{method:"POST",headers:authHeaders()})}catch(_){}showLogin()});
  $("refresh").addEventListener("click",loadLeads);
  $("clear-filters").addEventListener("click",()=>{periodFilter.value="all";startDate.value="";endDate.value="";search.value="";render()});
  periodFilter.addEventListener("change",()=>{const custom=periodFilter.value==="custom";startDate.disabled=!custom;endDate.disabled=!custom;if(!custom){startDate.value="";endDate.value=""}render()});
  [search,startDate,endDate].forEach(el=>el.addEventListener("input",render));
  startDate.disabled=true;endDate.disabled=true;

  if(token())fetch(API_BASE+"/session",{headers:authHeaders()}).then(r=>r.ok?showDashboard():showLogin()).catch(showLogin);else showLogin();
})();