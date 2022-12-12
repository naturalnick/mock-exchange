import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const fakeAuth = () =>
	new Promise((resolve) => {
		setTimeout(() => resolve("2342f2f1d131rf12"), 250);
	});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const [token, setToken] = useState(null);

	const handleLogin = async () => {
		const token = await fakeAuth();

		setToken(token);

		navigate("/dashboard");
	};

	const handleLogout = () => {
		setToken(null);
	};

	return (
		<AuthContext.Provider
			value={{ token, onLogin: handleLogin, onLogout: handleLogout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const {
		token,
		onLogin: handleLogin,
		onLogout: handleLogout,
	} = useContext(AuthContext);
	return { token, onLogin: handleLogin, onLogout: handleLogout };
};
