import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import "./Stock.css";
import Button from "react-bootstrap/esm/Button";

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
	return (
		<div className="stock-card">
			<Row>
				<Col>
					<span className="stock-header">
						{companyName} ({symbol}){" "}
					</span>
					<Button
						disabled={!isUSMarketOpen}
						size="sm"
						className="trade-btn"
					>
						Trade
					</Button>
					<span className="closed">
						{!isUSMarketOpen && " Market is closed."}
					</span>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="stock-stat-header">Price</div>
					<div className="stock-stat">{askPrice}</div>
				</Col>
				<Col>
					<div className="stock-stat-header">Todays's Change</div>
					<div className="stock-stat">
						{change} {changePercent}%
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
			</Row>
			<Row>
				<Col>
					<div className="stock-footer">Quote as of CURRENT DATE HERE</div>
				</Col>
			</Row>
		</div>
	);
}
