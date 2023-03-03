// ALTER TABLE users AUTO_INCREMENT = 2
// ALTER TABLE messages AUTO_INCREMENT = 1
console.clear();
var express = require('express');
//Post方式请求参数放在请求体里面，需引用body-parser解析body
var bodyParser = require('body-parser');
var multer = require('multer'); //用于接收文件
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
  if (req.body.version !== release_version) {
    res.end(
      '2022-12-31 更新:\n1.公屏聊天系统已开放\n2.修复了注册位置提交未为空的情况',
    );
    return;
  }
  res.end('1');
});

//json数据

const mysqlInfo = {
  host: '43.143.129.235',
  port: '3306',
  username: 'nfttest',
  password: '123456', //empty for window
  database: 'nfttest',
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
  if (err) {
    throw err;
  }
  console.log(
    'Connected successfully:\nHost:' +
      mysqlInfo.host +
      '\ndatabase:' +
      mysqlInfo.database,
  );
});

//查
connection.query('SELECT * FROM admin', function (err, result) {
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

  //查
  connection.query('SELECT * FROM admin', function (err, result) {
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
      if (user.email === req.body.email) {
        console.log('重复!');
        res.end('该邮箱已被注册！');
        // res.status(404).send('404')
        return;
      }
    }

    const addSql =
      'INSERT INTO admin(id,name,password,address,email,identify,coin,headphoto,location,join_time,last_login_time) VALUES(?,?,?,?,?,"employee",0,"http://waa.cool:4000/public/head_photo/user_default.jpg",?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)';
    const addSqlParams = [
      0,
      req.body.name,
      req.body.password,
      req.body.address,
      req.body.email,
      req.body.location,
      // req.body.longitude,
      // req.body.latitude,
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
  let sql = 'SELECT * FROM admin';

  console.log(req.body.email);
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
      if (_user.email === req.body.email) {
        if (_user.password === req.body.password) {
          console.log('登录成功!', _user.name);
          res.end('1');
        } else {
          res.end('0');
        }
        // res.status(404).send('404')
        return;
      }
    }
    res.end('-1');
  });
});

// Dealing send request
// app.post('/send', function (req, res) {
//   const addSql = 'INSERT INTO messages(id,msg,sender) VALUES(0,?,?)';
//   const addSqlParams = [req.body.message, req.body.sender];
//
//   // Add new message into MySQL
//   connection.query(addSql, addSqlParams, function (err, result) {
//     if (err) {
//       console.log('[INSERT ERROR] - ', err.message);
//       return;
//     }
//
//     console.log('--------------------------INSERT----------------------------');
//     console.log('INSERT ID:', result);
//     console.log(
//       '-----------------------------------------------------------------\n\n',
//     );
//   });

//   // Get immediate messages database
//   connection.query('SELECT * FROM messages', function (err, result) {
//     if (err) {
//       console.log('[SELECT ERROR] - ', err.message);
//       return;
//     }
//
//     console.log('--------------------------SELECT----------------------------');
//     for (let msg of result) {
//       console.log(msg);
//     }
//     console.log('------------------------------------------------------------');
//
//     res.end(JSON.stringify(result)); // Send the messages json back.
//   });
//
//   // res.end('-1')
// });

// Dealing refresh request
// app.get('/refresh', function (req, res) {
//   var sql = 'SELECT * FROM messages';
//
//   //Get current messages database
//   connection.query(sql, function (err, result) {
//     if (err) {
//       console.log('[SELECT ERROR] - ', err.message);
//       return;
//     }
//
//     console.log('--------------------------SELECT----------------------------');
//     for (let msg of result) {
//       console.log(msg);
//     }
//     console.log('------------------------------------------------------------');
//
//     res.end(JSON.stringify(result)); // Send the messages json back.
//   });
// });

app.get('/nftimg', function (req, res) {
  connection.query('select * from nftimg', function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }

    res.end(JSON.stringify(result));
  });
});
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, './');
    cb(null, './public/files');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({storage: storage});
const imgBaseUrl = '..';

app.post('/upload', upload.array('files'), function (req, res, next) {
  console.log('------------------------------');
  console.log('start!!!');
  let files = req.file;
  console.log('Uploading file:' + files);
  // let id = req.body.id;
  let reqJSON;
  for (let key in JSON.parse(JSON.stringify(req.body))) {
    reqJSON = JSON.parse(key);
    break;
  }

  // console.log(req);

  // let addSqlParams = [
  //   reqJSON.url,
  //   reqJSON.nftName,
  //   reqJSON.nftDescription,
  //   reqJSON.owner,
  //   reqJSON.fee,
  // ];
  // connection.query(
  //   'insert into appsubmit( url, nftname, nftdescription, owner, fee) values(?,?,?,?,?)',
  //   addSqlParams,
  //   function (err, result) {
  //     if (err) {
  //       console.log('[SELECT ERROR] - ', err.message);
  //       return;
  //     }
  //     res.end(JSON.stringify(reqJSON));
  //   },
  // );
});

app.listen(8085, function () {
  console.log('应用实例，访问地址为 http://127.0.0.1:8085');
});
