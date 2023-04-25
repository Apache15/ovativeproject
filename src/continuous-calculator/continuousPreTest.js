import {TextField, InputAdornment, FormControl, Box, Tooltip, Button, Slider, Typography, Container, formHelperTextClasses} from "@mui/material";
import "./continuousPreTest.css"
import jStat from 'jstat';
import React, {useState} from "react";
import ContinousPreTestFormulas from "../continuous-calculator/continuousPreTestFormulas";
import ContinuousDefinitions from "../continuous-definitions/continuousDefinitions";

export default function ContinuousPreTestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    const [formData, setData] = useState({
        ctrlTrafficPercentInput: 50,
        varTrafficPercentInput: 50,
        conBaseRevInput: 10.06,
        desiredLiftInput: 1.5,
        pooledStandardDeviationInput: 1,
        confidenceLvlInput: 95,
        statisticalPowerInput: 80,
        dailyVisitorsInput: 20
    })
    const [actualData, setActualData] = useState({
        ctrlTrafficPercentInput: 50,
        varTrafficPercentInput: 50,
        desiredLiftInput: 1.5,
        pooledStandardDeviationInput: 1,
    })

    const groupSizeRatio = (actualData.ctrlTrafficPercentInput * 0.01) / (actualData.varTrafficPercentInput * 0.01);
    const varGroupRevenue = formData.conBaseRevInput * (1 + (actualData.desiredLiftInput * .01));
    const revAbsoluteDiff = Math.abs(formData.conBaseRevInput - varGroupRevenue);
    const tempA = 1 + (1/groupSizeRatio);
    const tempB = actualData.pooledStandardDeviationInput*((jStat.normal.inv((1-((1-(.0001*formData.confidenceLvlInput))/2)), 0, 1) + jStat.normal.inv((.0001*formData.statisticalPowerInput), 0, 1)) / (formData.conBaseRevInput-varGroupRevenue));
    const varSampleSize = Math.round(tempA*tempB*tempB);
    const conSampleSize = Math.round(varSampleSize * groupSizeRatio);
    const totalSampleSize = (varSampleSize + conSampleSize);
    const testRunDays = Math.round(totalSampleSize / formData.dailyVisitorsInput);
    const testRunWeeks = Math.round(testRunDays / 7);

    function inputValid(event, regex) {
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    }

    const inputChange = (input) => {
        if (!isNaN(input.target.value)) {
            const name = input.target.name;
            const value = input.target.value;
            setData((previous) => {
                return { ...previous, [name]: value }
            })
        }
    }

    function handleLift(event){
        inputChange(event);
        setActualData((previous) => {
            return {...previous, "desiredLiftInput": event.target.value}
            })
    }

    function blurLift(event){
        var temp = Math.round(100*event.target.value)/100;
        setData((previous) => {
            return { ...previous, "desiredLiftInput": temp}
        })
    }

    function unblurLift(){
        setData((previous) => {
            return { ...previous, "desiredLiftInput": actualData.desiredLiftInput}
        })
    }

    function blurRevenue(event){
        var temp = Math.round(event.target.value*100)/100;
        setData((previous) => {
            return { ...previous, "conBaseRevInput": temp}
        })
    }

    function handleTraffic1(event){
        var temp = event.target.value;
        var temp2 = 100-temp;
        setData((previous) => {
            return {...previous, "ctrlTrafficPercentInput": temp, "varTrafficPercentInput": temp2}
        })
        setActualData((previous) => {
        return {...previous, "ctrlTrafficPercentInput": temp, "varTrafficPercentInput": temp2}
        })
    }
    
    function handleTraffic2(event){
        var temp = event.target.value;
        var temp2 = 100-temp;
        setData((previous) => {
            return {...previous, "varTrafficPercentInput": temp, "ctrlTrafficPercentInput": temp2}
        })
        setActualData((previous) => {
            return {...previous, "varTrafficPercentInput": temp, "ctrlTrafficPercentInput": temp2}
        })
    }

    function blurTraffic1(event){
        var temp = event.target.value;
        var temp2 = Math.round(100*(100-temp))/100;
        if(temp>100){temp=100; temp2=0;}
        if(temp<0){temp=0; temp2=100;}
        setData((previous) => {
            return {...previous, "ctrlTrafficPercentInput": Math.round(100*temp)/100, "varTrafficPercentInput": Math.round(100*temp2)/100}
        })
        setActualData((previous) => {
        return {...previous, "ctrlTrafficPercentInput": temp, "varTrafficPercentInput": temp2}
        })
    }

    function blurTraffic2(event){
        var temp = Math.round(100*event.target.value)/100;
        var temp2 = Math.round(100*(100-temp))/100;
        if(temp>100){temp=100; temp2=0;}
        if(temp<0){temp=0; temp2=100;}
        setData((previous) => {
            return {...previous, "varTrafficPercentInput": temp, "ctrlTrafficPercentInput": temp2}
        })
        if(temp == 100 || temp == 0){
            setActualData((previous) => {
            return {...previous, "varTrafficPercentInput": temp, "ctrlTrafficPercentInput": temp2}
        })}
    }

    function unblurTraffic(){
        setData((previous) => {
            return { ...previous, "ctrlTrafficPercentInput": actualData.ctrlTrafficPercentInput, "varTrafficPercentInput": actualData.varTrafficPercentInput}
        })
    }

    function handleDev(event){
        inputChange(event);
        setActualData((previous) => {
            return {...previous, "pooledStandardDeviationInput": event.target.value}
            })
    }

    function blurDev(event){
        var temp = Math.round(100*event.target.value)/100;
        setData((previous) => {
            return { ...previous, "pooledStandardDeviationInput": temp}
        })
    }

    function unblurDev(){
        setData((previous) => {
            return { ...previous, "pooledStandardDeviationInput": actualData.pooledStandardDeviationInput}
        })
    }


    /*const processField3Change = (inputElement)=> {
        var newCont = inputElement.target.value;
        if (newCont < 0) newCont = 0;
        if (newCont > 100) newCont = 100;
        var newVar = Math.round(100 * (1 - (.01 * newCont)) * 100) / 100;
        setData((previous) => {
            return { ...previous, "varTrafficPercentInput": newVar }
        })
        
        console.log(formData.varTrafficPercentInput);
      }*/

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingBottom: "4ch" }}>
                { /* <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button> */}
                <div className="container">
                    <Box className="Input-form-box">
                        <div className="Form-title">Insert Numbers Here</div>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? <div className="tooltip-text">0 &lt; Desired Lift<br></br>The desired positive percent increase in metric for users receiving the variant versus the control group</div> : ""} placement="right">
                                <TextField
                                    sx={{ m: "1ch", }}
                                    className="desiredLift"
                                    variant="standard"
                                    required={true}
                                    value = {formData.desiredLiftInput}
                                    type="number"
                                    name="desiredLiftInput"
                                    label="Desired Lift"
                                    onKeyPress={(e) => (inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    InputLabelProps={{shrink: true}}
                                    onChange={handleLift}
                                    onBlur={blurLift}
                                    onFocus={unblurLift}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? <div className="tooltip-text">𝜇<sub>𝐶</sub>, 0 &lt; 𝜇<sub>𝐶</sub></div> : ""} placement="right">
                                <TextField
                                    sx={{ m: "1ch", }}
                                    className="ctrlBaselineRev"
                                    variant="standard"
                                    required={true}
                                    value={formData.conBaseRevInput}
                                    type="number"
                                    name="conBaseRevInput"
                                    label="Baseline Revenue, Control Group"
                                    onKeyPress={(e) => (inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }}
                                    onChange={inputChange}
                                    onBlur={blurRevenue}
                                    InputLabelProps={{shrink: true}}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? <div className="tooltip-text">0 &lt; Traffic% &lt; 100 <br></br>Control% + Variant% = 100%<br></br>The percentage of the total sample size that will use the control rather than the variant</div> : ""} placement="right">
                                <TextField
                                    sx={{ m: "1ch", }}
                                    className="ctrlTrafficPercent"
                                    variant="standard"
                                    required={true}
                                    value={formData.ctrlTrafficPercentInput}
                                    type="number"
                                    name="ctrlTrafficPercentInput"
                                    label="Percentage of traffic in Control Group"
                                    onKeyPress={(e) => (inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleTraffic1}
                                    onBlur={blurTraffic1}
                                    onFocus={unblurTraffic}
                                    InputLabelProps={{shrink: true}}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? <div className="tooltip-text">0 &lt; Traffic% &lt; 100 <br></br>Control% + Variant% = 100%<br></br>The percentage of the total sample size that will use the variant rather than the control</div> : ""} placement="right">
                                <TextField 
                                    sx={{ m: "1ch", }}
                                    className="varTrafficPercent"
                                    variant="standard"
                                    required={true}
                                    value={formData.varTrafficPercentInput}
                                    type="number"
                                    name="varTrafficPercentInput"
                                    label="Percentage of traffic in Variant Group"
                                    onKeyPress={(e) => (inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleTraffic2}
                                    onBlur={blurTraffic2}
                                    onFocus={unblurTraffic}
                                    InputLabelProps={{shrink: true}}
                                >
                                </TextField>
                            </Tooltip>
                            <Typography>Confidence Level (%)</Typography>
                            <Tooltip title={isDetailed === true ? "Suggested Value is 95%" : ""} placement="right">
                                <Slider
                                    className="confidenceLvl"
                                    aria-label="Confidence Level"
                                    defaultValue={95}
                                    valueLabelDisplay="auto"
                                    label='Confidence Level'
                                    name="confidenceLvlInput"
                                    step={1}
                                    marks
                                    min={80}
                                    max={99}
                                    onChange={inputChange}
                                >
                                </Slider>
                            </Tooltip>
                            <Typography>Statistical Power (%)</Typography>
                            <Tooltip title={isDetailed === true ? "Suggested Value is 80%" : ""} placement="right">
                                <Slider
                                    className="statisticalPower"
                                    aria-label="Statistical Power (%)"
                                    defaultValue={80}
                                    valueLabelDisplay="auto"
                                    label='Statistical Power'
                                    name="statisticalPowerInput"
                                    step={1}
                                    marks
                                    min={80}
                                    max={99}
                                    onChange={inputChange}
                                >
                                </Slider>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "The positive number of daily visitors participating in either the control or the variant group   " : ""} placement="right">
                                <TextField
                                    sx={{ m: "1ch", }}
                                    className="dailyVisitors"
                                    variant="standard"
                                    required={true}
                                    value={formData.dailyVisitorsInput}
                                    type="number"
                                    name="dailyVisitorsInput"
                                    label="Total Number of Daily Visitors (both groups)"
                                    onKeyPress={(e) => (inputValid(e, /[0-9]/))}
                                    onChange={inputChange}
                                    InputLabelProps={{shrink: true}}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? <div className="tooltip-text">If an estimate of the pooled standard deviation is unknown, you can use general rule of thumb<br></br>
                                <table>
                                    <td><tr></tr><tr>𝑠<sub>𝑝</sub> ≈</tr></td>
                                    <td><tr>max - min</tr><tr><hr></hr></tr><tr>4</tr></td>
                                    <td><tr></tr><tr>, if n ≤ 70</tr></td>
                                </table><br></br>
                                <table>
                                    <td><tr></tr><tr>𝑠<sub>𝑝</sub> ≈</tr></td>
                                    <td><tr>max - min</tr><tr><hr></hr></tr><tr>6</tr></td>
                                    <td><tr></tr><tr>, if n &gt; 70</tr></td>
                                </table></div> : ""} placement="right">
                                <TextField
                                    sx={{ m: "1ch", }}
                                    className="pooledStandardDeviation"
                                    variant="standard"
                                    required={true}
                                    value={formData.pooledStandardDeviationInput}
                                    name="pooledStandardDeviationInput"
                                    type="number"
                                    label="Estimate of Pooled Standard Deviation"
                                    onKeyPress={(e) => (inputValid(e, /[0-9, .]/))}
                                    onChange={handleDev}
                                    onBlur={blurDev}
                                    onFocus={unblurDev}
                                    InputLabelProps={{shrink: true}}
                                >
                                </TextField>
                            </Tooltip>
                        </FormControl>
                    </Box>
                    <Box className="Input-form-box">
                        <div className="Form-title">Conversions</div>
                        <TextField
                            sx={{ m: "1ch", }}
                            className="groupTrafficSizeRatio"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={(groupSizeRatio).toFixed(2)}
                            label="Ratio of the two group traffic sizes"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        <Tooltip title={isDetailed === true ? <div className="tooltip-text">𝜇<sub>𝑉</sub></div> : ""} placement="left">
                            <TextField
                                sx={{ m: "1ch", }}
                                className="varRevenue"
                                variant="filled"
                                InputProps={{
                                    color: "black",
                                    readOnly: true,
                                    inputProps: {
                                        style: {textAlign: 'right'},
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }
                                }}
                                type="number"
                                value={(varGroupRevenue).toFixed(2)}
                                label="Revenue, Variant Group"
                                InputLabelProps={{shrink: true}}
                            >
                            </TextField>
                        </Tooltip>
                        <TextField
                            sx={{ m: "1ch", }}
                            className="revenueAbsoluteDiff"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'},
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }
                            }}
                            type="number"
                            value={(revAbsoluteDiff).toFixed(2)}
                            label="Absolute Difference in Revenue"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        <Tooltip title={isDetailed === true ? <div className="tooltip-text">𝑛<sub>𝑉</sub></div> : ""} placement="left">
                        <TextField
                            sx={{ m: "1ch", }}
                            className="varSampleSize"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={varSampleSize}
                            label="Sample Size, Variant"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? <div className="tooltip-text">𝑛<sub>𝐶</sub></div> : ""} placement="left">
                        <TextField
                            sx={{ m: "1ch", }}
                            className="ctrlSampleSize"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={conSampleSize}
                            label="Sample Size, Control"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? <div className="tooltip-text">𝑛</div> : ""} placement="left">
                        <TextField
                            sx={{ m: "1ch", }}
                            className="totalSampleSize"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={totalSampleSize}
                            label="Total Sample Size"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        </Tooltip>
                        <TextField
                            sx={{ m: "1ch", }}
                            className="runTestDays"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={testRunDays}
                            label="Days to run the test"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        <TextField
                            sx={{ m: "1ch", }}
                            className="runTestWeeks"
                            variant="filled"
                            InputProps={{
                                color: "black",
                                readOnly: true,
                                inputProps: {
                                    style: {textAlign: 'right'}
                                }
                            }}
                            type="number"
                            value={testRunWeeks}
                            label="Weeks to run the test"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                    </Box>
                
                </div>
                <ContinousPreTestFormulas />
                <ContinuousDefinitions />
            </Container>
        </>
    )
}