package queue

import (
	"sync"

	task "github.com/timan-z/gotaskqueue/models/task"
)

type Queue struct {
	Tasks chan task.Task
	Jobs  map[string]*task.Task
	mu    sync.RWMutex // to prevent "error: concurrent map writes" errors (to Jobs).
}

func NewQueue(bufferSize int) *Queue {
	return &Queue{
		Tasks: make(chan task.Task, bufferSize),
		Jobs:  make(map[string]*task.Task),
	}
}

func (q *Queue) Enqueue(t task.Task) {
	q.mu.Lock()
	defer q.mu.Unlock()

	t.Status = "queued"
	t.Attempts = 0
	if t.MaxRetries == 0 {
		t.MaxRetries = 3
	}
	q.Jobs[t.ID] = &t
	q.Tasks <- t
}

func (q *Queue) Dequeue() task.Task {
	return <-q.Tasks
}
