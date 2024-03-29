import './App.css';
import { Button, Toolbar, AppBar, Box, ThemeProvider, createTheme } from '@mui/material'
import { useState, useEffect } from 'react';
import ContinuousPreTestCalculator from './continuous-calculator/continuousPreTest';
import BinomialPostTestCalculator from './binomial-posttest-calculator/binomial-posttest-calc';
import BiPretest from './binomial-pretest/binomial-pretest-calc';
import ContPostTest from './continuous-posttest/continuous-posttest-calc';


const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.25em'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          paddingBottom: "10px",
          paddingTop: "10px",
          border: "2px solid black",
          borderRadius: "10px",
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #686868",
        }
      }
    },
    MuiInputLabel:{
      styleOverrides:{
        root:{
          fontSize:"22px",
        }
      }
    },
    MuiInput:{
      styleOverrides:{
        root:{
          fontSize:"19px",
        }
      }
    }
  }
})

function App() {
  const pages = ['Continuous Pre Test', 'Continuous Post Test', 'Binomial Pre Test', 'Binomial Post Test'];
  const [activePage, changePage] = useState("Continuous Pre Test");
  const [pageData, changeData] = useState(<ContinuousPreTestCalculator />);
  useEffect(() => {
    switch (activePage) {
      case "Continuous Pre Test":
        changeData(<ContinuousPreTestCalculator />)
        break;
      case "Continuous Post Test":
        changeData(<ContPostTest />)
        break;
      case "Binomial Pre Test":
        changeData(<BiPretest />)
        break;
      case "Binomial Post Test":
        changeData(<BinomialPostTestCalculator />)
        break;
      default:
        changeData(<ContPostTest />);
    }
  }, [activePage])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar position='fixed'>
          <Toolbar sx={{ backgroundColor: 'white' }}>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  className="nav-button"
                  onClick={() => { changePage(page); }}
                  key={page}
                  
                  sx={{
                    ":hover":{
                      backgroundColor:'#FA4616',
                      color:'white',
                    },
                    marginRight:'10px',
                    backgroundColor: activePage===page? '#FA4616':'white',
                    my: 2, color: activePage===page? 'white' : '#FA4616',
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
        <header className="App-header">
          <div className="Calculator-window">
            {pageData}
          </div>
        </header>
      </ThemeProvider>
    </div>
  );
}

export default App;
