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

    // Cargar inscripciones por materia
    loadInscriptionsByMateria();

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

function loadInscriptionsByMateria() {
    const inscripciones = DataManager.getInscripciones();
    const container = document.getElementById('inscriptionsByMateria');
    const filterSelect = document.getElementById('materiaFilter');

    if (!container || !filterSelect) return;

    if (inscripciones.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); text-align: center; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 15px;"></i><br>
                No hay inscripciones registradas.
            </p>
        `;
        return;
    }

    // Agrupar inscripciones por materia
    const groupedByMateria = {};
    inscripciones.forEach(inscripcion => {
        if (inscripcion.materias && inscripcion.materias.length > 0) {
            inscripcion.materias.forEach(materia => {
                const materiaNombre = materia.materia;
                if (!groupedByMateria[materiaNombre]) {
                    groupedByMateria[materiaNombre] = [];
                }
                groupedByMateria[materiaNombre].push({
                    ...inscripcion,
                    materiaSeleccionada: materia
                });
            });
        }
    });

    // Poblar el filtro
    const materiasNombres = Object.keys(groupedByMateria).sort();
    filterSelect.innerHTML = '<option value="">Todas las materias</option>';
    materiasNombres.forEach(materia => {
        filterSelect.innerHTML += `<option value="${materia}">${materia}</option>`;
    });

    // Event listener del filtro
    filterSelect.onchange = function() {
        renderInscriptions(groupedByMateria, this.value);
    };

    // Renderizar inicialmente todas
    renderInscriptions(groupedByMateria, '');
}

function renderInscriptions(groupedByMateria, filterValue) {
    const container = document.getElementById('inscriptionsByMateria');
    if (!container) return;

    const materiasToRender = filterValue
        ? { [filterValue]: groupedByMateria[filterValue] }
        : groupedByMateria;

    if (Object.keys(materiasToRender).length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px;"></i><br>
                No hay inscripciones para esta materia.
            </p>
        `;
        return;
    }

    let html = '';
    Object.keys(materiasToRender).sort().forEach(materiaNombre => {
        const inscripciones = materiasToRender[materiaNombre];
        html += `
            <div class="inscription-materia-group">
                <div class="inscription-materia-header">
                    <h3><i class="fas fa-book"></i> ${materiaNombre}</h3>
                    <span class="count">${inscripciones.length} estudiante(s)</span>
                </div>
                ${inscripciones.map(inscripcion => `
                    <div class="inscription-card">
                        <div class="inscription-info">
                            <h4>${inscripcion.nombre}</h4>
                            <p><i class="fas fa-id-card"></i> Cédula: ${inscripcion.cedula}</p>
                            <p><i class="fas fa-envelope"></i> ${inscripcion.email}</p>
                        </div>
                        <div class="inscription-details">
                            <div class="materia">${inscripcion.materiaSeleccionada.materia}</div>
                            <div class="seccion">Sección ${inscripcion.materiaSeleccionada.seccion}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });

    container.innerHTML = html;
}

function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const btnProcessExcel = document.getElementById('btnProcessExcel');
    const importDropzone = document.querySelector('.import-dropzone');

    if (!fileInput || !importDropzone) return;

    // Drag and drop
    importDropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    importDropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    importDropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');

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
            loadInscriptionsByMateria();
            
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
