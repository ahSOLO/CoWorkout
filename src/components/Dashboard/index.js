import Calendar from "./Calendar"

export default function Dashboard(props) {
  return (
    <>
      <h1>Dashboard </h1>
      <Calendar user={props.user}/>
    </>
  )
}