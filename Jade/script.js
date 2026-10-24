// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Lightbox functionality
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;

        // Set caption based on filename
        const filename = imageSrc.replace('.png', '').replace(/([A-Z])/g, ' $1').trim();
        if (lightboxCaption) {
            lightboxCaption.textContent = filename;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Toggle more DND screenshots
function toggleMoreDND() {
    const extraGallery = document.getElementById('dndExtra');
    const moreBtnText = document.getElementById('moreBtnText');
    const moreBtnIcon = document.getElementById('moreBtnIcon');

    if (extraGallery && moreBtnText && moreBtnIcon) {
        if (extraGallery.classList.contains('active')) {
            extraGallery.classList.remove('active');
            moreBtnText.textContent = 'View More Screenshots';
            moreBtnIcon.classList.remove('fa-chevron-up');
            moreBtnIcon.classList.add('fa-chevron-down');
        } else {
            extraGallery.classList.add('active');
            moreBtnText.textContent = 'Show Less';
            moreBtnIcon.classList.remove('fa-chevron-down');
            moreBtnIcon.classList.add('fa-chevron-up');
        }
    }
}

// Smooth scroll offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: targetPosition - navHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll + active link highlighting
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    const scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);

        if (link) {
            link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
        }
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Cursor glow (desktop / fine pointers only)
const cursorGlow = document.getElementById('cursorGlow');
const finePointer = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursorGlow && finePointer && !reduceMotion) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 3;
    let currentX = glowX;
    let currentY = glowY;

    window.addEventListener('pointermove', (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
    }, { passive: true });

    function animateGlow() {
        // Ease the glow toward the pointer for a smooth trailing effect
        currentX += (glowX - currentX) * 0.08;
        currentY += (glowY - currentY) * 0.08;
        cursorGlow.style.setProperty('--x', `${currentX}px`);
        cursorGlow.style.setProperty('--y', `${currentY}px`);
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
} else if (cursorGlow) {
    cursorGlow.style.display = 'none';
}

// Staggered reveal-on-scroll
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('revealed');
            el.addEventListener('transitionend', () => {
                el.style.transitionDelay = '';
            }, { once: true });
            revealObserver.unobserve(el);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    if (reduceMotion) return;

    const groups = [
        { selector: '.skill-card', stagger: 90 },
        { selector: '.project-card', stagger: 120 },
        { selector: '.contact-card', stagger: 90 },
        { selector: '.gallery-item', stagger: 55 }
    ];

    groups.forEach(({ selector, stagger }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${Math.min(index, 8) * stagger}ms`;
            revealObserver.observe(el);
        });
    });
});
