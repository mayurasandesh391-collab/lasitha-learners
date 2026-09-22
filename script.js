const $=id=>document.getElementById(id);
$("menuBtn").addEventListener("click",()=>$("nav").classList.toggle("open"));

let selectedPhotoFile=null, photoPreviewUrl=null;
$("photo").addEventListener("change",e=>{
 const file=e.target.files&&e.target.files[0];
 if(!file)return;
 if(!file.type.startsWith("image/")){$("photoHint").textContent="Please choose an image file.";e.target.value="";return}
 selectedPhotoFile=file;
 if(photoPreviewUrl)URL.revokeObjectURL(photoPreviewUrl);
 photoPreviewUrl=URL.createObjectURL(file);
 const img=$("photoPreviewImg");
 img.src=photoPreviewUrl; img.hidden=false;
 $("photoPlaceholder").hidden=true;
 $("photoHint").textContent="Looks good — change photo anytime before submitting.";
});

async function uploadPhoto(userId){
 if(!selectedPhotoFile)return null;
 const ext=(selectedPhotoFile.name.split(".").pop()||"jpg").toLowerCase();
 const path=`${userId}/${Date.now()}.${ext}`;
 const {error:uploadError}=await supabaseClient.storage.from("student-photos").upload(path,selectedPhotoFile,{upsert:true});
 if(uploadError)throw uploadError;
 const {data}=supabaseClient.storage.from("student-photos").getPublicUrl(path);
 return data.publicUrl;
}

$("registerForm").addEventListener("submit",async e=>{
 e.preventDefault(); const msg=$("regMsg"); msg.textContent="Creating account...";
 const email=$("email").value.trim(), password=$("password").value;
 const {data,error}=await supabaseClient.auth.signUp({email,password});
 if(error){msg.textContent="✕ "+error.message;return}
 const user=data.user; if(!user){msg.textContent="✕ Account was not created.";return}

 let photoUrl=null;
 if(selectedPhotoFile){
  msg.textContent="Uploading photo...";
  try{ photoUrl=await uploadPhoto(user.id) }
  catch(photoError){ msg.textContent="Account created, but photo upload failed: "+photoError.message+" (you can add it later)."; }
 }

 const {error:insertError}=await supabaseClient.from("registrations").insert({
   user_id:user.id,name:$("name").value.trim(),phone:$("phone").value.trim(),
   vehicle_type:$("vehicle").value,date:$("date").value,photo_url:photoUrl
 });
 if(insertError){msg.textContent="Account created, but registration save failed: "+insertError.message;return}
 msg.textContent="✓ Registration successful. Check your email if confirmation is enabled, then login.";
 e.target.reset();
 if(photoPreviewUrl)URL.revokeObjectURL(photoPreviewUrl);
 photoPreviewUrl=null; selectedPhotoFile=null;
 $("photoPreviewImg").hidden=true; $("photoPlaceholder").hidden=false;
 $("photoHint").textContent="Tap to choose a photo — preview updates live";
});
$("loginForm").addEventListener("submit",async e=>{
 e.preventDefault(); const msg=$("loginMsg");msg.textContent="Signing in...";
 const {error}=await supabaseClient.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});
 if(error){msg.textContent="✕ "+error.message;return}
 location.href="student.html";
});

// Cinematic, Apple-inspired scroll effects for photo sections.
document.body.classList.add('js-ready');
const revealTargets=document.querySelectorAll('.split,.section,.banner,.register,.login,footer');
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
revealTargets.forEach(el=>revealObserver.observe(el));
const hero=document.querySelector('.hero'), banner=document.querySelector('.banner');
let ticking=false;
function cinematicScroll(){
  const y=window.scrollY||0;
  if(hero) hero.style.setProperty('--hero-shift', Math.min(y*.16,90)+'px');
  if(banner){const r=banner.getBoundingClientRect(); const shift=(window.innerHeight/2-r.top)*.08; banner.style.setProperty('--banner-shift', Math.max(-55,Math.min(55,shift))+'px');}
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(cinematicScroll);ticking=true}},{passive:true});
cinematicScroll();
