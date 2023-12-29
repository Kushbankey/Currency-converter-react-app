import { useState, useEffect } from "react";
// import { countries } from "country-flag-icons";

import { InputField } from "./InputField";
import { Dropdown } from "./Dropdown";
import { Result } from "./Result";
import { Loader } from "./Loader";
import { ConvertButton } from "./ConvertButton";
import { ErrorMessage } from "./ErrorMessage";
import { Switch } from "./Switch";

// const unsupportedCountries = currencyOptions
//   .map((currencyValue) => currencyValue.split(" ")[0])
//   .filter((currencyCode) => !countries.includes(currencyCode));

// console.log(unsupportedCountries);

export default function App() {
  const [amount, setAmount] = useState(0);
  const [fromCur, setFromCur] = useState("");
  const [toCur, setToCur] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState(true);

  function onConvertBtnClick() {
    setInitial(false);
  }

  function checkConditions() {
    return convertedAmount === 0 || toCur === "" || fromCur === "";
  }

  function onBtnClick() {
    setFromCur(toCur);
    setToCur(fromCur);
  }

  function checkToFocusDropbox1() {
    if (amount !== 0 && fromCur === "") {
      return true;
    }
    return false;
  }
  function checkToFocusDropbox2() {
    if (amount !== 0 && fromCur !== "" && toCur === "") {
      return true;
    }
    return false;
  }

  const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedConvertedAmount = parseFloat(convertedAmount).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

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
      <div className="heading">
        <h2>Currency Converter</h2>
        <p>Check live foreign currency exchange rates</p>
      </div>
      <div className="card">
        <div className="Top-div">
          <InputField
            fromCur={fromCur}
            toCur={toCur}
            amount={amount}
            formattedAmount={formattedAmount}
            formattedConvertedAmount={formattedConvertedAmount}
            convertedAmount={convertedAmount}
            onSetAmount={setAmount}
            isLoading={isLoading}
            initial={initial}
          />

          <div className="dropbox">
            <label className="label">From</label>
            <Dropdown
              cur={fromCur}
              onSetCur={setFromCur}
              isLoading={isLoading}
              onCheckToFocusDropbox={checkToFocusDropbox1}
            />
          </div>

          <Switch onBtnClick={onBtnClick} isLoading={isLoading} />

          <div className="dropbox">
            <label className="label">To</label>
            <Dropdown
              cur={toCur}
              onSetCur={setToCur}
              isLoading={isLoading}
              onCheckToFocusDropbox={checkToFocusDropbox2}
            />
          </div>
        </div>

        <div className="Bottom-div">
          {initial && (
            <ConvertButton
              onConvertBtnClick={onConvertBtnClick}
              checkConditions={checkConditions}
            />
          )}
          {!initial && isLoading && <Loader />}
          {!initial && !isLoading && !error && (
            <Result
              fromCur={fromCur}
              toCur={toCur}
              formattedAmount={formattedAmount}
              checkConditions={checkConditions}
              formattedConvertedAmount={formattedConvertedAmount}
            />
          )}
          {!initial && error && <ErrorMessage message={error} />}

          <div className="info-div">
            <div className="info"></div>
            <div>
              We use the mid-market rate for our Converter. This is for
              informational purposes only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
