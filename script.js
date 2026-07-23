/**
 * THE INTELLIGENT MACHINE - JS Logic
 */

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark for tech aesthetic
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// --- Mobile Navigation ---
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');

if (burger) {
    burger.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
        }
    });
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
    });
});

// --- Intersection Observer for Reveal Animations ---
const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal-up').forEach(el => {
    revealObserver.observe(el);
});

// --- Projects Navigation (arrows + keyboard + centered highlight) ---
// Note: page scroll now works normally even when the cursor is over a
// project card — there is no wheel hijack here anymore.
const projectsContainer = document.querySelector('.projects-scroll-container');
const projectPanels = document.querySelectorAll('.project-panel');
const arrowLeft = document.querySelector('.project-arrow-left');
const arrowRight = document.querySelector('.project-arrow-right');

if (projectsContainer && projectPanels.length) {
    // Give every project panel a detection-style reticle (corner brackets +
    // tracking tag), mirroring the bounding boxes his CV models draw.
    projectPanels.forEach(panel => {
        const corners = ['tl', 'tr', 'bl', 'br'].map(pos => {
            const el = document.createElement('span');
            el.className = `reticle-corner ${pos}`;
            return el;
        });
        const tag = document.createElement('span');
        tag.className = 'reticle-tag';
        tag.textContent = '// TRACKING';
        panel.append(...corners, tag);
    });

    const scrollByPanel = (direction) => {
        const gap = 32; // matches the 2rem gap between panels in CSS
        const amount = projectPanels[0].offsetWidth + gap;
        projectsContainer.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    if (arrowLeft) arrowLeft.addEventListener('click', () => scrollByPanel(-1));
    if (arrowRight) arrowRight.addEventListener('click', () => scrollByPanel(1));

    // Only let left/right arrow keys navigate projects while that section is on screen
    let projectsInView = false;
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const projectsVisibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { projectsInView = entry.isIntersecting; });
        }, { threshold: 0.3 });
        projectsVisibilityObserver.observe(projectsSection);
    }

    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
        if (!projectsInView) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollByPanel(1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollByPanel(-1);
        }
    });

    // Highlight whichever panel is closest to the center of the container
    // (scale + border, deliberately no glow/box-shadow effect)
    const updateActivePanel = () => {
        const containerRect = projectsContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestPanel = null;
        let closestDistance = Infinity;

        projectPanels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const panelCenter = rect.left + rect.width / 2;
            const distance = Math.abs(panelCenter - containerCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPanel = panel;
            }
        });

        projectPanels.forEach(panel => panel.classList.remove('is-active'));
        if (closestPanel) closestPanel.classList.add('is-active');
    };

    let scrollTicking = false;
    projectsContainer.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateActivePanel();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    window.addEventListener('resize', updateActivePanel);
    updateActivePanel();
}

// --- Contact Form Submission ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const statusDiv = document.getElementById('form-status');

        const scriptURL = 'https://script.google.com/macros/s/AKfycbyuhnD42BhJjLYoBvOVTkD_LbJlWwPMQYNRfWOEsNAgOlPqYUAawp-s61k4pKbx2LHrwA/exec';

        statusDiv.style.display = 'block';
        statusDiv.textContent = 'TRANSMITTING...';
        statusDiv.style.color = 'var(--accent-main)';

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', 'Portfolio Contact'); // Static subject since we removed it to keep it brutalist
        formData.append('message', message);

        fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                statusDiv.textContent = `TRANSMISSION SUCCESSFUL. CONFIRMATION SENT TO ${email.toUpperCase()}.`;
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.textContent = 'TRANSMISSION FAILED. PLEASE USE DIRECT EMAIL.';
                statusDiv.style.color = '#ef4444';
            });
    });
}
