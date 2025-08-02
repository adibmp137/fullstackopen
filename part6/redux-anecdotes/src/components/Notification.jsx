import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector((state) => {
    return `${state.notification[0]} '${state.notification[1]}'`
  })
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  if (notification.includes('init')) return null

  return (
    <div style={style}>

      {notification}
    </div>
  )
}

export default Notification