// Navigation mobile et initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initMobileMenu();
    initLanguageSelector();
    initSmoothScrolling();
    initScrollAnimations();
    initCounters();
    initChartAnimations();
    initContactForm();
    
    // Détecter et appliquer la langue du navigateur
    const browserLang = detectBrowserLanguage();
    if (browserLang && window.languageManager) {
        window.languageManager.updateLanguage(browserLang);
    }
});

// Fonction pour initialiser le menu mobile
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animation du bouton hamburger
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Fermer le menu en cliquant sur un lien
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }
}

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.feature-card, .benefit-item, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Navbar transparente au scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validation
        if (validateForm(data)) {
            // Simulation d'envoi (remplacer par votre logique d'envoi)
            showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Tracking
            trackEvent('Contact', 'Form Submit', 'Landing Page');
        } else {
            showNotification('Veuillez remplir tous les champs requis.', 'error');
        }
    });
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Ajouter les styles si pas encore présents
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                border-left: 4px solid;
                z-index: 10000;
                max-width: 400px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-info {
                border-left-color: #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
            }
            
            .notification-icon {
                font-size: 1.25rem;
            }
            
            .notification-message {
                flex: 1;
                font-size: 0.875rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 1.5rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #374151;
            }
            
            @media (max-width: 640px) {
                .notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Gestion de la fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

// Détection de la langue du navigateur
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    // Vérifier si la langue est supportée
    const supportedLangs = ['fr', 'en', 'ar'];
    if (supportedLangs.includes(langCode)) {
        return langCode;
    }
    
    return 'fr'; // Langue par défaut
}

// Initialisation du sélecteur de langue
function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (window.languageManager) {
                window.languageManager.updateLanguage(lang);
            }
            trackEvent('Language', 'change', lang);
        });
    });
}

// Défilement fluide
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensation pour la navbar fixe
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-item, .pricing-card, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Compteurs animés
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formater le nombre selon la langue
        const currentLang = window.languageManager?.getCurrentLanguage() || 'fr';
        const formattedNumber = formatNumber(Math.floor(current), currentLang);
        element.textContent = formattedNumber + (element.textContent.includes('+') ? '+' : '');
    }, 16);
}

// Formatage des nombres selon la langue
function formatNumber(num, lang) {
    if (lang === 'ar') {
        return num.toLocaleString('ar-SA');
    } else if (lang === 'en') {
        return num.toLocaleString('en-US');
    } else {
        return num.toLocaleString('fr-FR');
    }
}

// Animations des graphiques
function initChartAnimations() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const observerOptions = {
        threshold: 0.5
    };
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateChart();
                chartObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (chartBars.length > 0) {
        chartObserver.observe(chartBars[0].parentElement);
    }
}

function animateChart() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const heights = [60, 80, 45, 90, 70]; // Hauteurs en pourcentage
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.height = heights[index] + '%';
            bar.style.transition = 'height 0.8s ease';
        }, index * 100);
    });
}

// Formulaire de contact
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation simple
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            if (validateForm(data)) {
                // Simulation d'envoi
                showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
                form.reset();
                
                // Tracking analytics
                trackEvent('Contact', 'Form Submit', 'Landing Page');
            } else {
                showNotification('Veuillez remplir tous les champs requis.', 'error');
            }
        });
        
        // Validation en temps réel
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateForm(data) {
    return data.name && data.name.trim() !== '' && 
           data.email && data.email.trim() !== '' && 
           data.message && data.message.trim() !== '';
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        field.style.borderColor = 'var(--error-color)';
        return false;
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = 'var(--error-color)';
            return false;
        }
    }
    
    field.style.borderColor = 'var(--border-color)';
    return true;
}

// Analytics et tracking
function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', {
            category: category,
            action: action,
            label: label
        });
    }
    
    // Console log pour le développement
    console.log('Event tracked:', { category, action, label });
}

// Gestion des événements de redimensionnement
window.addEventListener('resize', function() {
    // Fermer le menu mobile si ouvert lors du redimensionnement
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
});

// Tracker les clics sur les CTA
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('CTA', 'click', e.target.textContent);
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Mesurer le temps de chargement
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Tracker le temps de chargement
    trackEvent('Performance', 'page_load_time', Math.round(loadTime / 1000) + 's');
});

// Gestion des erreurs JavaScript
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('Error', 'javascript_error', e.message);
});

// Export des fonctions pour utilisation externe si nécessaire
window.StoXaLanding = {
    changeLanguage: (lang) => window.languageManager?.updateLanguage(lang),
    getCurrentLanguage: () => window.languageManager?.getCurrentLanguage() || 'fr',
    trackEvent,
    showNotification
}; 