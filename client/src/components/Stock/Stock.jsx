import { useState, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import "./Stock.css";
import Button from "react-bootstrap/esm/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { askPricePopover, bidPricePopover } from "../Popovers/Popovers";
import TradeModal from "../TradeModal/TradeModal";
import { useAuth } from "../../context/AuthProvider";
import { useAccount } from "../../context/AccountProvider";
import { toggleWatched } from "../../utils/API";

export default function Stock({
	symbol,
	companyName,
	latestPrice,
	iexAskPrice,
	iexBidPrice,
	change,
	changePercent,
	iexOpen,
	iexClose,
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
					<Button
						disabled={!isUSMarketOpen}
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
				<Col className="align-right">
					<Button size="sm" variant="secondary" onClick={handleWatchlist}>
						{isWatched ? "Remove from " : "Add to "} Watchlist
					</Button>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col md={6}>
					<div className="stock-stat-header">Company</div>
					<span className="stock-header">
						{companyName} ({symbol}){" "}
					</span>
				</Col>
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
					<div className="stock-stat-secondary">
						{iexAskPrice !== 0 ? iexAskPrice : "-"}
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
					<div className="stock-stat-secondary">
						{iexBidPrice !== 0 ? iexBidPrice : "-"}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Open Price</div>
					<div className="stock-stat-secondary">${iexOpen}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Close Price</div>
					<div className="stock-stat-secondary">
						{isUSMarketOpen ? "-" : `$${iexClose}`}
					</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Previous Close</div>
					<div className="stock-stat-secondary">${previousClose}</div>
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
