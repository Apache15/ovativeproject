import React from 'react';
import jStat from 'jstat';
import { TextField, Input, InputAdornment } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import './binomial-pretest-calc.css';

//This push of the page does not contain any finalized styling, and I am aware the table containing formulas looks atrocious.  Future updates will cleanup display after the real formulas that will be displayed are included
export default class BiPretest extends React.Component{
    constructor(props){
      super(props);
      this.processField6Change = this.processField6Change.bind(this);
      this.processField7Change = this.processField7Change.bind(this);
      this.state = {hidden: true, desiredLift: 42.86, displayedDesiredLift: 42.86, convRateControl: 3.5, displayedConvRateControl: 3.5, convRateVariant: 5, displayedConvRateVariant: 5, 
        trafficControl: 50, displayedTrafficControl: 50, trafficVariant: 50, displayedTrafficVariant: 50, trafficRatio: 1, displayedTrafficRatio: 1, confLevel: 90, 
        displayedConfLevel: 90, statPower: 80, displayedStatePower: 80, dailyVisitors: 600, sampleVariant: 2234, sampleControl: 2234, sampleTotal: 4468, days: 8, weeks: 2}
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
      var newVal = inputElement.target.value;
      if(newVal<0) newVal = 0;
      if(newVal>100) newVal = 100;
      this.setState({trafficVariant: newVal, trafficControl: 100*(1 - (.01*newVal)), trafficRatio: (100*(1 - (.01*newVal)))/newVal});
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
    //Displays the full value upon selection of the TextField
    updateField5DisplayA(){
      this.setState({displayedConfLevel: this.state.confLevel});
    }
    //Displays the rounded value upon selection off the TextField
    updateField5DisplayB(){
      var newVal = this.state.confLevel;
      if(newVal > 99.9){newVal = 99.9;}
      if(newVal < 80){newVal = 80;}
      var newDisp = Math.round(newVal*100)/100;
      this.setState({confLevel: newVal, displayedConfLevel: newDisp});
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
    //Checks to confirm an input is a valid integer between 0-100
    verifyInputPercentage(inputElement){ 
        var retValue = 0;
        try{
            retValue = parseInt(inputElement.target.value);
        }
        catch(Exception){
            retValue = -1;
        }
        if(retValue < 0) retValue = 0;
        if(retValue > 100) retValue = 100;
        return retValue;
    }
    render(){
      return(
        <div>
          <div class="Button">
            <button id="changeDetail" onClick={this.changeDetail.bind(this)}>Show Detail</button>
          </div>
          <div class="Inputs">
            <h1>Inputs</h1>
            <div>
              <label htmlFor="desiredLiftIn">
                Desired Lift
              </label>
              <TextField id="desiredLiftIn" sx={{input:{color:"white"}}} type="decimal" InputProps={{ inputProps: { max: 100, min: 10 }}} onChange={this.processField1Change.bind(this)} 
              onFocus={this.updateField1DisplayA.bind(this)} onBlur={this.updateField1DisplayB.bind(this)} value={this.state.displayedDesiredLift}/>
            </div>
            <div>
              <label htmlFor="convRateControl">
                Baseline Conversion Rate, Control Group
              </label>
              <TextField id="convRateControl" sx={{input:{color:"white"}}} type="number" onChange={this.processField2Change.bind(this)} 
              onFocus={this.updateField2DisplayA.bind(this)} onBlur={this.updateField2DisplayB.bind(this)} value={this.state.displayedConvRateControl}/>
            </div>
            <div>
              <label htmlFor="trafficControl">
                Percentage of traffic in Control Group 		
              </label>
              <Input id="trafficControl" endAdornment={<InputAdornment position="end">%</InputAdornment>} sx={{input:{color:"white"}}} type="number" 
              onChange={this.processField3Change.bind(this)} onFocus={this.updateFields3And4DisplayA.bind(this)}
              onBlur={this.updateFields3And4DisplayB.bind(this)} value={this.state.displayedTrafficControl}/> 
            </div>
            <div>
              <label htmlFor="trafficVariant">
                Percentage of traffic in Variant Group 		
              </label>
              <Input id="trafficVariant" endAdornment={<InputAdornment position="end">%</InputAdornment>} sx={{input:{color:"white"}}} type="number" 
              onChange={this.processField4Change.bind(this)} onFocus={this.updateFields3And4DisplayA.bind(this)}
              onBlur={this.updateFields3And4DisplayB.bind(this)} value={this.state.displayedTrafficVariant}/> 
            </div>
            <div>
              <label htmlFor="confiLevel">
                Confidence Level 		
              </label>
              <Tooltip title="Please enter a confidence level between 80 - 99.9%">
                <Input id="confiLevel" endAdornment={<InputAdornment position="end">%</InputAdornment>} sx={{input:{color:"white"}}} type="number" 
                onChange={this.processField5Change.bind(this)} onFocus={this.updateField5DisplayA.bind(this)} onBlur={this.updateField5DisplayB.bind(this)} 
                value={this.state.displayedConfLevel}/>
              </Tooltip>
            </div>
            <div>
              <label htmlFor="statsPower">
                Statistical Power 			
              </label>
              <Tooltip title="Statistical Power is typically 80%">
                <Input id="statsPower" endAdornment={<InputAdornment position="end">%</InputAdornment>} sx={{input:{color:"white"}}} type="number" 
                onChange={this.processField6Change} onFocus={this.updateField6DisplayA.bind(this)} onBlur={this.updateField6DisplayB.bind(this)} value={this.state.statPower}/>
              </Tooltip>
            </div>
            <div>
              <label htmlFor="dailyVisit">
                Total Number of Daily Visitors (both groups)			
              </label>
              <TextField id="dailyVisit" sx={{input:{color:"white"}}} type="number" onChange={this.processField7Change} onBlur={this.updateField7Value.bind(this)}
              value={this.state.dailyVisitors}/>
            </div>
          </div>
          <div class="Outputs"> 
            <h1>Outputs</h1>
            <div id = "convRateVariant">
              Conversion Rate, Variant Group: {this.state.displayedConvRateVariant}%
            </div>
            <div id = "trafficSizeRatio">
              Ratio of the two group traffic sizes: {this.state.displayedTrafficRatio}
            </div>
            <div id = "sampleVariant">
              Sample Size, Variant: {this.state.sampleVariant}
            </div>
            <div id = "sampleControl">
              Sample Size, Control: {this.state.sampleControl}
            </div>
            <div id = "sampleTotal">
              Total Sample Size: {this.state.sampleTotal}
            </div>
            <div id = "days">
              Days to run the test: {this.state.days}
            </div>
            <div id = "weeks">
              Weeks to run the test: {this.state.weeks}
            </div>
          </div> 
            <div style={{display: this.state.hidden ? 'none' : 'block'}}>
              <h1>Testing Formulas</h1>
              <p>Formulas used to calculate sample size (traffic) on "Pre-Test Calculator" Sheet</p>
              <table>
                <tr>
                  <table>
                    <td><h2>Kappa</h2></td>
                    <td>Created Formula will be here</td>
                    <td>For example, if the control group is 3 times larger than the variant group, then kappa = 3</td>
                  </table>
                  </tr>
                  <tr>
                    <table>
                      <td><h2>Sample Size Determination</h2></td>
                      <td>Given, the CVR for the control,      , the ratio of sample sizes in each group, kappa       , and lift, the sample sizes for each group,                     , can be determined by the following formulas:</td>
                    </table>
                  </tr>
                  <tr>
                    <table>
                      <td><h3>Sample Size Variant</h3></td>
                      <td>Formula Here</td>
                    </table>
                  </tr>
                  <tr>
                    <table>
                      <td><h3>Sample Size Control</h3></td>
                      <td>Formula Here</td>
                      </table>
                  </tr>
                  <tr><td>Note: Typically, the power,              ,  is .8 and significance level,      , is 0.05 ( or CI=95%).So, (Eq. 1) can be simplified to: </td></tr>
                  <tr><td>Formula Here</td></tr>
              </table>
            </div>
        </div>
      )
    }
  }