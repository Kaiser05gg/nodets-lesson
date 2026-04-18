import axios from "axios";
import { Todo } from "../../models/todo";
import * as dotenv from "dotenv";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { createDBConnection } from "../utils/database/database";

dotenv.config();
const { PORT } = process.env;
let connection: Connection;
beforeEach(async () => {
  connection = await createDBConnection();
  await connection.query(`DELETE FROM todos`);
});

afterEach(async () => {
  await connection.end();
});

axios.defaults.baseURL = `http://localhost:${PORT}`;
axios.defaults.headers.common = { "Content-Type": "application/json" };
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

describe("TodoApi", () => {
  // describe("GET/api/todos", () => {
  //   it("test", async () => {
  //     const response = await axios.get<Todo[]>("/api/todos");
  //     console.log(response.status, response.data);
  //   });
  // });
  describe("GET/api/todos", () => {
    it("should return allTodo and 200status", async () => {
      const createdTodos = await createTodoTestDatas(connection, 5);
      const response = await axios.get<Todo[]>(`/api/todos`);
      const getTodos = response.data;
      const status = response.status;

      const sql = `SELECT * FROM todos`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);

      expect(getTodos.length).toBe(createdTodos.length);

      for (const todo of getTodos) {
        const expectTodo = (rows as Todo[]).filter((t) => t.id === todo.id)[0];

        expect(status).toBe(200);
        expect(expectTodo.id).toBe(todo.id);
        expect(expectTodo.title).toBe(todo.title);
        expect(expectTodo.description).toBe(todo.description);
      }
    });
    it("should return nothingTodo and 200status", async () => {
      const response = await axios.get<Todo[]>(`/api/todos`);
      const getTodos = response.data;
      const status = response.status;

      expect(status).toBe(200);
      expect(getTodos.length).toBe(0);
    });
  });

  describe("GET/api/todos/id", () => {
    it("should retern todo and 200status", async () => {
      const createdTodos = await createTodoTestDatas(connection, 1);
      const createTodo = createdTodos[0];
      const response = await axios.get<Todo>(`/api/todos/${createTodo.id}`);
      const createdTodo = response.data;
      const status = response.status;

      const sql = `SELECT * FROM todos WHERE id=${createdTodo.id}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
      const queryResult = rows[0] as Todo;

      expect(status).toBe(200);
      expect(queryResult.id).toBe(createdTodo.id);
      expect(queryResult.title).toBe(createdTodo.title);
      expect(queryResult.description).toBe(createdTodo.description);
    });
    it("should retern NotFoundDataError and 404status", async () => {
      const response = await axios.get<Todo>(`/api/todo/1`);
      expect(response.status).toBe(404);
    });
  });
  describe("POST/api/todos", () => {
    it("should retern createdID and 201status", async () => {
      const request: Todo = {
        title: "title",
        description: "description",
      };
      const response = await axios.post<number>("/api/todos", request);
      const createdId = response.data;
      const status = response.status;

      const sql = `SELECT * FROM todos WHERE id=${createdId}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
      const queryResult = rows[0] as Todo;

      expect(status).toBe(201);
      expect(queryResult.id).toBe(createdId);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
  });
  describe("PUT/api/todos", () => {
    it("should retern updateID and 200status", async () => {
      const updateTodos = await createTodoTestDatas(connection, 1);
      const updateTodo = updateTodos[0];
      const request: Todo = {
        title: "title",
        description: "description",
      };
      const response = await axios.put<Todo>(`/api/todos/${updateTodo.id}`, request);
      const updatedTodo = response.data;
      const status = response.status;

      const sql = `SELECT * FROM todos WHERE id=${updatedTodo.id}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
      const queryResult = rows[0] as Todo;

      expect(status).toBe(200);
      expect(queryResult.id).toBe(updateTodo.id);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
    it("should retern NotFoundDataError and 404status", async () => {
      const response = await axios.get<Todo>(`/api/todo/1`);
      expect(response.status).toBe(404);
    });
  });
  describe("DELETE/api/todos", () => {
    it("should retern createdID and 204status", async () => {
      const createdTodos = await createTodoTestDatas(connection, 1);
      const createdTodo = createdTodos[0];
      const response = await axios.delete<number>(`/api/todos/${createdTodo.id}`);
      const status = response.status;

      const sql = `SELECT * FROM todos WHERE id=${createdTodo.id}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);

      expect(status).toBe(204);
      expect(rows.length).toBe(0);
    });
  });
  async function createTodoTestDatas(connection: Connection, num: number): Promise<Todo[]> {
    const todoList: Todo[] = [];

    for (let index = 0; index < num; index++) {
      const todo: Todo = {
        title: `sample title${index}`,
        description: `sample descriptio${index}`,
      };

      const sql = `INSERT INTO todos (title,description) VALUES ("${todo.title}","${todo.description}")`;
      const [result] = await connection.execute<ResultSetHeader>(sql);

      todo.id = result.insertId;
      todoList.push(todo);
    }
    return todoList;
  }
});
