import { useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import "./Stock.css";
import Button from "react-bootstrap/esm/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import TradeModal from "../TradeModal/TradeModal";
import { useAuth } from "../../context/AuthProvider";
import { useAccount } from "../../context/AccountProvider";
import { useEffect } from "react";

const askPricePopover = (
	<Popover id="ask-price-popover">
		<Popover.Header as="h3">Ask Price</Popover.Header>
		<Popover.Body>
			The lowest price at which a seller will sell the stock at any given
			time.
		</Popover.Body>
	</Popover>
);

const bidPricePopover = (
	<Popover id="bid-price-popover">
		<Popover.Header>Bid Price</Popover.Header>
		<Popover.Body>
			The highest price a buyer will pay to buy a specified number of shares
			of a stock at any given time.
		</Popover.Body>
	</Popover>
);

export default function Stock({
	symbol,
	companyName,
	latestPrice,
	high,
	low,
	askPrice,
	bidPrice,
	change,
	changePercent,
	open,
	close,
	previousClose,
	week52High,
	week52Low,
	isUSMarketOpen,
}) {
	const { token } = useAuth();
	const { updateAccountInfo, watchList } = useAccount();
	const [showTradeModal, setShowTradeModal] = useState(false);
	const [isWatched, setIsWatched] = useState(false);

	const handleClose = () => setShowTradeModal(false);
	const handleShow = () => setShowTradeModal(true);

	useEffect(() => {
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

	async function updateWatchlist() {
		const response = await axios.post(
			"http://127.0.0.1:5001/api/account/watchlist",
			{
				token: token,
				symbol: symbol,
				action: isWatched ? "remove" : "add",
			}
		);
		if (response.status === 200) {
			updateAccountInfo();
		} else {
			console.log("error");
		}
	}

	return (
		<div className="stock-card">
			<Row className="mb-2">
				<Col md={4}>
					<span className="stock-header">
						{companyName} ({symbol}){" "}
					</span>
				</Col>
				<Col md={4}>
					<Button
						disabled={isUSMarketOpen}
						size="sm"
						variant="success"
						onClick={handleShow}
					>
						Trade
					</Button>
					<span className="closed">
						{!isUSMarketOpen && " Market is closed."}
					</span>
				</Col>
				<Col md={4} className="align-right">
					<Button size="sm" variant="secondary" onClick={updateWatchlist}>
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
					<div
						className={`stock-stat ${
							change < 0 ? "decrease" : "increase"
						}`}
					>
						{change < 0 && "-"}${change < 0 && String(change).slice(1)} (
						{Number(changePercent) * 100}%)
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">
						Bid Price{" "}
						<OverlayTrigger placement="bottom" overlay={bidPricePopover}>
							<img
								src={require("../../images/info.png")}
								alt="info"
								width={"17px"}
							/>
						</OverlayTrigger>
					</div>
					<div className="stock-stat">
						{bidPrice !== null ? bidPrice : "-"}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">
						Ask Price{" "}
						<OverlayTrigger placement="bottom" overlay={askPricePopover}>
							<img
								src={require("../../images/info.png")}
								alt="info"
								width={"17px"}
							/>
						</OverlayTrigger>
					</div>
					<div className="stock-stat">
						{askPrice !== null ? askPrice : "-"}
					</div>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Open Price</div>
					<div className="stock-stat-secondary">{open}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Close Price</div>
					<div className="stock-stat-secondary">
						{isUSMarketOpen ? "-" : close}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Previous Close</div>
					<div className="stock-stat-secondary">{previousClose}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Day High/Low</div>
					<div className="stock-stat-secondary">
						${high} / ${low}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">52-Week High/Low</div>
					<div className="stock-stat-secondary">
						${week52High} / ${week52Low}
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="stock-footer">
						Quote as of {isUSMarketOpen ? dateTime : "market close."}
					</div>
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
