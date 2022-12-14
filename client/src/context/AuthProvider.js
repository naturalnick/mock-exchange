import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const [token, setToken] = useState(null);

	async function handleLogin() {
		const response = await axios.post("http://127.0.0.1:5001/login", {
			email: "nick@nick.com",
			password: "password",
		});

		setToken(response.data.token);
		//save token in as cookie

		navigate("/dashboard");
	}

	function handleLogout() {
		setToken(null);
	}

	async function handleRegister() {
		const response = await axios.post("http://127.0.0.1:5001/register", {
			email: "nick@nick.com",
			password: "password",
		});
		console.log(response);
		handleLogin();
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
};

export const useAuth = () => {
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
};
