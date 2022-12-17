import axios from "axios";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";

export default function Trade() {
	const [stock, setStock] = useState({});

	async function handleSearch(symbol) {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/stock?symbol=${symbol}`
		);
		setStock(response.data);
	}

	function displayStocks() {
		return Object.keys(stock).length !== 0 && <Stock {...stock} />;
	}

	return (
		<div>
			<div>
				<h2>Search Stocks By Symbol</h2>
				<SearchBar handleSearch={handleSearch} />
				{displayStocks()}
			</div>
			<div>
				{/* <h2>Watchlist</h2>
				{displayStocks()} */}
			</div>
		</div>
	);
}
