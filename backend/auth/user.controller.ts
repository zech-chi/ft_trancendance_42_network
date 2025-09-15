import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUserInput, LoginUserInput } from "./user.schema"
import bcrypt from "bcryptjs";
import { db } from "../index"


// function to check if user exists by email, username, or full name
export function findUserIfExists(fullName: string, userName: string, email: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Users WHERE email = ? OR userName = ? OR fullName = ?`;
        db.get(query, [email, userName, fullName], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// function to create a new user
export function createUser(fullName: string, userName: string, email: string, hashedPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Users (fullName, userName, email, password) VALUES (?, ?, ?, ?)`;
        db.run(query, [fullName, userName, email, hashedPassword], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, fullName, userName, email });
        });
    });
}


export async function RegisterUser(
    req: FastifyRequest<{
        Body: RegisterUserInput
    }>,
    reply: FastifyReply,
) {
    const { fullName, userName, email, password } = req.body;
    try {
        // check if user already exists
        const checkUser = await findUserIfExists(fullName, userName, email);
        if (checkUser) {
            return reply.code(400).send({ message: 'User with this email, userName, or fullName already exists' });
        }
        
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // create new user
        const newUser = await createUser(fullName, userName, email, hashedPassword);
        console.log('New user created:', newUser);
        // respond with the new user's details
        return reply.code(201).send({
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
        });

    } catch (err) {
        console.error('Error registering user:', err);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}
