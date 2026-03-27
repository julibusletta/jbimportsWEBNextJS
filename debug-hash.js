import crypto from 'crypto';

const mysteryHashB64 = 'F2aLgx7rls6BJRY8xHZB2sP3VDE1qSQVFmo+1xc8P5Y=';

function check(str) {
    const hash = crypto.createHash('sha256').update(str).digest('base64');
    if (hash === mysteryHashB64) {
        console.log(`MATCH! String is: [${str}]`);
    } else {
        // console.log(`No match for [${str}]: ${hash}`);
    }
}

// Common header prefixes
console.log('Checking common prefixes...');
check('Bearer ');
check('Bearer');
check('Basic ');
check('Basic');
check('Token ');
check('Token');
check('JWT ');
check('JWT');
check('ApiKey ');
check('apikey=');

// The client secrets from the user
const clientId = 'TRG54rWLT09FFHPDQysXosdJp8g1Ehbl';
const clientSecret = 'hG-5o1v2Kjm5QfxRu7FMR8V4GtVjJM_6CfoiGg2cWHCamG4NE68czTRQQTtEkbHO';
const terminalId = 'bf1b6c74-59b7-4b90-a579-fa3b6ad2b492';

check(clientId);
check(clientSecret);
check(terminalId);

// Check if it's the concatenation
check(`${clientId}:${clientSecret}`);
check(Buffer.from(`${clientId}:${clientSecret}`).toString('base64'));

console.log('Done.');
