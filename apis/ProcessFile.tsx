// require the module，导入react-native-fs库
// var RNFS = require('react-native-fs');

import RNFS, {resumeDownload} from 'react-native-fs';
import {serverIPP} from '../values/strings';
import {Alert, PermissionsAndroid} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalVal, userInfo} from '../values/global';
// async () => {
// const requestPermission = new Promise(async (resolve, reject) => {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple(
//       // PermissionsAndroid.PERMISSIONS.CAMERA,
//       [
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ],
//     );
//     if (
//       granted['android.permission.READ_EXTERNAL_STORAG'] ===
//       PermissionsAndroid.RESULTS.GRANTED
//     ) {
//       console.log('READ_EXTERNAL_STORAGE 权限已获取');
//     }
//     if (
//       granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//       PermissionsAndroid.RESULTS.GRANTED
//     ) {
//       resolve(true);
//       console.log('WRITE_EXTERNAL_STORAGE 权限已获取');
//     } else {
//       reject('WRITE_EXTERNAL_STORAGE 权限未获取');
//       // console.log('WRITE_EXTERNAL_STORAGE 权限未获取');
//     }
//
//     // if (
//     //   granted['android.permission.USE_SIP'] ===
//     //   PermissionsAndroid.RESULTS.GRANTED
//     // ) {
//     //   console.log('USE_SIP 权限已获取');
//     // }
//   } catch (err) {
//     console.log(err);
//   }
// })
//   .then(() => {})
//   .catch(error => {
//     console.log(error);
//   });

export function readFile() {
  console.log('');

  // RNFS.ExternalDirectoryPath
  // console.log(RNFS.ExternalDirectoryPath);
  //获取文件列表和目录
  RNFS.readDir(RNFS.ExternalDirectoryPath)
    .then(async result => {
      if (result.length) {
        console.log('GOT RESULT', result);

        for (let file of result) {
          console.log('----------------------');
          console.log('filename:' + file.name);
          // await RNFS.readFile(file.path, 'utf8').then(content => {
          // console.log(content);
          // });
          console.log('----------------------');

          // console.log('content:' + file.content);
          // console.log('');
        }
        // stat the second file，找到第二个 文件
        Alert.alert(
          `已写入的文件(${result.length})`,
          result.map((file, index) => index + 1 + '. ' + file.name).join('\n'),
        );
        // return Promise.all([RNFS.stat(result[1].path), result[1].path]);
      } else {
        throw 'No file found';
      }
    })
    // .then(statResult => {
    //   /**
    //    * stat
    //    *return {
    //                 'path': filepath,
    //                 'ctime': new Date(result.ctime * 1000),
    //                 'mtime': new Date(result.mtime * 1000),
    //                 'size': result.size,
    //                 'mode': result.mode,
    //                 'originalFilepath': result.originalFilepath,
    //                 isFile: () => result.type === RNFSFileTypeRegular,
    //                 isDirectory: () => result.type === RNFSFileTypeDirectory,
    //   };
    //    */
    //
    //   // if we have a file, read it
    //   if (statResult[0].isFile()) {
    //     //返回的是数组，第一个是对象，第二个是文件
    //     return RNFS.readFile(statResult[1], 'utf8');
    //   }
    //   // console.log(statResult[0].path);
    //   return 'no file';
    // })
    // .then(contents => {
    //   // log the file contents，输出文件内容
    //   // console.log(contents);   //TODO readFile - content
    // })
    .catch(err => {
      console.log(err);
    });
}

