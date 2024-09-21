import React from 'react';
import { useSelector } from 'react-redux';
import '../style/FloatingWindow.css';
import MessageLog from './MessageLog';
import MessageSender from './MessageSender';

const FloatingWindow = ({ closeWindow }) => {
  const messagers = useSelector((state) => state.home.messagers);

  const messagerNames = messagers.length > 0
    ? messagers.map((messager) => messager.name).join(', ')
    : 'No messenger to send message';

  return (
    <div>
      <div className="floating-window">
        <div className="window-header">
          <h2>{messagerNames}</h2>
          <button className="close-button" style={{ color: "black" }} onClick={closeWindow}>
            X
          </button>
        </div>
        <div className="window-content">
          <div className="msg-window">
            <div className="msg-list">
              <MessageLog />
            </div>
            <div className="msg-sender">
              <MessageSender />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingWindow;
