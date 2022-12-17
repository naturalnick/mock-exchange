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
		updateAccountInfo();
		updateAccountHoldings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function updateAccountInfo() {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/account/info?token=${token}`
		);
		const accountInfo = response.data;
		setAccountNumber(accountInfo.account_number);
		setCashBalance(accountInfo.balance);
	}

	async function updateAccountHoldings() {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/account/holdings?token=${token}`
		);
		const holdings = response.data.holdings;
		for (let i = 0; i < holdings.length; i++) {
			const stockData = await getStockData(holdings[i].symbol);

			holdings[i].marketValue =
				stockData.askPrice === 0
					? stockData.closePrice
					: stockData.askPrice;
			holdings[i].companyName = stockData.companyName;
		}
		setHoldings(response.data.holdings);
	}

	async function getStockData(symbol) {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/stock?symbol=${symbol}`
		);
		return response.data;
	}

	return (
		<AccountContext.Provider
			value={{
				accountNumber,
				cashBalance,
				holdings,
				updateAccountInfo,
				updateAccountHoldings,
			}}
		>
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
