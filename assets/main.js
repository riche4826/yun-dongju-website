document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false');
    }));
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape'){nav.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');}
    });
  }

  // Network-free illustration fallback; the main photos stay accurately sourced.
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    const showFallback = () => {
      if(img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) {
        img.src = img.dataset.fallback;
        img.dataset.usingFallback = 'true';
      }
    };
    img.addEventListener('error', showFallback, {once:true});
    if(img.complete && img.naturalWidth === 0) showFallback();
  });

  const progress = document.getElementById('reading-progress');
  let ticking = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if(progress) progress.style.width = (scrollable <= 0 ? 0 : Math.min(100,Math.max(0,window.scrollY/scrollable*100))) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}
  },{passive:true});
  window.addEventListener('resize',updateProgress);
  updateProgress();

  const sections = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io = new IntersectionObserver((entries,observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:0.06,rootMargin:'0px 0px 50px 0px'});
    sections.forEach(el => io.observe(el));
  } else sections.forEach(el => el.classList.add('is-visible'));

  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('.gallery-item[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const current = filter === button;
      filter.classList.toggle('is-selected',current);
      filter.setAttribute('aria-pressed',String(current));
    });
    items.forEach(item => {item.hidden = selected !== 'all' && item.dataset.category !== selected;});
  }));
});
