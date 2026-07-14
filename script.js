const toggle=document.querySelector('.menu-toggle');const menu=document.querySelector('.menu');if(toggle){toggle.addEventListener('click',()=>menu.classList.toggle('open'));}
const layers=[...document.querySelectorAll('.hero-layer')];if(layers.length>1){let i=0;setInterval(()=>{layers[i].classList.remove('active');i=(i+1)%layers.length;layers[i].classList.add('active');},6500)}
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
