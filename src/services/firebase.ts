import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update, get } from 'firebase/database';

// Configuración de Firebase (la cambiarás por la tuya)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  databaseURL: "https://TU_PROJECT.firebaseio.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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
    const votingRef = ref(database, 'voting');
    await set(votingRef, {
      state: {
        isActive: false,
        hasEnded: false,
        startTime: null
      },
      votes: {
        blau: 0,
        taronja: 0
      }
    });
  },

  // Votar por un equipo
  vote: async (team: 'blau' | 'taronja') => {
    const votesRef = ref(database, `voting/votes/${team}`);
    const snapshot = await get(votesRef);
    const currentVotes = snapshot.val() || 0;
    await set(votesRef, currentVotes + 1);
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
  subscribeToVotingState: (callback: (state: { isActive: boolean; hasEnded: boolean }) => void) => {
    const stateRef = ref(database, 'voting/state');
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val() || { isActive: false, hasEnded: false };
      callback(data);
    });
    return unsubscribe;
  }
};
