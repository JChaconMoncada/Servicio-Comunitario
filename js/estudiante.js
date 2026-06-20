// Lógica del flujo de estudiantes
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('formulario.html')) {
        initFormulario();
    } else if (currentPath.includes('verificacion.html')) {
        initVerificacion();
    } else if (currentPath.includes('materias.html')) {
        initMaterias();
    }
});

// Inicializar formulario
function initFormulario() {
    // Verificar si las inscripciones están habilitadas
    const inscripcionesHabilitadas = DataManager.getInscripcionesState();
    const systemAlert = document.getElementById('systemAlert');
    
    if (!inscripcionesHabilitadas) {
        if (systemAlert) {
            systemAlert.style.display = 'block';
        }
        document.getElementById('studentForm').style.display = 'none';
        return;
    }

    // Verificar si ya hay datos del estudiante
    const existingData = DataManager.getStudentData();
    if (existingData) {
        // Si ya está verificado, redirigir a materias
        if (DataManager.isStudentVerified()) {
            Navigation.redirect('materias.html');
            return;
        }
        // Si no está verificado, redirigir a verificación
        Navigation.redirect('verificacion.html');
        return;
    }

    // Manejar envío del formulario
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const semestre = document.getElementById('semestre').value;
    
    // Validaciones
    if (!Utils.isValidCedula(cedula)) {
        alert('Por favor, ingresa una cédula válida (formato: V-12345678 o E-12345678)');
        return;
    }
    
    if (!Utils.isValidEmail(email)) {
        alert('Por favor, ingresa un correo válido');
        return;
    }
    
    if (!email.toLowerCase().includes('@unet.edu.ve')) {
        alert('El correo debe ser institucional (@unet.edu.ve)');
        return;
    }
    
    if (!Utils.isValidPhone(telefono)) {
        alert('Por favor, ingresa un teléfono válido');
        return;
    }
    
    if (!semestre) {
        alert('Por favor, selecciona tu semestre');
        return;
    }
    
    // Mostrar loading
    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    // Simular validación con API (mock)
    await Utils.delay(1500);
    
    // Guardar datos del estudiante
    const studentData = {
        cedula,
        nombre,
        telefono,
        email,
        semestre
    };
    
    DataManager.saveStudentData(studentData);
    
    // Generar y guardar OTP
    const otp = Utils.generateOTP();
    DataManager.saveStudentOTP(otp);
    
    console.log('OTP generado (para testing):', otp);
    alert(`Código de verificación enviado a ${email}. Para testing, el código es: ${otp}`);
    
    // Redirigir a verificación
    Navigation.redirect('verificacion.html');
}

// Inicializar verificación
function initVerificacion() {
    // Verificar si hay datos del estudiante
    const studentData = DataManager.getStudentData();
    if (!studentData) {
        Navigation.redirect('formulario.html');
        return;
    }
    
    // Si ya está verificado, redirigir a materias
    if (DataManager.isStudentVerified()) {
        Navigation.redirect('materias.html');
        return;
    }
    
    // Mostrar email del estudiante
    const emailElement = document.getElementById('studentEmail');
    if (emailElement) {
        emailElement.textContent = studentData.email;
    }
    
    // Configurar inputs OTP
    setupOTPInputs();
    
    // Manejar formulario de verificación
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPVerification);
    }
    
    // Configurar reenvío
    setupResend();
}

