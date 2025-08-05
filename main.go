package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	worker "github.com/timan-z/gotaskqueue/command/worker"
	queue "github.com/timan-z/gotaskqueue/packages/queue"
	task "github.com/timan-z/gotaskqueue/packages/task"
)

var q *queue.Queue

type EnqueueReq struct {
	//Payload map[string]string `json:"payload"`
	Payload string `json:"payload"`
}

func main() {
	// start 3 workers and have them queue the request I send from Postman in real time:
	q = queue.NewQueue(10)
	for i := 1; i <= 3; i++ {
		worker.StartWorker(i, q.Tasks)
	}

	port := "8080"
	http.HandleFunc("/api/enqueue", handleEnqueue)

	fmt.Printf("Starting server on port %s...\n", port)
	http.ListenAndServe(":"+port, corsMiddleware(http.DefaultServeMux))

	// just going to block out the old main content temporarily:
	condition := false
	if condition {
		fmt.Println("Some sandbox testing of a basic task queue system:")

		q := queue.NewQueue(10)
		// Start 3 workers
		for i := 1; i <= 3; i++ {
			worker.StartWorker(i, q.Tasks)
		}

		// Enqueue 5 tasks
		for i := 1; i <= 5; i++ {
			t := task.Task{
				ID:      fmt.Sprintf("task-%d", i),
				Payload: fmt.Sprintf("payload-%d", i),
			}
			q.Enqueue(t)
			fmt.Println("[Producer] Enqueued:", t.ID)
			time.Sleep(500 * time.Millisecond)
		}

		time.Sleep(10 * time.Second)
	}
}

func handleEnqueue(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received:", r.Method, "on", r.URL.Path)

	// Only want to accept POST requests here:
	if r.Method != http.MethodPost {
		http.Error(w, "[handleEnqueue]ERROR: Only POST calls are allowed for the /api/enqueue endpoint.", http.StatusMethodNotAllowed)
		return
	}
	var req EnqueueReq
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "[handleEnqueue]ERROR: Invalid JSON", http.StatusBadRequest)
		return
	}
	fmt.Printf("Received Payload: %s\n", req.Payload)

	t := task.Task{
		ID:      fmt.Sprintf("Task-%d", time.Now().UnixNano()),
		Payload: req.Payload,
	}
	q.Enqueue(t)
	fmt.Printf("[Producer] Enqueued %s\n", t.ID)

	// hmmm:
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success"}`))
}

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
