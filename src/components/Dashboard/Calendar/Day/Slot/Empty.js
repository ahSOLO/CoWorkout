import {useState} from 'react';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import BookDialog from 'components/Dialogs/BookDialog';

export default function Empty(props){
  const [bookOpen, setBookOpen] = useState(false);

  const handleBookClick = () => {
    setBookOpen(true);
  }
  const handleBookClose = () => {
    props.setHover(false);
    setBookOpen(false);
  }

  return(
    <div className="slot__empty">
      {props.hover && 
      <AddCircleOutlineOutlinedIcon 
        htmlColor="grey" 
        className="clickable"
        onClick= {handleBookClick}
      />}

      <BookDialog
         handleBookClose={handleBookClose}
         bookOpen={bookOpen}
         data={props.data}
         date={props.date}
         user={props.user}
         setMode={props.setMode}
      />
    </div>
  )
}