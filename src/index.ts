import express, { Express } from "express";
import cors from "cors";
import mysql, { Connection } from "mysql2/promise"; // ResultSetHeader
// import { Todo } from "./models/todo";
import { TodoRepository } from "./repositories/todorepository";
import * as dotenv from "dotenv";
import { TodoService } from "./services/todoService";
import { TodoController } from "./controllers/todoController";

async function main() {
  dotenv.config();
  const { PORT, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;
  const app: Express = express();

  app.listen(parseInt(PORT as string), function () {
    console.log(("node.js is listening to PORT:" + PORT) as string);
  });
  // cors設定
  app.disable("x-powered-by");
  app.use(cors()).use(express.json());

  const connection: Connection = await mysql.createConnection({
    host: MYSQL_HOST,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
  });

  const todoRepository = new TodoRepository(connection);
  const todoService = new TodoService(todoRepository);
  const todoController = new TodoController(todoService);
  app.use("/api/", todoController.router);
}

main();
