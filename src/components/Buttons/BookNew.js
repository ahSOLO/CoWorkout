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
      <IconButton id="bookNewButton">
        <AddIcon 
          fontSize="large"
          onClick={handleBookClick} 
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