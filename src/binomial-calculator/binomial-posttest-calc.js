import { TextField, InputAdornment, FormControl, Box, Tooltip, Button } from "@mui/material";
import "./binomial-posttest-calc.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";


export default function BinomialPostTestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    const [formData, setData] = useState({
        conVarInput: 0,
        trafficVarInput: 0,
        conControlInput: 0,
        trafficControlInput: 0,
    })
    //function to calculate normal dist.
    function ncdf(x, mean, std) {
        x = (x - mean) / std
        var t = 1 / (1 + .2315419 * Math.abs(x))
        var d =.3989423 * Math.exp( -x * x / 2)
        var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
        if( x > 0 ) prob = 1 - prob
        return prob
      }
    //calculations
    const conRateVar = formData.conVarInput / formData.trafficVarInput;
    const conRateControl = formData.conControlInput / formData.trafficControlInput;
    const conRateDifference = conRateVar - conRateControl;
    const pooledConversionRate = (+formData.conVarInput + +formData.conControlInput) / (+formData.trafficControlInput + +formData.trafficVarInput);
    const liftEstimate = (conRateDifference / conRateControl);
    const testSatistic = conRateDifference / Math.sqrt(((conRateVar * (1 - conRateVar)) / formData.trafficVarInput) + ((conRateControl * (1 - conRateControl)) / formData.trafficControlInput));
    const pValue = 2*(1-ncdf(Math.abs(testSatistic), 0, 1));


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

    const inputChange = (input) => {
        if (!isNaN(input.target.value)) {
            const name = input.target.name;
            const value = input.target.value;
            setData((previous) => {
                return { ...previous, [name]: value }
            })
        }
    }
    return (
        <>
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
                            >
                            </TextField>
                        </Tooltip>
                    </FormControl>
                </Box>
                <Box className="Input-form-box">
                    <div className="Form-title">Conversion Rates</div>
                    <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                    </Tooltip>
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
                            value={(conRateDifference * 100).toPrecision(4)}
                            type="number"
                            label="Conversion Rate Diffference"
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
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
                            value={(liftEstimate * 100).toPrecision(4)}
                            type="number"
                            label="Conversion Rate Diffference"
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
                </Box>
                <Box className="Input-form-box">
                    <div style={{ color: "black" }}>{conditionSatisfied.toString().toUpperCase()}</div>
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
                            <Typography> Results 3</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>

            </div >
        </>
    )
}