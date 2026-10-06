(() => {
  const loginView=document.getElementById("login-view");
  const dashboardView=document.getElementById("dashboard-view");
  const loginForm=document.getElementById("login-form");
  const loginMessage=document.getElementById("login-message");
  const body=document.getElementById("leads-body");
  const empty=document.getElementById("empty");
  const search=document.getElementById("search");
  const statusText=document.getElementById("status-text");
  let leads=[];

  const fmtDate=value=>{
    const d=new Date(value);
    return Number.isNaN(d.getTime())?"—":new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(d);
  };

  const isToday=value=>{
    const d=new Date(value),n=new Date();
    return d.toDateString()===n.toDateString();
  };

  const inLast7=value=>{
    const t=new Date(value).getTime();
    return Number.isFinite(t) && t>=Date.now()-(7*24*60*60*1000);
  };

  function renderMetrics(){
    document.getElementById("total-leads").textContent=leads.length;
    document.getElementById("today-leads").textContent=leads.filter(x=>isToday(x.createdAt)).length;
    document.getElementById("week-leads").textContent=leads.filter(x=>inLast7(x.createdAt)).length;
    document.getElementById("unique-devices").textContent=new Set(leads.map(x=>x.mac).filter(Boolean)).size;
  }

  function render(){
    const q=search.value.trim().toLowerCase();
    const filtered=leads.filter(x=>[
      x.firstName,x.lastName,x.phone,x.ip,x.mac
    ].join(" ").toLowerCase().includes(q));

    body.innerHTML="";
    filtered.forEach(item=>{
      const tr=document.createElement("tr");
      const fullName=[item.firstName,item.lastName].filter(Boolean).join(" ")||"—";
      tr.innerHTML=`
        <td><span class="name"></span><span class="sub"></span></td>
        <td></td><td></td><td></td><td></td>`;
      tr.children[0].querySelector(".name").textContent=fullName;
      tr.children[0].querySelector(".sub").textContent=item.source||"Bilisco Wi‑Fi";
      tr.children[1].textContent=item.phone||"—";
      tr.children[2].textContent=fmtDate(item.createdAt);
      tr.children[3].textContent=item.ip||"—";
      tr.children[4].textContent=item.mac||"—";
      body.appendChild(tr);
    });
    empty.hidden=filtered.length!==0;
    statusText.textContent=`${filtered.length} cadastro(s) exibido(s)`;
    renderMetrics();
  }

  async function loadLeads(){
    statusText.textContent="Atualizando...";
    try{
      const response=await fetch("/api/admin/leads",{credentials:"include"});
      if(response.status===401){showLogin();return;}
      if(!response.ok)throw new Error("Falha ao carregar leads");
      const data=await response.json();
      leads=Array.isArray(data.leads)?data.leads:[];
      render();
    }catch(e){
      statusText.textContent="API ainda não conectada.";
      leads=[];
      render();
    }
  }

  function showDashboard(){
    loginView.hidden=true;
    dashboardView.hidden=false;
    loadLeads();
  }

  function showLogin(){
    dashboardView.hidden=true;
    loginView.hidden=false;
  }

  loginForm.addEventListener("submit",async e=>{
    e.preventDefault();
    loginMessage.textContent="";
    const button=loginForm.querySelector("button");
    button.disabled=true;
    try{
      const response=await fetch("/api/admin/login",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          username:document.getElementById("username").value.trim(),
          password:document.getElementById("password").value
        })
      });
      if(!response.ok)throw new Error("Usuário ou senha inválidos.");
      showDashboard();
    }catch(err){
      loginMessage.textContent=err.message||"Não foi possível entrar.";
    }finally{button.disabled=false;}
  });

  document.getElementById("logout").addEventListener("click",async()=>{
    try{await fetch("/api/admin/logout",{method:"POST",credentials:"include"});}catch(_){}
    showLogin();
  });

  document.getElementById("refresh").addEventListener("click",loadLeads);
  search.addEventListener("input",render);

  fetch("/api/admin/session",{credentials:"include"})
    .then(r=>r.ok?showDashboard():showLogin())
    .catch(showLogin);
})();