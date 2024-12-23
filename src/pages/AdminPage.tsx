import React from 'react';
import { useVoting } from '../context/VotingContext';
import { Share } from 'lucide-react';

export function AdminPage() {
  const { options, votingEnabled, setOptions, toggleVoting } = useVoting();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const votingUrl = `${window.location.origin}/votacio`;

  const copyVotingUrl = async () => {
    try {
      await navigator.clipboard.writeText(votingUrl);
      alert('URL copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-blue-800 to-blue-950 p-4">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass-panel mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Panel de Control</h1>
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={option ?? ''}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opción ${index + 1}`}
                  className="input-field w-full text-white"
                />
              </div>
            ))}
            <button 
              onClick={toggleVoting}
              className={`btn-primary w-full ${
                votingEnabled ? 'bg-red-500/20' : 'bg-green-500/20'
              }`}
            >
              {votingEnabled ? 'Detener Votación' : 'Iniciar Votación'}
            </button>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex items-center gap-4">
            <Share className="text-white" size={24} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Enlace para votar</h2>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-white/70 flex-1 break-all bg-black/20 p-2 rounded">{votingUrl}</code>
                <button 
                  onClick={copyVotingUrl}
                  className="btn-primary px-4 py-2"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}