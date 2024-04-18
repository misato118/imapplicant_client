import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addData, updateData } from '../../actions/db_actions.js';
import * as api from '../../api';
import { useDispatch } from 'react-redux';

import { Box, Typography, Modal,
    Fade, TextField, Button, Radio, RadioGroup,
    FormControlLabel, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Backdrop, CircularProgress, Autocomplete, Grid, FormLabel,
    Tooltip, Chip, Snackbar, IconButton } from '@mui/material';

import *  as styles from './styles.js';
import { Container } from 'reactstrap';

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const FormModal = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [user, setUser] = useState(props.user);
    const [navVal, setNavVal] = useState(1); // For navigation tabs
    const [openDialog, setOpenDialog] = useState(false); // For a dialog
    const [changeStatus, setChangeStatus] = useState(''); // ADD, UPDATE, UPDATE_STATUS

    const [benefit, setBenefit] = useState('');
    const [requirement, setRequirement] = useState('');
    
    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getFullYear();
    const dateData = year + '-' + month + '-' + day;

    const [createFormData, setCreateFormData] = useState({
        title: '', status: 'applied', company: '', post_url: '', location: '', income: 0, benefits: [], requirements: [], date: dateData
    });

    const [findUrl, setFindUrl] = useState('');

    const [gotAutoFill, setGotAutoFill] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updatedAppId, setUpdatedAppId] = useState(0);
    const [mongoAppId, setMongoAppId] = useState();
    // Check if input fields should be switched to error state
    const [inputErr, setInputErr] = useState({ title: true, status: false, company: true, requirements: true });

    const handleOpenDialog = () => { setOpenDialog(true) };
    const handleCloseDialog = () => { setOpenDialog(false) };

    const handleLoading = () => { setIsLoading(true) };
    const handleStopLoading = () => { setIsLoading(false) };

    const [open, setOpen] = useState(false); // state for income tooltip
    const [snackBarOpen, setSnackBarOpen] = useState(false); // snackbar for form modal
    const [snackBarMsg, setSnackBarMsg] = useState('Fill the Required Fields'); // snackbar for form modal
    const [autoFillFailed, setAutoFillFailed] = useState(false); // snackbar for form modal

    // Add data to input fields when python returned data
    useEffect(() => {
        if (gotAutoFill[1]) {
            setCreateFormData({ ...createFormData, title: gotAutoFill[0], company: gotAutoFill[1], location: gotAutoFill[2] });
            setGotAutoFill([]);
            handleStopLoading();
        }

        if (props.data) {
            const obj = props.data;
            setCreateFormData({ title: obj.title, status: obj.status, company: obj.company, post_url: obj.post_url,
                location: obj.location, income: obj.income, benefits: obj.benefits, requirements: obj.requirements, date: obj.date });
            setUpdatedAppId(obj.id);
            setMongoAppId(obj.ref_id);
            setChangeStatus('UPDATE');
        } else {
            setChangeStatus('ADD');
        }
        
    }, [gotAutoFill, props.data]);

    // Create application form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        changeSnackBarMsg();
        var canSubmit = true;

        Object.keys(inputErr).map((eachField) => {
            if (inputErr[eachField]) {
                canSubmit = false;
            }
        });

        if (canSubmit) { // If all required fields are fullfilled
            if (window.navigator.onLine) { // If online
                if (changeStatus == 'ADD') { 
                    dispatch(addData(createFormData));
                } else if (changeStatus == 'UPDATE') {
                    dispatch(updateData(createFormData, updatedAppId, mongoAppId));
                }
    
                navigate('/applications', {
                    state: {
                        isLoggedin: user ? true : false,
                        appChange: 'Changed',
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
    
            setCreateFormData({title: '', status: 'applied', company: '', post_url: '', location: '', income: 0, benefits: [], requirements: [], date: dateData});
            setNavVal(1);
            setInputErr({ title: false, status: false, company: false, requirements: false });
            props.close();
        } else {
            setSnackBarOpen(true);
        }
    }

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
        setSnackBarMsg('Fill the Required Fields');
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

    // tooltip for income numerical value warning
    const handleTooltipClose = () => {
        setOpen(false);
    };
    
    // tooltip for income numerical value warning
    const handleTooltipOpen = () => {
        setOpen(true);
    };

    // For title and company
    const handleRequired = (event, field) => {
        setCreateFormData({...createFormData, [field]: event.target.value});
        if (event.target.value == '') {
            setInputErr({ ...inputErr, [field]: true });
        } else {
            setInputErr({ ...inputErr, [field]: false });
        }
    }

    // Add benefit/requirement to the field and array
    const handleEnterKey = (event, field) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (field === 'benefits') {
                setCreateFormData({...createFormData, benefits: createFormData.benefits.concat(benefit)});
                setBenefit('');
            } else {
                setCreateFormData({...createFormData, requirements: createFormData.requirements.concat(requirement)});
                setRequirement('');
                setInputErr({ ...inputErr, requirements: false });
            }
        }
    }

    // Remove benefit/requirement from the field in the form
    const removeElem = (field, element) => {
        if (field === 'benefits') {
            setCreateFormData({...createFormData, benefits: createFormData.benefits.filter((o, i) => createFormData.benefits.indexOf(element) !== i)});
        } else {
            const count = createFormData.requirements.length;
            setCreateFormData({...createFormData, requirements: createFormData.requirements.filter((o, i) => createFormData.requirements.indexOf(element) !== i)});
            if (count < 2) {
                setInputErr({ ...inputErr, requirements: true });
            }
        }
    }

    const changeSnackBarMsg = () => {
        if (autoFillFailed) {
            setAutoFillFailed(false);
        } else {
            setAutoFillFailed(true);
        }
    }

    const helpAutoComplete = async() => {
        handleLoading(); // Add a circular progress for loading

        setCreateFormData({ ...createFormData, post_url: findUrl });

        const result = await api.getFieldValues(findUrl);
        if (result.data) { // result is back properly
            if (result.status == 200 && result.data.values) {
                const resultArr = result.data.values[0].split('\n');
                setGotAutoFill(resultArr);
                setFindUrl('');
            } else {
                setGotAutoFill([]);
                setFindUrl('');
                changeSnackBarMsg();
                setSnackBarOpen(true);
            }
        } else { // TOODO: if not
            console.log('Something went wrong');
        }

        handleStopLoading();
    }

    // Give a warning if user is trying to type non-numerical values in income field
    const handleNonNumerical = (e) => {
        handleTooltipClose();
        const reg = /^\d+$/;
        if (!reg.test(e.key)) { // If not only numerical
            handleTooltipOpen();
        }
    }

    const clearForm = () => {
        setCreateFormData({
            title: '', status: 'applied', company: '', post_url: '', location: '', income: '', benefits: [], requirements: [], date: dateData
        });
    }

    return (
        <>
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={props.open}
            onClose={() => {props.close(); clearForm();}}
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
                <Typography variant='h5' sx={{ marginTop: 1, marginBottom: 3 }}>Create a New Application</Typography>
                <Button
                    variant='contained'
                    color='info'
                    size='large'
                    onClick={handleOpenDialog}
                    sx={{ marginBottom: 4, paddingX: 3, paddingY: 1 }}
                    style={{ borderRadius: 50 }}
                    className='helpAutoComplete'
                >Help me auto complete the form by URL</Button>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const url = formJson.url;
                            handleCloseDialog();
                        },
                    }}                        
                >
                    <DialogTitle>Auto-Complete Form</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            We can help you to fill some of the fields.
                            Please enter the job posting URL below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin='dense'
                            id='url_for_autofill'
                            name='url'
                            label='Job Posting URL'
                            type='url'
                            fullWidth
                            variant='standard'
                            onChange={(e) => setFindUrl(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type='submit' onClick={helpAutoComplete}>Auto-Complete</Button>
                    </DialogActions>
                </Dialog>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                    >
                        <CircularProgress color='inherit' sx={{ marginRight: 2 }} />
                        <Typography variant='h9'>Please give me a moment...</Typography>
                    </Backdrop>
                    
                    { inputErr.title && createFormData.title == '' ?
                        <TextField
                            error
                            name='title'
                            variant='outlined'
                            label='Title*'
                            helperText='Required Field'
                            value={createFormData.title ? createFormData.title : ''}
                            fullWidth
                            sx={{ marginY: 1 }}
                            onChange={(e) => handleRequired(e, 'title')}
                            //onChange={(e) => setCreateFormData({...createFormData, title: e.target.value})}
                        />
                    : 
                        <TextField
                            name='title'
                            variant='outlined'
                            label='Title*'
                            value={createFormData.title ? createFormData.title : ''}
                            fullWidth
                            sx={{ marginY: 1 }}
                            onChange={(e) => handleRequired(e, 'title')}
                            //onChange={(e) => setCreateFormData({...createFormData, title: e.target.value})}
                        />
                    }
                    
                    <FormLabel id='statusLabelGroup' sx={{ marginTop: 1 }} style={{ position: 'relative', marginRight: '90%' }}>Status</FormLabel>
                    <RadioGroup
                        row
                        sx={{ marginBottom: 2 }}
                        onChange={(e) => setCreateFormData({...createFormData, status: e.target.value})}
                        aria-labelledby='statusLabelGroup'
                        defaultValue='applied'
                    >
                        <FormControlLabel value='applied' control={<Radio />} label='Applied' />
                        <FormControlLabel value='interview' control={<Radio />} label='Interview' />
                        <FormControlLabel value='accepted' control={<Radio />} label='Accepted' />
                        <FormControlLabel value='rejected' control={<Radio />} label='Rejected' />
                        <FormControlLabel value='saved' control={<Radio />} label='Saved' />
                    </RadioGroup>

                    { inputErr.company && createFormData.company == '' ?
                        <TextField
                            error
                            name='company'
                            variant='outlined'
                            label='Company*'
                            helperText='Required Field'
                            value={createFormData.company ? createFormData.company : ''}
                            fullWidth
                            sx={{ marginBottom: 1 }}
                            onChange={(e) => handleRequired(e, 'company')}
                            //onChange={(e) => setCreateFormData({...createFormData, company: e.target.value})}
                        />
                    :
                        <TextField
                            name='company'
                            variant='outlined'
                            label='Company*'
                            value={createFormData.company ? createFormData.company : ''}
                            fullWidth
                            onChange={(e) => handleRequired(e, 'company')}
                            //onChange={(e) => setCreateFormData({...createFormData, company: e.target.value})}
                            sx={{ marginBottom: 1 }}
                        />
                    }

                    <TextField name='post_url' variant='outlined' label='Post URL' value={createFormData.post_url ? createFormData.post_url : ''} fullWidth onChange={(e) => setCreateFormData({...createFormData, post_url: e.target.value})} sx={{ marginY: 1 }} />
                    <TextField name='location' variant='outlined' label='Location' value={createFormData.location ? createFormData.location : ''} fullWidth onChange={(e) => setCreateFormData({...createFormData, location: e.target.value})} sx={{ marginY: 1 }} />
                        <Tooltip
                            PopperProps={{
                            disablePortal: true,
                            }}
                            onClose={handleTooltipClose}
                            open={open}
                            title='Only Numerical Values are Allowed'
                            placement='top'
                        >
                            <TextField
                            name='income'
                            variant='outlined'
                            label='Income'
                            type='number'
                            value={createFormData.income ? createFormData.income : ''}
                            fullWidth
                            onChange={(e) => setCreateFormData({...createFormData, income: e.target.value})}
                            onKeyDown={(e) => handleNonNumerical(e)}
                            sx={{ marginY: 1 }}
                            />
                        </Tooltip>
                    
                    <TextField name='benefits' variant='outlined' label='Benefits' fullWidth value={benefit} onKeyDown={(e) => handleEnterKey(e, 'benefits')} onChange={(e) => setBenefit(e.target.value)} sx={{ marginY: 1 }} className='benefitField' />
                    <Container>
                        <Box sx={{ minHeight: 100, background: 'lightgrey', padding: 2 }}>
                            { createFormData.benefits === undefined ? <></> : createFormData.benefits.length === 0
                                ? 
                                    <div>
                                        <Typography variant='subtitle1' color='text.secondary' sx={{ fontWeight: 'bold' }}>Press Enter to Add Benefits Here</Typography>
                                        <Typography variant='subtitle2' color='text.secondary'>Or else it won't be added to the database!</Typography>
                                    </div>
                                : createFormData.benefits.map((elem) => {
                                return (
                                    <Chip
                                        label={elem}
                                        color='primary'
                                        sx={{ paddingX: 1, margin: 1 }}
                                        onDelete={() => removeElem('benefits', elem)}
                                        deleteIcon={<DeleteIcon />}
                                    />                                    
                                )
                            })}
                        </Box>
                    </Container>

                    { inputErr.requirements && createFormData.requirements == [] ?
                        <TextField
                            error
                            name='requirements'
                            variant='outlined'
                            label='Requirements*'
                            helperText='Required Field'
                            value={requirement}
                            fullWidth
                            sx={{ marginY: 1 }}
                            onKeyDown={(e) => handleEnterKey(e, 'requirements')}
                            onChange={(e) => setRequirement(e.target.value)}
                            className='requirementField'
                        />
                    :
                        <TextField name='requirements' variant='outlined' label='Requirements*' value={requirement} fullWidth onKeyDown={(e) => handleEnterKey(e, 'requirements')} onChange={(e) => setRequirement(e.target.value)}  sx={{ marginY: 1 }}  className='requirementField' />
                    }
                    
                    <Container>
                        <Box sx={{ minHeight: 100, background: 'lightgrey', padding: 2, marginBottom: 2 }}>
                            {createFormData.requirements === undefined ? <></> : createFormData.requirements.length === 0
                                ? 
                                    <div>
                                        <Typography variant='subtitle1' color='text.secondary' sx={{ fontWeight: 'bold' }}>Press Enter to Add Requirements Here</Typography>
                                        <Typography variant='subtitle2' color='text.secondary'>Or else it won't be added to the database!</Typography>
                                    </div>
                                : createFormData.requirements.map((elem) => {
                                return (
                                    <Chip
                                        label={elem}
                                        color='primary'
                                        sx={{ paddingX: 1, margin: 1 }}
                                        onDelete={() => removeElem('requirements', elem)}
                                        deleteIcon={<DeleteIcon />}
                                    />
                                );
                            })}
                        </Box>
                    </Container>

                    <Grid container justifyContent='center'>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" size="large" type="submit" sx={{ marginY: 1, paddingX: 4, paddingY: 2 }} style={{ borderRadius: 50 }}>ADD</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" color="primary" size="small" onClick={clearForm} sx={{ marginY: 1, paddingX: 2, paddingY: 1 }} style={{ borderRadius: 50 }}>Clear</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            </Fade>
        </Modal>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
                message={autoFillFailed ? 'Could not fetch website data...' : snackBarMsg}
                action={action}
            />
        </>
    );
}

export default FormModal;