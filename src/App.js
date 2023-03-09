import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './nav';
import ContPostTest from './continuous-posttest-calc';

function App() {
  return (
    
    <div className="App">
      <ResponsiveAppBar/>
      <header className="App-header">
      <ContPostTest />
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
