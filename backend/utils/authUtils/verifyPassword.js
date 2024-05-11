const bcrypt = require('bcryptjs');
const verifyPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = verifyPassword