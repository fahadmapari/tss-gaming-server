import jwt from 'jsonwebtoken';
import dotenv  from "dotenv";
dotenv.config();

try{
const decoded = jwt.verify('ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDk1YWI4OGRhMDVmZTAwMTUwMzg4YmQiLCJpYXQiOjE2MjA0NjI0NjMsImV4cCI6MTYyMDQ2NjA2M30.cHrPYD2Cu6I_vOQIBbksbVSkcanzd28uGgxxodA-c_w', process.env.TOKEN_SECRET);

console.log(decoded);
}catch(err){
  console.log(err.message);
}
