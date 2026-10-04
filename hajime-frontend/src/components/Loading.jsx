import './Loading.css'

function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading" role="status">
      <span className="loading-spinner" aria-hidden="true"></span>
      <p>{message}</p>
    </div>
  )
}

export default Loading
