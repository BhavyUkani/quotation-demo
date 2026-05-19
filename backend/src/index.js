const express = require('express'); // restart trigger
const cors = require('cors');
const path = require('path');

const { sequelize } = require('./models');


const routes = require('./routes');

const app = express();



app.use(cors());
app.use(express.json());
const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

app.use('/api', routes);

app.use(express.static(path.join(__dirname, '../dist')));
// app.use('/tmp', express.static(path.join(__dirname, '../tmp')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

sequelize.sync({ alter: true, logging: false })
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, "0.0.0.0", () => {
                console.log(`Server running locally on port ${PORT}`);
            });
        }
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

module.exports = app;