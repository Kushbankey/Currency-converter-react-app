import { useState, useEffect } from "react";
import {
  EU,
  US,
  JP,
  BG,
  CZ,
  DK,
  GB,
  HU,
  PL,
  RO,
  SE,
  CH,
  IS,
  NO,
  TR,
  AU,
  BR,
  CA,
  CN,
  HK,
  ID,
  IL,
  IN,
  KR,
  MX,
  MY,
  NZ,
  PH,
  SG,
  TH,
  ZA,
} from "country-flag-icons/react/3x2";
import { countries } from "country-flag-icons";

import currencySymbols from "./currencySymbols";
import currencyOptions from "./currencyOptions";

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
            />
          </div>

          <Switch onBtnClick={onBtnClick} isLoading={isLoading} />

          <div className="dropbox">
            <label className="label">To</label>
            <Dropdown cur={toCur} onSetCur={setToCur} isLoading={isLoading} />
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

function InputField({
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
    [fromCur, toCur,amount, isLoading, initial]
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
        />
      </div>
    </div>
  );
}

function getIconFromCur(cur) {
  const flagComponents = {
    USD: <US title="United States" className="flag" />,
    EUR: <EU title="Euro" className="flag" />,
    JPY: <JP title="Japan" className="flag" />,
    BGN: <BG title="Bulgaria" className="flag" />,
    CZK: <CZ title="Czech Republic" className="flag" />,
    DKK: <DK title="Denmark" className="flag" />,
    GBP: <GB title="United Kingdom" className="flag" />,
    HUF: <HU title="Hungary" className="flag" />,
    PLN: <PL title="Poland" className="flag" />,
    RON: <RO title="Romania" className="flag" />,
    SEK: <SE title="Sweden" className="flag" />,
    CHF: <CH title="Switzerland" className="flag" />,
    ISK: <IS title="Iceland" className="flag" />,
    NOK: <NO title="Norway" className="flag" />,
    TRY: <TR title="Turkey" className="flag" />,
    AUD: <AU title="Australia" className="flag" />,
    BRL: <BR title="Brazil" className="flag" />,
    CAD: <CA title="Canada" className="flag" />,
    CNY: <CN title="China" className="flag" />,
    HKD: <HK title="Hong Kong" className="flag" />,
    IDR: <ID title="Indonesia" className="flag" />,
    ILS: <IL title="Israel" className="flag" />,
    INR: <IN title="India" className="flag" />,
    KRW: <KR title="South Korea" className="flag" />,
    MXN: <MX title="Mexico" className="flag" />,
    MYR: <MY title="Malaysia" className="flag" />,
    NZD: <NZ title="New Zealand" className="flag" />,
    PHP: <PH title="Philippines" className="flag" />,
    SGD: <SG title="Singapore" className="flag" />,
    THB: <TH title="Thailand" className="flag" />,
    ZAR: <ZA title="South Africa" className="flag" />,
  };

  return flagComponents[cur] || null;
}

function Dropdown({ cur, onSetCur, isLoading }) {
  return (
    <div className="dropbox-group">
      {getIconFromCur(cur)}
      <select
        value={cur}
        onChange={(e) => onSetCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Select</option>
        {currencyOptions.map((currencyValue) => {
          const currencyCode = currencyValue.split(" ")[0];
          return (
            <option key={currencyCode} value={currencyCode}>
              {currencyValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function Switch({ onBtnClick, isLoading }) {
  return (
    <div className="swap-btn" onClick={onBtnClick} disabled={isLoading}></div>
  );
}

function Result({
  fromCur,
  toCur,
  checkConditions,
  formattedAmount,
  formattedConvertedAmount,
}) {
  return (
    <div className="result">
      {checkConditions() ? (
        ((formattedAmount === "0.00" || isNaN(formattedAmount)) && (
          <p className="amount-error-p">
            Please select a valid amount (greater than 0)
          </p>
        )) ||
        ((fromCur === "" || toCur === "") && (
          <p className="cur-error-p">Please select a valid currency </p>
        ))
      ) : (
        <>
          <p className="fromCur-p">
            {formattedAmount} {fromCur} =
          </p>
          <p className="toCur-p">
            {formattedConvertedAmount} {toCur}
          </p>
        </>
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

function ConvertButton({ onConvertBtnClick, checkConditions }) {
  return (
    <div
      className="convert-btn"
      onClick={onConvertBtnClick}
      disabled={checkConditions()}
    >
      Convert
    </div>
  );
}
