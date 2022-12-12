import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Director from "./components/Director/Director";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Trading from "./pages/Trading/Trading";
import NotFound from "./pages/NotFound/NotFound";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Director />}>
					<Route index element={<Home />} />
					<Route path="Dashboard" element={<Dashboard />} />
					<Route path="Trading" element={<Trading />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
