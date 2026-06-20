# Sistema de Inscripciones Tardías - Departamento de Matemática UNET

Aplicación web frontend-only para el sistema de inscripciones tardías del Departamento de Matemática de la UNET.

## 🚀 Características

### Para Estudiantes
- Formulario de inscripción con validación de datos
- Verificación por correo institucional (OTP)
- Selección de materias con filtrado por semestre
- Confirmación de inscripción con resumen

### Para Administradores
- Panel de control con estadísticas
- Importación de materias desde Excel
- Vista previa de materias en accordions
- Control de habilitación/deshabilitación de inscripciones
- Visualización de inscripciones recientes

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

## 📁 Estructura del Proyecto

```
ITUNET/
├── index.html              # Landing page pública
├── admin/
│   ├── login.html          # Login administradores
│   └── dashboard.html      # Panel de administración
├── estudiante/
│   ├── formulario.html     # Formulario datos personales
│   ├── verificacion.html   # Verificación OTP
│   └── materias.html       # Selección de materias
├── css/
│   ├── styles.css          # Estilos generales
│   ├── admin.css           # Estilos admin
│   └── estudiante.css      # Estilos estudiante
├── js/
│   ├── main.js             # Funcionalidades comunes
│   ├── auth.js             # Autenticación
│   ├── data.js             # Manejo de datos (localStorage)
│   ├── admin.js            # Lógica admin
│   └── estudiante.js       # Lógica estudiante
└── assets/
    └── images/             # Imágenes y logos
```

## 🎯 Flujo de Uso

### Para Administradores
1. Acceder a `index.html`
2. Hacer clic en "Login Admin"
3. Ingresar credenciales (admin@unet.edu.ve / admin123)
4. En el dashboard:
   - Importar archivo Excel con materias
   - Revisar vista previa de materias
   - Habilitar inscripciones con el toggle
   - Monitorear inscripciones en tiempo real

### Para Estudiantes
1. Acceder a `index.html`
2. Hacer clic en "Soy Estudiante"
3. Completar formulario con datos personales
4. Ingresar código OTP (se muestra en consola para testing)
5. Seleccionar materias disponibles según semestre
6. Confirmar inscripción

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
- **CSS3** - Estilos con variables CSS
- **JavaScript Vanilla** - Lógica
- **SheetJS (xlsx)** - Lectura de archivos Excel
- **FontAwesome** - Iconos
- **Google Fonts (Inter)** - Tipografía

## 🌐 Recomendaciones para Producción

### Hosting (Gratuito)
- **Vercel** - Mejor opción para frontend
- **Netlify** - Alternativa excelente
- **GitHub Pages** - Para proyectos simples

### Base de Datos (Gratuita)
- **Supabase** - PostgreSQL, autenticación incluida
- **Firebase** - NoSQL, tiempo real
- **MongoDB Atlas** - Flexible, escalable

### Sistema de Correos (Gratuito)
- **Resend** - 3000 correos/mes gratis
- **SendGrid** - 100 correos/día gratis
- **EmailJS** - 200 correos/mes gratis, sin backend

## 🐛 Troubleshooting

### El código OTP no llega
- Para testing, el código se muestra en la consola del navegador (F12)
- Abre la consola y busca "OTP generado"

### Las inscripciones aparecen deshabilitadas
- Debes ingresar como admin y habilitar el toggle
- Verifica que hayas importado materias primero

### El archivo Excel no se procesa
- Verifica que las columnas tengan los nombres correctos
- Asegúrate de que el archivo sea .xlsx o .xls
- Revisa que haya datos en la primera hoja

### Los datos no persisten
- Esta versión usa localStorage
- Los datos se pierden al limpiar el caché del navegador
- Para producción se necesita una base de datos real

## 📝 Notas de Desarrollo

- El sistema de prerrequisitos es básico (filtra por semestre)
- La validación de cédula acepta formatos V- o E- seguido de números
- El correo debe ser @unet.edu.ve (validación frontend)
- Los cupos no se actualizan automáticamente (futura funcionalidad)

## 🤝 Contribuciones

Este es un proyecto educativo para el Departamento de Matemática de la UNET.

## 📄 Licencia

Proyecto interno de la Universidad Nacional Experimental del Táchira.

---

**Desarrollado para:** Departamento de Matemática - UNET  
**Versión:** 1.0.0 (Prototipo Frontend)  
**Fecha:** Junio 2024
