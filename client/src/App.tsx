import "./App.css";
import { Route, Routes } from "react-router";
import {
  Auth,
  Dashboard,
  OrderDetails,
  Orders,
  Payments,
  Settings,
} from "./pages";
import { Layout } from "./components";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
