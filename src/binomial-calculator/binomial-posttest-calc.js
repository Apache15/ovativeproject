import { TextField, InputAdornment, FormControl, Box, Tooltip, Button } from "@mui/material";
import "./binomial-posttest-calc.css"
import React, { useState } from "react";

export default function BinomialPostTestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    return (
        <>
            <Button sx={{ml:"50px",mt:"50px"}} className="Detail-toggle" variant="contained" onClick={() => setDetail(!isDetailed)}>Toggle Tooltips</Button>
            <div className="container">
                <Box className="Form-box">
                    <FormControl>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1, width: '10ch' }}
                                className="desiredLift"
                                variant="standard"
                                required={true}
                                placeholder="42.9"
                                type="number"
                                label="Desired Lift"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1, width: '10ch' }}
                                className="desiredLift"
                                variant="standard"
                                required={true}
                                placeholder="42.9"
                                type="number"
                                label="Desired Lift"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>
                        </Tooltip>
                        <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                            <TextField
                                sx={{ m: 1, width: '10ch' }}
                                className="desiredLift"
                                variant="standard"
                                required={true}
                                placeholder="42.9"
                                type="number"
                                label="Desired Lift"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>
                        </Tooltip>
                    </FormControl>
                </Box>
                <Box className="Form-box">
                    <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                        <TextField
                            sx={{ m: 1, width: '10ch' }}
                            className="desiredLift"
                            variant="standard"
                            required={true}
                            placeholder="42.9"
                            type="number"
                            label="Desired Lift2"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                        <TextField
                            sx={{ m: 1, width: '10ch' }}
                            className="desiredLift"
                            variant="standard"
                            required={true}
                            placeholder="42.9"
                            type="number"
                            label="Desired Lift2"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip title={isDetailed === true ? "Suggested value is 80%" : ""} placement="left">
                        <TextField
                            sx={{ m: 1, width: '10ch' }}
                            className="desiredLift"
                            variant="standard"
                            required={true}
                            placeholder="42.9"
                            type="number"
                            label="Desired Lift2"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        >
                        </TextField>
                    </Tooltip>
                </Box>
            </div>
        </>
    )
}