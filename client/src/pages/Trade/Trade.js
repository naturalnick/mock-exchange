import { useState } from "react";
import Col from "react-bootstrap//Col";
import Row from "react-bootstrap/esm/Row";
import SearchBar from "../../components/SearchBar/SearchBar";
import Stock from "../../components/Stock/Stock";
import { useAccount } from "../../context/AccountProvider";

export default function Trade() {
	const { watchList } = useAccount();
	const [stock, setStock] = useState([]);

	function displaySearchedStock() {
		return (
			Object.keys(stock).length !== 0 && (
				<Col xl={6} className="mt-3">
					<Stock {...stock[0]} />
				</Col>
			)
		);
	}

	function displayWatchedStocks() {
		if (watchList.length > 0) {
			return watchList.map((item) => {
				return (
					<Col xl={6} key={item.symbol}>
						<Stock {...item} />
					</Col>
				);
			});
		} else {
			return (
				<p>
					Search for stocks then add them to your watchlist for easy
					access.
				</p>
			);
		}
	}

	return (
		<div>
			<div>
				<h2>Search Stocks</h2>
				<SearchBar setStock={setStock} />
				<Row>{displaySearchedStock()}</Row>
			</div>
			<div>
				<h2 className="mt-5">Watchlist</h2>
				<Row>{displayWatchedStocks()}</Row>
			</div>
		</div>
	);
}
