from app import app

application = app

application.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
application.config["SQLALCHEMY_TRACK_MODIFICATIONS "] = False

if __name__ == '__main__':
    application.run()