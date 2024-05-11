const { verifyToken } = require('../controllers/authControllers');
const {createContact, listContacts, markScam, findContacts} = require('../controllers/contactControllers');
const router = require('express').Router();

router.route('/createContact').post(verifyToken,createContact);
router.route('/listContacts').get(verifyToken,listContacts);
router.route('/markSpam').patch(verifyToken,markScam);
router.route('/searchContacts').get(verifyToken,findContacts);


module.exports = router;