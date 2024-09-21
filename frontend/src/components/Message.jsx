import React, { useEffect } from 'react';
import '../style/Message.css';

const Message = ({ text, step }) => {
  // Function to check if a step is completed
  const isStepCompleted = (stepIndex) => step > stepIndex;

  // UseEffect to handle any side effects when the step changes
  useEffect(() => {
    console.log(`Step for message "${text}" changed to: ${step}`);
    
    // Any other side effect, e.g., triggering an animation
    // You can also add more side effects here if needed.
  }, [step]); // This effect runs every time the `step` changes

  return (
    <div className='message-card'>
      <div className='header'>
        <div className='sender'>
          <div className='image'> 
            <img 
              src={require('../assets/user.png')} 
              alt="User" 
              style={{ maxWidth: '20px', maxHeight: '20px' }} 
            /> 
          </div>
          <div className='sender-name'>
            You 
          </div>
        </div>
        <div className='timestamp'>4 min ago</div>
      </div>

      <div className='message' style={{ padding: '10px' }}>
        {text}
      </div>

      <div className='footer'>
        {/* Process flow with 3 steps */}
        <div className="process-flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[1, 2].map((stepIndex) => (
            <div className="step" key={stepIndex} style={{ margin: '0 55px' }}> {/* Added margin for spacing */}
              <div
                className={`circle ${isStepCompleted(stepIndex) ? 'completed' : ''}`}
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  border: '2px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isStepCompleted(stepIndex) ? '✔️' : ''}
              </div>
              <div className="step-label" style={{ textAlign: 'center' }}>Step {stepIndex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Message;