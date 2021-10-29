/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useReducer } from "react";

import { Window } from "./Window";

interface WindowConfig {
  x: number;
  y: number;
  w: number;
  h: number;
}

type WindowConfigState = {
  configs: { [windowId: string]: WindowConfig };
  order: string[];
  nextWindowId: number;
};

type WindowAction =
  | {
      type: "open";
      x: number;
      y: number;
      w: number;
      h: number;
    }
  | {
      type: "move";
      windowId: string;
      x: number;
      y: number;
    }
  | {
      type: "close";
      windowId: string;
    }
  | {
      type: "focus";
      windowId: string;
    };

function windowConfigReducer(
  state: WindowConfigState,
  action: WindowAction
): WindowConfigState {
  switch (action.type) {
    case "open":
      return {
        ...state,
        configs: {
          ...state.configs,
          [`window-${state.nextWindowId}`]: {
            x: action.x,
            y: action.y,
            w: action.w,
            h: action.h,
          },
        },
        order: [...state.order, `window-${state.nextWindowId}`],
        nextWindowId: state.nextWindowId + 1,
      };
    case "move":
      if (!(action.windowId in state.configs)) {
        return state;
      }
      return {
        ...state,
        configs: {
          ...state.configs,
          [action.windowId]: {
            ...state.configs[action.windowId],
            x: action.x,
            y: action.y,
          },
        },
      };
    case "close":
      if (!(action.windowId in state.configs)) {
        return state;
      }
      return {
        ...state,
        configs: Object.fromEntries(
          Object.entries(state.configs).filter(([id]) => id !== action.windowId)
        ),
      };
    case "focus":
      if (!(action.windowId in state.configs)) {
        return state;
      }
      return {
        ...state,
        order: [
          ...state.order.filter((w) => w !== action.windowId),
          action.windowId,
        ],
      };
  }
}

function DesktopIcon({
  name,
  icon,
  onOpen,
}: {
  name: string;
  icon: string;
  onOpen: () => void;
}) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 64px;
        align-items: center;
        cursor: default;
        user-select: none;
      `}
      onDoubleClick={onOpen}
    >
      <div
        css={css`
          width: 48px;
          height: 48px;
          border: ${icon ? "none" : "1px dashed grey"};
        `}
      >
        {icon && <img src={icon} />}
      </div>
      <div
        css={css`
          text-align: center;
        `}
      >
        {name}
      </div>
    </div>
  );
}

export function Desktop() {
  const [windowConfig, dispatchWindowConfig] = useReducer(windowConfigReducer, {
    configs: {
      "window-0": { x: 100, y: 100, w: 400, h: 300 },
      "window-1": { x: 200, y: 200, w: 400, h: 300 },
    },
    order: ["window-0", "window-1"],
    nextWindowId: 2,
  });

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        position: relative;

        background: black;
        color: white;
      `}
    >
      <DesktopIcon
        name="new window"
        icon=""
        onOpen={() =>
          dispatchWindowConfig({ type: "open", x: 100, y: 100, w: 400, h: 300 })
        }
      />

      {Object.entries(windowConfig.configs).map(
        ([windowId, { x, y, w, h }]) => (
          <Window
            key={windowId}
            x={x}
            y={y}
            z={windowConfig.order.indexOf(windowId)}
            w={w}
            h={h}
            onReposition={(x, y) =>
              dispatchWindowConfig({ type: "move", windowId, x, y })
            }
            onClose={() => dispatchWindowConfig({ type: "close", windowId })}
            onFocus={() => dispatchWindowConfig({ type: "focus", windowId })}
          >
            <div
              css={css`
                width: 100%;
                height: 100%;
                padding: 8px;
                overflow-y: auto;

                font-size: 24px;
              `}
            >
              <p>Hello! This is a window!</p>
              <p>I wonder what sort of weird things we&apos;ll see here?</p>
              <br />
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
              <p>words words words words words</p>
            </div>
          </Window>
        )
      )}
    </div>
  );
}
