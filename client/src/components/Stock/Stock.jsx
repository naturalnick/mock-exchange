import { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import TradeModal from "../Modals/TradeModal";
import { useAccount } from "../../context/AccountProvider";
import { toggleWatched } from "../../utils/API";
import "./Stock.css";
import {
	formatDecoratedPrice,
	formatPercentage,
	formatPrice,
} from "../../utils/Utils";

export default function Stock({
	symbol,
	companyName,
	latestPrice,
	change,
	changePercent,
	open,
	high,
	low,
	previousClose,
}) {
	const { updateAccountInfo, watchList } = useAccount();
	const [isWatched, setIsWatched] = useState(false);

	const [showTradeModal, setShowTradeModal] = useState(false);
	const handleTradeClose = () => setShowTradeModal(false);
	const handleTradeShow = () => setShowTradeModal(true);

	useEffect(() => {
		setIsWatched(false);
		for (let i = 0; i < Object.keys(watchList).length; i++) {
			if (watchList[i].symbol === symbol) {
				setIsWatched(true);
			}
		}
	}, [watchList, symbol]);

	const today = new Date();
	const dateTime = `${today.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	})} ${today.toLocaleDateString()}`;

	async function handleWatchlist() {
		await toggleWatched(symbol);
		updateAccountInfo();
	}

	return (
		<div className="stock-card">
			<Row className="mb-2">
				<Col>
					<span className="stock-header">
						{companyName} ({symbol}){" "}
					</span>
				</Col>
				<Col md={6} className="align-right">
					<Button size="sm" variant="success" onClick={handleTradeShow}>
						Trade
					</Button>{" "}
					<Button size="sm" variant="secondary" onClick={handleWatchlist}>
						{isWatched ? "Remove from " : "Add to "} Watchlist
					</Button>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Price</div>
					<div className="stock-stat">{formatPrice(latestPrice)}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Todays's Change</div>
					<div className="stock-stat">
						{formatDecoratedPrice(change)} (
						{formatPercentage(changePercent)})
					</div>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Open Price</div>
					<div className="stock-stat-secondary">{formatPrice(open)}</div>
				</Col>

				<Col>
					<div className="stock-stat-header">Previous Close</div>
					<div className="stock-stat-secondary">
						{formatPrice(previousClose)}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Day High/Low</div>
					<div className="stock-stat-secondary">
						{formatPrice(high)}/{formatPrice(low)}
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="stock-footer">Quote as of {dateTime}</div>
				</Col>
			</Row>
			<TradeModal
				handleClose={handleTradeClose}
				showModal={showTradeModal}
				symbol={symbol}
				price={latestPrice}
			/>
		</div>
	);
}
