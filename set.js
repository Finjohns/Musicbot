const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'ANDBAD-BOT;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUZqL24zQ1NUbG1IbzBOdkN1aWNvZ1dvUTlUS0l3MUdpMVhhVG9xRmRGWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicEQvMGdyUW9mLy9KTHNvQ2N5K2xOSzM4UlI5YmI5MUdob1JTZW1rSVJVZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBSjBKWFl0SHNKRkp1aXM1dHU4aSs0OUVNV1Y1Qk9ackZtZnpnNkxHdDJRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJZmFmUnpmZDVvTElGWEZxcktxZUg0RE1BVWd0NmZLNTVaVktTNnVZc2lrPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlHVytidEs4S0lxdWZrQXEwd2pDQjg5OUtZTFdWVnZBNGtCSVJyRzV0MTA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IisxamI1ZmN2elJjS0djUS8yb0c0djdlZE1ya3NSUmp0NGdDazk2ZmVXMEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEtxUWVYWkI2R095bWw4YzVUTXFuME5SNXJEWlRPeHpFNzk2UW5KV3NXOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOE5UNVAwRTU4bjJUdnFBQkpqdUFSR1RwY2pWQmNlMEYwUDRvMDhFdndsQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNHTExZMjQyVTIrWENJNkUzSytCUEM1SmZCT2RpQit6ZXZQNGtUckNQbHVleGdleXFldTFvUnFOWCtIUnMwaDdtREd2dHgxWlczQnNDNWtXUEtQbkN3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTcsImFkdlNlY3JldEtleSI6IndIMjg1NUlqcFljWG1xZHhsbGNlOVN2dkxSVy9LTUpXUHd5RkVnNFo5ZHM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Ill5V0llMkZQUjhtSWwwcVpFT0x2eXciLCJwaG9uZUlkIjoiM2Q3NmNjZGItZmU3Ny00OTcyLWE4YmItN2IwYTFmYWM0ODM2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlhSRE54TEtIMGh3czhxQjh3aHRaNXJ6OXIvST0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzTklmNDRQL3dWRG5NOXFhU2JkNW5yd2FGUTA9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiR1E4MlpHUFEiLCJtZSI6eyJpZCI6IjI1NDc2OTM2NTYxNzoxNUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmJmL0owQkVOZm9vTGdHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOXM4N2hGQUZuaEtWbFBsS2tMMnI5Ujg2bmVRcC8xRTZFeFZHZUpDdzJtdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiY1hlQjl1YWZQUEdic29FOGU1a1RDNDlXN2c5N1JmNVpKaHZTb1hwRGkzV1Q0Sk9LMmZRRGYvMktJaGFjOVpuZ0ppUFhtbkNVaFJIZXU3Qm11NWxVQXc9PSIsImRldmljZVNpZ25hdHVyZSI6IkVIQXEzTGlrVnBxN1RIbSszUlpwcC9FbnMxM2ptZ3RDaXl6eHpxQ2ZkOTZkblRBYUdBTnZKREttYnR2SWNtVkVxS2ZhaituN0NLU0dlY2FTaWphRURRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzY5MzY1NjE3OjE1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZiUE80UlFCWjRTbFpUNVNwQzlxL1VmT3Aza0tmOVJPaE1WUm5pUXNOcHMifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Mjg1OTA5NDksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUDIxIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Jinwiil",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254769365617",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'musicbot',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/g1l3vs.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
