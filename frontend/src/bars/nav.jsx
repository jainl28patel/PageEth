import React from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({name}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
        padding: '10px 20px',
        height: '6vh',
        position: 'fixed',
        top: 0,
        width: '98%',
        zIndex: 1000,
        borderBottom: '4px solid black', // Removed shadow, added black border
      }}
    >
      {/* Title */}
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
        PageEth
      </Typography>

      {/* Search Bar with Icon and Dashed Border */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.background.light,
          borderRadius: '4px',
          width: '35%', // Adjusted width for more space
          padding: '2px 8px',
          border: '2px dashed black', // Dashed border
          marginRight: '20px', // Reduced space between search bar and user section
        }}
      >
        <SearchIcon sx={{ marginRight: '8px' }} /> {/* Search Icon */}
        <InputBase
          placeholder="Search..."
          sx={{ width: '100%' }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 8px',
          borderLeft: '1px solid black',
          borderTop: '1px solid black',  
          borderRight: '4px solid black', 
          borderBottom: '4px solid black',
          borderRadius: '4px',
        }}
      >
        <AccountCircleIcon sx={{ marginRight: '8px' }} />
        <Typography variant="body1" component="div" sx={{ whiteSpace: 'nowrap' }}>
          {name}
        </Typography>
      </Box>
    </Box>
  );
}

export default Navbar;
