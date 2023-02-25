import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { fontSize } from '@mui/system';


const ProgressButton = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </Box>
  )
}

export default ProgressButton