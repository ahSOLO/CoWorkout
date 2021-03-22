export default function Account(props) {

  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;
  
  return (
    <h1>Account</h1>
  )
}