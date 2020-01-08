import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import {XYPlot, XAxis, LineSeries} from 'react-vis';


function App() {

  // TODO add data 😭
  const data = {};

  return (
    <React.Fragment>
    <AppBar position="static">
      <Typography variant="h6">
        Project: Timeline
      </Typography>
    </AppBar>
    <Typography variant="h1">
      {'Title of Diagram'}
    </Typography>
    <XYPlot
      width={'95vw'}
      height={'80vh'}>

      <XAxis title="Jahr" />

      <LineSeries data={data} curve={'curveCardinal'} />

    </XYPlot>
    </React.Fragment>
    
  );
}

export default App;
