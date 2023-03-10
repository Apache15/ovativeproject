import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './nav';

function App() {
  return (
    
    <div className="App">
      <ResponsiveAppBar/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
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
