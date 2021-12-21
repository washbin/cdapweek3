from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pika import BlockingConnection, URLParameters

ORIGINS = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

PARAMETERS = URLParameters(getenv("RABBITMQ_CONNECTION_URI"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/orders/{item_id}")
async def order_item(item_id: int):
    try:
        connection = BlockingConnection(PARAMETERS)
        channel = connection.channel()
        channel.queue_declare(queue="orders")
        channel.basic_publish(exchange="", routing_key="orders", body=f"{item_id}")
        connection.close()
    except Exception as _:
        return {"msg": "Product Order Failed"}, 500
    return {"msg": "Post successfully"}, 200
