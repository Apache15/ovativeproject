import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip} from '@mui/material'
import React, { useState } from "react";
import jStat from 'jstat';



export default function ContPostTest() {
    const [isDetailed, setDetail] = useState(true);
    const [inputs, setInputs] = useState({
        avgRevVar: Number,
        avgRevCtrl: Number,
        stdDevVar: Number,
        stdDevCtrl: Number,
        sampleSizeVar: Number,
        sampleSizeCtrl: Number,
        confidenceLvl: Number
    })

    const [avgRevDif, setAvgRevDif] = useState(inputs.avgRevVar-inputs.avgRevCtrl);
    const [testStat, setTestStat] = useState(calcTestStat());

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setInputs((prev) => {
            return {...prev, [name]: value};
        });
        setAvgRevDif(() => {
            return ((inputs.avgRevVar-inputs.avgRevCtrl).toFixed(2));
        });
        setTestStat(()=>{
            return(calcTestStat().toFixed(3));
        })
        console.log(tdistUp());

    };

    function tdistUp() {
        const df = ((+inputs.sampleSizeCtrl + +inputs.sampleSizeVar -2) * (calcSP()) * Math.sqrt(((+inputs.sampleSizeVar-1) + (+inputs.sampleSizeCtrl-1))))
        const tValue = jStat.studentt.inv((1- ((1- +inputs.confidenceLvl * .01) / 2)), df)
        return (+tValue + +avgRevDif);
    }

    function calcTestStat(){
        const numerator = (+inputs.avgRevVar- +inputs.avgRevCtrl);
        const denominator = (calcSP() * Math.sqrt(((1/+inputs.sampleSizeCtrl)+(1/+inputs.sampleSizeVar))));
        return (numerator/denominator);
    }

    function calcSP(){
        const bottom = (+inputs.sampleSizeCtrl + +inputs.sampleSizeVar - 2); //These are bad names I know, they refer to the denominator and both parts of the numerator
        const topLeft = (+inputs.sampleSizeVar-1) * Math.pow(+inputs.stdDevVar,2);
        const topRight = (+inputs.sampleSizeCtrl -1) * Math.pow(+inputs.stdDevCtrl,2);
        return Math.sqrt((topRight + topLeft)/bottom);
    }
    

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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
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
                                    onKeyUp={handleInputChange}
                                />
                            </Tooltip>
                        </FormControl>
                    </Box>
                    <Box className='outputs'  width="50%" sx={{m:'2ch', border: "solid black", borderRadius: "10px"}}>
                        <FormControl>
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
                                    defaultValue=""
                                    >
                                </TextField>
                            </Tooltip>
                            <Tooltip title={isDetailed === true ? "How confident we are that the revenue difference is in this interval" : ""} placement="left">
                                <TextField sx={{m:"1ch", width:'12ch'}}
                                    disabled
                                    className='Confidence-Interval-Out'
                                    id="outlined-disabled"
                                    label= { inputs.confidenceLvl + "% Confidence Interval"}
                                    defaultValue="(??, ??)"
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

