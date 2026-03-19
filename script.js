// --- LERP UTILITY FOR BUTTERY SMOOTHNESS ---
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// --- SMOOTH CURSOR LOGIC & VFX ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Target mouse coordinates
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Interpolated cursor coordinates
let dotX = mouseX, dotY = mouseY;
let outlineX = mouseX, outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; 
    mouseY = e.clientY;
    
    // Background VFX Gradient Position updates instantly
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
});

// Interactive 3D Card State
const cards = document.querySelectorAll('.profile-card');
let targetRotateX = 0, targetRotateY = 0;
let currentRotateX = 0, currentRotateY = 0;
let isHoveringCard = false;

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        isHoveringCard = true;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        targetRotateX = ((y - centerY) / centerY) * -8; // Premium soft tilt
        targetRotateY = ((x - centerX) / centerX) * 8;
    });

    card.addEventListener('mouseleave', () => {
        isHoveringCard = false;
        targetRotateX = 0;
        targetRotateY = 0;
    });
});

// Main Animation Loop
function animate() {
    // 1. Smooth Cursor via Lerp
    dotX = lerp(dotX, mouseX, 0.35); // Fast lerp for dot
    outlineX = lerp(outlineX, mouseX, 0.12); // Smooth lerp for outline
    dotY = lerp(dotY, mouseY, 0.35);
    outlineY = lerp(outlineY, mouseY, 0.12);
    
    // Translate3d handles sub-pixel rendering and GPU acceleration
    cursorDot.style.transform = `translate3d(calc(${dotX}px - 50%), calc(${dotY}px - 50%), 0)`;
    cursorOutline.style.transform = `translate3d(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%), 0)`;

    // 2. Smooth 3D Card Tilt via Lerp
    currentRotateX = lerp(currentRotateX, targetRotateX, 0.08); // Ultra smooth interpolation
    currentRotateY = lerp(currentRotateY, targetRotateY, 0.08);
    
    cards.forEach(card => {
        if(card.classList.contains('active')) {
            if(Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01 || isHoveringCard) {
                const scale = isHoveringCard ? 1.015 : 1;
                card.style.transform = `perspective(2000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
            } else {
                card.style.transform = 'none'; // Clear transform on idle so text stays crisp
            }
        }
    });

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Hover states for links, badges, buttons, inputs
const interactiveElements = document.querySelectorAll('.link, .badge-icon, button, input, .link-inline');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
window.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
window.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

// --- LANGUAGE SYSTEM (EN/TR) ---
const translations = {
    "en": {
        click_enter: "Click anywhere to enter",
        nav_profile: "Profile",
        nav_contact: "Contact",
        nav_skills: "Skills",
        tag_staff: "Staff",
        contact_title: "Contact Info",
        contact_discord_user: "DISCORD USER",
        hire_title: "Why Hire Me?",
        hire_desc: "I am highly professional with extensive experience in building robust applications, scripts, and front-end experiences.",
        typewriter_1: "PC Checker for Turkish FiveM Servers",
        typewriter_2: "Website & Discord Developer",
        badge_dev: "Developer",
        badge_owner: "Owner",
        badge_admin: "Administrator",
        badge_staff: "Staff",
        badge_vip: "VIP"
    },
    "tr": {
        click_enter: "Giriş için herhangi bir yere tıkla",
        nav_profile: "Profil",
        nav_contact: "İletişim",
        nav_skills: "Yetenekler",
        tag_staff: "Yetkili",
        contact_title: "İletişim Bilgileri",
        contact_discord_user: "DİSCORD KULLANICI",
        hire_title: "Neden Ben?",
        hire_desc: "Sağlam uygulamalar, scriptler ve modern / profesyonel arayüzler oluşturma konusunda geniş tecrübeye sahibim.",
        typewriter_1: "Türk FiveM Sunucuları için PC Checker",
        typewriter_2: "Website ve Discord Geliştiricisi",
        badge_dev: "Geliştirici",
        badge_owner: "Kurucu",
        badge_admin: "Yönetici",
        badge_staff: "Yetkili",
        badge_vip: "VIP"
    }
};

let currentLang = "en";
const langBtn = document.getElementById('lang-toggle');

const textArray = ["", ""];
let textIndex = 0; let charIndex = 0; let isDeleting = false;

function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key] || el.textContent;
    });
    
    document.querySelectorAll('.i18n-tooltip').forEach(el => {
        const key = el.getAttribute('data-tooltip-key');
        el.setAttribute('data-tooltip', translations[lang][key]);
    });
    
    textArray[0] = translations[lang].typewriter_1;
    textArray[1] = translations[lang].typewriter_2;
}

langBtn.addEventListener('click', () => {
    currentLang = currentLang === "en" ? "tr" : "en";
    langBtn.textContent = currentLang.toUpperCase();
    updateLanguage(currentLang);
});

updateLanguage(currentLang);

// --- ENTRANCE OVERLAY & AUDIO ---
const enterOverlay = document.getElementById('enter-overlay');
const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

const musicController = document.querySelector('.music-controller');
const topControls = document.querySelector('.top-controls');

let isPlaying = false;

enterOverlay.addEventListener('click', () => {
    enterOverlay.style.opacity = '0';
    setTimeout(() => { enterOverlay.style.visibility = 'hidden'; }, 1500);
    
    setTimeout(() => {
        musicController.classList.add('visible');
        topControls.classList.add('visible');
    }, 600);

    bgMusic.volume = volumeSlider.value;
    bgMusic.play().then(() => {
        isPlaying = true;
        playPauseIcon.className = 'bx bx-pause';
        document.body.classList.add('playing-pulse');
    }).catch(e => console.log("Audio autoplay prevented"));

    setTimeout(type, 1000);
});

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        playPauseIcon.className = 'bx bx-play';
        document.body.classList.remove('playing-pulse');
    } else {
        bgMusic.play();
        playPauseIcon.className = 'bx bx-pause';
        document.body.classList.add('playing-pulse');
    }
    isPlaying = !isPlaying;
});

volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    bgMusic.volume = vol;
    if (vol == 0) { volumeIcon.className = 'bx bx-volume-mute'; }
    else if (vol < 0.5) { volumeIcon.className = 'bx bx-volume-low'; }
    else { volumeIcon.className = 'bx bx-volume-full'; }
});

// --- TYPEWRITER EFFECT ---
const typewriterElement = document.getElementById('typewriter');

function type() {
    if(!typewriterElement) return;
    const currentText = textArray[textIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 25 : 55;
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2500; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; textIndex = (textIndex + 1) % textArray.length; typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}

// --- PAGE SWITCHING (TABS) ---
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) return;

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.getAttribute('data-target');

        // Synchronous crossfade swap with no timeouts, pure CSS handling
        pages.forEach(page => {
            if (page.id === targetId) {
                page.classList.add('active');
                // Reset card tilt parameters instantly for a clean entrance
                currentRotateX = 0; currentRotateY = 0;
                targetRotateX = 0; targetRotateY = 0;
            } else {
                page.classList.remove('active');
            }
        });
    });
});