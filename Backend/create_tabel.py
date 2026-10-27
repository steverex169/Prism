from Database import engine, base
from Model import Hero_model,Email_model,User_model,order_model,product_model,shipping_model,abandoned_cart_model,contact_model,email_model

base.metadata.create_all(bind=engine)
from Services.schema import migrate_email_schema
migrate_email_schema()
