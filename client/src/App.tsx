import "./App.css";
import { Route, Routes } from "react-router";
import { Auth, Dashboard, Order, Payments, Settings } from "./pages";
import { Nav } from "./components";

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/order" element={<Order />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
