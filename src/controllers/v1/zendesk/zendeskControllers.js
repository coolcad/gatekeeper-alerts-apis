const axios = require("axios");
const logger = require("winston");

const getAxiosInstance = () => {
  return axios.create({
    method: "GET",
    baseURL: `https://gatekeeperhelp.zendesk.com/api/v2/help_center/`,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZENDESK_AUTHORIZATION_TOKEN}`
    }
  });
};

const zendeskControllers = {};

/**
 * Categories available
 * Password Vault: 360000980233
 * Hub: 360000953033
 * Client: 360000952953
 * Authentication Tokens: 360000949414
 *  Product Questions & Trouble Shooting: 360000940673
 */

const CATEGORIES = {
  HUB: "360000953033",
  CLIENT: "360000952953"
};

/**
 * Gets available categories for GateKeeper articles on Zendesk.
 *
 */
// const getCategories = async () => {
//   try {
//     const axiosInstance = getAxiosInstance();
//     const response = await axiosInstance({
//       url: `/categories.json`
//     });
//     const categories = response.data.results;
//     return categories;
//   } catch (error) {
//     logger.error(error.message);
//   }
// };

/**
 * Searches Zendesk for query
 *
 * @param {string} query
 * @returns {Array<object>} Array of results from Zendesk
 */
const searchContent = async (query, category) => {
  try {
    const axiosInstance = getAxiosInstance();
    // Hardcoded for now
    let response = null;

    if (!category) {
      response = await axiosInstance({
        url: `/articles/search.json?query=${query}`
      });
    } else {
      response = await axiosInstance({
        url: `/articles/search.json?query=${query}&category=${category}`
      });
    }

    const searchResults = response.data;
    return searchResults;
  } catch (error) {
    logger.error(error.message);
  }
};

zendeskControllers.searchZendesk = async reqQuery => {
  try {
    const { category, query } = reqQuery;
    let results = {};
    if (!category) {
      // Search All if no category is given
      results = await searchContent(query);
    } else if (category.toLowerCase() === "hub") {
      results = await searchContent(query, CATEGORIES.HUB);
    } else if (category.toLowerCase() === "client") {
      results = await searchContent(query, CATEGORIES.CLIENT);
    }
    return results;
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = zendeskControllers;
