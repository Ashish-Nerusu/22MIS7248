const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./src/routes/notification.routes');
const { Log, STACKS, LEVELS } = require('logging_middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  Log(STACKS.BACKEND, LEVELS.ERROR, 'middleware', `Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Log(STACKS.BACKEND, LEVELS.INFO, 'config', `Server started on port ${PORT}`);
});
