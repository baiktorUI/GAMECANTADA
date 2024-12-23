## Sistema de Votación en Tiempo Real

Sistema de votación interactivo con resultados en tiempo real y visualización de datos.

### Características

- Panel de administración para crear preguntas
- Interfaz de votación para participantes
- Visualización en tiempo real de resultados
- Diseño responsive
- Gráficos interactivos

### Tecnologías

- React
- TypeScript
- Tailwind CSS
- Recharts
- React Router
- Lucide Icons

### Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
├── context/          # Contexto de React y lógica de estado
├── pages/            # Páginas principales
├── types/            # Definiciones de tipos TypeScript
└── utils/            # Funciones utilitarias
```

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instala las dependencias:
```bash
cd sistema-votacion
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

### Uso

1. Accede al panel de administración en `/admin`
2. Crea las preguntas y opciones
3. Comparte el enlace generado con los participantes
4. Visualiza los resultados en tiempo real