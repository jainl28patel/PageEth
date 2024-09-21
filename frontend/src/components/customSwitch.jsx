import React from 'react';
import Box from '@mui/material/Box';
import { Switch } from '@mui/material';

function CustomSwitch({ checked, onChange }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray',
        color: 'white',
        padding: '0 5px',
        border: '2px double black',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => onChange(!checked)} // Toggle the state on click
    >
      <Box
        sx={{
          position: 'absolute',
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          color: 'black',
          transition: 'transform 0.3s ease',
          transform: checked ? 'translateX(50%)' : 'translateX(-50%)',
        }}
      >
        {checked ? 'YES' : 'NO'}
      </Box>
      <Switch
        checked={checked}
        onChange={() => onChange(!checked)}
        sx={{
          position: 'absolute',
          opacity: 0, // Hide the default switch
        }}
      />
    </Box>
  );
}

export default CustomSwitch;
