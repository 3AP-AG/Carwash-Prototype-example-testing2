package ch.aaap.prototype.platform.security;

// One security chain over / , static assets and /api/** (rule 8, T15).
// TODO(b): pick the login or passcode chain by ProtectionMode; JDBC session cookie HttpOnly/Secure/SameSite=Strict; CSRF cookie-to-header; 401 ProblemDetail for /api/**.
public class SecurityConfig {}
