const express = require('express');
const app = express();
const path = require('path');

// Serve files from the 'Audios' directory
app.use('/audios', express.static(path.join(__dirname, '../audios')));

// Other server setup and routes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});