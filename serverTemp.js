// ALTER TABLE users AUTO_INCREMENT = 2
// ALTER TABLE messages AUTO_INCREMENT = 1

var express = require('express');
//Post方式请求参数放在请求体里面，需引用body-parser解析body
var bodyParser = require('body-parser');
// var multer = require('multer'); //用于接收文件
// var upload = multer({dest: 'uploads/'});

var app = express();
// 引用
app.use(bodyParser.urlencoded({extended: false}));
//设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

const release_version = 'demo_1.2';
app.post('/checkUpdate', function (req, res) {
  if (req.body.version != release_version) {
    res.end(
      '2022-12-31 更新:\n1.公屏聊天系统已开放\n2.修复了注册位置提交未为空的情况',
    );
    return;
  }
  res.end('1');
  return;
});

//json数据

const mysqlInfo = {
  host: '124.222.251.11',
  port: '26761',
  username: 'wmzspace',
  password: '', //empty for window
  database: 'yechat',
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

var sql = 'SELECT * FROM users';

//查
connection.query(sql, function (err, result) {
  if (err) {
    console.log('[SELECT ERROR] - ', err.message);
    return;
  }

  console.log('--------------------------SELECT----------------------------');
  console.log(result);
  console.log('------------------------------------------------------------');
});

// const userInfo = {
//   username: 'test1',
//   password: 'test1',
//   gender: 'female',
//   age: null,
//   address: null,
// };

//增

// connection.query(addSql, addSqlParams, function (err, result) {
//   if (err) {
//     console.log('[INSERT ERROR] - ', err.message);
//     return;
//   }

//   console.log('--------------------------INSERT----------------------------');
//   console.log('INSERT ID:', result);
//   console.log(
//     '-----------------------------------------------------------------\n\n',
//   );
// });

// connection.end();

app.post('/signup', function (req, res) {
  console.log('posting............');
  console.log(JSON.stringify(req.body));
  console.log(req.body);

  var sql = 'SELECT * FROM users';

  //查
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result, result.constructor.name);
    console.log('------------------------------------------------------------');

    for (let user of result) {
      // console.log("Test:", _user.username);
      // console.log(user.username)
      if (user.username == req.body.username) {
        console.log('重复!');
        res.end('该用户名已被注册！');
        // res.status(404).send('404')
        return;
      }
    }

    const addSql = `INSERT INTO users(id,username,password,gender,age,address,join_time,last_login_time,longitude,latitude) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?)`;
    const addSqlParams = [
      0,
      req.body.username,
      req.body.password,
      req.body.gender,
      req.body.age,
      req.body.address,
      req.body.longitude,
      req.body.latitude,
    ];

    connection.query(addSql, addSqlParams, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
      }

      console.log(
        '--------------------------INSERT----------------------------',
      );
      console.log('INSERT ID:', result);
      console.log(
        '-----------------------------------------------------------------\n\n',
      );
    });
    res.end('注册成功!\n' + JSON.stringify(req.body));
  });
});

app.post('/login', function (req, res) {
  var sql = 'SELECT * FROM users';

  //查
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    // console.log('--------------------------SELECT----------------------------');
    // console.log(result, result.constructor.name);
    // console.log('------------------------------------------------------------');

    for (let _user of result) {
      // console.log("Test:", _user.username);
      // console.log(req.body.username, req.body.password)
      if (_user.username == req.body.username) {
        if (_user.password == req.body.password) {
          console.log('登录成功!', _user.username);
          res.end('1');
        } else {
          res.end('0');
        }
        // res.status(404).send('404')
        return;
      }
    }
    res.end('-1');
    return;
  });
});

// Dealing send request
app.post('/send', function (req, res) {

  const addSql = `INSERT INTO messages(id,msg,sender) VALUES(0,?,?)`;
  const addSqlParams = [req.body.message,req.body.sender];

  // Add new message into MySQL
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------INSERT----------------------------');
    console.log('INSERT ID:', result);
    console.log(
      '-----------------------------------------------------------------\n\n',
    );
  });

  var sql = 'SELECT * FROM messages';

  // Get immediate messages database
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');
    for (let msg of result) {
      console.log(msg);
    }
    console.log('------------------------------------------------------------');

    res.end(JSON.stringify(result)); // Send the messages json back.
    return;
  });

  // res.end('-1')
});

// Dealing refresh request
app.get('/refresh', function (req, res) {
  var sql = 'SELECT * FROM messages';

  //Get current messages database
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------SELECT----------------------------');
    for (let msg of result) {
      console.log(msg);
    }
    console.log('------------------------------------------------------------');

    res.end(JSON.stringify(result)); // Send the messages json back.
  });
});

app.listen(8085, function () {
  console.log('应用实例，访问地址为 http://43.143.213.226:8085');
});
