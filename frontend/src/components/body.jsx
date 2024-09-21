import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; 
import { useTheme } from '@mui/material/styles';
import Tabs from './tabs';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { toggleMessageBox } from '../features/homeSlice'; // Import the action to toggle messageBox
import FloatingWindow from './FloatingWindow'; // Import FloatingWindow

function Body() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Accessing Redux state
  const tabsData = useSelector((state) => state.home.tabs); // Access tabs state
  const messageBox = useSelector((state) => state.home.messageBox); // Access messageBox state

  const handleButtonClick = () => {
    dispatch(toggleMessageBox()); // Toggle messageBox on click
  };

  const closeFloatingWindow = () => {
    dispatch(toggleMessageBox()); // Toggle messageBox back to false
  };

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        paddingTop: '5vh',
        marginLeft: '5%',
        marginRight: '5%',
        height: '85vh',
        overflowY: 'auto'
      }}
    >
      <Box 
        sx={{ 
          padding: '20px', 
          borderRadius: '8px', 
          backgroundColor: theme.palette.background.paper,
          border: '2px solid black',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            padding: '10px', 
            borderBottom: '2px solid black',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>Name</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>ENS</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>Hash</Typography>
          <Button
            sx={{
              flex: 1,
              border: '2px solid black',
              borderRight: '4px solid black', 
              borderBottom: '4px solid black', 
              padding: '5px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.paper,
              textTransform: 'none', 
              fontWeight: 'bold', 
              color: 'black' 
            }}
            variant="outlined" 
            onClick={handleButtonClick} 
          >
            <Typography variant="h6">Message</Typography>
          </Button>
        </Box>

        {/* Content Area */}
        <Box 
          sx={{ 
            flexGrow: 1,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            overflowY: 'auto', 
            minHeight: '200px',
            boxSizing: 'border-box'
          }}
        >

          <Tabs data={tabsData} />
        </Box>
      </Box>

      {messageBox && <FloatingWindow closeWindow={closeFloatingWindow} />}
    </Box>
  );
}

export default Body;
