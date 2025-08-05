package main

import (
	"fmt"
	"time"

	worker "github.com/timan-z/gotaskqueue/command/worker"
	queue "github.com/timan-z/gotaskqueue/packages/queue"
	task "github.com/timan-z/gotaskqueue/packages/task"
)

func main() {
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
