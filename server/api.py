import requests
import os
from dotenv import load_dotenv

load_dotenv()

# FINNHUB for stock quotes
FINNHUB_TOKEN = os.getenv("FINNHUB_TOKEN")

# ALPHAVANTAGE for stock searching
ALPHA_VANTAGE_TOKEN = os.getenv("ALPHA_VANTAGE_TOKEN")


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
        url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={query}&apikey={ALPHA_VANTAGE_TOKEN}"
        response = requests.get(url)
        data = response.json()
        bestMatches = data["bestMatches"]
        results = [
            {"symbol": stock["1. symbol"], "name": stock["2. name"]}
            for stock in bestMatches
            if stock["4. region"] == "United States"
        ]

        return results
    except:
        return None
