import axios from "axios";

export async function registerAccount(email, password) {
	const response = await axios
		.post("/register", {
			email: email,
			password: password,
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

export async function loginAccount(email, password) {
	const response = await axios
		.post("/login", {
			email: email,
			password: password,
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

export async function getAccount(token) {
	const response = await axios
		.get("/api/account/info", {
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
		.get("/api/account/holdings", {
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
		.get(`/api/account/totals`, {
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
			"/api/account/watchlist",
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
		.get(`/api/stock?symbol=${symbol}`)
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
	const response = await axios.get("/api/stock_list").catch((error) => {
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
		.get("/api/account/transactions", {
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
