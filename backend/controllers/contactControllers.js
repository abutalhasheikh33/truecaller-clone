const User = require("../models/User");
const Global = require("../models/Global");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const List = require("../models/List");

exports.createContact = catchAsync(async (req, res, next) => {
  const { name, phoneNumber } = req.body;

  // Check if the contact already exists globally
  let globalContact = await Global.findOne({ phoneNumber });
  const names = globalContact?.name;
  // If the contact doesn't exist globally, create a new one
  if (!globalContact) {
    globalContact = await Global.create({ name: [name], phoneNumber });
  } else {
    if (globalContact.name[0] === "$Unknown") {
      await Global.findByIdAndUpdate(globalContact._id, { name: name });
    }
  }

  // Find the logged-in user
  const user = await User.findById(req.user.id).populate("personalContacts");
  
  // Check if the contact already exists in the user's personal contacts
  const existingContact =
    user.personalContacts.list &&
    user.personalContacts.list.find(
      (contact) => (contact.phoneNumber === phoneNumber || contact.name === name)
    );

  // If the contact doesn't exist in the user's personal contacts, add it
  let contactList;
  if (!existingContact) {
    // find contact list
    contactList = await List.findOne({ userId: req.user.id });
    contactList.list.push({ name, phoneNumber });
    await contactList.save();
    if (!names?.includes(name)) {
      await Global.findByIdAndUpdate(globalContact._id, { $push: { name } });
    }
  } else {
    return next(new AppError("Already exist in personal contacts", 400));
  }

  res
    .status(201)
    .json({ globalContact, message: "Contact created successfully" });
});

exports.listContacts = catchAsync(async (req, res) => {
  // Find the logged-in user
  const user = await User.findById(req.user.id).populate("personalContacts");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Extract personal contacts from the user document
  const personalContacts = user.personalContacts.list;

  // Return the list of personal contacts
  res.status(200).json({ personalContacts });
});

exports.markScam = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const userId = req.user.id;

  // Find the logged-in user
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if the number is already marked as spam by the user
  let globalContact = await Global.findOne({ phoneNumber });

  if (globalContact && globalContact.markedBy.includes(userId)) {
    return next(new AppError("Number already marked scam by the user", 400));
  }

  // Mark the number as spam
  if (!globalContact) {
    // Create a new global contact if it doesn't exist
    globalContact = await Global.create({
      name: "$Unknown",
      phoneNumber,
      markedBy: [userId],
    });
  } else {
    // Update existing global contact
    globalContact.markedBy.push(userId);
    await globalContact.save();
  }

  // Update spam likelihood percentage
  const totalUsers = await User.countDocuments();
  const markedByCount = globalContact.markedBy.length;
  const spamLikelihoodPercentage = (markedByCount / totalUsers) * 100;

  // Update the spam likelihood percentage in the Global document
  globalContact.spamLikelihoodPercentage = spamLikelihoodPercentage;
  await globalContact.save();

  res.status(200).json({ message: "Phone number marked as spam" });
});

exports.findContacts = catchAsync(async (req, res) => {
  const { query } = req.body;
  const userId = req.user.id;
  // Check if the searched number exists in the user's contact list
  const user = await User.findById(userId).populate(
    "personalContacts",
    "list"
  );

  let contactInPersonalContacts = null;
  if (user) {
    contactInPersonalContacts = user.personalContacts.list.find(
      (contact) => contact.phoneNumber === query
    );
  }

  // If the searched number exists in the user's contact list, prioritize showing that name
  if (contactInPersonalContacts) {
    return res.json({
      nameResults: [
      ],
      phoneNumberResults: [
        { name: contactInPersonalContacts.name, phoneNumber: query }
      ],
    });
  }

  // Check if the searched name exists in the user's contact list
  let contactByName = null;
  if (user) {
   
    contactByName = user.personalContacts.list.find(
      (contact) => contact.name.toLowerCase() === query.toLowerCase()
    );
  }

  // If the searched name exists in the user's contact list, prioritize showing that contact
  if (contactByName) {
    return res.status(200).json({
      nameResults: [
        { name: contactByName.name, phoneNumber: contactByName.phoneNumber },
      ],
      phoneNumberResults: [],
    });
  }



// Search by name
const nameResults = await Global.find({
  name: { $elemMatch: { $regex: `^${query}$`, $options: "i" } }, // Exact name match for any element in the array
}).select("name phoneNumber spamLikelihoodPercentage");

const partialNameResults = await Global.find({
  name: { $elemMatch: { $regex: query, $options: "i", $ne: `^${query}$` } }, // Names containing the query but not exactly matching it for any element in the array
}).select("name phoneNumber spamLikelihoodPercentage");



// Here you can apply logic to ensure unique documents based on the phoneNumber
// Assuming nameResults and partialNameResults are arrays of documents
const uniqueNameResults = []; // Array to hold unique documents based on phoneNumber
const uniquePhoneNumbers = new Set(); // Set to track unique phone numbers

// Function to add a document to the uniqueNameResults array only if its phoneNumber is unique
const addUniqueDocument = (document) => {
  if (!uniquePhoneNumbers.has(document.phoneNumber)) {
    uniqueNameResults.push(document);
    uniquePhoneNumbers.add(document.phoneNumber);
  }
};

// Add unique documents from nameResults
nameResults.forEach(addUniqueDocument);

// Add unique documents from partialNameResults
partialNameResults.forEach(addUniqueDocument);

// Sort the array of objects based on the 'name' parameter
uniqueNameResults.sort((a, b) => {
    const nameA = Array.isArray(a.name)?a.name[0]:a.name;
    const nameB = Array.isArray(b.name)?b.name[0]:b.name;
  // Use localeCompare for string comparison (case-insensitive)
  return nameA.localeCompare(nameB);
});

  // Search by phone number
  const phoneNumberResults = await Global.find({
    phoneNumber: { $regex: query, $options: "i" },
  }).select("name phoneNumber spamLikelihoodPercentage");


  res.status(200).json({
    nameResults: uniqueNameResults,
    phoneNumberResults: phoneNumberResults,
  });
});


exports.showDetails = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  // Search for the phone number in the Global collection
  const globalEntry = await Global.findOne({ phoneNumber });
  if (!globalEntry) {
    return next(new AppError("Phone Number not found", 404))
  }

  if (globalEntry) {
    // If found, retrieve the spam likelihood percentage
    const spamLikelihood = globalEntry.spamLikelihoodPercentage;

    // Check if the user is registered and fetch additional information
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(200).json({
        name: globalEntry.name[0],
        phoneNumber: globalEntry.phoneNumber,
        spamLikelihood,
      })
    } else {
      const { city, country, email } = user;

      // Check if the user is in the contact list of the searcher (pseudo-code)
      // Check if the user is in the contact list of the searcher
      const isUserInContactList = await List.exists({ userId: user._id, 'list.phoneNumber': req.user.phoneNumber });

      // Assuming isUserInContactList is true if the user is in the contact list
      if (isUserInContactList) {
        // If the user is in the contact list, return additional information (email)                 
        return res.status(200).json({ name: globalEntry.name[0], phoneNumber: globalEntry.phoneNumber, spamLikelihood, city, country, email })
      } else {
        // If the user is not in the contact list, don't return the email
        return res.status(200).json({ name: globalEntry.name[0], phoneNumber: globalEntry.phoneNumber, spamLikelihood, city, country });
      }


    }
  }
})
