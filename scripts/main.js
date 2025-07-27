// Main JavaScript for Portfolio Website

// Error handling wrapper
function safeExecute(fn, name) {
    try {
        fn();
    } catch (error) {
        console.error(`Error in ${name}:`, error);
        // Continue execution even if one function fails
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality with error handling
    safeExecute(initThemeToggle, 'Theme Toggle');
    safeExecute(initNavigation, 'Navigation');
    safeExecute(initScrollEffects, 'Scroll Effects');
    safeExecute(initAnimations, 'Animations');
    safeExecute(initBackToTop, 'Back to Top');
    safeExecute(initProgressBar, 'Progress Bar');
    safeExecute(initLazyLoading, 'Lazy Loading');
    safeExecute(initAccessibility, 'Accessibility');
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Performance:', {
                        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms',
                        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
                        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms'
                    });
                }
            }, 0);
        });
    }
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
    }
}

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Dynamic overflow detection for tablets and desktops
    function checkNavigationOverflow() {
        const isTabletOrDesktop = window.innerWidth >= 768;
        const isLaptopOrDesktop = window.innerWidth >= 992; // Laptop and above should always show inline
        
        console.log('Screen size check:', {
            windowWidth: window.innerWidth,
            isTabletOrDesktop,
            isLaptopOrDesktop
        });
        
        // Get all required elements with null checks - re-query to ensure they exist
        const navMenu = document.getElementById('nav-menu');
        const navSocial = document.querySelector('.nav-social');
        const navSeparator = document.querySelector('.nav-separator');
        const themeToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-toggle');
        
        // Ensure all critical elements are present before proceeding
        if (!navMenu || !navSocial || !themeToggle || !navToggle) {
            console.warn('Navigation elements not found, skipping overflow check and ensuring hamburger menu is visible.');
            // Fallback: if elements are missing, ensure hamburger is visible to prevent broken UI
            if (navMenu) navMenu.classList.add('overflow-hidden');
            if (navToggle) navToggle.classList.add('overflow-visible');
            return;
        }
        
        if (isLaptopOrDesktop) {
            // Laptop and desktop (992px+) should always show inline navigation
            console.log('Laptop/Desktop detected - forcing inline navigation');
            navMenu.classList.remove('overflow-hidden');
            navToggle.classList.remove('overflow-visible');
        } else if (isTabletOrDesktop) {
            // Tablet (768px-991px) - check for overflow
            const navContainer = navMenu.parentElement;
            if (!navContainer) {
                console.warn('Navigation container not found, skipping tablet overflow check.');
                // Fallback for tablet if container is missing
                navMenu.classList.add('overflow-hidden');
                navToggle.classList.add('overflow-visible');
                return;
            }
            
            const navMenuWidth = navMenu.scrollWidth;
            const navContainerWidth = navContainer.offsetWidth;
            const navSocialWidth = navSocial.offsetWidth;
            const separatorWidth = navSeparator ? navSeparator.offsetWidth : 0; // Handle missing separator
            const themeToggleWidth = themeToggle.offsetWidth;
            const navToggleWidth = navToggle.offsetWidth;
            
            // Calculate available space for navigation menu with reasonable margins
            const paddingMargin = 20; // Reduced from 60px for more accurate detection
            const availableWidth = navContainerWidth - navSocialWidth - separatorWidth - themeToggleWidth - navToggleWidth - paddingMargin;
            
            // Add a small buffer to prevent edge cases
            const buffer = 5; // Reduced buffer
            
            console.log('Navigation overflow check:', {
                navMenuWidth,
                navContainerWidth,
                navSocialWidth,
                separatorWidth,
                themeToggleWidth,
                navToggleWidth,
                paddingMargin,
                availableWidth,
                buffer,
                isOverflowing: navMenuWidth > (availableWidth - buffer)
            });
            
            if (navMenuWidth > (availableWidth - buffer)) { // Used buffer
                // Overflow detected - show hamburger menu
                console.log('Overflow detected - showing hamburger menu');
                navMenu.classList.add('overflow-hidden');
                navToggle.classList.add('overflow-visible');
            } else {
                // No overflow - show inline menu
                console.log('No overflow - showing inline menu');
                navMenu.classList.remove('overflow-hidden');
                navToggle.classList.remove('overflow-visible');
            }
        } else {
            // Mobile - always show hamburger menu
            console.log('Mobile detected - forcing hamburger menu');
            navMenu.classList.add('overflow-hidden');
            navToggle.classList.add('overflow-visible');
        }
    }
    
    // Check overflow on load and resize with a more robust approach
    function initializeOverflowCheck() {
        // Check if all required elements exist before proceeding
        const navMenu = document.getElementById('nav-menu');
        const navSocial = document.querySelector('.nav-social');
        const themeToggle = document.getElementById('theme-toggle');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navSocial && themeToggle && navToggle) {
            try {
                checkNavigationOverflow();
            } catch (error) {
                console.warn('Error during overflow check:', error);
                // Fallback to hamburger menu if overflow check fails
                navMenu.classList.add('overflow-hidden');
                navToggle.classList.add('overflow-visible');
            }
        } else {
            // If elements aren't ready, try again after a short delay
            setTimeout(initializeOverflowCheck, 50);
        }
    }
    
    // Initialize overflow check with retry mechanism and error handling
    initializeOverflowCheck();
    window.addEventListener('resize', debounce(function() {
        try {
            checkNavigationOverflow();
        } catch (error) {
            console.warn('Error during resize overflow check:', error);
        }
    }, 250));
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Custom smooth scroll for mobile devices
                const isMobile = window.innerWidth <= 768;
                const scrollDuration = isMobile ? 1500 : 800; // Slower on mobile
                
                smoothScrollTo(targetElement, scrollDuration);
            }
            
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Custom smooth scroll function
    function smoothScrollTo(targetElement, duration) {
        const targetPosition = targetElement.offsetTop - 80; // Account for fixed navbar
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
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionBottom = sectionTop + targetSection.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'var(--nav-bg)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.section, .project-card, .research-card, .education-card, .certification-card, .skill-category, .tech-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const footerHeight = 120; // Increased to account for footer padding and button height
        
        // Show button when scrolled down more than 300px
        if (scrollTop > 300) {
            backToTop.classList.add('show');
            
            // Check if we're near the footer
            const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
            
            if (distanceFromBottom < footerHeight) {
                // Near footer - adjust position to stay above footer
                const buttonHeight = 50; // Height of the button
                const buttonMargin = 30; // Bottom margin of the button
                const newBottom = Math.max(buttonMargin, footerHeight - distanceFromBottom + buttonHeight + buttonMargin);
                backToTop.style.bottom = newBottom + 'px';
            } else {
                // Not near footer - reset to normal position
                backToTop.style.bottom = '30px';
            }
        } else {
            backToTop.classList.remove('show');
            backToTop.style.bottom = '30px'; // Reset position when hidden
        }
    });
    
    backToTop.addEventListener('click', function() {
        const isMobile = window.innerWidth <= 768;
        const scrollDuration = isMobile ? 1500 : 800; // Slower on mobile
        
        smoothScrollToTop(scrollDuration);
    });
    
    // Custom smooth scroll to top function
    function smoothScrollToTop(duration) {
        const startPosition = window.pageYOffset;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, -startPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
}

