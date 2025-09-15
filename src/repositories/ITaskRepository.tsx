import { Task } from "../models/Task";

export interface ITaskRepository {
  list(): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | undefined>;
}
