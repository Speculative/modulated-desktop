/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { PropsWithChildren, useState, useRef, useEffect } from "react";

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

  const onRepositionRef = useRef(onReposition);
  const setDraggingRef = useRef(setDragging);

  useEffect(() => {
    onRepositionRef.current = onReposition;
    setDraggingRef.current = setDragging;
  }, [onReposition, setDragging]);

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

        cursor: ${dragging ? "grabbing" : "auto"};
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

          cursor: ${dragging ? "grabbing" : "grab"};
        `}
        onMouseDown={(e) => {
          setDragging(true);

          const offX = e.clientX - x;
          const offY = e.clientY - y;

          // We want dragging to be handled globally
          // Otherwise, you can drag too quickly and get outside the title bar
          const handleMouseMove = (e: MouseEvent) => {
            onRepositionRef.current(e.clientX - offX, e.clientY - offY);
          };
          const handleMouseUp = () => {
            setDraggingRef.current(false);

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
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
