import './index.css'

const ErrorMsg = props => {
  const {retryApi} = props

  const onClickTryAgain = () => {
    retryApi()
  }

  return (
    <div className="error-msg-bg-container">
      <img
        alt="failure view"
        src="https://res.cloudinary.com/dowtoiurd/image/upload/v1770640395/Icon_hwrmsr.svg"
        className="error-img"
      />
      <p className="error-msg-text">Something went wrong. Please try again</p>
      <button type="button" className="try-again-btn" onClick={onClickTryAgain}>
        Try Again
      </button>
    </div>
  )
}

export default ErrorMsg
