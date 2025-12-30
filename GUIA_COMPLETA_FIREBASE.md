# 🔥 GUÍA COMPLETA - APP DE VOTACIONES CON FIREBASE

## 🎯 QUÉ TIENES

Una app de votaciones en tiempo real para 300 personas con:
- **Pantalla Admin**: QR, control de votación, cuenta atrás y resultados
- **Pantalla de Voto**: Para que la gente vote desde su móvil
- **Firebase**: Base de datos en tiempo real (GRATIS hasta 50k lecturas/día)

---

## 📦 PASO 1: CREAR PROYECTO EN FIREBASE

### 1.1 - Ir a Firebase Console
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Añadir proyecto"** o **"Add project"**

### 1.2 - Configurar el proyecto
1. **Nombre del proyecto**: `votacions-app` (o el que quieras)
2. **Google Analytics**: Puedes desactivarlo (no lo necesitas)
3. Haz clic en **"Crear proyecto"**
4. Espera unos segundos...
5. Haz clic en **"Continuar"**

### 1.3 - Añadir app web
1. En el panel, haz clic en el icono **</>** (Web)
2. **Nombre de la app**: `Votacions Web`
3. ❌ **NO marques** "Configure Firebase Hosting"
4. Haz clic en **"Registrar app"**

### 1.4 - Copiar la configuración
Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "votacions-app-xxxxx.firebaseapp.com",
  databaseURL: "https://votacions-app-xxxxx.firebaseio.com",
  projectId: "votacions-app-xxxxx",
  storageBucket: "votacions-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**¡GUARDA ESTE CÓDIGO!** Lo necesitarás en el paso 3.

---

## 📦 PASO 2: ACTIVAR REALTIME DATABASE

### 2.1 - Ir a Realtime Database
1. En el menú izquierdo, haz clic en **"Realtime Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**

### 2.2 - Configurar ubicación
1. Ubicación: Elige **"europe-west1"** (más cercano a España)
2. Haz clic en **"Siguiente"**

### 2.3 - Configurar reglas de seguridad
1. Selecciona **"Comenzar en modo de prueba"** o **"Start in test mode"**
2. Haz clic en **"Habilitar"**

⚠️ **IMPORTANTE**: Las reglas de prueba permiten lectura/escritura a cualquiera durante 30 días. Para una fiesta de 1 día está perfecto.

### 2.4 - Copiar la URL de la base de datos
Verás algo como:
```
https://votacions-app-xxxxx-default-rtdb.europe-west1.firebasedatabase.app/
```

**¡GUARDA ESTA URL!** La necesitarás en el paso 3.

---

## 📦 PASO 3: CONFIGURAR EL CÓDIGO

### 3.1 - Descargar los archivos
Tienes todos los archivos listos en la carpeta `votacions-app/`

### 3.2 - Editar el archivo de Firebase
1. Abre el archivo: `src/services/firebase.ts`
2. Busca la sección que dice:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  databaseURL: "https://TU_PROJECT.firebaseio.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

3. **REEMPLAZA** con los datos que copiaste en el Paso 1.4

**EJEMPLO:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDq8x7X6X_ejemplo_X6X6X6X6X6X6X6",
  authDomain: "votacions-app-12345.firebaseapp.com",
  databaseURL: "https://votacions-app-12345-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "votacions-app-12345",
  storageBucket: "votacions-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

4. **GUARDA** el archivo

---

## 📦 PASO 4: SUBIR A GITHUB

### 4.1 - Crear repositorio
1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"**
3. Nombre: `votacions-app`
4. **Public** o **Private**
5. ❌ NO marques "Add a README"
6. Haz clic en **"Create repository"**

### 4.2 - Subir TODOS los archivos
Sube la estructura completa:

```
votacions-app/
├── .gitignore
├── .npmrc
├── eslint.config.js
├── index.html
├── package.json              ← CRÍTICO
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── src/
    ├── VotingApp.tsx
    ├── VotingApp.css
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── AdminScreen.tsx
    │   └── VotingScreen.tsx
    ├── types/
    │   └── voting.ts
    └── services/
        └── firebase.ts       ← CON TU CONFIG
```

---

## 📦 PASO 5: DEPLOY EN VERCEL

### 5.1 - Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio `votacions-app`
4. Haz clic en **"Import"**

