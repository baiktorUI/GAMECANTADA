# ✅ CHECKLIST RÁPIDO - VOTACIONS APP

## 📦 ARCHIVOS A SUBIR A GITHUB (19 archivos)

### EN LA RAÍZ (12 archivos):
- [ ] `.gitignore`
- [ ] `.npmrc`
- [ ] `eslint.config.js`
- [ ] `index.html`
- [ ] `package.json` ← ⚠️ CRÍTICO
- [ ] `postcss.config.js`
- [ ] `README.md`
- [ ] `tailwind.config.js`
- [ ] `tsconfig.app.json`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `vercel.json`
- [ ] `vite.config.ts`

### EN src/ (5 archivos):
- [ ] `src/VotingApp.tsx`
- [ ] `src/VotingApp.css`
- [ ] `src/index.css`
- [ ] `src/main.tsx`
- [ ] `src/vite-env.d.ts`

### EN src/components/ (2 archivos):
- [ ] `src/components/AdminScreen.tsx`
- [ ] `src/components/VotingScreen.tsx`

### EN src/types/ (1 archivo):
- [ ] `src/types/voting.ts`

### EN src/services/ (1 archivo):
- [ ] `src/services/firebase.ts` ← ⚠️ EDITAR CON TU CONFIG

---

## 🔥 PASOS FIREBASE

### PASO 1: Crear proyecto
- [ ] Ir a console.firebase.google.com
- [ ] Crear nuevo proyecto
- [ ] Nombre: `votacions-app`

### PASO 2: Activar Realtime Database
- [ ] Click en "Realtime Database"
- [ ] Crear base de datos
- [ ] Ubicación: europe-west1
- [ ] Modo: Test

### PASO 3: Copiar configuración
- [ ] Click en icono Web (</>)
- [ ] Copiar firebaseConfig
- [ ] Pegar en `src/services/firebase.ts`

---

## 🚀 DEPLOYMENT

### GitHub:
- [ ] Repositorio creado: `votacions-app`
- [ ] Todos los archivos subidos
- [ ] Estructura de carpetas correcta

### Vercel:
- [ ] Repositorio importado
- [ ] Framework: Vite
- [ ] Deploy completado

---

## 🧪 PRUEBAS ANTES DE LA FIESTA

### Admin:
- [ ] URL admin funciona: `?admin=true`
- [ ] Aparece el QR
- [ ] Botón "COMENÇAR VOTACIÓ" funciona
- [ ] Cuenta atrás de 60 seg (interna)
- [ ] Cuenta atrás de 10 seg (grande)
- [ ] Gráfico de resultados aparece

### Votación:
- [ ] URL sin `?admin=true` funciona
- [ ] Pantalla "Esperant a començar"
- [ ] Botones EQUIP BLAU / EQUIP TARONJA
- [ ] Confirmación "Vot registrat"
- [ ] Pantalla "Votació finalitzada"

### Tiempo Real:
- [ ] Votar desde móvil
- [ ] Ver voto aparecer en pantalla admin
- [ ] Probar con 2-3 móviles simultáneos

---

## 📊 EL DÍA DE LA FIESTA

### Preparación (30 min antes):
- [ ] Proyector/TV conectado
- [ ] Portátil conectado
- [ ] WiFi funcionando bien
- [ ] Abrir URL admin: `tu-url?admin=true`
- [ ] Pantalla completa (F11)

### Durante:
- [ ] Mostrar QR (la gente escanea)
- [ ] Click "COMENÇAR VOTACIÓ"
- [ ] Esperar 60 segundos
- [ ] Ver cuenta atrás de 10 seg
- [ ] Ver resultados
- [ ] Click "NOVA VOTACIÓ" para repetir

---

## 🎯 URLs IMPORTANTES

Anota aquí tus URLs cuando las tengas:

**URL Admin:**
```
https://_____________________.vercel.app?admin=true
```

**URL Votación (para QR):**
```
https://_____________________.vercel.app
```

**Firebase Console:**
```
https://console.firebase.google.com/project/_____________________
```

---

## ⚠️ ERRORES COMUNES

### ❌ "Firebase not initialized"
**Solución**: Revisa `src/services/firebase.ts` con tu config

### ❌ "Permission denied"
**Solución**: Firebase → Rules → Modo test activado

### ❌ "Module not found"
**Solución**: Verifica estructura de carpetas en GitHub

### ❌ QR no funciona
**Solución**: Verifica URL y conexión WiFi

---

## 💡 CONSEJOS

1. **Prueba 1 día antes** con amigos
2. **WiFi potente** en el lugar de la fiesta
3. **Proyector grande** para que todos vean
4. **Backup**: Ten URL anotada por si falla QR
5. **Fullscreen**: Presiona F11 en el navegador

---

## ✅ VERIFICACIÓN FINAL

Antes de la fiesta, comprueba:

- [ ] Todo funciona en tu portátil
- [ ] Todo funciona en 2-3 móviles
- [ ] El QR escanea bien
- [ ] Los votos aparecen en tiempo real
- [ ] La cuenta atrás funciona
- [ ] Los resultados se ven bien
- [ ] Puedes resetear y repetir

---

## 🎉 ¡TODO LISTO!

Si has marcado todas las casillas, estás listo para la fiesta.

**¡Que vaya genial!** 🎊
