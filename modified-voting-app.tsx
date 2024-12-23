import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Users } from 'lucide-react';

const VotingApp = () => {
  const [ws, setWs] = useState(null);
  const [state, setState] = useState({
    options: ['', '', ''],
    votes: [0, 0, 0],
    votingEnabled: false,
    connectedClients: 0
  });
  const [currentPage, setCurrentPage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPage(path.slice(1) || '');

    // Crear conexión WebSocket
    const connectWebSocket = () => {
      // Usar URL relativa para que funcione en desarrollo y producción
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setConnectionStatus('connected');
        setWs(socket);
      };

      socket.onclose = () => {
        setConnectionStatus('disconnected');
        setTimeout(connectWebSocket, 1000);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'STATE_UPDATE') {
          setState(data.payload);
        }
      };

      return socket;
    };

    const socket = connectWebSocket();
    return () => socket.close();
  }, []);

  // ... resto del código del componente permanece igual ...
};

export default VotingApp;
