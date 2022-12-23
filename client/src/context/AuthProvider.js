import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const navigate = useNavigate();

	const [cookies, setCookie, removeCookie] = useCookies(["token"]);
	const [token, setToken] = useState(() => cookies.token);
	const [authError, setAuthError] = useState("");

	async function handleLogin(email, password) {
		const response = await axios
			.post("http://127.0.0.1:5001/login", {
				email: email,
				password: password,
			})
			.catch((error) => {
				if (error.message === "Network Error") {
					setAuthError("Server connection failed.");
				} else {
					setAuthError(error.response.data.error);
				}
			});

		if (response && response.status === 200) {
			setToken(response.data.token);
			setCookie("token", response.data.token, { path: "/" });

			navigate("/dashboard");
		}
	}

	function handleLogout() {
		setToken(null);
		removeCookie("token");
	}

	async function handleRegister(formData) {
		const response = await axios
			.post("http://127.0.0.1:5001/register", {
				email: formData.email,
				password: formData.password,
			})
			.catch((error) => {
				if (error.message === "Network Error") {
					setAuthError("Server connection failed.");
				} else {
					setAuthError(error.response.data.error);
				}
			});
		if (response && response.status === 200) {
			handleLogin(formData.email, formData.password);
		}
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				handleLogin,
				handleLogout,
				handleRegister,
				authError,
				setAuthError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const {
		token,
		handleLogin,
		handleLogout,
		handleRegister,
		authError,
		setAuthError,
	} = useContext(AuthContext);
	return {
		token,
		handleLogin,
		handleLogout,
		handleRegister,
		authError,
		setAuthError,
	};
}
