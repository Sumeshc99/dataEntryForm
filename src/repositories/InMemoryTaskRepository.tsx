import { Task } from "../models/Task";
import { ITaskRepository } from "./ITaskRepository";

export class InMemoryTaskRepository implements ITaskRepository {
  private store: Map<string, Task> = new Map();

  constructor(initial?: Task[]) {
    (initial ?? []).forEach((t) => this.store.set(t.id, t));
  }

  private async simulateLatency<T>(result: T): Promise<T> {
    return new Promise((res) => setTimeout(() => res(result), 150));
  }

  async list(): Promise<Task[]> {
    return this.simulateLatency(
      Array.from(this.store.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    );
  }

  async create(task: Task): Promise<Task> {
    this.store.set(task.id, task);
    return this.simulateLatency(task);
  }

  async update(task: Task): Promise<Task> {
    if (!this.store.has(task.id)) throw new Error("Task not found");
    this.store.set(task.id, task);
    return this.simulateLatency(task);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return this.simulateLatency(undefined);
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.simulateLatency(this.store.get(id));
  }
}
