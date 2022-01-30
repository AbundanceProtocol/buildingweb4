const express = require('express');
const router = express.Router();
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Proposal = require('../models/Proposal');
const UserCalcs = require('../models/UserCalcs');
const PostCalcs = require('../models/PostCalcs');
const Category = require('../models/Category');
const sentences = require('../config/functions');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = router;
