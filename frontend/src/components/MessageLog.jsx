import React from 'react';
import { useSelector } from 'react-redux';
import '../style/MessageLog.css';
import './Message.jsx'
import Message from './Message.jsx';

const MessageLog = () => {

    const messages = useSelector((state) => state.home.textMessages);
  
    return (
      <div className="message-window">
        {messages.map((message, index) => (
          <Message key={index} text={message.msg} />
        ))}
      </div>
    );
  };  

export default MessageLog;