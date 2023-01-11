import requests
import os
from dotenv import load_dotenv

load_dotenv()

FMP_TOKEN = os.getenv("FMP_TOKEN")
TWELVE_TOKEN = os.getenv("TWELVE_TOKEN")

# FMP QUOTE REQUEST - fails for no known reason
# def get_stock_data(symbols):
# 	try:
# 		response = requests.get(f"https://financialmodelingprep.com/api/v3/quote/{symbols}?apikey={FMP_TOKEN}")
# 		stocks = response.json()
# 		return [{"symbol": stock["symbol"], "companyName": stock["name"], "latestPrice": stock["price"], "change": stock["change"], "changePercent": stock["changesPercentage"], "high": stock["dayHigh"], "low": stock["dayLow"], "open": stock["open"], "previousClose": stock["previousClose"] } for stock in stocks]
# 	except:
# 		return None


def get_stock_data(symbols):

	try:
		res1 = requests.get(f"https://api.twelvedata.com/quote?symbol={symbols}&apikey={TWELVE_TOKEN}")
		res2 = requests.get(f"https://api.twelvedata.com/price?symbol={symbols}&apikey={TWELVE_TOKEN}")

		isBatch = "," in symbols

		if isBatch:
			stocks = list(res1.json().values())

			prices = [{"symbol": key, "price": value["price"]} for key, value in res2.json().items()]

			for stock in stocks:
				for price in prices:
					if stock["symbol"] == price["symbol"]:
						stock["price"] = price["price"]
		else:
			stocks = res1.json()
			price = res2.json()
			stocks["price"] = price["price"]
			stocks = [stocks]
		return [{"symbol": stock["symbol"], "companyName": stock["name"], "latestPrice": stock["price"], "change": stock["change"], "changePercent": stock["percent_change"], "high": stock["high"], "low": stock["low"], "open": stock["open"], "previousClose": stock["close"] } for stock in stocks]
	except:
		return None


def search_stocks(text):
	try:
		res1 = requests.get(f"https://financialmodelingprep.com/api/v3/search?query={text}&limit=10&exchange=NASDAQ,NYSE&apikey={FMP_TOKEN}")
		return res1.json()
	except:
		return None
