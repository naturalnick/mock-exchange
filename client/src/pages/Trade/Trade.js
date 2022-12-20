import axios from "axios";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";
import { useAccount } from "../../context/AccountProvider";

export default function Trade() {
	const { watchList } = useAccount();
	const [stock, setStock] = useState({});
	const [error, setError] = useState("");

	async function handleSearch(symbol) {
		const response = await axios
			.get(`http://127.0.0.1:5001/api/stock?symbol=${symbol}`)
			.catch((error) => {
				if (error.message === "Network Error") {
					setError("Server connection failed.");
				} else {
					setError(error.response.data.error);
				}
				console.log(error);
			});
		if (response && response.status === 200) setStock(response.data);
	}

	function displayStocks() {
		return Object.keys(stock).length !== 0 ? (
			<Stock {...stock} />
		) : (
			<div>Search results will show here...</div>
		);
	}

	function displayWatchedStocks() {
		return watchList.length > 0 ? (
			watchList.map((item) => {
				return <Stock key={item.symbol} {...item} />;
			})
		) : (
			<p>
				Search for stocks, then add them to your watchlist to for easy
				access.
			</p>
		);
	}

	return (
		<div>
			<div>
				<h2>Search Stocks By Symbol</h2>
				<SearchBar handleSearch={handleSearch} />
				{error === "" ? (
					displayStocks()
				) : (
					<span className="error">{error}</span>
				)}
			</div>
			<div>
				<h2 className="mt-5">Watchlist</h2>
				{displayWatchedStocks()}
			</div>
		</div>
	);
}
