const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../main');
const { endpointBuckets } = require('../utils/utils');

chai.use(chaiHttp);

const { request, expect } = chai;

describe('Rate Limiter Excercise', () => {
  
  beforeEach(() => {
    endpointBuckets.clear();
  })
  
  describe('Success ::', () => {
    
    it('should accept request when bucket has tokens', (done) => {
      chai.request(app).get('/take').send({
        method: 'GET',
        path: '/user/123'
      }).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.result).to.equal('accept');
        done();
      })
    })
    
    it('should accept multiple requests upto burst limit', (done) => {
      const requests = [];
      const burstLimit = 10;
      let completed = 0;
      const responses = [];
      
      for(let i=0; i< burstLimit; i++) {
        
      chai.request(app).get('/take').send({
          method: 'PATCH',
          path: '/user/224'
        }).end((err, res) => {
          responses.push(res);
          completed++;
          
          if(completed === burstLimit) {
            
            responses.forEach(res => {
              expect(res).to.have.status(200);
              expect(res.body.result).to.equal('accept');
            });
            
            done();
          }
          
        })
        
        
        
      }
    })
    
  })
  
  describe('Failure ::', () => {
     it('should reject when bucket is empty', (done) => {
        const burstLimit = 10;
        const totalRequests = 15;
        let completedCount = 0;
        const responses = [];
        
        for(let i=0; i<totalRequests;i++){
        chai.request(app).get('/take').send({
          method: 'PATCH',
          path: '/user/123'
        }).end((err, res) => {
          completedCount++;
          responses.push(res);
          
          if(completedCount === totalRequests) {
            
            const accepted = responses.filter(r => r.body.result === 'accept');
            const rejected = responses.filter(r => r.body.result === 'reject');
          
            
            rejected.forEach(r => {
              expect(r).to.have.status(500);
              expect(r.body.remainingTokens).to.equal(0);
            })
            
            done();
          }
          
        })
        
        }
        
        
      
      
      
     })
  })
  
  
  describe('Validation ::', () => {
    
    it('should return 500 when method or path is missing', (done) => {
      chai.request(app).get('/take').send({}).end((err, res) => {
        expect(res).to.have.status(500);
        done();
      })
    })
    
    it('should return 404 when endpoint is not configured', (done) => {
      chai.request(app).get('/take').send({
        method: 'DELETE',
        path: '/user/224'
      }).end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
    })
    
  })
  
  
  
  
})

