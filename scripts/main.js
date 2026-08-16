// Main JavaScript for Portfolio Website

// Error handling wrapper
function safeExecute(fn, name) {
    try {
        fn();
    } catch (error) {
        console.error(`Error in ${name}:`, error);
    }
}

// Global state variables for consolidated scrolling
let scrollTicking = false;
let navbarElement = null;
let navLinksElements = [];
let backToTopButton = null;
let progressBarElement = null;
let lastScrollTop = 0;

document.addEventListener('DOMContentLoaded', function () {
    // Cache common DOM elements
    navbarElement = document.getElementById('navbar');
    navLinksElements = document.querySelectorAll('.nav-link');
    progressBarElement = document.querySelector('.progress-bar');
    
    // Initialize functionalities
    safeExecute(initThemeToggle, 'Theme Toggle');
    safeExecute(initNavigation, 'Navigation');
    safeExecute(initAnimations, 'Animations');
    safeExecute(initBackToTop, 'Back to Top');
    safeExecute(initProgressBar, 'Progress Bar');
    safeExecute(initLazyLoading, 'Lazy Loading');
    safeExecute(initAccessibility, 'Accessibility');
    safeExecute(initVisitorCounter, 'Visitor Counter');
    safeExecute(initPhoneMask, 'Phone Masking');
    safeExecute(registerServiceWorker, 'Service Worker');

    // Attach single optimized passive scroll listener
    window.addEventListener('scroll', onScrollTick, { passive: true });
    
    // Initial layout check
    onScrollTick();
});

// Single tick scroll handler
function onScrollTick() {
    if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollElements);
        scrollTicking = true;
    }
}

// Optimized layout calculations update
function updateScrollElements() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 1. Navbar styling changes
    if (navbarElement) {
        if (scrollTop > 50) {
            navbarElement.classList.add('scrolled');
        } else {
            navbarElement.classList.remove('scrolled');
        }
        
        // Hide/Show navbar on scroll down/up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbarElement.style.transform = 'translateY(-100%)';
        } else {
            navbarElement.style.transform = 'translateY(0)';
        }
    }
    
    // 2. Active nav link highlight
    const scrollPos = scrollTop + 100;
    navLinksElements.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionBottom = sectionTop + targetSection.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinksElements.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        }
    });

    // 3. Back to Top Button position & visibility
    if (backToTopButton) {
        const footerHeight = 120;
        if (scrollTop > 300) {
            backToTopButton.classList.add('show');
            const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
            
            if (distanceFromBottom < footerHeight) {
                const buttonHeight = 50;
                const buttonMargin = 30;
                const newBottom = Math.max(buttonMargin, footerHeight - distanceFromBottom + buttonHeight + buttonMargin);
                backToTopButton.style.bottom = newBottom + 'px';
            } else {
                backToTopButton.style.bottom = '30px';
            }
        } else {
            backToTopButton.classList.remove('show');
            backToTopButton.style.bottom = '30px';
        }
    }

    // 4. Reading Progress Bar update
    if (progressBarElement) {
        const docHeight = documentHeight - windowHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBarElement.style.width = scrollPercent + '%';
    }

    lastScrollTop = scrollTop;
    scrollTicking = false;
}

// Visitor Counter (nightcode.co.in preserved)
function initVisitorCounter() {
    const pageId = window.location.hostname + window.location.pathname;
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    fetch(`https://backend.nightcode.co.in/api/v1/visitor/count?pageId=${encodeURIComponent(pageId)}`)
        .then(response => response.json())
        .then(data => {
            if (data && typeof data.count !== 'undefined') {
                countElement.textContent = `${data.count} Views`;
            }
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            countElement.textContent = '-- Views';
        });
}

// Theme Toggle Management
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
        updateProfileAvatar(theme);
    }

    function updateProfileAvatar(theme) {
        const avatarImg = document.querySelector('.avatar-img');
        if (avatarImg) {
            avatarImg.src = theme === 'light' 
                ? 'assets/tuhin_portfolio_pic_light.jpg' 
                : 'assets/tuhin_portfolio_pic_dark.jpg';
        }
    }
}

// Navigation & Hamburger Menu Toggle
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavigation() {
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
            navMenu.classList.add('overflow-hidden');
            navToggle.classList.add('overflow-visible');
        } else {
            navMenu.classList.remove('overflow-hidden');
            navToggle.classList.remove('overflow-visible');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    handleNavigation();
    window.addEventListener('resize', debounce(handleNavigation, 250));

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isActive = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetHref = link.getAttribute('href');
            if (targetHref.startsWith('#')) {
                e.preventDefault();
                const targetId = targetHref.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const isMobile = window.innerWidth <= 768;
                    const scrollDuration = isMobile ? 1200 : 800;
                    smoothScrollTo(targetElement, scrollDuration);
                }

                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (navToggle && navMenu && !navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    function smoothScrollTo(targetElement, duration) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
}

// Fade in animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.section, .project-card, .research-card, .education-card, .certification-card, .skill-category, .tech-item'
    );
    animatedElements.forEach(el => observer.observe(el));
}

