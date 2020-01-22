import React, { useState } from 'react';
import { Typography, AppBar, Button, Toolbar, IconButton, InputLabel, FormControl, Select, MenuItem, Grid } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair, XYPlot } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import { kaiser, initialKaiser, getPositionOfKaisersInRange, getMaxColumnInRange } from './data/kaiser';

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
  formControl: {
    margin: theme.spacing(1), 
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function App() {

  const classes = useStyles();

  const [start, end, min, max] = [1415, 1780, 0, 10];

  const data = () => Array.from({ length: end - start }, (v, k) => k + start).map((value) => {
    return ({ x: value, y: Math.random() * (max - min) + min })
  })

  const [graphData, setGraphData] = useState(data());
  const [crossHairValues, setCrossHairValues] = useState([]);
  const [selectedKaiserID, setSelectedKaiserID] = useState(initialKaiser);

  // const kaiserData = kaiser.map((item) => {
  //   let d = { x0: parseInt(item.start.substring(0, 4)), x: parseInt(item.end.substring(0, 4)), y0: -1 * item.spalte, y: -1 * item.spalte - 1 }

  //   return (d)
  // });

  // const range = () => {
  //   return ([
  //     kaiserData[selectedKaiserIndex].x0 - 5,
  //     kaiserData[selectedKaiserIndex].x + 5
  //   ])
  // }

  const range = () => {
    const selectedKaiser = kaiser.find(kaiser => {
      return kaiser.ID === selectedKaiserID;
    })
    let min = parseInt(selectedKaiser.start.substring(0, 4));
    let max = parseInt(selectedKaiser.end.substring(0, 4));
    
    if (min <= 1420){
      return [1415, max+5]
    }

    if (max >= 1775) {
      return [min - 5, 1780]
    }

    return [min -5, max + 5]
  }

  const getKaiserData = () => {
    const [min, max] = range();
    
    let positions = getPositionOfKaisersInRange(min, max, selectedKaiserID);
    let data = [];
    for (const column of Object.keys(positions)) {
      console.log(column);
      for (const kaiser of positions[column]) {
        const kaiserObj = {
          x: kaiser.start,
          x0: kaiser.end,
          y: column * -1,
          y0: (column * -1) - 1,
          id: kaiser.id
        };
        console.log(kaiserObj);
        
        data.push(kaiserObj);
      }
    }
    return data;
  }

  const kaiserData = getKaiserData();

  const minimum = () => {
    const [min, max] = range();
    return -1 * getMaxColumnInRange(min, max) - 1;
  }

  const hovered = (value, { index }) => {
    let valueRounded = {x: value.x, y: Math.round(value.y)}
    setCrossHairValues([valueRounded])
  }

  const kaiserClicked = (id) => {
    setSelectedKaiserID(id);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ color: '#ffffff'}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} >
            PROJECT TIMELINE
        </Typography>
          <Button variant="contained" color="primary"  onClick={() => setGraphData(data)} style={{ color: '#ffffff'}}>RELOAD</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} alignItems="center" style={{marginLeft:5}}>
        <Grid item xs>
          <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              HOFSTAAT
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={selectedKaiserID}
              id="demo-simple-select-outlined"
              onChange={(event) => kaiserClicked(event.target.value)}
              autoWidth
            >
            {kaiser.map((item) => {
              return (
                <MenuItem key={item.ID} value={item.ID} >
                  {item.NAME}
                </MenuItem>
              )
            })}
          </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              HERKUNFTSORTE
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={selectedKaiserID}
              id="demo-simple-select-outlined"
              onChange={(event) => kaiserClicked(event.target.value)}
              autoWidth
            >
            {kaiser.map((item) => {
              return (
                <MenuItem key={item.ID} value={item.ID} >
                  {item.NAME}
                </MenuItem>
              )
            })}
          </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              ORTE
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={selectedKaiserID}
              id="demo-simple-select-outlined"
              onChange={(event) => kaiserClicked(event.target.value)}
              autoWidth
            >
            {kaiser.map((item) => {
              return (
                <MenuItem key={item.ID} value={item.ID} >
                  {item.NAME}
                </MenuItem>
              )
            })}
          </Select>
          </FormControl>
        </Grid> 
        <Grid item xs >
          <Button variant="contained" color="secondary" onClick={() => setGraphData(data)} style={{ float:'right', marginRight: 40 }}>IMPORT EXT. DATA
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h3" color="primary" align="center">
        {'HÖFLINGE AUS FLORENZ'}
      </Typography>
      <FlexibleWidthXYPlot
        height={600}
        yDomain={[minimum(), 10]}
        xDomain={range()}
        animation
        onMouseLeave={() => setCrossHairValues([])}
      >

        <GradientDefs>
          <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#2699FB" stopOpacity={0.0} />
          </linearGradient>
        </GradientDefs>
        {/* <Crosshair animation values={crossHairValues} /> */}

        <XAxis
          tickValues={graphData.map((value) => value.x)}
          tickFormat={(value, index, scale, tickTotal) => {
            if (value % 3 === 0) {
              return Math.trunc(value);
            } return "";
          }}
        />
        <YAxis tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />

        <AreaSeries fill={'url(#CoolGradient)'} stroke={'#0000'} data={graphData} curve={'curveCardinal'} onNearestX={hovered}/>

        <HorizontalRectSeries>
          data={{x0:1415, x:1780, y0:0, y:6}} fill={'#fff'} stroke={'#fff'}
        </HorizontalRectSeries>


        {kaiserData.map((value) => {
          if (value.id === selectedKaiserID) {
            return (
              <HorizontalRectSeries key={value.id} data={[value]} fill={'#2699FB'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(value.id)} />
            )
          }
          return (
            <HorizontalRectSeries key={value.id} data={[value]} fill={'#fff'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(value.id)} />
          )
        })}

      </FlexibleWidthXYPlot>
    </div>

  );
}

export default App;
