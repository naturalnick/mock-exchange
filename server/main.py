from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()


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

        # from database import daily_totals
        # Thread(target=daily_totals, daemon=True).start()

        return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
