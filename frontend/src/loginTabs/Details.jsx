import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button } from '@mui/material';
import { updateFormData, setActiveLoginTab } from '../features/loginSlice';
import arrowIcon from '../assets/arrow-right-rounded.svg'; // Import your custom arrow SVG

const Details = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.login.formData);

  const handleChange = (e) => {
    dispatch(updateFormData({ [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    dispatch(setActiveLoginTab('Socials'));
  };

  return (
    <>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{
          shrink: true,
          style: { color: 'black' },
        }}
        InputProps={{
          style: { color: 'black' },
        }}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: '2px dashed black',
            },
          },
        }}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{
          shrink: true,
          style: { color: 'black' },
        }}
        InputProps={{
          style: { color: 'black' },
        }}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: '2px dashed black',
            },
          },
        }}
      />
      <TextField
        label="Ens"
        name="ens"
        value={formData.ens}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{
          shrink: true,
          style: { color: 'black' },
        }}
        InputProps={{
          style: { color: 'black' },
        }}
        sx={{
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: '2px dashed black',
            },
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={
          <img
            src={arrowIcon}
            alt="arrow icon"
            style={{ width: '20px', height: '20px' }} // Adjust the size as needed
          />
        }
        onClick={handleNext}
        sx={{
          alignSelf: 'flex-end',
          marginTop: '20px',
          color: 'black',
          borderRadius: '0%',
          backgroundColor: 'white',
          border: '2px solid black',
          borderRight: '4px solid black',
          borderBottom: '4px solid black',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        Next
      </Button>
    </>
  );
};

export default Details;
