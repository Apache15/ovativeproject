import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './nav';
import BinomialPostTestCalculator from './binomial-calculator/binomial-posttest-calc';
function App() {
  return (

    <div className="App">
      <ResponsiveAppBar />
      <header className="App-header">
        <div className="Calculator-window">
          <BinomialPostTestCalculator />
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