// Configurar inputs OTP
function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-digit');
    
    inputs.forEach((input, index) => {
        // Auto-focus siguiente input
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        
        // Manejar backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        // Solo permitir números
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
}

// Manejar verificación OTP
async function handleOTPVerification(e) {
    e.preventDefault();
    
    const inputs = document.querySelectorAll('.otp-digit');
    let otp = '';
    inputs.forEach(input => {
        otp += input.value;
    });
    
    if (otp.length !== 6) {
        alert('Por favor, ingresa el código completo de 6 dígitos');
        return;
    }
    
    // Mostrar loading
    const btnVerify = document.getElementById('btnVerify');
    btnVerify.disabled = true;
    btnVerify.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    
    await Utils.delay(1000);
    
    // Verificar OTP
    const storedOTP = DataManager.getStudentOTP();
    if (otp === storedOTP) {
        // Marcar como verificado
        DataManager.saveStudentVerified(true);
        
        Utils.showLoading();
        setTimeout(() => {
            Navigation.redirect('materias.html');
        }, 1000);
    } else {
        alert('Código incorrecto. Por favor, intenta nuevamente.');
        btnVerify.disabled = false;
        btnVerify.innerHTML = '<i class="fas fa-check"></i> Verificar Código';
        
        // Limpiar inputs
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
    }
}

// Configurar reenvío de OTP
function setupResend() {
    const resendBtn = document.getElementById('resendBtn');
    const resendTimer = document.getElementById('resendTimer');
    const resendLink = document.getElementById('resendLink');
    
    if (!resendBtn) return;
    
    let countdown = 60;
    let timerInterval;
    
    function startTimer() {
        resendBtn.style.display = 'none';
        resendTimer.style.display = 'inline';
        resendLink.classList.add('disabled');
        
        timerInterval = setInterval(() => {
            countdown--;
            resendTimer.textContent = ` (${countdown}s)`;
            
            if (countdown <= 0) {
                clearInterval(timerInterval);
                resendBtn.style.display = 'inline';
                resendTimer.style.display = 'none';
                resendLink.classList.remove('disabled');
                countdown = 60;
            }
        }, 1000);
    }
    
    // Iniciar timer al cargar
    startTimer();
    
    // Manejar clic en reenviar
    resendBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const studentData = DataManager.getStudentData();
        if (!studentData) {
            alert('Error: No hay datos del estudiante');
            return;
        }
        
        // Generar nuevo OTP
        const newOTP = Utils.generateOTP();
        DataManager.saveStudentOTP(newOTP);
        
        console.log('Nuevo OTP generado (para testing):', newOTP);
        alert(`Nuevo código enviado a ${studentData.email}. Para testing, el código es: ${newOTP}`);
        
        // Reiniciar timer
        clearInterval(timerInterval);
        startTimer();
    });
}

// Inicializar selección de materias
function initMaterias() {
    // Verificar si el estudiante está verificado
    if (!DataManager.isStudentVerified()) {
        Navigation.redirect('formulario.html');
        return;
    }
    
    // Verificar si las inscripciones están habilitadas
    if (!DataManager.getInscripcionesState()) {
        alert('Las inscripciones están deshabilitadas. Contacta a administración.');
        Navigation.redirect('../index.html');
        return;
    }
    
    // Mostrar datos del estudiante
    const studentData = DataManager.getStudentData();
    if (studentData) {
        if (document.getElementById('studentName')) {
            document.getElementById('studentName').textContent = studentData.nombre;
        }
        if (document.getElementById('studentCedula')) {
            document.getElementById('studentCedula').textContent = studentData.cedula;
        }
        if (document.getElementById('studentSemestre')) {
            const semestreNum = parseInt(studentData.semestre);
            const semestreText = semestreNum === 1 ? '1er' : 
                               semestreNum === 2 ? '2do' : 
                               semestreNum === 3 ? '3er' : 
                               semestreNum + 'o';
            document.getElementById('studentSemestre').textContent = semestreText + ' Semestre';
        }
    }
    
    // Cargar materias disponibles
    loadMaterias();
    
    // Manejar confirmación
    const btnConfirm = document.getElementById('btnConfirm');
    if (btnConfirm) {
        btnConfirm.addEventListener('click', handleConfirmInscription);
    }
}

// Filtrar materias por semestre (lógica de prerrequisitos)
function filterMateriasBySemestre(materias, semestre) {
    // Lógica simple: Matemática I para semestre 1-2, II para 3-4, III para 5-6, IV para 7-8
    return materias.filter(materia => {
        if (materia.nombre.includes('I') && !materia.nombre.includes('II') && !materia.nombre.includes('III') && !materia.nombre.includes('IV')) {
            return semestre <= 2;
        } else if (materia.nombre.includes('II') && !materia.nombre.includes('III') && !materia.nombre.includes('IV')) {
            return semestre >= 2 && semestre <= 4;
        } else if (materia.nombre.includes('III') && !materia.nombre.includes('IV')) {
            return semestre >= 4 && semestre <= 6;
        } else if (materia.nombre.includes('IV')) {
            return semestre >= 6;
        }
        return true;
    });
}

