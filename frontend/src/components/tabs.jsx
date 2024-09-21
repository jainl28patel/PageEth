import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import CustomSwitch from './customSwitch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDoMessage, toggleHashVisibility, retrieveEns } from '../features/homeSlice';

// Component for the visibility toggle button
function HashVisibilityToggle({ visible, onClick }) {
  return (
    <IconButton onClick={onClick} sx={{ marginLeft: '10px' }}>
      {visible ? <VisibilityIcon sx={{ color: 'black' }} /> : <VisibilityOffIcon sx={{ color: 'black' }} />}
    </IconButton>
  );
}

function Tabs() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tabsData = useSelector((state) => state.home.tabs);

  // Handle toggle of the "doMessage" switch
  const handleSwitchChange = (index) => (checked) => {
    const hashValue = tabsData[index].hash;
    const ensName = tabsData[index].ens;
    if(hashValue === ''){
      console.log("Reached here");
      dispatch(retrieveEns(ensName));
    }
    dispatch(toggleDoMessage({ index, doMessage: checked }));
  };

  // Handle toggle of hash visibility
  const handleHashVisibilityToggle = (index) => () => {
    const currentVisibility = tabsData[index].hashVis;
    const hashValue = tabsData[index].hash;
    const ensName = tabsData[index].ens;
    if(hashValue === ''){
      console.log("Reached here");
      dispatch(retrieveEns(ensName));
    }
    dispatch(toggleHashVisibility({ index, hashVis: !currentVisibility }));
  };

  // Helper function to format the hash when visible
  const formatHash = (hash) => {
    if (hash.length > 7) {
      return `${hash.slice(0, 4)}...${hash.slice(-3)}`;  // Show first 4 chars, '...', and last 3 chars
    }
    return hash;  // If the hash is too short, return it as is
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0px',
        padding: '0px'
      }}
    >
      {tabsData.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: theme.palette.primary.light
          }}
        >
          <Typography>No content</Typography>
        </Box>
      ) : (
        tabsData.map((item, index) => (
          <Box
            key={index}
            sx={{
              borderTop: '2px dashed black',
              borderBottom: '1px dashed black',
              borderLeft: '2px solid black',
              borderRight: '2px solid black',
              padding: '15px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            <Typography variant="body1" sx={{ flex: 1 }}>{item.name}</Typography>
            <Typography variant="body1" sx={{ flex: 1 }}>{item.ens}</Typography>
            <Box
              sx={{
                border: '2px dashed black',
                padding: '0px',
                display: 'flex',
                alignItems: 'center',
                flex: 1
              }}
            >
              <Typography variant="body1" sx={{ flex: 1 }}>
                {item.hashVis ? formatHash(item.hash) : '••••••••••••••'}
              </Typography>
              <HashVisibilityToggle
                visible={item.hashVis}
                onClick={handleHashVisibilityToggle(index)}
              />
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                flex: 1,
                marginRight: '-5vw',
                marginLeft: '5vw' 
              }}
            >
              <CustomSwitch
                checked={item.doMessage}
                onChange={handleSwitchChange(index)}
              />
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}

export default Tabs;
