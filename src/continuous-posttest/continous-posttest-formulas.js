import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SPimg from './SP.png';
import CLimg from './ConfidenceInterval.png';
import DOFimg from './DOF.png';
import TSimg from './TestStat.png';
import { Box, Tooltip, Typography, Grid, Tab } from '@mui/material'

export default function ContinousFormulas() {

    const xBarSub2 = "x\u0304\u2082";
    const xBarSub1 = "x\u0304\u2081";
    const sSub1 = "S\u2081";
    const sSub2 = "S\u2082";
    const sp = "\u0073\u209a";
    const n1 = "n\u2081";
    const n2 = "n\u2082";
    const lessThan = "\u003c";
    const alpha = "\u0251";
    const greaterEqualTo = "\u2265";

    return (
        <>
            <Accordion sx={{ marginTop: "2ch" }}>
                <AccordionSummary
                    expandIcon={"▼"}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <div className="header">Formulas and Notation</div>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', padding: "0ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                    <Box className='col' width='30%' sx={{ margin: '1ch 5ch 1ch 2ch', paddingRight: '0ch' }}>
                        <Typography align='center' fontWeight='bold'>Notation</Typography>
                        <Typography fontSize='21px'>Average Revenue, Variant: {xBarSub1}</Typography>
                        <Typography fontSize='20px'>Average Revenue, Control: {xBarSub2}</Typography>
                        <Typography fontSize='20px'>Standard Deviation, Variant: {sSub1}</Typography>
                        <Typography fontSize='20px'>Standard Deviation, Control: {sSub2}</Typography>
                        <Typography fontSize='20px'>Pooled Standard Deviation: {sp}</Typography>
                        <Typography fontSize='20px'>Sample Size, Variant: {n1}</Typography>
                        <Typography fontSize='20px'>Sample Size, Control: {n2}</Typography>
                    </Box>
                    <Box className='col' width='65%' sx={{ margin: '0ch 0ch 0ch 4ch', padding: '1ch' }}>
                        <Typography align='center' fontWeight='bold'>Formulas</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={6}>
                                <Box className='formula' >
                                    <Typography>Test Statistic</Typography>
                                    <img src={TSimg} width="300vw" height='auto' alt='Test statistic formula' />
                                </Box>

                                <Box className='formula'>
                                    <Typography>Standard Error</Typography>
                                    <img src={SPimg} width="400vw" height='auto' alt='Standard error formula' />
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className='formula' >
                                    <Typography>Degrees Of Freedom</Typography>
                                    <img src={DOFimg} width="300vw" height='auto' alt='Degrees of freedom formula' />
                                </Box>
                                <Box className='formula'>
                                    <Typography>Confidence Interval</Typography>
                                    <Typography fontStyle='italic'>
                                        {"Where, "}<i>t</i><sub>1-α/2</sub> {"is a constant."}
                                    </Typography>
                                    <img src={CLimg} width="400vw" height='auto' alt='Confidence interval formula' />
                                </Box>

                            </Grid>
                            <Grid item xs={6} md={2}>

                            </Grid>
                        </Grid>
                    </Box>

                </AccordionDetails>
            </Accordion>

            <Accordion>
            <AccordionSummary
                    expandIcon={"▼"}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <div className="header">Testing Assumptions</div>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flow', padding: "1ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                    <Box >
                        <Typography fontSize='17px'>1) Independence within groups</Typography>
                        <Typography fontStyle='italic'>Answer intuitively. Could revenue be influenced by each other within the variant group? What about the control? </Typography>
                    </Box>
                    <Box marginTop='1ch'>
                        <Typography fontSize='17px'>2) Independence between groups</Typography>
                        <Typography fontStyle='italic'>Answer intuitively. Could revenue in the control group influence revenue in the variant group?</Typography>
                    </Box>
                    <Box marginTop='1ch'>
                        <Typography fontSize='17px'>3) Normality</Typography>
                        <Typography fontStyle='italic'>We will use a general rule of thumb -- at least 30 samples in each group</Typography>
                    </Box>
                    <Box marginTop='1ch'>
                        <Typography fontSize='17px'>4) Homogeneous Variance</Typography>
                        <Typography fontStyle='italic'>We will use a general rule of thumb --  the largest standard deviation is less than three times as large as the smallest standard deviation</Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>

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
                        <Typography margin='0 0 0 2ch'><i>H</i><sub>0</sub>: µ<sub>1</sub> = µ<sub>2</sub>  <Tab/>µ<sub>1</sub> - Population revenue for the variant group</Typography>
                        <Typography margin='0 0 1ch 2ch'><i>H</i><sub>1</sub>: µ<sub>1</sub> ≠ µ<sub>2</sub>  <Tab margin/> µ<sub>2</sub> - Population revenue rate for the control rate</Typography>
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
                        <Typography  margin='0 0 1ch 2ch'>If pvalue {lessThan} {alpha}, We reject the null hypothesis  (There is a statistically significant evidence that the conversion rates in the control and variant are different)</Typography>
                        <Typography margin='0 0 1ch 2ch'>If pvalue {greaterEqualTo} {alpha}, We fail to reject the null hypothesis (The test is inconclusive)</Typography>
                        <Typography margin='0 0 1ch 2ch'>Typically alpha({alpha}) = 0.05, to calculate the Confidence Level we use 100(1-{alpha}%)</Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
