class TokenBucket {
    // Each Request is assumed to take only one token.
    static REQUEST_TOKENS = 1;
    
    constructor (capacity, refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = capacity;
        this.lastRefill = Date.now();
    }
    
    /**
     *  Refills tokens based on elapsed time since last refill.
     */
    refill() {
      const now = Date.now();
      const elapsedMinutes = (now - this.lastRefill) / 1000 * 60;
      
      const tokensToAdd = elapsedMinutes * this.refillRate;
      
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
    
    /**
     *  Consumes tokens from bucket, returns remaning tokens from bucket.
     */
    consume() {
      this.refill();
      
      if(this.tokens >= TokenBucket.REQUEST_TOKENS){
        this.tokens = this.tokens - TokenBucket.REQUEST_TOKENS;
        return {
          accepted: true,
          remainingTokens: Math.floor(this.tokens)
        }
      }else {
        return {
          accepted: false,
          remainingTokens: 0
        }
      }
    }
    
    
}

module.exports = TokenBucket;