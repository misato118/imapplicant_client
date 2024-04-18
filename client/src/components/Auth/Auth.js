import React, { useState } from 'react';
import { Button, Grid, Typography, 
    Modal, Backdrop, Fade, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
//import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Input from './Input';
import *  as styles from './styles.js';
import { signin, signup, sendResetPasswordEmail } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const location = useLocation();   

    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [openModal, setOpenModal] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [forgotPassword, setForgotPassword] = useState(false);
    const [email, setEmail] = useState(''); // For reseting password
    
    const [isSignup, setIsSignup] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/');
    }

    // Let user register/login
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) { // Register an account
            dispatch(signup(formData, navigate));
        } else { // Loging to an existing account
            dispatch(signin(formData, navigate));
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (email) {
            dispatch(sendResetPasswordEmail(email, navigate));
            navigate('/', {
                state: {
                    emailSent: true,
                }
            });
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handlePasswordChange = (e) => {
        setEmail(e.target.value);
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        handleShowPassword(false);
    }

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        //window.location.reload();
        setUser(null);
        navigate('/auth')
    }

    const handleForgotPassword = () => {
        setForgotPassword(true);
    }

    return ( 
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openModal}>
                <Box sx={!user && isSignup ? styles.createModalStyleRegister :  styles.createModalStyleLogin}>
                    {user ? 
                        <>
                            <Grid container justifyContent='center' spacing={{ md: 2 }} style={{ marginTop: 50 }}>
                                <Grid item xs={12}>
                                    <LogoutIcon fontSize='large' />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6'>Log Out?</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='outlined' color='primary' onClick={logout} style={{ marginTop: 50 }}>Logout</Button>
                                </Grid>
                            </Grid>
                        </>
                    : forgotPassword ?

                        <form onSubmit={(e) => handleResetPassword(e)}>
                            <Typography variant='h5' sx={{ marginBottom: 3 }}>Reset Password</Typography>
                            <Input name='email' label='Email Address' handleChange={handlePasswordChange} type='email' margin='none' />

                            <Button type='submit' variant='contained' color='primary' sx={{ marginTop: 4, paddingX: 4, paddingY: 2 }} style={{ borderRadius: 50 }}>
                                Reset
                            </Button>
                        </form>

                    :   <form onSubmit={(e) => handleSubmit(e)}>
                            <Typography variant='h5' sx={isSignup ? { marginBottom: 5 } : { marginBottom: 3 }}>{isSignup ? 'Sign up' : 'Login'}</Typography>
                            {
                                isSignup && (
                                    <>
                                        <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half margin='none' />
                                        <Input name='lastName' label='Last Name' handleChange={handleChange} half margin='none' />
                                    </>
                                )
                            }
                            <Input name='email' label='Email Address' handleChange={handleChange} type='email' margin='none' />
                            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                            { isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' /> }

                            { !isSignup ? <Typography variant='contained' color='primary' sx={{ cursor: 'pointer', display: 'block', marginLeft: 20 }} onClick={handleForgotPassword}>
                                Forgot password?</Typography>
                                : <></> }

                            <Button type='submit' variant='contained' color='primary' sx={{ marginTop: 4, paddingX: 4, paddingY: 2 }} style={{ borderRadius: 50 }}>
                                {isSignup ? 'Register' : 'Login'}
                            </Button>

                            <Grid container justifyContent='center' mt={isSignup ? 4 : 11}>
                                <Grid item>
                                    <Typography variant='contained' sx={{ display: 'block' }}>
                                        { isSignup ? 'Already have an account?' : 'Don\'t have an account?' }
                                    </Typography>
                                    <Typography variant='contained' color='primary' onClick={switchMode} sx={{ cursor: 'pointer', display: 'block' }}>
                                        { isSignup ? 'Log in here' : 'Register here' }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>                
                    }
                </Box>
            </Fade>
        </Modal>
    );
}

export default Auth;