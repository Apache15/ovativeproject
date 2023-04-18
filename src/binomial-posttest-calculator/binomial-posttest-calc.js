import { TextField, InputAdornment, FormControl, Box, Tooltip, Slider, TableRow, Table, TableHead, TableCell, TableContainer, Paper } from "@mui/material";
import "./binomial-posttest-calc.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import norminv from 'norminv';
import testStatImg from './testStat.png'
import confIntervalImg from './confInterval.png'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function BinomialPostTestCalculator() {
    //const [isDetailed, setDetail] = useState(true);
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
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
    //const confIntLiftLow = confIntDiffLow / (formData.conControlInput / formData.trafficControlInput);
    //const confIntLiftHigh = confIntDiffHigh / (formData.conControlInput / formData.trafficControlInput);


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
            console.log(value);
            setData((previous) => {
                return { ...previous, [name]: parseInt(value, 10) }
            })
        }
    }
    return (
        <div className="bodyContainer">
            {/*
            <Button sx={{ mb: "15px" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
            */}
            <div className="container">
                <Box className="Input-form-box">
                    <div className="Form-title">Insert Numbers Here</div>
                    <FormControl>
                        <TextField
                            sx={{ m: 1 }}
                            className="numConversionsVariant"
                            variant="standard"
                            placeholder="50"
                            type="number"
                            name="conVarInput"
                            label={"Number of Conversions, Variant"}
                            InputLabelProps={{ shrink: true }}
                            onChange={inputChange}
                            onKeyPress={(event) => {
                                inputValid(event, /[0-9]/);
                            }}
                        >
                        </TextField>


                        <TextField
                            sx={{ m: 1, '& .MuiFormControlLabel-label': { fontSize: '50px' } }}
                            className="totalTrafficVariant"
                            variant="standard"
                            placeholder="1000"
                            type="number"
                            name="trafficVarInput"
                            label="Total Traffic, Variant"
                            onChange={inputChange}
                            onKeyPress={(event) => {
                                inputValid(event, /[0-9]/);
                            }}
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>


                        <TextField
                            sx={{ m: 1 }}
                            className="numberOfConversionsControl"
                            variant="standard"
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

                        <TextField
                            sx={{ m: 1 }}
                            className="totalTrafficControl"
                            variant="standard"
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
                        <Tooltip title={"Enter a value between 80-99. Typically, 95"} placement="left" >
                            <Typography color="grey"><InfoOutlinedIcon /> Number of Conversions, Variant</Typography>
                        </Tooltip>
                        <Slider
                            name="confidenceLevel"
                            aria-label="Confidence Level"
                            defaultValue={95}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={80}
                            max={99}
                            onChange={inputChange}
                        />

                    </FormControl>
                </Box>
                <Box className="Input-form-box">
                    <div className="Form-title">Conversion Rates</div>
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
                        type="number"
                        value={(conRateVar * 100).toPrecision(4)}
                        label="Conversion Rate, Variant"
                        InputLabelProps={{ shrink: true }}
                    >
                    </TextField>
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
                    <Tooltip title={<span ><div style={{ color: "white" }}>If Greater than Zero, Variant has higher conversion rate.</div> <div style={{ color: "white" }}>If Less than Zero, Control has higher conversion rate.</div></span>} placement="left">
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
                            label="Conversion Rate Difference"
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
                    <div hidden={rejectHypothesis} style={{ color: "black", backgroundColor: "#b05d5d" }}>No significant difference</div>
                    <div hidden={!rejectHypothesis} style={{ color: "black", backgroundColor: "#6eb05d" }}>Test is statistically significant</div>
                    <TableContainer>
                        <Table>
                            <TableRow><TableCell style={{ textAlign: "center" }} colSpan={2}><b><i>Checking Assumptions</i></b></TableCell></TableRow>
                            <TableRow><TableCell>Assumptions satisfied?</TableCell><TableCell>{String(conditionSatisfied).toUpperCase()}</TableCell></TableRow>
                        </Table>
                    </TableContainer>
                    <div></div>
                    <Accordion onChange={handleChange('panel1')} expanded={expanded === 'panel1'}>
                        <AccordionSummary
                            expandIcon={"▼"}
                            aria-controls="panel3a-content"
                            id="panel3a-header"

                        ><Typography>Additional Interpretations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography hidden={rejectHypothesis}>No significant difference.</Typography>
                            <Typography hidden={!rejectHypothesis}>{conRateDifference > 0 ? "The Variant performed significantly better than the Control" : "The Control performed significantly better than the Variant"}</Typography>
                            <Typography hidden={!rejectHypothesis}>{conRateDifference > 0 ? "We are " + (1 - (1 - (0.01 * +formData.confidenceLevel)) / 2) * 100 + "% confident that the Variant will perform " + (100 * confIntDiffLow).toPrecision(4) + "% to " + (100 * confIntDiffHigh).toPrecision(4) + "% better than the Control" : "We are " + (1 - (1 - (0.01 * +formData.confidenceLevel)) / 2) * 100 + "% confident that the Control will perform " + Math.abs(100 * confIntDiffLow).toPrecision(4) + "% to " + Math.abs(100 * confIntDiffHigh).toPrecision(4) + "% better than the Variant"}</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion onChange={handleChange('panel2')} expanded={expanded === 'panel2'}>
                        <AccordionSummary
                            expandIcon={"▼"}
                            aria-controls="panel3a-content"
                            id="panel3a-header"

                        >
                            <Typography>More Results</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography> Test Statistic: {testSatistic.toPrecision(4)}</Typography>
                            <Typography> P-Value: {pValue.toPrecision(4)}</Typography>
                            <Typography hidden={rejectHypothesis}> Additional Days Needed: {daysNeeded}</Typography>
                            <Typography hidden={!rejectHypothesis}>No additional days needed</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>

            </div >
            <div className="header">Binomial Post-test Education</div>
            <Box className="Line-box">
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header">
                        <div className="header">Testing Formulas</div>
                    </AccordionSummary>
                    <div>Formulas used to calculate test statistic and confidence interval on "Post-Test Calculator" Sheet</div>
                    <div style={{ display: "flex", padding: "20px", justifyContent: "space-between" }}>
                        <div>Test Statistic: </div>
                        <Tooltip title={
                            <React.Fragment>
                                {"Note: To keep the CI and test conclusion consistent, we used p̂"}<sub>v</sub>{" and p̂"}<sub>c</sub>{" to calculate the test statistic (not pooled conversion rate, p̂)"}
                            </React.Fragment>
                        }>
                            <img src={testStatImg} width="30%" height="auto" alt="test statistic equation" />
                        </Tooltip>
                        <InfoOutlinedIcon />
                        <div>Confidence Interval: </div>
                        <Tooltip title={
                            <React.Fragment>
                                {"Where, "}<i>Z</i><sub>1-α/2</sub> {"is a constant. For ex.,for a 95% CI "}<i>Z</i><sub>0.975</sub>{" = 1.96"}
                            </React.Fragment>
                        }>
                            <img src={confIntervalImg} width="30%" height="auto" alt="test statistic equation" />
                        </Tooltip>
                        <InfoOutlinedIcon />
                    </div>
                </Accordion>
            </Box>
            <Box className="Line-box">
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header">
                        <div className="header">Parameter Estimates Used for Testing Calculations</div></AccordionSummary>
                    <div>Useful estimates for calculating test statistic and confidence interval formulas above</div>
                    <TableContainer sx={{ height: "auto" }} component={Paper}>
                        <Table>
                            <TableRow >
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
                        </Table>
                    </TableContainer>
                </Accordion>
            </Box>
            <Box className="Line-box">
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header">
                        <div className="header">Validation of Testing Assumptions</div></AccordionSummary>
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
                    <div style={{ fontWeight: "bold", border: "2px solid black", marginBottom: "10px", padding: "10px" }}>Are all conditions satisfied? <span style={{ fontWeight: "normal", backgroundColor: conditionSatisfied ? "#6eb05d" : "#b05d5d" }}>{conditionSatisfied ? "True" : "False"}</span></div>
                </Accordion>
            </Box>
            <Box className="Line-box">
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header">
                        <div className="header">Formal Hypothesis Testing Steps</div></AccordionSummary>
                    <div style={{ border: "2px solid black", marginBottom: "10px", padding: "10px" }}>The following outlines the formal hypothesis steps to test for a significant difference in CVR between two groups</div>
                    <Box style={{ border: "2px solid black", marginBottom: "10px", padding: "10px" }}>
                        <div>First, <b><i>define the research question</i></b></div>
                        <div>Research Question: Are the conversion rates for the variant and control groups significantly different?</div>
                    </Box>
                    <TableContainer sx={{ height: "auto" }} component={Paper}>
                        <Table>
                            <TableCell style={{ fontSize: "20px" }} colSpan={2}><div style={{ textAlign: "center" }}>Next, <b><i>state the null and alternative hypothesis</i></b></div></TableCell>
                            <TableRow><TableCell colSpan={2}>In English, the null and alternative hypothesis are:</TableCell></TableRow>
                            <TableRow><TableCell>NULL HYPOTHESIS:{" (H"}<sub>0</sub>{")"}</TableCell><TableCell>The population conversion rates for the control group and the variant group are the same</TableCell></TableRow>
                            <TableRow><TableCell>ALTERNATIVE HYPOTHESIS:{" (H"}<sub>1</sub>{"or H"}<sub>A</sub>{")"}</TableCell><TableCell>The population conversion rates for the control group and the variant group are not the same</TableCell></TableRow>
                            <TableRow><TableCell>For the math, we define,</TableCell><TableCell>P<sub>v</sub> Population conversion rate for the variant group<div>P<sub>c</sub> Population conversion rate for the control group</div></TableCell></TableRow>
                        </Table>
                    </TableContainer>
                    <br></br>
                    <TableContainer>
                        <Table>
                            <TableRow><TableCell>So, a statistician would formally state the hypothesis test as follows,</TableCell><TableCell><div>H<sub>0</sub> : P<sub>v</sub> = P<sub>c</sub></div><div>H<sub>1</sub> : P<sub>v</sub> ≠ P<sub>c</sub></div></TableCell></TableRow>
                        </Table>
                    </TableContainer>
                    <TableContainer>
                        <Table>
                            <TableRow><TableCell style={{ textAlign: "center", fontSize: "20px" }}>Next, <b><i>calculate the test statistic and p-value</i></b></TableCell></TableRow>
                            <TableRow><TableCell>
                                <b>Calculate the test statistic, z</b>
                                <ul>
                                    <li>This is automatically calculated as "Test Statistic" in the calculator section</li>
                                    <li>The formula for z is defined above in the section "Testing Formulas"</li>
                                    <li>The values that were used for the formula for z are defined below in section "Parameter Estimates"</li>
                                </ul>
                                <div></div>
                                <b>Calculate the p-value</b>
                                <ul>
                                    <li>This is automatically calculated as "P-value" on "Testing Calculator" Sheet </li>
                                    <li> P-value can be thought of as:</li>
                                    <ul><li>"How unlikely is this event if we assume that the conversion rates are the same. Unlikely enough (small enough p-value) to conclude that the rates are probably different?"</li></ul>
                                    <li>We use a general rule-of-thumb that "unlikely enough" is defined as a p-value that is less than 0.05 (or α)</li>
                                </ul>
                            </TableCell></TableRow>
                        </Table>
                    </TableContainer>
                    <TableContainer>
                        <Table>
                            <TableRow><TableCell style={{ textAlign: "center", fontSize: "20px" }} colSpan={3}>Lastly, make <b><i>a conclusion</i></b> based on the p-value</TableCell></TableRow>
                            <TableRow><TableCell>P-Value {"< α"}</TableCell><TableCell>We reject the null hypothesis</TableCell><TableCell>There is a statistically significant evidence that the conversion rates in the control and variant are different</TableCell></TableRow>
                            <TableRow><Tooltip title={"Note: Typically alpha(α) = 0.05, or equivalently, the CI level is 95%"}><TableCell>P-Value {"≥ α"}</TableCell></Tooltip><TableCell>We fail to reject the null hypothesis</TableCell><TableCell>The test is inconclusive</TableCell></TableRow>
                        </Table>
                    </TableContainer>
                </Accordion>
            </Box>
        </div>
    )
}