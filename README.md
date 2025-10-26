Token Bucket Rate Limiter Service

An Algorithm to implement Token Bucket Rate Limiting  for internal middleware that communicates with multiple internal endpoints.

Assumptions: 

1) Implementation of Global Rate Limiter and not geared to a particular user. 

2) Each request consumes only one token.

3) Configuration is loaded once during startup, any changes need a restart.

4) All Route templates use colon syntax (eg: :id) for paramters 

Possible Followups: 

1) Implement per-client rate limiting with IP/Authentication.

2) Implement Logging Framework


