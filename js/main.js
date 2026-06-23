// Funciones utilitarias
const Utils = {
    // Mostrar loading overlay
    showLoading: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },

    // Ocultar loading overlay
    hideLoading: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },

    // Simular delay
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Generar código OTP
    generateOTP: function() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Validar email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar cédula venezolana
    isValidCedula: function(cedula) {
        const cedulaRegex = /^[VE]-?\d{7,10}$/i;
        return cedulaRegex.test(cedula);
    },

    // Validar teléfono
    isValidPhone: function(phone) {
        const phoneRegex = /^\+?\d{10,15}$/;
        return phoneRegex.test(phone);
    }
};

// Manejo de localStorage
const Storage = {
    // Guardar datos
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    // Obtener datos
    get: function(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    // Eliminar datos
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    // Limpiar todos los datos
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Navegación
const Navigation = {
    // Redirigir con delay
    redirectWithDelay: function(url, delay = 1000) {
        Utils.showLoading();
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    },

    // Redirigir inmediato
    redirect: function(url) {
        window.location.href = url;
    },

    // Leer parámetro de URL
    getQueryParam: function(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }
};

// Manejo de tema (claro/oscuro)
const Theme = {
    STORAGE_KEY: 'unet-theme',

    init: function() {
        this.applySavedTheme();
        this.createToggle();
        this.listenSystem();
    },

    applySavedTheme: function() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    },

    isDark: function() {
        return document.body.classList.contains('dark');
    },

    toggle: function() {
        document.body.classList.toggle('dark');
        const theme = this.isDark() ? 'dark' : 'light';
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.updateToggleIcon();
    },

    createToggle: function() {
        if (document.getElementById('themeToggle')) return;

        const actions = document.querySelector('.header-actions');
        const header = document.querySelector('.header .nav, .header-container');
        if (!actions && !header) return;

        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.className = 'theme-toggle';
        btn.setAttribute('type', 'button');
        btn.innerHTML = '<i class="fas fa-moon"></i><span class="theme-toggle-text">Modo oscuro</span>';
        btn.addEventListener('click', () => this.toggle());

        if (actions) {
            actions.appendChild(btn);
        } else {
            const dashboardUser = header.querySelector('.dashboard-user');
            if (dashboardUser) {
                header.insertBefore(btn, dashboardUser);
            } else {
                header.appendChild(btn);
            }
        }
        this.updateToggleIcon();
    },

    updateToggleIcon: function() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (!icon) return;
        const text = btn.querySelector('.theme-toggle-text');
        if (this.isDark()) {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Modo claro';
            btn.setAttribute('aria-label', 'Cambiar a modo claro');
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Modo oscuro';
            btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
        }
    },

    listenSystem: function() {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                document.body.classList.toggle('dark', e.matches);
                this.updateToggleIcon();
            }
        });
    }
};

// Layout: navbar responsive y agrupación de acciones
const Layout = {
    init: function() {
        this.setupHeaderActions();
        this.setupMobileNav();
        this.moveThemeToggle();

        const media = window.matchMedia('(max-width: 768px)');
        media.addEventListener('change', () => this.moveThemeToggle());
    },

    setupHeaderActions: function() {
        const header = document.querySelector('.header');
        if (!header) return;
        const container = header.querySelector('.header-container');
        if (!container) return;

        let actions = container.querySelector('.header-actions');
        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'header-actions';
            container.appendChild(actions);
        }

        const toggle = document.getElementById('themeToggle');
        if (toggle && toggle.parentElement !== actions) {
            actions.appendChild(toggle);
        }
    },

    setupMobileNav: function() {
        const header = document.querySelector('.header');
        if (!header) return;
        const actions = header.querySelector('.header-actions');
        const nav = header.querySelector('.nav');
        if (!actions || !nav) return;
        if (header.querySelector('.hamburger')) return;

        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('type', 'button');
        hamburger.setAttribute('aria-label', 'Abrir menú');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';

        const updateMenu = (open) => {
            nav.classList.toggle('nav-open', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
            hamburger.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
        };

        hamburger.addEventListener('click', () => updateMenu(!nav.classList.contains('nav-open')));

        nav.querySelectorAll('.nav-link, .btn-back, .btn-login').forEach(link => {
            link.addEventListener('click', () => updateMenu(false));
        });

        const toggle = actions.querySelector('#themeToggle');
        if (toggle) {
            actions.insertBefore(hamburger, toggle);
        } else {
            actions.appendChild(hamburger);
        }
    },

    moveThemeToggle: function() {
        const header = document.querySelector('.header');
        if (!header) return;
        const toggle = document.getElementById('themeToggle');
        const nav = header.querySelector('.nav');
        const actions = header.querySelector('.header-actions');
        if (!toggle || !nav || !actions) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            if (toggle.parentElement !== nav) {
                nav.appendChild(toggle);
            }
        } else {
            if (toggle.parentElement !== actions) {
                actions.appendChild(toggle);
            }
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    Layout.init();
    Theme.init();
    // Botón Login Admin en landing page
    const btnLoginAdmin = document.getElementById('btnLoginAdmin');
    if (btnLoginAdmin) {
        btnLoginAdmin.addEventListener('click', function() {
            Utils.showLoading();
            setTimeout(() => {
                window.location.href = 'admin/login.html';
            }, 1000);
        });
    }

    // Verificar si hay sesión admin activa
    const adminSession = Storage.get('adminSession');
    if (adminSession && window.location.pathname.includes('admin/login.html')) {
        // Si ya está logueado, redirigir al dashboard
        Navigation.redirect('dashboard.html');
    }
});
