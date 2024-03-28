// Backend API
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import cors from 'cors';
import path from 'path';
import express from 'express';
import 'express-async-errors';

import errorHandler from './middleware/errors';

const app = express();

// Server Config
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Register routes
app.use('/static', express.static('public'));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/api', (_, res) => res.status(200).send('This is an API!'));

// Handle Errors
app.use(errorHandler);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;
