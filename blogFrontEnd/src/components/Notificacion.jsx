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

export default Notification