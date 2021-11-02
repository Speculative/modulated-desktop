/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState } from "react";
import { observer } from "mobx-react-lite";

import { appStore } from "./store/apps";
import { Window } from "./Window";
import { PortType } from "./store/portSpec";

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

const fakePortSpec = {
  inputs: {
    x: PortType.Number,
    y: PortType.Number,
  },
  outputs: {
    x: PortType.Number,
    y: PortType.Number,
  },
};

export const Desktop = observer(() => {
  const [nextWindowNum, setNextWindowNum] = useState(0);
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
        onOpen={() => {
          appStore.registerAppInstance(`window-${nextWindowNum}`, fakePortSpec);
          setNextWindowNum(nextWindowNum + 1);
        }}
      />

      {Array.from(appStore.windows.windows.keys()).map((windowId) => (
        <Window key={windowId} windowId={windowId}>
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
});
