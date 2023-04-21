import React from 'react';
import jStat from 'jstat';
import { TextField, InputAdornment, Box, FormControl, Typography, Slider, Button, Accordion, AccordionDetails, Grid, AccordionSummary } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import './binomial-pretest-calc.css';
import eq1 from "./BiPretestEq1.png";
import eq1Alt from "./BiPretestEq1Alt.png";

export default class BiPretest extends React.Component{
    constructor(props){
      super(props);
      this.processField6Change = this.processField6Change.bind(this);
      this.processField7Change = this.processField7Change.bind(this);
      this.state = {hidden: false, desiredLift: 42.86, displayedDesiredLift: 42.86, convRateControl: 3.5, displayedConvRateControl: 3.5, convRateVariant: 5, displayedConvRateVariant: 5, 
        trafficControl: 50, displayedTrafficControl: 50, trafficVariant: 50, displayedTrafficVariant: 50, trafficRatio: 1, displayedTrafficRatio: 1, confLevel: 90, 
        statPower: 80, displayedStatePower: 80, dailyVisitors: 600, sampleVariant: 2234, sampleControl: 2234, sampleTotal: 4468, days: 8, weeks: 2}
    }
    //Handles Showing/Hiding detailed information
    changeDetail(){
      if(this.state.hidden === true){this.setState({hidden: false});}
      else{this.setState({hidden: true})}
    }
    //Handles changes made to the "Desired Lift" Text Field
    processField1Change(inputElement){
      var newVal = inputElement.target.value;
      this.setState({desiredLift: newVal, displayedDesiredLift: newVal});
      this.calculateConvRate(newVal, 1);
    }
    //Displays the full value upon selection of the TextField
    updateField1DisplayA(){
        this.setState({displayedDesiredLift: this.state.desiredLift});
    }
    //Displays the rounded value upon selecting off the TextField
    updateField1DisplayB(){
      var lift = this.state.desiredLift;
      if(lift <= 0){lift = 1;}
      var temp = Math.round(lift*100)/100;
      this.setState({displayedDesiredLift: temp, desiredLift: lift});
      this.calculateConvRate(lift, 1);
    }
    //Handles changes made to the "Baseline Conversion Rate, Control Group" Text Field
    processField2Change(inputElement){
      var newVal = inputElement.target.value;
      this.setState({convRateControl: newVal, displayedConvRateControl: newVal});
      this.calculateConvRate(newVal, 2);
    }
    //Displays the full value upon selection of the TextField
    updateField2DisplayA(){
      this.setState({displayedConvRateControl: this.state.convRateControl});
    }
    //Displays the rounded value upon selecting off the TextField
    updateField2DisplayB(){
      var convRate = this.state.convRateControl;
      if(convRate < 0){convRate = 0;}
      var temp = Math.round(convRate*100)/100;
      this.setState({displayedConvRateControl: temp, convRateControl: convRate});
      this.calculateConvRate(convRate, 2);
    }
    //Calculates the Conversion Rate for the Variant Group, using the formula (Desired Lift)*(1 + Baseline Conversion Rate, Control Group)
    calculateConvRate(val, field) {
      var newVal = 0;
      var convTemp = 0;
      if(this.state.desiredLift !== 0 && field === 2){ 
        newVal = (1+(this.state.desiredLift/100))*val;
        convTemp = val;
      }
      else if(this.state.convRateControl !== 0 && field === 1){ 
        newVal = (1+(val/100))*this.state.convRateControl;
        convTemp = this.state.convRateControl;
      }
      this.setState({convRateVariant: newVal, displayedConvRateVariant: Math.round(newVal*100)/100})
      this.calculateSampleSizes(convTemp, newVal, 2); 
    }
    //Handles changes made to the "Percentage Traffic Control Group" Text Field
    processField3Change(inputElement){
      var newCont = inputElement.target.value;
      if(newCont<0) newCont = 0;
      if(newCont>100) newCont = 100;
      var newVar = 100*(1 - (.01*newCont));
      this.setState({trafficControl: newCont, displayedTrafficControl: newCont, trafficVariant: newVar, displayedTrafficVariant: newVar, 
      trafficRatio: newCont/newVar, displayedTrafficRatio: Math.round(newCont*100/newVar)/100});
      this.calculateSampleSizes(newCont/newVar, 0, 3);
    }
    //Handles changes made to the "Percentage Traffic Variant Group" Text Field
    processField4Change(inputElement){
      var newVar = inputElement.target.value;
      if(newVar<0) newVar = 0;
      if(newVar>100) newVar = 100;
      var newCont = 100*(1 - (.01*newVar));
      this.setState({trafficVariant: newVar, trafficControl: newCont, displayedTrafficVariant: newVar, displayedTrafficControl: newCont, 
        trafficRatio: newCont/newVar, displayedTrafficRaiot: Math.round(newCont*100/newVar)/100});
        this.calculateSampleSizes(newCont,newVar, 0, 3);
    }
    //Displays the full values upon selection of either TextField
    updateFields3And4DisplayA(){
      this.setState({displayedTrafficControl: this.state.trafficControl, displayedTrafficVariant: this.state.trafficVariant});
    }
    //Displays the rounded values upon selection off either TextField
    updateFields3And4DisplayB(){
      var tempCont = Math.round(this.state.trafficControl*100)/100;
      var tempVar = Math.round(this.state.trafficVariant*100)/100;
      this.setState({displayedTrafficControl: tempCont, displayedTrafficVariant: tempVar});
    }
    //Handles changes made to the "Confidence Level" TextField
    processField5Change(inputElement){
        var newVal = inputElement.target.value;
        this.setState({confLevel: newVal, displayedConfLevel: newVal});
        this.calculateSampleSizes(newVal, 0, 5);
    }
    //Handles changes made to the "Statistical Power" TextField
    processField6Change(inputElement){
        var newVal = inputElement.target.value;
        this.setState({statPower: newVal});
        this.calculateSampleSizes(newVal, 0, 6);
    }
    //Displays the full value upon selection of the TextField
    updateField6DisplayA(){
      this.setState({displayedStatPower: this.state.statPower});
    }
    //Displays the rounded value upon selection off the TextField
    updateField6DisplayB(){
      var newVal = this.state.statPower;
      if(newVal > 99.9){newVal = 99.9;}
      if(newVal <= 0){newVal = 1;}
      var newDisp = Math.round(newVal*100)/100;
      this.setState({statPower: newVal, displayedStatPower: newDisp});
      this.calculateSampleSizes(newVal, 0, 6);
    }
    //Handles changes made to the "Daily Visitors" TextField
    processField7Change(inputElement){
        var newVal = inputElement.target.value;
        if(newVal<0) newVal = 0;
        this.setState({dailyVisitors: newVal});
        this.calculateRuntime(newVal, 2);
    }
    //Rounds the value to the next whole number upon selection off the TextField
    updateField7Value(){
      var newVal = Math.ceil(this.state.dailyVisitors);
      this.setState({dailyVisitors: newVal});
      this.calculateRuntime(newVal, 2);
    }
    //Calculates the sample sizes needed 
    calculateSampleSizes(val, val2, field){
      var conf = this.state.confLevel/100, stat = this.state.statPower/100, crCont = this.state.convRateControl/100, crVar = this.state.convRateVariant/100, 
      traf = this.state.trafficRatio;
      if(field===1){crCont = val/100;}
      else if(field===2){crCont = val/100; crVar = val2/100;}
      else if(field===3){traf = val;}
      else if(field===5){conf = val/100;}
      else if(field===6){stat = val/100;}
      var temp1 = ((crCont*(1-crCont))/traf)+(crVar*(1-crVar));
      var temp2 = ((jStat.normal.inv(1-((1-(conf))/2), 0, 1)+(jStat.normal.inv(stat,0,1)))/(crCont-crVar));
      var trafficV = Math.ceil(temp1*temp2*temp2);
      var trafficC = Math.ceil(this.state.trafficRatio*trafficV);
      var trafficT = trafficV + trafficC;
      this.setState({sampleVariant: trafficV, sampleControl: trafficC, sampleTotal: trafficT});
      this.calculateRuntime(trafficT, 1);
    }
    //Calculates the runtime in days and weeks needed using the equation (Total Sample Size)/(Daily Visitors), rounded up to the nearest integer
    calculateRuntime(val, field){ 
      if(field===1){this.setState({days: Math.ceil(val/this.state.dailyVisitors), weeks: Math.ceil((val/7)/this.state.dailyVisitors)});}
      if(field===2){this.setState({days: Math.ceil(this.state.sampleTotal/val), weeks: Math.ceil(this.state.sampleTotal/7/val)});}
    }
    //inputValid function from continuous-posttest-calc.js
    inputValid(event, regex) {
      if (!regex.test(event.key)) {
          event.preventDefault();
      }
  }

