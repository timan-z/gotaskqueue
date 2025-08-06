package task

type Task struct {
	ID      string // just going to have this be "Task:{Insert Randomly Generated String}"
	Payload string
	// Stuff below we're going to track in memory for now...
	Status     string // "queued", "in-progress", "completed", "failed"
	Attempts   int
	MaxRetries int
}
