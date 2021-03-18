import {useState} from 'react';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import BookDialogue from 'components/Dialog/BookDialog';

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

      <BookDialogue
         handleBookClose={handleBookClose}
         bookOpen={bookOpen}
      />
    </div>
  )
}