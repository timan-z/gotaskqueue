package main

import (
	"net/http"

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

// corsMiddleware function unused for now... -- keep around just in-case I'll need it later:
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
