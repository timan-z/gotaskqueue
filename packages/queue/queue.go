package queue

import (
	task "github.com/timan-z/gotaskqueue/packages/task"
)

type Queue struct {
	Tasks chan task.Task
}

func NewQueue(bufferSize int) *Queue {
	return &Queue{
		Tasks: make(chan task.Task, bufferSize),
	}
}

func (q *Queue) Enqueue(t task.Task) {
	q.Tasks <- t
}

func (q *Queue) Dequeue() task.Task {
	return <-q.Tasks
}
