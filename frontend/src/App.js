import React, { useState, useEffect } from 'react';
import { Typography, AppBar, Button, Toolbar, InputLabel, FormControl, Select, MenuItem, Grid, Box } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair, LabelSeries, LineMarkSeries } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import '../node_modules/react-vis/dist/style.css';
import useWindowSize from 'react-use/lib/useWindowSize';

import { kaiser, initialKaiser, getPositionOfKaisersInRange, getMaxColumnInRange } from './data/kaiser';
import { personen } from './data/personen';
import { queries as queryDefinitions } from './data/queryDefinition';

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

  const {height} = useWindowSize();

  const data = () => Array.from({ length: end - start }, (v, k) => k + start).map((value) => {
    return ({ x: value, y: Math.random() * (max - min) + min })
  })

  const [graphData, setGraphData] = useState(data());
  const [crossHairValues, setCrossHairValues] = useState([]);
  const [selectedKaiserID, setSelectedKaiserID] = useState(initialKaiser);

  const [paramOne, setParamOne] = useState(undefined);
  const [paramTwo, setParamTwo] = useState(undefined);
  
  const [queries, setQueries] = useState(queryDefinitions(setParamOne, setParamTwo));
  const [selectedQuery, setSelectedQuery] = useState(queries[0]); // TODO INITIAL STATE ON ALL OF THESE IS MISSING!!

  useEffect(() => {
    selectedQuery.params.forEach(({setter, initialValue}) => {
      setter(initialValue);
    });
  }, selectedQuery, selectedQuery.params);

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
      for (const kaiser of positions[column]) {
        const kaiserObj = {
          x: kaiser.start,
          x0: kaiser.end,
          y: column * -1,
          y0: (column * -1) - 1,
          id: kaiser.id,
          name: kaiser.name,
        };
        
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

  const maximum = () => {
    return 10
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
      <Typography color="primary" align="center">
        <Box fontSize="h4.fontSize" fontStyle="italic" fontWeight="fontWeightLight">
          HÖFLINGE AUS FLORENZ
        </Box>
      </Typography>
      <FlexibleWidthXYPlot
        height={height-200}
        yDomain={[minimum(), maximum()]}
        xDomain={range()}
        animation={true}
        onMouseLeave={() => setCrossHairValues([])}
      >

        <GradientDefs>
          <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8} />
            <stop offset={((maximum() + 0.5) / (maximum() - minimum()) * 100) + "%"} stopColor="#2699FB" stopOpacity={0.0} />
          </linearGradient>
        </GradientDefs>
        <Crosshair values={crossHairValues}>
        {crossHairValues.map((item) => {return(
                <div style={{borderRadius:4, color:'white', background: '#3e5da1', width:80, height: 80, padding: 6}}>
                  <h3>Jahr: {item.x}</h3>
                  <h3>Anzahl: {item.y}</h3>
                </div>
                )
            })
        }
        </Crosshair>

        <XAxis
          on0
          style={{
            text: {stroke: 'none', fill: '000', fontWeight: 'bold'}
          }}
          hideLine tickSize={0}
          tickValues={graphData.map((value) => value.x)}
          tickFormat={(value, index, scale, tickTotal) => {
            if (value % 3 === 0) {
              return Math.trunc(value);
            } return "";
          }}
        />
        <YAxis 
          tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
          hideLine tickSize={0}
        />

        <AreaSeries fill={'url(#CoolGradient)'} stroke={'#0000'} data={graphData} curve={'curveCardinal'} onNearestX={hovered}/>
        {/* {console.log(personen.slice(0, 8).map((value, idx) => {return ([{x: parseInt(value.Geburtsdatum.substring(0,4)), y:idx}, {x: parseInt(value.Todesdatum.substring(0,4)), y:idx}])}))}
        <LineMarkSeries
        curve={'curveMonotoneX'}
        data={
          personen.slice(0, 8).map((value, idx) => {return ([{x: parseInt(value.Geburtsdatum.substring(0,4)), y:idx}, {x: parseInt(value.Todesdatum.substring(0,4)), y:idx}])})
          }
      /> */}

        <HorizontalRectSeries data={[{x0:1415, x:1780, y0:-0.5, y:minimum()}]} fill={'#ffffff'} stroke={'#ffffff'}/>
          
        {kaiserData.map((value) => {
          if (value.id === selectedKaiserID) {
            return (
              <HorizontalRectSeries key={value.id} data={[value]} fill={'#2699FB'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(value.id)} />
            )
          }
          return (
            <HorizontalRectSeries key={value.id} data={[value]} fill={'#2699FB44'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(value.id)} />
          )
        })}

        <LabelSeries 
          data={kaiserData.map((k) => {return(
            {x: (k.x + k.x0) / 2, y: (k.y + k.y0) / 2 - 1, label: k.name}
            )})}
          style={{fill: 'white', fontWeight: 'bold'}}
          labelAnchorX="middle" labelAnchorY="middle"

        />

      </FlexibleWidthXYPlot>
    </div>

  );
}

export default App;
