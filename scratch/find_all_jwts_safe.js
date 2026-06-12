const fs = require('fs');
const readline = require('readline');

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

async function searchLog() {
  const fileStream = fs.createReadStream('C:\\Users\\Rajit\\.gemini\\antigravity\\brain\\ac0087f6-9837-49f9-9a17-f7be8deaf15e\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const tokens = new Set();
  for await (const line of rl) {
    const matches = line.match(/(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/g);
    if (matches) {
      matches.forEach(token => tokens.add(token));
    }
  }

  console.log(`Found ${tokens.size} unique JWTs in total.`);
  const tokenList = Array.from(tokens);
  for (let i = 0; i < tokenList.length; i++) {
    const t = tokenList[i];
    const payload = decodeJwt(t);
    if (payload) {
      let expStr = 'none';
      if (payload.exp) {
        try {
          expStr = new Date(payload.exp * 1000).toISOString();
        } catch(e) {
          expStr = 'invalid date (' + payload.exp + ')';
        }
      }
      console.log(`\nToken ${i + 1}:`);
      console.log(`  Type: ${payload.token_type}`);
      console.log(`  User ID: ${payload.user_id}`);
      console.log(`  Expires: ${expStr}`);
      console.log(`  Token: ${t}`);
    }
  }
}

searchLog();
