import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const navigate = useNavigate();

	const [cookies, setCookie, removeCookie] = useCookies(["token"]);
	const [token, setToken] = useState(() => cookies.token);

	async function handleLogin(email, password) {
		const response = await axios.post("http://127.0.0.1:5001/login", {
			email: email,
			password: password,
		});
		console.log(response);
		setToken(response.data.token);
		setCookie("token", response.data.token, { path: "/" });

		navigate("/dashboard");
	}

	function handleLogout() {
		setToken(null);
		removeCookie("token");
	}

	async function handleRegister(email, password) {
		const response = await axios.post("http://127.0.0.1:5001/register", {
			email: email,
			password: password,
		});
		console.log(response);
		handleLogin(email, password);
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				onLogin: handleLogin,
				onLogout: handleLogout,
				onRegister: handleRegister,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const {
		token,
		onLogin: handleLogin,
		onLogout: handleLogout,
		onRegister: handleRegister,
	} = useContext(AuthContext);
	return {
		token,
		onLogin: handleLogin,
		onLogout: handleLogout,
		onRegister: handleRegister,
	};
}
