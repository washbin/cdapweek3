package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/streadway/amqp"
	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

var (
	connectionURI = os.Getenv("RABBITMQ_CONNECTION_URI")
	accountSid    = os.Getenv("TWILIO_ACCOUNT_SID")
	authToken     = os.Getenv("TWILIO_AUTH_TOKEN")
	from          = os.Getenv("TWILIO_FROM_PHONE_NUMBER")
	to            = os.Getenv("TWILIO_TO_PHONE_NUMBER")

	client = twilio.NewRestClientWithParams(twilio.RestClientParams{
		Username: accountSid,
		Password: authToken,
	})
)

func main() {
	conn, err := amqp.Dial(connectionURI)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"orders", // name
		false,    // durable
		false,    // delete when unused
		false,    // exclusive
		false,    // no-wait
		nil,      // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
			log.Printf("Sending a SMS message...")

			message := "Hello there, You just ordered Product " + string(d.Body)
			params := &openapi.CreateMessageParams{
				To:   &to,
				From: &from,
				Body: &message,
			}

			resp, err := client.ApiV2010.CreateMessage(params)
			failOnError(err, "Failed to create SMS message")

			response, err := json.Marshal(*resp)
			failOnError(err, "Failed to marshall json response")

			log.Printf("Twilio Resonse: " + string(response))
			log.Printf("Succesfully sent SMS message!!!\n")

		}
	}()

	log.Printf("[*] Waiting for messages. To exit press Ctrl+C")
	<-forever
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
