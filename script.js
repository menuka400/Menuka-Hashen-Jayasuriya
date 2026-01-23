// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    }
});

// Skill Bar Animation on Scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Animate elements on scroll
const fadeInOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, fadeInOptions);

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(section);
});

// Project Card Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const statusDiv = document.getElementById('form-status');
        
        // Replace this URL with your Google Apps Script web app URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyuhnD42BhJjLYoBvOVTkD_LbJlWwPMQYNRfWOEsNAgOlPqYUAawp-s61k4pKbx2LHrwA/exec';
        
        // Show sending status
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Sending message...';
        statusDiv.style.color = '#00d4ff';
        
        // Create form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
        
        // Send data to Google Apps Script using no-cors mode
        fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            statusDiv.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
            statusDiv.style.color = '#00d4ff';
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            statusDiv.textContent = 'Sorry, there was an error sending your message. Please try again or email directly.';
            statusDiv.style.color = '#ff006e';
        });
    });
}

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 50);
    }
});

// Add cursor follower effect (optional)
const cursor = document.createElement('div');
cursor.classList.add('cursor-follower');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add particle effect to hero section
function createParticle() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add CSS for cursor follower and particles dynamically
const style = document.createElement('style');
style.textContent = `
    .cursor-follower {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: 0.1s;
        transform: translate(-50%, -50%);
    }
    
    .particle {
        position: absolute;
        bottom: 0;
        width: 4px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 50%;
        animation: rise 5s linear;
        opacity: 0;
    }
    
    @keyframes rise {
        0% {
            bottom: 0;
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            bottom: 100%;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.style.color = 'var(--primary-color)';
        } else if (navLink) {
            navLink.style.color = 'var(--text-secondary)';
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    highlightNavigation();
    
    // Add load animation to hero section
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroText.style.transition = 'opacity 1s ease, transform 1s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 300);
    }
});
