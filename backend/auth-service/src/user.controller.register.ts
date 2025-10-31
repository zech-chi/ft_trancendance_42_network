import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUserInput } from "./user.schema"
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";
import { sendEmail } from "./utils/mailer";

// function to check if user exists by email, username, or full name
export async function findUserIfExists(userName: string, email: string): Promise<any> {
    const user = await fetch(API_ROUTES.FIND_USER_BY_EMAIL_OR_USERNAME, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, userName })
    }).then(res => res.json());
    return user;
}

// function to create a new user
export async function createUser(fullName: string, userName: string, email: string, hashedPassword: string, imageUrl: string): Promise<any> {
    const user = await fetch(API_ROUTES.CREATE_USER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // add code that was sent to the email
        body: JSON.stringify({ fullName, userName, email, password: hashedPassword, imageUrl, email_verified: false, twofa_enabled: false  })
    }).then(res => res.json());
    return user;
} 


export async function addNewRadarDataRow(userId: number): Promise<number> {
    const id = await fetch(API_ROUTES.ADD_NEW_RADAR_DATA_ROW, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    }).then(res => res.json());
    return id;
}

export async function addNewChartsDataRows(userId: number): Promise<number> {
    const id = await fetch(API_ROUTES.ADD_NEW_CHARTS_DATA_ROWS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    }).then(res => res.json());
    return id;
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
        console.log('RegisterUser called with body:', req.body);
        const checkUser = await findUserIfExists(userName, email);
        if (checkUser) {
            return reply.code(400).send({ message: 'User with this email or userName already exists' });
        }
        

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const imageUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${userName}`;
    
        // create new user
        // add the code_sent_to _email as parameter and add comn to db for 2FA 
        const newUser = await createUser(fullName, userName, email, hashedPassword, imageUrl);
        console.log('New user created:', newUser);
        
        // add new row in RadarData for the new user
        const radarDataId = await addNewRadarDataRow(newUser.id);
        // add new rows in ChartsData for the new user
        // one for parcheesi and one for pong
        const chartsDataId = await addNewChartsDataRows(newUser.id);

        
        console.log('RadarData row created with ID:', radarDataId);
        console.log('ChartsData row created with ID:', chartsDataId);
        // lj9
        // additional steps like sending verification email can be added here
        // ......
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        
        const res = await fetch(API_ROUTES.SAVE_VERIFICATION_CODE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: newUser.id,
                code: verificationCode,
                expiresAt,
            }),
        });
        if (!radarDataId || !chartsDataId || !res.ok) {
            // should I delete the user if this fails?
            const res = await fetch(API_ROUTES.DELETE_USER_BY_ID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: newUser.id })
            });
            if (!res.ok)
                console.error('Failed to delete user:', await res.text());
            return reply.code(400).send({ message: 'Could not initialize user data. Please try again.' });
        }
        await sendEmail(email, "Verify your email", `<p>Your verification code: <b>${verificationCode}</b></p>`);
        
        // respond with the new user's details
        return reply.code(201).send({
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
            message: "user created, verification email sent",
        });

    } catch (err) {
        console.error('Error registering user:', err);
        return reply.code(400).send({ message: 'Could not register user. Please try again.' });
    }
}
