import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";
import { useAccount } from "../../context/AccountProvider";
import { getStockData } from "../../utils/API";

export default function Trade() {
	const { watchList } = useAccount();
	const [stock, setStock] = useState({});
	const [error, setError] = useState("");

	async function handleSearch(symbol) {
		setError("");
		const stockData = await getStockData(symbol);

		if ("error" in stockData) {
			setError(stockData.error);
		} else setStock(stockData);
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
