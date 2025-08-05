package producer

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	queue "github.com/timan-z/gotaskqueue/models/queue"
	task "github.com/timan-z/gotaskqueue/models/task"
	//worker "github.com/timan-z/gotaskqueue/system/worker"
)

// DEBUG: So, going to have the requests just be the string (we can calculate the ID of the task at run-time):
type EnqueueReq struct {
	Payload string `json:"payload"`
}

// StartProducer begins the HTTP server that listens for Jobs:
func StartProducer(q *queue.Queue, port string) {
	http.HandleFunc("/api/enqueue", func(w http.ResponseWriter, r *http.Request) {
		// DEBUG: Take in the job request (just going to be a string):
		var req EnqueueReq
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "[handleEnqueue]ERROR: Invalid JSON", http.StatusBadRequest)
			return
		}
		fmt.Printf("[handleEnqueue]DEBUG: Received Payload: %s\n", req.Payload)

		// DEBUG: Make an ID for that Job (the string):
		t := task.Task{
			ID:      fmt.Sprintf("Task-%d", time.Now().UnixNano()),
			Payload: req.Payload,
		}

		q.Enqueue(t)
		fmt.Fprintf(w, "Enqueued tasks: %s (%s)", t.ID, t.Payload)
	})
	fmt.Println("[Producer] Listening on :%s...", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
