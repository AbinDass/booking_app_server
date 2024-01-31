import jwt from 'jsonwebtoken';

export const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET_KEY,
            {expiresIn:'2h'}
        )
}
