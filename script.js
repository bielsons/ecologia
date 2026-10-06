const layers = document.querySelectorAll('.layer');
const shade = document.getElementById('shade');
const bar = document.getElementById('bar');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let target = window.scrollY;
let current = target;
function animate() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    current += (target - current) * (reduceMotion ? 1 : 0.08);
    const progress = Math.min(1, Math.max(0, current / max));

    layers.forEach((el, i) => {
        const shift = progress * window.innerHeight * parseFloat(el.dataset.v);
        const scale = 1 + progress * (0.06 + i * 0.08);
        el.style.transform = `translate3d(0, ${-shift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    });
    shade.style.opacity = Math.min(0.75, progress * 0.9).toFixed(3);
    bar.style.transform = `scaleX(${progress.toFixed(3)})`;
    requestAnimationFrame(animate);
}
window.addEventListener('scroll', () => {
    target = window.scrollY;
}, { passive: true });
animate();
function count(el) {
    const final = Number(el.dataset.n);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
        const k = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(final * eased).toLocaleString('pt-BR');
        if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('on');
        entry.target.querySelectorAll('[data-n]').forEach(count);
        observer.unobserve(entry.target);
    });
}, { threshold: 0.2 });
document.querySelectorAll('.rev:not(.on)').forEach((el) => observer.observe(el));
document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const alvo = document.querySelector(link.getAttribute('href'));
        if (alvo) alvo.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
});