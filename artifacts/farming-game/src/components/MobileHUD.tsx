import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import type { GameState } from "../game/Game";
import { isCropPlantingUnlocked, seedUnlockLevel } from "../game/Game";
import {
  MOBILE_ACTION_ROW_PX,
  MOBILE_HOTBAR_HOME_PX,
  MOBILE_HOTBAR_OTHER_PX,
} from "../constants/mobileChrome";

interface ToolDef { id: string; label: string; img: string; }
interface Props {
  ds: GameState;
  tools: readonly ToolDef[];
  onSelectTool: (id: string) => void;
  onOpenPanel: (panel: string) => void;
  onOpenWorldMap: () => void;
  currentMap: string;
  gold: number;
  level: number;
  claimableCount: number;
  boostCharges?: number;
  onBoost?: () => void;
  isGuest?: boolean;
  /** Small contextual buttons (SHOP, ACT, CAST, emotes…) — right side of action row; never overlaps MAP */
  mapActions?: ReactNode;
}

const TOOL_ICONS: Record<string, string> = {
  sickle: "/celurit_1774349990712.png",
  axe: "/kapak_1_1774349990715.png",
  "axe-large": "/kapak_1774349990716.png",
  water: "/teko_siram.png",
  "wheat-seed": "/wheat.png",
  "tomato-seed": "/tomato.png",
  "carrot-seed": "/carrot.png",
  "pumpkin-seed": "/pumpkin.png",
};

/** Reusable compact control for map-specific actions from parent */
export const mobileHudActionBtnStyle: CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 4,
  padding: "3px 7px",
  minHeight: 26,
  maxHeight: 28,
  lineHeight: 1.2,
  borderRadius: 6,
  border: "2px solid #5C4033",
  background: "linear-gradient(180deg,#A07844 0%,#6B4520 100%)",
  color: "#FFF5E0",
  cursor: "pointer",
  touchAction: "manipulation",
  flexShrink: 0,
  boxShadow: "0 2px 0 #2a1808",
};

export const mobileHudAccentBtnStyle: CSSProperties = {
  ...mobileHudActionBtnStyle,
  background: "linear-gradient(180deg, #FFD700 0%, #C8A020 100%)",
  borderColor: "#8d6e15",
  color: "#3E2723",
};

function nonHomeHint(map: string): string {
  if (map === "city") return "CITY - MAP opens world · SHOP for seeds";
  if (map === "fishing") return "FISHING - CAST / PULL on the right";
  if (map === "garden") return "GARDEN - emotes on the right · MAP to travel";
  if (map === "suburban") return "SUBURBAN - walk to signs · MAP to travel";
  return "MAP opens world map";
}

