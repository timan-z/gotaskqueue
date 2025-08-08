package worker

import (
	"fmt"
	"math/rand"
	"time"

	task "github.com/timan-z/gotaskqueue/models/task"
)

func StartWorker(id int, tasks chan *task.Task) {
	go func() {
		for t := range tasks {
			if t.Attempts == t.MaxRetries {
				if t.Status == "failed" {
					fmt.Printf("[Worker %d] Task %s failed permanently (max retries reached)\n", id, t.ID)
				}
				return
			}
			t.Attempts++
			t.Status = "in-progress"
			fmt.Printf("[StartWorker]:[Worker %d] Processing task: %s (Attempt %d - %s)\n", id, t.ID, t.Attempts, t.Status)

			switch t.Type {
			case "fail":
				succOdds := 0.25 // For "fail,"" let's say on each retry, there's a 25% chance of success.

				if t.Attempts <= t.MaxRetries {
					randomNum := rand.Float64() // random float between 0.0 and 1.0 gen each iteration:

					fmt.Println("DEBUG: What's the value of randomNum? => ", randomNum)

					if randomNum <= succOdds {
						fmt.Printf("[Worker %d] Task %s completed\n", id, t.ID)
						time.Sleep(2 * time.Second)
						t.Status = "completed"
						break
					} else {
						fmt.Printf("[Worker %d] Task %s failed! Retrying...\n", id, t.ID)
						time.Sleep(1 * time.Second)
						t.Status = "failed"
						tasks <- t // requeue
						continue
					}
				}

			case "fail-absolute":
				// This is basically what I originally had for "fail" (no chance of success on each re-try).
				if t.Attempts <= t.MaxRetries {
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
