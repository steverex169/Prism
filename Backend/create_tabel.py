from Database import engine, base
from Model import Hero_model,Email_model,User_model

base.metadata.create_all(bind=engine)