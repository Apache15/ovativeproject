import {TextField, InputAdornment, FormControl, Box, Tooltip, Button} from "@mui/material";
import "./continuousPreTest.css"
import jstat from 'jstat';
import React, {useState} from "react";

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
    const varSampleSize = (1 + (1 / groupSizeRatio)) * (Math.pow( formData.pooledStandardDeviationInput * ( (jstat.normal.inv(((1 - ((1 - (formData.confidenceLvlInput * 0.01))) / 2), 0, 1)) + 
        jstat.normal.inv((formData.statisticalPowerInput * 0.01), 0, 1)) / (formData.conBaseRevInput - varGroupRevenue))),2);
    const conSampleSize = (varSampleSize * groupSizeRatio);
    const totalSampleSize = (varSampleSize + conSampleSize);
    const testRunDays = Math.ceil(totalSampleSize / formData.dailyVisitorsInput);
    const testRunWeeks = Math.ceil(testRunDays / 7);

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
            <Button sx={{ml:"50px",mt:"50px"}} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
            <div className="container">
                <Box className="Input-form-box">
                    <div className="Form-title">Insert Numbers Here</div>
                    <FormControl>
                        <Tooltip title={isDetailed === true ? "Suggested value is 1.5%" : ""} placement="left">
                            <TextField
                                sx={{m: 1}}
                                className="desiredLift"
                                variant="standard"
                                required={true}
                                placeholder="1.5"
                                type="number"
                                name="desiredLiftInput"
                                label="Desired Lift"
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
                                sx={{m: 1}}
                                className="ctrlBaselineRev"
                                variant="standard"
                                required={true}
                                placeholder="20"
                                type="number"
                                name="conBaseRevInput"
                                label="Baseline Revenue, Control Group"
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
                                sx={{m: 1}}
                                className="ctrlTrafficPercent"
                                variant="standard"
                                required={true}
                                placeholder="35"
                                type="number"
                                name="ctrlTrafficPercentInput"
                                label="Percentage of traffic in Control Group"
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
                                sx={{m: 1}}
                                className="varTrafficPercent"
                                variant="standard"
                                required={true}
                                placeholder="35"
                                type="number"
                                name="varTrafficPercentInput"
                                label="Percentage of traffic in Variant Group"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                                onChange={inputChange}
                                InputLabelProps={{shrink: true}}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested Value is 95%" : ""} placement="left">
                            <TextField
                                sx={{m: 1}}
                                className="confidenceLvl"
                                variant="standard"
                                required={true}
                                placeholder="90"
                                type="number"
                                name="confidenceLvlInput"
                                label="Confidence Level (%)"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                                onChange={inputChange}
                                InputLabelProps={{shrink: true}}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested Value is 80%" : ""} placement="left">
                            <TextField
                                sx={{m: 1}}
                                className="statisticalPower"
                                variant="standard"
                                required={true}
                                placeholder="80"
                                type="number"
                                name="statisticalPowerInput"
                                label="Statistical Power (%)"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                                onChange={inputChange}
                                InputLabelProps={{shrink: true}}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested Value is 20" : ""} placement="left">
                            <TextField
                                sx={{m: 1}}
                                className="dailyVisitors"
                                variant="standard"
                                required={true}
                                placeholder="20"
                                type="number"
                                name="dailyVisitorsInput"
                                label="Total Number of Daily Visitors (both groups)"
                                onChange={inputChange}
                                InputLabelProps={{shrink: true}}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested Value is 1" : ""} placement="left">
                            <TextField
                                sx={{m: 1}}
                                className="pooledStandardDeviation"
                                variant="standard"
                                required={true}
                                placeholder="1"
                                name="pooledStandardDeviationInput"
                                type="number"
                                label="Estimate of Pooled Standard Deviation"
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
                        sx={{m: 1}}
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
        </>
    )
}