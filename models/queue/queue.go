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

// Function for returning a copy of all the tasks we have:
func (q *Queue) GetJobs() []*task.Task {
	q.mu.RLock() // "read lock" only
	defer q.mu.RUnlock()

	jobs := []*task.Task{}
	for _, t := range q.Jobs {
		jobs = append(jobs, t)
	}
	return jobs
}

// Get specific Job by ID:
func (q *Queue) GetJobByID(id string) (*task.Task, bool) {
	q.mu.RLock()
	defer q.mu.RUnlock()
	t, ok := q.Jobs[id]
	return t, ok
}

// Delete specific Job (by ID):
func (q *Queue) DeleteJob(id string) bool {
	q.mu.Lock()
	defer q.mu.Unlock()
	if _, exists := q.Jobs[id]; exists {
		delete(q.Jobs, id)
		return true
	}
	return false
}
