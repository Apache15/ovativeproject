import {TextField, InputAdornment, FormControl, Box, Tooltip, Button, Slider, Typography, Container} from "@mui/material";
import "./continuousPreTest.css"
import jStat from 'jstat';
import React, {useState} from "react";
import ContinousPreTestFormulas from "../continuous-calculator/continuousPreTestFormulas";
import ContinuousDefinitions from "../continuous-definitions/continuousDefinitions";

export default function ContinuousPreTestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    const [formData, setData] = useState({
        ctrlTrafficPercentInput: 0,
        varTrafficPercentInput: 0,
        conBaseRevInput: 0,
        desiredLiftInput: 0,
        pooledStandardDeviationInput: 0,
        confidenceLvlInput: 0,
        statisticalPowerInput: 0,
        dailyVisitorsInput: 0
        
    })

    const groupSizeRatio = (formData.ctrlTrafficPercentInput * 0.01) / (formData.varTrafficPercentInput * 0.01);
    const varGroupRevenue = formData.conBaseRevInput * (1 + (formData.desiredLiftInput * .01));
    const revAbsoluteDiff = Math.abs(formData.conBaseRevInput - varGroupRevenue);
    const varSampleSize = (1 + (1 / groupSizeRatio)) * (Math.pow( formData.pooledStandardDeviationInput * ( (jStat.normal.inv(((1 - ((1 - (formData.confidenceLvlInput * 0.01))) / 2), 0, 1)) + 
        jStat.normal.inv((formData.statisticalPowerInput * 0.01), 0, 1)) / (formData.conBaseRevInput - varGroupRevenue))),2);
    const conSampleSize = (varSampleSize * groupSizeRatio);
    const totalSampleSize = (varSampleSize + conSampleSize);
    const testRunDays = Math.ceil(totalSampleSize / formData.dailyVisitorsInput);
    const testRunWeeks = Math.ceil(testRunDays / 7);

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
                return {...previous, [name]: value}
            })
        }
    }

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingBottom: "4ch" }}>
                { /* <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button> */}
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
                                    placeholder="1.5"
                                    type="number"
                                    name="desiredLiftInput"
                                    label="Desired Lift"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    InputLabelProps={{shrink: true}}
                                    onChange={inputChange}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Suggested Value is $10.06" : ""} placement="left">
                                <TextField
                                    sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="ctrlBaselineRev"
                                    variant="standard"
                                    required={true}
                                    placeholder="10.06"
                                    type="number"
                                    name="conBaseRevInput"
                                    label="Baseline Revenue, Control Group"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }}
                                    onChange={inputChange}
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
                                    placeholder="50"
                                    type="number"
                                    name="ctrlTrafficPercentInput"
                                    label="Percentage of traffic in Control Group"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={inputChange}
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
                                    placeholder="50"
                                    type="number"
                                    name="varTrafficPercentInput"
                                    label="Percentage of traffic in Variant Group"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={inputChange}
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
                                    placeholder="20"
                                    type="number"
                                    name="dailyVisitorsInput"
                                    label="Total Number of Daily Visitors (both groups)"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
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
                                    placeholder="1"
                                    name="pooledStandardDeviationInput"
                                    type="number"
                                    label="Estimate of Pooled Standard Deviation"
                                    onKeyPress={(e) => (this.inputValid(e, /[0-9, .]/))}
                                    onChange={inputChange}
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
                            value={(varSampleSize).toFixed(2)}
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