export default function MobileHUD({
  ds, tools, onSelectTool, onOpenPanel, onOpenWorldMap, currentMap,
  gold, level, claimableCount, boostCharges = 0, onBoost, isGuest = false,
  mapActions,
}: Props) {
  const activeTool = ds.player.tool;
  const SLOT = 34;
  const SLOT_IMG = 22;
  const isHome = currentMap === "home";
  const hotbarH = isHome ? MOBILE_HOTBAR_HOME_PX : MOBILE_HOTBAR_OTHER_PX;

  return (
    <>
      <style>{`
        @keyframes mwPulse { 0%,100% { box-shadow: 0 4px 15px rgba(171,159,242,0.4); } 50% { box-shadow: 0 4px 25px rgba(171,159,242,0.1); } }
        .ms { 
          width: ${SLOT}px; height: ${SLOT}px; border-radius: 12px; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; position: relative; 
          transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
          box-shadow: 0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5); 
          touch-action: manipulation; border: 2px solid #FFFFFF; 
          background: rgba(255,255,255,0.8); flex-shrink: 0; 
        }
        .ms:active { transform: scale(0.85); background: #FFF; }
        .msa { 
          background: linear-gradient(135deg, #FF7EB3 0%, #FF758C 100%) !important; 
          border-color: #FFFFFF !important; 
          box-shadow: 0 8px 16px rgba(255, 126, 179, 0.3) !important; 
        }
        .mb { 
          font-family: 'Outfit', sans-serif; font-weight: 800;
          background: rgba(255,255,255,0.9); border: 2px solid #FFFFFF; 
          border-radius: 12px; color: #2D1B0D; cursor: pointer; 
          box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 4px 10px; 
          font-size: 8px; touch-action: manipulation; flex-shrink: 0; 
          line-height: 1.2; transition: all 0.15s;
        }
        .mb:active { transform: translateY(2px); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "8px 12px",
        paddingTop: `max(8px, env(safe-area-inset-top))`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(180deg, rgba(12,20,37,0.4) 0%, transparent 100%)",
        zIndex: 1260,
        pointerEvents: "auto",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <div className="mb" style={{ background: "linear-gradient(135deg, #65C7F7 0%, #0052D4 100%)", color: "#FFF", borderColor: "rgba(255,255,255,0.3)" }}>LV {level}</div>
          <div className="mb" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", border: "2px solid #FFF" }}>{gold} G</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "nowrap", flexShrink: 1, justifyContent: "flex-end" }}>
          {isGuest && (
            <button
              type="button"
              className="mb"
              aria-label="Connect Solana wallet"
              style={{
                animation: "mwPulse 2s infinite",
                background: "linear-gradient(135deg, #ab9ff2 0%, #512da8 100%)",
                borderColor: "#FFFFFF",
                color: "#FFF",
                padding: "6px 12px",
                fontSize: 7,
              }}
              onClick={() => onOpenPanel("wallet")}
            >
              CONNECT
            </button>
          )}
          {!isGuest && (
            <button
              type="button"
              className="mb"
              aria-label="Wallet"
              style={{ 
                padding: "6px 12px", 
                background: "linear-gradient(135deg, #2D1B0D 0%, #000 100%)", 
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5
              }}
              onClick={() => onOpenPanel("wallet")}
            >
              <div style={{ fontSize: 7, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px" }}>
                {ds.player.walletAddress ? `${ds.player.walletAddress.slice(0, 4)}..${ds.player.walletAddress.slice(-4)}` : "WALLET"}
              </div>
            </button>
          )}
          <button className="mb" style={{ position: "relative", color: "#FF758C" }} onClick={() => onOpenPanel("quests")}>
            TASKS {claimableCount > 0 ? `(${claimableCount})` : ""}
          </button>
          <button className="mb" onClick={() => onOpenPanel("settings")}>OPTS</button>
        </div>
      </div>

      {/* Action row: MAP on every map + contextual buttons (no overlap) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${hotbarH + 4}px)`,
          height: MOBILE_ACTION_ROW_PX,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          gap: 12,
          zIndex: 1270,
          pointerEvents: "auto",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={() => { onOpenWorldMap(); }}
          className="mb"
          style={{
            background: "linear-gradient(135deg, #65C7F7 0%, #0052D4 100%)",
            color: "#FFF",
            fontSize: 9,
            padding: "6px 14px",
            borderRadius: "16px",
            boxShadow: "0 8px 16px rgba(0, 82, 212, 0.25)",
          }}
        >
          WORLD MAP
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            flex: 1,
            minWidth: 0,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {mapActions}
        </div>
      </div>

      {/* Bottom hotbar / hint */}
      <div style={{
        position: "absolute",
        bottom: `calc(env(safe-area-inset-bottom, 0px) + 8px)`,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 500,
        zIndex: 1260,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(10px)",
        padding: "8px 12px",
        borderRadius: "24px",
        border: "2px solid #FFFFFF",
        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
        pointerEvents: "auto",
        overflowX: isHome ? "auto" : "hidden",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        justifyContent: isHome ? "flex-start" : "center",
        minHeight: isHome ? 56 : 40,
      }}>
        {!isHome && (
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 8,
              fontWeight: 600,
              color: "#2D1B0D",
              textAlign: "center",
              lineHeight: 1.4,
              opacity: 0.8,
            }}
          >
            {nonHomeHint(currentMap)}
          </div>
        )}
        {isHome && tools.map((t, i) => {
          const isActive = activeTool === t.id;
          const seedCount = t.id.endsWith("-seed") ? (ds.player.inventory[t.id] ?? 0) : null;
          const cooldown = ds.seedCooldowns?.[t.id] ?? 0;
          const cropGate = t.id.endsWith("-seed") ? (t.id.replace("-seed", "") as any) : null;
          const seedLocked = cropGate && !isCropPlantingUnlocked(cropGate, ds.player.level, ds.farmBalancePreset);
          const neededLvl = cropGate ? seedUnlockLevel(cropGate, ds.farmBalancePreset) : 0;
          return (
            <div
              key={t.id}
              className={`ms${isActive ? " msa" : ""}`}
              role="button"
              tabIndex={0}
              onPointerUp={(ev) => {
                ev.stopPropagation();
                onSelectTool(t.id);
              }}
              style={{ opacity: seedLocked ? 0.4 : 1 }}
            >
              <div style={{
                position: "absolute", top: -8, left: -4,
                background: "#FFF",
                border: "1.5px solid rgba(0,0,0,0.05)", borderRadius: "8px",
                width: 14, height: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 2,
              }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: isActive ? "#FF758C" : "#666", fontFamily: "'Outfit', sans-serif" }}>{i + 1}</span>
              </div>
              <img
                src={TOOL_ICONS[t.id] || t.img}
                alt={t.label}
                style={{ width: SLOT_IMG + 4, height: SLOT_IMG + 4, objectFit: "contain", opacity: isActive ? 1 : 0.8 }}
              />
              {seedCount !== null && seedCount > 0 && (
                <div style={{
                  position: "absolute", bottom: -4, right: -4,
                  background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                  border: "1.5px solid #FFF", borderRadius: "10px",
                  padding: "1px 5px", fontSize: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FFF", fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}>{seedCount}</div>
              )}
              {cooldown > 0 && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "12px",
                  background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 10, color: "#FFF",
                }}>{Math.ceil(cooldown / 1000)}</div>
              )}
              {seedLocked && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "12px",
                  background: "rgba(0,0,0,0.4)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  zIndex: 10,
                }}>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>LV{neededLvl}</span>
                </div>
              )}
            </div>
          );
        })}
        {isHome && (
          <div
            className="ms"
            role="button"
            tabIndex={0}
            onPointerUp={(ev) => {
              ev.stopPropagation();
              onBoost?.();
            }}
            style={{
              background: boostCharges > 0 ? "linear-gradient(135deg,#FFE4B5 0%,#FFD700 100%)" : "rgba(0,0,0,0.1)",
              borderColor: boostCharges > 0 ? "#FFF" : "transparent",
              opacity: boostCharges > 0 ? 1 : 0.5,
              width: 44,
            }}
          >
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 8, fontWeight: 800, color: boostCharges > 0 ? "#2D1B0D" : "#888",
              textAlign: "center", lineHeight: 1.2,
            }}>
              BOOST<br/>{boostCharges}
            </div>
          </div>
        )}
      </div>

    </>
  );
}
