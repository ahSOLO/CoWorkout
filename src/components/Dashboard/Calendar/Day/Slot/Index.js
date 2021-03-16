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

// ./src/components/Dashboard/Calendar/Day/index.js
// Cannot find file: 'index.js' does not match the corresponding name on disk: '.\src\components\Dashboard\Calendar\Day\Slot\Index.js'.