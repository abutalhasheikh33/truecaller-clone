// Function to add a token to the Redis blacklist
async function addToBlacklist(redisClient, token) {
    await redisClient.set(token, `bl_${token}`);
}

module.exports = addToBlacklist;