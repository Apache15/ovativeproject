import './App.css';
import { Button, Toolbar, AppBar, Box } from '@mui/material'
import BinomialPostTestCalculator from './binomial-calculator/binomial-posttest-calc';
import { useState, useEffect } from 'react';
import Slide from '@mui/material/Slide';
function App() {
  const pages = ['Continuous Pre Test', 'Continuous Post Test', 'Binomial Pre Test', 'Binomial Post Test'];
  const [activePage, changePage] = useState(0);
  const [pageData, changeData] = useState(0);
  useEffect(()=>{
    switch(activePage){
      case "Binomial Post Test":
        changeData(<BinomialPostTestCalculator />)
        break;
      default:
        changeData(<div>OOPS</div>);
    }
  },[activePage])
  return (
    <div className="App">
      <AppBar position="fixed">
      <Toolbar sx={{ backgroundColor: 'White' }}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              onClick={()=>{changePage(page);}}
              key={page}
              sx={{
                my: 2, color: '#FA4616',
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
        <ul>
          Capstone Group Members:
          <li>Blake Engrav</li>
          <li>Cord Redding</li>
          <li>Jordan Hove</li>
          <li>James Hinks</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
