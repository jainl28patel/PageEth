import React from 'react';
import { Box } from '@mui/material';
import UserVerify from '../worldcoin/userverify';

function Verification() {

  // const handleVerify = () => {
  //   // Functionality for verify button can be added here
  //   console.log("Verify button clicked");
  // };

  return (
    <>
      {/* Box for image and verify button */}
      <Box sx={{ textAlign: 'center', margin: '20px 0' }}>
        <img 
          src={require('../assets/worldcoin.png')} 
          alt="Dynamic" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
        <Box sx={{ margin: '20px 0' }}>
        <UserVerify/>
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleVerify}
            sx={{
              color: 'black', 
              borderRadius: '0%',
              backgroundColor: 'white',
              border: '2px solid black',
              borderRight: '4px solid black', 
              borderBottom: '4px solid black',
              width: '20vw',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              }
            }}
          >
            Verify
          </Button> */}
        </Box>
      </Box>
      {/* Next button positioned to the right */}
      {/* <div style={{ alignSelf: 'flex-end', margin: '20px 0' }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />} 
          onClick={handleNext}
          sx={{
            color: 'black', 
            borderRadius: '0%',
            backgroundColor: 'white',
            border: '2px solid black',
            borderRight: '4px solid black', 
            borderBottom: '4px solid black',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            }
          }}
        >
          Next
        </Button>
      </div> */}
    </>
  );
};

export default Verification;
