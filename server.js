const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 17432;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.post('/ping', async (req, res) => {
  try {
    const { url } = req.body;
    const start = Date.now();
    const response = await axios.get(url);
    const end = Date.now();
    const pingTime = end - start;

    res.json({
      status: response.status,
      pingTime: `${pingTime}ms`,
      headers: response.headers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to ping the website' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});