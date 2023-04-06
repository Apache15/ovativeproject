import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip, Typography } from '@mui/material'
import React, { useState } from "react";
import jstat from 'jstat';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';


export default function ContPostTest() {

    const [isDetailed, setDetail] = useState(true); //toggle tooltip state
    const [conclusion, setConclusion] = useState(""); //Reject or failed to reject string state
    const [daysNeeded, setDaysNeeded] = useState();

    const [inputs, setInputs] = useState({ //input states
        avgRevVar: Number,
        avgRevCtrl: Number,
        stdDevVar: Number,
        stdDevCtrl: Number,
        sampleSizeVar: Number,
        sampleSizeCtrl: Number,
        confidenceLvl: Number,
        testDuration: Number
    })

    //average revenue difference calculation
    const avgRevDif = (+inputs.avgRevVar - +inputs.avgRevCtrl).toFixed(2);

    //Get input from textboxes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => {
            return { ...prev, [name]: value };
        });
        // console.log(1-(1-(((.01*++inputs.confidenceLvl)/2))))
        console.log(calcDays())
        if (+pVal <= (1 - (+inputs.confidenceLvl / 100))) {
            setConclusion("Reject");
        }
        else {
            setConclusion("Failed to Reject");
        }
        if (conclusion === "Reject") {
            setDaysNeeded(0);
        }
        else {
            setDaysNeeded(calcDays());
        }
    };

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

    //p value calculation using the jstat library https://jstat.github.io/distributions.html#jStat.studentt.pdf
    const pVal = jstat.studentt.pdf(+testStat, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2), 2).toFixed(2);

    //observed lift calculation
    const lift = ((+avgRevDif / +inputs.avgRevCtrl) * 100).toFixed(2)

    //confidence interval for lift
    const liftConfidenceIntervalUp = ((+avgRevDif + marginOfError()) / +inputs.avgRevCtrl) * 100;
    const lifConfidenceIntevalLow = ((+avgRevDif - marginOfError()) / +inputs.avgRevCtrl) * 100;

    return (
        <>
            <Container maxWidth="lg" sx={{ display: "flex", padding: "50px", flexDirection: "column" }}>
                <Button sx={{ ml: "50px", mt: "50px", mb: "1vh" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
                <Container className='InOut-Container' border={"Solid"} sx={{ display: "inline-flex" }}>
                    <Box className='input' label="inputs" width="50%" p={'2ch'} sx={{ m: '2ch', border: 'solid black', borderRadius: '10px' }}>
                        <FormControl>
                            <Box className='input-col-1'>
                                <Tooltip title={isDetailed === true ? "Something" : ""} placement="left" >
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Avg-Rev-Var"
                                        variant="standard"
                                        required={true}
                                        placeholder="32666"
                                        type="number"
                                        color='primary'
                                        label="Average Revenue, Variant"
                                        name='avgRevVar'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Avg-Rev-Ctrl"
                                        variant="standard"
                                        required={true}
                                        placeholder="32000"
                                        type="number"
                                        label="Average Revenue, Control"
                                        name='avgRevCtrl'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Std-Dev-Var"
                                        variant="standard"
                                        required={true}
                                        placeholder="80000"
                                        type="number"
                                        label="Standard Deviation, Variant"
                                        name='stdDevVar'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Std-Dev-Ctrl"
                                        variant="standard"
                                        required={true}
                                        placeholder="80000"
                                        type="number"
                                        label="Standard Deviation, Control"
                                        name='stdDevCtrl'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                            </Box>
                            <Box className='input-col-2'>
                                <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Sample-Size-Var"
                                        variant="standard"
                                        required={true}
                                        placeholder="100000"
                                        type="number"
                                        label="Sample Size, Variant"
                                        name='sampleSizeVar'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Sample-Size-Ctrl"
                                        variant="standard"
                                        required={true}
                                        placeholder="100000"
                                        type="number"
                                        label="Sample Size, Control"
                                        name='sampleSizeCtrl'
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Suggested value range is 80% - 95%" : ""} placement="left">
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
                                        className="Confidence-Lvl"
                                        variant="standard"
                                        required={true}
                                        placeholder="80"
                                        type="number"
                                        label="Confidence Level"
                                        name='confidenceLvl'
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Something" : ""} placement="left" >
                                    <TextField sx={{ m: 1, width: '12ch', input: { color: 'black' }, label: { color: 'black' } }}
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
                                    />
                                </Tooltip>
                            </Box>
                        </FormControl>
                    </Box>
                    <Box className='outputs' width="50%" sx={{ m: '2ch', border: "solid black", borderRadius: "10px" }}>
                        <FormControl>
                            <Box className='col 1'>
                                <Tooltip title={isDetailed === true ? "We reject if there is statistically significant evidence that the revenue of" +
                                    " the variant group is different than the control" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='test-result-Out'
                                        id="outlined-disabled"
                                        label="Test conclusion"
                                        InputLabelProps={{ shrink: true }}
                                        value={conclusion}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "The difference between the averages of the variant versus control group" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='Avg-Rev-Out'
                                        id="outlined-disabled"
                                        label="Average Revanue Difference"
                                        InputLabelProps={{ shrink: true }}
                                        value={avgRevDif}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Shows how closely your observed data match the distribution expected under the null hypothesis." +
                                    "It is used to calculate the p-value." : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='Test-Stat-Out'
                                        id="outlined-disabled"
                                        label="Test statistic"
                                        InputLabelProps={{ shrink: true }}
                                        value={testStat}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "The probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true." : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='P-Value-out'
                                        id="outlined-disabled"
                                        label="P-value"
                                        InputLabelProps={{ shrink: true }}
                                        value={pVal}
                                    >
                                    </TextField>
                                </Tooltip>
                            </Box>
                            <Box className='col 2'>
                                <Tooltip title={isDetailed === true ? "How confident we are that the revenue difference is in this interval" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='Confidence-Interval-Out'
                                        id="outlined-disabled"
                                        label={inputs.confidenceLvl + "% Confidence Interval"}
                                        // defaultValue="(??, ??)"
                                        value={"(" + confidenceIntevalLower.toFixed(2) + ", " + confidenceIntevalUpper.toFixed(2) + ")"}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Percent increase or decrease in metric for users who received a variant versus a control group" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='lift-out'
                                        id="outlined-disabled"
                                        label={"Observed Lift"}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        value={lift}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip
                                    title={isDetailed === true ? "We " + inputs.confidenceLvl + "% are confident that the true revenue lift is within the interval" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='Lift-Confidence-Interval-Out'
                                        id="outlined-disabled"
                                        label={inputs.confidenceLvl + "% Confidence Interval, lift"}
                                        InputLabelProps={{ shrink: true }}
                                        value={"(" + lifConfidenceIntevalLow.toFixed(2) + ", " + liftConfidenceIntervalUp.toFixed(2) + ")"}
                                    >
                                    </TextField>
                                </Tooltip>
                                <Tooltip title={isDetailed === true ? "Days needed for more testing, no days needed if the test is statistically significant" : ""} placement="left">
                                    <TextField sx={{ m: "1ch", width: '13ch' }}
                                        disabled
                                        className='Additional-Days-out'
                                        id="outlined-disabled"
                                        label={"Additional days needed"}
                                        InputLabelProps={{ shrink: true }}
                                        value={+daysNeeded}
                                    >
                                    </TextField>
                                </Tooltip>
                            </Box>
                        </FormControl>
                    </Box>
                </Container>
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <Typography>Education</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography> Formula</Typography>
                        <Typography> Formula</Typography>
                        <Typography> Formula</Typography>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </>
    )
}

