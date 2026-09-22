async function load(){
 const status=document.getElementById("status"), card=document.getElementById("registrationCard");
 const {data:{session}}=await supabaseClient.auth.getSession();
 if(!session){location.href="index.html#login";return}
 const {data,error}=await supabaseClient.from("registrations").select("id,name,phone,vehicle_type,date,photo_url").eq("user_id",session.user.id).order("id",{ascending:false}).limit(1);
 if(error){status.textContent="Could not load registration: "+error.message;return}
 if(!data||!data.length){status.textContent="No registration found for this account.";return}
 const r=data[0]; status.textContent="Registration found";
 const photo=r.photo_url?`<img class="studentPhoto" src="${esc(r.photo_url)}" alt="${esc(r.name)}">`:"";
 card.innerHTML=`${photo}<div class="studentCard"><div><small>NAME</small><b>${esc(r.name)}</b></div><div><small>PHONE</small><b>${esc(r.phone)}</b></div><div><small>VEHICLE</small><b>${esc(r.vehicle_type)}</b></div><div><small>DATE</small><b>${esc(r.date)}</b></div></div>`;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("logout").onclick=async()=>{await supabaseClient.auth.signOut();location.href="index.html"};
load();