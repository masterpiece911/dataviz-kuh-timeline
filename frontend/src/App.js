import React, { useState } from 'react';
import { Typography, AppBar, Button, Toolbar, IconButton, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import { kaiser, pos_ferdinand_ii } from './data/kaiser';

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

  const [start, end, min, max] = [1415, 1780, 0, 10];

  const data = () => Array.from({ length: end - start }, (v, k) => k + start).map((value) => {
    return ({ x: value, y: Math.random() * (max - min) + min })
  })

  const [graphData, setGraphData] = useState(data());
  const [crossHairValues, setCrossHairValues] = useState([]);
  const [selectedKaiserIndex, setSelectedKaiserIndex] = useState(pos_ferdinand_ii);
  
  // const [labelWidth, setLabelWidth] = React.useState(0);
  // React.useEffect(() => {
  //   setLabelWidth(inputLabel.current);
  // }, []);

  const kaiserData = kaiser.map((item) => {
    let d = { x0: parseInt(item.start.substring(0, 4)), x: parseInt(item.end.substring(0, 4)), y0: -1, y: -2 }

    return (d)
  });

  const range = () => {
    return ([
      kaiserData[selectedKaiserIndex].x0 - 5,
      kaiserData[selectedKaiserIndex].x + 5
    ])
  }

  const handleChange = event => {
    setSelectedKaiserIndex(event.target.value);
  };
  const hovered = (value, { index }) => {
    setCrossHairValues([value])
    console.log(value.y);

    console.log(crossHairValues);
  }

  const kaiserClicked = (index) => {
    setSelectedKaiserIndex(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} >
            PROJECT TIMELINE
        </Typography>
          <Button color="inherit" onClick={() => setGraphData(data)}>RELOAD</Button>
        </Toolbar>
      </AppBar>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          HOFSTAAT
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          value={selectedKaiserIndex}
          id="demo-simple-select-outlined"
          onChange={handleChange}
          autoWidth
        >
          {kaiser.map((item, index) => {
            return (
              <MenuItem key={item.ID} value={index} >
                {item.NAME}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <Typography variant="h3">
        {'Title of Diagram'}
      </Typography>
      <FlexibleWidthXYPlot
        height={600}
        yDomain={[-5, 10]}
        xDomain={range()}
        animation
      >

        <GradientDefs>
          <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#2699FB" stopOpacity={0.0} />
          </linearGradient>
        </GradientDefs>

        <XAxis
          tickValues={graphData.map((value) => value.x)}
          tickFormat={(value, index, scale, tickTotal) => Math.trunc(value)}
        />
        <YAxis tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />

        <AreaSeries color={'url(#CoolGradient)'} data={graphData} curve={'curveCardinal'} onNearestX={hovered} onMouseLeave={() => setCrossHairValues([])} />

        <Crosshair values={crossHairValues} >

        </Crosshair>

        {kaiserData.map((value, index) => {
          if (index === selectedKaiserIndex) {
            return (
              <HorizontalRectSeries key={index} data={[value]} fill={'#2699FB'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(index)} />
            )
          }
          let alt = { x: value.x, x0: value.x0, y: value.y - 1, y0: value.y0 - 1 }
          return (
            <HorizontalRectSeries key={index} data={[alt]} fill={'#fff0'} stroke={'#2699FB'} onSeriesClick={() => kaiserClicked(index)} />
          )
        })}

      </FlexibleWidthXYPlot>
    </div>

  );
}

export default App;
