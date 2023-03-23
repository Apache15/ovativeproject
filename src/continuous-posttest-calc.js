import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip} from '@mui/material'
import React, { useState } from "react";
import jstat from 'jstat';



export default function ContPostTest() {

    // var ttest = require('ttest');


    const [isDetailed, setDetail] = useState(true);
    const [conclusion, setConclusion] = useState("");
    const [inputs, setInputs] = useState({
        avgRevVar: Number,
        avgRevCtrl: Number,
        stdDevVar: Number,
        stdDevCtrl: Number,
        sampleSizeVar: Number,
        sampleSizeCtrl: Number,
        confidenceLvl: Number,
        testDuration:Number
    })

    // const stat = ttest(
    //     {mean: inputs.avgRevCtrl, variance: Math.pow(inputs.stdDevCtrl, 2), size: inputs.sampleSizeCtrl},
    //     {mean: inputs.avgRevVar, variance: Math.pow(inputs.stdDevVar, 2), size: inputs.sampleSizeVar},
    //     {mu:-1, alpha:(1-(1-inputs.confidenceLvl/100)/2)}
    // )

    const avgRevDif = (+inputs.avgRevVar-+inputs.avgRevCtrl).toFixed(2);

    //Get input from textboxes
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setInputs((prev) => {
            return {...prev, [name]: value};
        });
        if(+pVal <= (1-(+inputs.confidenceLvl/100)))
            setConclusion("Reject");
        else 
            setConclusion("Failed to Reject")
        // console.log(stat.pValue())
    };

    function marginOfError(){ //used in the calculation of the confidence interval
        const tScore = jstat.studentt.inv(1- (1- +inputs.confidenceLvl/100 )/2, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar -2))
        const standardError = (calcSP() * Math.sqrt((1/+inputs.sampleSizeCtrl) + (1/+inputs.sampleSizeVar)))
        return (+tScore * +standardError);
    }

    const confidenceIntevalUpper = +avgRevDif + marginOfError();
    const confidenceIntevalLower = +avgRevDif - marginOfError();

    //Test statistic calculations
    const denominatorTS = (calcSP() * Math.sqrt(((1/+inputs.sampleSizeCtrl)+(1/+inputs.sampleSizeVar))));
    const testStat = (+avgRevDif/+denominatorTS).toFixed(3);

    //calculate the pooled standard deviation
    function calcSP(){
        var bottom = (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2); //These are bad names I know, they refer to the denominator and both parts of the numerator
        var topLeft = (+inputs.sampleSizeVar-1) * Math.pow(+inputs.stdDevVar,2);
        var topRight = ((+inputs.sampleSizeCtrl -1) * Math.pow(+inputs.stdDevCtrl,2));
        var SP = (Math.sqrt((topRight + topLeft)/bottom));
        return SP;
    }

    //p value calculation using the jstat library https://jstat.github.io/distributions.html#jStat.studentt.pdf
    const pVal = jstat.studentt.pdf(+testStat, (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2)).toPrecision(2);

    const lift = ((+avgRevDif/+inputs.avgRevCtrl)*100).toPrecision(2)

    

    return (
        <>
            <Container maxWidth="lg" sx={{ display: "flex", padding: "50px", flexDirection: "column" }}>
                <Button sx={{ ml: "50px", mt: "50px", mb: "1vh" }} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
                <Container className='InOut-Container' border={"Solid"} sx={{display: "inline-flex"}}>
                    <Box className='input' width="50%" p={'2ch'} sx={{m:'2ch', border:'solid black', borderRadius:'10px'}}>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? "Something" : ""} placement="left" >
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'}}}
                                    className="Avg-Rev-Var"
                                    variant="standard"
                                    required={true}
                                    placeholder="32666"
                                    type="number"
                                    color='primary'
                                    label="Average Revenue, Variant"
                                    name='avgRevVar'
                                    InputLabelProps={{ shrink: true}}
                                    onChange={handleInputChange}
                                    />
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'} }}
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
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'}}}
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
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'} }}
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
                            <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'} }}
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
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'} }}
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
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'} }}
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
                                <TextField sx={{ m: 1, width: '12ch', input: {color:'black'}, label: {color: 'black'}}}
                                    className="testDuration-input"
                                    variant="standard"
                                    required={true}
                                    placeholder="5"
                                    type="number"
                                    color='primary'
                                    label="Test duration in days"
                                    name='testDuration-input'
                                    InputLabelProps={{ shrink: true}}
                                    onChange={handleInputChange}
                                    />
                            </Tooltip>
                        </FormControl>
                    </Box>
                    <Box className='outputs'  width="50%" sx={{m:'2ch', border: "solid black", borderRadius: "10px"}}>
                        <FormControl>
                            <Tooltip title={isDetailed === true ? "Something" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='test-result-Out'
                                    id="outlined-disabled"
                                    label="Test conclusion"
                                    InputLabelProps={{ shrink: true }}
                                    value={conclusion}
                                    >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Something" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='Avg-Rev-Out'
                                    id="outlined-disabled"
                                    label="Average Revanue Difference"
                                    InputLabelProps={{ shrink: true }}
                                    value={avgRevDif}
                                    >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "Upper tail T value" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
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
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='P-Value-out'
                                    id="outlined-disabled"
                                    label="P-value"
                                    InputLabelProps={{ shrink: true }}
                                    value={pVal}
                                    >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "How confident we are that the revenue difference is in this interval" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='Confidence-Interval-Out'
                                    id="outlined-disabled"
                                    label= { inputs.confidenceLvl + "% Confidence Interval"}
                                    // defaultValue="(??, ??)"
                                    value={"(" + confidenceIntevalLower.toFixed(3) + ", " + confidenceIntevalUpper.toFixed(3) + ")"}
                                    >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "How confident we are that the revenue difference is in this interval" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='lift-out'
                                    id="outlined-disabled"
                                    label= {"Observed Lift"}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    value={lift}
                                    >
                                </TextField>
                            </Tooltip>
                        </FormControl>
                    </Box>
                </Container>
            </Container>
        </>
    )
}

