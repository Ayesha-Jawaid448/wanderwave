document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar & Active Link Update
    const navbar = document.querySelector('.navbar-custom');
    
    if (navbar) {
        // Initial check on load
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 2. Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const flexObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Run once to keep it visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => flexObserver.observe(el));

    // setActiveLink helper
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });

    // 3. Form Validation Logic (Login / Signup)
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.getElementById(inputId + 'Error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        if (input) {
            input.style.borderBottomColor = '#ff6b6b';
        }
    }

    function clearErrors() {
        const errorDivs = document.querySelectorAll('.error-message');
        errorDivs.forEach(div => div.style.display = 'none');
        const inputs = document.querySelectorAll('.form-control-custom');
        inputs.forEach(input => input.style.borderBottomColor = 'rgba(255,255,255,0.4)');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            let isValid = true;

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email format');
                isValid = false;
            }

            if (!password) {
                showError('password', 'Password is required');
                isValid = false;
            }

            if (isValid) {
                // Simulate login redirect
                const btn = loginForm.querySelector('button[type="submit"]');
                const orgText = btn.textContent;
                btn.textContent = 'Logging in...';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            let isValid = true;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!name) {
                showError('name', 'Full Name is required');
                isValid = false;
            }

            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email format');
                isValid = false;
            }

            if (!password) {
                showError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }

            if (isValid) {
                // Simulate signup redirect
                const btn = signupForm.querySelector('button[type="submit"]');
                const orgText = btn.textContent;
                btn.textContent = 'Creating Account...';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 800);
            }
        });
    }
});
