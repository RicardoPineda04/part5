import PropTypes from "prop-types"

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  
  const { message, type } = notification
    
  return (
    <div className={`${type}`}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  typemessage: PropTypes.string.isRequired
}

export default Notification