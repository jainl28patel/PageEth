import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import Navbar from '../bars/nav';
import Body from '../components/body';
import Sidebar from '../bars/sidebar';
import frame from '../assets/background.png';

function Home() {

  const { userName, tabs, messageBox } = useSelector((state) => state.home);
  console.log(useSelector((state) => state.home));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundImage: `url(${frame})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
    }}>
      <Navbar name={userName}/>
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        marginTop: '6vh',
      }}>
        <Sidebar />
        <Body tabs={tabs} messageBox={messageBox} />
      </Box>
    </Box>
  );
}

export default Home;
