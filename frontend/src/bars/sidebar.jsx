import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../features/homeSlice';
import logoutIcon from '../assets/logout-dotted.png';

function Sidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get the activeTab from the Redux store
  const activeTab = useSelector((state) => state.home.activeTab);

  const tabs = ['Dashboard', 'About'];

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));  // Dispatch the action to update the activeTab
  };

  const handleCreateClick = () => {
    alert('Create button clicked');
  };

  return (
    <Box 
      sx={{ 
        width: '20%', 
        padding: '10px', 
        height: '91.8vh',
        position: 'sticky', 
        top: '8.2vh', 
        borderRight: '4px solid black',
        borderTop: '4px solid black',
        borderBottom: '4px solid black',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.primary.light
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        {tabs.map((tab, index) => (
          <ListItem
            component="div" 
            key={index}
            onClick={() => handleTabClick(tab)}  // Handle click and update Redux store
            sx={{
              backgroundColor: activeTab === tab ? theme.palette.primary.dark : theme.palette.primary.light,
              color: activeTab === tab ? theme.palette.text.secondary : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              },
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          >
            <ListItemText primary={tab} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleCreateClick}
        endIcon={
          <img
            src={logoutIcon}
            alt="logout icon"
            style={{ width: '20px', height: '20px' }} // Adjust the size as needed
          />
        }
        sx={{ 
          border: '2px solid black',
          color: 'black',
          backgroundColor: 'white',
          borderRadius: '4px',
          marginTop: 'auto',
          marginBottom: '20px'
        }}
      >
        LOG OUT
      </Button>
    </Box>
  );
}

export default Sidebar;
