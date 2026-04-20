import React, { useRef, useEffect } from 'react';
import './WeatherAnimation.css';

const getType = (id) => {
  if (!id) return 'clear';
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800) return 'clear';
  return 'cloudy';
};

const COUNTS = { rain: 180, storm: 200, drizzle: 100, snow: 130, fog: 18, cloudy: 12, clear: 40 };

const WeatherAnimation = ({ weatherId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const type = getType(weatherId);
    let animId;
    let particles = [];
    let frame = 0;

    const makeParticle = () => {
      const w = canvas.width;
      const h = canvas.height;
      switch (type) {
        case 'rain':
        case 'storm':
          return { x: Math.random() * w, y: Math.random() * -h, vx: -1.5, vy: 12 + Math.random() * 8, len: 15, op: 0.4 + Math.random() * 0.3 };
        case 'drizzle':
          return { x: Math.random() * w, y: Math.random() * -h, vx: -0.5, vy: 4 + Math.random() * 3, len: 8, op: 0.25 + Math.random() * 0.2 };
        case 'snow':
          return { x: Math.random() * w, y: Math.random() * -h, vx: (Math.random() - 0.5) * 0.8, vy: 1 + Math.random() * 2, r: 1.5 + Math.random() * 3, op: 0.5 + Math.random() * 0.5, drift: 0 };
        case 'fog':
          return { x: Math.random() * w, y: Math.random() * h, vx: 0.2 + Math.random() * 0.3, rx: 120 + Math.random() * 160, ry: 25 + Math.random() * 35, op: 0.04 + Math.random() * 0.05 };
        case 'cloudy':
          return { x: Math.random() * w, y: 40 + Math.random() * (h * 0.35), vx: 0.12 + Math.random() * 0.18, rx: 100 + Math.random() * 120, ry: 35 + Math.random() * 45, op: 0.07 + Math.random() * 0.07 };
        case 'clear':
          return { x: Math.random() * w, y: h + 10, vx: (Math.random() - 0.5) * 0.4, vy: -(0.3 + Math.random() * 0.6), r: 0.5 + Math.random() * 1.5, op: 0.1 + Math.random() * 0.25 };
        default:
          return null;
      }
    };

    const init = () => {
      particles = [];
      const count = COUNTS[type] || 0;
      for (let i = 0; i < count; i++) {
        const p = makeParticle();
        if (!p) continue;
        if (type !== 'fog' && type !== 'cloudy' && type !== 'clear') {
          p.y = Math.random() * canvas.height;
        }
        particles.push(p);
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const drawSun = (t) => {
      const cx = canvas.width * 0.85;
      const cy = canvas.height * 0.15;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.08;
        const len = 55 + Math.sin(t * 2 + i) * 15;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 24, cy + Math.sin(angle) * 24);
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(255,215,0,${0.1 + Math.sin(t + i) * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      grd.addColorStop(0, 'rgba(255,215,0,0.18)');
      grd.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const t = frame * 0.016;

      if (type === 'clear') drawSun(t);

      if (type === 'storm' && frame % 130 === 0 && Math.random() > 0.45) {
        ctx.fillStyle = 'rgba(200,200,255,0.07)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((p, i) => {
        if (type === 'rain' || type === 'storm' || type === 'drizzle') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.len);
          ctx.strokeStyle = `rgba(174,214,241,${p.op})`;
          ctx.lineWidth = type === 'drizzle' ? 0.8 : 1.2;
          ctx.stroke();
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > canvas.height + 20 || p.x < -20) {
            particles[i] = makeParticle();
          }
        } else if (type === 'snow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.op})`;
          ctx.fill();
          p.drift += 0.02;
          p.x += p.vx + Math.sin(p.drift) * 0.4;
          p.y += p.vy;
          if (p.y > canvas.height + 10) {
            particles[i] = makeParticle();
          }
        } else if (type === 'fog' || type === 'cloudy') {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,210,220,${p.op})`;
          ctx.fill();
          p.x += p.vx;
          if (p.x > canvas.width + p.rx) p.x = -p.rx;
        } else if (type === 'clear') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,215,0,${p.op})`;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            particles[i] = makeParticle();
          }
        }
      });

      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [weatherId]);

  return <canvas ref={canvasRef} className="weather-canvas" />;
};

export default WeatherAnimation;
