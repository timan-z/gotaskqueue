package worker

import (
	"fmt"
	"time"

	task "github.com/timan-z/gotaskqueue/models/task"
)

func StartWorker(id int, tasks chan *task.Task) {
	go func() {
		for t := range tasks {
			t.Attempts++
			t.Status = "in-progress"
			fmt.Printf("[StartWorker]:[Worker %d] Processing task: %s (Attempt %d - %s)\n", id, t.ID, t.Attempts, t.Status)

			switch t.Type {
			case "fail":
				if t.Attempts < t.MaxRetries {
					fmt.Printf("[Worker %d] Task %s failed! Retrying...\n", id, t.ID)
					time.Sleep(1 * time.Second)
					t.Status = "failed"
					tasks <- t // requeue
					continue
				}
				t.Status = "failed"
				fmt.Printf("[Worker %d] Task %s failed permanently (max retries reached)\n", id, t.ID)

			case "sleep":
				fmt.Printf("[Worker %d] Task %s sleeping...\n", id, t.ID)
				time.Sleep(3 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s completed\n", id, t.ID)

			// DEBUG: add more types later when i'm burnt out and in auto-pilot mode (e-mail and stuff like that).
			default:
				// Default simulated work
				time.Sleep(2 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s completed\n", id, t.ID)
			}
		}
	}()
}
