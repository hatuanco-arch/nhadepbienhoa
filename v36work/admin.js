
let editing=null;
const $=id=>document.getElementById(id);
function headers(){return {"Content-Type":"application/json","Authorization":"Bearer "+$("key").value}}
function parsePrice(v){
  let s=String(v??"").trim().toLowerCase().replace(/\s+/g,"").replace(/,/g,".");
  if(!s) return 0;
  if(s.endsWith("tr")) return Number(s.slice(0,-2))/1000;
  if(s.endsWith("triệu")) return Number(s.slice(0,-5))/1000;
  if(s.endsWith("tỷ")) return Number(s.slice(0,-3));
  const n=Number(s);
  return Number.isFinite(n)?n:NaN;
}
function displayPrice(p){
  const t=String(p.price_text??"").trim();
  return t || formatAdminPrice(p.price_billion);
}
function parseImageStorage(raw){
  const lines=String(raw||"").split(/\n+/).map(x=>x.trim()).filter(Boolean);
  let cover="";
  const urls=[];
  for(const line of lines){
    if(line.startsWith("__COVER__|")){
      const u=line.slice(10).trim();
      if(u){cover=u;urls.push(u);}
    }else{
      urls.push(line);
    }
  }
  return {urls:[...new Set(urls)],cover};
}
function serializeImageStorage(urls,cover){
  const clean=[...new Set((urls||[]).map(x=>String(x).trim()).filter(Boolean))];
  const c=String(cover||"").trim();
  if(c && clean.includes(c)) return ["__COVER__|"+c,...clean.filter(x=>x!==c)].join("\n");
  return clean.join("\n");
}
function renderImagePicker(){
  const box=$("imagePicker");
  if(!box) return;
  const parsed=parseImageStorage($("images").value);
  let urls=parsed.urls;
  let cover=String($("coverImage").value||parsed.cover||urls[0]||"").trim();
  const files=[...($("imageFiles")?.files||[])];
  const pendingIndex=Number($("coverPendingIndex")?.value||-1);
  if(cover && !urls.includes(cover)) cover=urls[0]||"";
  $("coverImage").value=cover;

  const orderedUploaded=cover ? [cover,...urls.filter(u=>u!==cover)] : urls;
  const uploadedHtml=orderedUploaded.map((u,i)=>{
    const isCover=u===cover;
    const restIndex=i-1;
    return `<div class="image-choice ${isCover?"selected":""}" data-url="${encodeURIComponent(u)}">
      <img src="${escImageUrl(u)}" alt="Ảnh ${isCover?"đại diện":i+1}">
      <span>${isCover?"⭐ ẢNH ĐẠI DIỆN":"Ảnh "+(i+1)}</span>
      <div class="image-order">
        ${!isCover && restIndex>0?`<button type="button" class="img-move" data-move="up" data-url="${encodeURIComponent(u)}" title="Đưa lên">↑</button>`:""}
        ${!isCover && restIndex<orderedUploaded.length-2?`<button type="button" class="img-move" data-move="down" data-url="${encodeURIComponent(u)}" title="Đưa xuống">↓</button>`:""}
      </div>
    </div>`;
  }).join("");

  const localHtml=files.map((file,i)=>{
    const selected=(pendingIndex===i && !cover);
    const src=URL.createObjectURL(file);
    return `<div class="image-choice ${selected?"selected":""}" data-local-index="${i}">
      <img src="${src}" alt="Ảnh upload ${i+1}">
      <span>${selected?"⭐ ẢNH ĐẠI DIỆN":"Ảnh mới "+(i+1)}</span>
    </div>`;
  }).join("");

  if(!urls.length && !files.length){
    box.innerHTML='<div class="image-picker-empty">Chưa có ảnh. Chọn ảnh hoặc upload ảnh để chọn ảnh đại diện.</div>';
    return;
  }
  box.innerHTML=uploadedHtml+localHtml;

  box.querySelectorAll(".image-choice[data-url]").forEach(btn=>btn.addEventListener("click",(e)=>{
    if(e.target.closest(".img-move")) return;
    const u=decodeURIComponent(btn.dataset.url||"");
    $("coverImage").value=u;
    if($("coverPendingIndex")) $("coverPendingIndex").value="-1";
    renderImagePicker();
    $("uploadMsg").textContent="Đã chọn ảnh đại diện ✓";
  }));

  box.querySelectorAll(".img-move").forEach(btn=>btn.addEventListener("click",(e)=>{
    e.stopPropagation();
    const u=decodeURIComponent(btn.dataset.url||"");
    const dir=btn.dataset.move;
    const now=parseImageStorage($("images").value);
    const c=String($("coverImage").value||now.cover||now.urls[0]||"").trim();
    const rest=now.urls.filter(x=>x!==c);
    const i=rest.indexOf(u);
    if(i<0) return;
    const j=dir==="up"?i-1:i+1;
    if(j<0||j>=rest.length) return;
    [rest[i],rest[j]]=[rest[j],rest[i]];
    $("images").value=serializeImageStorage([c,...rest],c);
    renderImagePicker();
    $("uploadMsg").textContent="Đã đổi thứ tự ảnh ✓";
  }));

  box.querySelectorAll(".image-choice[data-local-index]").forEach(btn=>btn.addEventListener("click",()=>{
    $("coverImage").value="";
    $("coverPendingIndex").value=String(btn.dataset.localIndex);
    renderImagePicker();
    $("uploadMsg").textContent="Đã chọn ảnh đại diện ✓ — ảnh sẽ được giữ sau khi upload";
  }));
}

