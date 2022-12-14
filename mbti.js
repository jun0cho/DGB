// @@@@@@@@@@@@@@@@ 응답코드 알기 / 성공-실패 경우 나누어서 관리
// @@@@@@@@@@@@@@@@ front - back 따로 만듦
// @@@@@@@@@@@@@@@@ await / promise
// @@@@@@@@@@@@@@@@ vue(front단) - express(back단)

// 0801 과제_조준영
// npm: node js를 위한 오픈소스 모듈 패키지
// npm init: package.json 파일 만들기 --> 개발자가 배포한 패키지에 대해 다른 이들의 관리, 설치를 용이하게 함
// npm install express: node_modules들 import --> 서버를 쉽게 만들도록 해줌
// require() --> 라이브러리 로드


var http = require('http'); // 웹 서버 구동하기 위해 사용되는 모듈(createServer / close / listen)
var url = require('url'); // url 정보를 객체로 가져와서 분석하거나, 객체를 문자열로 바꿔주는 기능(parse / format / resolve)
var qs = require('querystring');
//  [parse] -->false: url객체의 query 속성을 "문자열" 형식으로 가져옴(false가 기본값)
//             true: url객체의 query 속성을 "객체" 형식으로 가져옴
var { Client } = require('pg');


var fs = require('fs'); // 파일 입출력에 사용되는 모듈(FileSystem의 약자)
var express = require('express'); // @@@@@@@@@@@@@@@@@@@@@ front단의 미들웨어 X / back단(서버단)의 미들웨어 / front단의 서버를 따로 둬야함
var bodyParser = require('body-parser');






// app = http.createServer(): "서버 만들기(객체 작성)"  +   app.listen(3000): "대기하기"
// function(request, response) --> "요청 처리를 위한 함수"

