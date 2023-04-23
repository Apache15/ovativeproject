import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip, Typography, Slider, Table, TableRow, TableCell, TableContainer } from '@mui/material'
import React, { useState } from "react";
import jstat from 'jstat';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ContinousFormulas from './continous-posttest-formulas';
import ContinuousDefinitions from '../continuous-definitions/continuousDefinitions';
import norminv from 'norminv';


export default function ContPostTest() {

    const [isDetailed, setDetail] = useState(true); //toggle tooltip state

    const [inputs, setInputs] = useState({ //input states
        avgRevVar: 0,
        avgRevCtrl: 0,
        stdDevVar: 0,
        stdDevCtrl: 0,
        sampleSizeVar: 0,
        sampleSizeCtrl: 0,
        confidenceLvl: 95,
        testDuration: 0
    })

    //average revenue difference calculation
    const avgRevDif = (+inputs.avgRevVar - +inputs.avgRevCtrl).toFixed(2);

    

    //check for whole numbers
    function inputValid(event, regex) {
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    }

    const conditionSatisfied = (
        inputs.sampleSizeVar >= 30 &&
        inputs.sampleSizeCtrl >= 30 &&
        ((Math.max(inputs.stdDevVar, inputs.stdDevCtrl)/Math.min(inputs.avgRevVar, inputs.sampleSizeCtrl)) < 3)
    )

        //observed lift calculation
        const lift = ((+avgRevDif / +inputs.avgRevCtrl) * 100).toFixed(2)

    //Pooled Standard Deviation
    const SP = (Math.sqrt(((+inputs.sampleSizeVar - 1) * Math.pow(+inputs.stdDevVar, 2) + ((+inputs.sampleSizeCtrl - 1) * Math.pow(+inputs.stdDevCtrl, 2))) / (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2)));


    //margin of error used in the calculations of the confidence intervals
    function marginOfError() { //used in the calculation of the confidence interval
        const tScore = jstat.studentt.inv(1 - (1 - +inputs.confidenceLvl / 100) / 2, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2))
        const standardError = (SP * Math.sqrt((1 / +inputs.sampleSizeCtrl) + (1 / +inputs.sampleSizeVar)))
        return (+tScore * +standardError);
    }

    //Calculates the number of additional days needed for testing
    const daysNeeded = (Math.ceil(((1 + Math.pow((+inputs.sampleSizeCtrl/+inputs.sampleSizeVar),-1))*(Math.pow((SP * ( (norminv((1 - ((1-(0.01* +inputs.confidenceLvl))/2)), 0, 1) + norminv(0.8, 0, 1))  / +avgRevDif  )),2 ))) / (+inputs.sampleSizeVar / +inputs.testDuration)) - +inputs.testDuration);

    //confidence interval calculations
    const confidenceIntevalUpper = +avgRevDif + marginOfError();
    const confidenceIntevalLower = +avgRevDif - marginOfError();

    //Test statistic calculations
    const denominatorTS = (SP * Math.sqrt(((1 / +inputs.sampleSizeCtrl) + (1 / +inputs.sampleSizeVar))));
    const testStat = (+avgRevDif / +denominatorTS).toFixed(3);

    //p value calculation using the jstat library https://jstat.github.io/distributions.html#jStat.studentt.pdf
    const pVal = jstat.studentt.pdf(+testStat, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2), 2).toFixed(2);

    //confidence interval for lift
    const liftConfidenceIntervalUp = ((+avgRevDif + marginOfError()) / +inputs.avgRevCtrl) * 100;
    const lifConfidenceIntevalLow = ((+avgRevDif - marginOfError()) / +inputs.avgRevCtrl) * 100;

    const reject = (pVal <= (1 - (+inputs.confidenceLvl / 100)));

    //Get input from textboxes
    const handleInputChange = (e) => {
        if (!isNaN(e.target.value)) {
            const { name, value } = e.target;
            setInputs((prev) => {
                return { ...prev, [name]: parseInt(value, 10) };
            });
        }
    };

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingBottom: "4ch" }}>
                {/* <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltip Detail</Button> */}
                <div className="container">
                    <Box className='Input-form-box'>
                        <div className="Form-title">Insert Numbers Here</div>
                        <FormControl>
                            <Tooltip title={"The average revenue for the group tested"} placement="left" >
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Avg-Rev-Var"
                                    variant="standard"
                                    required={true}
                                    placeholder="32666"
                                    type="number"
                                    label="Average Revenue, Variant"
                                    name='avgRevVar'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9, .]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={"The average revenue for the group being compared"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Avg-Rev-Ctrl"
                                    variant="standard"
                                    required={true}
                                    placeholder="32000"
                                    type="number"
                                    label="Average Revenue, Control"
                                    name='avgRevCtrl'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={"The dispersion of the data compared to the mean for the variant group"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Std-Dev-Var"
                                    variant="standard"
                                    required={true}
                                    placeholder="80000"
                                    type="number"
                                    label="Standard Deviation, Variant"
                                    name='stdDevVar'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={"The dispersion of the data compared to the mean for the control group"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Std-Dev-Ctrl"
                                    variant="standard"
                                    required={true}
                                    placeholder="80000"
                                    type="number"
                                    label="Standard Deviation, Control"
                                    name='stdDevCtrl'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={"The number of people exposed to the variant test"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Sample-Size-Var"
                                    variant="standard"
                                    required={true}
                                    placeholder="100000"
                                    type="number"
                                    label="Sample Size, Variant"
                                    name='sampleSizeVar'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={"The number of people exposed to the control test"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="Sample-Size-Ctrl"
                                    variant="standard"
                                    required={true}
                                    placeholder="100000"
                                    type="number"
                                    label="Sample Size, Control"
                                    name='sampleSizeCtrl'
                                    InputLabelProps={{ shrink: true }}
                                    defaultValue={""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Typography>Confidence Level</Typography>
                            <Tooltip title={"Used in the confidence interval to choose how confident we are that our data is within a specific range"} placement="left">
                                <Slider
                                    name="confidenceLvl"
                                    aria-label="Confidence Level"
                                    defaultValue={95}
                                    valueLabelDisplay="auto"
                                    label='Confidence Level'
                                    step={1}
                                    marks
                                    min={80}
                                    max={99}
                                    onChange={handleInputChange}
                                />
                            </Tooltip>
                            <Tooltip title={"The number of days the test was offered for"} placement="left" >
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="testDuration"
                                    variant="standard"
                                    required={true}
                                    placeholder="5"
                                    type="number"
                                    color='primary'
                                    label="Test duration in days"
                                    name='testDuration'
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>

                        </FormControl>
                    </Box>
                    <Box className='Input-form-box' justifyContent={'start'}>
                        <div className="Form-title">Outputs</div>
                        <FormControl>
                            <Tooltip title={"The difference between the averages of the variant versus control group"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='Avg-Rev-Out'
                                    id="outlined"
                                    label="Average Revanue Difference"
                                    inputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    value={avgRevDif}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={"Shows how closely your observed data match the distribution expected under the null hypothesis."} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='Test-Stat-Out'
                                    id="outlined"
                                    label="Test statistic"
                                    InputLabelProps={{ shrink: true }}
                                    value={testStat}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={"The probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true."} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='P-Value-out'
                                    id="outlined"
                                    label="P-value"
                                    inputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    value={pVal}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={"How confident we are that the revenue difference is in this interval"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant='filled'
                                    className='Confidence-Interval-Out'
                                    id="outlined"
                                    inputProps={{ readOnly: true }}
                                    label={"Confidence Interval"}
                                    value={"(" + confidenceIntevalLower.toFixed(2) + ", " + confidenceIntevalUpper.toFixed(2) + ")"}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={"Percent increase or decrease in metric for users who received a variant versus a control group"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='lift-out'
                                    id="outlined"
                                    label={"Observed Lift"}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        readOnly: true,
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    value={lift}
                                >
                                </TextField>
                            </Tooltip>
                            <Tooltip
                                title={"We " + inputs.confidenceLvl + "% are confident that the true revenue lift is within the interval"} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='Lift-Confidence-Interval-Out'
                                    id="outlined"
                                    label={"Confidence Interval, lift"}
                                    inputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    value={"(" + lifConfidenceIntevalLow.toFixed(2) + ", " + liftConfidenceIntervalUp.toFixed(2) + ")"}
                                >
                                </TextField>
                            </Tooltip>
                        </FormControl>
                    </Box>
                    <Box className='Input-form-box'>
                        <div hidden={reject} style={{ color: "black", backgroundColor: "#b05d5d", fontWeight: 'bold' }}>Test inconclusive </div>
                        <div hidden={!reject} style={{ color: "black", backgroundColor: "#6eb05d", fontWeight: 'bold'}}>Is statistically significant</div>
                        <TableContainer>
                        <Table>
                            <TableRow><TableCell style={{ textAlign: "center" }} colSpan={2}><b><i>Checking Assumptions</i></b></TableCell></TableRow>
                            <TableRow><TableCell>Assumptions satisfied?</TableCell><TableCell>{String(conditionSatisfied).toUpperCase()}</TableCell></TableRow>
                        </Table>
                    </TableContainer>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={"▼"}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>Additional Interpretations</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography hidden={!reject}>{avgRevDif > 0 ? "The variant group performed significantly better than the control group" : "The Control performed significantly better than the Variant"}</Typography>
                                <Typography hidden={!reject}>{avgRevDif > 0 ? "We are " + +inputs.confidenceLvl + "% confident that the Variant will perform $" + (confidenceIntevalLower).toPrecision(4) +  " to $" + (confidenceIntevalUpper).toPrecision(4) + " better than the Control":
                                "We are " + +inputs.confidenceLvl + "% confident that the Control will perform $" + (confidenceIntevalLower).toPrecision(4) + " to $" + (confidenceIntevalUpper).toPrecision(4) + " better than the Variant"}
                                </Typography>
                                <Typography hidden={reject}>The test was inconclusive there is no evidence one group outperformed the other</Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={"▼"}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>More Results</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography hidden={!reject}>No additional days needed</Typography>
                            <Typography hidden={reject}> Additional Days Needed: {daysNeeded}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </div>
                <ContinousFormulas params={inputs} pooledstd={SP} satisfied={conditionSatisfied}/>
                <ContinuousDefinitions/>
            </Container>
        </>
    )
}

