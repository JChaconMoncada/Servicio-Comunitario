// Helper para leer parámetros de URL
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Configuración de departamentos
const DEPARTMENT_CONFIG = {
    'matematica-fisica': {
        name: 'Matemática y Física',
        materias: [
            {
                id: 1,
                nombre: 'Matemática I',
                secciones: [
                    { id: 1, seccion: '01', profesor: 'Dr. Juan Pérez', cupo: 30, horario: 'Lun 8-10 AM' },
                    { id: 2, seccion: '02', profesor: 'Dra. María González', cupo: 25, horario: 'Mar 2-4 PM' }
                ]
            },
            {
                id: 2,
                nombre: 'Matemática II',
                secciones: [
                    { id: 3, seccion: '01', profesor: 'Dr. Carlos Rodríguez', cupo: 35, horario: 'Mié 10-12 AM' },
                    { id: 4, seccion: '02', profesor: 'Dra. Ana Martínez', cupo: 28, horario: 'Jue 4-6 PM' }
                ]
            },
            {
                id: 3,
                nombre: 'Matemática III',
                secciones: [
                    { id: 5, seccion: '01', profesor: 'Dr. Luis Sánchez', cupo: 30, horario: 'Vie 8-10 AM' }
                ]
            },
            {
                id: 4,
                nombre: 'Matemática IV',
                secciones: [
                    { id: 6, seccion: '01', profesor: 'Dra. Carmen Torres', cupo: 25, horario: 'Lun 2-4 PM' }
                ]
            }
        ]
    },
    'informatica': {
        name: 'Informática',
        materias: [
            {
                id: 1,
                nombre: 'Programación I',
                secciones: [
                    { id: 1, seccion: '01', profesor: 'Dr. José López', cupo: 30, horario: 'Lun 8-10 AM' },
                    { id: 2, seccion: '02', profesor: 'Dra. Laura Ruiz', cupo: 28, horario: 'Mar 2-4 PM' }
                ]
            },
            {
                id: 2,
                nombre: 'Programación II',
                secciones: [
                    { id: 3, seccion: '01', profesor: 'Dr. Pedro Vargas', cupo: 30, horario: 'Mié 10-12 AM' }
                ]
            },
            {
                id: 3,
                nombre: 'Estructura de Datos',
                secciones: [
                    { id: 4, seccion: '01', profesor: 'Dra. Ana Castillo', cupo: 25, horario: 'Jue 4-6 PM' }
                ]
            },
            {
                id: 4,
                nombre: 'Bases de Datos',
                secciones: [
                    { id: 5, seccion: '01', profesor: 'Dr. Mario Silva', cupo: 30, horario: 'Vie 8-10 AM' }
                ]
            }
        ]
    }
};

// Manejo de datos y localStorage
const DataManager = {
    department: 'matematica-fisica',

    init: function() {
        this.detectDepartment();
    },

    detectDepartment: function() {
        const slug = getQueryParam('departamento');
        if (DEPARTMENT_CONFIG[slug]) {
            this.setDepartment(slug);
            return;
        }

        this.setDepartment('matematica-fisica');
    },

    setDepartment: function(slug) {
        if (DEPARTMENT_CONFIG[slug]) {
            this.department = slug;
        }
    },

    getDepartmentName: function() {
        return DEPARTMENT_CONFIG[this.department].name;
    },

    getDepartmentSlug: function() {
        return this.department;
    },

    key: function(name) {
        return `${name}_${this.department}`;
    },

    getMaterias: function() {
        return Storage.get(this.key('materias')) || DEPARTMENT_CONFIG[this.department].materias;
    },

    // Guardar materias
    saveMaterias: function(materias) {
        return Storage.set(this.key('materias'), materias);
    },

    // Obtener estado de inscripciones
    getInscripcionesState: function() {
        return Storage.get(this.key('inscripcionesHabilitadas')) || false;
    },

    // Guardar estado de inscripciones
    saveInscripcionesState: function(state) {
        return Storage.set(this.key('inscripcionesHabilitadas'), state);
    },

    // Obtener inscripciones
    getInscripciones: function() {
        return Storage.get(this.key('inscripciones')) || [];
    },

    // Guardar inscripción
    saveInscripcion: function(inscripcion) {
        const inscripciones = this.getInscripciones();
        inscripciones.push(inscripcion);
        return Storage.set(this.key('inscripciones'), inscripciones);
    },

    // Obtener datos temporales de estudiante
    getStudentData: function() {
        return Storage.get(this.key('studentData'));
    },

    // Guardar datos temporales de estudiante
    saveStudentData: function(data) {
        return Storage.set(this.key('studentData'), data);
    },

    // Limpiar datos temporales de estudiante
    clearStudentData: function() {
        Storage.remove(this.key('studentData'));
        Storage.remove(this.key('studentVerified'));
        Storage.remove(this.key('studentOTP'));
        Storage.remove(this.key('studentSelection'));
    },

    // Verificar si estudiante está verificado
    isStudentVerified: function() {
        return Storage.get(this.key('studentVerified')) || false;
    },

    // Guardar estado de verificación
    saveStudentVerified: function(verified) {
        return Storage.set(this.key('studentVerified'), verified);
    },

    // Obtener OTP del estudiante
    getStudentOTP: function() {
        return Storage.get(this.key('studentOTP'));
    },

    // Guardar OTP del estudiante
    saveStudentOTP: function(otp) {
        return Storage.set(this.key('studentOTP'), otp);
    },

    // Obtener selección de materias del estudiante
    getStudentSelection: function() {
        return Storage.get(this.key('studentSelection')) || [];
    },

    // Guardar selección de materias
    saveStudentSelection: function(selection) {
        return Storage.set(this.key('studentSelection'), selection);
    },

    // Calcular estadísticas
    getStats: function() {
        const materias = this.getMaterias();
        const inscripciones = this.getInscripciones();
        
        let totalSecciones = 0;
        materias.forEach(m => {
            totalSecciones += m.secciones.length;
        });

        return {
            totalStudents: inscripciones.length,
            totalSubjects: materias.length,
            totalSections: totalSecciones,
            systemEnabled: this.getInscripcionesState()
        };
    },

    // Procesar datos de Excel
    processExcelData: function(data) {
        const materiasMap = new Map();
        
        data.forEach(row => {
            const materia = row.materia || row.Materia || row.MATERIA;
            const profesor = row.profesor || row.Profesor || row.PROFESOR;
            const seccion = row.seccion || row.Seccion || row.SECCION;
            const cupo = row.cupo || row.Cupo || row.CUPO || 30;
            const horario = row.horario || row.Horario || row.HORARIO || 'Por definir';

            if (materia && profesor && seccion) {
                if (!materiasMap.has(materia)) {
                    materiasMap.set(materia, {
                        id: materiasMap.size + 1,
                        nombre: materia,
                        secciones: []
                    });
                }

                const materiaData = materiasMap.get(materia);
                materiaData.secciones.push({
                    id: materiaData.secciones.length + 1,
                    seccion: seccion,
                    profesor: profesor,
                    cupo: parseInt(cupo),
                    horario: horario
                });
            }
        });

        return Array.from(materiasMap.values());
    }
};

DataManager.init();
