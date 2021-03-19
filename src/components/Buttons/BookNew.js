import { useState } from 'react'; 
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BookDialog from 'components/Dialogs/BookDialog';

export default function BookNew(props) {
  const [bookOpen, setBookOpen] = useState(false);

  const handleBookClick = () => {
    setBookOpen(true);
  }
  const handleBookClose = () => {
    setBookOpen(false);
  }

  return (
    <>
      <IconButton id="bookNewButton" onClick={handleBookClick} >
        <AddIcon 
          fontSize="large"
        />
      </IconButton>
      <BookDialog
        handleBookClose={handleBookClose}
        bookOpen={bookOpen}
        user={props.user}
      />
    </>
  )
}