const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Mouse koordinatlarını tutan değişkenler
let mouseX = 0;
let mouseY = 0;

// Outline'ın (halkanın) pozisyonunu smooth takip ettirmek için değişkenler
let outlineX = 0;
let outlineY = 0;

// Outline takip hızı (0 ile 1 arası, ne kadar küçükse o kadar yavaş/smooth takip eder)
const speed = 0.2; 

// 1. Mouse hareketini dinle ve koordinatları güncelle
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Nokta anında takip eder
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// 2. Animasyon Döngüsü (Outline'ın smooth takibi için)
function animateOutline() {
    // Outline'ın mevcut pozisyonunu mouse pozisyonuna doğru yavaşça hareket ettir
    outlineX += (mouseX - outlineX) * speed;
    outlineY += (mouseY - outlineY) * speed;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    // Döngüyü devam ettir
    requestAnimationFrame(animateOutline);
}

// Döngüyü başlat
animateOutline();

// 3. Link Etkileşimleri (Hover Efektleri)
const links = document.querySelectorAll('.link');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        // Outline'ı büyüt ve şeffaflaştır (profesyonel görünüm)
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        cursorDot.style.opacity = '0'; // Noktayı gizle
    });
    
    link.addEventListener('mouseleave', () => {
        // Eski haline döndür
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        cursorDot.style.opacity = '1';
    });
});

// 4. Tıklama Efekti
window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-active');
});

window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-active');
});