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
					fmt.Printf("[Worker %d] Task %s (Type: %s) failed permanently (max retries reached)\n", id, t.ID, t.Type)
				}
				return
			}
			t.Attempts++
			t.Status = "in-progress"
			fmt.Printf("[StartWorker]:[Worker %d] Processing task: %s (Attempt %d - %s, Type: %s)\n", id, t.ID, t.Attempts, t.Status, t.Type)

			switch t.Type {
			case "fail":
				succOdds := 0.25 // For "fail,"" let's say on each retry, there's a 25% chance of success.

				if t.Attempts <= t.MaxRetries {
					randomNum := rand.Float64() // random float between 0.0 and 1.0 gen each iteration:

					if randomNum <= succOdds {
						fmt.Printf("[Worker %d] Task %s (Type: fail - 0.25 success rate on retry) completed\n", id, t.ID)
						time.Sleep(2 * time.Second)
						t.Status = "completed"
						break
					} else {
						fmt.Printf("[Worker %d] Task %s (Type: fail - 0.25 success rate on retry) failed! Retrying...\n", id, t.ID)
						time.Sleep(1 * time.Second)
						t.Status = "failed"
						tasks <- t // requeue
						continue
					}
				}

			case "fail-absolute":
				// This is basically what I originally had for "fail" (no chance of success on each re-try).
				if t.Attempts <= t.MaxRetries {
					fmt.Printf("[Worker %d] Task %s (Type: fail-absolute) failed! Retrying...\n", id, t.ID)
					time.Sleep(1 * time.Second)
					t.Status = "failed"
					tasks <- t // requeue
					continue
				}
				t.Status = "failed"
				fmt.Printf("[Worker %d] Task %s (Type: fail-absolute) failed permanently (max retries reached)\n", id, t.ID)

			case "email":
				time.Sleep(2 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: email) completed\n", id, t.ID)

			case "report":
				time.Sleep(5 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: report) completed\n", id, t.ID)

			case "data-cleanup":
				time.Sleep(3 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: data-cleanup) completed\n", id, t.ID)

			case "sms":
				time.Sleep(1 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: sms) completed\n", id, t.ID)

			case "newsletter":
				time.Sleep(4 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: newsletter) completed\n", id, t.ID)

			case "takes-long":
				time.Sleep(10 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Type: takes-long) completed\n", id, t.ID)

			default:
				// Default simulated work (for random stuff sent in through postman and stuff I guess, or if anything slips through w/o a type).
				time.Sleep(2 * time.Second)
				t.Status = "completed"
				fmt.Printf("[Worker %d] Task %s (Undefined Type) completed\n", id, t.ID)
			}
		}
	}()
}
