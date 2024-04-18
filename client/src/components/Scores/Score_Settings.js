import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Checkbox, FormControlLabel, Button, Grid, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Score from './Score/Score';
import { updateAppScores } from '../../actions/db_actions';
import JoyRide from 'react-joyride'; // For tours

const steps = [
    {
        target: '.scoreSettingFields',
        content: <div style={{ textAlign: 'center' }}>This is where you can set application priority based on its job title, company name, and benefits</div>,
        disableBeacon: true,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    { target: '.blank', },{ target: '.blank', },{ target: '.blank', },{ target: '.blank', },
    {
        target: '.checkboxField',
        content: <div style={{ textAlign: 'center' }}>Check the fields you would like to save</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.saveButton',
        content: <div style={{ textAlign: 'center' }}><div>Save the settings here.</div><div>Now check out score results under Scores tab!</div></div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 270,
            },
        },
    },
    /*
    {
        target: '.scoreTab',
        content: <div style={{ textAlign: 'center' }}>You can see the ranking results here</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    */
];

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
  
    destClone.splice(droppableDestination.index, 0, removed);
  
    const result = {};
    result.source = sourceClone;
    result.dest = destClone;
  
    return result;
};

const Score_Settings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const benefits = useSelector((state) => state.benefits); // [{id:,app_arr:}, {id:,app_arr:},...]
    const companies = useSelector((state) => state.companies);
    const titles = useSelector((state) => state.titles);

    const [beneSourceDest, setBeneSourceDest] = useState({});
    const [compSourceDest, setCompSourceDest] = useState({});
    const [titleSourceDest, setTitleSourceDest] = useState({});

    const [checked, setChecked] = useState([true, true, true]); // [0]: benefits, [1]: companies, [2]: titles

    const [run, setRun] = useState(false);
    const [subRun, setSubRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    const deleteItem = (fieldName, source, destination, removeObj) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = destClone.splice(removeObj.index, 1);

        sourceClone.unshift(removed);

        const result = {};
        result.source = sourceClone;
        result.dest = destClone;

        switch(fieldName) {
            case 'benefits':
                setBeneSourceDest({ source: result.source, dest: result.dest });
                break;
            case 'companies':
                setCompSourceDest({ source: result.source, dest: result.dest });
                break;
            case 'titles':
                setTitleSourceDest({ source: result.source, dest: result.dest });
                break;
            default:
                break;
        }
    }

    // Handle checkboxes for score setting fields
    const handleChangeParent = (event) => {
        setChecked([event.target.checked, event.target.checked, event.target.checked]);
    };

    const handleChangeBene = (event) => {
        setChecked([event.target.checked, checked[1], checked[2]]);
    };

    const handleChangeComp = (event) => {
        setChecked([checked[0], event.target.checked, checked[2]]);
    };

    const handleChangeTitle = (event) => {
        setChecked([checked[0], checked[1], event.target.checked]);
    };

    const handleSaveSettings = () => {
        if (checked[0]) {
            dispatch(updateAppScores('benefits',  beneSourceDest.source, beneSourceDest.dest));
        }

        if (checked[1]) {
            dispatch(updateAppScores('companies',  compSourceDest.source, compSourceDest.dest));
        }

        if (checked[2]) {
            dispatch(updateAppScores('titles',  titleSourceDest.source, titleSourceDest.dest));
        }

        navigate('/', {
            state: {
                scoreUpdated: true,
            }
        });
    }

    useEffect(() => {
        if (beneSourceDest.length === undefined) {
            setBeneSourceDest({source: benefits.map((benefit) => benefit.id), dest: []});
        }
        if (compSourceDest.length === undefined) {
            setCompSourceDest({source: companies.map((company) => company.id), dest: []});
        }
        if (titleSourceDest.length === undefined) {
            setTitleSourceDest({source: titles.map((title) => title.id), dest: []});
        }

        const tourStr = localStorage.getItem('tour');
        if (tourStr) {
            const tourArr = tourStr.split(',');
            if (tourArr[3] == 0 && tourArr[1] == 1) {
                setRun(true);
                localStorage.setItem('tour', [tourArr[0], tourArr[1], tourArr[2], 1]);
            }
        }
    }, [benefits, companies, titles]);

    // When an item is dropped
    function onDragEnd(result) {
        const { source, destination } = result;
        
        // dropped outside the list
        if (!destination) {
            return;
        }

        const sInd = source.droppableId; // id for the field where items are dragged from
        const dInd = destination.droppableId; // id for the field where items are dragged to

        // Avoid moving items from top to bottom field
        if (sInd.includes('dest') && dInd.includes('source')) {
            return;
        }

        var objKey; var subStr;
        if (sInd.includes('source')) {
            objKey = 'source';
            subStr = sInd.substring(6);
        } else {
            objKey = 'dest';
            subStr = sInd.substring(4);                
        }
        
        if (sInd === dInd) { // For sorting within the field
            var items;

            switch(subStr) {
                case 'benefits':
                    items = reorder(beneSourceDest[objKey], source.index, destination.index);
                    setBeneSourceDest({...beneSourceDest, [objKey]: items});
                    break;
                case 'companies':
                    items = reorder(compSourceDest[objKey], source.index, destination.index);
                    setCompSourceDest({...compSourceDest, [objKey]: items});
                    break;
                case 'titles':
                    items = reorder(titleSourceDest[objKey], source.index, destination.index);
                    setTitleSourceDest({...titleSourceDest, [objKey]: items});
                    break;
                default:
                    break;
            }
        } else { // For moving to the other field
            switch(subStr) {
                case 'benefits':
                    result = move(beneSourceDest.source, beneSourceDest.dest, source, destination);
                    setBeneSourceDest({ source: result.source, dest: result.dest });
                    break;
                case 'companies':
                    result = move(compSourceDest.source, compSourceDest.dest, source, destination);
                    setCompSourceDest({ source: result.source, dest: result.dest });
                    break;
                case 'titles':
                    result = move(titleSourceDest.source, titleSourceDest.dest, source, destination);
                    setTitleSourceDest({ source: result.source, dest: result.dest });
                    break;
                default:
                    break;
            }
        }
    }

    const handleJoyrideCallback = (e) => {
        if (e.type == 'step:after') {
            const index = stepIndex + 1;
            setStepIndex(index);

            if (e.index === 0) {
                setRun(false);
                setSubRun(true);
            }
        }
    }

    const handleRun = () => {
        setSubRun(false);
        setStepIndex(5);
        setRun(true);
    }

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center'>
            <JoyRide
                steps={steps}
                stepIndex={stepIndex}
                callback={(e) => handleJoyrideCallback(e)}
                continuous
                hideCloseButton
                hideBackButton
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

            { !benefits.length || !companies.length || !titles.length ? <Alert severity='info'>Please Add Applications First to Use This Feature</Alert> :
                <>
                    <Grid item sx={{ minWidth: '80%' }} className='scoreSettingFields'>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <FormControlLabel 
                                label='Check All'
                                control={
                                    <Checkbox
                                        checked={checked[0] && checked[1] && checked[2]}
                                        indeterminate={checked[0] != checked[1] || checked[1] != checked[2] || checked[0] != checked[2]}
                                        onChange={handleChangeParent}
                                    />
                                }
                                sx={{ display: 'block' }}
                            /> 
                            <FormControlLabel 
                                label='Benefits'
                                control={<Checkbox checked={checked[0]} onChange={handleChangeBene} className='checkboxField' />}
                            />
                            {!benefits.length ? <CircularProgress /> : (
                                <Score items={beneSourceDest} fieldName='benefits' onChangeSourceDest={deleteItem} run={handleRun} childRun={subRun} />
                            )}

                            <FormControlLabel 
                                label='Companies'
                                control={<Checkbox checked={checked[1]} onChange={handleChangeComp} />}
                            />
                            {!companies.length ? <CircularProgress /> : (
                                <Score items={compSourceDest} fieldName='companies' onChangeSourceDest={deleteItem} />
                            )}

                            <FormControlLabel 
                                label='Titles'
                                control={<Checkbox checked={checked[2]} onChange={handleChangeTitle} />}
                            />
                            {!titles.length ? <CircularProgress /> : (
                                <Score items={titleSourceDest} fieldName='titles' onChangeSourceDest={deleteItem}/>
                            )} 
                        </DragDropContext>
                    </Grid>
                    <Grid item>
                        <Button variant='outlined' startIcon={<AddIcon />} onClick={handleSaveSettings} sx={{ marginY: 3 }} className='saveButton'>
                            Save
                        </Button>
                    </Grid>
                </>
            }
        </Grid>
    );
}

export default Score_Settings;
export { move };