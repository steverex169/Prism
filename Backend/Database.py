import os
from pathlib import Path
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Ensure .env is loaded
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "prismwellness")

# URL-encode password in case it contains special characters (@, :, /, %, etc.)
encoded_password = quote_plus(MYSQL_PASSWORD) if MYSQL_PASSWORD else ""

if encoded_password:
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
else:
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

base = declarative_base()
