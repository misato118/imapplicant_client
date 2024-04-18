import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Box, Tabs, Tab, Menu, MenuItem } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalculateIcon from '@mui/icons-material/Calculate';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

import FormModal from '../FormModal/FormModal.js';
import JoyRide from 'react-joyride'; // For tours

const steps = [
    {
        target: '.createIcon',
        content: <div style={{ textAlign: 'center' }}>Add new applications here</div>,
        disableBeacon: true,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.appIcon',
        content: <div style={{ textAlign: 'center' }}>Added applications are here</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.researchIcon',
        content: <div style={{ textAlign: 'center' }}>Analyze applications by their requirements</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 300,
            },
        },
    },
    {
        target: '.scoresIcon',
        content: <div style={{ textAlign: 'center' }}>You can rank applications</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.authIcon',
        content: <div style={{ textAlign: 'center' }}><div>Login first</div><div> to save your data!</div></div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 210,
            },
        },
    },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [userLabel, setUserLabel] = useState('LOGIN');
    
    const [navVal, setNavVal] = useState(false); // For navigation tabs
    const [scoreAnchorEl, setScoreAnchorEl] = useState(null); // For score dropdown menu
    const [researchAnchorEl, setResearchAnchorEl] = useState(null); // For research dropdown menu
    const openScoresTab = Boolean(scoreAnchorEl); // For score tab
    const openResearchTab = Boolean(researchAnchorEl); // For research tab

    const [openModal, setOpenModal] = useState(false); // For a modal
    const [run, setRun] = useState(false);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));

        if (user) {
            const tourStr = localStorage.getItem('tour');
            if (tourStr) {
                const tourArr = tourStr.split(',');
                if (tourArr[0] == 0) {
                    setRun(true);
                    localStorage.setItem('tour', [1, tourArr[1], tourArr[2], tourArr[3]]);
                }
            }
        }

    }, [location]);

    const handleOpenScoreTab = (event) => { setScoreAnchorEl(event.currentTarget); };  // Open dropdown menu
    const handleCloseScoreMenu = () => { setScoreAnchorEl(null); }; // Close dropdown menu

    const handleOpenResearchTab = (event) => { setResearchAnchorEl(event.currentTarget); };  // Open dropdown menu
    const handleCloseResearchMenu = () => { setResearchAnchorEl(null); }; // Close dropdown menu

    const handleChangeTabs = (event, newValue) => { 
        if (newValue == '0') {
            setNavVal(false);
        } else {
            setNavVal(newValue);
        }
    }; // For navigate tabs

    const handleOpenModal = () => {
        if (user) { // If user already logged in
            setOpenModal(true);
        } else { // Ask user to login first
            navigate('/auth');
        } 
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const showApplications = () => {
        navigate('/applications', {
            state: {
                isLoggedin: user ? true : false,
            }
        });
    }

    const showScoreSettings = () => {
        setScoreAnchorEl(null);
        navigate('/scores', {
            state: {
                pageName: 'settings',
                isLoggedin: user ? true : false,
            }
        });
    }

    const showScores = () => {
        setScoreAnchorEl(null);
        navigate('/scores', {
            state: {
                pageName: 'results',
                isLoggedin: user ? true : false,
            }
        });
    }

    const showFreqResearch = () => {
        setResearchAnchorEl(null);
        navigate('/research', {
            state: {
                pageName: 'frequency',
                isLoggedin: user ? true : false,
            }
        });
    }

    const showAssocResearch = () => {
        setResearchAnchorEl(null);
        navigate('/research', {
            state: {
                pageName: 'association',
                isLoggedin: user ? true : false,
            }
        });
    }

    const handleJoyrideCallback = (e) => {
        if (e.action == 'update') {
            console.log(e.index);
            if (e.index == 5) {
                setRun(false);
            }
        }
    }

    return(
        <Box sx={{ width: '100%', marginTop: 1, marginBottom: 5 }}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <JoyRide
                    steps={steps}
                    callback={(e) => handleJoyrideCallback(e)}
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
                        last: 'End tour',
                    }}
                />
                {/* TODO: Tabs navigation underline */}
                <Tabs value={navVal} onChange={handleChangeTabs} centered aria-label='icon label tabs example' sx={{ boxShadow: 3, paddingTop: 1 }}>
                    <Tab icon={<HomeIcon />} label='HOME' aria-label='home' component={Link} to='/' value='0' />
                    <Tab icon={<AddCircleOutlineIcon />} label='CREATE' onClick={handleOpenModal} value='1' className='createIcon' />
                    <Tab icon={<ListAltIcon />} label='APPLICATIONS' onClick={showApplications} value='2' className='appIcon' />
                    <Tab icon={<EqualizerIcon />}
                        label='RESEARCH'
                        value='3'
                        id='research-button'
                        aria-controls={openResearchTab ? 'research-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={openResearchTab ? 'true' : undefined}
                        onClick={handleOpenResearchTab}
                        className='researchIcon' />
                    <Menu
                        id='research-menu'
                        anchorEl={researchAnchorEl}
                        open={openResearchTab}
                        value='0'
                        onClose={handleCloseResearchMenu}
                        MenuListProps={{
                        'aria-labelledby': 'research-menu',
                        }}
                    >
                        <MenuItem onClick={showFreqResearch}>Frequencies</MenuItem>
                        <MenuItem onClick={showAssocResearch }>Associations</MenuItem>
                    </Menu>

                    <Tab
                        icon={<CalculateIcon />}
                        label='SCORES'
                        value='4'
                        id='basic-button'
                        aria-controls={openScoresTab ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={openScoresTab ? 'true' : undefined}
                        onClick={handleOpenScoreTab}
                        className='scoresIcon' />
                    <Menu
                        id='basic-menu'
                        value='0'
                        anchorEl={scoreAnchorEl}
                        open={openScoresTab}
                        onClose={handleCloseScoreMenu}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={showScoreSettings}>Update Settings</MenuItem>
                        <MenuItem onClick={showScores}>Show Scores</MenuItem>
                    </Menu>
                    <Tab value='5' component={Link} to='/auth' icon={<AccountCircleIcon />} label={userLabel} className='authIcon' />
                </Tabs>
            </Box>
             
            <FormModal open={openModal} close={handleCloseModal} user={user} />

        </Box>
    );
}

export default Navbar;