import React, { useState } from 'react';
import { Typography, AppBar, IconButton } from '@material-ui/core';
import {XYPlot, XAxis, AreaSeries, YAxis, GradientDefs } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


function App() {

  const classes = useStyles();

  const [showHover, setShowHover] = useState(false);

  // TODO add data 😭
  const data = [
    {x: 1654, y: 4},
    {x: 1655, y: 5},
    {x: 1656, y: 7},
    {x: 1657, y: 7},
    {x: 1658, y: 2},
    {x: 1659, y: 2},
    {x: 1660, y: 3},
  ]

  const hovered = (value, _) => {
    
  }

  return (
    <div className={classes.root}>
    <AppBar position="static">
      <Typography variant="h6" className={classes.title } >
        Project: Timeline
      </Typography>
    </AppBar>
    <Typography variant="h3">
      {'Title of Diagram'}
    </Typography>
    <XYPlot
      width={1600}
      height={600}
      yDomain={[0, 10]}
      >

      <GradientDefs>
        <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8}/>
          <stop offset="100%" stopColor="#2699FB" stopOpacity={0.2} />
        </linearGradient>
      </GradientDefs>

      <XAxis
        tickValues={data.map((value) => value.x)}
        tickFormat={(value, index, scale, tickTotal) => Math.trunc(value)}
      />
      <YAxis tickValues={[0,1,2,3,4,5,6,7,8]}/>

      <AreaSeries color={'url(#CoolGradient)'} data={data} curve={'curveCardinal'} onNearestX={hovered}/>

    </XYPlot>
    </div>
    
  );
}

export default App;
