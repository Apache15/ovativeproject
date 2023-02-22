import { TextField, InputAdornment, FormControl, Box, Tooltip, Button } from "@mui/material";
import "./binomial-pretest-calc.css"
import React, { useState } from "react";

export default function BinomialPretestCalculator() {
    const [isDetailed, setDetail] = useState(true);
    return (
        <div>
        <Button variant="contained" onClick={()=>setDetail(!isDetailed)}>Toggle Tooltips</Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: "column", alignItems: "flex-start" }}>
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
                </FormControl>
            </Box>
        </div>
    )
}