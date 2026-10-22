const pg=document.querySelector(".project-page");
addEventListener("load",()=>pg&&requestAnimationFrame(()=>pg.classList.add("is-loaded")));
const io=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");o.unobserve(e.target)}}),{threshold:.15,rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".project-media,.project-text").forEach(el=>io.observe(el));
