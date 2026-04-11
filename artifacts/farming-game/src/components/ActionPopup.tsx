import { useEffect, useState } from "react";

export interface ActionPopupData {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
  color?: string;
  accent?: string;
  minimal?: boolean;
}

interface Props {
  popup: ActionPopupData | null;
  onDone: () => void;
}

export default function ActionPopup({ popup, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popup) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 350);
    }, 2200);
    return () => clearTimeout(t);
  }, [popup?.id]);

  if (!popup) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "42%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.7})`,
        opacity: visible ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        zIndex: 8000,
        pointerEvents: "none",
        textAlign: "center",
        minWidth: 260,
      }}
    >
      {/* Modern Premium Popup Box */}
      <div style={{
        background: popup.minimal ? "transparent" : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,240,240,0.95) 100%)",
        border: popup.minimal ? "none" : "3px solid #FFFFFF",
        borderRadius: 24,
        padding: popup.minimal ? "8px 0" : "20px 32px",
        boxShadow: popup.minimal ? "none" : "0 20px 50px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.8)",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {/* Icon label — only show if not minimal */}
        {!popup.minimal && (
          <div style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #FF7EB3 0%, #FF758C 100%)",
            borderRadius: 999,
            padding: "4px 16px",
            fontSize: 10,
            fontWeight: 800,
            color: "#FFF",
            textTransform: "uppercase",
            marginBottom: 12,
            letterSpacing: "0.1em",
            boxShadow: "0 4px 10px rgba(255, 117, 140, 0.3)",
          }}>
            {popup.icon}
          </div>
        )}
        {/* Title */}
        <div style={{
          fontSize: popup.minimal ? 24 : 18,
          fontWeight: 800,
          color: popup.minimal ? "#FFD700" : "#2D1B0D",
          textShadow: popup.minimal ? "2px 2px 0 #000" : "none",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}>
          {popup.title}
        </div>
        {/* Subtitle */}
        {popup.subtitle && (
          <div style={{
            fontSize: popup.minimal ? 11 : 12,
            fontWeight: 500,
            color: popup.minimal ? "#FFF" : "#666",
            marginTop: 6,
            lineHeight: 1.4,
            opacity: 0.9,
          }}>
            {popup.subtitle}
          </div>
        )}
      </div>
      <style>{`
        @keyframes popupRing {
          from { transform: scale(0.9); opacity: 0.8; border-width: 4px; }
          to { transform: scale(1.5); opacity: 0; border-width: 1px; }
        }
      `}</style>
      {/* Premium focus ring burst */}
      <div style={{
        position: "absolute", inset: -15, borderRadius: 32,
        border: "3px solid rgba(255,126,179,0.5)",
        animation: "popupRing 0.6s ease-out forwards",
        pointerEvents: "none",
      }} />
    </div>
  );
}
