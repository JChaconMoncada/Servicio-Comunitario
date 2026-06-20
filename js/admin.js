// Lógica del Dashboard Admin
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        Navigation.redirect('login.html');
        return;
    }

    // Mostrar email del admin
    const session = Auth.getSession();
    if (session && document.getElementById('adminEmail')) {
        document.getElementById('adminEmail').textContent = session.email;
    }

    // Botón logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                Auth.logout();
            }
        });
    }

    // Toggle de inscripciones
    const toggleInscripciones = document.getElementById('toggleInscripciones');
    if (toggleInscripciones) {
        const currentState = DataManager.getInscripcionesState();
        toggleInscripciones.checked = currentState;
        updateSystemStatus(currentState);

        toggleInscripciones.addEventListener('change', function() {
            const newState = this.checked;
            DataManager.saveInscripcionesState(newState);
            updateSystemStatus(newState);
            
            if (newState) {
                alert('Inscripciones habilitadas. Los estudiantes ahora pueden acceder al formulario.');
            } else {
                alert('Inscripciones deshabilitadas. Los estudiantes no podrán acceder al formulario.');
            }
        });
    }

    // Cargar estadísticas
    updateStats();

    // Cargar vista previa de materias
    loadMateriasPreview();

    // Cargar inscripciones recientes
    loadRecentInscriptions();

    // Manejo de archivo Excel
    setupFileUpload();
});

function updateSystemStatus(enabled) {
    const statusElement = document.getElementById('systemStatus');
    if (statusElement) {
        statusElement.textContent = enabled ? 'Habilitado' : 'Deshabilitado';
        statusElement.style.color = enabled ? 'var(--success-color)' : 'var(--danger-color)';
    }
}

function updateStats() {
    const stats = DataManager.getStats();
    
    if (document.getElementById('totalStudents')) {
        document.getElementById('totalStudents').textContent = stats.totalStudents;
    }
    if (document.getElementById('totalSubjects')) {
        document.getElementById('totalSubjects').textContent = stats.totalSubjects;
    }
    if (document.getElementById('totalSections')) {
        document.getElementById('totalSections').textContent = stats.totalSections;
    }
    if (document.getElementById('systemStatus')) {
        document.getElementById('systemStatus').textContent = stats.systemEnabled ? 'Habilitado' : 'Deshabilitado';
        document.getElementById('systemStatus').style.color = stats.systemEnabled ? 'var(--success-color)' : 'var(--danger-color)';
    }
}

function loadMateriasPreview() {
    const materias = DataManager.getMaterias();
    const previewContainer = document.getElementById('materiasPreview');
    
    if (!previewContainer) return;

    if (materias.length === 0) {
        previewContainer.innerHTML = `
            <p style="color: var(--text-muted); text-align: center; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 15px;"></i><br>
                No hay materias cargadas. Importa un archivo Excel para comenzar.
            </p>
        `;
        return;
    }

    let html = '';
    materias.forEach((materia, index) => {
        html += `
            <div class="accordion">
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <h3>
                        <i class="fas fa-book"></i>
                        ${materia.nombre}
                        <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">
                            (${materia.secciones.length} secciones)
                        </span>
                    </h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="accordion-content" id="accordion-${index}">
                    <div class="accordion-body">
                        ${materia.secciones.map(seccion => `
                            <div class="section-item">
                                <div class="section-info">
                                    <h4>Sección ${seccion.seccion}</h4>
                                    <p><i class="fas fa-user"></i> ${seccion.profesor}</p>
                                    <p><i class="fas fa-clock"></i> ${seccion.horario}</p>
                                </div>
                                <div class="section-meta">
                                    <span><i class="fas fa-users"></i> Cupo: ${seccion.cupo}</span>
                                    <button class="btn-edit" onclick="editSection(${materia.id}, ${seccion.id})">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    previewContainer.innerHTML = html;
}

function toggleAccordion(index) {
    const content = document.getElementById(`accordion-${index}`);
    const header = content.previousElementSibling;
    
    content.classList.toggle('active');
    header.classList.toggle('active');
}

function editSection(materiaId, seccionId) {
    alert('Función de edición en desarrollo. Materia ID: ' + materiaId + ', Sección ID: ' + seccionId);
}

function loadRecentInscriptions() {
    const inscripciones = DataManager.getInscripciones();
    const container = document.getElementById('recentInscriptions');
    
    if (!container) return;

    if (inscripciones.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); text-align: center; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 15px;"></i><br>
                No hay inscripciones recientes.
            </p>
        `;
        return;
    }

    // Mostrar las últimas 5 inscripciones
    const recentInscriptions = inscripciones.slice(-5).reverse();
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    recentInscriptions.forEach(inscripcion => {
        html += `
            <div class="section-item">
                <div class="section-info">
                    <h4>${inscripcion.nombre}</h4>
                    <p><i class="fas fa-id-card"></i> Cédula: ${inscripcion.cedula}</p>
                    <p><i class="fas fa-envelope"></i> ${inscripcion.email}</p>
                </div>
                <div class="section-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(inscripcion.fecha).toLocaleDateString()}</span>
                    <span style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Completado</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const btnProcessExcel = document.getElementById('btnProcessExcel');
    const importSection = document.getElementById('importSection');

    if (!fileInput) return;

    // Drag and drop
    importSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--highlight-color)';
        this.style.backgroundColor = 'rgba(233, 69, 96, 0.1)';
    });

    importSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.backgroundColor = 'transparent';
    });

    importSection.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });

    // Process Excel button
    if (btnProcessExcel) {
        btnProcessExcel.addEventListener('click', processExcelFile);
    }

    function handleFile(file) {
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            alert('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
            return;
        }

        fileName.textContent = file.name;
        fileInfo.style.display = 'block';
        fileInput.dataset.file = file.name;
    }
}

function processExcelFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona un archivo primero');
        return;
    }

    Utils.showLoading();

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Leer la primera hoja
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convertir a JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                throw new Error('El archivo Excel está vacío');
            }

            // Procesar datos
            const materias = DataManager.processExcelData(jsonData);
            
            if (materias.length === 0) {
                throw new Error('No se encontraron datos válidos en el archivo. Verifica que las columnas sean: materia, profesor, sección, cupo, horario');
            }

            // Guardar materias
            DataManager.saveMaterias(materias);
            
            // Actualizar vista
            loadMateriasPreview();
            updateStats();
            
            Utils.hideLoading();
            alert(`Archivo procesado exitosamente. Se importaron ${materias.length} materias.`);
            
            // Limpiar selección
            document.getElementById('fileInfo').style.display = 'none';
            fileInput.value = '';
            
        } catch (error) {
            Utils.hideLoading();
            alert('Error al procesar el archivo: ' + error.message);
        }
    };

    reader.onerror = function() {
        Utils.hideLoading();
        alert('Error al leer el archivo');
    };

    reader.readAsArrayBuffer(file);
}
