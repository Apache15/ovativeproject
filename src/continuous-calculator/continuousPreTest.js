import {TextField, InputAdornment, FormControl, Box, Tooltip, Button, Slider, Typography, Container} from "@mui/material";
import "./continuousPreTest.css"
import jstat from 'jstat';
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
    const varSampleSize = Math.ceil(tempA*tempB*tempB);
    const conSampleSize = Math.ceil(varSampleSize * groupSizeRatio);
    const totalSampleSize = varSampleSize + conSampleSize;
    const testRunDays = Math.ceil(totalSampleSize / formData.dailyVisitorsInput);
    const testRunWeeks = Math.ceil(testRunDays / 7);

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
        var temp = Math.ceil(event.target.value*100)/100;
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
        var temp = Math.round(100*event.target.value)/100;
        var temp2 = Math.round(100*(100-temp))/100;
        if(temp>100){temp=100; temp2=0;}
        if(temp<0){temp=0; temp2=100;}
        setData((previous) => {
            return {...previous, "ctrlTrafficPercentInput": temp, "varTrafficPercentInput": temp2}
        })
        if(temp == 100 || temp == 0){
            setActualData((previous) => {
            return {...previous, "ctrlTrafficPercentInput": temp, "varTrafficPercentInput": temp2}
        })}
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

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingBottom: "4ch" }}>
                <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
                <div className="container">
                    <Box className="Input-form-box">
                        <div className="Form-title">Insert Numbers Here</div>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? "Suggested value is 1.5%" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            <Tooltip title={isDetailed === true ? "Suggested Value is $10.06" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            <Tooltip title={isDetailed === true ? "Suggested Value is 50%" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            <Tooltip title={isDetailed === true ? "Suggested Value is 50%" : ""} placement="left">
                                <TextField 
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            <Tooltip title={isDetailed === true ? "Suggested Value is 95%" : ""} placement="left">
                                <Slider
                                    className="confidenceLvl"
                                    aria-label="Confidence Level"
                                    defaultValue={95}
                                    valueLabelDisplay="auto"
                                    label='Confidence Level'
                                    step={1}
                                    marks
                                    min={80}
                                    max={99}
                                    onChange={inputChange}
                                >
                                </Slider>
                            </Tooltip>
                            <Typography>Statistical Power (%)</Typography>
                            <Tooltip title={isDetailed === true ? "Suggested Value is 80%" : ""} placement="left">
                                <Slider
                                    className="statisticalPower"
                                    aria-label="Statistical Power (%)"
                                    defaultValue={80}
                                    valueLabelDisplay="auto"
                                    label='Statistical Power'
                                    step={1}
                                    marks
                                    min={80}
                                    max={99}
                                    onChange={inputChange}
                                >
                                </Slider>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Suggested Value is 20" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            <Tooltip title={isDetailed === true ? "Suggested Value is 1" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            value={(conSampleSize).toFixed()}
                            label="Sample Size, Control"
                            InputLabelProps={{shrink: true}}
                        >
                        </TextField>
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                        <TextField
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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
                            sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
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