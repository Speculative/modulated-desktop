/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import { Fragment } from "react";
import { Desktop } from "./Desktop";

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

export default App;
