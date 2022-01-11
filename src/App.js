import logo from './logo.svg';
import './App.css';
//import AppointmentApp from "./AppointmentApp.js";
import Appointment from "./Appointment.js";
import ConfirmComponent from './Confirm.js'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <MuiThemeProvider>
          <AppRoutes />
        </MuiThemeProvider>
    </div>
  );
}

const AppRoutes = () => (
  <Router>
      <Routes>
        <Route path='/payment-success' element={<ConfirmComponent/>} />
        <Route path='/' element={<Appointment/>} />
      </Routes>
  </Router>
)

export default App;
