import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Card, CardContent, Typography, Grid, Alert } from '@mui/material';

const Research_Assoc = () => {
    const location = useLocation();
    const researchData = useSelector((state) => state.chiSquareIndep);
    let isLoggedin =  location.state.isLoggedin;

    const [user, setUser] = useState(isLoggedin);
    const [isAssociated, setIsAssociated] = useState(false);

    const presentedData = researchData.map((data) => {
        if (data.id) {
            if (data.is_associated == true) {
                setIsAssociated(true);
            }
            return [
                { id: data.id, value: data.table[2][0], label: 'With ' + data.id },
                { id: 'no' + data.id, value: data.table[2][1], label: 'Without ' + data.id }
            ];
        }
    });

    // [(True if influencing in status), (True if influencing positively)]
    var resultBool = {};
    
    researchData.map((data) => {
        if (data.table) {
            const withReq = data.table[2][0] > data.table[2][1] ? true : false;
            resultBool[data.id] = [data.is_associated, withReq];
        }
    });

    const size = {
        width: 370, // 400
        height: 180, // 200
    };

    return(
        <>
            {!presentedData.length && !user
                ? <Alert severity='info' sx={{ margin: 'auto', width: '25%' }}>Please Login</Alert>
                : !presentedData.length
                ? <Alert severity='info' sx={{ margin: 'auto', width: '25%' }}>Update Application Status to see analysis</Alert>
                :
                <Grid container direction='column' width='100%' sx={{ justifyContent:'center', textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ marginY: 3 }}>Requirements Influencing Your Status</Typography>
                    <Grid item xs={6} sx={{ width: '100%', overflowX: 'scroll', marginY: 2, minHeight: 180 }}>
                        <Grid container sx={{ flexWrap: 'nowrap' }}>
                        { !presentedData[0] || !isAssociated ? <Typography sx={{ margin: 'auto' }}>None of The Requirements Are Influencing Your Application Status</Typography> : presentedData.map((data) => {
                            return (
                                <>
                                    { !data ? <></> : resultBool[data[0].id][0] ?
                                    <Grid item sx={{ paddingX: 2, paddingY: 1, margin: 'auto' }}>
                                        <Card sx={{ width: 450 }} variant='outlined'>
                                            { resultBool[data[0].id][1]
                                                ? <Typography variant='h6'>{data[0].id} Influencing Positively</Typography>
                                                : <Typography variant='h6'>{data[0].id} Influencing Negatively</Typography>
                                            }
                                            <CardContent>
                                                <PieChart
                                                    series={[
                                                        {
                                                            data,
                                                            arcLabel: (item) => `${item.label}`,
                                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                        },
                                                    ]}
                                                    sx={{
                                                        [`& .${pieArcLabelClasses.root}`]: {
                                                          fill: 'text.secondary',
                                                          color: 'text.secondary',
                                                          //fontWeight: 'bold',
                                                        },
                                                    }}
                                                    {...size}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    : <></>}
                                </>
                            )
                        })}
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ width: '100%', overflowX: 'scroll', marginY: 2 }}>
                        <Grid container sx={{ flexWrap: 'nowrap' }}>
                        { !presentedData[0] ? <></> : presentedData.map((data) => {
                            return (
                                <>
                                    { !data ? <></> : !resultBool[data[0].id][0] ?
                                    <Grid item sx={{ paddingX: 2, paddingY: 1, margin: 'auto' }}>
                                        <Card sx={{ width: 440 }} variant='outlined'>
                                            <Typography variant='h8' component='div'>
                                                Not Influencing Status
                                            </Typography>
                                            <CardContent>
                                                <PieChart
                                                    series={[
                                                        {
                                                            data,
                                                            arcLabel: (item) => `${item.label}`,
                                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                        },
                                                    ]}
                                                    {...size}
                                                />
                                            </CardContent>
                                        </Card>
                                        </Grid>
                                    : <></>}
                                </>
                            )
                        })}
                        </Grid>
                    </Grid>
                </Grid>
            }
        </>
    );
}

export default Research_Assoc;