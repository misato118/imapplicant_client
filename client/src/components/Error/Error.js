import React from 'react';
import { Typography, Alert } from '@mui/material';

const Error = () => {

    return (
        <>
            <Alert severity='error' sx={{ marginTop: 3 }}>
                <Typography>Something went wrong. Please try again later...</Typography>
            </Alert>
        </>
    );
}

export default Error;