import React, { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../features/homeSlice'; 
import '../style/MessageSender.css';
import { sendMessageToBlockChain } from '../features/homeSlice';

const MessageSender = () => {
  const [message, setMessage] = useState(''); 
  const dispatch = useDispatch();

  // Get nextUid from the Redux state
  const nextUid = useSelector((state) => state.home.nextUid); 

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      // Dispatch to add the message to the local state
      dispatch(addMessage(message));

      // Create the message object with the current uid
      const messageObj = {
        uid: nextUid,  // Use nextUid from Redux state
        msg: message,
        step: 1,
      };

      // Clear the input after dispatching
      setMessage('');

      // Dispatch to send the message to the blockchain
      dispatch(sendMessageToBlockChain(messageObj));
    }
  };

  return (
    <div className='msg-sender-component'>
      <div className="text-input-container">
        <input
          type="text"
          className="dashed-input"
          placeholder="Type something..."
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
      </div>

      <div className='msg-send-button'>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageSender;