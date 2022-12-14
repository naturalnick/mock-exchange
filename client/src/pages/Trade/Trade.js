import axios from "axios";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";

export default function Trading() {
	const [stock, setStock] = useState({});
	async function handleSearch(symbol) {
		const response = await axios.get(
			`http://127.0.0.1:5001/api/stock?symbol=${symbol}`
		);
		console.log(response);
		setStock(response.data);
	}

	console.log(stock);
	return (
		<div>
			<h2>Trade</h2>
			<SearchBar handleSearch={handleSearch} />
			{stock !== {} && <Stock {...stock} />}
		</div>
	);
}
