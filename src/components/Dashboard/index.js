import Calendar from "./Calendar"

export default function Dashboard(props) {
  return (
    <>
      <Calendar user={props.user}/>
    </>
  )
}