# 🎉 APP DE VOTACIONS - EQUIP BLAU VS EQUIP TARONJA

Sistema de votación en tiempo real para eventos con hasta 300 personas.

## 🎯 CARACTERÍSTICAS

### PANTALLA ADMIN (Proyectada en pantalla grande)
- ✅ Código QR para acceso rápido
- ✅ Control de inicio de votación
- ✅ Votos en tiempo real
- ✅ Cuenta atrás de 10 segundos
- ✅ Gráfico circular con resultados y porcentajes
- ✅ Botón para resetear y hacer nueva votación

### PANTALLA DE VOTACIÓN (Móviles de los asistentes)
- ✅ Interfaz simple y clara
- ✅ Voto EQUIP BLAU o EQUIP TARONJA
- ✅ Confirmación inmediata
- ✅ Responsive para todos los móviles

---

## 🚀 INSTALACIÓN RÁPIDA

### 1️⃣ CREAR PROYECTO EN FIREBASE
```
1. Ve a console.firebase.google.com
2. Crear proyecto
3. Activar Realtime Database (modo test)
4. Copiar configuración
```

### 2️⃣ CONFIGURAR CÓDIGO
```
1. Editar src/services/firebase.ts
2. Pegar tu configuración de Firebase
3. Guardar
```

### 3️⃣ SUBIR A GITHUB
```
1. Crear repositorio "votacions-app"
2. Subir TODOS los archivos
```

### 4️⃣ DEPLOY EN VERCEL
```
1. Conectar repositorio
2. Deploy (auto-detecta Vite)
3. ¡Listo!
```

---

## 🎮 CÓMO USAR

### Admin (tú):
Accede con: `https://tu-app.vercel.app?admin=true`

### Votantes (asistentes):
Escanean QR o van a: `https://tu-app.vercel.app`

### Flujo:
1. Proyectar pantalla admin → Mostrar QR
2. Clic en "COMENÇAR VOTACIÓ"
3. La gente vota (60 segundos internos)
4. Cuenta atrás de 10 segundos
5. Resultados en gráfico circular
6. Clic en "NOVA VOTACIÓ" para repetir

---

## 📁 ESTRUCTURA DEL PROYECTO

```
votacions-app/
├── src/
│   ├── VotingApp.tsx              # App principal
│   ├── components/
│   │   ├── AdminScreen.tsx        # Pantalla admin (QR + resultados)
│   │   └── VotingScreen.tsx       # Pantalla de votación
│   ├── services/
│   │   └── firebase.ts            # Config Firebase ← EDITAR AQUÍ
│   └── types/
│       └── voting.ts              # Tipos TypeScript
├── package.json
├── index.html
└── ... (archivos de config)
```

---

## 🔧 TECNOLOGÍAS

- **React 18** + **TypeScript**
- **Firebase Realtime Database** (sincronización en tiempo real)
- **Vite** (build rápido)
- **Tailwind CSS** (estilos)
- **QRCode.React** (generación de QR)
- **Vercel** (hosting)

---

## 🎨 DISEÑO

Misma estética visual que el trivial de Sant Feliu:
- Gradiente naranja → azul → morado
- Botones grandes y accesibles
- Animaciones suaves
- Colores vibrantes: Blau (#0e487e) y Taronja (#e03c0a)

---

## 📊 CAPACIDAD

- ✅ Hasta **300 votantes simultáneos**
- ✅ Votos en **tiempo real**
- ✅ **Sin límite** de votaciones por día
- ✅ Firebase gratis: 50k lecturas/día

---

## 📖 DOCUMENTACIÓN

Lee **GUIA_COMPLETA_FIREBASE.md** para instrucciones paso a paso detalladas.

---

## 🆘 SOPORTE

### Problemas comunes:

**"Firebase not initialized"**
→ Revisa config en `src/services/firebase.ts`

**"Permission denied"**
→ Activa modo test en Firebase Rules

**QR no funciona**
→ Verifica la URL y conexión a internet

---

## ✅ CHECKLIST PRE-FIESTA

- [ ] Firebase configurado
- [ ] Código editado con tu config
- [ ] Deploy en Vercel exitoso
- [ ] Probado con 2-3 móviles
- [ ] URL admin: `tu-url?admin=true` funciona
- [ ] QR escanea correctamente
- [ ] Votos se ven en tiempo real

---

## 🎉 ¡LISTO PARA LA FIESTA!

Cualquier duda, lee la **GUIA_COMPLETA_FIREBASE.md**

**¡Que lo disfrutéis!** 🎊
