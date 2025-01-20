import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Loader2, RefreshCw, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';
import { generateMindMap } from '../services/gemini';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { toPng } from 'html-to-image';

interface MindMapProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject?: string;
  currentTopic?: string;
}

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

export const MindMap: React.FC<MindMapProps> = ({
  isOpen,
  onClose,
  currentSubject,
  currentTopic
}) => {
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mindMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentSubject && currentTopic && !mindMapData) {
      generateMap();
    }
  }, [isOpen, currentSubject, currentTopic]);

  const generateMap = async () => {
    if (!currentSubject || !currentTopic) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await generateMindMap(currentSubject, currentTopic);
      setMindMapData(data);
    } catch (err) {
      setError('Erro ao gerar mapa mental. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMindMap = async () => {
    if (!mindMapRef.current) return;

    try {
      const dataUrl = await toPng(mindMapRef.current, {
        backgroundColor: '#1F2937', // dark:bg-gray-800
        quality: 1,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
        }
      });

      const link = document.createElement('a');
      link.download = `mapa-mental-${currentTopic?.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao baixar mapa mental:', err);
    }
  };

  const renderNode = (node: MindMapNode, level: number = 0, index: number = 0, totalNodes: number = 1) => {
    if (!node) return null;
    
    const isRoot = level === 0;
    const hasChildren = node.children && node.children.length > 0;
    
    // Paleta de cores vibrante para diferentes níveis
    const colors = [
      'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400', // Root
      'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400',      // Level 1
      'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400', // Level 2
      'bg-gradient-to-r from-orange-600 to-amber-600 border-orange-400'  // Level 3
    ];

    const nodeClasses = `
      absolute
      ${colors[level] || colors[colors.length - 1]}
      border-2
      rounded-xl
      p-4
      shadow-lg
      text-white
      font-medium
      transform
      -translate-x-1/2
      -translate-y-1/2
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-2xl
      ${isRoot ? 'text-xl w-[250px]' : level === 1 ? 'text-lg w-[220px]' : 'text-base w-[200px]'}
    `;

    // Ajuste do layout radial
    const radius = level * 300; // Distância entre níveis
    const angle = isRoot ? 0 : ((index / totalNodes) * 2 * Math.PI) - (Math.PI / 2);
    
    const x = isRoot ? 1000 : 1000 + radius * Math.cos(angle);
    const y = isRoot ? 500 : 500 + radius * Math.sin(angle);

    const nodeStyle = {
      left: `${x}px`,
      top: `${y}px`,
    };

    return (
      <div key={node.id}>
        {/* Conexões */}
        {!isRoot && (
          <svg
            className="absolute"
            style={{
              left: '0',
              top: '0',
              width: '2000px',
              height: '1000px',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>
            <path
              d={`M ${x} ${y} L ${isRoot ? 1000 : x - (x - 1000) * 0.1} ${isRoot ? 500 : y - (y - 500) * 0.1}`}
              stroke={`url(#gradient-${node.id})`}
              strokeWidth="3"
              fill="none"
              className="animate-draw"
            />
          </svg>
        )}

        {/* Node */}
        <div className={nodeClasses} style={nodeStyle}>
          <div className="backdrop-blur-sm bg-black/10 p-3 rounded-lg">
            {node.text}
          </div>
        </div>

        {/* Children */}
        {hasChildren && node.children.map((child, idx) => 
          renderNode(child, level + 1, idx, node.children.length)
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-800/90 backdrop-blur-sm shadow-lg z-20">
        <div className="flex items-center">
          <BrainCircuit className="h-6 w-6 text-indigo-400 mr-2" />
          <h3 className="text-xl font-bold text-white">Mapa Mental: {currentTopic}</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadMindMap}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            disabled={isLoading || !mindMapData}
          >
            <Download className="h-4 w-4" />
            Baixar PNG
          </button>
          <button
            onClick={generateMap}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Recriar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              <button
                onClick={() => zoomIn()}
                className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700"
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700"
              >
                <ZoomOut className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700"
              >
                <Maximize2 className="h-5 w-5 text-white" />
              </button>
            </div>

            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <div className="w-full h-full pt-20">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
                    <p className="text-white">Gerando mapa mental...</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={generateMap}
                      className="px-4 py-2 bg-red-900 text-red-100 rounded-lg hover:bg-red-800"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                ) : mindMapData ? (
                  <div ref={mindMapRef} className="relative w-[2000px] h-[1000px]">
                    {renderNode(mindMapData)}
                  </div>
                ) : null}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};