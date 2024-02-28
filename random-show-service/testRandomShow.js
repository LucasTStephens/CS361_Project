const fetch = require('node-fetch');
const URL = 'http://localhost:3001/random-show';

async function testRandomShowService() {
    try {
        const response = await fetch(URL);
        console.log('Requesting data from microservice')
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.randomShow || typeof data.randomShow !== 'object') {
            throw new Error('Invalid response format!');
        }

        console.log('Random Show:', data.randomShow);
        console.log('Test passed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testRandomShowService();
