import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, MobileStepper, Paper, Typography, Button, Alert } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { useTheme } from '@mui/material/styles';
import JoyRide from 'react-joyride'; // For tours

var steps = [
    {
        target: '.reqBarGraph',
        content: <div style={{ textAlign: 'center' }}>You can see how often each requirement appear in all the applications you've created</div>,
        disableBeacon: true,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },{
        target: '.nextButton',
        content: <div style={{ textAlign: 'center' }}>You can see other combinations of requirements that appear in applications as well</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
];

const Research_Req = () => {
    const location = useLocation();
    const theme = useTheme();
    const researchData = useSelector((state) => state.reqResearch);
    let isLoggedin =  location.state.isLoggedin;
    var maxSteps = 0;

    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState(isLoggedin);
    const [run, setRun] = useState(false);

    var result = [];

    useEffect(() => {
        const tourStr = localStorage.getItem('tour');
            if (tourStr) {
                const tourArr = tourStr.split(',');
                if (tourArr[2] == 0 && tourArr[1] == 1) {
                    setRun(true);
                    localStorage.setItem('tour', [tourArr[0], tourArr[1], 1, tourArr[3]]);
                }
            }
    }, []);

    // Load and prep data beforehand
    researchData.map((data) => {
        const combinations = data.frequency.map((group) => group.combination.toString());
        const allData = { data: [] };
        data.frequency.map((group) => { allData.data.push(group.count) });

        if (combinations.length > 0 && allData.data.length > 0) {
            result.push({ combinations: combinations, allData: allData });
            maxSteps++;
        }
    });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Box sx={ !result.length || !user ? { marginY: 1 } : { maxWidth: 800, flexGrow: 1, marginY: 3 }}>
            <JoyRide
                    steps={steps}
                    continuous
                    hideCloseButton
                    run={run}
                    scrollToFirstStep
                    showProgress
                    disableCloseOnEsc
                    styles={{
                        buttonNext: {
                            backgroundColor: 'green',
                        },
                        buttonBack: {
                            marginRight: 10,
                            border: '1px solid green',
                            borderRadius: '3px',
                            color: 'black',
                            padding: '7px 10px',
                        }
                    }}
                    locale={{
                        last: "End tour",
                    }}
            />
            { !result.length || !user ? <Alert severity='info'>Please Add Applications First to See Analysis</Alert> :
                <>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'block',
                            alignItems: 'center',
                            height: 50,
                            pl: 2,
                            bgcolor: 'background.default',
                        }}
                    >
                        <Typography variant='h5' align='center' sx={{ fontWeight: 'bold' }}>Analyze How Frequent Requirements Appear in Applications</Typography>
                        <Typography align='center' sx={{ marginY: 2 }}>Number of Requirements: {activeStep + 1}</Typography>
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                        className='reqBarGraph'
                    >
                        {!result.length || !user ? <></> : result.map((data, index) => (
                        <div> {/*  key={step.label} */}
                            {Math.abs(activeStep - index) <= 2 ? (
                                <BarChart
                                    xAxis={[{ scaleType: 'band', data: data.combinations }]}
                                    series={[data.allData]}
                                    width={800}
                                    height={500}
                                />
                            ) : null}
                        </div>
                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position='static'
                        activeStep={activeStep}
                        nextButton={
                        <Button
                            size='small'
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                            className='nextButton'
                        >
                            Next
                            {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                            ) : (
                            <KeyboardArrowRight />
                            )}
                        </Button>
                        }
                        backButton={
                        <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                            ) : (
                            <KeyboardArrowLeft />
                            )}
                            Back
                        </Button>
                        }
                    />
                </>
            }
        </Box>
    );
}

export default Research_Req;