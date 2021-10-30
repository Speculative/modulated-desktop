/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {
  PropsWithChildren,
  useState,
  useRef,
  useEffect,
  Fragment,
} from "react";
import { EmotionIcon } from "@emotion-icons/emotion-icon";
import { Workflow, X, ChevronLeft, Circle } from "emotion-icons/octicons";

function TitleButton({
  extraCss,
  onClick,
  icon: Icon,
  description,
}: {
  extraCss?: ReturnType<typeof css>;
  icon: EmotionIcon;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      css={css`
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;

        color: white;
        background: none;
        border: 1px solid white;

        cursor: pointer;

        ${extraCss};
      `}
      onClick={onClick}
      title={description}
    >
      <Icon />
    </button>
  );
}

function Frame({
  title,
  children,
  onDragStart,
}: PropsWithChildren<{
  title: JSX.Element;
  onDragStart: (offX: number, offY: number) => void;
}>) {
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;

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
        `}
        onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      >
        {title}
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

const plugLine = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const plug = css`
  width: 16px;
  height: 16px;
`;

const plugName = css`
  margin-left: 5px;
`;

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
  // Dragging
  const [dragging, setDragging] = useState(false);
  const onRepositionRef = useRef(onReposition);
  const setDraggingRef = useRef(setDragging);
  useEffect(() => {
    onRepositionRef.current = onReposition;
    setDraggingRef.current = setDragging;
  }, [onReposition, setDragging]);

  const handleDrag = (mouseX: number, mouseY: number) => {
    // References to setDragging, x, and y use the right closure
    setDragging(true);

    const offX = mouseX - x;
    const offY = mouseY - y;

    // But in these other callbacks, the closure will be stale,
    // so we have to wrap them in refs

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
  };

  // Ports
  const [showPorts, setShowPorts] = useState(false);

  return (
    <Fragment>
      <div
        css={css`
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          z-index: ${z};
          width: ${w}px;
          height: ${h}px;

          cursor: ${dragging ? "grabbing" : "auto"};
        `}
        onMouseDown={onFocus}
      >
        <Frame
          title={
            <div
              css={css`
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 4px 8px;
                cursor: ${dragging ? "grabbing" : "grab"};
              `}
            >
              <span>Window</span>
              <nav
                css={css`
                  display: flex;
                  flex-direction: row;
                `}
              >
                <TitleButton
                  extraCss={css`
                    padding: 4px;
                  `}
                  description="Toggle ports panel"
                  icon={Workflow}
                  onClick={() => setShowPorts(!showPorts)}
                />
                <TitleButton
                  extraCss={css`
                    margin-left: 5px;
                  `}
                  description="Close window"
                  icon={X}
                  onClick={onClose}
                />
              </nav>
            </div>
          }
          onDragStart={handleDrag}
        >
          {children}
        </Frame>
      </div>
      {showPorts && (
        <div
          css={css`
            position: absolute;
            left: ${x + w}px;
            top: ${y}px;
            z-index: ${z};
            min-width: 100px;
            min-height: 100px;
            max-width: ${w}px;
            max-height: ${h}px;
          `}
          onMouseDown={onFocus}
        >
          <Frame
            title={
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                  padding: 4px 8px;
                  cursor: ${dragging ? "grabbing" : "grab"};
                `}
              >
                <TitleButton
                  extraCss={css`
                    margin-right: 5px;
                  `}
                  icon={ChevronLeft}
                  description="Close ports panel"
                  onClick={() => setShowPorts(false)}
                />
                Ports
              </div>
            }
            onDragStart={handleDrag}
          >
            <div
              css={css`
                padding: 8px;
              `}
            >
              <h1
                css={css`
                  font-size: 20px;
                  font-weight: normal;
                `}
              >
                Inputs
              </h1>
              <hr
                css={css`
                  margin-bottom: 5px;
                `}
              />
              <ul
                css={css`
                  list-style: none;
                `}
              >
                <li css={plugLine}>
                  <Circle css={plug} />
                  <span css={plugName}>X</span>
                </li>
                <li css={plugLine}>
                  <Circle css={plug} />
                  <span css={plugName}>Y</span>
                </li>
              </ul>
              <h1
                css={css`
                  font-size: 20px;
                  font-weight: normal;
                  margin-top: 10px;
                `}
              >
                Outputs
              </h1>
              <hr
                css={css`
                  margin-bottom: 5px;
                `}
              />
              <ul
                css={css`
                  list-style: none;
                `}
              >
                <li css={plugLine}>
                  <Circle css={plug} />
                  <span css={plugName}>X</span>
                </li>
                <li css={plugLine}>
                  <Circle css={plug} />
                  <span css={plugName}>Y</span>
                </li>
              </ul>
            </div>
          </Frame>
        </div>
      )}
    </Fragment>
  );
}