// Cargar materias disponibles
function loadMaterias() {
    const materias = DataManager.getMaterias();
    const studentData = DataManager.getStudentData();
    const grid = document.getElementById('materiasGrid');
    
    if (!grid) return;
    
    if (materias.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>No hay materias disponibles en este momento.</p>
            </div>
        `;
        return;
    }
    
    // Filtrar materias según semestre (lógica de prerrequisitos)
    const semestre = parseInt(studentData.semestre);
    const materiasFiltradas = filterMateriasBySemestre(materias, semestre);
    
    if (materiasFiltradas.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-info-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>No hay materias disponibles para tu semestre actual. Contacta al departamento de matemática para más información.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    materiasFiltradas.forEach(materia => {
        html += `
            <div class="materia-card" data-materia-id="${materia.id}">
                <div class="materia-card-header">
                    <h3>${materia.nombre}</h3>
                    <span class="badge">${materia.secciones.length} secciones</span>
                </div>
                <div class="seccion-list">
                    ${materia.secciones.map(seccion => `
                        <div class="seccion-item" data-seccion-id="${seccion.id}">
                            <div class="seccion-header">
                                <h4>Sección ${seccion.seccion}</h4>
                            </div>
                            <div class="seccion-info">
                                <p><i class="fas fa-user"></i> ${seccion.profesor}</p>
                                <p><i class="fas fa-clock"></i> ${seccion.horario}</p>
                                <p><i class="fas fa-users"></i> Cupo: ${seccion.cupo}</p>
                            </div>
                            <div class="seccion-select">
                                <input type="radio" name="materia-${materia.id}" value="${seccion.id}" data-materia="${materia.nombre}" data-seccion="${seccion.seccion}" data-profesor="${seccion.profesor}" data-horario="${seccion.horario}">
                                <label>Seleccionar esta sección</label>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    // Agregar event listeners a los radio buttons
    const radioButtons = grid.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateSelectionSummary);
    });
}

// Actualizar resumen de selección
function updateSelectionSummary() {
    const selected = [];
    const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    
    radioButtons.forEach(radio => {
        selected.push({
            materia: radio.dataset.materia,
            seccion: radio.dataset.seccion,
            profesor: radio.dataset.profesor,
            horario: radio.dataset.horario
        });
    });
    
    const summaryList = document.getElementById('summaryList');
    const btnConfirm = document.getElementById('btnConfirm');
    
    if (selected.length === 0) {
        summaryList.innerHTML = '<li style="color: var(--text-muted); text-align: center;">No has seleccionado ninguna materia</li>';
        btnConfirm.disabled = true;
    } else {
        let html = '';
        selected.forEach(item => {
            html += `
                <li>
                    <span><i class="fas fa-check-circle"></i> ${item.materia} - Sección ${item.seccion}</span>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">${item.horario}</span>
                </li>
            `;
        });
        summaryList.innerHTML = html;
        btnConfirm.disabled = false;
    }
    
    // Guardar selección
    DataManager.saveStudentSelection(selected);
}

// Manejar confirmación de inscripción
async function handleConfirmInscription() {
    const selection = DataManager.getStudentSelection();
    const studentData = DataManager.getStudentData();
    
    if (selection.length === 0) {
        alert('Por favor, selecciona al menos una materia');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que deseas inscribir ${selection.length} materia(s)? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    // Mostrar loading
    const btnConfirm = document.getElementById('btnConfirm');
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando inscripción...';
    
    Utils.showLoading();
    
    // Simular procesamiento
    await Utils.delay(2000);
    
    // Guardar inscripción completa
    const inscripcion = {
        ...studentData,
        materias: selection,
        fecha: new Date().toISOString(),
        estado: 'completado'
    };
    
    DataManager.saveInscripcion(inscripcion);
    
    // Limpiar datos temporales
    DataManager.clearStudentData();
    
    Utils.hideLoading();
    
    // Mostrar éxito
    showSuccessPage(inscripcion);
}

// Mostrar página de éxito
function showSuccessPage(inscripcion) {
    const materiasSection = document.querySelector('.materias-section');
    
    if (materiasSection) {
        materiasSection.innerHTML = `
            <div class="success-section">
                <div class="success-card">
                    <i class="fas fa-check-circle"></i>
                    <h1>¡Inscripción Exitosa!</h1>
                    <p>Tu inscripción ha sido procesada correctamente. A continuación encontrarás el resumen de tu inscripción.</p>
                    
                    <div class="success-details">
                        <p><strong>Estudiante:</strong> ${inscripcion.nombre}</p>
                        <p><strong>Cédula:</strong> ${inscripcion.cedula}</p>
                        <p><strong>Correo:</strong> ${inscripcion.email}</p>
                        <p><strong>Fecha:</strong> ${new Date(inscripcion.fecha).toLocaleString()}</p>
                        <hr style="margin: 15px 0; border: none; border-top: 1px solid var(--border-color);">
                        <p><strong>Materias inscritas:</strong></p>
                        ${inscripcion.materias.map(m => `
                            <p style="margin-left: 20px;">• ${m.materia} - Sección ${m.seccion} (${m.horario})</p>
                        `).join('')}
                    </div>
                    
                    <a href="../index.html" class="btn btn-primary">
                        <i class="fas fa-home"></i>
                        Volver al Inicio
                    </a>
                </div>
            </div>
        `;
    }
}
