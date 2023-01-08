import { useEffect, useState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import { getStockData, searchStocks } from "../../utils/API";
import Suggestion from "./Suggestion";
import "./SearchBar.css";

export default function SearchBar({ setStock }) {
	const [input, setInput] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState("");

	const getSuggestions = useCallback(async (query) => {
		const queriedStocks = await searchStocks(query.toLowerCase());

		if (queriedStocks.length > 0) {
			setSuggestions(queriedStocks);
		} else {
			setSuggestions([]);
			setError("No stocks found.");
		}
	}, []);

	useEffect(() => {
		const delayTimer = setTimeout(() => {
			if (input !== "") getSuggestions(input);
			else setSuggestions([]);
			setIsSearching(false);
		}, 1000);
		return () => clearTimeout(delayTimer);
	}, [input, getSuggestions]);

	function handleKeyDown(e) {
		if (e.key === "Enter") {
		} else {
			setIsSearching(true);
			setStock({});
		}
	}

	function displaySuggestions() {
		if (suggestions.length > 0) {
			return suggestions.map((suggestion) => {
				return (
					<Suggestion
						key={suggestion.symbol}
						{...suggestion}
						handleClick={handleSuggestionClicked}
					/>
				);
			});
		} else if (!isSearching) {
			return <>{error}</>;
		}
	}

	async function handleSuggestionClicked(symbol) {
		const stockData = await getStockData([symbol]);
		if ("error" in stockData) {
			setError(stockData.error);
		} else {
			setStock(stockData);
			setIsSearching(false);
			setInput("");
		}
		setSuggestions([]);
	}

	return (
		<div className="search-container">
			<Form.Control
				placeholder="Search by Ticker Symbol or Company Name"
				aria-label="Stock Ticker Symbol"
				aria-describedby="stock-ticker"
				type="text"
				value={input || ""}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			{!isSearching && input !== "" && (
				<div className="suggestion-container">{displaySuggestions()}</div>
			)}
		</div>
	);
}
