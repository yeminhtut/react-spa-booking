import logo from './logo.svg';
import './App.css';
import AppointmentApp from "./AppointmentApp.js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

function App() {
  return (
    <div className="App">
      <MuiThemeProvider>
          <AppointmentApp />
        </MuiThemeProvider>
    </div>
  );
}

export default App;
