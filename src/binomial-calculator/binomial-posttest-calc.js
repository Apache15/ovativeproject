import { TextField, InputAdornment, FormControl, Box, Tooltip, Button } from "@mui/material";
import "./binomial-posttest-calc.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import Slide from '@mui/material/Slide';
import norminv from 'norminv';
export default function BinomialPostTestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    const [formData, setData] = useState({
        conVarInput: 0,
        trafficVarInput: 0,
        conControlInput: 0,
        trafficControlInput: 0,
        testDuration: 0,
        confidenceLevel: 90,
    })
    //function to calculate normal dist.
    function ncdf(x, mean, std) {
        x = (x - mean) / std
        var t = 1 / (1 + .2315419 * Math.abs(x))
        var d = .3989423 * Math.exp(-x * x / 2)
        var prob = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
        if (x > 0) prob = 1 - prob
        return prob
    }
    //calculations for each stat
    const conRateVar = +formData.conVarInput / +formData.trafficVarInput;
    const conRateControl = +formData.conControlInput / +formData.trafficControlInput;
    const conRateDifference = conRateVar - conRateControl;
    const pooledConversionRate = (+formData.conVarInput + +formData.conControlInput) / (+formData.trafficControlInput + +formData.trafficVarInput);
    const liftEstimate = (conRateDifference / conRateControl);
    const testSatistic = conRateDifference / Math.sqrt(((conRateVar * (1 - conRateVar)) / formData.trafficVarInput) + ((conRateControl * (1 - conRateControl)) / formData.trafficControlInput));
    const pValue = 2 * (1 - ncdf(Math.abs(testSatistic), 0, 1));
    const confIntDiffHigh = ((formData.conVarInput / formData.trafficVarInput) - (formData.conControlInput / formData.trafficControlInput)) + (norminv(1 - ((1 - formData.confidenceLevel * 0.01) / 2), 0, 1) * (Math.sqrt((((formData.conVarInput / formData.trafficVarInput) * (1 - (formData.conVarInput / formData.trafficVarInput))) / formData.trafficVarInput) + (((formData.conControlInput / formData.trafficControlInput) * (1 - (formData.conControlInput / formData.trafficControlInput))) / formData.trafficControlInput))));
    const confIntDiffLow = ((formData.conVarInput / formData.trafficVarInput) - (formData.conControlInput / formData.trafficControlInput)) - (norminv(1 - ((1 - formData.confidenceLevel * 0.01) / 2), 0, 1) * (Math.sqrt((((formData.conVarInput / formData.trafficVarInput) * (1 - (formData.conVarInput / formData.trafficVarInput))) / formData.trafficVarInput) + (((formData.conControlInput / formData.trafficControlInput) * (1 - (formData.conControlInput / formData.trafficControlInput))) / formData.trafficControlInput))));
    const confIntLiftLow = confIntDiffLow / (formData.conControlInput / formData.trafficControlInput);
    const confIntLiftHigh = confIntDiffHigh / (formData.conControlInput / formData.trafficControlInput);


    const rejectHypothesis = (pValue <= (1 - (+formData.confidenceLevel / 100)));
    const daysNeeded = Math.ceil((((((((conRateControl * (1 - conRateControl)) / (+formData.trafficControlInput / +formData.trafficVarInput)) + (conRateVar * (1 - conRateVar))) * Math.pow(((norminv(1 - ((1 - 0.01 * +formData.confidenceLevel) / 2), 0, 1) + norminv(0.8, 0, 1)) / ((conRateControl - conRateVar))), 2)) * (+formData.testDuration / +formData.trafficVarInput)) - +formData.testDuration)));
    const conditionSatisfied = (
        formData.conVarInput >= 10 &&
        formData.conControlInput >= 10 &&
        (formData.trafficControlInput - formData.conControlInput) >= 10 &&
        (formData.trafficVarInput - formData.conVarInput) >= 10 &&
        (formData.trafficVarInput * pooledConversionRate) >= 10 &&
        (formData.trafficControlInput * pooledConversionRate) >= 10 &&
        (formData.trafficVarInput * (1 - pooledConversionRate)) >= 10 &&
        (formData.trafficVarInput * (1 - pooledConversionRate)) >= 10
    )
    function inputValid(event, regex) {
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    }
    const inputChange = (input) => {
        if (!isNaN(input.target.value)) {
            const name = input.target.name;
            const value = input.target.value;
            console.log(daysNeeded);
            setData((previous) => {
                return { ...previous, [name]: value }
            })
        }
    }
    return (
        <div className="bodyContainer">
            <Button sx={{ mb: "15px" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
            <div className="container">
                <Box className="Input-form-box">
                    <div className="Form-title">Insert Numbers Here</div>
                    <FormControl>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1 }}
                                className="numConversionsVariant"
                                variant="standard"
                                required={true}
                                placeholder="50"
                                type="number"
                                name="conVarInput"
                                label="Number of Conversions, Variant"
                                InputLabelProps={{ shrink: true }}
                                onChange={inputChange}
                                onKeyPress={(event) => {
                                    inputValid(event, /[0-9]/);
                                }}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1 }}
                                className="totalTrafficVariant"
                                variant="standard"
                                required={true}
                                placeholder="1000"
                                type="number"
                                name="trafficVarInput"
                                label="Total Traffic Variant"
                                onChange={inputChange}
                                onKeyPress={(event) => {
                                    inputValid(event, /[0-9]/);
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1 }}
                                className="numberOfConversionsControl"
                                variant="standard"
                                required={true}
                                placeholder="35"
                                type="number"
                                name="conControlInput"
                                label="Number of Conversions, Control"
                                InputLabelProps={{ shrink: true }}
                                onChange={inputChange}
                                onKeyPress={(event) => {
                                    inputValid(event, /[0-9]/);
                                }}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1 }}
                                className="totalTrafficControl"
                                variant="standard"
                                required={true}
                                placeholder="1000"
                                type="number"
                                name="trafficControlInput"
                                label="Total Traffic, Control"
                                InputLabelProps={{ shrink: true }}
                                onChange={inputChange}
                                onKeyPress={(event) => {
                                    inputValid(event, /[0-9]/);
                                }}
                            >
                            </TextField>
                        </Tooltip>
                        <TextField
                            sx={{ m: 1 }}
                            name="testDuration"
                            className="testDuration"
                            variant="standard"
                            placeholder="5"
                            onChange={inputChange}
                            onKeyPress={(event) => {
                                inputValid(event, /[0-9]/);
                            }}
                            type="number"
                            label="Test Duration (Days)"
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                        <TextField
                            sx={{ m: 1 }}
                            className="confidenceLevel"
                            variant="standard"
                            name="confidenceLevel"
                            placeholder="90"
                            defaultValue={90}
                            onChange={inputChange}
                            onKeyPress={(event) => {
                                inputValid(event, /[0-9.]/);
                            }}
                            type="number"
                            label="Confidence Level"
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </FormControl>
                </Box>
                <Box className="Input-form-box">
                    <div className="Form-title">Conversion Rates</div>

                    <TextField
                        sx={{ m: 1 }}
                        className="desiredLift"
                        variant="filled"
                        InputProps={{
                            color: "black",
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            readOnly: true,
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        type="number"
                        value={(conRateVar * 100).toPrecision(4)}
                        label="Conversion Rate, Variant"
                        InputLabelProps={{ shrink: true }}
                    >
                    </TextField>
                    <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                        <TextField
                            sx={{ m: 1 }}
                            className="desiredLift"
                            variant="filled"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                readOnly: true,
                                inputProps: {
                                    style: { textAlign: 'right' }
                                }
                            }}
                            value={(conRateControl * 100).toPrecision(4)}
                            type="number"
                            label="Conversion Rate, Control"
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
                    <TextField
                        sx={{ m: 1 }}
                        className="Control Diff"
                        variant="filled"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            readOnly: true,
                            inputProps: {
                                style: { textAlign: 'right' }
                            }
                        }}
                        value={(liftEstimate * 100).toPrecision(4)}
                        type="number"
                        label="Calculated Lift %"
                        InputLabelProps={{ shrink: true }}
                    >
                    </TextField>
                </Box>
                <Box className="Input-form-box">
                    <div hidden={rejectHypothesis} style={{ color: "black", backgroundColor: "#b05d5d" }}>Fail to reject null hypothesis.</div>
                    <div hidden={!rejectHypothesis} style={{ color: "black", backgroundColor: "#6eb05d" }}>Reject null hypothesis</div>
                    <Accordion>
                        <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                        ><Typography>Additional Interpretations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={"▼"}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography>More Results</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography> Test Statistic: {testSatistic}</Typography>
                            <Typography> P-Value: {pValue}</Typography>
                            <Typography hidden={rejectHypothesis}> Additional Days Needed: {daysNeeded}</Typography>
                            <Typography hidden={!rejectHypothesis}>No additional days needed</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>

            </div >
        </div>
    )
}