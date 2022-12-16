import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import "./Stock.css";
import Button from "react-bootstrap/esm/Button";
import TradeModal from "../TradeModal/TradeModal";

export default function Stock({
	symbol,
	companyName,
	askPrice,
	bidPrice,
	change,
	changePercent,
	openPrice,
	closePrice,
	previousClose,
	week52High,
	week52Low,
	isUSMarketOpen,
}) {
	const [showTradeModal, setShowTradeModal] = useState(false);

	const handleClose = () => setShowTradeModal(false);
	const handleShow = () => setShowTradeModal(true);

	const today = new Date();
	const dateTime = `${today.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	})} ${today.toLocaleDateString()}`;

	return (
		<div className="stock-card">
			<Row className="mb-2">
				<Col md={8}>
					<span className="stock-header">
						{companyName} ({symbol}){" "}
					</span>
					<Button
						disabled={isUSMarketOpen}
						size="sm"
						className="trade-btn"
						variant="success"
						onClick={handleShow}
					>
						Trade
					</Button>
					<span className="closed">
						{!isUSMarketOpen && " Market is closed."}
					</span>
				</Col>
				<Col className="align-right">
					<Button size="sm" variant="secondary">
						Add to Watchlist
					</Button>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Price</div>
					<div className="stock-stat">
						{askPrice !== 0 ? askPrice : closePrice}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Todays's Change</div>
					<div className="stock-stat">
						{change} ({changePercent}%)
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Bid Price</div>
					<div className="stock-stat">{bidPrice}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Ask Price</div>
					<div className="stock-stat">{askPrice}</div>
				</Col>
				<hr />
			</Row>
			<Row className="mb-2">
				<Col>
					<div className="stock-stat-header">Open Price</div>
					<div className="stock-stat-secondary">{openPrice}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Close Price</div>
					<div className="stock-stat-secondary">
						{isUSMarketOpen ? "-" : closePrice}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Previous Close</div>
					<div className="stock-stat-secondary">{previousClose}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">52 Week High</div>
					<div className="stock-stat-secondary">{week52High}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">52 Week Low</div>
					<div className="stock-stat-secondary">{week52Low}</div>
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
				askPrice={askPrice}
			/>
		</div>
	);
}
