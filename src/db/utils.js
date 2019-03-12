const mongoose = require("mongoose");

const isValidExternalLicenseId = externalLicenseId => {
  return new Promise(resolve => {
    mongoose.connection.db.collection("licenses", function checkExternalLicenseId(
      err,
      licenseCollection
    ) {
      if (err) {
        resolve(false);
      }
      licenseCollection
        .find({ "info.externalLicenseId": externalLicenseId })
        .toArray((error, doc) => {
          if (error || doc.length === 0) {
            resolve(false);
          }
          resolve(true);
        });
    });
  });
};

module.exports = {
  isValidExternalLicenseId
};
