const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// [BACKEND SECURITY WALL]
// ==========================================

// 1. Helmet: Sets up crucial security headers to prevent XSS, Clickjacking, and Sniffing.
app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP for local inline scripts & styles to function normally.
}));

// 2. CORS: Restricts cross-origin requests to prevent unauthorized embedding/API calls.
app.use(cors({
    origin: '*', // Restrict to your domain in production (e.g., 'https://frospall.info')
    methods: ['GET', 'POST']
}));

// 3. Rate Limiting: Anti-DDoS and spam protection.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 150, // Limit each IP to 150 requests per window
    standardHeaders: true, 
    legacyHeaders: false, 
    message: "Security Wall Triggered: Too many requests from this IP, please try again after 15 minutes."
});
app.use(limiter);

// Remove the `X-Powered-By` header to hide the fact that the site runs on Express
app.disable('x-powered-by');

// ==========================================
// [STATIC FILES SERVING]
// ==========================================

app.use(express.static(path.join(__dirname)));

// Wildcard route for SPA functionality.
app.get(/^.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`[SECURITY-WALL] Backend server successfully running on port ${PORT}`);
    console.log(`[SECURITY-WALL] Helmet, Rate Limiter, and CORS protocols are ACTIVE.`);
});
