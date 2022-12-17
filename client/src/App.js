import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Director from "./components/Director/Director";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Trade from "./pages/Trade/Trade";
import NotFound from "./pages/NotFound/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import { AccountProvider } from "./context/AccountProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Account from "./pages/Account/Account";

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
								<AccountProvider>
									<Dashboard />
								</AccountProvider>
							</ProtectedRoute>
						}
					/>
					<Route
						path="Trading"
						element={
							<ProtectedRoute>
								<AccountProvider>
									<Trade />
								</AccountProvider>
							</ProtectedRoute>
						}
					/>
					<Route
						path="Account"
						element={
							<ProtectedRoute>
								<AccountProvider>
									<Account />
								</AccountProvider>
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
