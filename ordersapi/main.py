from os import getenv

from pika import BlockingConnection, ConnectionParameters

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ORIGINS = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

PARAMETERS = ConnectionParameters(
    host=getenv("RABBITMQ_HOST"), connection_attempts=5, retry_delay=1
)

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
    connection = BlockingConnection(PARAMETERS)
    channel = connection.channel()
    channel.queue_declare(queue="orders")
    channel.basic_publish(exchange="", routing_key="orders", body=f"{item_id}")
    connection.close()
    return {"msg": "Post successfully"}