// Back to Top Button creation & click registration
function initBackToTop() {
    backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', function () {
        const isMobile = window.innerWidth <= 768;
        const scrollDuration = isMobile ? 1200 : 800;
        
        let startPosition = window.pageYOffset;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, -startPosition, scrollDuration);
            window.scrollTo(0, run);
            if (timeElapsed < scrollDuration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    });
}

// Progress Bar
function initProgressBar() {
    if (!progressBarElement) {
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        document.body.appendChild(bar);
        progressBarElement = bar;
    }
}

// Lazy Loading images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Accessibility features
function initAccessibility() {
    document.addEventListener('keydown', function (e) {
        // Escape closes navigation drawer
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        }

        // Trigger clicks with space/enter for accessibility
        if (e.key === ' ' || e.key === 'Enter') {
            if (e.target.classList.contains('btn') || e.target.classList.contains('theme-toggle') || e.target.classList.contains('nav-toggle')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });

    // Mobile navigation focus trapping
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });

        navMenu.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                const navLinks = navMenu.querySelectorAll('.nav-link');
                if (navLinks.length > 0) {
                    const firstLink = navLinks[0];
                    const lastLink = navLinks[navLinks.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstLink) {
                            e.preventDefault();
                            lastLink.focus();
                        }
                    } else {
                        if (document.activeElement === lastLink) {
                            e.preventDefault();
                            firstLink.focus();
                        }
                    }
                }
            }
        });
    }
}

// Clipboard copying utility (Clipboard API only, cleaned)
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
            showNotification('Copied to clipboard!', 'success');
        }).catch(function () {
            showNotification('Failed to copy to clipboard', 'error');
        });
    } else {
        showNotification('Clipboard API not supported', 'error');
    }
}

// Dashboard-style Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-family: var(--font-mono, monospace);
        font-size: var(--font-size-sm, 14px);
        font-weight: 500;
        z-index: 10000;
        transform: translateY(150%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        background: ${type === 'success' ? 'var(--status-active, #16a34a)' : type === 'error' ? 'var(--status-error, #dc2626)' : 'var(--accent-primary, #f97316)'};
        border-left: 4px solid rgba(255,255,255,0.4);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        notification.style.transform = 'translateY(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            // Find footer version from "Env: Production-v1.6"
            const statusBarItems = document.querySelectorAll('.status-bar-footer .status-bar-item');
            let version = '1.0.5';
            statusBarItems.forEach(item => {
                if (item.textContent.includes('Env:')) {
                    const strongEl = item.querySelector('strong');
                    if (strongEl) {
                        const text = strongEl.textContent.trim();
                        const match = text.match(/v?(\d+\.\d+(?:\.\d+)?)/i);
                        if (match) {
                            version = match[1];
                        } else {
                            version = text.replace(/[^0-9.]/g, '');
                        }
                    }
                }
            });
            if (!version) {
                version = '1.0.0';
            }

            // Sync the app-version meta tag content
            const versionMeta = document.querySelector('meta[name="app-version"]');
            if (versionMeta) {
                versionMeta.setAttribute('content', version);
            }
            
            navigator.serviceWorker.register('/sw.js?v=' + version)
                .then(function (registration) {
                    console.log('ServiceWorker registered with version:', version);

                    // Detect updates to the service worker
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (installingWorker == null) return;
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('New content available, triggering controller claim update...');
                                }
                            }
                        };
                    };
                })
                .catch(function (error) {
                    console.error('ServiceWorker registration failed:', error);
                });
        });

        // Automatically reload page when a new service worker takes control
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Phone Masking & Toggle Logic
function initPhoneMask() {
    const phoneLink = document.getElementById('phone-number-link');
    const eyeToggleBtn = document.getElementById('phone-toggle-eye');
    const eyeIcon = document.getElementById('phone-eye-icon');

    if (!phoneLink || !eyeToggleBtn || !eyeIcon) return;

    // Dynamically construct phone parts so plain text number is absent from static HTML source
    const p1 = "98457";
    const p2 = "79355";
    const fullNumber = `+91 ${p1}${p2}`;
    const maskedNumber = `+91 ••••••••••`;
    const whatsappUrl = `https://wa.me/91${p1}${p2}`;

    let isRevealed = false;

    function togglePhone(show) {
        if (typeof show === 'boolean') {
            isRevealed = show;
        } else {
            isRevealed = !isRevealed;
        }

        if (isRevealed) {
            phoneLink.textContent = fullNumber;
            phoneLink.href = whatsappUrl;
            phoneLink.target = "_blank";
            eyeIcon.className = "fas fa-eye-slash";
            eyeToggleBtn.title = "Hide Mobile Number";
        } else {
            phoneLink.textContent = maskedNumber;
            phoneLink.href = "#";
            phoneLink.removeAttribute("target");
            eyeIcon.className = "fas fa-eye";
            eyeToggleBtn.title = "Show Mobile Number";
        }
    }

    eyeToggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePhone();
    });

    phoneLink.addEventListener('click', function (e) {
        if (!isRevealed) {
            e.preventDefault();
            togglePhone(true);
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }
    });
}