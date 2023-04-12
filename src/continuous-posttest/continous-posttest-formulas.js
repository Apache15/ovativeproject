import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, FormControl, InputAdornment, TextField, Button, Container, Tooltip, Typography } from '@mui/material'

export default function continousFormulas() {

    const xBarSub2 = "x\u0304\u2082";
    const xBarSub1 = "x\u0304\u2081";
    const sSub1 = "S\u2081";
    const sSub2 = "S\u2082";
    const sp = "\u0073\u209a";
    const n1 = "n\u2081";
    const n2 = "n\u2082"

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={"▼"}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>Formulas and Notation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box className='col'>
                        <Typography>Notation</Typography>
                        <Typography>Average Revenue, Variant: {xBarSub1}</Typography>
                        <Typography>Average Revenue, Control: {xBarSub2}</Typography>
                        <Typography>Standard Deviation, Variant: {sSub1}</Typography>
                        <Typography>Standard Deviation, Control: {sSub2}</Typography>
                        <Typography>Pooled Standard Deviation: {sp}</Typography>
                        <Typography>Sample Size, Variant: {n1}</Typography>
                        <Typography>Sample Size, Control: {n2}</Typography>
                    </Box>
                    <Box className='col'>
                        <Typography>Formulas</Typography>
                        <Box className='formula'>
                            <Typography>Test Statistic</Typography>
                            <img src='TestStat.png' alt='Test statistic formula'/>
                        </Box>
                        <Box className='formula'>
                            <Typography>Degrees Of Freedom</Typography>
                            <img src='DOF.png' alt='Degrees of freedom formula'/>
                        </Box>
                        <Box className='formula'>
                            <Typography>Confidence Interval</Typography>
                            <img src='ConfidenceInterval.png' alt='Confidence interval formula'/>
                        </Box>
                        <Box className='formula'>
                            <Typography>Standard Error</Typography>
                            <img src='SP.png' alt='Standard error formula'/>
                        </Box>
                    </Box>

                </AccordionDetails>
            </Accordion>
        </>
    )
}
