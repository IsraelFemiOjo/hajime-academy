import './ErrorMessage.css'

function ErrorMessage({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>

      {onRetry && (
        <button className="error-retry" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
