import React from 'react';
import { Stack, Grid, Paper, Typography } from '@mui/material';

// Sort object by its rank
function compare(a, b) {
    if ( a.rank < b.rank ){
        return -1;
      }
      if ( a.rank > b.rank ){
        return 1;
      }
      return 0;
}

const Scores_Sub_Result = (props) => {
    const rankData = props.rank;

    if (rankData) {
        rankData.sort(compare);
    }

    return (
        <Stack spacing={2}>
            <Grid container sx={{ paddingX: 2 }}>
                <Grid item xs={2}><Typography>Rank</Typography></Grid>
                <Grid item xs={10}><Typography>Name</Typography></Grid>
            </Grid>
            { rankData ? rankData.map((data) => {
                return (
                    <Paper variant='outlined' sx={{ paddingX: 2, paddingY: 1 }}>
                        <Grid container>
                            <Grid item xs={2}>{data.rank}</Grid>
                            <Grid item xs={10}>{data.id}</Grid>
                        </Grid>
                    </Paper> 
                );
            }) : <Typography>No Rankings Yet</Typography>}
        </Stack>
    );
}

export default Scores_Sub_Result;