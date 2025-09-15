import { Task } from "../models/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

export class TaskService {
  constructor(private repo: ITaskRepository) {}

  async getAll() {
    return this.repo.list();
  }

  async createTask(title: string, description?: string) {
    if (!title.trim()) throw new Error("Title is required");
    const id = Math.random().toString(36).slice(2, 10);
    const task = new Task(id, title.trim(), description ?? "");
    return this.repo.create(task);
  }

  async updateTask(
    id: string,
    payload: { title?: string; description?: string }
  ) {
    const task = await this.repo.findById(id);
    if (!task) throw new Error("Task not found");
    task.update(payload);
    return this.repo.update(task);
  }

  async toggleTaskComplete(id: string) {
    const task = await this.repo.findById(id);
    if (!task) throw new Error("Task not found");
    task.toggle();
    return this.repo.update(task);
  }

  async deleteTask(id: string) {
    return this.repo.delete(id);
  }
}
