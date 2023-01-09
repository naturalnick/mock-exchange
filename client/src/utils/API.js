import axios from "axios";

function getTokenFromCookie() {
	const cname = "token=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		let c = cookies[0];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(cname) === 0) {
			return c.substring(cname.length, c.length);
		}
	}
	return "";
}

function setErrorMessage(error) {
	if (error.response.status === 500) {
		return { error: "Server connection failed." };
	} else {
		return { error: error.response.data.error };
	}
}

export async function registerAccount(email, password) {
	const response = await axios
		.post("/register", {
			email: email,
			password: password,
		})
		.catch((error) => {
			return setErrorMessage(error);
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
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data : response;
}

export async function getAccount() {
	const token = getTokenFromCookie();
	const response = await axios
		.get("/api/account/info", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data : response;
}

export async function getHoldings() {
	const token = getTokenFromCookie();
	const response = await axios
		.get("/api/account/holdings", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			return setErrorMessage(error);
		});

	return response.status === 200 ? response.data.holdings : response;
}

export async function getDailyTotals() {
	const token = getTokenFromCookie();
	const response = await axios
		.get(`/api/account/totals`, {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data.totals : response;
}

export async function toggleWatched(symbol) {
	const token = getTokenFromCookie();
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
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data.holdings : response;
}

export async function getStockData(symbols) {
	const symbolString = symbols.length > 1 ? symbols.join(",") : symbols;
	const response = await axios
		.get(`/api/stock/quote?symbols=${symbolString}`)
		.catch((error) => {
			return setErrorMessage(error);
		});

	return response.status === 200 ? response.data : response;
}

export async function searchStocks(query) {
	const response = await axios
		.get(`/api/stock/search?query=${query}`)
		.catch((error) => {
			console.log(setErrorMessage(error));
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data : response;
}

export async function getTransactions() {
	const token = getTokenFromCookie();
	const response = await axios
		.get("/api/account/transactions", {
			headers: { Authorization: `token ${token}` },
		})
		.catch((error) => {
			return setErrorMessage(error);
		});
	return response.status === 200 ? response.data.transactions : response;
}

export async function tradeStock(transaction) {
	const token = getTokenFromCookie();
	const response = await axios
		.post(
			"/api/trade",
			{
				symbol: transaction.symbol,
				quantity: transaction.quantity,
				cost_per_share: transaction.price,
			},
			{
				headers: { Authorization: `token ${token}` },
			}
		)
		.catch((error) => {
			return setErrorMessage(error);
		});
	return response;
}
