import { Todo } from "../models/todo";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NotFoundDataError, SqlError } from "../utils/error";
import { ITodoRepository } from "./interface";
export class TodoRepository implements ITodoRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll(): Promise<Todo[] | Error> {
    try {
      const sql = "SELECT * FROM todos";
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
      return rows;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`execute error: ${err}`);
        return err;
      }
      return new Error();
    }
  }

  public async getByID(id: number): Promise<Todo | Error> {
    try {
      const sql = `SELECT * FROM todos WHERE id=${id}`;
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);

      if (rows.length === 0) {
        return new NotFoundDataError(`todo is not found`);
      }

      return rows[0];
    } catch (err) {
      console.log(`execute error: ${err}`);
      return new SqlError(`sql error`);
    }
  }

  public async create(todo: Todo): Promise<number | Error> {
    try {
      const sql = `INSERT INTO todos (title,description) VALUES ("${todo.title}","${todo.description}")`;
      const [result] = await this.connection.execute<ResultSetHeader>(sql);
      return result.insertId;
    } catch (err) {
      console.log(`TodoRepoository.create ${err}`);
      return new SqlError(`sql erroor`);
    }
  }

  public async update(id: number, todo: Todo): Promise<Todo | Error> {
    try {
      const updateSql = `UPDATE todos SET title = "${todo.title}", description = "${todo.description}" WHERE id = ${id}`;
      await this.connection.execute<ResultSetHeader>(updateSql, [todo.title, todo.description, id]);
      const selectSql = `SELECT * FROM todos WHERE id=${id}`;
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(selectSql, [id]);

      if (rows.length === 0) {
        return new SqlError("updated todo not found");
      }

      return rows[0];
    } catch (err) {
      console.log(`TodoRepository.update ${err}`);
      return new SqlError(`sql error`);
    }
  }

  public async delete(id: number): Promise<number | Error> {
    try {
      const sql = `DELETE FROM todos WHERE id = ${id}`;
      const [result] = await this.connection.execute<ResultSetHeader>(sql);
      return result.affectedRows;
    } catch (err) {
      console.log(`TodoRepository.delete ${err}`);
      return new SqlError(`SQL error`);
    }
  }
}
