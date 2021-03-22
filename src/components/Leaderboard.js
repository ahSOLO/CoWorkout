export default function Leaderboard(props) {
  
  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

  return (
    <h1>Leaderboard</h1>
  )
}