// Helper para leer parámetros de URL
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Sistema de Autenticación
const Auth = {
    // Credenciales mock (en producción esto vendría de backend)
    credentials: {
        email: 'admin@unet.edu.ve',
        password: 'admin123'
    },

    // Iniciar sesión
    login: function(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                email = (email || '').trim();
                password = (password || '').trim();
                console.log('Intento de login:', { email, password, expectedEmail: this.credentials.email, expectedPassword: this.credentials.password });
                if (email === this.credentials.email && password === this.credentials.password) {
                    const session = {
                        email: email,
                        loginTime: new Date().toISOString(),
                        isAuthenticated: true
                    };
                    Storage.set('adminSession', session);
                    console.log('Login exitoso:', session);
                    resolve(session);
                } else {
                    console.log('Login fallido: credenciales incorrectas');
                    reject(new Error('Credenciales inválidas'));
                }
            }, 1000);
        });
    },

    // Cerrar sesión
    logout: function() {
        Storage.remove('adminSession');
        Navigation.redirect('../index.html');
    },

    // Verificar si está autenticado
    isAuthenticated: function() {
        const session = Storage.get('adminSession');
        return session && session.isAuthenticated;
    },

    // Obtener sesión actual
    getSession: function() {
        return Storage.get('adminSession');
    }
};

// Inicialización de login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        // Pre-llenar desde parámetros de URL
        const urlEmail = getQueryParam('email');
        const urlPassword = getQueryParam('password');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (urlEmail && emailInput) {
            emailInput.value = decodeURIComponent(urlEmail);
        }
        if (urlPassword && passwordInput) {
            passwordInput.value = decodeURIComponent(urlPassword);
        }

        // Si ambos parámetros están presentes, enviar automáticamente
        if (urlEmail && urlPassword) {
            setTimeout(() => {
                loginForm.dispatchEvent(new Event('submit'));
            }, 500);
        }

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btnLogin = document.getElementById('btnLogin');
            
            // Mostrar loading
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            
            try {
                await Auth.login(email, password);
                Utils.showLoading();
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } catch (error) {
                alert('Error: ' + error.message);
                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
            }
        });
    }
});
