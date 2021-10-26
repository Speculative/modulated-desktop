/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import { Fragment, PropsWithChildren } from "react";

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

function Desktop() {
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
      <Window x={100} y={100} w={400} h={300}>
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
    </div>
  );
}

function Window({
  x,
  y,
  w,
  h,
  children,
}: PropsWithChildren<{ x: number; y: number; w: number; h: number }>) {
  return (
    <div
      css={css`
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${w}px;
        height: ${h}px;

        display: flex;
        flex-direction: column;
        overflow: hidden;

        font-family: Iosevka;
        border: 2px solid white;
        border-radius: 4px;
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
