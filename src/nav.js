import { Button, Toolbar, AppBar, Box} from '@mui/material'
import { color } from '@mui/system';
import React from 'react'

export default function nav() {

    const pages = ['Continuous Pre Test', 'Continuous Post Test', 'Binomial Pre Test', 'Binomial Post Test'];

  return (
    <AppBar position="fixed">
        <Toolbar sx={{backgroundColor: 'White'}}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }  }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: '#FA4616', 
                display: 'block', 
                fontFamily: "sans-serif",
                fontWeight: 700,

                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
  )
}
