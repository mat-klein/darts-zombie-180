import { CSSProperties, useContext } from "react";
import { SquareButton } from "./SquareButton";

import close_icon from "../../assets/icons/material/close.svg";
import { MenuHeader } from "./MenuHeader";

import dart_logo from "../../assets/icons/for_free_family/dart_red_100.svg";
import { AppContext } from "../../state/AppState";

export type ModalProps = {
  children: React.ReactNode;
  style?: CSSProperties;
  hideClose?: boolean;
  onClose?: () => void;
};

export default function Modal({
  children,
  hideClose,
  onClose,
  style,
}: ModalProps) {
  const appState = useContext(AppContext);
  const screenState = appState.screen;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(140,140,140,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: 8,
          //alignItems: 'stretch',
          gap: 16,
          ...style,
        }}
      >
        {!hideClose ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <MenuHeader size="large">
              <img src={dart_logo} alt="" className="w-12 h-12" />
              <div className="flex flex-col justify-center w-full gap-1">
                <div className="flex flex-row h-9">
                  <span className="text-green-300 font-light text-4xl tracking-wide h-9">
                    zombie
                  </span>
                  <span className="text-red-400 font-bold text-4xl h-9">
                    180
                  </span>
                </div>
              </div>
            </MenuHeader>
            <SquareButton onClick={onClose}>
              <img src={close_icon} alt="" />
            </SquareButton>
          </div>
        ) : (
          <MenuHeader
            size="large"
            onClick={() => screenState.changeRoute("startgame")}
          >
            <img src={dart_logo} alt="" className="w-20 h-20" />
            <div className="flex flex-col justify-center w-full gap-1">
              <div className="flex flex-row h-10">
                <span className="text-green-300 font-light tracking-wide h-10">
                  zombie
                </span>
                <span className="text-red-400 font-bold h-10">180</span>
              </div>
              <div className="bg-grey-400 h-0.5"></div>
              <div>
                <div className="text-red-400 font-light text-base tracking-widest text-center leading-4 h-4">
                  NO BRAIN JUST DART
                </div>
              </div>
            </div>
          </MenuHeader>
        )}
        {children}
      </div>
    </div>
  );
}
