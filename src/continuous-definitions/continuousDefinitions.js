import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Table, TableContainer, TableRow, TableCell, Paper, Link } from '@mui/material'
import { Box } from '@mui/system'

export default function ContinuousDefinitions() {


    return (
        <>
            <Box className='Line-box'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={"▼"}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <div className="header">Definitions</div>
                    </AccordionSummary>
                    <Box className='Line-box'>
                        <Typography marginLeft='2ch'><b>Resources for methodology</b></Typography>
                        <Typography margin='0 0 0 2ch'>Post-test Calculator: <a href='https://www2.stat.duke.edu/courses/Spring12/sta101.1/lec/lec14S.pdf'>Link</a></Typography>
                        <Typography margin='0 0 2ch 2ch'>Pre-test Calculator: <a href='http://powerandsamplesize.com/Calculators/Compare-2-Proportions/2-Sample-Equality'>Link</a></Typography>
                    </Box>
                    <TableContainer sx={{ height: "auto" }} component={Paper}>
                        <TableRow>
                            <TableCell>Term</TableCell>
                            <TableCell>Definition</TableCell>
                            <TableCell>Notation</TableCell>
                            <TableCell>Further Resources</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Variant</TableCell>
                            <TableCell>Contains at least one element change from the control</TableCell>
                            <TableCell>Group 1</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Population</TableCell>
                            <TableCell>All the visitors that come to the website/app</TableCell>
                            <TableCell>Group 2</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Sample</TableCell>
                            <TableCell>The group of visitors that were exposed to the test - experienced either the control or variant </TableCell>
                            <TableCell> <div>n_v = the sample size of the variant </div>
                                <div>n_c = the sample size of the control</div>
                                <div>n = the total sample size, nv + nc</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Confidence Interval (for difference in proportion)</TableCell>
                            <TableCell>A range of values that is likely to contain the true population difference between two proportions with a certain level of confidence.</TableCell>
                            <TableCell>(lower bound, upper bound)</TableCell>
                            <TableCell><a href="https://www.statology.org/confidence-interval-difference-in-proportions/#:~:text=A%20confidence%20interval%20(C.I.)%20for,a%20certain%20level%20of%20confidence.">Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Proportion</TableCell>
                            <TableCell>Explained by a fraction - has a numerator and denominator</TableCell>
                            <TableCell>
                                <div>P = X/N</div>
                                <div>P = population proportion</div>
                                <div>X = count of successes</div>
                                <div>N = size of population</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Null Hypothesis</TableCell>
                            <TableCell>Assumes there is no difference between the variant and the control</TableCell>
                            <TableCell>H<sub>0</sub>: p<sub>1</sub> - p<sub>2</sub> = 0</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Alternative Hypothesis </TableCell>
                            <TableCell>There is a difference between the variant and the control</TableCell>
                            <TableCell>H<sub>a</sub>: p<sub>1</sub> - p<sub>2</sub> ≠ 0</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Type 1 Error</TableCell>
                            <TableCell>Rejecting the null hypothesis when in fact the null hypothesis is true 
                                        (i.e., For a two sided test: Concluding there is a significant difference between the variant and the control when in fact there is no difference between the variant and the control).
                                        The probability of making a type 1 error is measured at the significance level (α)
                            </TableCell>
                            <TableCell>α</TableCell>
                            <TableCell><a href='https://corporatefinanceinstitute.com/resources/data-science/type-i-error/'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Type 2 Error</TableCell>
                            <TableCell>Failing to reject the null hypothesis that is actually false.
                                (i.e., For a two sided test: Concluding there is no significant difference between the control 
                                and the variant when in fact the control and variant are different).
                            </TableCell>
                            <TableCell>β</TableCell>
                            <TableCell><a href='https://www.investopedia.com/terms/t/type-ii-error.asp'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Significance Level</TableCell>
                            <TableCell>The probability of rejecting the null hypothesis when the null hypothesis is in fact true. 
                                (i.e., a significance level of 0.05 has a 5% probability of concluding that there is a significant difference between 
                                the variant and control when in fact there is no difference).
                            </TableCell>
                            <TableCell>α</TableCell>
                            <TableCell><a href='https://statisticsbyjim.com/glossary/significance-level/'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Power</TableCell>
                            <TableCell>The probability of making a correct decision to reject the null hypothesis when the null hypothesis is false (1 - type II error)</TableCell>
                            <TableCell>1-β</TableCell>
                            <TableCell><a href='https://apcentral.collegeboard.org/courses/ap-statistics/classroom-resources/power-in-tests-of-significance#:~:text=Power%20is%20the%20probability%20of%20rejecting%20the%20null%20hypothesis%20when,an%20effect%20that%20is%20present.'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Parameter With a hat</TableCell>
                            <TableCell>Data that is calculated out of a sample</TableCell>
                            <TableCell>Ex, {"\u0070\u0302"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Parameter without a hat</TableCell>
                            <TableCell>Data that is calculated out of a population</TableCell>
                            <TableCell>Ex, p</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Standard Deviation</TableCell>
                            <TableCell>Measures the dispersion of a dataset relative to its mean</TableCell>
                            <TableCell>σ</TableCell>
                            <TableCell><a href='https://www.investopedia.com/terms/s/standarddeviation.asp'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Probability Distribution</TableCell>
                            <TableCell>A statistical function that describes possible values and likelihoods a random variable can take within a given range</TableCell>
                            <TableCell></TableCell>
                            <TableCell><a href='https://www.investopedia.com/terms/p/probabilitydistribution.asp'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Sampling Distribution</TableCell>
                            <TableCell>Sampling distribution of a statistic is a probability distribution based on a large number of samples </TableCell>
                            <TableCell></TableCell>
                            <TableCell><a href='https://online.stat.psu.edu/stat500/lesson/4'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Standard Error</TableCell>
                            <TableCell>A measure of the statistical accuracy of an estimate</TableCell>
                            <TableCell>SE</TableCell>
                            <TableCell><a href='https://en.wikipedia.org/wiki/Standard_error'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Test Statistic</TableCell>
                            <TableCell>Shows how closely your observed data match the distribution expected under the null hypothesis. It is used to calculate the p-value.</TableCell>
                            <TableCell>z</TableCell>
                            <TableCell><a href='https://www.scribbr.com/statistics/test-statistic/r'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>P-value</TableCell>
                            <TableCell>The probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true.</TableCell>
                            <TableCell>p</TableCell>
                            <TableCell><a href='https://www.investopedia.com/terms/p/p-value.asp'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Lift</TableCell>
                            <TableCell>Percent increase or decrease in metric for users who received a variant  versus a control group</TableCell>
                            <TableCell></TableCell>
                            <TableCell><a href='https://uplandsoftware.com/localytics/resources/blog/lift-analysis-for-app-marketing-campaigns/#:~:text=Lift%20analysis%20is%20a%20way,campaign%20versus%20a%20control%20group.'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Kappa</TableCell>
                            <TableCell>Ratio of sample sizes in each group. For example, if the control group is three times larger than the variant group, kappa=3</TableCell>
                            <TableCell>k</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Statistical Significance</TableCell>
                            <TableCell>A measure of the probability of the null hypothesis being true compared to the acceptable level of uncertainty regarding the true answer</TableCell>
                            <TableCell></TableCell>
                            <TableCell><a href='https://blog.analytics-toolkit.com/2017/statistical-significance-ab-testing-complete-guide/'>Link</a></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>CRV</TableCell>
                            <TableCell>Conversion Rate</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Cl</TableCell>
                            <TableCell>Confidence interval</TableCell>
                        </TableRow>
                    </TableContainer>
                </Accordion>
            </Box>
        </>
    )
}
