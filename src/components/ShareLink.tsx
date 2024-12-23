import React from 'react';
import { Share } from 'lucide-react';

interface ShareLinkProps {
  className?: string;
}

export function ShareLink({ className = '' }: ShareLinkProps) {
  const getVotingUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/votacio/guanyador`;
  };

  return (
    <div className={`glass-panel ${className}`}>
      <div className="flex items-center gap-6">
        <Share className="text-white" size={32} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            Compartir con participantes
          </h2>
          <p className="text-white/70 mb-3">
            Los participantes pueden acceder mediante este enlace:
          </p>
          <div className="bg-white/20 rounded-xl p-4">
            <code className="text-white break-all">
              {getVotingUrl()}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}