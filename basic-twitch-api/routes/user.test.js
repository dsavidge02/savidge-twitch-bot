const request = require('supertest');
const express = require('express');
const userRouter = require('./user');

jest.mock('../utils/twitchAuthService', () => ({
    getAccessToken: jest.fn(() => 'mock_token'),
    clientId: 'mock_client_id'
}));

const axios = require('axios');
jest.mock('axios');

const app = express();
app.use('/user', userRouter);

describe('GET /user', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Positive Test Case', async () => {
        const mockUserData = {
            data: [
                {
                    id: '12345',
                    login: 'testUser',
                    display_name: 'test_user'
                }
            ]
        };

        axios.get.mockResolvedValueOnce({data: mockUserData});
        
        const res = await request(app).get('/user?login=testUser');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUserData);
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.twitch.tv/helix/users',
            expect.objectContaining({
                params: { login: 'testUser' },
                headers: expect.objectContaining({
                    Authorization: 'Bearer mock_token',
                    'Client-ID': 'mock_client_id'
                })
            })
        );
    });

    it('Negative Test Case - No login parameter', async () => {
        const res = await request(app).get('/user');

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'expected request /user?login=<username>' });
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('Negative Test Case', async () => {
        axios.get.mockRejectedValueOnce(new Error('Twitch API Call Failed.'));
                
        const res = await request(app).get('/user?login=testUser');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Failed to fetch user from Twitch API' });
    });
});