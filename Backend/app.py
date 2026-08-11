import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import settings
from models import Base, engine

from routes.auth import bp as auth_bp
from routes.clientes import bp as clientes_bp
from routes.miniaturas import bp as miniaturas_bp
from routes.pedidos import bp as pedidos_bp
from routes.dashboard import bp as dashboard_bp
from routes.whatsapp import bp as whatsapp_bp
from routes.gastos import bp as gastos_bp


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "uploads"
    )

    CORS(app, origins=settings.CORS_ORIGINS, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(clientes_bp, url_prefix="/api")
    app.register_blueprint(miniaturas_bp, url_prefix="/api")
    app.register_blueprint(pedidos_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    app.register_blueprint(whatsapp_bp, url_prefix="/api")
    app.register_blueprint(gastos_bp, url_prefix="/api")

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "garagem-156a"}), 200

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "message": "Garagem 156A API",
            "version": "1.0.0",
            "docs": "/health"
        }), 200

    return app


app = create_app()

with app.app_context():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    app.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
