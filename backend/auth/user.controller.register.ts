import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUserInput } from "./user.schema"
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

export function addNewRadarDataRow(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO RadarData (userId) VALUES (?)`;
        db.run(query, [userId], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

export function addNewChartsDataRows(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO ChartsData (userId, game)
            VALUES (?, 'parcheesi'), (?, 'pong')
        `;
        db.run(query, [userId, userId], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
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
        
        // add new row in RadarData for the new user
        const radarDataId = await addNewRadarDataRow(newUser.id);
        // add new rows in ChartsData for the new user
        // one for parcheesi and one for pong
        const chartsDataId = await addNewChartsDataRows(newUser.id);

        if (!radarDataId || !chartsDataId) {
            // should I delete the user if this fails?
            await new Promise((res, rej) => db.run('DELETE FROM Users WHERE id = ?',
                [newUser.id], (err) => err ? rej(err) : res(null)));
            return reply.code(400).send({ message: 'Could not initialize user data. Please try again.' });
        }

        console.log('RadarData row created with ID:', radarDataId);
        console.log('ChartsData row created with ID:', chartsDataId);
        // respond with the new user's details
        return reply.code(201).send({
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
        });

    } catch (err) {
        console.error('Error registering user:', err);
        return reply.code(400).send({ message: 'Could not register user. Please try again.' });
    }
}
