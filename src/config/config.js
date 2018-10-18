module.exports = {
  xoauth2Options: {
    user: process.env.ALERTS_EMAIL_ID,
    clientId: process.env.ALERTS_GOOGLE_CLIENT_ID,
    clientSecret: process.env.ALERTS_GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.ALERTS_GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.ALERTS_GOOGLE_ACCESS_TOKEN
  }
};
