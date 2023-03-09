import { Button, Toolbar, AppBar, Box} from '@mui/material'
import React from 'react'

export default function nav() {

  const pages = ['Continuous Pre Test', 'Continuous Post Test', 'Binomial Pre Test', 'Binomial Post Test'];

  return (
    <AppBar position="fixed">
        <Toolbar sx={{backgroundColor: '#FA4616'}}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }  }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', 
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
