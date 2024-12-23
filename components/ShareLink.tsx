import React from 'react';
import { Share, Copy } from 'lucide-react';
import { generateVotingUrl } from '../utils/urlGenerator';

interface ShareLinkProps {
  className?: string;
}

export function ShareLink({ className = '' }: ShareLinkProps) {
  const votingUrl = generateVotingUrl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(votingUrl);
      alert('URL copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className={`glass-panel ${className}`}>
      <div className="flex items-center gap-6">
        <Share className="text-white" size={32} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            Enlace para votar
          </h2>
          <div className="bg-white/20 rounded-xl p-4 flex items-center gap-2">
            <code className="text-white flex-1 break-all">
              {votingUrl}
            </code>
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copiar enlace"
            >
              <Copy className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}