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
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
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
