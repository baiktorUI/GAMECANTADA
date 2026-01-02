import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { VotingState } from '../types/voting';

interface AdminScreenProps {
  votingState: VotingState;
  onStartVoting: () => void;
  onEndVoting: () => void;
  onResetVoting: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  votingState,
  onStartVoting,
  onEndVoting,
  onResetVoting
}) => {
  const [countdown, setCountdown] = useState(60);
  const [finalCountdown, setFinalCountdown] = useState(10);
  const [showFinalCountdown, setShowFinalCountdown] = useState(false);

  const totalVotes = votingState.votes.blau + votingState.votes.taronja;
  const blauPercentage = totalVotes > 0 ? (votingState.votes.blau / totalVotes) * 100 : 50;
  const taronjaPercentage = totalVotes > 0 ? (votingState.votes.taronja / totalVotes) * 100 : 50;

  // URL para votar (cambiar por tu URL de Vercel)
  const votingUrl = window.location.origin + window.location.pathname;

  // Reset automático al recargar la página admin
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('adminReloaded');
    
    if (!hasReloaded) {
      // Primera carga: resetear todo
      sessionStorage.setItem('adminReloaded', 'true');
      onResetVoting();
    }
  }, [onResetVoting]);

  // Cuenta atrás de 60 segundos
  useEffect(() => {
    if (votingState.isActive && !showFinalCountdown) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowFinalCountdown(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [votingState.isActive, showFinalCountdown]);

  // Cuenta atrás final de 10 segundos
  useEffect(() => {
    if (showFinalCountdown) {
      const timer = setInterval(() => {
        setFinalCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onEndVoting();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showFinalCountdown, onEndVoting]);

  const handleStart = () => {
    setCountdown(60);
    setFinalCountdown(10);
    setShowFinalCountdown(false);
    onStartVoting();
  };

  const handleReset = () => {
    setCountdown(60);
    setFinalCountdown(10);
    setShowFinalCountdown(false);
    onResetVoting();
  };

  // PANTALLA: Mostrar QR (antes de iniciar)
  if (!votingState.isActive && !votingState.hasEnded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="admin-container">
          <h1 className="admin-title">VOTACIONS</h1>
          <p className="admin-subtitle">Escaneja el QR per votar</p>

          <div className="qr-container">
            <QRCodeSVG
              value={votingUrl}
              size={300}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="voting-url">
            <p className="url-label">O entra a:</p>
            <p className="url-text">{votingUrl}</p>
          </div>

          <button onClick={handleStart} className="start-button">
            COMENÇAR VOTACIÓ
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA: Cuenta atrás de 10 segundos
  if (showFinalCountdown && !votingState.hasEnded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="countdown-container">
          <h2 className="countdown-text">Tancant votació en...</h2>
          <div className="countdown-number">{finalCountdown}</div>
        </div>
      </div>
    );
  }

  // PANTALLA: Resultados (después de finalizar)
  if (votingState.hasEnded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="results-container">
          {/* QR pequeño arriba a la derecha */}
          <div className="qr-fixed">
            <QRCodeSVG
              value={votingUrl}
              size={120}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          <h1 className="results-title">RESULTATS</h1>

          <div className="chart-container">
            {/* Gráfico circular */}
            <svg viewBox="0 0 400 400" className="pie-chart">
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#383294"
                strokeWidth="100"
                strokeDasharray={`${blauPercentage * 9.42} ${(100 - blauPercentage) * 9.42}`}
                transform="rotate(-90 200 200)"
              />
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#FF551A"
                strokeWidth="100"
                strokeDasharray={`${taronjaPercentage * 9.42} ${(100 - taronjaPercentage) * 9.42}`}
                strokeDashoffset={`-${blauPercentage * 9.42}`}
                transform="rotate(-90 200 200)"
              />
              <text x="200" y="190" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold">
                {totalVotes}
              </text>
              <text x="200" y="220" textAnchor="middle" fill="white" fontSize="20">
                vots totals
              </text>
            </svg>
          </div>

          <div className="results-details">
            <div className="result-item blau">
              <div className="result-color" style={{ background: '#383294' }}></div>
              <div className="result-info">
                <span className="result-name">EQUIP BLAU</span>
                <span className="result-percentage">{blauPercentage.toFixed(1)}%</span>
                <span className="result-votes">{votingState.votes.blau} vots</span>
              </div>
            </div>

            <div className="result-item taronja">
              <div className="result-color" style={{ background: '#FF551A' }}></div>
              <div className="result-info">
                <span className="result-name">EQUIP TARONJA</span>
                <span className="result-percentage">{taronjaPercentage.toFixed(1)}%</span>
                <span className="result-votes">{votingState.votes.taronja} vots</span>
              </div>
            </div>
          </div>

          <button onClick={handleReset} className="reset-button-admin">
            NOVA VOTACIÓ
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA: Votación activa (mostrando votos en tiempo real)
  return (
    <div className="app-container flex items-center justify-center">
      <div className="voting-active-container">
        {/* QR pequeño arriba a la derecha */}
        <div className="qr-fixed">
          <QRCodeSVG
            value={votingUrl}
            size={120}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>

        <h1 className="voting-active-title">VOTACIÓ EN CURS</h1>
        
        {/* Cuenta atrás grande */}
        <div className="countdown-display">
          <div className="countdown-label">Temps restant</div>
          <div className="countdown-big">{countdown}s</div>
        </div>

        {/* Gráfico de queso SIN números */}
        <div className="live-chart-container">
          <svg viewBox="0 0 300 300" className="live-pie-chart">
            <circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="#383294"
              strokeWidth="80"
              strokeDasharray={`${blauPercentage * 6.28} ${(100 - blauPercentage) * 6.28}`}
              transform="rotate(-90 150 150)"
            />
            <circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="#FF551A"
              strokeWidth="80"
              strokeDasharray={`${taronjaPercentage * 6.28} ${(100 - taronjaPercentage) * 6.28}`}
              strokeDashoffset={`-${blauPercentage * 6.28}`}
              transform="rotate(-90 150 150)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
