import { FC } from 'react';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const RouterSuspense: FC = () => (
  <Box sx={{ display: "flex" }}>
    <CircularProgress />
  </Box>
);
