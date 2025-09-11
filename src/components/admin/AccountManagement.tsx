import React from 'react';
import {
  Typography,
  Paper,
  Container
} from '@mui/material';

const AccountManagement: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Account management features will be implemented here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AccountManagement;