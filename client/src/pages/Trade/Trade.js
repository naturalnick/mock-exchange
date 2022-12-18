import axios from "axios";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";
import { useAccount } from "../../context/AccountProvider";

export default function Trade() {
	const { watchList } = useAccount();
	const [stock, setStock] = useState({});

	async function handleSearch(symbol) {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/stock?symbol=${symbol}`
		);
		setStock(response.data);
	}

	function displayStocks() {
		return Object.keys(stock).length !== 0 ? (
			<Stock {...stock} />
		) : (
			<p>Search results will show here...</p>
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
				{displayStocks()}
			</div>
			<div>
				<h2 className="mt-5">Watchlist</h2>
				{displayWatchedStocks()}
			</div>
		</div>
	);
}
