import Calendar from "./Calendar"

export default function Dashboard(props) {

  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

  return (
    <>
      <Calendar user={props.user}/>
    </>
  )
}