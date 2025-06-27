import "./App.css";
import { Route, Routes } from "react-router";
import {
  Auth,
  Dashboard,
  LandingPpage,
  OrderDetails,
  Orders,
  PaymentConfirmation,
  Payments,
  Settings,
} from "./pages";
import { Layout } from "./components";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<LandingPpage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/confirmation" element={<PaymentConfirmation />} />
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
