package main

import (
	queue "github.com/timan-z/gotaskqueue/models/queue"
	producer "github.com/timan-z/gotaskqueue/system/producer"
	worker "github.com/timan-z/gotaskqueue/system/worker"
)

var q *queue.Queue

func main() {
	// start 3 workers and have them queue the request I send from Postman in real time:
	q = queue.NewQueue(100)
	for i := 1; i <= 3; i++ {
		worker.StartWorker(i, q.Tasks)
	}
	port := "8080"

	// start http server to enqueue tasks:
	producer.StartProducer(q, port)
}
