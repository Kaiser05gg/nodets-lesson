import express, { Express } from "express";
import cors from "cors";
import mysql, { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import * as dotenv from "dotenv";

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

  type Todo = {
    id: Number;
    title: string;
    description: string;
    createAt?: Date;
    updateAt?: Date;
  };

  app.get("/api/todos", async (req, res) => {
    const sql = "SELECT * FROM todos";
    const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
    res.json(rows);
  });

  app.get("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT * FROM todos WHERE id=${id}`;
    const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
    res.json(rows[0]);
  });

  app.post("/api/todos/:id", async (req, res) => {
    const todo = req.body;
    const sql = `INSERT INTO todos (title,description) VALUES ("${todo.title}","${todo.description}")`;
    const [results] = await connection.execute<ResultSetHeader>(sql);
    res.status(201).json(results.insertId);
  });

  app.get("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT * FROM todos WHERE id=${id}`;
    const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
    res.json(rows[0]);
  });

  // connection.connect(function (err) {
  //   if (err) {
  //     console.log(`failed mysql connect: ${err}`);
  //     throw err;
  //   }
  //   console.log("connected mysql");
  // });

  // app.get("/", (req, res) => {
  //   const sql = `
  //   SELECT
  //    id,
  //    title,
  //    description
  //   FROM
  //   todos`;
  //   connection.query(sql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     res.json(results);
  //   });
  // });

  // app.get("/api/todos/:id", (req, res) => {
  //   const id = req.params.id;
  //   const sql = `
  //    SELECT
  //     id,
  //     title,
  //     description
  //    FROM
  //     todos
  //    WHERE
  //     id = ${id};
  //    `;
  //   connection.query(sql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     if (results.length === 0) {
  //       res.status(404).json();
  //       return;
  //     }
  //     res.status(200).json(results[0]);
  //   });
  // });

  // app.put("/api/todos/:id", (req, res) => {
  //   const id = req.params.id;
  //   const todo = req.body;
  //   const selectsql = `
  //    SELECT
  //     id,
  //     title,
  //     description
  //    FROM
  //     todos
  //    WHERE
  //     id = ${id};
  //    `;
  //   connection.query(selectsql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     if (results.length === 0) {
  //       res.status(404).json();
  //       return;
  //     }
  //   });
  //   const updatesql = `

  //    UPDATE
  //     todos
  //    SET
  //     title = '${todo.title}',
  //     description = '${todo.description}'
  //    WHERE
  //     id = ${id};
  //    `;

  //   connection.query(updatesql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     if (results.length === 0) {
  //       res.status(404).json();
  //       return;
  //     }
  //     res.status(200).json(results[0]);
  //   });
  // });

  // app.delete("/api/todos/:id", (req, res) => {
  //   const id = req.params.id;
  //   const sql = `
  //   DELETE
  //    FROM
  //     todos
  //    WHERE
  //     id = ${id};
  //    `;
  //   connection.query(sql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     res.status(204).json(results[0]);
  //   });
  // });

  // app.post("/", (req, res) => {
  //   const todo = req.body;
  //   console.log(todo.title);
  //   console.log(todo.description);
  //   const sql = `
  //   INSERT INTO todos ( title, description)
  //   VALUES ("${todo.title}","${todo.description}")
  //   `;
  //   connection.query(sql, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status().json();
  //       return;
  //     }
  //     res.status(201).json(results);
  //   });
  // });
}
main();
