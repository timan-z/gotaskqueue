package task

type Task struct {
	ID         string // just going to have this be "Task:{Insert Randomly Generated String}"
	Payload    string
	Type       string
	Status     string // "queued", "in-progress", "completed", "failed"
	Attempts   int
	MaxRetries int
	CreatedAt  string // will be time.Now().Format(...)
}
