import { Box } from '@mui/material';
import React, { FC } from 'react';

const NotFoundPage: FC = () => (
  <Box sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
  }}>
    404 ERROR: PAGE NOT FOUND
  </Box>
);

export default NotFoundPage;
