/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { PropsWithChildren, useState } from "react";

export function Window({
  x,
  y,
  z,
  w,
  h,
  children,
  onReposition,
  onClose,
  onFocus,
}: PropsWithChildren<{
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  onReposition: (x: number, y: number) => void;
  onClose: () => void;
  onFocus: () => void;
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
      onMouseDown={onFocus}
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
            onClick={onClose}
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
