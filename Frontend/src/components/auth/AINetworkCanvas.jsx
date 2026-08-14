import React, { useEffect, useRef } from 'react';

export function AINetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate network nodes
    const nodeCount = 32;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      baseRadius: 1.5 + Math.random() * 1.5,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.02,
    }));

    const maxDistance = 110;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update positions & draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        // Motion update
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        // Soft bounce boundaries
        if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

        // Pulse phase update
        nodeA.pulsePhase += nodeA.pulseSpeed;

        // Connect lines to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(196, 181, 253, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes with soft pulsing glow
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase);
        const currentRadius = node.baseRadius + pulse * 0.6;
        const currentAlpha = 0.5 + pulse * 0.35;

        // Node Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${currentAlpha * 0.3})`;
        ctx.fill();

        // Node Center Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 233, 254, ${currentAlpha})`;
        ctx.shadowColor = 'rgba(192, 132, 252, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full opacity-40"
      aria-hidden="true"
    />
  );
}
