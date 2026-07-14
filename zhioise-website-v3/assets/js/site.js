
const SITE_EMAIL = 'hello@zhioise.com';
const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const langToggle = document.querySelector('.lang-toggle');

function setLanguage(lang){
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(el=>{
    el.textContent = lang === 'zh' ? el.dataset.zh : el.dataset.en;
  });
  document.querySelectorAll('[data-placeholder-en][data-placeholder-zh]').forEach(el=>{
    el.placeholder = lang === 'zh' ? el.dataset.placeholderZh : el.dataset.placeholderEn;
  });
  if(langToggle) langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
  localStorage.setItem('zhioise-language',lang);
}
setLanguage(localStorage.getItem('zhioise-language') || 'en');
langToggle?.addEventListener('click',()=>setLanguage(document.documentElement.lang.startsWith('zh')?'en':'zh'));
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30),{passive:true});
menuToggle?.addEventListener('click',()=>{
  const open=navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active',open); body.classList.toggle('menu-open',open);
  menuToggle.setAttribute('aria-expanded',String(open));
});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuToggle?.classList.remove('active');body.classList.remove('menu-open')}));

const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.hero-dot')];
let slideIndex=0, slideTimer;
function showSlide(i){
  if(!slides.length)return; slideIndex=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle('active',n===slideIndex));
  dots.forEach((d,n)=>d.classList.toggle('active',n===slideIndex));
}
function autoSlide(){clearInterval(slideTimer);slideTimer=setInterval(()=>showSlide(slideIndex+1),6500)}
dots.forEach((d,i)=>d.addEventListener('click',()=>{showSlide(i);autoSlide()}));showSlide(0);autoSlide();

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));

const modal=document.querySelector('#inquiry-modal');
const modalProduct=document.querySelector('#modal-product');
const modalClose=document.querySelector('.modal-close');
document.querySelectorAll('[data-inquire]').forEach(btn=>btn.addEventListener('click',()=>{
  if(modalProduct) modalProduct.value=btn.dataset.inquire||'';
  modal?.classList.add('open'); modal?.setAttribute('aria-hidden','false');
}));
function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true')}
modalClose?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

const toast=document.querySelector('.toast');
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}

document.querySelectorAll('.inquiry-form').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(form); const lang=document.documentElement.lang.startsWith('zh');
  const subject=`Zhioise Inquiry${fd.get('product')?' — '+fd.get('product'):''}`;
  const lines=[`Name: ${fd.get('name')||''}`,`Email: ${fd.get('email')||''}`,`Topic / Product: ${fd.get('product')||''}`,`Quantity: ${fd.get('quantity')||''}`,`Message:`,fd.get('message')||''];
  location.href=`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  showToast(lang?'已打开您的邮件应用。':'Your email app has been opened.');
}));

document.querySelectorAll('[data-copy-email]').forEach(btn=>btn.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(SITE_EMAIL);showToast(document.documentElement.lang.startsWith('zh')?'邮箱已复制':'Email copied')}catch{showToast(SITE_EMAIL)}
}));
