
const http =require ("http");
const express = require("express");
const cors = require("cors");
const morgan =  require("morgan");
const dotenv = require("dotenv");

const { DataSource } = require('typeorm') 
// .env 파일에 저장해놓은 환경 변수들을 불러와 DataSource 명령어를 통해서 db와의 커넥션 환경 세팅을 완료

dotenv.config()
//환경변수에 적어놓앗던 typeorm을 app.js에서 활용할수있게 발동시키는작업

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})
//.env환경변수 value들을 불러올수있음
//process 객체는 node.js 에서 기본으로 설정되는 글로벌 객체로써 
//별도의 require 호출 없이 언제, 어디서든지 모든 모듈에서 접근이 가능한 객체

myDataSource.initialize()
  .then(()=>{
    console.log("Data Source has been initialized!")
  });
//하는순간 데이터베이스와의 연결과 연동을 실행/ 비동기적인 형태로 이루어짐, 외부시스템과의 연동상태이기때문.
//비동기적처리를 위해 promise객체를 활용하여 연결이 됫을때와 안됫을때의 추후 내 행위를 정의내리고 설정가능 추후배울거임.

app = express()

app.use(express.json());
//외부에서요청으로 들어온 값을 parsing 해서 보여짐
app.use(cors());
//엄격한 통신을 완화, 설정된부분에서 통신가능 모든통신을 경유한 request 들이 
//맞물려서 통과해야지만 가능 가끔 특정API만 동작할수잇는것도 가능
app.use(morgan('combined'));




app.get("/ping",(req,res)=>{
    res.json({message : "pong"})
});

// app.get("/ping",cors(),(req,res,next)=>{
//     res.json({message : "pong"})
// });
//특정구간만 cors 통신가능



const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () =>{
    server.listen(PORT, ()=> console.log(`server is listening to ${PORT}`))
}

start()

