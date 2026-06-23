# Sistema de Inscripciones Tardías - UNET

Aplicación web frontend-only para el sistema de inscripciones tardías de los departamentos de la Universidad Nacional Experimental del Táchira (UNET).

## 🚀 Características

### Para Estudiantes
- Formulario de inscripción con validación de datos y pre-llenado automático (V- para cédula, +58 para teléfono)
- Verificación por correo institucional (OTP)
- Selección de materias con checkboxes (multiselección) y filtrado por semestre
- Confirmación de inscripción con resumen y estado de "en espera de aprobación"

### Para Administradores
- Panel de control con estadísticas generales
- Importación de materias desde Excel
- Vista previa de materias en accordions
- Control de habilitación/deshabilitación de inscripciones
- Visualización de inscripciones agrupadas por materia con filtro
- Soporte multi-departamento (Matemática y Física, Informática)

### Generales
- **Modo oscuro/claro** con toggle manual y detección automática del sistema
- **Navegación responsive** con menú hamburguesa en dispositivos móviles
- **Enrutamiento por departamento** mediante parámetros de URL (`?departamento=`)
- **Auto-login** mediante parámetros de URL para testing
- Secciones Hero rediseñadas con estadísticas y elementos visuales

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- No requiere instalación de software adicional
- Conexión a internet para cargar librerías externas (CDN)

## 🔧 Instalación

1. Clona o descarga este repositorio
2. Abre el archivo `index.html` en tu navegador web
3. ¡Listo! No requiere servidor ni instalación

## 👤 Credenciales de Administrador (Mock)

Para acceder al panel de administración:
- **Usuario:** admin@unet.edu.ve
- **Contraseña:** admin123

También puedes acceder directamente vía URL:
```
admin/login.html?email=admin@unet.edu.ve&password=admin123
```

## 📁 Estructura del Proyecto

```
Servicio-Comunitario/
├── index.html                              # Landing page pública
├── departamentos.html                      # Selección de departamento
├── departamento-matematica-fisica.html     # Depto. Matemática y Física
├── departamento-informatica.html           # Depto. Informática
├── soporte.html                            # Página de soporte
├── admin/
│   ├── login.html                          # Login administradores
│   └── dashboard.html                      # Panel de administración
├── estudiante/
│   ├── formulario.html                     # Formulario datos personales
│   ├── verificacion.html                   # Verificación OTP
│   └── materias.html                       # Selección de materias
├── css/
│   ├── styles.css                          # Estilos generales
│   ├── admin.css                           # Estilos admin
│   └── estudiante.css                      # Estilos estudiante
├── js/
│   ├── main.js                             # Funcionalidades comunes (Theme, Layout, Navigation)
│   ├── auth.js                             # Autenticación
│   ├── data.js                             # Manejo de datos (localStorage multi-depto)
│   ├── admin.js                            # Lógica admin
│   └── estudiante.js                       # Lógica estudiante
└── Grupos de Trabajo.txt
```

## 🎯 Flujo de Uso

### Para Administradores
1. Acceder a `index.html`
2. Hacer clic en "Admin" en el navbar
3. Ingresar credenciales (admin@unet.edu.ve / admin123)
4. En el dashboard:
   - Importar archivo Excel con materias
   - Revisar vista previa de materias
   - Habilitar inscripciones con el toggle
   - Monitorear inscripciones agrupadas por materia

### Para Estudiantes
1. Acceder a `index.html`
2. Hacer clic en "Ver Departamentos"
3. Seleccionar el departamento correspondiente
4. Hacer clic en "Comenzar Inscripción"
5. Completar formulario con datos personales (cédula con V-, teléfono con +58)
6. Ingresar código OTP (se muestra en consola para testing)
7. Seleccionar materias disponibles (multiselección con checkboxes)
8. Confirmar inscripción (queda en espera de aprobación)

## 📊 Formato de Excel para Importación

El archivo Excel debe contener las siguientes columnas (encabezados):

| materia | profesor | sección | cupo | horario |
|---------|----------|----------|------|---------|
| Matemática I | Dr. Juan Pérez | 01 | 30 | Lun 8-10 AM |
| Matemática I | Dra. María González | 02 | 25 | Mar 2-4 PM |
| Matemática II | Dr. Carlos Rodríguez | 01 | 35 | Mié 10-12 AM |

**Nota:** Los nombres de las columnas no son case-sensitive.

## 🔒 Seguridad

⚠️ **IMPORTANTE:** Esta es una versión frontend-only para prototipado.

- Las credenciales están en código (no usar en producción)
- Los datos se almacenan en localStorage (no persistente entre navegadores)
- El sistema OTP es simulado (código en consola)
- No hay validación real con API de Control de Estudios

**Para producción se necesita:**
- Backend con autenticación segura
- Base de datos (recomendado: Supabase o Firebase)
- API real de Control de Estudios UNET
- Sistema de envío de correos (recomendado: Resend)
- Validación de prerrequisitos real

## 🎨 Tecnologías Utilizadas

- **HTML5** - Estructura
- **CSS3** - Estilos con variables CSS, diseño responsive
- **JavaScript Vanilla** - Lógica (sin frameworks)
- **SheetJS (xlsx)** - Lectura de archivos Excel
- **FontAwesome** - Iconos
- **Google Fonts (Inter)** - Tipografía

## 🐛 Troubleshooting

### El código OTP no llega
- Para testing, el código se muestra en la consola del navegador (F12)
- Abre la consola y busca "OTP generado"

### Las inscripciones aparecen deshabilitadas
- Debes ingresar como admin y habilitar el toggle
- Verifica que hayas importado materias primero
- Asegúrate de estar en el departamento correcto

### El archivo Excel no se procesa
- Verifica que las columnas tengan los nombres correctos
- Asegúrate de que el archivo sea .xlsx o .xls
- Revisa que haya datos en la primera hoja

### Los datos no persisten
- Esta versión usa localStorage con prefijo por departamento
- Los datos se pierden al limpiar el caché del navegador
- Para producción se necesita una base de datos real

## 📝 Notas de Desarrollo

- Soporte multi-departamento con datos aislados por localStorage (prefijo `_matematica-fisica`, `_informatica`)
- Modo oscuro persistente en localStorage con detección de preferencia del sistema
- Navegación responsive con menú hamburguesa en mobile
- Los checkboxes reemplazaron a los radios para permitir selección múltiple de materias
- El mensaje de éxito ahora indica "Inscripción Enviada" en lugar de "Exitosa"
- La cédula se pre-llena con formato V- y el teléfono con +58

## 🤝 Contribuciones

Este es un proyecto educativo para los departamentos de la UNET.

## 📄 Licencia

Proyecto interno de la Universidad Nacional Experimental del Táchira.

---

**Desarrollado para:** Departamento de Matemática y Física / Departamento de Informática - UNET  
**Versión:** 2.0.0  
**Fecha:** Junio 2026
