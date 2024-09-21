import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Details from '../loginTabs/Details';
import Socials from '../loginTabs/Socials';
import Verification from '../loginTabs/Verification';
import background from '../assets/background.png';

function Login() {
  const theme = useTheme();
  const activeLoginTab = useSelector((state) => state.login.activeLoginTab);

  const renderActiveTab = () => {
    switch (activeLoginTab) {
      case 'Details':
        return <Details />;
      case 'Socials':
        return <Socials />;
      case 'Verification':
        return <Verification />;
      default:
        return <Details />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
      }}
    >
      <Box
        sx={{
          width: '25%',
          padding: '40px',
          backgroundColor: theme.palette.primary.light,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRight: '6px solid black',
          borderBottom: '6px solid black',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '40px', color: 'black' }}>
          PageEth
        </Typography>

        {/* Stepper-like UI */}
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {['Details', 'Socials', 'Verification'].map((step, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '2px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                >
                  {/* Conditional black dot for active steps */}
                  {(index === 0 && activeLoginTab === 'Details') ||
                  (index === 1 && activeLoginTab === 'Socials') ||
                  (index === 2 && activeLoginTab === 'Verification') ? (
                    <Box
                      sx={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'black',
                      }}
                    />
                  ) : null}
                </Box>
                <Typography variant="body2" sx={{ marginTop: '10px', color: 'black' }}>
                  {step}
                </Typography>
              </Box>
            ))}

            {/* Divider between circles */}
            <Box
              sx={{
                position: 'absolute',
                top: '1.1vh',
                left: '12%',
                right: '14%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <Divider
                sx={{
                  width: '100%',
                  borderColor: theme.palette.primary.dark,
                  borderWidth: '1px',
                }}
              />
            </Box>
          </Box>
        </Box>

        {renderActiveTab()}
      </Box>
    </Box>
  );
}

export default Login;

