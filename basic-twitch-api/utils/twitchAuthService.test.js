const axios = require('axios');
jest.mock('axios');

const mockClientId = 'mock_client_id';
const mockClientSecret = 'mock_client_secret';
const mockStreamerUsername = 'testUser';
const mockToken = 'mock_token';
const mockStreamerId = 'mock_streamer_id';

process.env.TWITCH_CLIENT_ID = mockClientId;
process.env.TWITCH_CLIENT_SECRET = mockClientSecret;
process.env.TWITCH_STREAMER_USERNAME = mockStreamerUsername;

beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
});

afterAll(() => {
    jest.useRealTimers();
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

const {
    fetchAccessToken,
    getAccessToken,
    getStreamerId,
    resetAuth,
    clientId
} = require('./twitchAuthService');

afterEach(() => {
    resetAuth();
});

describe('fetchAccessToken', () => {
    it('Positive Test Case', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                access_token: mockToken,
                expires_in: 3600,
            },
        });

        axios.get.mockResolvedValueOnce({
            data: {
                data: [{ id: mockStreamerId }],
            },
        });
        
        const fetchPromise = fetchAccessToken();

        await fetchPromise;

        const accessString = `client_id=${mockClientId}&client_secret=${mockClientSecret}&grant_type=client_credentials`;

        expect(axios.post).toHaveBeenCalledWith(
            'https://id.twitch.tv/oauth2/token',
            accessString,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        expect(getAccessToken()).toBe(mockToken);
        expect(getStreamerId()).toBe(mockStreamerId);
        expect(setTimeout).toHaveBeenCalledTimes(1);

        jest.runOnlyPendingTimers();
    });

    it('Negative Test Case - Token Request Fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Token Request failed'));

        await fetchAccessToken();

        expect(axios.post).toHaveBeenCalled();

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60 * 1000);

        expect(() => getAccessToken()).toThrow('Access token unavailable.');
    });

    it('Negative Test Case - Streamer Fetch Fails', async () => {
        axios.post.mockResolvedValueOnce({
            data: { access_token: mockToken, expires_in: 3600 },
        });
    
        axios.get.mockRejectedValueOnce(new Error('Streamer fetch failed'));
    
        await fetchAccessToken();
    
        expect(getAccessToken()).toBe(mockToken);
    
        expect(() => getStreamerId()).toThrow('Streamer ID not available.');
    });
});