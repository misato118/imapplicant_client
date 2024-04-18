import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem, Alert, Avatar, ListItemText,
    Rating, Divider, Grid, Paper, Typography } from '@mui/material';
import { yellow, grey, orange } from '@mui/material/colors';
import Scores_Sub_Result from './Scores_Sub_Result.js';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Sort applications by score
function compare(a, b) {
    if ( a.score > b.score ){
        return -1;
      }
      if ( a.score < b.score ){
        return 1;
      }
      return 0;
}

// This shows the result of calculated scores for each application
const Scores_result = () => {
    const score = useSelector((state) => state.score);
    const rank = useSelector((state) => state.rankings);

    var convertedScore = [];

    score.sort(compare);
    score.map((app) => {
        const convertedNum = (app.score * 5) / 100;
        convertedScore.push(Math.round(convertedNum * 100) / 100);
    });

    return (
        !score.length || !Object.keys(rank).length ? <Alert severity='info' sx={{ margin: 'auto' }}>Please Update Score Settings to See Application Scores</Alert> :
        <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
                <Paper sx={{ maxHeight: 800, overflowY: 'auto' }}>
                { score.map((app, index) => {
                    return (
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            { index + 1 === 1 ? <><EmojiEventsIcon sx={{ marginLeft: 1, marginBottom: 1, color: yellow['A700'] }} /><Avatar sx={{ bgcolor: yellow['A400'] }}>{index + 1}</Avatar></>
                                                : index + 1 === 2 ? <Avatar sx={{ bgcolor: grey[500] }}>{index + 1}</Avatar>
                                                : index + 1 ===3 ? <Avatar sx={{ bgcolor: orange[500] }}>{index + 1}</Avatar>
                                                : <Typography sx={{ fontWeight: 'bold', marginLeft: 2 }}>{index + 1}</Typography> }
                                        </Grid>
                                        <Grid item xs={4}>
                                            <ListItemText primary={app.title} secondary={app.company} sx={{ textTransform: 'capitalize' }} />
                                            <ListItemText secondary={app.score ? 'Score ' + app.score : 'No Score Yet'}  />
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Rating
                                                value={convertedScore[index] ? convertedScore[index] : 0}
                                                precision={0.1}
                                                readOnly
                                                size='large'
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider sx={{ opacity: 1, marginTop: 3 }} />
                            </List>
                        
                    );
                })}
                </Paper>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={4}>
                <Grid container direction='column'>
                    <Grid item><Typography variant='h5'>Rankings You Have Set to Each Category</Typography></Grid>
                    <Grid item sx={{ marginY: 3 }}><Paper sx={{ padding: 2, maxHeight: 200, overflow: 'auto' }}><Scores_Sub_Result rank={rank.benefits} /></Paper></Grid>
                    <Grid item sx={{ marginY: 3 }}><Paper sx={{ padding: 2, maxHeight: 200, overflow: 'auto' }}><Scores_Sub_Result rank={rank.companies} /></Paper></Grid>
                    <Grid item sx={{ marginY: 3 }}><Paper sx={{ padding: 2, maxHeight: 200, overflow: 'auto' }}><Scores_Sub_Result rank={rank.titles} /></Paper></Grid>
                    {/* <Grid item sx={{ marginY: 3 }}>Income here</Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={1}></Grid>
        </Grid>
    );
}

export default Scores_result;