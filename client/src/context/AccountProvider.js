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
	const { token } = useAuth();
	const [accountNumber, setAccountNumber] = useState(0);
	const [cashBalance, setCashBalance] = useState(0);
	const [holdings, setHoldings] = useState([]);
	const [watchList, setWatchlist] = useState([]);
	const [isAccountLoading, setIsAccountLoading] = useState(true);

	const updateAccountInfo = useCallback(async () => {
		setIsAccountLoading(true);
		const account = await getAccount(token);

		setAccountNumber(Number(account.account_number));
		setCashBalance(Number(account.balance));
		updateWatchlist(
			account.watch_list
				.split(" ")
				.filter((item) => item !== "" && item !== "[]")
			//TODO fix bug where emtpy array is saved to the watchlist when it's initially empty
		);
	}, [token]);

	const updateAccountHoldings = useCallback(async () => {
		const holdings = await getHoldings(token);

		for (let i = 0; i < holdings.length; i++) {
			const stockData = await getStockData(holdings[i].symbol);

			holdings[i].marketValue = stockData.latestPrice;

			holdings[i].companyName = stockData.companyName;
		}

		setHoldings(holdings);
		setIsAccountLoading(false);
	}, [token]);

	useEffect(() => {
		updateAccountInfo();
		updateAccountHoldings();
	}, [updateAccountInfo, updateAccountHoldings]);

	async function updateWatchlist(watchList) {
		const watchListData = [];
		for (let i = 0; i < watchList.length; i++) {
			const stockData = await getStockData(watchList[i]);
			watchListData.push(stockData);
		}
		setWatchlist(watchListData);
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
