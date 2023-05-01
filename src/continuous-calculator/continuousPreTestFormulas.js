import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Kappaimg from './Kappa.png';
import SSCimg from './Sample Size Control.png';
import SSVimg from './Sample Size Variant.png';
import { Box, Typography, Grid } from '@mui/material'

export default function ContinousPreTestFormulas() {


    return (
        <>
        <Box className='Line-box' sx={{ marginTop: "2ch" }}>
            <Accordion >
                <AccordionSummary
                    expandIcon={"▼"}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <div className="header">Formulas</div>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', padding: "0ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                    
                    <Box className='col' width='65%' sx={{ margin: '0ch 0ch 0ch 4ch', padding: '1ch' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={6}>
                                <Box className='formula'>
                                    <Typography align="center" fontWeight="bold">Kappa</Typography>
                                    <table align="center">
                                        <td><tr></tr><tr>κ = </tr></td>
                                            <td>
                                            <tr>𝑛<sub>𝑐</sub></tr>
                                            <tr><hr></hr></tr>
                                            <tr>𝑛<sub>𝑣</sub></tr>
                                        </td>
                                        <td><tr></tr><tr> or κ𝑛<sub>𝑣</sub> = 𝑛<sub>𝑐</sub></tr></td>
                                    </table>
                                    <Typography align="center">For example, if the control group is 3 times larger than the variant group, then kappa = 3.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className='formula' >
                                    <Typography align="center" fontWeight="bold">Control Group Sample Size</Typography>
                                    <p align="center">𝑛<sub>𝑐</sub> = κ𝑛<sub>𝑣</sub></p>
                                </Box>
                                <Box className='formula'>
                                    <Typography align="center" fontWeight="bold">Variant Group Sample Size</Typography>
                                    <img align="right" src={SSVimg} width="400vw" height='auto' alt='Confidence interval formula' />
                                </Box>

                            </Grid>
                            <Grid item xs={6} md={2}>

                            </Grid>
                        </Grid>
                    </Box>

                </AccordionDetails>
            </Accordion>
            </Box>
        </>
    )
}
