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
		const holdingsData = await getHoldings();

		if (holdingsData.length === 0) {
			setHoldings([]);
			setIsAccountLoading(false);
		} else {
			if ("error" in holdingsData) {
				if (holdingsData.error === "invalid token") handleLogout();
			}
			const holdingSymbols = holdingsData.map((holding) => holding.symbol);

			const stockData = await getStockData(holdingSymbols);

			for (let h = 0; h < holdingsData.length; h++) {
				for (let i = 0; i < stockData.length; i++) {
					if (holdingsData[h].symbol === stockData[i].symbol) {
						holdingsData[h].marketValue = stockData[i].latestPrice;
						holdingsData[h].companyName = stockData[i].companyName;
					}
				}
			}

			setHoldings(holdingsData);
			setIsAccountLoading(false);
		}
	}, [handleLogout]);

	useEffect(() => {
		updateAccountInfo();
		updateAccountHoldings();
	}, [updateAccountInfo, updateAccountHoldings]);

	async function updateWatchlist(commaSeparatedSymbols) {
		const stockData = await getStockData(commaSeparatedSymbols);
		if ("error" in stockData) setWatchlist([]);
		else setWatchlist(stockData);
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
