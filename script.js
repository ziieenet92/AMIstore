// ===============================
// KONFIGURASI TOKO
// Ganti nomor WhatsApp di bawah.
// Format: kode negara tanpa tanda +, contoh 6282257841375
// ===============================
const WHATSAPP_NUMBER = "6282257841375";

const packages = [
  {operator:"XL PAKAI APLIKASI", name:"XL Pakai Aplikasi", quota:"15GB", valid:"7 Hari", price:18000},
  {operator:"XL PAKAI APLIKASI", name:"XL Pakai Aplikasi", quota:"75GB", valid:"28 Hari", price:75000},
  
  {operator:"TELKOMSEL PAKAI APLIKASI", name:"TELKOMSEL Pakai Aplikasi", quota:"22GB", valid:"7 Hari", price:23000},
  {operator:"TELKOMSEL PAKAI APLIKASI", name:"TELKOMSEL Pakai Aplikasi", quota:"88GB", valid:"28 Hari", price:85000},
  
  {operator:"XL", name:"XL Flex Mini 4–5GB", quota:"4–5GB", valid:"7 Hari", price:19000},
  {operator:"XL", name:"XL Flex Mini 6–8GB", quota:"6–8GB", valid:"7 Hari", price:22000},
  {operator:"XL", name:"XL Flex Mini 10–14GB", quota:"10–14GB", valid:"7 Hari", price:27000},
  {operator:"XL", name:"XL Flex Mini 5GB", quota:"5GB", valid:"14 Hari", price:24000},
  {operator:"XL", name:"XL Flex Mini 10GB", quota:"10GB", valid:"14 Hari", price:30000},
  {operator:"XL", name:"XL Flex Max 10GB", quota:"10GB", valid:"28 Hari", price:42000},
  {operator:"XL", name:"XL Flex Max 16GB", quota:"16GB", valid:"28 Hari", price:50000},
  {operator:"XL", name:"XL Flex Max 23GB", quota:"23GB", valid:"28 Hari", price:60000},
  {operator:"XL", name:"XL Flex Max 40GB", quota:"40GB", valid:"28 Hari", price:75000},
  {operator:"XL", name:"XL Flex Max 50GB", quota:"50GB", valid:"28 Hari", price:84000},
  {operator:"XL", name:"XL Flex Max 65GB", quota:"65GB", valid:"28 Hari", price:93000},
  {operator:"XL", name:"XL Flex Max 100GB", quota:"100GB", valid:"28 Hari", price:109000},
  

  {operator:"AXIS", name:"Mini AXIS 3GB + Bonus Aigo", quota:"3GB + Bonus Aigo", valid:"7 Hari", price:16000},
  {operator:"AXIS", name:"Mini AXIS 4GB + Bonus Aigo", quota:"4GB + Bonus Aigo", valid:"7 Hari", price:20000},
  {operator:"AXIS", name:"Mini AXIS 6GB + Bonus Aigo", quota:"6GB + Bonus Aigo", valid:"7 Hari", price:22000},
  {operator:"AXIS", name:"Mini AXIS 10GB + Bonus Aigo", quota:"10GB + Bonus Aigo", valid:"7 Hari", price:27000},
  {operator:"AXIS", name:"Mini AXIS 17GB + Bonus Aigo", quota:"17GB + Bonus Aigo", valid:"7 Hari", price:30000},
  {operator:"AXIS", name:"Mini AXIS 8GB + Bonus Aigo", quota:"8GB + Bonus Aigo", valid:"14 Hari", price:31000},
  {operator:"AXIS", name:"Mini AXIS 15GB + Bonus Aigo", quota:"15GB + Bonus Aigo", valid:"14 Hari", price:38000},
  {operator:"AXIS", name:"Mini AXIS 25GB + Bonus Aigo", quota:"25GB + Bonus Aigo", valid:"14 Hari", price:48000},
  {operator:"AXIS", name:"Mini AXIS 36GB + Bonus Aigo", quota:"36GB + Bonus Aigo", valid:"14 Hari", price:56000}
];

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

