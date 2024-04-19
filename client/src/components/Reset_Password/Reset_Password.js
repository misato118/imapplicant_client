import React, { useState } from 'react';
import { Button, TextField, Typography,
    Box, Snackbar, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../actions/auth';

import CloseIcon from '@mui/icons-material/Close';

const Reset_Password = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackBarOpen, setSnackBarOpen] = useState(false); // snackbar for password validation

    //const [token, setToken] = useState(window.location.href.replace('http://localhost:3000/reset_password/', ''));
    const [token, setToken] = useState(window.location.href.replace('https://imapplicant-client.onrender.com/reset_password/', ''));

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password == confirmPassword && password != '') {
            dispatch(resetPassword(token, password, navigate));
        } else {
            setSnackBarOpen(true);
        }
    }

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const action = (
        <>
            <IconButton
                size='small'
                aria-label='close'
                color='inherit'
                onClick={handleCloseSnackBar}
            >
                <CloseIcon fontSize='small' />
            </IconButton>
        </>
    );

    return (
        <Box sx={{ textAlign: 'center', margin: 'auto', width: '20%' }}>
            <form onSubmit={(e) => handleResetPassword(e)}>
                <Typography variant='h5' sx={{ marginBottom: 3 }}>Reset Password</Typography>
                <TextField name='password' variant='outlined' label='Password' onChange={(e) => setPassword(e.target.value)} sx={{ marginBottom: 1 }} />
                <TextField name='confirmPassword' variant='outlined' label='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} sx={{ marginBottom: 1 }} />

                <Button type='submit' variant='contained' color='primary' sx={{ marginTop: 4, paddingX: 4, paddingY: 2 }} style={{ borderRadius: 50 }}>
                    Reset
                </Button>
            </form>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
                message='Password does not match'
                action={action}
            />
        </Box>
    );
}

export default Reset_Password;