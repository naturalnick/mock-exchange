import axios from "axios";

export async function getAccount(token) {
	const response = await axios
		.get(`http://127.0.0.1:5001/api/account/info?token=${token}`)
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
		.get(`http://127.0.0.1:5001/api/account/holdings?token=${token}`)
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
		.get(`http://127.0.0.1:5001/api/account/values?token=${token}`)
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	return response.status === 200 ? response.data.values : response;
}

export async function toggleWatched(token, symbol, shouldWatch) {
	const response = await axios
		.post("http://127.0.0.1:5001/api/account/watchlist", {
			token: token,
			symbol: symbol,
			shouldWatch: shouldWatch,
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data.error };
			}
		});
	console.log(response);
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
