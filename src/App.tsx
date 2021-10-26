/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import { Fragment, PropsWithChildren, useState, useReducer } from "react";

function App() {
  return (
    <Fragment>
      <Global
        styles={css`
          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }

          html,
          body {
            width: 100%;
            height: 100%;
          }

          #root {
            width: 100%;
            height: 100%;
          }
        `}
      />
      <Desktop />
    </Fragment>
  );
}

interface WindowConfig {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
}

type WindowConfigState = {
  [windowId: string]: WindowConfig;
};

type WindowAction =
  | {
      type: "move";
      windowId: string;
      x: number;
      y: number;
    }
  | {
      type: "close";
      windowId: string;
    };

function windowConfigReducer(state: WindowConfigState, action: WindowAction) {
  switch (action.type) {
    case "move":
      if (!(action.windowId in state)) {
        return state;
      }
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          x: action.x,
          y: action.y,
        },
      };
    case "close":
      if (!(action.windowId in state)) {
        return state;
      }
      return Object.fromEntries(
        Object.entries(state).filter(([id]) => id !== action.windowId)
      );
  }
}

function Desktop() {
  const [nextWindowId, setNextWindowId] = useState(1);
  const [windowConfig, dispatchWindowConfig] = useReducer(windowConfigReducer, {
    "window-0": { x: 100, y: 100, z: 0, w: 400, h: 300 },
    "window-1": { x: 200, y: 200, z: 1, w: 400, h: 300 },
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
      {Object.entries(windowConfig).map(([windowId, { x, y, z, w, h }]) => (
        <Window
          key={windowId}
          x={x}
          y={y}
          z={z}
          w={w}
          h={h}
          onReposition={(x, y) => {
            dispatchWindowConfig({ type: "move", windowId, x, y });
          }}
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
      ))}
    </div>
  );
}

function Window({
  x,
  y,
  z,
  w,
  h,
  children,
  onReposition,
}: PropsWithChildren<{
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  onReposition: (x: number, y: number) => void;
}>) {
  const [dragging, setDragging] = useState(false);
  const [[dragOffX, dragOffY], setDragOffset] = useState([0, 0] as [
    number,
    number
  ]);

  return (
    <div
      css={css`
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        z-index: ${z};
        width: ${w}px;
        height: ${h}px;

        display: flex;
        flex-direction: column;
        overflow: hidden;

        font-family: Iosevka;
        border: 2px solid white;
        border-radius: 4px;
        background: black;
      `}
    >
      <header
        css={css`
          width: 100%;
          border-bottom: 2px solid white;
          font-size: 20px;
          padding: 4px 8px;

          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        `}
        onMouseDown={(e) => {
          setDragging(true);
          setDragOffset([e.clientX - x, e.clientY - y]);
        }}
        onMouseUp={() => setDragging(false)}
        // This should be global, otherwise you can drag too fast and escape this box
        onMouseMove={
          dragging
            ? (e) => onReposition(e.clientX - dragOffX, e.clientY - dragOffY)
            : undefined
        }
      >
        Window
        <nav>
          <button
            css={css`
              width: 20px;
              height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;

              color: white;
              background: none;
              border: 2px solid white;
            `}
          >
            X
          </button>
        </nav>
      </header>
      <div
        css={css`
          flex-grow: 1;
          flex-shrink: 1;
          min-height: 0;
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default App;
