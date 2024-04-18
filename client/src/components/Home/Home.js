import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAll } from '../../actions/db_actions';
import { Alert, Box, Stepper, Step, StepLabel,
    Typography, StepContent, List, ListItem, ListItemIcon } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalculateIcon from '@mui/icons-material/Calculate';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import './styles.css';
import imapplicantIconCircle from './imapplicantIconCircle.png';

const steps = [
    {
        label: 'Add New Job Applications',
        description: `Try adding a job application with some fields: Job title, Status, Company, Post URL,
            Location, Income, Benefits, and Requirements.`,
    },
    {
        label: 'Manage Your Applications List',
        description: `You can view all the added applications in a list.`,
    },
    {
        label: 'Get Some Help Analazing Job Applications',
        description: `Two types of analysis, Frequencies and Associations, analyze job requirements from the added applications.`,
    },
    {
        label: 'Scores Your Applications',
        description: `Companies are not the only ones to judge. You can judge applications and rank them based on your preferences as well.`,
    },
];

const stepIcons = {
    0: <AddCircleOutlineIcon sx={{ width: 80, height: 80 }} />,
    1: <ListAltIcon sx={{ width: 80, height: 80 }} />,
    2: <EqualizerIcon sx={{ width: 80, height: 80 }} />,
    3: <CalculateIcon sx={{ width: 80, height: 80 }} />,
}


const Home = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [user, setUser] = useState();

    const [authSuccess, setAuthSuccess] = useState('');
    const [authMessage, setAuthMessage] = useState('');

    const [scoreUpdated, setScoreUpdated] = useState(false);
    const [appDeleted, setAppDeleted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [updatedMsg, setUpdatedMsg] = useState('');

    useEffect(() => {
        if (location.state) {
            if (location.state.status) {
                if (location.state.status == 200) {
                    setAuthSuccess('Success');
                    setUser(JSON.parse(localStorage.getItem('user')));
                    dispatch(getAll('applications', user));
                    const tour = localStorage.getItem('tour');
                    if (tour) {
                        const tourArr = tour.split(',');
                        if (tourArr[0] == 0) {
                            window.location.reload();
                        }
                    }
                } else if (location.state.status != 200) {
                    setAuthSuccess('Fail');
                }
                setAuthMessage(location.state.response);
            } else if (location.state.response) {
                switch (location.state.response) {
                    case 'Invalid credentials':
                    case 'User doesn\'t exist':
                    case 'Something went wrong':
                        setAuthSuccess('Fail');
                        setAuthMessage(location.state.response);
                        break;
                    default:
                        break;
                }
            }

            if (location.state.scoreUpdated) {
                setScoreUpdated(true);
                setUpdatedMsg('Score settings have been updated. Check the results on Show Scores page!');
            } else if (location.state.appDeleted) {
                setAppDeleted(true);
                setUpdatedMsg('Applications Successfully Deleted');
            } else if (location.state.emailSent) {
                setEmailSent(true);
                setUpdatedMsg('Email Sent! Please check the email and follow an instruction.');
            }
        } else {
            dispatch(getAll('applications', user));
        }

    }, [dispatch]);

    return (
        <>
            {authSuccess == 'Success' ?
                <Alert severity='success' sx={{ marginTop: 3 }}>
                    {authMessage}
                </Alert>
            : authSuccess == 'Fail' ?
                <Alert severity='error' sx={{ marginTop: 3 }}>
                    {authMessage}
                </Alert>
            : <></>}
            {scoreUpdated || appDeleted || emailSent ?
                <Alert severity='success' sx={{ marginTop: 3 }}>
                    {updatedMsg}
                </Alert>
            : <></>}
            <Box sx={{ maxWidth: '100%', textAlign: 'center' }}>
                <div>
                    <img src={imapplicantIconCircle} alt='iconAlt' width={600} height={600} />
                    <Typography variant='h2' sx={{ marginTop: 5, marginBottom: 13, fontWeight: 'bold', color: 'text.secondary' }}>Manage and Analyze Job Applications</Typography>
                </div>
                <Stepper orientation='vertical' sx={{ display: 'flex', justifyContent: 'center', width: '70%', margin: 'auto' }}>
                    {steps.map((step, index) => (
                    <Step key={step.label} active='true'>
                        <StepLabel icon={stepIcons[index]}>{step.label}</StepLabel>
                        <StepContent sx={{ marginY: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant='h6' sx={{ marginY: 2 }}>{step.description}</Typography>
                                {index === 1 ? 
                                    <List>
                                        <ListItem sx={{ fontWeight: 'bold' }}><Typography sx={{ fontWeight: 'bold', margin: 'auto' }}>What you can do:</Typography></ListItem>
                                        <ListItem><ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>View a list of job applications</ListItem>
                                        <ListItem><ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>Edit/Delete existing job applications</ListItem>
                                        <ListItem><ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>Update application status</ListItem>
                                        <ListItem><ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>Sort applications by each field</ListItem>
                                        <ListItem><ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>View application counts based on current status</ListItem>
                                    </List>
                                : index === 2 ?
                                    <List>
                                        <ListItem><Typography variant='h6' sx={{ fontWeight: 'bold', margin: 'auto' }}>Frequencies</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>Frequencies analyze every combination of requirements in an application and generates a graph with those combinations that occur at least once in any applications.</Typography></ListItem>
                                        <ListItem><Typography sx={{ fontWeight: 'bold', margin: 'auto' }}>How does this help you?</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>This allows you to figure out what requirement(s) tend to be in job posts you're interested in. Based on that, you can add/remove
                                        certain skills on your resume.</Typography></ListItem>

                                        <ListItem sx={{ marginY: 2 }}></ListItem>

                                        <ListItem><Typography variant='h6' sx={{ fontWeight: 'bold', margin: 'auto' }}>Associations</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>This shows whether or not there is a significant association between a certain job requirement and application status.
                                        Associations conduct Chi-Square Test for independence, that is, it analyzes the relationships between each requirement and applictaion status
                                        to see if either categorical field is influencing the other.</Typography></ListItem>
                                        <ListItem><Typography sx={{ fontWeight: 'bold', margin: 'auto' }}>How does this help you?</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>If any unique requirement is a factor to reject your resume, it might be a good idea to re-read job descriptions
                                        and re-consider demanded skills.</Typography></ListItem>
                                    </List>
                                : index === 3 ? 
                                    <List>
                                        <ListItem><Typography variant='h6' sx={{ fontWeight: 'bold', margin: 'auto' }}>Update Settings</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>There are three fields you can add scores from, company benefits, company names, and job titles.
                                        You might need dental care benefit over vacation pay, or prefer to work as a Data Analysis over Software Engineer.
                                        Order those factors in each field and score/rank existing applications.</Typography></ListItem>

                                        <ListItem sx={{ marginY: 1 }}></ListItem>

                                        <ListItem><Typography variant='h6' sx={{ fontWeight: 'bold', margin: 'auto' }}>Show Scores</Typography></ListItem>
                                        <ListItem><Typography sx={{ margin: 'auto', textAlign: 'center', width: '80%' }}>After setting the scores, each application will be calculated based on the settings, and show their ranks here.</Typography></ListItem>
                                    </List>
                                : <></>}
                        </StepContent>
                    </Step>
                    ))}
                </Stepper>
            </Box>
        </>
    );
}

export default Home;