import { Typography } from "@material-ui/core"
import "./styles.scss"

export default function Slot(props) {
  return (
    <div className="slot">
      <Typography>
        {props.content}
      </Typography>
    </div>
  )
}

