import React, { useState, useEffect, useMemo, } from 'react';
import useDimensions from "react-use-dimensions";
import { Typography, AppBar, Toolbar, InputLabel, FormControl, Select, MenuItem, Grid, Box, Container, Link, IconButton, Popover } from '@material-ui/core';
import { XAxis, AreaSeries, YAxis, HorizontalRectSeries, GradientDefs, FlexibleWidthXYPlot, Crosshair, LabelSeries, HorizontalGridLines, LineSeries,  DiscreteColorLegend } from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';
import '../node_modules/react-vis/dist/style.css';
import useWindowSize from 'react-use/lib/useWindowSize';
import HelpIcon from '@material-ui/icons/Help';

import { kaiser, initialKaiser, getPositionOfKaisersInRange, getMaxColumnInRange } from './data/kaiser';
import { queries as queryDefinitions } from './data/queryDefinitions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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
  const [blue, red] = ['#2699FB', '#B80F0A'];

  const { height, width } = useWindowSize();
  const [header, headerSize] = useDimensions();
  const [toolbar, toolbarSize] = useDimensions();
  const [title, titleSize] = useDimensions();

  const [popupAnchorEl, setPopupAnchorEl] = useState(null);

  const [crossHairValues, setCrossHairValues] = useState(null);
  const [selectedKaiserID, setSelectedKaiserID] = useState(initialKaiser);

  const [paramOne, setParamOne] = useState(null);
  const [paramTwo, setParamTwo] = useState(null);
  const [paramCompare, setParamCompare] = useState('');
  const [comparingKaiser, setComparingKaiser] = useState(false);

  const queries = queryDefinitions(setParamOne, setParamTwo, setSelectedKaiserID);
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);

  useEffect(() => {

    queries[selectedQueryIndex].params.forEach(({ setter, initialValue }) => {
      setter(initialValue);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!paramOne || !paramTwo) {
    setParamOne(queries[selectedQueryIndex].params[0].initialValue);
    setParamTwo(queries[selectedQueryIndex].params[1].initialValue);
  }

  const graphData = useMemo(
    () => {
      if (!paramOne || !paramTwo) {
        return null;
      }
      try {
        return queries[selectedQueryIndex].data(paramOne, paramTwo);
      } catch (error) {
        console.log(error);
        return {graph: [], persons: {}, max: 5}
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramOne, paramTwo, selectedQueryIndex]
  )
  const graphCompareData = useMemo(
    () => {
      if (!paramOne || paramCompare === '') {
        return null
      }
      try {
        return queries[selectedQueryIndex].data(paramOne, paramCompare);
      } catch (error) {
        return {graph: [], persons: {}, max: 5}
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramOne, paramCompare, selectedQueryIndex]
  )

  const getRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  const range = () => {
    const selectedKaiser = kaiser.find(kaiser => {
      return kaiser.ID === selectedKaiserID;
    })

    let min = parseInt(selectedKaiser.start.substring(0, 4));
    let max = parseInt(selectedKaiser.end.substring(0, 4));

    if (comparingKaiser) {
      let otherMin = parseInt(paramCompare.start.substring(0,4));
      let otherMax = parseInt(paramCompare.end.substring(0,4));
      
      min = min < otherMin ? min : otherMin
      max = max < otherMax ? otherMax : max
    }

    let lowerBound = false, upperBound = false;

    if (min <= start + 5) {
      lowerBound = true;
    }

    if (max >= end - 5) {
      upperBound = true;
    }

    min = min - 5;
    max = max + 5;

    return [
      lowerBound ? start : min,
      upperBound ? end : max
    ]
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

  const maximum = () => {
    let maximum;
    if (paramCompare !== '') {
      maximum = graphData.max < graphCompareData.max 
      ? graphCompareData.max 
      : graphData.max
    } else maximum = graphData.max;
    return maximum <= 5 ? 5 : maximum;
  }

  const minimum = () => {
    const [min, max] = range();
    return -1 * getMaxColumnInRange(min, max) - 1;
  }

  const hovered = (value, { index }) => {

    let val = {};
    val["x"] = value.x;
    const graphDataIndex = value.x - graphData.graph[0].x;
    
    if (graphDataIndex <  graphData.graph.length && graphDataIndex >= 0) {
      val["val"] = Math.trunc(graphData.graph[graphDataIndex].y);
      if(graphData.total) {
        val["total"] = graphData.total[graphDataIndex].y;
      }
    }

    if(graphCompareData !== null) {
      const graphCompareDataIndex = value.x - graphCompareData.graph[0].x;
      
      if (graphCompareDataIndex < graphCompareData.graph.length && graphCompareDataIndex >= 0) {
        val['valCompare'] = Math.trunc(graphCompareData.graph[graphCompareDataIndex].y);
        if(graphCompareData.total) {
          val['totalCompare'] = graphCompareData.total[graphCompareDataIndex].y;
        }
      }
    }

    setCrossHairValues([val]);

    // let valueRounded = { x: value.x, y: Math.round(value.y) }
    // setCrossHairValues([valueRounded])
  }

  const kaiserClicked = (id) => {
    if (!queries[selectedQueryIndex].hasHofstaat){
      setComparingKaiser(false);
      setParamCompare("");
      setSelectedKaiserID(id);
    }
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

  const makeCompareTitle = () => {
    if(paramCompare !== '') {
      const compParamField = queries[selectedQueryIndex].params[1].field;
      const text = compParamField ? paramCompare[compParamField] : paramCompare;
      return `, verglichen mit ${text}`
    }
  }

  const handleHelpClicked = event => {
    setPopupAnchorEl(event.currentTarget);
    if (open) {
      helpClosed();
    }
  }

  const helpClosed = () => {
    setPopupAnchorEl(null);
  }

  const open = Boolean(popupAnchorEl);
  const popupId = open ? 'help-popover' : undefined;

  const guiHeight = () => {
    let guiHeight;
    if (height && titleSize.height && headerSize.height && toolbarSize.height) {
      guiHeight = height - (titleSize.height + headerSize.height + toolbarSize.height);
    } else {
      guiHeight = height - 210;
    }
    console.log(guiHeight);
    
    // if (graphData.additional && paramCompare === '') {
    //   guiHeight + 
    // }
    return guiHeight;
  }

  if (!paramOne || !paramTwo) {
    return null;
  }

  return (
    <div className={classes.root}>
      <AppBar ref={header} position="static" style={{ color: '#ffffff' }}>
        <Toolbar>
          <Typography variant="h4" className={classes.title} style={{ fontFamily: 'futura-pt, sans-serif', fontWeight: 700, fontStyle: 'italic' }} >
            {width < 1000
            ? <React.Fragment>PROJECT TIMELINE</React.Fragment>
            : <React.Fragment>PROJECT TIMELINE: Ein <Link style={{color: '#fffa'}} rel='external' href="http://kaiserhof.geschichte.lmu.de/">Kaiser und Höfe</Link> Visualisierungs-Projekt</React.Fragment>}
            
        </Typography>
        </Toolbar>
      </AppBar>
      <Container ref={toolbar} maxWidth={false}>
        <Grid container spacing={3} alignItems="center" >
          <Grid item xs>
            <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
              <InputLabel>
                Kategorie
            </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                value={selectedQueryIndex}
                id="demo-simple-select-outlined"
                onChange={(event) => {
                  setSelectedQueryIndex(event.target.value);
                  setComparingKaiser(false);
                  setParamCompare("");
                  // setParamOne(queries[event.target.value].params[0].initialValue);
                  // setParamTwo(queries[event.target.value].params[1].initialValue);
                  queries[event.target.value].params[0].setter(queries[event.target.value].params[0].initialValue);
                  queries[event.target.value].params[1].setter(queries[event.target.value].params[1].initialValue);
                }}
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
                    onChange={(event) => {
                      setParamCompare('');
                      setComparingKaiser(false);
                      param.setter(event.target.value)
                    }}
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
          {queries[selectedQueryIndex].compare
          ? (
            <Grid item xs>
              <FormControl fullWidth color="primary" variant="standard" className={classes.formControl}>
                <InputLabel id={`params-compare-input-label`}>
                  Verglichen mit
                </InputLabel>
                <Select
                  labelId={`params-compare-input-label`}
                  value={paramCompare}
                  onChange={(event) => {
                    if(event.target.value === '') {
                      setComparingKaiser(false);
                      setParamCompare('');
                      return;
                    }
                    if(queries[selectedQueryIndex].params[1].name === 'Hofstaat') {
                      setComparingKaiser(true);
                    }
                    setParamCompare(event.target.value)
                  }}
                >
                  {[""].concat(queries[selectedQueryIndex].params[1].listOfItems).filter(i => i !== paramTwo).map((item)=> {
                    if (queries[selectedQueryIndex].params[1].field) {
                      return (
                        <MenuItem key={item[queries[selectedQueryIndex].params[1].field]} value={item}>
                          {item === '' ? 'kein Vergleich' : item[queries[selectedQueryIndex].params[1].field]}
                        </MenuItem>
                      )
                    }
                    return (
                        <MenuItem key={item} value={item} >
                          {item === '' ? 'kein Vergleich' : item}
                        </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          )
          : null
          }
          <Grid item xs>

          </Grid>
        </Grid>
      </Container>
      <Box ref={title} fontSize="2.5rem" style={{ fontFamily: 'futura-pt, sans-serif', fontWeight: 700, fontStyle: 'italic', textAlign: 'center', }}>
        <span style={{color: blue }}>{makeTitle()}</span><span style={{color: red}}>{makeCompareTitle()}
          <IconButton onClick={handleHelpClicked}><HelpIcon color='primary' /><Popover disableBackdropClick={false} id={popupId} open={open} anchorEl={popupAnchorEl} onClose={helpClosed} anchorOrigin={{vertical: 'center', horizontal: 'center'}} transformOrigin={{vertical: 'top', horizontal:'center'}}><Box p={2} style={{maxWidth: "30vw"}}><Typography>{queries[selectedQueryIndex].descriptor(paramOne, paramTwo)}</Typography></Box></Popover></IconButton> 
        </span>
      </Box>


      <FlexibleWidthXYPlot
        height={guiHeight() * 0.7 + (guiHeight() * 0.25 * (4 + minimum()) * 0.25)}
        yDomain={[0, maximum()]}
        xDomain={range()}
        margin={{left: 40, right: 10, top: graphData.additional ? 72 : 10, bottom: 20}}
        animation={true}
        onMouseLeave={() => setCrossHairValues(null)}
      >

        <GradientDefs>
          <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={blue} stopOpacity={0.8} />
            <stop offset="100%" stopColor={blue} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={red} stopOpacity={0.8} />
            <stop offset="100%" stopColor={red} stopOpacity={0.2} />
          </linearGradient>
        </GradientDefs>


        {crossHairValues !== null
          ? <Crosshair style={{ line: { background: '#000', width: '2px' } }} values={crossHairValues} >
            <div style={{display: 'inline-block'}}>
            <div style={{ textAlign: 'center', background: '#000', borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '7px 10px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '4px' }}>
              <p style={{margin: 0, whiteSpace: 'nowrap'}}>{crossHairValues[0].x}</p>
            </div>
            { crossHairValues[0]['val']
            ? <div style={{ textAlign: 'center', background: blue, borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '7px 10px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '4px' }}>
              <p style={{ margin: 0, whiteSpace: 'nowrap' }}>{crossHairValues[0].val}{crossHairValues[0].total ? ` von ${crossHairValues[0].total}` : null}</p>
            </div>
            : null}
            { crossHairValues[0]['valCompare']
            ? <div style={{ textAlign: 'center', background: red, borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '7px 10px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '4px' }}>
              <p style={{ margin: 0, whiteSpace: 'nowrap' }}>{crossHairValues[0].valCompare}{crossHairValues[0].totalCompare ? ` von ${crossHairValues[0].totalCompare}` : null}</p>
            </div>
            : null
            }
            </div>
          </Crosshair>
          : null
        }


        <XAxis
          on0
          style={{
            text: { stroke: 'none', fill: '000', fontWeight: 'bold' }
          }}
          hideLine tickSize={0}
          tickFormat={(value, index, scale, tickTotal) => {
            /* if (value % 3 === 0) {
              return Math.trunc(value);
            } */ return Math.trunc(value);
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
          hideLine tickSize={0}
        />

        <HorizontalGridLines style={maximum() > 5 ? {strokeOpacity: 1} : {strokeOpacity: 0}} />


        {graphCompareData !== null && graphCompareData.total
        ? <AreaSeries fill={'#fff0'} stroke={red} data={graphCompareData.total} curve={'curveBasis'} animation={null} />
        : null
        }

        {graphCompareData !== null
        ? <AreaSeries fill={'url(#redGradient)'} stroke={'#0000'} data={graphCompareData.graph.map(e => {return{x: e.x, y: e.y}})} curve={'curveBasis'} /*animation = {graphCompareData.total ? null : true}*/ />
        : null }

        {graphData.total
        ? <AreaSeries fill={'#fff0'} stroke={blue} data={graphData.total} curve={'curveBasis'} animation={null} />
        : null
        }

        <AreaSeries fill={'url(#blueGradient)'} stroke={'#0000'} data={graphData.graph.map(e => {return({x: e.x,y: e.y})})} curve={'curveBasis'} /*animation={graphData.total ? null : true} */ />

        {graphData.additional && paramCompare === ''
        ? graphData.additional.map((_, idx) => [
          <LineSeries strokeWidth={'4px'} stroke={blue} data={graphData.graph.map(e => {return({x: e.x, y: e['y' + idx]})})} strokeDasharray={(idx + 1) * 2} curve={'curveBasis'} />,
        ])
        : null}

        {graphData.additional && paramCompare === ''
        ? <DiscreteColorLegend style={{display: 'inline-block', position: 'absolute', left: '50%', top: '0px', transform: 'translate(-50%, 0)'}} orientation='horizontal' items={graphData.additional.map((d, idx) => {return({title: d, color: blue, strokeWidth: '4px', strokeDasharray: ((idx + 1) * 2).toString()})})} />
        : null}

        <HorizontalRectSeries data={getRange(range()[0], range()[1]).map(i => {return({x: i, x0: i, y: 0, y0: maximum()})})} stroke='#0000' fill='#0000' onNearestX={hovered} />

        {/* {
          graphData.persons[1550].map((person, idx) => <LineMarkSeries key={person.ID} data={
            [{x: parseInt(person.Geburtsdatum.substring(0,4)), y: idx}, {x: parseInt(person.Todesdatum.substring(0,4)), y: idx}]} />)
        } */}


      </FlexibleWidthXYPlot>
      <FlexibleWidthXYPlot
        height={guiHeight() * 0.25 * -1 * minimum() * 0.25}
        yDomain={[minimum(), 0]}
        xDomain={range()}
        margin={{left: 40, right: 10, top: 0, bottom: 10}}
        animation={true}
      >
        {kaiserData.map((value) => {
          if (value.id === selectedKaiserID) {
            return (
              <HorizontalRectSeries key={value.id} data={[value]} fill={blue} stroke={blue} onSeriesClick={() => kaiserClicked(value.id)} />
            )
          } else if (comparingKaiser && value.id === paramCompare.ID) {
            return (<HorizontalRectSeries key={value.id} data={[value]} fill={red} stroke={red} onSeriesClick={() => kaiserClicked(value.id)} />)
          }
          return (
            <HorizontalRectSeries key={value.id} data={[value]} fill={'#2699FB44'} stroke={blue} onSeriesClick={() => kaiserClicked(value.id)} />
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
