import requests
import os
from dotenv import load_dotenv

load_dotenv()

FINNHUB_TOKEN = os.getenv("FINNHUB_TOKEN")
FMP_TOKEN = os.getenv("FMP_TOKEN")
TWELVE_TOKEN = os.getenv("TWELVE_TOKEN")

# FINNHUB STOCK DATA
def get_stock_data(symbols):
    stock_data = []
    for symbol in symbols:
        try:
            res1 = requests.get(
                f"https://finnhub.io/api/v1/quote?symbol=AAPL&token={FINNHUB_TOKEN}"
            )
            stock = res1.json()
            res2 = requests.get(
                f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB_TOKEN}"
            )
            company_name = res2.json()["name"]
            stock_data.append(
                {
                    "symbol": symbol,
                    "companyName": company_name,
                    "latestPrice": stock["c"],
                    "change": stock["d"],
                    "changePercent": stock["dp"],
                    "high": stock["h"],
                    "low": stock["l"],
                    "open": stock["o"],
                    "previousClose": stock["pc"],
                }
            )
        except:
            stock_data.append(
                {
                    "symbol": symbol,
                    "companyName": None,
                    "latestPrice": None,
                    "change": None,
                    "changePercent": None,
                    "high": None,
                    "low": None,
                    "open": None,
                    "previousClose": None,
                }
            )
    return stock_data


# # TWELVE STOCK DATA
# def get_stock_data2(symbols):

#     try:
#         res1 = requests.get(
#             f"https://api.twelvedata.com/quote?symbol={symbols}&apikey={TWELVE_TOKEN}"
#         )
#         res2 = requests.get(
#             f"https://api.twelvedata.com/price?symbol={symbols}&apikey={TWELVE_TOKEN}"
#         )

#         isBatch = "," in symbols

#         if isBatch:
#             stocks = list(res1.json().values())

#             prices = [
#                 {"symbol": key, "price": value["price"]}
#                 for key, value in res2.json().items()
#             ]

#             for stock in stocks:
#                 for price in prices:
#                     if stock["symbol"] == price["symbol"]:
#                         stock["price"] = price["price"]
#         else:
#             stocks = res1.json()
#             price = res2.json()
#             stocks["price"] = price["price"]
#             stocks = [stocks]
#         return [
#             {
#                 "symbol": stock["symbol"],
#                 "companyName": stock["name"],
#                 "latestPrice": stock["price"],
#                 "change": stock["change"],
#                 "changePercent": stock["percent_change"],
#                 "high": stock["high"],
#                 "low": stock["low"],
#                 "open": stock["open"],
#                 "previousClose": stock["close"],
#             }
#             for stock in stocks
#         ]
#     except:
#         return None


def search_stocks(text):
    try:
        res1 = requests.get(
            f"https://financialmodelingprep.com/api/v3/search?query={text}&limit=10&exchange=NASDAQ,NYSE&apikey={FMP_TOKEN}"
        )
        return res1.json()
    except:
        return None
