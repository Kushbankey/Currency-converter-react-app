export function Result({
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
