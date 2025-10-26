const config = require('../config.json');
const TokenBucket = require('../tokenBucket.js');

const endpointBuckets = new Map();

/**
*  Method checks and matches actual request path against route templates.   
*  Eg: GET /user/123 is checked against GET /user/:id
* 
*/
const getEndPointConfig = (method, path) => {
 
    for(const limit of config.rateLimitsPerEndpoint) {
        const [configMethod, configPath ] = limit.endpoint.split(' ');
        
        // Skip if HTTP methods don't match
        if(configMethod !== method) {
          continue;
        }
        
        const pathSegments = path.split('/');
        const templateSegments = configPath.split('/');
        
        // Skip if split paths don't have same number of segments
        if(pathSegments.length !== templateSegments.length) {
          continue;
        }
        
        const matches = templateSegments.every((templateSeg, i) => {
          // If template starts with ":" => true, else look for exact match. 
          return templateSeg.startsWith(':') || templateSeg === pathSegments[i];
        });
        
        if(matches) {
          return {
            burst: limit.burst,
            sustained: limit.sustained,
            endpoint: limit.endpoint
          }
        }
        
    }
 s
    // No matching configuration available
    return null;
    
}

/**
 *  Creates or Gets a token bucket for each specific endpoint. 
 */
const getEndPointBucket = ({ endpoint, burst, sustained }) => {
  if(!endpointBuckets.has(endpoint)){
    endpointBuckets.set(endpoint, new TokenBucket(burst, sustained));
  }
  
  return endpointBuckets.get(endpoint);
}

module.exports = {
  getEndPointConfig,
  getEndPointBucket,
  endpointBuckets
}