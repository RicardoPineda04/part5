import PropTypes from "prop-types"

const Notification = ({ message, typemessage }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={`${typemessage}`}>
        {message}
      </div>
    )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  typemessage: PropTypes.string.isRequired
}

export default Notification