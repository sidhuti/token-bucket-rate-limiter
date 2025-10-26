const express = require('express');
const TokenBucket = require('./tokenBucket.js');
const { getEndPointBucket , getEndPointConfig } = require('./utils/utils.js')


const app = express();
app.use(express.json());


app.get('/take/', (req, res) => {
  const { method, path } = req.body;
  
  if(!method || !path) {
    return res.status(500).json({
      error: 'Missing required fields method and path...'
    });
  }
  
  const endPointConfig = getEndPointConfig(method, path);
  
  if(!endPointConfig) {
    return res.status(404).json({
      error: `No rate limit configuration available for given ${method} ${path}`
    })
  }
  
  const bucket = getEndPointBucket({
    endpoint: endPointConfig.endpoint,
    burst: endPointConfig.burst,
    sustained: endPointConfig.sustained
  });
  
  const result = bucket.consume();
  
  if(result.accepted){
    return res.status(200).json({
      result: 'accept',
      remainingTokens: result.remainingTokens,
      endpoint: endPointConfig.endpoint,
    })
  }else{
    return res.status(500).json({
      result: 'reject',
      remainingTokens: result.remainingTokens,
      endpoint: endPointConfig.endpoint,
      message: 'Rate limit exceeded'
    })
  }
  
})



module.exports = app;