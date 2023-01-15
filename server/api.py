import requests
import os
from dotenv import load_dotenv

load_dotenv()

# FINNHUB for stock quotes
FINNHUB_TOKEN = os.getenv("FINNHUB_TOKEN")

# FMP for stock searching
FMP_TOKEN = os.getenv("FMP_TOKEN")


def get_stock_data(symbols):
    stock_data = []
    for symbol in symbols:
        try:
            finnhub_url = "https://finnhub.io/api/v1"

            res1 = requests.get(
                f"{finnhub_url}/quote?symbol={symbol}&token={FINNHUB_TOKEN}"
            )
            stock = res1.json()
            res2 = requests.get(
                f"{finnhub_url}/stock/profile2?symbol={symbol}&token={FINNHUB_TOKEN}"
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


def search_stocks(query):
    try:
        fmp_url = "https://financialmodelingprep.com/api/v3"
        exchanges = "NASDAQ,NYSE"
        max_results = "10"
        search_url = f"{fmp_url}/search?query={query}&limit={max_results}&exchange={exchanges}&apikey={FMP_TOKEN}"
        response = requests.get(search_url)
        results = response.json()

        for x in range(0, len(results)):
            if results[x]["symbol"] == query.upper():
                results.insert(0, results.pop(x))

        return results
    except:
        return None
