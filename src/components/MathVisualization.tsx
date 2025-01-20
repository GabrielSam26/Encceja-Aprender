import React, { useEffect, useRef } from 'react';
import JXG from 'jsxgraph';
import functionPlot from 'function-plot';

interface MathVisualizationProps {
  type: 'graph' | 'geometry';
  config: {
    function?: string;
    domain?: [number, number];
    points?: { x: number; y: number; label?: string }[];
    lines?: { point1: [number, number]; point2: [number, number]; label?: string }[];
    circles?: { center: [number, number]; radius: number; label?: string }[];
    polygons?: { points: [number, number][]; label?: string }[];
  };
  width?: number;
  height?: number;
}

export const MathVisualization: React.FC<MathVisualizationProps> = ({
  type,
  config,
  width = 400,
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (type === 'graph') {
      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create function plot
        functionPlot({
          target: containerRef.current,
          width,
          height,
          yAxis: { domain: [-10, 10] },
          xAxis: { domain: config.domain || [-10, 10] },
          grid: true,
          data: [
            {
              fn: config.function || 'x',
              color: '#4F46E5'
            }
          ]
        });
      } catch (error) {
        console.error('Error creating function plot:', error);
      }
    } else if (type === 'geometry') {
      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create JSXGraph board
        const board = JXG.JSXGraph.initBoard(containerRef.current.id, {
          boundingbox: [-10, 10, 10, -10],
          axis: true,
          grid: true,
          showNavigation: false,
          showCopyright: false
        });

        boardRef.current = board;

        // Add points
        if (config.points) {
          config.points.forEach(point => {
            board.create('point', [point.x, point.y], {
              name: point.label || '',
              size: 4,
              fixed: true
            });
          });
        }

        // Add lines
        if (config.lines) {
          config.lines.forEach(line => {
            const p1 = board.create('point', line.point1, { visible: false });
            const p2 = board.create('point', line.point2, { visible: false });
            board.create('line', [p1, p2], {
              straightFirst: false,
              straightLast: false,
              strokeWidth: 2,
              name: line.label || ''
            });
          });
        }

        // Add circles
        if (config.circles) {
          config.circles.forEach(circle => {
            const center = board.create('point', circle.center, { visible: false });
            board.create('circle', [center, circle.radius], {
              strokeWidth: 2,
              name: circle.label || ''
            });
          });
        }

        // Add polygons
        if (config.polygons) {
          config.polygons.forEach(polygon => {
            const vertices = polygon.points.map(point =>
              board.create('point', point, { visible: false })
            );
            board.create('polygon', vertices, {
              borders: { strokeWidth: 2 },
              name: polygon.label || ''
            });
          });
        }
      } catch (error) {
        console.error('Error creating geometric visualization:', error);
      }
    }

    return () => {
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }
    };
  }, [type, config, width, height]);

  return (
    <div 
      ref={containerRef}
      id="jxgbox"
      className="mx-auto my-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
      style={{ width, height }}
    />
  );
};