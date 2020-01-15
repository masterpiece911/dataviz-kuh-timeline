import React, { useState } from 'react';
import { Typography, AppBar, Button, Toolbar, IconButton, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

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
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function App() {

  const classes = useStyles();

  const [ start, end, min, max ] = [ 1610, 1660, 0, 10 ];

  const data = () => Array.from({length: end - start}, (v, k) => k + start).map((value) => {
    return ({x: value, y: Math.random() * (max - min) + min})
  })

  const [graphData, setGraphData, setLabel] = useState(data());
  const [crossHairValues, setCrossHairValues] = useState([]);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current);
  }, []);

  const kaiser = [
    {name: "MATTHIAS"      , start: 1612, end: 1619},  
    {name: "FERDINAND II. ", start: 1619, end: 1637},
    {name: "FERDINAND III.", start: 1637, end: 1657},
  ]

  const kaiserData = kaiser.map((item) => {
    return ({x0: item.start, x: item.end, y0: -1, y: -2})
  });

  const selectedKaiser = 1;

  const range = [
    kaiser[1].start - 5,
    kaiser[1].end + 5
  ]
  const handleChange = event => {
    setLabel(event.target.value);
  };
  const hovered = (value, {index}) => {
    setCrossHairValues([value])
    console.log(value.y);
    
    console.log(crossHairValues);
    
    
  }

  return (
    <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit">
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title } >
          PROJECT TIMELINE
        </Typography>
        <Button color="inherit" onClick={() => setGraphData(data)}>RELOAD</Button>
      </Toolbar>
    </AppBar>
    <FormControl variant="outlined" className={classes.formControl}>
    <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          Hier
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          //value={age}
          id="demo-simple-select-outlined"
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          {kaiser.map((item) => { return (
            <MenuItem value={item.name} >
              {item.name}
            </MenuItem>            
          )
          })}
        </Select>
    </FormControl>
    <Typography variant="h3">
      {'Title of Diagram'}
    </Typography>
    <FlexibleWidthXYPlot
      height={800}
      yDomain={[-2, 10]}
      xDomain={range}
      animation
      >

      <GradientDefs>
        <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8}/>
          <stop offset="100%" stopColor="#2699FB" stopOpacity={0.0} />
        </linearGradient>
      </GradientDefs>

      <XAxis
        tickValues={graphData.map((value) => value.x)}
        tickFormat={(value, index, scale, tickTotal) => Math.trunc(value)}
      />
      <YAxis tickValues={[0,1,2,3,4,5,6,7,8,9,10]}/>

      <AreaSeries color={'url(#CoolGradient)'} data={graphData} curve={'curveCardinal'} onNearestX={hovered} onMouseLeave={() => setCrossHairValues([])}/>

      <Crosshair values={crossHairValues} >

      </Crosshair>

      {kaiserData.map((value, index) => {
        if (index === selectedKaiser) {
          return (
            <HorizontalRectSeries key={kaiser[index].name} data={[value]} fill={'#2699FB'} stroke={'#2699FB'}/>
          )
        }
        return (
          <HorizontalRectSeries key={kaiser[index].name} data={[value]} fill={'#fff'} stroke={'#2699FB'} />
        )
      })}

    </FlexibleWidthXYPlot>
    </div>
    
  );
}

export default App;
