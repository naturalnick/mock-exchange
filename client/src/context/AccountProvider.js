import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { useAuth } from "./AuthProvider";
import { getAccount, getHoldings, getStockData } from "../utils/API";

const AccountContext = createContext();

function AccountProvider({ children }) {
	const { handleLogout } = useAuth();
	const [accountNumber, setAccountNumber] = useState(0);
	const [cashBalance, setCashBalance] = useState(0);
	const [holdings, setHoldings] = useState([]);
	const [watchList, setWatchlist] = useState([]);
	const [isAccountLoading, setIsAccountLoading] = useState(true);

	const updateAccountInfo = useCallback(async () => {
		setIsAccountLoading(true);
		const account = await getAccount();
		if ("error" in account) {
			if (account.error === "invalid token") handleLogout();
		}

		setAccountNumber(Number(account.account_number));
		setCashBalance(Number(account.balance));
		if (account.watch_list.length > 0) {
			updateWatchlist(account.watch_list.split(","));
		} else setWatchlist([]);
	}, [handleLogout]);

	const updateAccountHoldings = useCallback(async () => {
		const holdings = await getHoldings();
		if (holdings.length === 0) {
			setHoldings([]);
			setIsAccountLoading(false);
			return;
		}
		if ("error" in holdings) {
			if (holdings.error === "invalid token") handleLogout();
		}
		const holdingSymbols = holdings.map((holding) => holding.symbol);
		const stockData = await getStockData(holdingSymbols);
		for (let h = 0; h < holdings.length; h++) {
			for (let i = 0; i < stockData.length; i++) {
				if (holdings[i].symbol === stockData[h].symbol) {
					holdings[i].marketValue = stockData[h].latestPrice;
					holdings[i].companyName = stockData[h].companyName;
				}
			}
		}

		setHoldings(holdings);
		setIsAccountLoading(false);
	}, [handleLogout]);

	useEffect(() => {
		updateAccountInfo();
		updateAccountHoldings();
	}, [updateAccountInfo, updateAccountHoldings]);

	async function updateWatchlist(commaSeparatedSymbols) {
		const stockData = await getStockData(commaSeparatedSymbols);
		setWatchlist(stockData);
	}

	return (
		<AccountContext.Provider
			value={{
				accountNumber,
				cashBalance,
				holdings,
				watchList,
				updateAccountInfo,
				updateAccountHoldings,
				isAccountLoading,
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
