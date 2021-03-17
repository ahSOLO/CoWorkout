import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

export default function Empty(props){
  return(
    <div className="slot__empty">
      {props.hover && <AddCircleOutlineOutlinedIcon htmlColor="grey" className="clickable"/>}
    </div>
  )
}