// url.parse() --> GET 방식일 때 활용
// [GET 방식]: 주소에 쿼리 스트링이 드러나는 경우
// URL 쿼리 스트링(key=value&key=value&key=value)을 받아서 그것을 key: value 들이 담긴 Object로 만들어줌
var app = http.createServer(function(request,response){
    var _url = request.url; 
    var queryData = url.parse(_url, true).query; // url.parse --> url 객체로 변환 (key:value) 형태
    var pathname = url.parse(_url, true).pathname;  // url 객체 중 query, pathname 이라는 key 가지는 value
    var title = queryData.id; 

// [시작 페이지] 
// pathname이 아무것도 없고 /만 있다는 뜻
// var template = ` html구문 ` --> template에 html 구문을 입력하는 방식이 있나 봄
// response.writeHead --> 헤더 정보 내보내기
// response.end(template) --> 컨텐츠 출력 완료(writeHead한 내용 끝나면 응답종료)
    if(pathname === '/'){ 
        if(queryData.id === undefined){
            var description = "환영합니다! : )";
            response.writeHead(200); // 헤더정보 내보내기
            var template = ` 
            <!doctype html> 
            <html> 
            <head><title></title> <meta charset="utf-8"></head>

            <body>
            <h1><a href="/">MBTI(R&D)</a></h1>
            <h2>${description}</h2>
            <ul>
                <a href = "/join">입력하러 가기</a>
            </ul>
            </body> 
            </html> `; 
            response.writeHead(200);
            response.end(template); // 컨텐츠 출력 완료
        } else {
            var title = queryData.id;
            response.writeHead(200);
        }
    } 
    // [정보입력 페이지]
    // placeholder: 페이지 띄울 때 이렇게 적으세요~ 하는 예로 보여주는 것
    else if(pathname === '/join'){
        var title = '';
        var description = "환영합니다! : )";
        var html = `
        <!doctype html> 
        <html> 
        <head><title>${title}</title> <meta charset="utf-8"></head> 
        <body>
            <h2>정보 입력</h2>
            <form action = "/join_process" method = "post">
            <ul>
                <p> 이름  
                <input type = "text" name = "name" placeholder = "조준영">
                </p>
            </ul>
            <ul>
                <p> 직위  
                <input type = "text" name = "rank" placeholder = "인턴">
                </p>
            </ul>
            <ul>
                <p> MBTI  
                <input type = "text" name = "mbti" placeholder = "ESTJ">
                </p>
            </ul>
            <p>
                <input type="submit" value = "입력하기!">
            </p>
            </form>

        </body> 
        </html>
        `;
        response.writeHead(200);
        response.end(html); // 컨텐츠 출력 완료

    } 

    // [입력받은 데이터 쪼개고 DB에 접속해서 입력하는 부분]
    // qs(querystring).parse() --> POST 방식일 때 
    // [POST 방식]: 데이터가 body에 붙어서 들어옴
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // <form action = "/join_process" method = "post">
    // <ul>
    //     <p> 이름  
    //     <input type = "text" name = "name" placeholder = "조준영">
    //     </p>
    // </ul>
    // <ul>
    //     <p> 직위  
    //     <input type = "text" name = "rank" placeholder = "인턴">
    //     </p>
    // </ul>
    // <ul>
    //     <p> MBTI  
    //     <input type = "text" name = "mbti" placeholder = "ESTJ">
    //     </p>
    // </ul>
    // <p>
    //     <input type="submit" value = "입력하기!">
    // </p>
    // </form>
    // request.on('data', ()) --> 'data' 이벤트가 발생할때마다 body에 data를 계속 이어붙임
    // request.on('end', ()) --> 'data' 이벤트 끝나면 'end' 이벤트 발생
    // body = name=%ED%95%98&rank=%EC%9D%B4&mbti=%EB%A3%A8
    // post(object 형태) = [Object: null prototype] { name: '가', rank: '나', mbti: '다' }
    // obj(object 형태) = { name: '가', rank: '나', mbti: '다' }
    else if(pathname === '/join_process'){
        // join에서 submit 하면 여기에서 데이터를 db로 넘겨주자
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(req){
            var post = qs.parse(body);
            console.log(post)
            console.log(typeof post + '======================')
            const obj = JSON.parse(JSON.stringify(post)); 
            console.log(obj)
            console.log(typeof obj + '======================')
            var keys = Object.keys(obj);
            // // for (var i=0; i < keys.length; i++){
            // //     console.log(obj[keys[i]]);
            // // }

// [Postgre DB 접속]
            const pg = new Client({
              user: "postgres",
              host: "127.0.0.1",
              database: "mbti",
              password: "1234",
              port: 5432,
            });
            pg.connect(function(err){
                if (err) throw err;
                console.log("You are connected");
            });
// sql 쿼리 작성해서 data 입력
            pg.query("insert into mbti (name, rank, mbti, pre_date, now_date) values('"+obj[keys[0]]+"','"+obj[keys[1]]+"','"+ obj[keys[2]]+"',current_date,current_date);", (err, res) => {
                if (!err) console.log(res);
                else console.log(err);
                pg.end();
            });

// @@@@@@@@@@@@@@@@@@@@@ 날짜 입력할 때 sql의 insert - update 기능 활용
// @@@@@@@@@@@@@@@@@@@@@ key값을 통해 이미 입력된 날짜가 있는데 변경할지 물어보는 기능을 넣는 경우도 있음


            // // 수행하고 싶은 작업(sql문) 
            // // var sql = 'INSERT INTO tb_user(user_name, user_department, user_id, user_pw, user_email) VALUES(?,?,?,?,?)';
            // // var params = [obj[keys[0]],obj[keys[1]],obj[keys[2]]]
            // // con.query(sql, params, function(err, rows, fields){
            // //     if(err){
            // //         console.log(err);
            // //     } else{
            // //         console.log(rows.name);
            // //     }
            // // });

            // // con.end();


// 전송 후 첫화면으로 돌아간다.
// 301 --> 완전히 다른 URL로 변경
// 302 --> 임시적으로 다른 URL로 이동 => 기존 URL이 보유한 데이터 유지하면서 다른 URL에서 필요한 작업만 수행
// ex) 인터넷쇼핑몰에서 랭킹이 높은 특정 상품이 품절인 경우 
// 아예 랭킹을 바꾸지 않고 품절이라는 페이지만 임시로 보여주면 됨
            response.writeHead(302, {Location : `/`}); // 3XX --> 클라이언트를 지정된 위치로 이동시키거나 참조하도록 함
            response.end();
        })

            
        //     // var mysql = require('mysql');
        //     // // 정보를 담은 파일
        //     // const vals = require('./info/consts_daim.js');
        //     // // 연결을 위한 정보 불러오기
        //     // var con = mysql.createConnection({
        //     //     host: vals.DBHost, port:vals.DBPort,
        //     //     user: vals.DBUser, password: vals.DBPass,
        //     //     connectionLimit: 5, database: vals.DB
        //     // });

        //     // // 연결되었는지 확인
        //     // con.connect(function(err){
        //     //     if (err) throw err;
        //     //     console.log("You are connected");
        //     // });

        }});


app.listen(3000); // 서버 대기 상태 --> 3000 port에 대한 요청이 오면 처리해줌


    //     // // DB 접속 
    //     // var { Client } = require('pg');

    //     // const pg = new Client({
    //     //   user: "postgres",
    //     //   host: "127.0.0.1",
    //     //   database: "mbti",
    //     //   password: "1234",
    //     //   port: 5432,
    //     // });
    
    //     // pg.connect();
    //     // alert('DB 연결완료!');
    
    //     // 쿼리문 입력
    //     // pg.query("insert into mbti (name, rank, mbti, pre_date, now_date) values('"+name+"','"+rank+"','"+mbti+"', current_date, current_date);", (err, res) => {
    //     //   if (!err) console.log(res);
    //     //   else console.log(err);
    //     //   pg.end();
    //     // });