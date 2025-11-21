/**
 * @file        authRoutes.js
 * @description Defines all authentication-related HTTP routes for the server.
 *              Handles signup and signin operations for users.
 *              Routes parse incoming request data, call the corresponding UseCases, 
 *              and send appropriate JSON responses back to the client.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 *
 * @notes       - This file should not contain business logic; delegate logic to UseCases.
 *              - Handles POST requests for '/auth/signup' and '/auth/signin'.
 *              - Returns JSON responses with either success data or error messages.
 *              - Works with pure Node.js HTTP server (no Express).
 */


import SignUpUseCase from '../../core/usecases/SignUpUseCase.js';
import LoginUseCase from '../../core/usecases/LoginUseCase.js';
import supabase from '../../config/supabase.js';
import UserRepository from '../../repositories/userRepository.js';
/**
 * authRouter
 * @function
 * @description Handles authentication routes: signup and signin.
 *              Parses request body, calls the appropriate UseCase, and returns JSON responses.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object used to send data back to the client.
 * @returns {void} - Sends JSON response directly via the res object.
 *
 * @throws {Error} - Throws errors internally if UseCase execution fails. Errors are returned in JSON responses.
 *
 * @notes
 * - This function does not return values; responses are sent through the res object.
 * - Request body is expected to be JSON; parse accordingly.
 * - All errors should be handled gracefully and returned with proper HTTP status codes.
 */
const userRepo = new UserRepository(supabase);
export const authRouter = (req, res) => {
    //sign up with Email 
    if (req.method === 'POST' && req.url === '/auth/signup') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const data = JSON.parse(body);
            try {
                
                
                const signUp = new SignUpUseCase(userRepo);
                const user = await signUp.signUpWithEmail(data);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });

        //Sign in with Email case
    } else if (req.method === 'POST' && req.url === '/auth/signin') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const data = JSON.parse(body);
            try {
                const login = new LoginUseCase(userRepo);
                const token = await login.loginWithEmail(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token }));
            } catch (err) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Auth route not found' }));
    }
};
