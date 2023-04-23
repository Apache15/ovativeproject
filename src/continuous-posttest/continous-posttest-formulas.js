import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SPimg from './SP.png';
import CLimg from './ConfidenceInterval.png';
import DOFimg from './DOF.png';
import TSimg from './TestStat.png';
import { Box, Tooltip, Typography, Grid, Tab, Table, TableRow, TableCell, Paper, TableContainer, TableHead } from '@mui/material'

export default function ContinousFormulas(props) {

    const xBarSub2 = "x\u0304\u2082";
    const xBarSub1 = "x\u0304\u2081";
    const lessThan = "\u003c";
    const alpha = "\u0251";
    const greaterEqualTo = "\u2265";

    return (
        <>
            <div className="header" style={{ marginTop: '2ch' }}>Continuous Post-test Education</div>
            <Box className='Line-box'>
                <Accordion >
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <div className="header">Formulas</div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: 'flex', padding: "0ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                        <Box sx={{ display: 'inline', margin: '0ch 0ch 0ch 7ch', padding: '1ch'}}>

                            <Box className='Line-box' >
                                <div>Test Statistic</div>
                                <img src={TSimg} width="300vw" height='auto' alt='Test statistic formula' />
                            </Box>

                            <Box className='Line-box'>
                                <div>Standard Error</div>
                                <img src={SPimg} width="500vw" height='auto' alt='Standard error formula' />
                            </Box>
                            </Box>
                            <Box sx={{ margin: '0ch 0ch 0ch 4ch', padding: '1ch' }}>
                            <Box className='Line-box' >
                                <div>Degrees of Freedom</div>
                                <img src={DOFimg} width="400vw" height='auto' alt='Degrees of freedom formula' />
                            </Box >
                            <Box className='Line-box'>
                                <div>Confidence Interval</div>
                                <Tooltip title={
                                    <React.Fragment>{"Where, "}<i>t</i><sub>1-α/2</sub> {"is a constant."}</React.Fragment>}
                                    >
                                    <img src={CLimg} width="500vw" height='auto' alt='Confidence interval formula' />
                                </Tooltip>
                                
                                
                            </Box>
                        </Box>

                    </AccordionDetails>
                </Accordion>
            </Box>

            <Box className='Line-box'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header">
                        <div className='header'>Parameters and Notation</div>
                    </AccordionSummary>
                    <TableContainer sx={{ height: "auto" }} component={Paper}>
                        <Table>
                            <TableRow>
                                <TableCell>Parameter</TableCell>
                                <TableCell>Notation</TableCell>
                                <TableCell>Value</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Average Revenue, Variant</TableCell>
                                <TableCell sx={{ fontSize: '1.2ch' }}>{xBarSub1}</TableCell>
                                <TableCell>{props.params.avgRevVar}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Average Revenue, Control</TableCell>
                                <TableCell sx={{ fontSize: '1.2ch' }}>{xBarSub2}</TableCell>
                                <TableCell>{props.params.avgRevCtrl}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Standard Deviation, Variant</TableCell>
                                <TableCell>s<sub>1</sub></TableCell>
                                <TableCell>{props.params.stdDevVar}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Standard Deviation, Control</TableCell>
                                <TableCell>s<sub>2</sub></TableCell>
                                <TableCell>{props.params.stdDevCtrl}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Pooled Standard Deviation</TableCell>
                                <TableCell>s<sub>p</sub></TableCell>
                                <TableCell>{props.pooledstd}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sample Size, Variant</TableCell>
                                <TableCell>n<sub>1</sub></TableCell>
                                <TableCell>{props.params.sampleSizeVar}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sample Size, Control</TableCell>
                                <TableCell>n<sub>2</sub></TableCell>
                                <TableCell>{props.params.sampleSizeCtrl}</TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Accordion>
            </Box>

            <Box className='Line-box'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <div className="header">Testing Assumptions</div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: 'flow', padding: "1ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                        <div style={{ textAlign: "center" }}>The results of the "Post-Test Calculator" can only be used when the following four conditions are satisfied</div>
                        <ol>
                            <li>
                                Independence within groups
                            </li>
                            <ul><li>Answer intuitively. Could revenue be influenced by each other within the variant group? What about the control?</li></ul>
                            <li>Independence between groups</li>
                            <ul><li>Answer intuitively. Could revenue in the control group influence revenue in the variant group?</li></ul>
                            <li>Normality</li>
                            <ul><li>We will use a general rule of thumb -- at least 30 samples in each group (Calculated below)</li></ul>
                            <li>Homogeneous Variance</li>
                            <ul><li>We will use a general rule of thumb --  the largest standard deviation is less than three times as large as the smallest standard deviation</li></ul>
                        </ol>
                        <TableContainer x={{ height: "auto" }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableCell>Condition to satisfy</TableCell>
                                    <TableCell>Equation to Satisfy</TableCell>
                                    <TableCell>Satisfied</TableCell>
                                </TableHead>
                                <TableRow>
                                    <TableCell>Sample size of the variant group is at least 30</TableCell>
                                    <TableCell>n<sub>1</sub> {greaterEqualTo} 30 </TableCell>
                                    <TableCell>{(props.params.sampleSizeVar >= 30) ? "True" : "False"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sample size of the control group is at least 30</TableCell>
                                    <TableCell>n<sub>2</sub> {greaterEqualTo} 30 </TableCell>
                                    <TableCell>{(props.params.sampleSizeCtrl >= 30) ? "True" : "False"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Group with larger standard deviation is less than three times the standard deviation of other group</TableCell>
                                    <TableCell>max(s<sub>1</sub>, s<sub>2</sub>)/min(s<sub>1</sub>, s<sub>2</sub>) {lessThan} 3</TableCell>
                                    <TableCell>{(props.params.sampleSizeVar >= 30) ? "True" : "False"}</TableCell>
                                </TableRow>
                            </Table>
                        </TableContainer>
                        <div style={{ fontWeight: "bold", border: "2px solid black", marginBottom: "10px", padding: "10px" }}>Are all conditions satisfied? <span style={{ fontWeight: "normal", backgroundColor: props.satisfied ? "#6eb05d" : "#b05d5d" }}>{props.satisfied ? "True" : "False"}</span></div>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Box className='Line-box'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <div className="header">Formal Hypothesis Testing Definition</div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: 'flow', padding: "1ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                        <Typography marginBottom='1ch'><b>First define the research question:</b> Are the revenues for the variant and control groups significantly different?</Typography>
                        <Box border='2px solid black' boxShadow='0px 3px 2px'>
                            <Typography align='center'><b>Next, state the null and alternative hypothesis</b></Typography>
                            <Typography margin='0 0 0 2ch'><i>H</i><sub>0</sub>: µ<sub>1</sub> = µ<sub>2</sub>  <Tab />µ<sub>1</sub> - Population revenue for the variant group</Typography>
                            <Typography margin='0 0 1ch 2ch'><i>H</i><sub>1</sub>: µ<sub>1</sub> ≠ µ<sub>2</sub>  <Tab margin /> µ<sub>2</sub> - Population revenue rate for the control rate</Typography>
                            <Typography margin='0 0 0 2ch'> <b>NULL HYPOTHESIS: (<i>H</i><sub>0</sub>) </b> - The population revenues for the control group and the variant group are the same </Typography>
                            <Typography margin='0 0 0 2ch'> <b>ALTERNATIVE HYPOTHESIS: (<i>H</i><sub>1</sub> or <i>H</i><sub>A</sub>)</b> - The population revenues for the control group and the variant group are not the same </Typography>
                        </Box>
                        <Box border='2px solid black' boxShadow='0px 3px 2px' margin='1ch 0 0 0'>
                            <Typography align='center'><b>Next, calculate the test statistic and p-value</b></Typography>
                            <Typography marginLeft='2ch'><b>Calculate the test statisitic, t</b></Typography>
                            <Typography marginLeft='2ch'>- This is automatically calculated as "Test statistic" on the calculator output</Typography>
                            <Typography margin='0 0 1ch 2ch'>- The formula for t is defined above under the "Formulas and Notation" section</Typography>
                            <Typography marginLeft='2ch'><b>Calculate the p-value</b></Typography>
                            <Typography marginLeft='2ch'>- This is automatically calculated as "P-value" in the calculator output</Typography>
                            <Typography marginLeft='2ch'>- P-value can be thought of as:
                                "how unlikely is this event if we assume that the revenues are the same. Unlikely enough to conclude that the revenues are probably different?"
                            </Typography>
                            <Typography margin='0 0 1ch 2ch'>⁃ We use a general rule-of-thumb that "unlikely enough" is defined as a p-value that is less than the significance level (typically 0.05)</Typography>
                        </Box>
                        <Box border='2px solid black' boxShadow='0px 3px 2px' margin='1ch 0 0 0'>
                            <Typography align='center'><b>Last, make a conclusion based on the p-value</b></Typography>
                            <Typography margin='0 0 1ch 2ch'>If pvalue {lessThan} {alpha}, We reject the null hypothesis  (There is a statistically significant evidence that the conversion rates in the control and variant are different)</Typography>
                            <Typography margin='0 0 1ch 2ch'>If pvalue {greaterEqualTo} {alpha}, We fail to reject the null hypothesis (The test is inconclusive)</Typography>
                            <Typography margin='0 0 1ch 2ch'>Typically alpha({alpha}) = 0.05, to calculate the Confidence Level we use 100(1-{alpha}%)</Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    )
}
