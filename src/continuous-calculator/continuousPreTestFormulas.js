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
                    <div className="header">Formulas and Notation</div>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', padding: "0ch", borderTop: "1px solid rgba(0, 0, 0, .25) " }}>
                    
                    <Box className='col' width='65%' sx={{ margin: '0ch 0ch 0ch 4ch', padding: '1ch' }}>
                        <Typography align='center' fontWeight='bold'>Formulas</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={6}>
                                
                                <Box className='formula'>
                                    <Typography>Kappa</Typography>
                                    <img src={Kappaimg} width="400vw" height='auto' alt='Standard error formula' />
                                    <Typography>For example, if the control group is 3 times larger than the variant group, then kappa = 3.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className='formula' >
                                    <Typography>Control Group Sample Size</Typography>
                                    <img src={SSCimg} width="300vw" height='auto' alt='Degrees of freedom formula' />
                                </Box>
                                <Box className='formula'>
                                    <Typography>Variant Group Sample Size</Typography>
                                    <img src={SSVimg} width="400vw" height='auto' alt='Confidence interval formula' />
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
