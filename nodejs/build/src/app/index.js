const express = require("express");
const mysql = require("mysql");

const app = express();

const port = 3000;
const config = {
  host: "mysql",
  user: "root",
  password: "root",
  database: "nodedb",
};

const sql_insert = `INSERT INTO people(name) values('Rogerio')`;
const sql_select = `SELECT * FROM people`;

execSQLQueryInsert(config, sql_insert);


app.get("/", (req, res) => {
  execSQLQuerySelect(config, sql_select, res);
});

app.listen(port, () => {
  console.log("Rodando na porta " + 3000);
});


function execSQLQueryInsert(config, sqlQry) {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  connection.query(sqlQry, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`results: ${JSON.stringify(results)}`);
    }
    connection.end();
  });
}

function execSQLQuerySelect(config, sqlQry, res) {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  connection.query(sqlQry, (error, results, fields) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
      console.log(`results: ${JSON.stringify(results)}`);
    }
    connection.end();
  });
}

