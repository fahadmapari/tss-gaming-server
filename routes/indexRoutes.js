import express from 'express';
// import {  } from '../controllers/indexController.js';
const router = express.Router();


router.get('/', (req, res)=>{
    res.send("Hi api started");
});




export default router;