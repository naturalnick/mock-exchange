import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";
import { useAccount } from "../../context/AccountProvider";

export default function Trade() {
	const { watchList } = useAccount();
	const [stock, setStock] = useState({});

	function displaySearchedStock() {
		return Object.keys(stock).length !== 0 && <Stock {...stock} />;
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
				<SearchBar setStock={setStock} />
				{displaySearchedStock()}
			</div>
			<div>
				<h2 className="mt-5">Watchlist</h2>
				{displayWatchedStocks()}
			</div>
		</div>
	);
}
