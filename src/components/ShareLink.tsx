import React from 'react';
import { Share } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-6">
          <Share className="text-white" size={24} />
          <h2 className="text-2xl font-bold text-white">
            Escanea para votar
          </h2>
        </div>
        <div className="bg-white p-4 rounded-xl">
          <QRCodeSVG 
            value={getVotingUrl()}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
}