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

  function contactCheckbox(phone,checked){
    if(!phone||phone==="—")return '<span class="contact-na">—</span>';
    return '<label class="contact-check" title="Marcar que a Conexão I9 já falou com este cliente">'+
      '<input class="contact-toggle" type="checkbox" data-phone="'+phone+'" '+(checked?'checked':'')+' />'+
      '<span></span>'+
    '</label>';
  }

  async function setContactStatus(phone,contacted){
    const normalized=(phone||"").replace(/\D/g,"");
    if(!normalized)return;
    document.querySelectorAll('.contact-toggle[data-phone="'+normalized+'"]').forEach(el=>el.disabled=true);
    try{
      const r=await fetch(API_BASE+"/contact-status",{
        method:"POST",
        headers:{...authHeaders(),"Content-Type":"application/json"},
        body:JSON.stringify({phone:normalized,contacted})
      });
      if(r.status===401){showLogin();return;}
      if(!r.ok)throw new Error("Falha ao salvar");
      leads.forEach(item=>{if(item.phone===normalized){item.conexaoI9Contacted=contacted;}});
      render();
    }catch(e){
      statusText.textContent="Não foi possível salvar o status Conexão I9.";
      render();
    }
  }

  function bindContactToggles(){
    document.querySelectorAll(".contact-toggle").forEach(input=>{
      input.addEventListener("change",()=>setContactStatus(input.dataset.phone||"",input.checked));
    });
  }

  function renderTable(filtered){
    tbody.innerHTML="";
    filtered.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).forEach(item=>{
      const tr=document.createElement("tr");
      const full=[item.firstName,item.lastName].filter(Boolean).join(" ")||"—";
      tr.innerHTML='<td><span class="name"></span><span class="sub"></span></td><td></td><td></td><td></td><td></td><td class="contact-cell"></td>';
      tr.children[0].querySelector(".name").textContent=full;
      tr.children[0].querySelector(".sub").textContent=item.source||"Bilisco Wi-Fi";
      tr.children[1].textContent=item.phone||"—";
      tr.children[2].textContent=fmtDate(item.createdAt);
      tr.children[3].textContent=item.ip||"—";
      tr.children[4].textContent=item.mac||"—";
      tr.children[5].innerHTML=contactCheckbox(item.phone||"",!!item.conexaoI9Contacted);
      tbody.appendChild(tr);
    });
    empty.hidden=filtered.length!==0;
    statusText.textContent=filtered.length+" cadastro(s) encontrado(s)";
  }

  function htmlBars(items,labels,monthly=false){
    if(!items.length)return '<div class="chart-empty">Sem dados.</div>';
    const max=Math.max(...items,1);
    const cols=items.map((v,i)=>{
      const pct=v===0?0:Math.max(3,(v/max)*100);
      const showLabel=monthly || i%5===0 || i===items.length-1;
      return '<div class="bar-col '+(showLabel?'':'dim-label')+'">'+
        '<div class="bar-value">'+v+'</div>'+
        '<div class="bar-track"><div class="bar-fill" style="height:'+pct+'%"></div></div>'+
        '<div class="bar-label">'+labels[i]+'</div>'+
        '<div class="bar-tooltip"><strong>'+v+'</strong><span>'+labels[i]+'</span><small>'+(v===1?'1 lead':v+' leads')+'</small></div>'+
      '</div>';
    }).join('');
    return '<div class="bar-chart '+(monthly?'monthly':'daily')+'">'+cols+'</div>';
  }

  function renderCharts(filtered){
    const now=new Date(),dailyValues=[],dailyLabels=[];
    for(let i=29;i>=0;i--){
      const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i),key=localKey(d);
      dailyLabels.push(String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0"));
      dailyValues.push(filtered.filter(x=>localKey(new Date(x.createdAt))===key).length);
    }
    $("daily-chart").innerHTML=htmlBars(dailyValues,dailyLabels,false);
    const activeDays=dailyValues.filter(v=>v>0).length,total30=dailyValues.reduce((a,b)=>a+b,0),avg=activeDays?total30/activeDays:0;
    $("daily-summary").textContent=avg.toFixed(1).replace(".",",")+" / dia ativo";

    const monthValues=[],monthLabels=[];
    for(let i=11;i>=0;i--){
      const d=new Date(now.getFullYear(),now.getMonth()-i,1),key=monthKey(d);
      monthLabels.push(new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(d).replace(".",""));
      monthValues.push(filtered.filter(x=>monthKey(new Date(x.createdAt))===key).length);
    }
    $("monthly-chart").innerHTML=htmlBars(monthValues,monthLabels,true);
    const best=Math.max(...monthValues,0),idx=monthValues.indexOf(best);
    $("monthly-summary").textContent=best?("pico: "+monthLabels[idx]+" · "+best):"sem dados";
  }

  function renderRecurring(filtered){
    const target=$("recurring-body"), emptyRecurring=$("recurring-empty");
    const grouped=new Map();
    filtered.forEach(item=>{
      const key=(item.phone||item.mac||item.id||"").trim();
      if(!key)return;
      if(!grouped.has(key)){
        grouped.set(key,{
          firstName:item.firstName,
          lastName:item.lastName,
          phone:item.phone||"—",
          days:new Set(),
          total:0,
          last:null,
          contacted:!!item.conexaoI9Contacted
        });
      }
      const g=grouped.get(key);
      const d=new Date(item.createdAt);
      if(!Number.isNaN(d.getTime())){
        g.days.add(localKey(d));
        if(!g.last||d>g.last)g.last=d;
      }
      g.total++;
      if(item.firstName)g.firstName=item.firstName;
      if(item.lastName)g.lastName=item.lastName;
      if(item.conexaoI9Contacted)g.contacted=true;
    });

    const rows=[...grouped.values()]
      .map(g=>({...g,distinctDays:g.days.size}))
      .sort((a,b)=>b.distinctDays-a.distinctDays||b.total-a.total||(b.last?.getTime()||0)-(a.last?.getTime()||0));

    target.innerHTML="";
    const maxDays=Math.max(...rows.map(r=>r.distinctDays),1);
    rows.slice(0,20).forEach((r,index)=>{
      const tr=document.createElement("tr");
      const full=[r.firstName,r.lastName].filter(Boolean).join(" ")||"—";
      const pct=Math.round((r.distinctDays/maxDays)*100);
      tr.innerHTML='<td><span class="rank-badge '+(index<3?'top':'')+'">'+(index+1)+'</span></td>'+
        '<td><span class="name"></span><span class="sub">Cliente recorrente</span></td>'+
        '<td></td><td class="contact-cell"></td><td class="days-count"></td><td></td><td></td>'+
        '<td><div class="repeat-wrap"><div class="repeat-track"><div class="repeat-fill" style="width:'+pct+'%"></div></div><span class="repeat-pct">'+pct+'%</span></div></td>';
      tr.children[1].querySelector(".name").textContent=full;
      tr.children[2].textContent=r.phone;
      tr.children[3].innerHTML=contactCheckbox(r.phone,r.contacted);
      tr.children[4].textContent=r.distinctDays;
      tr.children[5].textContent=r.total;
      tr.children[6].textContent=r.last?fmtDate(r.last):"—";
      target.appendChild(tr);
    });
    emptyRecurring.hidden=rows.length!==0;
    const returning=rows.filter(r=>r.distinctDays>1).length;
    $("recurring-summary").textContent=returning+" recorrente"+(returning===1?"":"s");
  }

  function render(){
    const filtered=filteredLeads();
    renderMetrics(filtered);renderRecurring(filtered);renderCharts(filtered);renderTable(filtered);bindContactToggles();
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