const grid = document.getElementById("packageGrid");
const filters = document.getElementById("filters");
let selectedOperator = "SEMUA";
let selectedPackage = null;

function renderFilters(){
  const ops = ["SEMUA", ...new Set(packages.map(p=>p.operator))];
  filters.innerHTML = ops.map(op =>
    `<button class="filter ${op===selectedOperator?"active":""}" data-op="${op}">${op}</button>`
  ).join("");
  filters.querySelectorAll(".filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      selectedOperator = btn.dataset.op;
      renderFilters();
      renderPackages();
    });
  });
}

function renderPackages(){
  const list = selectedOperator==="SEMUA" ? packages : packages.filter(p=>p.operator===selectedOperator);
  grid.innerHTML = list.map((p,i)=>`
    <article class="package">
      <div class="operator">${p.operator}</div>
      <h3>${p.name}</h3>
      <div class="quota">${p.quota}</div>
      <div class="valid">Masa berlaku: ${p.valid}</div>
      <div class="price">${rupiah(p.price)}</div>
      <button class="btn primary buy" data-index="${packages.indexOf(p)}">Beli Sekarang</button>
    </article>
  `).join("");
  grid.querySelectorAll(".buy").forEach(btn=>{
    btn.addEventListener("click",()=>openOrder(packages[Number(btn.dataset.index)]));
  });
}

const modal = document.getElementById("orderModal");
const modalTitle = document.getElementById("modalTitle");
const modalDetail = document.getElementById("modalDetail");
const phone = document.getElementById("phone");
const nameInput = document.getElementById("name");
const paymentStep = document.getElementById("paymentStep");
const paymentAmount = document.getElementById("paymentAmount");
const confirmWa = document.getElementById("confirmWa");

function openOrder(p){
  selectedPackage = p;
  modalTitle.textContent = p.name;
  modalDetail.textContent = `${p.operator} • ${p.quota} • ${p.valid} • ${rupiah(p.price)}`;
  paymentStep.hidden = true;
  paymentAmount.textContent = rupiah(p.price);
  confirmWa.href = "#";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  phone.focus();
}
function closeOrder(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}
document.getElementById("closeModal").addEventListener("click",closeOrder);
modal.addEventListener("click",e=>{if(e.target===modal) closeOrder();});

document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const nomor = phone.value.trim().replace(/\D/g,"");
  const nama = nameInput.value.trim() || "-";
  if(nomor.length < 10 || nomor.length > 15){
    alert("Silakan masukkan nomor HP yang valid.");
    phone.focus();
    return;
  }
  paymentAmount.textContent = rupiah(selectedPackage.price);
  const msg = `Halo ZiieeNet, saya sudah melakukan pembayaran QRIS dan ingin konfirmasi:%0A%0A` +
    `Paket: ${selectedPackage.name}%0A` +
    `Operator: ${selectedPackage.operator}%0A` +
    `Kuota: ${selectedPackage.quota}%0A` +
    `Masa berlaku: ${selectedPackage.valid}%0A` +
    `Total: ${rupiah(selectedPackage.price)}%0A` +
    `Nomor HP: ${nomor}%0A` +
    `Nama: ${nama}%0A%0A` +
    `Mohon diproses. Bukti pembayaran siap dikirim jika diperlukan.`;
  confirmWa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  paymentStep.hidden = false;
  paymentStep.scrollIntoView({behavior:"smooth", block:"nearest"});
});

const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById("heroWa").href = waLink;
document.getElementById("contactWa").href = waLink;
document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("menuBtn").addEventListener("click",()=>{
  document.getElementById("navMenu").classList.toggle("open");
});
document.querySelectorAll("#navMenu a").forEach(a=>a.addEventListener("click",()=>{
  document.getElementById("navMenu").classList.remove("open");
}));

renderFilters();
renderPackages();
