const mysqlInfo = {
  host: '124.222.251.11',
  port: '26761',
  username: 'wmzspace',
  password: 'Wmzspace123', //empty for window
  database: 'service',
};

var mysql = require('mysql');
const connection = mysql.createConnection({
  host: mysqlInfo.host,
  port: mysqlInfo.port,
  user: mysqlInfo.username,
  password: mysqlInfo.password,
  database: mysqlInfo.database,
});

connection.connect(err => {
  if (err) throw err;
  console.log(
    'Connected successfully:\nHost:' +
      mysqlInfo.host +
      '\ndatabase:' +
      mysqlInfo.database,
  );
});