    render(){
      return(
        <div>
        <div class="Button">
          <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="changeDetail" variant="contained" onClick={this.changeDetail.bind(this)}>Toggle Tooltips</Button>
        </div>
          <div class="BodyContainers">
            <Box class="InputBox">
              <div class="BoxLabel">Inputs</div>
                <Tooltip title={this.state.hidden === false ? <h2>The desired percent increase in metric for users receiving the variant versus the control group</h2> : ""} placement="right" arrow>
                  <TextField label="Desired Lift" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} id="desiredLiftIn" type="number" InputProps={{ inputProps: { max: 100, min: 10 }, endAdornment: <InputAdornment position="end">%</InputAdornment>}} onChange={this.processField1Change.bind(this)} 
                  onFocus={this.updateField1DisplayA.bind(this)} onBlur={this.updateField1DisplayB.bind(this)} onKeyPress={(e) => {this.inputValid(e, /[0-9, .]/)}} value={this.state.displayedDesiredLift}/>
                </Tooltip>
                <Tooltip title={this.state.hidden === false ? <h2>The current conversion rate of successful actions taken divided by the number of visitors to the page</h2> : ""} placement="right" arrow> 
                  <TextField label="Baseline Conversion Rate, Control Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} id="convRateControl" type="number" onChange={this.processField2Change.bind(this)} 
                  onFocus={this.updateField2DisplayA.bind(this)} onBlur={this.updateField2DisplayB.bind(this)} onKeyPress={(e) => {this.inputValid(e, /[0-9, .]/)}} value={this.state.displayedConvRateControl}/>
                </Tooltip>
                <Tooltip title={this.state.hidden === false ? <h2>The percentage of the total sample size that will use the control rather than the variant</h2> : ""} placement="right" arrow>
                  <TextField label="Percentage of traffic in Control Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} id="trafficControl" InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}} type="number" 
                  onChange={this.processField3Change.bind(this)} onFocus={this.updateFields3And4DisplayA.bind(this)}
                  onBlur={this.updateFields3And4DisplayB.bind(this)} onKeyPress={(e) => {this.inputValid(e, /[0-9, .]/)}} value={this.state.displayedTrafficControl}/> 
                </Tooltip>
                <Tooltip title={this.state.hidden === false ? <h2>The percentage of the total sample size that will use the variant rather than the control</h2> : ""} placement="right" arrow>
                  <TextField label="Percentage of traffic in Variant Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} id="trafficVariant" InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}} type="number" 
                  onChange={this.processField4Change.bind(this)} onFocus={this.updateFields3And4DisplayA.bind(this)}
                  onBlur={this.updateFields3And4DisplayB.bind(this)} onKeyPress={(e) => {this.inputValid(e, /[0-9, .]/)}} value={this.state.displayedTrafficVariant}/> 
                </Tooltip>
                <Typography>Confidence Level</Typography>
                <Tooltip title={this.state.hidden === false ? <h2>Suggested value range is 80% - 95%</h2> : ""} placement="right" arrow>
                  <Slider name="confiLevel" aria-label="Confidence Level" value={this.state.confLevel} valueLabelDisplay="auto" label='Confidence Level'
                    step={1} marks min={80} max={99} onChange={this.processField5Change.bind(this)}/>
                </Tooltip>
                  <Typography>Statistical Power</Typography>
                  <Tooltip title={this.state.hidden === false ? <h2>Statistical Power is typically 80%</h2> : ""} placement="right" arrow>
                    <Slider name="statsPower" aria-label="Statistical Power" value={this.state.statPower} valueLabelDisplay="auto" label='Confidence Level'
                      step={1} marks min={80} max={99} onChange={this.processField6Change.bind(this)}/>
                  </Tooltip>
                  <Tooltip title={this.state.hidden === false ? <h2>The positive number of daily visitors participating in either the control or the variant group</h2> : ""} placement="right" arrow>
                <TextField label="Total Number of Daily Visitors (both groups)" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} id="dailyVisit" type="number" onChange={this.processField7Change} onBlur={this.updateField7Value.bind(this)}
                  onKeyPress={(e) => {this.inputValid(e, /[0-9, .]/)}} value={this.state.dailyVisitors}/>                
                  </Tooltip>
            </Box>
            <Box class="OutputBox">
              <div class="BoxLabel">Outputs</div>
              <Tooltip title={this.state.hidden === false ? <h2>The conversion rate for the variant group required to meet the desired lift of the baseline conversion rate</h2> : ""} placement="left" arrow>
                <TextField label="Conversion Rate, Variant Group" variant="filled" sx={{ m: 1}} InputProps={{color: "black",endAdornment: <InputAdornment position="end">%</InputAdornment>,readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="convRateVariant" type="number" value={this.state.displayedConvRateVariant}/>
              </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The % of traffic in the control group divided by the % of traffic in the variant group</h2> : ""} placement="left" arrow>
                <TextField label="Ratio of the two group traffic sizes" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="trafficSizeRatio" type="number" value={this.state.displayedTrafficRatio}/>
              </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The sample size required for the variant group, rounded up</h2> : ""} placement="left" arrow>
                <TextField label="Sample Size, Variant" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="sampleVariant" type="number" value={this.state.sampleVariant}/>
              </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The sample size required for the control group, rounded up</h2> : ""} placement="left" arrow>
                <TextField label="Sample Size, Control" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="sampleControl" type="number" value={this.state.sampleControl}/>
              </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The variant sample size plus the control sample size</h2> : ""} placement="left" arrow>
                <TextField label="Total Sample Size" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="sampleTotal" type="number" value={this.state.sampleTotal}/>
                </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The number of days the test will take to run, rounded up</h2> : ""} placement="left" arrow>
                <TextField label="Days to run the test" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="days" type="number" value={this.state.days}/>
              </Tooltip>
              <Tooltip title={this.state.hidden === false ? <h2>The number of weeks the test will take to run, rounded up</h2> : ""} placement="left" arrow>
                <TextField label="Weeks to run the test" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
                  InputLabelProps={{ shrink: true }} id="weeks" type="number" value={this.state.weeks}/>
              </Tooltip>
            </Box> 
          </div>
          <Accordion sx={{ marginTop: "2ch" }}>
                <AccordionSummary
                    expandIcon={"▼"}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>Testing Formulas</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: "flex", padding: "0ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                    <Box className="col" width="3 0%" sx={{ margin: '1ch 5ch 1ch 2ch', paddingRight: '0ch' }}>
                        <Typography align="center" fontWeight="bold">Kappa</Typography>
                        <table align="center">
                          <td><tr></tr><tr>κ = </tr></td>
                          <td>
                            <tr>𝑛<sub>𝑐</sub></tr>
                            <tr><hr></hr></tr>
                           <tr>𝑛<sub>𝑣</sub></tr>
                          </td>
                          <td><tr></tr><tr> or κ𝑛<sub>𝑣</sub> = 𝑛<sub>𝑐</sub></tr></td>
                        </table>
                        <Typography align="center">(For example, if the control group is 3 times larger than the variant group, then kappa = 3)</Typography>
                    </Box>
                    <Box className='col' width='35%' sx={{ margin: '1ch 5ch 1ch 2ch', padding: '0ch' }}>
                      <Typography align='center' fontWeight='bold'>Sample Size Determination</Typography>
                      <Typography align="center">Given, the CVR for the control, 𝑝<sub>𝑐</sub>, the ratio of sample sizes in each group, kappa (κ), and lift, 
                        the sample sizes for each group, 𝑛<sub>𝑣</sub> and 𝑛<sub>𝑐</sub>, can be determined by the following formulas:</Typography>
                      <p></p>
                      <Typography align="center" fontStyle="italic" fontWeight="bold">Sample Size Control</Typography>
                      <p align="center">𝑛<sub>𝑐</sub> = κ𝑛<sub>𝑣</sub></p>
                    </Box>
                    <Box className='col' width='35%' sx={{ margin: '1ch 5ch 1ch 2ch', padding: '0ch' }}>
                      <p></p>
                      <Typography align="center" fontStyle="italic" fontWeight="bold">Sample Size Variant</Typography>
                      <img src={eq1} width="400wv" align="center"/>
                      <p></p>
                      <Typography align="center">Note: Typically, the power, (1 - 𝛽),  is .8 and significance level, ⍺, is 0.05 (or CI=95%). So, (Eq. 1) can be simplified to: </Typography>
                      <img src={eq1Alt} width="400wv" align="center"/>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
      )
    }
  }