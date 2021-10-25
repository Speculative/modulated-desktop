/** @jsxImportSource @emotion/react */

// For now, have to specify this at the top of every file using emotion
// https://github.com/emotion-js/emotion/issues/2041
// https://github.com/facebook/create-react-app/issues/9847

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
