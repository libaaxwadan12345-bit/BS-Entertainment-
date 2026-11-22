const DEFAULT_PASSWORD = "BSstudio2026!";
const seedProjects = [
  {id:1,title:"Mashruuc Anime 01",description:"Mashruucan waa tusaale. Ku beddel xogta anime-ga kooxda marka uu diyaar noqdo.",status:"Coming Soon",image:""},
  {id:2,title:"Somali Voice Project",description:"Mashruuc cod-bixin Af-Soomaali ah oo ku jira diyaar-garow.",status:"In Production",image:""}
];
const seedTeam = [
  {id:1,name:"Voice Actor 01",role:"Voice Actor",bio:"Cod-bixiye ka tirsan BS Entertainment."},
  {id:2,name:"Studio Director",role:"Director",bio:"Hagidda iyo isku dubbaridka mashruuca."},
  {id:3,name:"Audio Editor",role:"Audio Editor",bio:"Tafatirka iyo hagaajinta codka."},
  {id:4,name:"Script Writer",role:"Script Writer",bio:"Diyaarinta qoraalka Af-Soomaaliga."}
];
const read = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
let projects = read("bs_projects", seedProjects);
let team = read("bs_team", seedTeam);
const save = () => { localStorage.setItem("bs_projects",JSON.stringify(projects)); localStorage.setItem("bs_team",JSON.stringify(team)); };
const initials = name => name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
function renderProjects(){
  const grid=document.getElementById("projectGrid"); grid.innerHTML="";
  document.getElementById("projectEmpty").hidden=projects.length>0;
  projects.forEach(p=>{const card=document.createElement("article");card.className="project-card";
    const image=p.image?`<img src="${escapeAttr(p.image)}" alt="">`:`<div class="placeholder-art">BS ✦</div>`;
    card.innerHTML=`<div class="project-image">${image}</div><div class="project-info"><small>BS ORIGINAL PROJECT</small><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p><span class="status">${escapeHTML(p.status)}</span></div>`;
    grid.appendChild(card);
  });
  document.getElementById("projectCount").textContent=String(projects.length).padStart(2,"0");
}
function renderTeam(){
  const grid=document.getElementById("teamGrid");grid.innerHTML="";
  document.getElementById("teamEmpty").hidden=team.length>0;
  team.forEach(m=>{const card=document.createElement("article");card.className="member-card";
    card.innerHTML=`<div class="member-avatar">${escapeHTML(initials(m.name))}</div><h3>${escapeHTML(m.name)}</h3><small>${escapeHTML(m.role)}</small><p>${escapeHTML(m.bio||"Xubin ka tirsan BS Entertainment.")}</p>`;
    grid.appendChild(card);
  });
  document.getElementById("actorCount").textContent=String(team.length).padStart(2,"0");
}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(s=""){return escapeHTML(s);}
function renderAdminLists(){
  document.getElementById("adminProjectsList").innerHTML=projects.map(p=>`<div class="admin-list-item"><span>${escapeHTML(p.title)} · ${escapeHTML(p.status)}</span><button data-delete-project="${p.id}">Delete</button></div>`).join("");
  document.getElementById("adminTeamList").innerHTML=team.map(m=>`<div class="admin-list-item"><span>${escapeHTML(m.name)} · ${escapeHTML(m.role)}</span><button data-delete-team="${m.id}">Delete</button></div>`).join("");
}
renderProjects();renderTeam();document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("show"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("show")));
const modal=document.getElementById("adminModal");
document.getElementById("adminOpen").addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");});
function closeAdmin(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
document.getElementById("adminClose").addEventListener("click",closeAdmin);
modal.addEventListener("click",e=>{if(e.target===modal)closeAdmin();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAdmin();});
function getPassword(){return localStorage.getItem("bs_admin_password")||DEFAULT_PASSWORD;}
document.getElementById("loginBtn").addEventListener("click",()=>{
  if(document.getElementById("adminPassword").value===getPassword()){
    document.getElementById("loginView").hidden=true;document.getElementById("dashboardView").hidden=false;renderAdminLists();
  }else document.getElementById("loginError").textContent="Password-ku sax ma aha. Mar kale isku day.";
});
document.getElementById("adminPassword").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("loginBtn").click();});
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));
  document.querySelectorAll(".admin-tab-content").forEach(c=>c.hidden=c.id!==tab.dataset.tab);
}));
document.getElementById("addProjectForm").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target);
  projects.unshift({id:Date.now(),title:f.get("title"),description:f.get("description"),status:f.get("status"),image:f.get("image")});
  save();renderProjects();renderAdminLists();e.target.reset();
});
document.getElementById("addTeamForm").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target);
  team.push({id:Date.now(),name:f.get("name"),role:f.get("role"),bio:f.get("bio")});
  save();renderTeam();renderAdminLists();e.target.reset();
});
document.addEventListener("click",e=>{
  const p=e.target.dataset.deleteProject,t=e.target.dataset.deleteTeam;
  if(p){projects=projects.filter(x=>String(x.id)!==p);save();renderProjects();renderAdminLists();}
  if(t){team=team.filter(x=>String(x.id)!==t);save();renderTeam();renderAdminLists();}
});
document.getElementById("changePassword").addEventListener("click",()=>{
  const value=document.getElementById("newPassword").value;
  if(value.length<8){document.getElementById("settingsNote").textContent="Password-ku ha ahaado ugu yaraan 8 xaraf.";return;}
  localStorage.setItem("bs_admin_password",value);document.getElementById("newPassword").value="";
  document.getElementById("settingsNote").textContent="Password-ka browser-kan waa la beddelay.";
});
document.getElementById("resetData").addEventListener("click",()=>{
  if(confirm("Ma hubtaa inaad dib u celinayso demo data?")){projects=[...seedProjects];team=[...seedTeam];save();renderProjects();renderTeam();renderAdminLists();}
});
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target);
  const subject=encodeURIComponent("BS Entertainment website contact");
  const body=encodeURIComponent(`Magac: ${f.get("name")}\nXiriir: ${f.get("reply")}\n\nFariin:\n${f.get("message")}`);
  document.getElementById("contactNote").textContent="Email app-kaaga ayaa furmaya. Beddel email-ka tusaalaha ah ee index.html ka hor daabacaadda.";
  window.location.href=`mailto:bsentertainment@example.com?subject=${subject}&body=${body}`;
});
