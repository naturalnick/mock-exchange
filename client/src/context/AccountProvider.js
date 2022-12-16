import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";

const AccountContext = createContext();

function AccountProvider({ children }) {
	const { token } = useAuth();
	const [accountNumber, setAccountNumber] = useState("");
	const [cashBalance, setCashBalance] = useState("");
	const [holdings, setHoldings] = useState([]);

	useEffect(() => {
		getAccountInfo();
		getAccountHoldings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getAccountInfo() {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/account/info?token=${token}`
		);
		const accountInfo = response.data;
		setAccountNumber(accountInfo.account_number);
		setCashBalance(accountInfo.balance);
	}

	async function getAccountHoldings() {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/account/holdings?token=${token}`
		);
		const accountHoldings = response.data;
		setHoldings(accountHoldings);
	}

	return (
		<AccountContext.Provider value={{ accountNumber, cashBalance, holdings }}>
			{children}
		</AccountContext.Provider>
	);
}

function useAccount() {
	const context = useContext(AccountContext);
	if (context === undefined) {
		throw new Error("useCount must be used within a CountProvider");
	}
	return context;
}

export { AccountProvider, useAccount };
