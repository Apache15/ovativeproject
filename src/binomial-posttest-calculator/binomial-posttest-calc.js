import { TextField, InputAdornment, FormControl, Box, Tooltip, Button, TableRow, Table, TableHead, TableCell, TableContainer, Paper } from "@mui/material";
import "./binomial-posttest-calc.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import Slide from '@mui/material/Slide';
import norminv from 'norminv';
import testStatImg from './testStat.png'
import confIntervalImg from './confInterval.png'
import paper from '@mui/material/Paper'
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
                return { ...previous, [name]: parseInt(value, 10) }
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
            <Box>
                <div className="header">Binomial Post-test Education</div>
                <div>Test Statistic: </div>
                <Tooltip title={
                    <React.Fragment>
                        {"Note: To keep the CI and test conclusion consistent, we used p̂"}<sub>v</sub>{" and p̂"}<sub>c</sub>{" to calculate the test statistic (not pooled conversion rate, p̂)"}
                    </React.Fragment>
                }>
                    <img src={testStatImg} width="30%" height="auto" alt="test statistic equation" />
                </Tooltip>
            </Box>
            <Box>
                <div>Confidence Interval: </div>
                <Tooltip title={
                    <React.Fragment>
                        {"Where, "}<i>Z</i><sub>1-α/2</sub> {"is a constant. For ex.,for a 95% CI "}<i>Z</i><sub>0.975</sub>{" = 1.96"}
                    </React.Fragment>
                }>
                    <img src={confIntervalImg} width="30%" height="auto" alt="test statistic equation" />
                </Tooltip>
            </Box>
            <Box>
                <TableContainer sx={{ height: "auto" }} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Parameter Estimates</TableCell>
                                <TableCell>Notation</TableCell>
                                <TableCell>Value</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Traffic, Variant</TableCell>
                                <TableCell>n<sub>v</sub></TableCell>
                                <TableCell>{formData.trafficVarInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Traffic, Control</TableCell>
                                <TableCell>n<sub>c</sub></TableCell>
                                <TableCell>{formData.trafficControlInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Number of Conversions, Variant</TableCell>
                                <TableCell>y<sub>v</sub></TableCell>
                                <TableCell>{formData.conVarInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Number of Conversions, Control</TableCell>
                                <TableCell>y<sub>c</sub></TableCell>
                                <TableCell>{formData.conControlInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Traffic, Control</TableCell>
                                <TableCell>n<sub>v</sub></TableCell>
                                <TableCell>{formData.trafficControlInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Estimate of Conversion Rate Variant</TableCell>
                                <TableCell>p̂<sub>v</sub></TableCell>
                                <TableCell>{formData.conVarInput / formData.trafficVarInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Estimate of Conversion Rate Control</TableCell>
                                <TableCell>p̂<sub>c</sub></TableCell>
                                <TableCell>{formData.conControlInput / formData.trafficControlInput}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Estimate of Pooled Conversion Rate</TableCell>
                                <TableCell>p̂</TableCell>
                                <TableCell>{pooledConversionRate.toPrecision(4)}</TableCell>
                            </TableRow>
                            <TableCell>Lift, Observed</TableCell>
                            <TableCell><i>lift</i></TableCell>
                            <TableCell>{liftEstimate.toPrecision(4)}</TableCell>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
            <Box>
                <div className="header">Validation of Testing Assumptions</div>
                <div style={{ textAlign: "center" }}>The results of the "Post-Test Calculator" can only be used when the following three conditions are satisfied</div>
                <ol>
                    <li>
                        Independence within groups
                    </li>
                    <ul><li>Answer intuitively. Could conversions be influenced by each other within the variant group? What about the control? </li></ul>
                    <li>Independence between groups</li>
                    <ul><li>Answer intuitively. Could conversions in the control group influence conversions in the variant group?</li></ul>
                    <li>Normality</li>
                    <ul><li>We will use a general rule of thumb, that we need at least 10 expected and observed conversions and 10 expected and observed non-conversions in each of the two groups (Calculated below)</li></ul>
                </ol>
            </Box>
            <Box>
                <TableContainer sx={{ height: "auto" }} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Condition to Satisfy</TableCell>
                                <TableCell>Equation to Satisfy</TableCell>
                                <TableCell>Satisfied?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in variant group must be greater or equal to 10</TableCell>
                            <TableCell>y<sub>v</sub> ≥ 10</TableCell>
                            <TableCell>{(formData.conVarInput > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in control group must be greater or equal to 10</TableCell>
                            <TableCell>y<sub>c</sub> ≥ 10</TableCell>
                            <TableCell>{(formData.conControlInput > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in variant group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>v</sub> - y<sub>v</sub> ≥ 10</TableCell>
                            <TableCell>{(formData.trafficVarInput - formData.conVarInput > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in control group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>c</sub> - y<sub>c</sub> ≥ 10</TableCell>
                            <TableCell>{(formData.trafficControlInput - formData.conControlInput > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Expected</i> number of conversions in variant group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>v</sub>p̂ ≥ 10</TableCell>
                            <TableCell>{(formData.trafficVarInput * pooledConversionRate > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in control group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>c</sub>p̂ ≥ 10</TableCell>
                            <TableCell>{(formData.trafficControlInput * pooledConversionRate > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in variant group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>v</sub>{"(1 -p̂) ≥ 10"}</TableCell>
                            <TableCell>{((formData.trafficVarInput * (1 - pooledConversionRate)) > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><i>Observed</i> number of conversions in control group must be greater or equal to 10</TableCell>
                            <TableCell>n<sub>c</sub>{"(1 -p̂) ≥ 10"}</TableCell>
                            <TableCell>{((formData.trafficControlInput * (1 - pooledConversionRate)) > 9) ? "True" : "False"}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
                <div style={{fontWeight:"bold"}}>Are all conditions satisfied? <span style={{fontWeight:"normal", backgroundColor: conditionSatisfied? "#6eb05d":"#b05d5d"} }>{conditionSatisfied? "True":"False"}</span></div>
            </Box>
        </div>
    )
}