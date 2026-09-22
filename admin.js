let allRows=[];
async function login(){
 const msg=document.getElementById("adminMsg");msg.textContent="Signing in...";
 const {error}=await supabaseClient.auth.signInWithPassword({email:adminEmail.value.trim(),password:adminPassword.value});
 if(error){msg.textContent="✕ "+error.message;return}
 document.getElementById("adminLogin").hidden=true;document.getElementById("adminPanel").hidden=false;loadRows();
}
document.getElementById("adminForm").addEventListener("submit",e=>{e.preventDefault();login()});
async function loadRows(){
 const {data,error}=await supabaseClient.from("registrations").select("*").order("id",{ascending:false});
 if(error){document.getElementById("rows").innerHTML=`<tr><td colspan="6">Failed to load: ${esc(error.message)}</td></tr>`;return}
 allRows=data||[];render();
}
function render(){
 const q=document.getElementById("search").value.toLowerCase(), f=document.getElementById("filter").value;
 const rows=allRows.filter(r=>(!q||String(r.name||"").toLowerCase().includes(q)||String(r.phone||"").toLowerCase().includes(q))&&(!f||r.vehicle_type===f));
 document.getElementById("rows").innerHTML=rows.map(r=>`<tr><td>${r.photo_url?`<img class="adminThumb" src="${esc(r.photo_url)}" alt="">`:"—"}</td><td>${esc(r.id)}</td><td>${esc(r.name)}</td><td>${esc(r.phone)}</td><td>${esc(r.vehicle_type)}</td><td>${esc(r.date)}</td><td><button onclick="del(${Number(r.id)})">Delete</button></td></tr>`).join("")||'<tr><td colspan="7">No registrations</td></tr>';
}
async function del(id){if(!confirm("Delete this registration?"))return;const {error}=await supabaseClient.from("registrations").delete().eq("id",id);if(error){alert(error.message);return}loadRows()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("search").oninput=render;document.getElementById("filter").onchange=render;
document.getElementById("adminLogout").onclick=async()=>{await supabaseClient.auth.signOut();location.reload()};