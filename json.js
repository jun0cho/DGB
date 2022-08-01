// JSON 강의
// JSON에는 stringify와 parse 두 가지가 있음
// stringify: object to JSON
// parse: JSON to object

// [stringify] object to JSON
// JSON.stringify(오브젝트)
let json = JSON.stringify(true);
console.log(json);

json = JSON.stringify(['apple', 'banana']);
console.log(json);

const rabbit = {
    name: 'tori',
    color: 'white',
    size: null,
    birthDate: new Date(),
    jump: () => {
        console.log(`${name} can jump!`); // 함수는 JSON 형태로 바뀔때 포함X
    }
};
json = JSON.stringify(rabbit);
console.log(json);

// ['원하는 key'] --> object 구성요소 중 원하는 것만 확인 가능
json = JSON.stringify(rabbit, ['name', 'size']); 
console.log(json);


// key, value에 대해 key: ~. value: ~ 방식으로 로그 찍기
json = JSON.stringify(rabbit, (key, value) => {
    console.log(`key: ${key}, value: ${value}`);
    return key === 'name' ? 'ellie' : value;
}); 
// key가 name일 때는 value에 ellie 넣고, 나머지는 그냥 원래 value 넣기
console.log(json);


// [parse] JSON to object
// JSON.parse(제이슨);
json = JSON.stringify(rabbit);
const obj = JSON.parse(json);
console.log(obj);
// object.jump(); --> 오류 발생
// object를 JSON으로 바꿀때 jump라는 함수는 포함X
// 그래서 그 JSON을 다시 object로 바꿨을 때도 당연히 jump라는 함수 없음
console.log(rabbit.birthDate.getDate()); // 28 --> 28일이기 때문에 나옴
console.log(obj.birthDate); // 2022-07-28T01:07:20.503Z
//console.log(obj.birthDate.getDate()); --> 오류 발생
// obj에서는 birthDate 작성할 때 new Date()함수 활용함
// obj가 JSON으로 바뀔 때 new Date으로 작성한 날짜는 string이 됨
// 그래서 JSON을 다시 obj로 바꾼 obj에서는 getDate() 함수가 안 먹힘(string이라서)