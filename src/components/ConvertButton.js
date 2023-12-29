import { useEffect, useRef } from "react";

export function ConvertButton({ onConvertBtnClick, checkConditions }) {
  const buttonEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (!checkConditions) {
          return;
        }

        if (e.code === "Enter") {
          onConvertBtnClick(true);
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [checkConditions, onConvertBtnClick]
  );

  return (
    <div
      className="convert-btn"
      onClick={onConvertBtnClick}
      disabled={checkConditions()}
      ref={buttonEl}
    >
      Convert
    </div>
  );
}
