import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./components/Nav.jsx";
import DailySummary from "./pages/DailySummary.jsx";
import Week from "./pages/Week.jsx";
import MonthlyStats from "./pages/Monthly.jsx"; 
import AllTime from "./pages/AllTime.jsx";
import StreakablesApp from "./components/Streaks.jsx";

function App() {
 return (
   <BrowserRouter>
     <ResponsiveAppBar />
     <Routes>
       <Route path="/" element={<AllTime />} />
       <Route path="/day" element={<DailySummary />} />
       <Route path="/week" element={<Week />} />
       <Route path="/month" element={<MonthlyStats />} />
       <Route path="/streakable" element={<StreakablesApp />} />
     </Routes> 
   </BrowserRouter>
 );
}

export default App;
