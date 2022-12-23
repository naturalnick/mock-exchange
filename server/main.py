from flask import Flask
from flask_cors import CORS
from threading import Thread
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
	app = Flask(__name__)
	app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_ACCESS")
	CORS(app)
	from models import db
	db.init_app(app)

	with app.app_context():
		from models import Account, Holdings, Transactions, DailyTotals, StockReference
		db.create_all()

		from routes import blueprint
		app.register_blueprint(blueprint)
		
		return app

app = create_app()

if __name__ == "__main__":
	from database import daily_totals
	Thread(target=daily_totals, daemon=True).start()
	app.run(debug=True,port=5001)