### 5.2 - Configurar (debería auto-detectar)
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### 5.3 - Deploy
1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Listo! Te dará una URL como: `https://votacions-app.vercel.app`

---

## 🎮 PASO 6: CÓMO USAR LA APP EN LA FIESTA

### Para TI (Admin):
1. Abre la URL con **`?admin=true`** al final:
   ```
   https://votacions-app.vercel.app?admin=true
   ```
2. Verás la pantalla del QR
3. Proyecta esta pantalla en la pared/pantalla grande

### Para los ASISTENTES:
1. Escanean el QR con su móvil
2. O entran directamente a:
   ```
   https://votacions-app.vercel.app
   ```
3. Ven la pantalla para votar

### Flujo de la fiesta:
1. **ANTES**: Proyectas la pantalla admin con el QR
2. **INICIO**: Haces clic en "COMENÇAR VOTACIÓ"
3. **DURANTE**: La gente vota desde sus móviles (60 segundos)
4. **CUENTA ATRÁS**: Se muestra 10 segundos en grande
5. **RESULTADOS**: Se muestra el gráfico circular con ganador
6. **RESET**: Haces clic en "NOVA VOTACIÓ" para repetir

---

## ✅ CHECKLIST ANTES DE LA FIESTA

- [ ] Firebase configurado correctamente
- [ ] Código con tu configuración de Firebase
- [ ] Todo subido a GitHub
- [ ] Deploy en Vercel exitoso
- [ ] URL admin funciona: `tu-url?admin=true`
- [ ] URL votación funciona: `tu-url`
- [ ] Prueba con 2-3 móviles que funcione
- [ ] QR se escanea correctamente
- [ ] Los votos aparecen en tiempo real
- [ ] La cuenta atrás funciona
- [ ] Los resultados se muestran bien

---

## 🎯 CARACTERÍSTICAS DE LA APP

### Pantalla ADMIN (tu pantalla proyectada):
✅ Muestra QR para acceder
✅ Botón para iniciar votación
✅ Cuenta atrás de 60 segundos (solo admin la ve)
✅ Votos en tiempo real mientras votan
✅ Cuenta atrás de 10 segundos en GRANDE
✅ Gráfico circular con resultados y porcentajes
✅ Botón para resetear y hacer otra votación

### Pantalla VOTACIÓN (móviles de la gente):
✅ Esperando a que inicies
✅ Votan EQUIP BLAU o EQUIP TARONJA
✅ Confirmación de voto
✅ Mensaje cuando finaliza

---

## 🆘 SI ALGO NO FUNCIONA

### Error: "Firebase not initialized"
- Revisa que hayas copiado bien la config en `firebase.ts`
- Asegúrate de que la `databaseURL` sea correcta

### Error: "Permission denied"
- Ve a Firebase Console → Realtime Database → Rules
- Asegúrate de que las reglas sean:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Los votos no se actualizan
- Refresca la página admin
- Verifica que Firebase esté funcionando
- Mira la consola del navegador (F12)

### El QR no funciona
- Verifica que la URL sea correcta
- Prueba accediendo directamente desde un móvil

---

## 💡 CONSEJOS PARA LA FIESTA

1. **Prueba antes**: Haz una prueba 1 día antes con amigos
2. **WiFi fuerte**: Asegúrate de que haya buena conexión
3. **Proyector/TV**: Conecta tu portátil a una pantalla grande
4. **Backup**: Ten la URL anotada por si falla el QR
5. **Pantalla admin en fullscreen**: Presiona F11 para pantalla completa

---

## 📊 LÍMITES DE FIREBASE (PLAN GRATIS)

- ✅ 50,000 lecturas/día (más que suficiente)
- ✅ 20,000 escrituras/día (perfecto para 300 personas)
- ✅ 1 GB de datos descargados/mes (sobra)
- ✅ 100 conexiones simultáneas

**Para 300 personas en 1 fiesta: PERFECTO** ✅

---

## 🎉 ¡LISTO PARA LA FIESTA!

Si has seguido todos los pasos, tu app debería estar funcionando.

**URL Admin**: `https://tu-app.vercel.app?admin=true`
**URL Voto**: `https://tu-app.vercel.app`

¡Que lo disfrutes! 🎊
