import { useState, useEffect } from "react";
import { US, EU, IN } from "country-flag-icons/react/3x2";
import currencySymbols from "./currencySymbols";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [fromCur, setFromCur] = useState("");
  const [toCur, setToCur] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function onBtnClick() {
    setFromCur(toCur);
    setToCur(fromCur);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function convert() {
        try {
          setIsLoading(true);
          setError("");

          if (amount === 0 || amount === "" || toCur === "" || fromCur === "") {
            return;
          }

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching currency exchange rates!"
            );

          const data = await res.json();

          setConvertedAmount(data.rates[toCur]);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (isNaN(amount)) {
        setError("");
        setAmount(0);
        setConvertedAmount(0);
        return;
      }
      if (fromCur === toCur) {
        setError("");
        setConvertedAmount(amount);
        return;
      }

      convert();

      return function () {
        controller.abort();
      };
    },
    [amount, convertedAmount, fromCur, toCur]
  );

  return (
    <div className="App">
      <InputField
        fromCur={fromCur}
        toCur={toCur}
        amount={amount}
        convertedAmount={convertedAmount}
        onSetAmount={setAmount}
        isLoading={isLoading}
      />
      <Dropdown cur={fromCur} onSetCur={setFromCur} isLoading={isLoading} />
      <Switch onBtnClick={onBtnClick} isLoading={isLoading} />
      <Dropdown cur={toCur} onSetCur={setToCur} isLoading={isLoading} />

      {isLoading && <Loader />}
      {!isLoading && !error && (
        <Result
          toCur={toCur}
          fromCur={fromCur}
          convertedAmount={convertedAmount}
        />
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function InputField({
  fromCur,
  toCur,
  amount,
  convertedAmount,
  onSetAmount,
  isLoading,
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(
    function () {
      if (
        amount === "" ||
        amount === 0 ||
        fromCur === "" ||
        toCur === "" ||
        isLoading
      ) {
        document.title = "Currency Converter";
        return;
      }
      document.title = `${amount} ${fromCur} is ${convertedAmount} ${toCur}`;

      return function () {
        document.title = "Currency Converter";
      };
    },
    [fromCur, toCur, amount, convertedAmount, isLoading]
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
    <>
      <span>{currencySymbols[fromCur]}</span>
      <input
        type="text"
        value={amount}
        onChange={(e) => onSetAmount(e.target.value)}
        placeholder={showPlaceholder ? "Enter amount" : undefined}
      />
    </>
  );
}

function getIconFromCur(cur) {
  switch (cur) {
    case "USD":
      return <US title="United States" className="flag" />;
    case "EUR":
      return <EU title="Euro" className="flag" />;
    case "INR":
      return <IN title="Indian Rupee" className="flag" />;
    default:
      return null;
  }
}

function Dropdown({ cur, onSetCur, isLoading }) {
  return (
    <>
      {getIconFromCur(cur)}
      <select
        value={cur}
        onChange={(e) => onSetCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Select</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>
    </>
  );
}

function Switch({ onBtnClick, isLoading }) {
  return (
    <button onClick={onBtnClick} disabled={isLoading}>
      Swap
    </button>
  );
}

function Result({ toCur, fromCur, convertedAmount }) {
  return (
    <div>
      {convertedAmount === 0 || toCur === "" || fromCur === "" ? (
        <p>Currency or Amount not selected!</p>
      ) : (
        <p>
          {<span>{currencySymbols[toCur]}</span>} {convertedAmount}
        </p>
      )}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🛑</span>
      {message}
    </p>
  );
}
