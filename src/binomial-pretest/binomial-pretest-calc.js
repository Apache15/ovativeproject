import React, {useState} from 'react';
import jStat from 'jstat';
import { TextField, InputAdornment, Box, Typography, Slider, Button, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import './binomial-pretest-calc.css';
import eq1 from "./BiPretestEq1.png";
import eq1Alt from "./BiPretestEq1Alt.png";
import ContinuousDefinitions from '../continuous-definitions/continuousDefinitions';

export default function BiPretest(){
  const [formData, setData] = useState({hidden: false, desiredLift: 42.86, convRateControl: 3.5, convRateVariant: 5, 
        trafficControl: 50, trafficVariant: 50, trafficRatio: 1, confLevel: 90, 
        statPower: 80, dailyVisitors: 600, sampleVariant: 2234, sampleControl: 2234, sampleTotal: 4468, days: 8, weeks: 2});
  const [actualData, setActualData] = useState({desiredLift: 42.86, convRateControl: 3.5, trafficControl: 50, trafficVariant: 50, trafficRatio: 1});
  //Handles Showing/Hiding detailed information
  function changeDetail(){
    if(formData.hidden === true){
      setData((previous) => {
        return { ...previous, "hidden": false }
      });}
    else{
      setData((previous) => {
        return { ...previous, "hidden": true }
      })}
  }
  //Function that updates displayed and actual data simultaneously
  const inputChange = (inputElement) => {
    const newVal = inputElement.target.value;
    const name = inputElement.target.name;
    setData((previous) => {
      return { ...previous, [name]: newVal }
    })
    setActualData((previous) => {
      return { ...previous, [name]: newVal }
    })
  }
  //Handles changes made to the "Desired Lift" Text Field
  function processField1Change(inputElement){
    inputChange(inputElement);
    calculateConvRate(inputElement.target.value, 1);
  }
  //Displays the full value upon selection of the TextField
  function updateField1DisplayA(){
    setData((previous) => {
      return { ...previous, "desiredLift": actualData.desiredLift }
    })
  }
  //Displays the rounded value upon selecting off the TextField
  function updateField1DisplayB(){
    var lift = formData.desiredLift;
    if(lift <= 0){
      lift = 1;
      setActualData((previous) => {
        return { ...previous, "desiredLift": lift};
      })}
    var temp = Math.round(lift*100)/100;
    setData((previous) => {
      return { ...previous, "desiredLift": temp }
    })
    calculateConvRate(lift, 1);
  }
  //Handles changes made to the "Baseline Conversion Rate, Control Group" Text Field
  function processField2Change(inputElement){
    inputChange(inputElement);
    calculateConvRate(inputElement.target.value, 2);
  }
  //Displays the full value upon selection of the TextField
  function updateField2DisplayA(){
    setData((previous) => {
      return { ...previous, "convRateControl": actualData.convRateControl }
    })
  }
  //Displays the rounded value upon selecting off the TextField
  function updateField2DisplayB(){
    var convRate = formData.convRateControl;
    if(convRate < 0){
      convRate = 0;
      setActualData((previous) => {
        return { ...previous, "convRateControl": convRate};
      })}
    var temp = Math.round(convRate*100)/100;
    setData((previous) => {
      return { ...previous, "convRateControl": temp }
    })
    calculateConvRate(convRate, 2);
  }
  //Calculates the Conversion Rate for the Variant Group, using the formula (Desired Lift)*(1 + Baseline Conversion Rate, Control Group)
  function calculateConvRate(val, field) {
    var newVal = 0;
    var convTemp = 0;
    if(actualData.desiredLift !== 0 && field === 2){ 
      newVal = (1+(actualData.desiredLift/100))*val;
      convTemp = val;
    }
    else if(actualData.convRateControl !== 0 && field === 1){ 
      newVal = (1+(val/100))*actualData.convRateControl;
      convTemp = actualData.convRateControl;
    }
    var newValRounded = Math.round(newVal*100)/100;
    setData((previous) => {
      return { ...previous, "convRateVariant": newValRounded }
    })
    calculateSampleSizes(convTemp, newVal, 2); 
  }
  //Handles changes made to the "Percentage Traffic Control Group" Text Field
  function processField3Change(inputElement){
    var newCont = inputElement.target.value;
    var newVar = 100-newCont;
    setData((previous) => {
      return { ...previous, "trafficControl": newCont, "trafficVariant": newVar, "trafficRatio": Math.round(newCont*100/newVar)/100 }
    })
    setActualData((previous) =>{
      return { ...previous, "trafficControl": newCont, "trafficVariant": newVar, "trafficRatio": newCont/newVar}
    })
    calculateSampleSizes(newCont/newVar, 0, 3);
  }
  //Handles changes made to the "Percentage Traffic Variant Group" Text Field
  function processField4Change(inputElement){
    var newVar = inputElement.target.value;
    var newCont = 100-newVar;
    setData((previous) => {
      return { ...previous, "trafficControl": newCont, "trafficVariant": newVar, "trafficRatio": Math.round(newCont*100/newVar)/100 }
    })
    setActualData((previous) =>{
      return { ...previous, "trafficControl": newCont, "trafficVariant": newVar, "trafficRatio": newCont/newVar}
    })
    calculateSampleSizes(newCont,newVar, 0, 3);
  }
  //Displays the full values upon selection of either TextField
  function updateFields3And4DisplayA(){
    setData((previous) => {
      return { ...previous, "trafficControl": actualData.trafficControl, "trafficVariant": actualData.trafficVariant, "trafficRatio": actualData.trafficRatio }
    })
  }
  //Displays the rounded values upon selection off either TextField
  function updateFields3And4DisplayB(){
    var tempCont = Math.round(formData.trafficControl*100)/100;
    var tempVar = Math.round(formData.trafficVariant*100)/100;
    if(tempCont < 0){
      tempCont = 0;
      tempVar = 100;
    }
    else if(tempCont > 100){
      tempCont = 100;
      tempVar = 0;
    }
    setData((previous) => {
      return { ...previous, "trafficControl": tempCont, "trafficVariant": tempVar, "trafficRatio": Math.round(tempCont*100/tempVar)/100 }
    })
    setActualData((previous) => {
      return { ...previous, "trafficControl": tempCont, "trafficVariant": tempVar, "trafficRatio": tempCont/tempVar }
    })
    calculateSampleSizes(tempCont/tempVar, 0, 3);
  }
  //Handles changes made to the "Confidence Level" TextField
  function processField5Change(inputElement){
      inputChange(inputElement);
      calculateSampleSizes(inputElement.target.value, 0, 5);
  }
  //Handles changes made to the "Statistical Power" TextField
  function processField6Change(inputElement){
    inputChange(inputElement);
      calculateSampleSizes(inputElement.target.value, 0, 6);
  }
  //Handles changes made to the "Daily Visitors" TextField
  function processField7Change(inputElement){
    inputChange(inputElement);
    calculateRuntime(inputElement.target.value, 2);
  }
  //Rounds the value to the next whole number upon selection off the TextField
  function updateField7Value(){
    var newVal = Math.ceil(formData.dailyVisitors);
    if(newVal<0){newVal=0;}
    setData((previous) => {
      return { ...previous, "dailyVisitors": newVal}
    })
    calculateRuntime(newVal, 2);
  }
  //Calculates the sample sizes needed 
  function calculateSampleSizes(val, val2, field){
    var conf = formData.confLevel/100, stat = formData.statPower/100, crCont = formData.convRateControl/100, crVar = formData.convRateVariant/100, 
    traf = formData.trafficRatio;
    if(field===1){crCont = val/100;}
    else if(field===2){crCont = val/100; crVar = val2/100;}
    else if(field===3){traf = val;}
    else if(field===5){conf = val/100;}
    else if(field===6){stat = val/100;}
    var temp1 = ((crCont*(1-crCont))/traf)+(crVar*(1-crVar));
    var temp2 = ((jStat.normal.inv(1-((1-(conf))/2), 0, 1)+(jStat.normal.inv(stat,0,1)))/(crCont-crVar));
    var trafficV = Math.ceil(temp1*temp2*temp2);
    var trafficC = Math.ceil(formData.trafficRatio*trafficV);
    var trafficT = trafficV + trafficC;
    setData((previous) => {
      return { ...previous, "sampleVariant": trafficV, "sampleControl": trafficC, "sampleTotal": trafficT }
    })
    calculateRuntime(trafficT, 1);
  }
  //Calculates the runtime in days and weeks needed using the equation (Total Sample Size)/(Daily Visitors), rounded up to the nearest integer
  function calculateRuntime(val, field){ 
    if(field===1){
      setData((previous) => {
        return { ...previous, "days": Math.ceil(val/formData.dailyVisitors), "weeks": Math.ceil((val/7)/formData.dailyVisitors) }
      })
    }
    if(field===2){
      setData((previous) => {
        return { ...previous, "days": Math.ceil(formData.sampleTotal/val), "weeks": Math.ceil(formData.sampleTotal/7/val) }
      })
    }
  }
  //inputValid function from continuous-posttest-calc.js
  function inputValid(event, regex) {
    if (!regex.test(event.key)) {
        event.preventDefault();
    }
  }

  //Sets values upon page initiation
  // useEffect(() => {
  //   setData((previous) => {
  //     return { ...previous, hidden: false, desiredLift: 42.86, displayedDesiredLift: 42.86, convRateControl: 3.5, displayedConvRateControl: 3.5, convRateVariant: 5, displayedConvRateVariant: 5, 
  //       trafficControl: 50, displayedTrafficControl: 50, trafficVariant: 50, displayedTrafficVariant: 50, trafficRatio: 1, displayedTrafficRatio: 1, confLevel: 90, 
  //       statPower: 80, displayedStatePower: 80, dailyVisitors: 600, sampleVariant: 2234, sampleControl: 2234, sampleTotal: 4468, days: 8, weeks: 2 }
  //     })
  // }, []);

  return(
    <div className='body-container'>
    <div className="Button">
      {/*<Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="changeDetail" variant="contained" onClick={this.changeDetail.bind(this)}>Toggle Tooltips</Button>*/}
    </div>
      <div className="BodyContainers">
        <Box className="InputBox">
          <div className="BoxLabel">Inputs</div>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The desired percent increase in metric for users receiving the variant versus the control group</div> : ""} placement="right" arrow>
            <TextField label="Desired Lift" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} type="number" name="desiredLift"
              InputProps={{ inputProps: { max: 100, min: 10 }, endAdornment: <InputAdornment position="end">%</InputAdornment>}} onChange={processField1Change} 
              onFocus={updateField1DisplayA} onBlur={updateField1DisplayB} onKeyPress={(e) => {inputValid(e, /[0-9, .]/)}} value={formData.desiredLift}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The current conversion rate of successful actions taken divided by the number of visitors to the page</div> : ""} placement="right" arrow> 
            <TextField label="Baseline Conversion Rate, Control Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} name="convRateControl" type="number" 
              onChange={processField2Change} onFocus={updateField2DisplayA} onBlur={updateField2DisplayB} onKeyPress={(e) => {inputValid(e, /[0-9, .]/)}} 
              value={formData.convRateControl}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The percentage of the total sample size that will use the control rather than the variant</div> : ""} placement="right" arrow>
            <TextField label="Percentage of traffic in Control Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} name="trafficControl" 
              InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}} type="number" onChange={processField3Change} 
              onFocus={updateFields3And4DisplayA} onBlur={updateFields3And4DisplayB} onKeyPress={(e) => {inputValid(e, /[0-9, .]/)}} value={formData.trafficControl}/> 
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The percentage of the total sample size that will use the variant rather than the control</div> : ""} placement="right" arrow>
            <TextField label="Percentage of traffic in Variant Group" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} name="trafficVariant" 
              InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}} type="number" onChange={processField4Change} 
              onFocus={updateFields3And4DisplayA} onBlur={updateFields3And4DisplayB} onKeyPress={(e) => {inputValid(e, /[0-9, .]/)}} value={formData.trafficVariant}/> 
          </Tooltip>
          <Typography>Confidence Level</Typography>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">Suggested value range is 80% - 95%</div> : ""} placement="right" arrow>
            <Slider marks={[{value: 80,label: 80},{value: 99,label: 99},]} name="confLevel" aria-label="Confidence Level" value={formData.confLevel} valueLabelDisplay="auto" label='Confidence Level'
              step={1} min={80} max={99} onChange={processField5Change}/>
          </Tooltip>
          <Typography>Statistical Power</Typography>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">Statistical Power is typically 80%</div> : ""} placement="right" arrow>
            <Slider name="statPower" aria-label="Statistical Power" value={formData.statPower} valueLabelDisplay="auto" label='Statistical Power'
              step={1} marks={[{value: 80,label: 80},{value: 99,label: 99},]} min={80} max={99} onChange={processField6Change}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The positive number of daily visitors participating in either the control or the variant group</div> : ""} placement="right" arrow>
            <TextField label="Total Number of Daily Visitors (both groups)" variant="standard" sx={{ m: 1 }} InputLabelProps={{ shrink: true }} name="dailyVisitors" type="number" 
            onChange={processField7Change} onBlur={updateField7Value} onKeyPress={(e) => {inputValid(e, /[0-9, .]/)}} value={formData.dailyVisitors}/>                        
          </Tooltip>
        </Box>
        <Box className="OutputBox">
          <div className="BoxLabel">Outputs</div>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The conversion rate for the variant group required to meet the desired lift of the baseline conversion rate</div> : ""} placement="left" arrow>
            <TextField label="Conversion Rate, Variant Group" variant="filled" sx={{ m: 1}} InputProps={{color: "black",endAdornment: 
              <InputAdornment position="end">%</InputAdornment>,readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="convRateVariant" type="number" value={formData.convRateVariant.toFixed(2)}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The % of traffic in the control group divided by the % of traffic in the variant group</div> : ""} placement="left" arrow>
            <TextField label="Ratio of the two group traffic sizes" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,
              inputProps: {style: { textAlign: 'right' }}}} InputLabelProps={{ shrink: true }} name="trafficRatio" type="number" value={formData.trafficRatio}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The sample size required for the variant group, rounded up</div> : ""} placement="left" arrow>
            <TextField label="Sample Size, Variant" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="sampleVariant" type="number" value={formData.sampleVariant}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The sample size required for the control group, rounded up</div> : ""} placement="left" arrow>
            <TextField label="Sample Size, Control" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="sampleControl" type="number" value={formData.sampleControl}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The variant sample size plus the control sample size</div> : ""} placement="left" arrow>
            <TextField label="Total Sample Size" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="sampleTotal" type="number" value={formData.sampleTotal}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The number of days the test will take to run, rounded up</div> : ""} placement="left" arrow>
            <TextField label="Days to run the test" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="days" type="number" value={formData.days}/>
          </Tooltip>
          <Tooltip title={formData.hidden === false ? <div className="tooltip-text">The number of weeks the test will take to run, rounded up</div> : ""} placement="left" arrow>
            <TextField label="Weeks to run the test" variant="filled" sx={{ m: 1 }} InputProps={{color: "black", readOnly: true,inputProps: {style: { textAlign: 'right' }}}}
              InputLabelProps={{ shrink: true }} id="weeks" type="number" value={formData.weeks}/>
          </Tooltip>
        </Box> 
      </div>
      <div className="EducationContainer">
        <Box className="Accordion-box">
          <Accordion>
            <AccordionSummary expandIcon={"▼"} aria-controls="panel3a-content" id="panel3a-header">
              <div className="header">Testing Formulas</div>
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
                <img src={eq1} width="400wv" align="center" alt="Equation for calculating the sample size of the variant test"/>
                <p></p>
                <Typography align="center">Note: Typically, the power, (1 - 𝛽),  is .8 and significance level, ⍺, is 0.05 (or CI=95%). So, (Eq. 1) can be simplified to: </Typography>
                <img src={eq1Alt} width="400wv" align="center" alt="Equation for calculataing the sample size of the variant test using a statistical power of 0.8 and a confidence interval of 0.95"/>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <ContinuousDefinitions/>
      </div>
    </div>
  )
}