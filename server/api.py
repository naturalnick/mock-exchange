import requests
import os
from dotenv import load_dotenv

load_dotenv()

fmp_token = os.getenv("FMP_TOKEN")

def get_stock_data(symbols):
	try:
		response = requests.get(f"https://financialmodelingprep.com/api/v3/quote/{symbols}?apikey={fmp_token}")
		stocks = response.json()
		return [{"symbol": stock["symbol"], "companyName": stock["name"], "latestPrice": stock["price"], "change": stock["change"], "changePercent": stock["changesPercentage"], "high": stock["dayHigh"], "low": stock["dayLow"], "open": stock["open"], "previousClose": stock["previousClose"] } for stock in stocks]
	except:
		return None


def search_stocks(text):
	try:
		res1 = requests.get(f"https://financialmodelingprep.com/api/v3/search?query={text}&limit=10&exchange=NASDAQ,NYSE&apikey={fmp_token}")
		return res1.json()
	except:
		return None
