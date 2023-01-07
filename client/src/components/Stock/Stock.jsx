import { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import TradeModal from "../TradeModal/TradeModal";
import { useAuth } from "../../context/AuthProvider";
import { useAccount } from "../../context/AccountProvider";
import { toggleWatched } from "../../utils/API";
import "./Stock.css";

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
	const { token } = useAuth();
	const { updateAccountInfo, watchList } = useAccount();
	const [showTradeModal, setShowTradeModal] = useState(false);
	const [isWatched, setIsWatched] = useState(false);

	const handleClose = () => setShowTradeModal(false);
	const handleShow = () => setShowTradeModal(true);

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
		await toggleWatched(token, symbol, !isWatched);
		updateAccountInfo();
	}

	function displayTodaysChange() {
		const changeStyle =
			change < 0 ? "stock-stat decrease" : "stock-stat increase";
		const changePrefix = change < 0 ? "-" : "+";
		const formattedChange = change < 0 ? String(change).slice(1) : change;
		const formattedChangePercent = (Number(changePercent) * 100).toFixed(2);
		return (
			<div className={changeStyle}>
				{changePrefix}${formattedChange} ({formattedChangePercent}%)
			</div>
		);
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
					<Button size="sm" variant="success" onClick={handleShow}>
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
					<div className="stock-stat">${latestPrice}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Todays's Change</div>
					{displayTodaysChange()}
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Open Price</div>
					<div className="stock-stat-secondary">${open}</div>
				</Col>

				<Col>
					<div className="stock-stat-header">Previous Close</div>
					<div className="stock-stat-secondary">${previousClose}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Day High/Low</div>
					<div className="stock-stat-secondary">
						${high}/${low}
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="stock-footer">Quote as of {dateTime}</div>
				</Col>
			</Row>
			<TradeModal
				handleClose={handleClose}
				showTradeModal={showTradeModal}
				symbol={symbol}
				price={latestPrice}
			/>
		</div>
	);
}
