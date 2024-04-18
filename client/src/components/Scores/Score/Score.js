import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Chip, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
import JoyRide from 'react-joyride'; // For tours

const steps = [
    { target: '.blank', },
    {
        target: '.dragField',
        content: <div style={{ textAlign: 'center' }}>All the unique data from applications are stored here</div>,
        disableBeacon: true,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.draggableItem',
        content: <div style={{ textAlign: 'center' }}><div><SwipeUpIcon /></div><div>Drag these items from here</div></div>,
        spotlightPadding: 10,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.dropField',
        content: <div style={{ textAlign: 'center' }}>Then drop the items here</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    {
        target: '.priorityLabel',
        content: <div style={{ textAlign: 'center' }}>You can order based on priority</div>,
        spotlightPadding: 0,
        styles: {
            options: {
                width: 250,
            },
        },
    },
    { target: '.blank', },{ target: '.blank', },{ target: '.blank', },
];

const getListStyle = (isDraggingOver, widthMax) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    overflowX: 'scroll',
    padding: 8,
    width: widthMax ? '100%' : '84%',
    height: 100,
    margin: 'auto',
});

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 8 * 2,
    margin: `0 0 8px 0`,
  
    // change background colour if dragging
    //background: isDragging ? "lightgreen" : "grey",
  
    // styles we need to apply on draggables
    ...draggableStyle
});

const Score = ({ items, fieldName, onChangeSourceDest, run, childRun }) => {
    const destKey = 'dest' + fieldName; // e.g., destbenefits
    const sourceKey = 'source' + fieldName; // e.g., sourcebenefits
    const [subRun, setSubRun] = useState(false);

    useEffect(() => {
        if (childRun) {
            setSubRun(true);
        }
    }, [run]);

    const handleSubJoyrideCallback = (e) => {
        if (e.type == 'step:after') {
            if (e.index == 4) {
                console.log('Score run');
                setSubRun(false);
                run();
            }
        }
    }

    return (
        <Grid container direction='column' spacing={1}>
            <JoyRide
                steps={steps}
                callback={(e) => handleSubJoyrideCallback(e)}
                continuous
                hideCloseButton
                hideBackButton
                run={subRun}
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
            <Grid item>
                <Grid container>
                    <Grid item xs={1} sx={{ textAlign: 'center', margin: 'auto' }}>
                        <IconButton sx={{ display: 'block' }} className='priorityLabel'>
                            <ArrowCircleLeftOutlinedIcon />
                            <div style={{ fontSize: 15, display: 'block', fontWeight: 'bold' }}>HIGHEST Priority</div>
                        </IconButton>
                    </Grid>
                    <Grid item xs={10} className='dropField'>
                        <Droppable key={destKey} droppableId={destKey} direction='horizontal'>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver, true)}
                                    {...provided.droppableProps}
                                >
                                {items.dest ? items.dest.map((item, index) => (
                                    <Draggable
                                        key={'dest' + item} // e.g., destbenefit1
                                        draggableId={'dest' + item}
                                        index={index}
                                    >

                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <div
                                                style={{
                                                display: 'flex',
                                                justifyContent: 'space-around'
                                                }}
                                            >
                                                <Chip
                                                    label={item}
                                                    color='primary'
                                                    sx={{ paddingX: 1 }}
                                                    onDelete={() => {
                                                        onChangeSourceDest(fieldName, items.source, items.dest, {index: index, droppableId: sourceKey});
                                                    }}
                                                    deleteIcon={<DeleteIcon />}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    </Draggable>
                                )) : <></>}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: 'center', margin: 'auto' }}>
                        <IconButton sx={{ display: 'block' }} className='priorityLabel'>
                            <ArrowCircleRightOutlinedIcon />
                            <div style={{ fontSize: 15, display: 'block', fontWeight: 'bold' }}>LEAST Priority</div>
                        </IconButton>
                    </Grid>
        
                </Grid>
            </Grid>
        
            <Grid item className='dragField'>
                <Droppable key={sourceKey} droppableId={sourceKey} direction='horizontal'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver, false)}
                            {...provided.droppableProps}
                        >
                        {items.source ? items.source.map((item, index) => (
                            <Draggable
                                key={'source' + item}
                                draggableId={'source' +item}
                                index={index}
                            >

                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <Chip label={item} color='primary' sx={{ paddingX: 1 }} className='draggableItem' />
                                </div>
                            )}
                            </Draggable>
                        )) : <></>}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Grid>
        </Grid>   
    );
}

export default Score;