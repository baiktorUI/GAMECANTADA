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

    // Crear conexión WebSocket con reconexión automática
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:3001');

      socket.onopen = () => {
        setConnectionStatus('connected');
        setWs(socket);
      };

      socket.onclose = () => {
        setConnectionStatus('disconnected');
        setTimeout(connectWebSocket, 1000); // Reintentar conexión
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

  const sendMessage = useCallback((type, payload) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  }, [ws]);

  const AdminPanel = () => {
    const handleOptionChange = (index, value) => {
      const newOptions = [...state.options];
      newOptions[index] = value;
      sendMessage('UPDATE_OPTIONS', { options: newOptions });
    };

    const toggleVoting = () => {
      sendMessage('TOGGLE_VOTING', { enabled: !state.votingEnabled });
    };

    const chartData = state.options.map((option, index) => ({
      name: option || `Opción ${index + 1}`,
      votos: state.votes[index]
    }));

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Panel de Administrador</span>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} />
                <span>{state.connectedClients} usuarios conectados</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                  />
                </div>
              ))}
              <Button 
                onClick={toggleVoting}
                className={state.votingEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
              >
                {state.votingEnabled ? 'Detener Votación' : 'Iniciar Votación'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados en Tiempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votos" fill="#4F46E5" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    );
  };

  const UserPanel = () => {
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = (index) => {
      if (!hasVoted) {
        sendMessage('VOTE', { optionIndex: index });
        setHasVoted(true);
      }
    };

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Votación</CardTitle>
          </CardHeader>
          <CardContent>
            {connectionStatus !== 'connected' ? (
              <div className="text-center p-4">
                <p>Reconectando...</p>
              </div>
            ) : !state.votingEnabled ? (
              <div className="text-center p-4">
                <Lock className="mx-auto mb-2" size={24} />
                <p>La votación no está activa en este momento</p>
              </div>
            ) : hasVoted ? (
              <div className="text-center p-4">
                <p>¡Gracias por tu voto!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {state.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleVote(index)}
                    className="w-full"
                    disabled={!option}
                  >
                    {option || `Opción ${index + 1}`}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'vote' && <UserPanel />}
      {currentPage === '' && (
        <div className="p-6 text-center">
          <p>Por favor accede a /admin o /vote</p>
        </div>
      )}
    </div>
  );
};

export default VotingApp;
