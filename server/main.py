from flask import Flask
from flask_cors import CORS
import os
import pytz
from datetime import datetime, date
from apscheduler.schedulers.background import BackgroundScheduler
from database import check_daily_total_logged, set_account_totals
from dotenv import load_dotenv

load_dotenv()


def daily_totals():
    with app.app_context():
        today = str(date.today())
        current_hour = int(datetime.now().astimezone(pytz.utc).strftime("%H"))
        us_market_closing_hour_utc = 21  # 4PM EST
        print(f"Server status check. Date: {today}, Hour: {current_hour}/24 (UTC).")
        if (
            check_daily_total_logged(today) is False
            and current_hour > us_market_closing_hour_utc
        ):
            print("Assigning account totals.")
            set_account_totals(today)


def create_app():
    app = Flask(__name__, static_folder=None)
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_CONFIG")
    cors = CORS(app, resources={r"/": {"origins": "*"}})
    from models import db

    db.init_app(app)

    with app.app_context():
        from models import Account, Holdings, Transactions, DailyTotals

        db.create_all()

        from routes import blueprint

        app.register_blueprint(blueprint)

        sched = BackgroundScheduler(daemon=True)
        sched.add_job(
            daily_totals, "interval", minutes=60, id="totals", replace_existing=True
        )
        sched.start()

        return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5001)
