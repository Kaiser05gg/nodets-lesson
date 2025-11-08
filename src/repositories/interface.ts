import { Todo } from "../models/todo";

export interface ITodoRepository {
  findAll(): Promise<Todo[] | Error>;
  getByID(id: number): Promise<Todo | Error>;
  create(todo: Todo): Promise<number | Error>;
  update(id: number, todo: Todo): Promise<Todo | Error>;
  delete(id: number): Promise<number | Error>;
}
