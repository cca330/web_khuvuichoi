import React, { useEffect, useRef, useState } from "react";
import "../styles/revealOverlay.css";

export default function RevealOverlay({ onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [hasClicked, setHasClicked] = useState(false);
  const [showHand, setShowHand] = useState(false);

  // Đường dẫn ảnh cánh tay trong thư mục public
  const armImage = "/arm.png";

  const [handStyle, setHandStyle] = useState({
    transform: "translateY(100%)",
    opacity: 0,
  });
  const [animationComplete, setAnimationComplete] = useState(false);

  const animFrameId = useRef(null);
  const drawAngleRef = useRef(0);
  const isDrawingCompleteRef = useRef(false);

  const BASE_RADIUS = 220;

  const getDistortedPoint = (cx, cy, r, angle) => {
    const offset = Math.sin(angle * 3) * 0.08 + Math.cos(angle * 2) * 0.05;
    const currentRadius = r * (1 + offset);
    return {
      x: cx + Math.cos(angle) * currentRadius,
      y: cy + Math.sin(angle) * currentRadius,
    };
  };

  const drawProgressiveDistortedCircle = (ctx, cx, cy, r, angleLimit) => {
    ctx.beginPath();
    const steps = 120;
    let started = false;

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      if (angle <= angleLimit) {
        const pt = getDistortedPoint(cx, cy, r, angle);
        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
    }

    if (angleLimit >= Math.PI * 2) {
      ctx.closePath();
    }
  };

  const handleOverlayClick = () => {
    if (hasClicked) return;
    setHasClicked(true);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setShowHand(true);

    setTimeout(() => {
      setHandStyle({
        transform: "translateY(0)",
        opacity: 1,
        transition:
          "transform 0.85s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease-out",
      });
    }, 500);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      const drawAndReveal = () => {
        if (drawAngleRef.current <= Math.PI * 2) {
          drawAngleRef.current += 0.06;

          const pt = getDistortedPoint(
            centerX,
            centerY,
            BASE_RADIUS,
            drawAngleRef.current,
          );
          const offsetX = pt.x - centerX;
          const offsetY = pt.y - centerY;

          setHandStyle({
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            opacity: 1,
            transition: "transform 0.02s linear",
          });

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = "destination-out";

          ctx.save();
          const grad = ctx.createRadialGradient(
            centerX,
            centerY,
            Math.max(0, BASE_RADIUS - 35),
            centerX,
            centerY,
            BASE_RADIUS + 20,
          );
          grad.addColorStop(0, "rgba(0,0,0,1)");
          grad.addColorStop(0.8, "rgba(0,0,0,0.85)");
          grad.addColorStop(1, "rgba(0,0,0,0)");

          ctx.fillStyle = grad;
          drawProgressiveDistortedCircle(
            ctx,
            centerX,
            centerY,
            BASE_RADIUS + 20,
            drawAngleRef.current,
          );
          ctx.fill();
          ctx.restore();

          ctx.globalCompositeOperation = "source-over";

          animFrameId.current = requestAnimationFrame(drawAndReveal);
        } else {
          isDrawingCompleteRef.current = true;

          setHandStyle({
            transform: "translateY(100%)",
            opacity: 0,
            transition:
              "transform 0.7s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease-out",
          });

          setTimeout(() => {
            startRevealAnimation();
          }, 1000);
        }
      };

      drawAndReveal();
    }, 1450);
  };

  const startRevealAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const targetRadius = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    const startRadius = BASE_RADIUS;

    const DURATION_MS = 1200;
    const startTime = performance.now();

    cancelAnimationFrame(animFrameId.current);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutCubic(t);

      const currentRadius = startRadius + (targetRadius - startRadius) * eased;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "destination-out";
      ctx.save();
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        Math.max(0, currentRadius - 35),
        centerX,
        centerY,
        currentRadius + 20,
      );
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.8, "rgba(0,0,0,0.85)");
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      drawProgressiveDistortedCircle(
        ctx,
        centerX,
        centerY,
        currentRadius + 20,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();

      ctx.globalCompositeOperation = "source-over";

      if (t < 1) {
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
        setShowHand(false);
        if (onComplete) onComplete();
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (!isDrawingCompleteRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animFrameId.current);
    };
  }, [hasClicked]);

  if (animationComplete) return null;

  return (
    <div
      className={`reveal-overlay ${hasClicked ? "pointer-disabled" : ""}`}
      onClick={handleOverlayClick}
      ref={containerRef}
    >
      <canvas ref={canvasRef} className="reveal-canvas" />

      {!hasClicked && (
        <div className="click-prompt">
          <div className="prompt-ripple"></div>
          <span>CHẠM ĐỂ KHÁM PHÁ</span>
        </div>
      )}

      {showHand && (
        <div className="virtual-hand" style={handStyle}>
          <img
            src={armImage}
            alt="Virtual Hand"
            className="arm-image-element"
          />
        </div>
      )}
    </div>
  );
}
