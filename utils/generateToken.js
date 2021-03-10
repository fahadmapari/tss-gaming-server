import jwt from 'jsonwebtoken';

export const generateToken = (userInfo)=>{
    const token = jwt.sign({...userInfo}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    return token;
}