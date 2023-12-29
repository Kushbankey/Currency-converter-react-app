import { useEffect, useRef } from "react";
import currencyOptions from "../data/currencyOptions";
import {
  US,
  EU,
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

export function Dropdown({ cur, onSetCur, isLoading, onCheckToFocusDropbox }) {
  const dropboxEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === dropboxEl || !onCheckToFocusDropbox()) {
          return;
        }
        if (e.code === "Enter") {
          dropboxEl.current.focus();
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [onCheckToFocusDropbox]
  );

  return (
    <div className="dropbox-group">
      {getIconFromCur(cur)}
      <select
        value={cur}
        onChange={(e) => onSetCur(e.target.value)}
        disabled={isLoading}
        ref={dropboxEl}
      >
        <option value="">Select</option>
        {currencyOptions.sort().map((currencyValue) => {
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
