import React, { useState, useEffect, useMemo } from 'react';
import { Typography, AppBar, Button, Toolbar, InputLabel, FormControl, Select, MenuItem, Grid, Box } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair, LabelSeries, LineMarkSeries } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import '../node_modules/react-vis/dist/style.css';
import useWindowSize from 'react-use/lib/useWindowSize';

import { kaiser, initialKaiser, getPositionOfKaisersInRange, getMaxColumnInRange } from './data/kaiser';
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

  const [start, end] = [1503, 1705];

  const { height } = useWindowSize();

  const [crossHairValues, setCrossHairValues] = useState([]);
  const [selectedKaiserID, setSelectedKaiserID] = useState(initialKaiser);

  const [paramOne, setParamOne] = useState(null);
  const [paramTwo, setParamTwo] = useState(null);

  const queries = queryDefinitions(setParamOne, setParamTwo);
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);

  useEffect(() => {

    queries[selectedQueryIndex].params.forEach(({ setter, initialValue }) => {
      setter(initialValue);
    });
  }, []);

  if (!paramOne || !paramTwo) {
    setParamOne(queries[selectedQueryIndex].params[0].initialValue);
    setParamTwo(queries[selectedQueryIndex].params[1].initialValue);
  }

  const graphData = useMemo(
    () => {
      console.log(`calculated graph data.`);

      if (!paramOne || !paramTwo) {
        return null;
      }

      const result = queries[selectedQueryIndex].data(paramOne, paramTwo);
      console.log(result);
      return result;

    },
    [paramOne, paramTwo, selectedQueryIndex, queries]
  )

  console.log(graphData);

  const getRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }


  const range = () => {
    const selectedKaiser = kaiser.find(kaiser => {
      return kaiser.ID === selectedKaiserID;
    })
    let min = parseInt(selectedKaiser.start.substring(0, 4));
    let max = parseInt(selectedKaiser.end.substring(0, 4));

    if (min <= start + 5) {
      return [start, max + 5]
    }

    if (max >= end - 5) {
      return [min - 5, end]
    }

    return [min - 5, max + 5]
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

  const hovered = (value, { index }) => {
    let valueRounded = { x: value.x, y: Math.round(value.y) }
    setCrossHairValues([valueRounded])
  }

  const kaiserClicked = (id) => {
    setSelectedKaiserID(id);
  }

  const makeTitle = () => {

    if (!paramOne || !paramTwo) {
      return ('Select all parameters');
    }

    const firstParamField = queries[selectedQueryIndex].params[0].field;
    const secondParamField = queries[selectedQueryIndex].params[1].field;
    const first = firstParamField ? paramOne[firstParamField] : paramOne;
    const second = secondParamField ? paramTwo[secondParamField] : paramTwo;

    return queries[selectedQueryIndex].title(first, second);
  }

  if (!paramOne || !paramTwo) {
    return null;
  }


  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ color: '#ffffff' }}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} >
            PROJECT TIMELINE
        </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} alignItems="center" style={{ marginLeft: 5 }}>
        <Grid item xs>
          <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
            <InputLabel>
              Anfrage
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={selectedQueryIndex}
              id="demo-simple-select-outlined"
              onChange={(event) => {
                setSelectedQueryIndex(event.target.value);
                setParamOne(queries[event.target.value].params[0].initialValue);
                setParamTwo(queries[event.target.value].params[1].initialValue);
              }}
              autoWidth
            >
              {queries.map((item, index) => {
                return (
                  <MenuItem key={item.name} value={index} >
                    {item.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        {queries[selectedQueryIndex].params.map((param, index) => {
          return (
            <Grid key={param.name} item xs >
              <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
                <InputLabel id={`param${index}-input-label`}>
                  {param.name}
                </InputLabel>
                <Select
                  labelId={`param${index}-input-label`}
                  value={index === 0 ? paramOne : paramTwo}
                  onChange={(event) => param.setter(event.target.value)}
                  autoWidth
                >
                  {param.listOfItems.map((item) => {
                    if (param.field) {
                      return (
                        <MenuItem key={item[param.field]} value={item}>
                          {item[param.field]}
                        </MenuItem>
                      )
                    }
                    return (
                      <MenuItem key={item} value={item} >
                        {item}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          )
        })}
        <Grid item xs>

        </Grid>
      </Grid>
      <Typography color="primary" align="center">
        <Box fontSize="h4.fontSize" fontStyle="italic" fontWeight="fontWeightLight">
          {makeTitle()}
        </Box>
      </Typography>
      <FlexibleWidthXYPlot
        height={(height - 200) * 0.7}
        yDomain={[0, graphData.max]}
        xDomain={range()}
        animation={true}
        onMouseLeave={() => setCrossHairValues([])}
      >

        <GradientDefs>
          <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2699FB" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#2699FB" stopOpacity={0.0} />
          </linearGradient>
        </GradientDefs>
        {crossHairValues.length > 0
          ? <Crosshair values={crossHairValues} itemsFormat={(list) => {list.map(item => {
            console.log(item)
            return({title: item.x, value: item.y})
            })}} />
          : null
        }


        <XAxis
          on0
          style={{
            text: { stroke: 'none', fill: '000', fontWeight: 'bold' }
          }}
          hideLine tickSize={0}
          tickFormat={(value, index, scale, tickTotal) => {
            if (value % 3 === 0) {
              return Math.trunc(value);
            } return "";
          }}
        />
        <YAxis
          tickFormat={(value, index, scale, tickTotal) => {
            if (graphData.max < 5) {
              if (value % 1 === 0) {
                return Math.trunc(value);
              } else return "";
            }
            if (value % 5 === 0) {
              return Math.trunc(value);
            } else return "";
          }}
          tickValues={getRange(0, graphData.max)}
          hideLine tickSize={0}
        />

        <AreaSeries fill={'url(#CoolGradient)'} stroke={'#0000'} data={graphData.graph} curve={'curveBasis'} onNearestX={hovered} />
        {/* {console.log(personen.slice(0, 8).map((value, idx) => {return ([{x: parseInt(value.Geburtsdatum.substring(0,4)), y:idx}, {x: parseInt(value.Todesdatum.substring(0,4)), y:idx}])}))}
        <LineMarkSeries
        curve={'curveMonotoneX'}
        data={
          personen.slice(0, 8).map((value, idx) => {return ([{x: parseInt(value.Geburtsdatum.substring(0,4)), y:idx}, {x: parseInt(value.Todesdatum.substring(0,4)), y:idx}])})
          }
      /> */}

      </FlexibleWidthXYPlot>
      <FlexibleWidthXYPlot
        height={(height - 200) * 0.3}
        yDomain={[minimum(), 0]}
        xDomain={range()}
        animation={true}

      >
        <HorizontalRectSeries data={[{ x0: { start }, x: { end }, y0: -0.5, y: minimum() }]} fill={'#ffffff'} stroke={'#ffffff'} />

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
          data={kaiserData.map((k) => {
            return (
              { x: (k.x + k.x0) / 2, y: (k.y + k.y0) / 2 - 1, label: k.name }
            )
          })}
          style={{ fill: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          labelAnchorX="middle" labelAnchorY="middle" onValueClick={(d, event) => {
            kaiserClicked(kaiser.find((i) => i.NAME === d.label).ID);
          }}

        />

      </FlexibleWidthXYPlot>
    </div>

  );
}

export default App;
