import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

//import routes
import indexRoutes from './routes/indexRoutes.js';

const app = express();

//express config
app.use(express.json());
app.use(express.static('public'));


//routes
app.use('/api', indexRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});

