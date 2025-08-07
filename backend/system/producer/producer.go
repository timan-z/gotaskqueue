package producer

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	queue "github.com/timan-z/gotaskqueue/models/queue"
	task "github.com/timan-z/gotaskqueue/models/task"
)

// DEBUG: So, going to have the requests just be the string (we can calculate the ID of the task at run-time):
type EnqueueReq struct {
	Payload string `json:"payload"`
	Type    string `json:"type"`
}

// DEBUG: Testing having corsMiddleware here...
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
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
			ID:         fmt.Sprintf("Task-%d", time.Now().UnixNano()),
			Payload:    req.Payload,
			Type:       req.Type,
			Status:     "queued",
			Attempts:   0,
			MaxRetries: 3, // DEBUG: For now 3 will be hardcoded.
		}

		q.Enqueue(t)
		//fmt.Fprintf(w, "Enqueued tasks: %s (%s)", t.ID, t.Payload)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"message": fmt.Sprintf("Job %s (%s) enqueued!", t.ID, t.Payload),
		})
	})

	// Listing all jobs:
	// THIS IS FOR [GET /api/jobs] and [GET /api/jobs?status=queued]
	http.HandleFunc("/api/jobs", func(w http.ResponseWriter, r *http.Request) {
		status := r.URL.Query().Get("status")
		allJobs := q.GetJobs()

		fmt.Println("DEBUG: We inside the /api/jobs handler right now...")

		var filtered []*task.Task
		if status == "" {
			filtered = allJobs
		} else {
			for _, t := range allJobs {
				if t.Status == status {
					filtered = append(filtered, t)
				}
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(filtered)
	})

	// Handling multiple scenarios with this one:
	http.HandleFunc("/api/jobs/", func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Path[len("/api/jobs/"):]

		fmt.Println("DEBUG: We inside the /api/jobs/ handler right now...")

		if id == "" {
			http.NotFound(w, r)
			return
		}

		switch r.Method {
		// THIS IS FOR [GET /api/jobs/:id]
		case http.MethodGet:
			t, ok := q.GetJobByID(id)
			if !ok {
				http.Error(w, "Job not found", http.StatusNotFound)
				return
			}
			json.NewEncoder(w).Encode(t)

		// for Retry
		// THIS IS FOR [POST /api/jobs/:id/retry]
		case http.MethodPost:
			t, ok := q.GetJobByID(id)
			if !ok {
				http.Error(w, "Job not found", http.StatusNotFound)
				return
			}
			if t.Status != "failed" {
				http.Error(w, "Can only retry failed jobs", http.StatusBadRequest)
				return
			}
			t.Status = "queued"
			t.Attempts = 0
			q.Tasks <- *t
			fmt.Fprintf(w, "Re-enqueued job %s", id)

		// THIS IS FOR [DELETE /api/jobs/:id]
		case http.MethodDelete:
			ok := q.DeleteJob(id)
			if !ok {
				http.Error(w, "Job not found", http.StatusNotFound)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{
				"message": fmt.Sprintf("Job %s deleted!", id),
			})

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	fmt.Printf("[Producer] Listening on :%s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(http.DefaultServeMux)))
}
