import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip, Typography, Slider } from '@mui/material'
import React, { useState } from "react";
import jstat from 'jstat';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ContinousFormulas from './continous-posttest-formulas';


export default function ContPostTest() {

    const [isDetailed, setDetail] = useState(true); //toggle tooltip state
    const [conclusion, setConclusion] = useState(""); //Reject or failed to reject string state
    const [daysNeeded, setDaysNeeded] = useState();

    const [inputs, setInputs] = useState({ //input states
        avgRevVar: 0,
        avgRevCtrl: 0,
        stdDevVar: 0,
        stdDevCtrl: 0,
        sampleSizeVar: 0,
        sampleSizeCtrl: 0,
        confidenceLvl: 80,
        testDuration: 0
    })

    //average revenue difference calculation
    const avgRevDif = (+inputs.avgRevVar - +inputs.avgRevCtrl).toFixed(2);

    //Get input from textboxes
    const handleInputChange = (e) => {
        if (!isNaN(e.target.value)) {
            const { name, value } = e.target;
            setInputs((prev) => {
                return { ...prev, [name]: parseInt(value, 10) };
            });
        }
        // console.log(1-(1-(((.01*++inputs.confidenceLvl)/2))))
        console.log(calcDays())
        if (conclusion === "Statistically significant" || conclusion === "There is evidence the revenues of the 2 groups is different") {
            setDaysNeeded(0);
        }
        else {
            setDaysNeeded(calcDays());
        }
    };

    //check for whole numbers
    function inputValid(event, regex) {
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    }

    //Set the conclusion text based on the our calculated values and level of detail
    const doConclusion = () => {
        if (+pVal <= (1 - (+inputs.confidenceLvl / 100)) && isDetailed === true) {
            setConclusion("Statistically significant");
        }
        else if (+pVal > (1 - (+inputs.confidenceLvl / 100)) && isDetailed === true) {
            setConclusion("Not statistically significant");
        }
        else if (+pVal <= (1 - (+inputs.confidenceLvl / 100)) && isDetailed === false) {
            setConclusion("There is evidence the revenues of the 2 groups is different");
        }
        else {
            setConclusion("not enough evidence that the revenues of both groups are different");
        }
    }


    //margin of error used in the calculations of the confidence intervals
    function marginOfError() { //used in the calculation of the confidence interval
        const tScore = jstat.studentt.inv(1 - (1 - +inputs.confidenceLvl / 100) / 2, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2))
        const standardError = (calcSP() * Math.sqrt((1 / +inputs.sampleSizeCtrl) + (1 / +inputs.sampleSizeVar)))
        return (+tScore * +standardError);
    }

    //Calculates the number of additional days needed for testing
    function calcDays() {
        const p = (1 - (1 - (((.01 * + +inputs.confidenceLvl) / 2)))) //error possibly here
        const part1 = Math.pow(+inputs.sampleSizeCtrl / +inputs.sampleSizeVar, -1);
        const part2 = (calcSP() * ((jstat.normal.inv(+p, 0, 1)) + jstat.normal.inv(.8, 0, 1)) / +avgRevDif) //I think error is here
        const part3 = (+lift / +inputs.testDuration) //percentage conversion for lift may cause and issue
        return (Math.ceil((1 + (+part1 * +part2)) / +part3) - +inputs.testDuration)
    }

    //confidence interval calculations
    const confidenceIntevalUpper = +avgRevDif + marginOfError();
    const confidenceIntevalLower = +avgRevDif - marginOfError();

    //Test statistic calculations
    const denominatorTS = (calcSP() * Math.sqrt(((1 / +inputs.sampleSizeCtrl) + (1 / +inputs.sampleSizeVar))));
    const testStat = (+avgRevDif / +denominatorTS).toFixed(3);

    //calculate the pooled standard deviation
    function calcSP() {
        var bottom = (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2); //These are bad names I know, they refer to the denominator and both parts of the numerator
        var topLeft = (+inputs.sampleSizeVar - 1) * Math.pow(+inputs.stdDevVar, 2);
        var topRight = ((+inputs.sampleSizeCtrl - 1) * Math.pow(+inputs.stdDevCtrl, 2));
        var SP = (Math.sqrt((topRight + topLeft) / bottom));
        return SP;
    }

    //checks to see if they confidencelvl input is between 80 and 99.9
    function checkCLValid(input) {
        if (+input < 80 || +input > 99.9) {
            return true;
        }
        else {
            return false;
        }
    }

    //p value calculation using the jstat library https://jstat.github.io/distributions.html#jStat.studentt.pdf
    const pVal = jstat.studentt.pdf(+testStat, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2), 2).toFixed(2);

    //observed lift calculation
    const lift = ((+avgRevDif / +inputs.avgRevCtrl) * 100).toFixed(2)

    //confidence interval for lift
    const liftConfidenceIntervalUp = ((+avgRevDif + marginOfError()) / +inputs.avgRevCtrl) * 100;
    const lifConfidenceIntevalLow = ((+avgRevDif - marginOfError()) / +inputs.avgRevCtrl) * 100;

    const reject = (+pVal <= (1 - (+inputs.confidenceLvl / 100)));

    return (
        <>
            <Container maxWidth="xl" sx={{ paddingBottom: "4ch" }}>
                <Button sx={{ ml: "7vh", mt: "1vh", mb: "1vh", width: "12vw" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltip Detail</Button>
                <div className="container">
                    <Box className='Input-form-box' boxShadow='-2px 3px 3px'>
                        <div className="Form-title">Insert Numbers Here</div>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? "The average reveanue for the group tested" : ""} placement="left" >
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
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Suggested value range is 80% - 95%" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Something" : ""} placement="left" >
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    className="testDuration-input"
                                    variant="standard"
                                    required={true}
                                    placeholder="5"
                                    type="number"
                                    color='primary'
                                    label="Test duration in days"
                                    name='testDuration-input'
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        inputValid(e, /[0-9]/);
                                    }}
                                />
                            </Tooltip>

                        </FormControl>
                    </Box>
                    <Box className='Input-form-box' boxShadow='0px 3px 3px'>
                        <div className="Form-title">Outputs</div>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? "The difference between the averages of the variant versus control group" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Shows how closely your observed data match the distribution expected under the null hypothesis." : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "The probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true." : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "How confident we are that the revenue difference is in this interval" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Percent increase or decrease in metric for users who received a variant versus a control group" : ""} placement="left">
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
                                title={isDetailed === true ? "We " + inputs.confidenceLvl + "% are confident that the true revenue lift is within the interval" : ""} placement="left">
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
                            <Tooltip title={isDetailed === true ? "Days needed for more testing, no days needed if the test is statistically significant" : ""} placement="left">
                                <TextField sx={{ m: "1ch", input: { color: 'black' }, label: { color: 'black' } }}
                                    variant="filled"
                                    className='Additional-Days-out'
                                    id="outlined"
                                    label={"Additional days needed"}
                                    inputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    value={+daysNeeded}
                                >
                                </TextField>
                            </Tooltip>
                        </FormControl>
                    </Box>
                    <Box className='Input-form-box' boxShadow='2px 3px 3px'>
                        <div hidden={reject} style={{ color: "black", backgroundColor: "#b05d5d" }}>Test inconclusive </div>
                        <div hidden={!reject} style={{ color: "black", backgroundColor: "#6eb05d" }}>Is statistically significant</div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={"▼"}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>Additional Interpretations</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography hidden={!reject && (+avgRevDif >= 0)}>The variant group performed significantly better than the control group</Typography>
                                <Typography hidden={!reject && (+avgRevDif < 0)}>The control group performed significantly better than the variant group</Typography>
                                <Typography hidden={reject}>The test was inconclusive there is no evidence one group outperformed the other</Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </div>
                <ContinousFormulas />
            </Container>
        </>
    )
}

