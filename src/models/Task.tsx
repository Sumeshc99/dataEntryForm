export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string = "",
    public completed: boolean = false,
    public createdAt: Date = new Date()
  ) {}

  toggle() {
    this.completed = !this.completed;
  }

  update(payload: { title?: string; description?: string }) {
    if (payload.title !== undefined) this.title = payload.title;
    if (payload.description !== undefined)
      this.description = payload.description;
  }
}
