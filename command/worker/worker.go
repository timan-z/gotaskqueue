package worker

import (
	"fmt"
	"time"

	task "github.com/timan-z/gotaskqueue/packages/task"
)

func StartWorker(id int, tasks <-chan task.Task) {
	go func() {
		for t := range tasks {
			fmt.Printf("[Worker %d] Processing task: %s\n", id, t.ID)
			time.Sleep(2 * time.Second) // simulate work
			fmt.Printf("[Worker %d] Done task: %s\n", id, t.ID)
		}
	}()
}
