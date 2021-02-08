'use strict';
const insuredService = require('../database-service/insure.service');
const contractService = require('../database-service/contract.service');
const claimcaseService = require('../database-service/get-claim-case.service');
const logger = require('../logger');

/** @module controller/search */

/**
 *
 *
 * @param {*} search
 * @param {*} from
 * @param {*} to
 * @returns result array
 */
async function search(search, from, to) {
  const start = +new Date();
  let searchStrings = search.split(' ');
  let regex = [];
  for (var i = 0; i < searchStrings.length; i++) {
    regex[i] = new RegExp(searchStrings[i], 'i');
  }
  let result = [];
  let returnobject = {
    time: 0,
    length_total: 0,
    length_page: 0,
    result: [],
  };
  let insureds = await insured(regex, to);
  returnobject.length_total += getLength(insureds);
  insureds = getResult(insureds);
  let contracts = await contract(regex, to);
  returnobject.length_total += getLength(contracts);
  contracts = getResult(contracts);
  result = insureds.concat(contracts);
  result.sort((a, b) => (a.score < b.score ? 1 : -1));
  result = result.slice(from, to);
  const end = +new Date();
  logger.info(
    'search (' +
      from +
      ', ' +
      to +
      ') brauchte dafür: ' +
      (end - start) +
      ' und gab ' +
      result.length +
      ' zurück'
  );
  returnobject.result = result;
  returnobject.time = end - start;
  returnobject.length_page = result.length;

  return returnobject;
}

/**
 *
 *
 * @param {*} object
 * @returns int
 */
function getLength(object) {
  let length = 0;
  if (object != null) {
    length = object.length;
  }
  return length;
}

/**
 *
 *
 * @param {*} object
 * @returns result
 */
function getResult(object) {
  let result = [];
  if (object != null) {
    result = object.result;
  }
  return result;
}

/**
 *
 *
 * @param {*} regex
 * @param {*} to
 * @returns result
 */
async function insured(regex, to) {
  let insureds = await insuredService.search(regex);
  let totalresult = { result: [], length: 0 };
  totalresult.length = insureds.length;
  let searchresults = [];
  for (let index = 0; index < insureds.length; index++) {
    insureds[index] = getRegexScore(insureds[index], regex);
  }
  insureds.sort((a, b) => (a.score < b.score ? 1 : -1));
  insureds = insureds.slice(0, to);
  for (let index = 0; index < insureds.length; index++) {
    searchresults.push({
      claimCases: await claimcaseService.getByPartnerId(insured.partnerId),
      contracts: await contractService.getByPartnerId(insured.partnerId),
      score: insureds[index]['score'],
      found: insureds[index]['found'],
      insured: miniInsured(insureds[index]),
    });
  }
  totalresult.result = searchresults;
  return totalresult;
}

/**
 *
 *
 * @param {*} object
 * @returns insured
 */
function miniInsured(object) {
  let o = {};
  o['_id'] = object._id;
  o['salutation'] = object.salutation;
  o['lastname'] = object.lastname;
  o['firstname'] = object.firstname;
  o['partnerId'] = object.partnerId;
  return o;
}

/**
 *
 *
 * @param {*} regex
 * @param {*} to
 * @returns result
 */
async function contract(regex, to) {
  let contracts = await contractService.search(regex);
  let totalresult = { result: [], length: 0 };
  totalresult.length = contracts.length;
  let searchresults = [];
  for (let index = 0; index < contracts.length; index++) {
    contracts[index] = getRegexScore(contracts[index], regex);
  }
  contracts.sort((a, b) => (a.score < b.score ? 1 : -1));
  contracts = contracts.slice(0, to);
  for (let index = 0; index < contracts.length; index++) {
    searchresults.push({
      contracts: contracts[index],
      claimCases: await claimcaseService.getClaimCasesByContractID(
        contracts[index]._id
      ),
      insured: await insuredService.getByPartnerId(contracts[index].partnerId),
      score: contracts[index]['score'],
      found: contracts[index]['found'],
    });
    totalresult.result = searchresults;
    return totalresult;
  }
}

/**
 *
 *
 * @param {*} object
 * @param {*} regexArray
 * @returns score
 */
function getRegexScore(object, regexArray) {
  let score = 0;
  let found = [];
  for (const key in object) {
    if (typeof object[key] == 'object') {
      let r = getRegexScore(object[key], regexArray);
      score += r['score'];
      if (r['found'].length > 0) {
        found.push(r['found']);
      }
    } else {
      const test = object[key];
      for (let index = 0; index < regexArray.length; index++) {
        const result = test.toString().match(regexArray[index]);
        if (result != null) {
          score = score + result[0].length;
          found.push(test.replace(result[0], '<b>' + result[0] + '</b>'));
        }
      }
    }
  }
  object['score'] = score;
  object['found'] = found;
  return object;
}

module.exports = {
  search: search,
};
