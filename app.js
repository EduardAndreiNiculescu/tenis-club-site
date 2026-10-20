/* ==========================================================================
   TENIS & SPORTS CLUB CRAIOVA - JAVASCRIPT APP LOGIC & SCROLL REVEAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Set default dates in form inputs
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInputs = ['quickDate', 'modalDate', 'eventDate'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = todayStr;
            input.min = todayStr;
        }
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 4. Initial Prices Update
    updateQuickPrice();
    updateModalPrice();

    // 5. Intersection Observer for Smooth Scroll Animations (UI/UX Pro Max)
    initScrollReveal();

    // 6. Active Nav Link on Scroll
    initActiveNavScroll();
});

/* ==========================================================================
   INTERSECTION OBSERVER SCROLL ANIMATIONS
   ========================================================================== */

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   PRICING LOGIC & CALCULATORS
   ========================================================================== */

// Phone number for WhatsApp requests
const CLUB_WHATSAPP = '40700000000'; 

// Calculate Quick Booking Price
function updateQuickPrice() {
    const sportSelect = document.getElementById('quickSport');
    const timeSelect = document.getElementById('quickTime');
    const display = document.getElementById('quickPriceDisplay');

    if (!sportSelect || !display) return;

    const sport = sportSelect.value;
    const timeOptionText = timeSelect ? timeSelect.options[timeSelect.selectedIndex]?.text || '' : '';

    let price = 60;

    if (sport === 'tenis') {
        if (timeOptionText.includes('Nocturnă')) {
            price = 80;
        } else if (timeOptionText.includes('Apus')) {
            price = 70;
        } else {
            price = 60;
        }
    } else if (sport === 'fotbal') {
        if (timeOptionText.includes('Nocturnă')) {
            price = 180;
        } else if (timeOptionText.includes('Apus')) {
            price = 160;
        } else {
            price = 140;
        }
    } else if (sport === 'bar') {
        price = 500; // Pachet bază
    }

    display.innerText = sport === 'bar' ? `${price} LEI (Pachet Bază)` : `${price} LEI / Oră`;
}

// Quick Booking WhatsApp Redirect
function handleQuickBooking(e) {
    e.preventDefault();
    const sport = document.getElementById('quickSport')?.value;
    const date = document.getElementById('quickDate')?.value;
    const time = document.getElementById('quickTime')?.value;
    const price = document.getElementById('quickPriceDisplay')?.innerText;

    const sportName = sport === 'tenis' ? 'Tenis de Câmp (Zgură)' : (sport === 'fotbal' ? 'Minifotbal (Sintetic)' : 'Închiriere Bar Outdoor');

    const msg = `Buna ziua! Doresc o rezervare rapida la Tenis & Sports Club Craiova:
- Activitate: ${sportName}
- Data: ${date}
- Interval Orar: ${time}
- Tarif estimat: ${price}

Va rog sa-mi confirmati disponibilitatea. Multumesc!`;

    const waUrl = `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}

/* ==========================================================================
   MODAL BOOKING FOR SPORTS COURTS
   ========================================================================== */

function openBookingModal(defaultSport = 'tenis') {
    const modal = document.getElementById('bookingModal');
    const sportSelect = document.getElementById('modalSport');
    if (sportSelect) {
        sportSelect.value = defaultSport;
    }
    if (modal) {
        modal.classList.add('active');
        updateModalPrice();
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function updateModalPrice() {
    const sport = document.getElementById('modalSport')?.value;
    const time = document.getElementById('modalTime')?.value;
    const duration = parseFloat(document.getElementById('modalDuration')?.value || '1');
    const priceTotal = document.getElementById('modalPriceTotal');

    if (!sport || !priceTotal) return;

    let hourlyRate = 60;
    const hour = parseInt(time.split(':')[0], 10);

    if (sport === 'tenis') {
        if (hour >= 20 || hour <= 8) {
            hourlyRate = 80;
        } else if (hour >= 18) {
            hourlyRate = 70;
        } else {
            hourlyRate = 60;
        }
    } else if (sport === 'fotbal') {
        if (hour >= 19 || hour <= 8) {
            hourlyRate = 180;
        } else if (hour >= 17) {
            hourlyRate = 160;
        } else {
            hourlyRate = 140;
        }
    }

    const total = hourlyRate * duration;
    priceTotal.innerText = `${total} LEI`;
}

function handleModalBooking(e) {
    e.preventDefault();
    const sport = document.getElementById('modalSport')?.value;
    const date = document.getElementById('modalDate')?.value;
    const time = document.getElementById('modalTime')?.value;
    const duration = document.getElementById('modalDuration')?.value;
    const name = document.getElementById('modalName')?.value;
    const phone = document.getElementById('modalPhone')?.value;
    const total = document.getElementById('modalPriceTotal')?.innerText;

    const sportText = sport === 'tenis' ? 'Tenis de Câmp (Zgură)' : 'Minifotbal (Sintetic)';

    const msg = `Buna ziua! Doresc sa rezerv un teren la Tenis & Sports Club Craiova:
- Nume Client: ${name}
- Telefon: ${phone}
- Sport: ${sportText}
- Data: ${date}
- Ora start: ${time}
- Durata: ${duration} ora/ore
- Valoare estimata: ${total}

Va rog sa confirmati rezervarea. Multumesc!`;

    const waUrl = `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    closeBookingModal();
}

/* ==========================================================================
   MODAL EVENT BAR RENTAL
   ========================================================================== */

function openEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleModalEvent(e) {
    e.preventDefault();
    const type = document.getElementById('eventType')?.value;
    const date = document.getElementById('eventDate')?.value;
    const guests = document.getElementById('eventGuests')?.value;
    const name = document.getElementById('eventName')?.value;

    const optGrill = document.getElementById('optGrill')?.checked ? 'Da' : 'Nu';
    const optBarman = document.getElementById('optBarman')?.checked ? 'Da' : 'Nu';
    const optSport = document.getElementById('optSport')?.checked ? 'Da' : 'Nu';

    const msg = `Buna ziua! Doresc o oferta de inchiriere pentru Barul Outdoor si Terasa la Tenis & Sports Club Craiova:
- Persoana contact: ${name}
- Tip eveniment: ${type}
- Data dorita: ${date}
- Numar estimat invitati: ${guests}
- Optiuni: Zona Gratar (${optGrill}), Barman Dedicat (${optBarman}), Teren Sport (${optSport})

Astept cu interes oferta si disponibilitatea dumneavoastra. Multumesc!`;

    const waUrl = `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    closeEventModal();
}

/* ==========================================================================
   FAQ ACCORDION TOGGLE
   ========================================================================== */

function toggleFaq(btn) {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    
    // Toggle current
    if (!isActive) {
        item.classList.add('active');
    }
}

// Close modals when clicking backdrop
window.addEventListener('click', (e) => {
    const bookingModal = document.getElementById('bookingModal');
    const eventModal = document.getElementById('eventModal');
    if (e.target === bookingModal) closeBookingModal();
    if (e.target === eventModal) closeEventModal();
});
