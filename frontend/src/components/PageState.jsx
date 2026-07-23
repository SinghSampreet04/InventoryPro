export function LoadingState({ message = "Loading inventory data…" }) {
  return (
    <div className="stateCard" role="status">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="stateCard errorState" role="alert">
      <h3>We couldn’t load this view</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="secondaryBtn" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
