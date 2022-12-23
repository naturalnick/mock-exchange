import axios from "axios";

export async function getAccount(token) {
	const response = await axios
		.get("http://127.0.0.1:5001/api/account/info", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	return response.status === 200 ? response.data : response;
}

export async function getHoldings(token) {
	const response = await axios
		.get("http://127.0.0.1:5001/api/account/holdings", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});

	return response.status === 200 ? response.data.holdings : response;
}

export async function getDailyTotals(token) {
	const response = await axios
		.get(`http://127.0.0.1:5001/api/account/totals`, {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	return response.status === 200 ? response.data.totals : response;
}

export async function toggleWatched(token, symbol, shouldWatch) {
	const response = await axios
		.post(
			"http://127.0.0.1:5001/api/account/watchlist",
			{
				symbol: symbol,
			},
			{
				headers: { Authorization: `token ${token}` },
			}
		)
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	return response.status === 200 ? response.data.holdings : response;
}

export async function getStockData(symbol) {
	const response = await axios
		.get(`http://127.0.0.1:5001/api/stock?symbol=${symbol}`)
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});

	return response.status === 200 ? response.data : response;
}

export async function getStockList() {
	const response = await axios
		.get("http://127.0.0.1:5001/api/stock_list")
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});

	return response.status === 200 ? response.data : response;
}

export async function getTransactions(token) {
	const response = await axios
		.get("http://127.0.0.1:5001/api/account/transactions", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	return response.status === 200 ? response.data.transactions : response;
}
