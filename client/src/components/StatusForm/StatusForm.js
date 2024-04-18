import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateStatus } from '../../actions/db_actions.js';
import { useDispatch } from 'react-redux';

import { Box, Typography, Modal,
    Fade, Button, Radio, RadioGroup,
    FormControlLabel, Backdrop, } from '@mui/material';

import *  as styles from './styles.js';

const StatusForm = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [user, setUser] = useState(props.user);
    const [status, setStatus] = useState(props.data.status);
    const [navVal, setNavVal] = useState(1); // For navigation tabs

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (window.navigator.onLine) { // If online
            dispatch(updateStatus(props.data, status));

            navigate('/applications', {
                state: {
                    isLoggedin: user ? true : false,
                }
           });
        } else { // If offline
            navigate('/applications', {
                state: {
                    isLoggedin: user ? true : false,
                    error: true,
                }
            });
        }

        setStatus({ status: '' });
        setNavVal(1);
    }

    return (
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={props.open}
            onClose={props.close}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
        
        <Fade in={props.open}>
            <Box sx={styles.createModalStyle}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Typography variant='h6'>Did the Application Status Change?</Typography>
                    <RadioGroup row onChange={(e) => setStatus(e.target.value)} value={status} sx={{ marginY: 4  }}>
                        <FormControlLabel value='applied' control={<Radio />} label='Applied' />
                        <FormControlLabel value='interview' control={<Radio />} label='Interview' />
                        <FormControlLabel value='accepted' control={<Radio />} label='Accepted' />
                        <FormControlLabel value='rejected' control={<Radio />} label='Rejected' />
                        <FormControlLabel value='saved' control={<Radio />} label='Saved' />
                    </RadioGroup>

                    <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        type='submit'
                        onClick={props.close}
                        style={{ borderRadius: 50 }}
                        sx={{ paddingX: 3, paddingY: 1, marginTop: 6 }}
                    >Update Status</Button>
                </form>
            </Box>
            </Fade>
        </Modal>
    );
}

export default StatusForm;