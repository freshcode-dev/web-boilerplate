import { Box } from '@mui/material';
import { FC } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const RouterSuspense: FC = () => (
  <Box sx={{ display: "flex" }}>
    <CircularProgress />
  </Box>
);

export default RouterSuspense;
