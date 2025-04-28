const request = require('supertest');
const express = require('express');
const channelRouter = require('./channel');

jest.mock('../utils/twitchAuthService', () => ({
    getAccessToken: jest.fn(() => 'mock_token'),
    getStreamerId: jest.fn(() => 'mock_streamer_id'),
    clientId: 'mock_client_id'
}));

const axios = require('axios');
jest.mock('axios');

const app = express();
app.use('/channel', channelRouter);

describe('GET /channel/followers', () => {
    it('Positive Test Case', async () => {
        axios.get.mockResolvedValueOnce({data: { total: 1234 }});
        
        const res = await request(app).get('/channel/followers');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ count: 1234 });
        expect(axios.get).toHaveBeenCalledWith(
            'https://api.twitch.tv/helix/channels/followers',
            expect.objectContaining({
                params: { broadcaster_id: 'mock_streamer_id' },
                headers: expect.objectContaining({
                    Authorization: 'Bearer mock_token',
                    'Client-ID': 'mock_client_id'
                })
            })
        );
    });

    it('Negative Test Case - No Auth', async () => {
        axios.get.mockRejectedValueOnce(new Error('Twitch API Call Failed.'));
        
        const res = await request(app).get('/channel/followers');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Failed to fetch followers from Twitch API' });
    });
});