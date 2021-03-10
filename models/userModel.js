import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashPassword.js';
import bcrypt from 'bcrypt';

const userScehma = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    coins: {
        type: Number,
        default: 0
    }
});


userScehma.pre('save', async function(next){
    this.password = await hashPassword(this.password);
    return next();
});

userScehma.methods.checkPassword = function(enteredPassword, password){    
    return bcrypt.compareSync(enteredPassword, password);
}



const User = mongoose.model('User', userScehma);
export default User;