// Progress Bar
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
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

// Accessibility Features
function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
        
        // Space/Enter key for buttons
        if (e.key === ' ' || e.key === 'Enter') {
            if (e.target.classList.contains('btn') || e.target.classList.contains('theme-toggle')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
    
    // Focus management for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            // Focus first nav link when menu opens
            const firstNavLink = navMenu.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }
    });
    
    // Trap focus in mobile menu
    navMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const navLinks = navMenu.querySelectorAll('.nav-link');
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
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Check if images are loaded
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', function() {
                loadedImages++;
                if (loadedImages === images.length) {
                    console.log('All images loaded');
                }
            });
        }
    });
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Copy to Clipboard Functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied to clipboard!', 'success');
        }).catch(function() {
            showNotification('Failed to copy to clipboard', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy to clipboard', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Performance optimization functions
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" to images below the fold
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
}

function optimizeFonts() {
    // Preload critical fonts
    if ('fonts' in document) {
        document.fonts.ready.then(function() {
            console.log('Fonts loaded successfully');
        });
    }
}

function optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    
    function updateAnimations() {
        // Update any animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Throttle scroll events
    window.addEventListener('scroll', function() {
        requestTick();
    }, { passive: true });
}

// Initialize optimizations
document.addEventListener('DOMContentLoaded', function() {
    safeExecute(optimizeImages, 'Image Optimization');
    safeExecute(optimizeFonts, 'Font Optimization');
    safeExecute(optimizeAnimations, 'Animation Optimization');
});

// Export functions for global use
window.portfolioUtils = {
    copyToClipboard,
    showNotification,
    optimizeImages,
    optimizeFonts,
    optimizeAnimations
}; 