import { useState, useEffect, useRef } from "react";
import currencySymbols from "../data/currencySymbols";

export function InputField({
  fromCur,
  toCur,
  amount,
  formattedAmount,
  convertedAmount,
  formattedConvertedAmount,
  onSetAmount,
  isLoading,
  initial,
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (
          document.activeElement === inputEl.current ||
          (amount !== 0 && initial)
        ) {
          return;
        }
        if (e.code === "Enter") {
          inputEl.current.focus();
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [amount, initial]
  );

  useEffect(
    function () {
      if (
        amount === "" ||
        amount === 0 ||
        fromCur === "" ||
        toCur === "" ||
        isLoading ||
        initial
      ) {
        document.title = "Currency Converter";
        return;
      }
      document.title = `${formattedAmount} ${fromCur} is ${formattedConvertedAmount} ${toCur}`;

      return function () {
        document.title = "Currency Converter";
      };
    },
    [
      fromCur,
      toCur,
      amount,
      formattedAmount,
      formattedConvertedAmount,
      isLoading,
      initial,
    ]
  );

  useEffect(
    function () {
      if (amount === 0) {
        setShowPlaceholder(true);
      }
    },
    [amount]
  );

  return (
    <div className="input-text">
      <label className="label">Amount</label>
      <div className="input-group">
        <span className="cur">{currencySymbols[fromCur]}</span>
        <input
          type="text"
          value={amount}
          onChange={(e) => onSetAmount(e.target.value)}
          placeholder={showPlaceholder ? "Enter amount" : undefined}
          ref={inputEl}
        />
      </div>
    </div>
  );
}
