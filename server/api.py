import requests
import os
from dotenv import load_dotenv

load_dotenv()

fmp_token = os.getenv("FMP_TOKEN")

def get_stock_data(symbol):
	try:
		response = requests.get(f"https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey={fmp_token}")
		data = response.json()[0]
		return {"symbol": symbol, "companyName": data["name"], "latestPrice": data["price"], "change": data["change"], "changePercent": data["changesPercentage"], "high": data["dayHigh"], "low": data["dayLow"], "open": data["open"], "previousClose": data["previousClose"] }
	except:
		print("Request error.")
		return None


def search_stocks(text):
	try:
		res1 = requests.get(f"https://financialmodelingprep.com/api/v3/search?query={text}&limit=10&exchange=NASDAQ,NYSE&apikey={fmp_token}")
		return res1.json()
	except:
		print("Request error")
		return None
