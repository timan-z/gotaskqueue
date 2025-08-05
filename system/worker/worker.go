package worker

import (
	"fmt"
	"time"

	task "github.com/timan-z/gotaskqueue/models/task"
)

func StartWorker(id int, tasks chan task.Task) {
	go func() {
		for t := range tasks {
			t.Attempts++
			t.Status = "in-progress"
			fmt.Printf("[StartWorker]:[Worker %d] Processing task: %s (Attempt %d - %s)\n", id, t.ID, t.Attempts, t.Status)

			// DEBUG: For now let's simulate failure on certain payloads:
			shouldFail := t.Payload == "fail"
			if shouldFail && t.Attempts < t.MaxRetries {
				fmt.Printf("[Worker %d] Task %s failed! Retrying...\n", id, t.ID)
				time.Sleep(1 * time.Second)
				t.Status = "failed"
				tasks <- t // requeue
				continue
			}
			time.Sleep(2 * time.Second) // simulate work

			if shouldFail {
				fmt.Printf("[Worker %d] Task %s failed permanently (max retries reached)\n", id, t.ID)
				t.Status = "failed"
			} else {
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s completed\n", id, t.ID)
			}
		}
	}()
}
