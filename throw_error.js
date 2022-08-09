//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@이것도 해볼게요~@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// catch 로 연결됩니다.
const throwError = new Promise((resolve, reject) => {
    throw Error("error");
  });
  throwError
    .then(() => console.log("throwError success"))
    .catch(() => console.log("throwError catched"));

const several2 = new Promise((resolve, reject) => {
    reject();
    resolve();
  });
  several2
    .then(() => console.log("several2 success"))
    .catch(() => console.log("several2 catched"));