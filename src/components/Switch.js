export function Switch({ onBtnClick, isLoading }) {
  return (
    <div className="swap-btn" onClick={onBtnClick} disabled={isLoading}></div>
  );
}
