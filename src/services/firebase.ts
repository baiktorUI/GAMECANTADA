import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update, get } from 'firebase/database';

// Configuración de Firebase (la cambiarás por la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyBdohdA_H2QLDYLrWbcVlNoZwvTgRQFuT8",
  authDomain: "gamecantada.firebaseapp.com",
  databaseURL: "https://gamecantada-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gamecantada",
  storageBucket: "gamecantada.firebasestorage.app",
  messagingSenderId: "929846057348",
  appId: "1:929846057348:web:84e074f947e18238db65d1"
};

let database: any = null;

export const initializeFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
  }
};

export const votingService = {
  // Iniciar votación
  startVoting: async () => {
    const votingRef = ref(database, 'voting/state');
    await set(votingRef, {
      isActive: true,
      hasEnded: false,
      startTime: Date.now()
    });
  },

  // Finalizar votación
  endVoting: async () => {
    const votingRef = ref(database, 'voting/state');
    await update(votingRef, {
      isActive: false,
      hasEnded: true
    });
  },

  // Resetear votación
  resetVoting: async () => {
    const sessionId = Date.now().toString(); // Nuevo ID de sesión
    const votingRef = ref(database, 'voting');
    await set(votingRef, {
      state: {
        isActive: false,
        hasEnded: false,
        startTime: null,
        sessionId: sessionId // Guardar ID de sesión
      },
      votes: {
        blau: 0,
        taronja: 0
      },
      voters: {} // Limpiar lista de votantes
    });
  },

  // Votar por un equipo (con control de deviceId)
  vote: async (team: 'blau' | 'taronja', deviceId: string) => {
    // Primero verificar si este dispositivo ya votó
    const deviceRef = ref(database, `voting/voters/${deviceId}`);
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      // Ya votó, no contar el voto
      return false;
    }
    
    // Registrar el voto del dispositivo
    await set(deviceRef, {
      team: team,
      timestamp: Date.now()
    });
    
    // Incrementar el contador
    const votesRef = ref(database, `voting/votes/${team}`);
    const votesSnapshot = await get(votesRef);
    const currentVotes = votesSnapshot.val() || 0;
    await set(votesRef, currentVotes + 1);
    
    return true;
  },

  // Verificar si un dispositivo ya votó
  hasVoted: async (deviceId: string) => {
    const deviceRef = ref(database, `voting/voters/${deviceId}`);
    const snapshot = await get(deviceRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  // Escuchar cambios en los votos
  subscribeToVotes: (callback: (votes: { blau: number; taronja: number }) => void) => {
    const votesRef = ref(database, 'voting/votes');
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || { blau: 0, taronja: 0 };
      callback(data);
    });
    return unsubscribe;
  },

  // Escuchar cambios en el estado de la votación
  subscribeToVotingState: (callback: (state: { isActive: boolean; hasEnded: boolean; sessionId?: string }) => void) => {
    const stateRef = ref(database, 'voting/state');
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val() || { isActive: false, hasEnded: false };
      callback(data);
    });
    return unsubscribe;
  }
};

// Generar ID único del dispositivo (fingerprint simple)
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // Crear fingerprint del dispositivo
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Crear hash simple
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    deviceId = 'device_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};