function escImageUrl(u){
  return String(u||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function formatAdminPrice(v){
  const n=Number(v);
  if(!Number.isFinite(n)) return "";
  if(n<1) return new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(n*1000)+" triệu";
  return new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(n)+" tỷ";
}
function resetForm(){
  editing=null;
  ["code","area","price","title","size","road","highlight","bedrooms","bathrooms","front_yard","back_yard","car_yard","terrace","function_text","legal","description","images","coverImage","coverPendingIndex"].forEach(x=>$(x).value="");
  $("status").value="active";
  $("imageFiles").value="";
  $("uploadMsg").textContent="";
  $("msg").textContent="Đã tạo form tin mới.";
  renderImagePicker();
}
window.resetForm=resetForm;
async function loadHomeImages(){
  try{
    const r=await fetch("/api/home-images",{headers:headers()});
    if(!r.ok) return;
    const d=await r.json();
    const map={"hero":"previewHero","category-1":"previewCat1","category-2":"previewCat2","category-3":"previewCat3","category-4":"previewCat4"};
    Object.entries(map).forEach(([slot,id])=>{if(d[slot]) $(id).src=d[slot];});
  }catch(e){}
}
async function uploadHomeImage(slot){
  const map={"hero":"homeHero","category-1":"homeCat1","category-2":"homeCat2","category-3":"homeCat3","category-4":"homeCat4"};
  const msgMap={"hero":"homeHeroMsg","category-1":"homeCat1Msg","category-2":"homeCat2Msg","category-3":"homeCat3Msg","category-4":"homeCat4Msg"};
  const file=$(map[slot]).files[0];
  const msg=$(msgMap[slot]);
  if(!file){msg.textContent="Chọn ảnh trước.";return}
  if(!$('key').value.trim()){msg.textContent="Nhập ADMIN_KEY trước.";return}
  msg.textContent="Đang upload...";
  try{
    const f=await compressImage(file);
    const fd=new FormData();fd.append("file",f);fd.append("slot",slot);
    const r=await fetch("/api/upload-home-image",{method:"POST",headers:{"Authorization":"Bearer "+$("key").value},body:fd});
    const d=await r.json();
    if(!r.ok) throw new Error(d.error||"HTTP "+r.status);
    const previewMap={"hero":"previewHero","category-1":"previewCat1","category-2":"previewCat2","category-3":"previewCat3","category-4":"previewCat4"};
    $(previewMap[slot]).src=d.url;
    msg.textContent="Đã thay ảnh ✓";
    $(map[slot]).value="";
  }catch(e){msg.textContent="Lỗi: "+e.message}
}
window.loadHomeImages=loadHomeImages;
window.uploadHomeImage=uploadHomeImage;
async function load(){
  try{
    const r=await fetch("/api/properties?status=all",{headers:headers()});
    if(!r.ok){$("msg").textContent="Sai ADMIN_KEY hoặc lỗi API (HTTP "+r.status+").";return}
    const a=await r.json();
    $("list").innerHTML=a.map(p=>{
      const j=JSON.stringify(p).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/'/g,"&#39;");
      return "<tr><td><b>"+p.code+"</b></td><td>"+p.title+"</td><td>"+p.type+"</td><td>"+formatAdminPrice(p.price_billion)+"</td><td>"+p.status+"</td><td><button type=\"button\" class=\"smallbtn editBtn\" data-json='"+j+"'>Sửa</button> <button type=\"button\" class=\"smallbtn danger delBtn\" data-id=\""+p.id+"\">Xóa</button></td></tr>";
    }).join("");
    document.querySelectorAll(".editBtn").forEach(b=>b.addEventListener("click",()=>edit(JSON.parse(b.dataset.json))));
    document.querySelectorAll(".delBtn").forEach(b=>b.addEventListener("click",()=>del(b.dataset.id)));
  }catch(e){$("msg").textContent="Lỗi tải danh sách: "+e.message}
}
function edit(p){
  editing=p.id;
  ["code","area","title","size","road","highlight","bedrooms","bathrooms","front_yard","back_yard","car_yard","terrace","function_text","legal","status","price_band"].forEach(x=>$(x).value=p[x]??"");
  $("price").value=p.price_text||formatAdminPrice(p.price_billion);
  const parsed=parseImageStorage(p.images||"");
  $("images").value=parsed.urls.join("\n");
  $("coverImage").value=parsed.cover||parsed.urls[0]||"";
  renderImagePicker();
  $("msg").textContent="Đang sửa tin "+p.code;
  window.scrollTo({top:0,behavior:"smooth"});
}
async function compressImage(file){
  if(file.size<=1200000) return file;
  const bmp=await createImageBitmap(file);
  const max=1600;
  const scale=Math.min(1,max/Math.max(bmp.width,bmp.height));
  const c=document.createElement("canvas");
  c.width=Math.max(1,Math.round(bmp.width*scale));c.height=Math.max(1,Math.round(bmp.height*scale));
  c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
  const blob=await new Promise(r=>c.toBlob(r,"image/webp",0.82));
  return new File([blob],file.name.replace(/\.[^.]+$/i,".webp"),{type:"image/webp"});
}
window.load=load;
async function uploadImages(){
  const files=[...$("imageFiles").files];
  if(!files.length){$("uploadMsg").textContent="Hãy chọn ít nhất 1 ảnh.";return}
  if(!$("code").value.trim()){$("uploadMsg").textContent="Nhập Mã tin trước khi upload ảnh.";return}
  if(!$("key").value.trim()){$("uploadMsg").textContent="Nhập ADMIN_KEY trước.";return}
  $("uploadBtn").disabled=true;
  $("uploadMsg").textContent="Đang upload 0/"+files.length+"...";
  const parsed=parseImageStorage($("images").value);
  let urls=parsed.urls;
  if(!$("coverImage").value.trim()) $("coverImage").value=parsed.cover||urls[0]||"";
  try{
    for(let i=0;i<files.length;i++){
      const f=await compressImage(files[i]);
      const fd=new FormData();fd.append("file",f);fd.append("code",$("code").value.trim());
      const r=await fetch("/api/upload-image",{method:"POST",headers:{"Authorization":"Bearer "+$("key").value},body:fd});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||"Upload lỗi HTTP "+r.status);
      urls.push(d.url);
      $("images").value=urls.join("\n");
      const pendingCover=Number($("coverPendingIndex")?.value||-1);
      if(pendingCover===i){
        $("coverImage").value=d.url;
        $("coverPendingIndex").value="-1";
      }else if(!$("coverImage").value.trim() && !parsed.cover && i===0){
        $("coverImage").value=d.url;
      }
      renderImagePicker();
      $("uploadMsg").textContent="Đang upload "+(i+1)+"/"+files.length+"...";
    }
    $("uploadMsg").textContent="Đã upload "+files.length+" ảnh ✓";
    $("imageFiles").value="";
    if(editing){
      $("msg").textContent="Đang cập nhật ảnh vào tin...";
      await save();
    }
  }catch(e){$("uploadMsg").textContent="Lỗi upload: "+e.message}
  finally{$("uploadBtn").disabled=false}
}
window.uploadImages=uploadImages;
async function save(){
  try{
    const p={code:$("code").value.trim(),type:$("type").value,area:$("area").value.trim(),price_text:$("price").value.trim(),price_billion:parsePrice($("price").value),price_band:$("price_band").value,title:$("title").value.trim(),size:$("size").value.trim(),road:$("road").value.trim(),highlight:$("highlight").value.trim(),bedrooms:Number($("bedrooms").value||0),bathrooms:Number($("bathrooms").value||0),front_yard:$("front_yard").value,back_yard:$("back_yard").value,car_yard:$("car_yard").value,terrace:$("terrace").value,function_text:$("function_text").value.trim(),legal:$("legal").value.trim(),description:$("description").value.trim(),images:serializeImageStorage(parseImageStorage($("images").value).urls,$("coverImage").value),status:$("status").value};
    if(!p.code||!p.title){$("msg").textContent="Cần mã tin và tiêu đề.";return}
    if(!p.price_text){$("msg").textContent="Nhập giá, ví dụ: 800 triệu, 900tr, 2,27 tỷ, 2 tỷ 270 triệu hoặc Thỏa thuận.";return}
    if(!Number.isFinite(p.price_billion)) p.price_billion=0;
    if(!$("key").value.trim()){$("msg").textContent="Nhập ADMIN_KEY trước.";return}
    $("saveBtn").disabled=true;$("msg").textContent="Đang lưu...";
    const r=await fetch("/api/properties"+(editing?"/"+encodeURIComponent(editing):""),{method:editing?"PUT":"POST",headers:headers(),body:JSON.stringify(p)});
    const d=await r.json();
    $("msg").textContent=d.message||d.error||"Đã lưu";
    if(r.ok){editing=null;await load()}
  }catch(e){$("msg").textContent="Lỗi lưu tin: "+e.message}
  finally{$("saveBtn").disabled=false}
}
window.save=save;
async function del(id){
  if(!confirm("Xóa tin này?"))return;
  try{const r=await fetch("/api/properties/"+encodeURIComponent(id),{method:"DELETE",headers:headers()});const d=await r.json();$("msg").textContent=d.message||d.error||"";await load()}catch(e){$("msg").textContent="Lỗi xóa: "+e.message}
}
window.del=del;
$("saveBtn").addEventListener("click",save);
$("newBtn").addEventListener("click",resetForm);
$("uploadBtn").addEventListener("click",uploadImages);
$("imageFiles").addEventListener("change",()=>{
  if(!$("coverPendingIndex").value && !$("coverImage").value.trim() && $("imageFiles").files.length){
    $("coverPendingIndex").value="0";
  }
  renderImagePicker();
  $("uploadMsg").textContent=$("imageFiles").files.length+" ảnh đã chọn — bấm vào ảnh muốn làm ảnh đại diện.";
});
$("refreshBtn").addEventListener("click",load);
$("key").value=localStorage.getItem("nhadep_admin_key")||"";
$("key").addEventListener("change",()=>localStorage.setItem("nhadep_admin_key",$("key").value));
document.querySelectorAll(".homeUploadBtn").forEach(b=>b.addEventListener("click",()=>uploadHomeImage(b.dataset.slot)));
loadHomeImages();
load();
