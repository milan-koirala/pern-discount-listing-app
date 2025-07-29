import Navbar from "./components/Navbar"
import Homepage from "./pages/Homepage"
import DiscountListingPage from "./pages/DiscountListingPage"
import { Routes } from "react-router-dom"

function App() {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
    <Navbar/>

    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/discounts" element={<DiscountListingPage />} />
    </Routes>
    </div>
  );
}

export default App
