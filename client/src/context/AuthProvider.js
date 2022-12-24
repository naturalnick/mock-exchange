import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { loginAccount, registerAccount } from "../utils/API";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const navigate = useNavigate();

	const [cookies, setCookie, removeCookie] = useCookies(["token"]);
	const [token, setToken] = useState(() => cookies.token);
	const [authError, setAuthError] = useState("");

	async function handleLogin(email, password) {
		const response = await loginAccount(email, password);

		if ("error" in response) {
			setAuthError(response.error);
		}
		if ("token" in response) {
			setToken(response.token);
			setCookie("token", response.token, { path: "/" });
			navigate("/dashboard");
		}
	}

	async function handleRegister(formData) {
		const response = await registerAccount(formData.email, formData.password);

		if ("error" in response) {
			setAuthError(response.error);
		}
		if ("token" in response) {
			setToken(response.token);
			setCookie("token", response.token, { path: "/" });
			navigate("/dashboard");
		}
	}

	function handleLogout() {
		setToken(null);
		removeCookie("token");
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