export const uploadFile = async fileInfo => {
  if (fileInfo) {
    await new Promise(async (resolve, reject) => {
      const granted = await PermissionsAndroid.requestMultiple(
        // PermissionsAndroid.PERMISSIONS.CAMERA,
        [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ],
      );
      if (
        granted['android.permission.READ_EXTERNAL_STORAG'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('READ_EXTERNAL_STORAGE 权限已获取');
      }
      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        globalVal.writePermission = true;
        console.log('WRITE_EXTERNAL_STORAGE 权限已获取');
        resolve(true);
      } else {
        globalVal.writePermission = false;
        reject('WRITE_EXTERNAL_STORAGE 权限未获取');
        // console.log('WRITE_EXTERNAL_STORAGE 权限未获取');
      }

      // if (
      //   granted['android.permission.USE_SIP'] ===
      //   PermissionsAndroid.RESULTS.GRANTED
      // ) {
      //   console.log('USE_SIP 权限已获取');
      // }
    })
      .then(res => {
        console.log('test' + res);
        var uploadUrl = 'http://' + serverIPP + '/imgUrl'; // For testing purposes, go to http://requestb.in/ and create your own link，测试上传路径
        var files = [
          // {
          //   name: 'files',
          //   filename: 'test.txt',
          //   filepath: RNFS.ExternalDirectoryPath + '/test.txt',
          //   filetype: 'json',
          //   // filetype: 'audio/x-m4a',
          // },
          {
            name: 'files',
            filename: fileInfo.name,
            filepath: RNFS.ExternalDirectoryPath + '/' + fileInfo.name,
            filetype: 'image/jpeg',
            // filetype: 'audio/x-m4a',
          },
          // {
          //   name: 'test2',
          //   filename: 'test2.w4a',
          //   filepath: RNFS.DocumentDirectoryPath + '/test2.w4a',
          //   filetype: 'audio/x-m4a',
          // },
        ];
        //上传开始回调
        var uploadBegin = response => {
          var jobId = response.jobId;
          // console.log('');
          console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        };
        const uploadProgress = async response => {
          // console.clear();
          try {
            await AsyncStorage.setItem(
              '@uploadPercentage',
              JSON.stringify({
                value:
                  // Math.floor(
                  response.totalBytesSent / response.totalBytesExpectedToSend,
                // ),
              }),
            );
            // console.log('Write!!!');
          } catch (e) {
            // saving error
          }

          // console.log('UPLOAD IS ' + percentage + '% DONE!');
        };
        RNFS.uploadFiles({
          toUrl: uploadUrl, //文件上传路径
          files: files, //上传的文件数组
          method: 'POST', //HTTP请求方法
          headers: {
            Accept: 'application/json', //请求header
          },

          // fields: {
          //   hello: 'world',
          //   name: 'file',
          // },
          // fields: {
          //   hello: 'world',
          // },
          begin: uploadBegin, //上传开始回调
          progress: uploadProgress, //上传进度回调
        })
          .promise.then(res2 => {
            //HTTP response响应
            // console.log(res.body);
            if (res2) {
              let resData = JSON.parse(res2.body);
              // console.log('TEST:' + resData.url);
              globalVal.uploadUrl = resData.url;
              // console.log('TestUrl:' + globalVal.uploadUrl);
              // fetch('http://' + serverIPP + '/upload');
              // try {
              //   await AsyncStorage.setItem(
              //     '@uploadPercentage',
              //     JSON.stringify({
              //       value: 1,
              //       // Math.floor(
              //       // ),
              //     }),
              //   );
              //   // console.log('Write!!!');
              // } catch (e) {
              //   // saving error
              // }
            }
            // console.log(response.body);
            // if (response.statusCode === 200) {
            //   console.log('FILES UPLOADED!'); // response.statusCode状态码, response.headers响应header, response.body 响应body
            // } else {
            //   console.log('SERVER ERROR');
            // }
          })
          .catch(err => {
            //HTTP请求异常
            if (err.description === 'cancelled') {
              // cancelled by user
            }
            console.log(err);
          });
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    Alert.alert('错误', '请先选择作品');
  }
};
export const write_file = fileInfo => {
  if (fileInfo) {
    let path = RNFS.ExternalDirectoryPath + '/' + fileInfo.name;
    RNFS.readFile(fileInfo.uri, 'base64')
      .then(content => {
        RNFS.writeFile(path, content, 'base64')
          .then(success => {
            console.log('');
            console.log('FILE WRITTEN' + ' ' + path);
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    Alert.alert('操作失败', '请先选择文件');
  }
};
