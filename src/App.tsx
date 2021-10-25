/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import { Fragment } from "react";

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
      <div
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <p
          css={css`
            font-size: 48;
          `}
        >
          Hello!
        </p>
      </div>
    </Fragment>
  );
}

export default App;
