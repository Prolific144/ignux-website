# create_tables.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.models import Base

print("Creating database tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")