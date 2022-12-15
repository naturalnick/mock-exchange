import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Director from "./components/Director/Director";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Trade from "./pages/Trade/Trade";
import NotFound from "./pages/NotFound/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<Director />}>
					<Route index element={<Home />} />
					<Route
						path="Dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="Trading"
						element={
							<ProtectedRoute>
								<Trade />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</AuthProvider>
	);
}

export default App;
