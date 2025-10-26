# ⚡ Token Bucket Rate Limiter Service

An internal middleware service implementing a **Token Bucket Algorithm** for rate limiting requests across multiple internal endpoints.  
This service ensures that internal APIs remain performant and resilient under load, by enforcing a global request rate limit.

## ⚙️ Core Assumptions

- 🌐 **Global Rate Limiter** — applies globally, not per-user or per-client.  
- 🪙 **One Token per Request** — every request consumes exactly one token.  
- 🔧 **Static Configuration** — configuration is loaded once at startup; changes require a service restart.  
- 🧩 **Colon Syntax for Routes** — route templates use the `:param` format, e.g. `/users/:id`.  

## 🚀 Future Enhancements

### 🔐 Per-Client Rate Limiting
Extend the algorithm to handle:
- IP-based throttling  
- Authenticated client-based limits  

### 🧾 Logging Framework
Integrate a structured logging layer to track:
- Rejected requests  
- Token bucket metrics 
- Endpoint-level usage patterns  
