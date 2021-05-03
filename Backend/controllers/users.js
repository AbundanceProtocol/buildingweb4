const read = require('node-readability');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/index')
const Category = require('../models/Category');
const Post = require('../models/Post');
const Ratio = require('../models/Ratio');
const CatUpdate = require('../models/CatUpdate');
const CatTotal = require('../models/CatTotal');
const Proposal = require('../models/Proposal');
const Comment = require('../models/Comment');
const ComSentence = require('../models/ComSentence');
const PropReply = require('../models/PropReply');
const { update } = require('../models/User');

signToken = user => {
  return JWT.sign({
    iss: 'Platform',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1),
  }, JWT_SECRET)
}

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password, fullName } = req.body

    // Check if user exists
    const foundUser = await User.findOne({ email })
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is in use'});
    }
    
    // Create new user
    const newUser = new User({ email, password, fullName })
    await newUser.save();

    // Generate token
    const token = signToken(newUser)

    // Return token
    res.status(200).send(JSON.stringify({"data": {
      "user": newUser, 
      "token": token
    }})
    );
  },
  signIn: async (req, res, next) => {
    // console.log('sign in')
    // Generate token
    const token = signToken(req.user)
    const user = req.user
    res.status(200).send(JSON.stringify({"data": {
        "user": user, 
        "token": token
      }})
    );
  },
  secret: async (req, res, next) => {
    // Generate token
    // console.log('secret')
    const token = signToken(req.user)
    const user = req.user
    res.status(200).send(JSON.stringify({
      "data": {
        "user": user, 
        "token": token
      }})
    );
  },
  article: async (req, res, next) => {
      // console.log('article listener')
  },
  propBid: async (req, res, next) => {
    try {
      const bid = req.body.bid
      // console.log(bid)
      const propId = bid.propId
      const funding = parseFloat(bid.funding)
      const influence = parseFloat(bid.influence)/100
      const userId = req.user._id
      const userName = req.user.fullName
      // console.log(userId)
      let propInfo = await Proposal.findById({_id: propId}, ['bids'])
      // console.log(propInfo.bids)
      // console.log(propInfo.bids.length)
      let bidIndex = propInfo.bids.findIndex( bids => String(bids.user) == String(userId) )
      // console.log(bidIndex)
      if (bidIndex === -1) {
        propInfo.bids.push({ user: userId, userName: userName, funding: funding, influence: influence })}
      else {
        propInfo.bids[bidIndex] = { user: userId, userName: userName, funding: funding, influence: influence }}
      let propUpdate = await propInfo.save()
      res.status(200).send( JSON.stringify( {
        'data': { 
          'bids': propUpdate.bids,
          'status': 'bid success'
        }
      }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'bid failed',
          'error': error
        }
      } ) )
    }
  },
  propReply: async (req, res, next) => {
    try {
      const reply = req.body.reply
      const dataSources = reply.sources
      const dataCategories = reply.categories
      const summary = reply.summary
      const sources = dataSources.map(({item: url}) => ({url}))
      const categories = dataCategories.map(({catName: name, catId: catId, catReason: reason, catValue: importance}) => ({name, catId, reason, importance}))
      let propId = reply.propId
      // console.log(reply)
      const userId = req.user._id
      let userInfo = await User.findById(userId)
      let propInfo = await Proposal.findById(propId)
      let UTS = await totalUserScore(userId)
      let comIndex = propInfo.comments.findIndex( comment => String(comment.user) == String(userId) )
      let oldCategories
      let oldScore
      if ( comIndex !== -1 ) {
        oldCategories = propInfo.comments[comIndex].category
        oldScore = propInfo.comments[comIndex].totalScore
        propInfo.totalScore -= oldScore
        for (let i = 0; i < oldCategories.length; i++) {
          let catIndex = propInfo.category.findIndex( cat => String(cat.catId) == String(oldCategories[i].catId) )
          if ( catIndex !== -1 ) {
            let userImp = oldCategories[i].importance
            let totalScore = propInfo.category[catIndex].baseScore
            propInfo.category[catIndex].baseScore -= oldScore
            let totalImp = propInfo.category[catIndex].importance
            if (totalScore == oldScore) { propInfo.category[catIndex].importance = 0 }
            else {
              let adjImp = ((totalImp * totalScore) - (userImp * oldScore)) / (totalScore - oldScore)
              propInfo.category[catIndex].importance = adjImp
            }
          }
        }
      }

      let userCats = [...categories]
      // console.log(userCats)
      for (let i = 0; i < userCats.length; i++) {
        catPercent = await catRatioFn(userCats[i].catId)
        userCats[i].percent = catPercent
        userCats[i].score = parseFloat(userCats[i].importance) * catPercent
      }
      // console.log(userCats)
      let userTotalScore = 0
      if (userCats !== null) {
        for (let i = 0; i < userCats.length; i++ ) {
          userTotalScore += userCats[i].score }
      }
      if (userCats !== null && userTotalScore !== 0) {
        for (let i = 0; i < userCats.length; i++ ) {
          userCats[i].scoreRatio = userCats[i].score / userTotalScore }
      }
      let authorInfo = await User.findById(propInfo.author)

      let catIdList = []
      for (let i = 0; i < authorInfo.category.length; i++) {
        catIdList.push(String(authorInfo.category[i].catId)) }

      let userReplyPS = 0
      let userReplyScore = 0
      let userReplyCS = 0
      for (let i = 0; i < userCats.length; i++) {
        if ( catIdList.includes( String(userCats[i].catId) ) ) {
          let senIndex = authorInfo.category.findIndex( cat => String(cat.catId) == String(userCats[i].catId) )
          if (senIndex !== -1) {
            let catScore = parseFloat(authorInfo.category[senIndex].catScore) * userCats[i].scoreRatio
            let catPS = parseFloat(authorInfo.category[senIndex].catPS) * userCats[i].scoreRatio
            userReplyPS += catPS
            userReplyScore += catScore
          }
        }
      }
      if (userReplyPS !== 0) { userReplyCS = userReplyScore / userReplyPS }
      else { userReplyCS = 0 }
      propInfo.comments.push({
        user: userId,
        userName: userInfo.fullName,
        comment: summary,
        sources: sources,
        category: categories,
        totalCS: UTS.CS,
        totalPS: UTS.PS,
        totalScore: UTS.Score,
        estimatedReturn: userTotalScore * userReplyCS
      })
      // console.log(propInfo.totalScore)
      propInfo.totalScore += UTS.Score
      // console.log(propInfo.totalScore)
      for (let i = 0; i < categories.length; i++) {
        let catIndex = propInfo.category.findIndex( cat => String(cat.catId) == String(categories[i].catId) )
        if ( catIndex !== -1 ) {
          let userImp = categories[i].importance
          let totalScore = propInfo.category[catIndex].baseScore
          propInfo.category[catIndex].baseScore += UTS.Score
          let totalImp = propInfo.category[catIndex].importance
          if (totalScore + oldScore == 0) { propInfo.category[catIndex].importance = 0 }
          else {
            let adjImp = ((totalImp * totalScore) + (userImp * UTS.Score)) / (totalScore + UTS.Score)
            propInfo.category[catIndex].importance = adjImp
          }
        }
        else {
          propInfo.category.push({
            name: categories[i].name,
            catId: categories[i].catId,
            importance: categories[i].importance,
            baseScore: UTS.Score,
          })
        }
      }
      // console.log(propInfo)
      let updatedCats = propInfo.category
      let catSchema = []
      for (let i = 0; i < updatedCats.length; i++) {
        catPercent = await catRatioFn(updatedCats[i].catId)
        catSchema.push({
          'name': updatedCats[i].name,
          '_id': updatedCats[i].catId,
          'percent': catPercent,
          'importance': parseFloat(updatedCats[i].importance) * updatedCats[i].baseScore / propInfo.totalScore,
          'score': parseFloat(updatedCats[i].importance) * catPercent
        })
      }
      // console.log(catSchema)
      let totalScore = 0
      if (catSchema !== null) {
        for (let i = 0; i < catSchema.length; i++ ) {
          totalScore += catSchema[i].score }
      }
      if (catSchema !== null && totalScore !== 0) {
        for (let i = 0; i < catSchema.length; i++ ) {
          catSchema[i].scoreRatio = catSchema[i].score / totalScore }
      }

      // console.log(catIdList)
      let userPS = 0
      let userScore = 0
      let userCS = 0
      for (let i = 0; i < catSchema.length; i++) {
        if ( catIdList.includes( String(catSchema[i]._id) ) ) {
          let senIndex = authorInfo.category.findIndex( cat => String(cat.catId) == String(catSchema[i]._id) )
          if (senIndex !== -1) {
            let catScore = parseFloat(authorInfo.category[senIndex].catScore) * catSchema[i].scoreRatio
            let catPS = parseFloat(authorInfo.category[senIndex].catPS) * catSchema[i].scoreRatio
            userPS += catPS
            userScore += catScore
          }
        }
      }
      if (userPS !== 0) { userCS = userScore / userPS }
      else { userCS = 0 }
      // console.log(userScore, userCS, userPS)
      // console.log(catSchema)

      propInfo.authorData.catRelatedCS = userCS
      propInfo.authorData.catRelatedPS = userPS
      propInfo.authorData.catRelatedScore = userScore
      propInfo.userCS = userCS // based on catRelatedCS 
      propInfo.estimatedPS = totalScore // based on catRelatedPS
      propInfo.estimatedReturn = totalScore * userCS // catRelatedCS * catRelatedPS
      // console.log(propInfo)
      let updatedProp = await propInfo.save()
      if (updatedProp !== null) {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': updatedProp,
            'status': 'reply success'
          }
        }))
        return;
      }
      else {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': '',
            'status': 'no reply' 
          } } ) )
        return;
      }
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'reply failed',
          'error': error
        }
      } ) )
    }
  },
  submitProp: async (req, res, next) => {
    try {
      const proposal = req.body.proposal
      const dataSources = proposal.sources
      const dataCategories = proposal.categories
      const sources = dataSources.map(({item: url}) => ({url}))
      const categories = dataCategories.map(({catName: name, catId: catId, catReason: reason, catValue: importance}) => ({name, catId, reason, importance}))
      let catMain = dataCategories.map(({catName: name, catId: catId, catValue: importance}) => ({name, catId, importance}))
      let catSchema = []
      for (let i = 0; i < categories.length; i++) {
        catPercent = await catRatioFn(categories[i].catId)
        catSchema.push({
          'name': categories[i].name,
          '_id': categories[i].catId,
          'percent': catPercent,
          'importance': parseFloat(categories[i].importance),
          'score': parseFloat(categories[i].importance) * catPercent
        })
      }
      let totalScore = 0
      if (catSchema !== null) {
        for (let i = 0; i < catSchema.length; i++ ) {
          totalScore += catSchema[i].score }
      }
      if (catSchema !== null && totalScore !== 0) {
        for (let i = 0; i < catSchema.length; i++ ) {
          catSchema[i].scoreRatio = catSchema[i].score / totalScore }
      }
      const userId = req.user._id
      let userInfo = await User.findById(userId)
      let UTS = await totalUserScore(userId)
      for (let i = 0; i < catMain.length; i++) { catMain[i].baseScore = UTS.Score }
      let userPS = 0
      let userScore = 0
      let userCS = 0
      let catIdList = []
      for (let i = 0; i < userInfo.category.length; i++) {
        catIdList.push(String(userInfo.category[i].catId)) }
      for (let i = 0; i < catSchema.length; i++) {
        if ( catIdList.includes( String(catSchema[i]._id) ) ) {
          let senIndex = userInfo.category.findIndex( cat => cat.catId == catSchema[i]._id)
          if (senIndex !== -1) {
            let catScore = parseFloat(userInfo.category[senIndex].catScore) * catSchema[i].scoreRatio
            let catPS = parseFloat(userInfo.category[senIndex].catPS) * catSchema[i].scoreRatio
            userPS += catPS
            userScore += catScore
          }
        }
      }
      if (userPS !== 0) { userCS = userScore / userPS }
      else { userCS = 0 }
      // console.log(userScore, userCS, userPS)
      const createProp = new Proposal({
        author: userInfo._id,
        authorName: userInfo.fullName,
        authorData: {
          title: proposal.title,
          summary: proposal.summary,
          sources: sources,
          funding: parseFloat(proposal.funding),
          influence: parseFloat(proposal.influence)/100,
          category: categories,
          authorTotalPS: UTS.PS,
          authorTotalCS: UTS.CS,
          authorTotalScore: UTS.Score,
          catRelatedCS: userCS,
          catRelatedPS: userPS,
          catRelatedScore: userScore,
          estimatedReturn: totalScore * userCS
        },
        category: catMain,
        totalScore: UTS.Score,
        userCS: userCS, // based on catRelatedCS 
        estimatedPS: totalScore,
        estimatedReturn: totalScore * userCS
      })
      newProp = await createProp.save()
      if (newProp !== null) {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': newProp,
            'status': 'proposal success'
          }
        }))
        return;
      }
      else {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': '',
            'status': 'no proposal' 
          } } ) )
        return;
      }
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'proposal failed',
          'error': error
        }
      } ) )
    }
  },
  navproposal: async (req, res, next) => {
    try {
      const keyword = req.body.keyword
      const regex = new RegExp(escapeRegex(keyword), 'gi');
      let propList = await Proposal.find( { $or:[ {'authorData.category.name': regex}, {'authorData.title': regex}, {'authorData.summary': regex} ] }, ['_id', 'author', 'authorName', 'authorData', 'comments', 'category', 'postIds', 'bids', 'userCS', 'estimatedPS', 'estimatedReturn'])
      res.status(200).send(JSON.stringify({
        'data': { 
          'proposals': propList,
          'status': 'Proposal List successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Proposal List failed',
          'comments': '',
          'error': error
        }
      }))
    }
  },
  navauthor: async (req, res, next) => {
    const keyword = req.body.keyword
    // console.log(keyword)
    const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');
    User.find({"fullName": regex}, ['_id', 'fullName', 'bio', 'CS', 'PS', 'score'], function(error, authors) {
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'authors': '',
            'status': 'error',
            'error': error
          }
        }))
        return;
      } else if (authors.length == 0) {
        // console.log("No record found")
        res.status(200).send(JSON.stringify({
          'data': { 
            'authors': '',
            'status': 'no data'
          }
        }))
        return;
      } else {
        // console.log(authors)
        res.status(200).send(JSON.stringify({
          'data': { 
            'authors': authors,
            'status': 'authors'
          }
        }))
        return;
      }
    })
  },
  navpost: async (req, res, next) => {
    const keyword = req.body.keyword
    // console.log(keyword)
    const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');
    Post.find( { $or:[ {'url': regex}, {'title.content': regex} ] }, ['_id', 'title.content', 'url', 'totalCS', 'totalPS', 'totalScore'], function(error, posts){
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'posts': '',
            'status': 'error',
            'error': error
          }
        }))
        return;
      } else if (posts.length == 0) {
        // console.log("No record found")
        res.status(200).send(JSON.stringify({
          'data': { 
            'posts': '',
            'status': 'no data'
          }
        }))
        return;
      } else {
        // console.log(posts)
        res.status(200).send(JSON.stringify({
          'data': { 
            'posts': posts,
            'status': 'posts'
          }
        }))
        return;
      }
    })
  },
  influence: async (req, res, next) => {
    const keyword = req.body.keyword
    // console.log(keyword)
    const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');
    Post.find( { $or:[ {'url': regex}, {'title.content': regex} ] }, ['_id', 'title', 'url'], function(error, posts){
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'posts': '',
            'status': 'error',
            'error': error
          }
        }))
        return;
      } else if (posts.length == 0) {
        // console.log("No record found")
        res.status(200).send(JSON.stringify({
          'data': { 
            'posts': '',
            'status': 'no data'
          }
        }))
        return;
      } else {
        // console.log(posts)
        res.status(200).send(JSON.stringify({
          'data': { 
            'posts': posts,
            'status': 'posts'
          }
        }))
        return;
      }
    })
  },
  author: async (req, res, next) => {
    const keyword = req.body.keyword
    // console.log(keyword)
    const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');
    User.find({"fullName": regex}, ['_id', 'fullName', 'bio'], function(error, names){
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'authors': '',
            'status': 'error',
            'error': error
          }
        }))
        return;
      } else if (names.length == 0) {
        // console.log("No record found")
        res.status(200).send(JSON.stringify({
          'data': { 
            'authors': '',
            'status': 'no data'
          }
        }))
        return;
      } else {
        // console.log(names[0].fullName)
        res.status(200).send(JSON.stringify({
          'data': { 
            'authors': names,
            'status': 'authors'
          }
        }))
        return;
      }
    })
  },
  navCategory: async (req, res, next) => {
    try {
      const keyword = req.body.keyword
      // console.log(keyword)
      const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');

      let catTotal = await CatTotal.findOne()
      // console.log(catTotal.totalRatioCount)
      let catTotalRatio
      let catSchema = []
      if ( catTotal == null || catTotal.length == 0 ) {
        let newCatTotal = new CatTotal({})
        catTotal = await newCatTotal.save()
        catTotalRatio = catTotal.totalRatioCount
      }
      else {
        catTotalRatio = catTotal.totalRatioCount
      }

      let categoryList = await Category.find({ $and:[ {name: { $ne: 'GENERAL'} }, {"name": regex} ] }, ['_id', 'name', 'catRatio', 'child', 'parent', 'catRatioTotal'])
      // console.log(categoryList)

      for (let i = 0; i < categoryList.length; i++) {
        let catMultiplier = 1
        let parentCat = categoryList[i]
        while ( parentCat.parent.categories !== null || parentCat.parent.categories.length !== 0 ) {
          let parentCats = parentCat.parent.categories.sort( (prev, current) => (prev.userScore < current.userScore) ? 1 : -1 )
          if ( parentCat.parent.categories.length !== 0 ) {
            parentCat = await Category.findById(parentCats[0].category)
            catMultiplier = catMultiplier * parentCat.selfParentRatio
          }
          else { break }
        }
        // console.log(catMultiplier)
        let catRatio = categoryList[i].catRatioTotal
        let catPercent
        if ( catTotalRatio !== 0 ) {
          catPercent = catRatio / catTotalRatio * 100 * catMultiplier }
        else {
          catPercent = 0 }
        catSchema.push({
          'name': categoryList[i].name,
          '_id': categoryList[i]._id,
          'catRatio': catRatio,   // temporary
          'percent': catPercent,
          'parent': categoryList[i].parent,
          'child': categoryList[i].child
        })
      }
      if (catSchema !== null) {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': catSchema,
            'status': 'categories'
          }
        }))
        return;
      }
      else {
        res.status(200).send( JSON.stringify( {
          'data': { 
            'posts': '',
            'status': 'no categories' 
          } } ) )
        return;
      }
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Cat Search failed',
          'error': error
        }
      } ) )
    }
  },
  catSearch: async (req, res, next) => {
    try {
      const keyword = req.body.keyword
      let catResult = await Category.findOne({"name": keyword}, ['_id'])
      if (catResult !== null) {
        res.status(200).send( JSON.stringify( {
          'data': { 'status': 'no comment logged' } } ) )
        return;
      }
      else {
        res.status(200).send( JSON.stringify( {
          'data': { 'status': 'no comment logged' } } ) )
        return;
      }
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Cat Search failed',
          'error': error
        }
      } ) )
    }
  },
  category: async (req, res, next) => {
    const keyword = req.body.keyword
    // console.log(keyword)
    const regex = new RegExp(escapeRegex(req.body.keyword), 'gi');
    Category.find({"name": regex}, ['_id', 'name'], function(error, names){
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'categories': '',
            'status': 'error',
            'error': error
          }
        }))
        return;
      } else if (names.length == 0) {
        // console.log("No record found")
        res.status(200).send(JSON.stringify({
          'data': { 
            'categories': '',
            'status': 'no data'
          }
        }))
        return;
      } else {
        // console.log(names)
        res.status(200).send(JSON.stringify({
          'data': { 
            'categories': names,
            'status': 'categories'
          }
        }))
        return;
      }
    })
  },
  userData: async (req, res, next) => {
    try {
      const user = req.user
      const title = req.body.title
      const url = req.body.url
      const regex = new RegExp(escapeRegex(req.body.url), 'gi');
      let post = await Post.findOne({'url': regex}, ['_id', 'ranges', 'sentence', 'totalCS', 'totalPS', 'influence', 'category', 'context', 'author'])
      if (!post) {
        const createPost = new Post({
          url: url,
          title: { content: title }
        })
        post = await createPost.save()
      }
      let userData = {
        'fullName': user.fullName,
        'cs': user.CS,
        'ps': user.PS,
      }
      let totalPS = 0
      let totalDem = 0
      let totalCS = 0
      let userCS = 0
      for (let i = 0; i < post.category.length; i++) {
        let catIndex = user.category.findIndex( userCat => String(userCat.catId) == String(post.category[i].catId))
        if (catIndex !== -1) {
          totalPS += user.category[catIndex].catPS
          totalDem += user.category[catIndex].denominator
          totalCS += user.category[catIndex].catCS * user.category[catIndex].denominator
        }
      }
      if (totalDem !== 0) { userCS = totalCS / totalDem }
      else { userCS = 0 }
      // console.log(totalPS)
      // console.log(totalDem)
      // console.log(totalCS)
      // console.log(userCS)
      res.status(200).send(JSON.stringify({
        'data': { 
          'user': {
            'data': userData,
            'catCS': userCS,
            'catPS': totalPS
          },
          'status': 'User data successful'
        }
      }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'User data failed',
          'comment': '',
          'error': error
        }
      }))
    }
  },
  comResponses: async (req, res, next) => {
    try {
      const senId = req.body.respIds
      // console.log(postId)
      let responses = []
      for (let i = 0; i < senId.length; i++) {
        let response = await ComSentence.findById(senId[i]).populate('user')
        if (response !== null) {
          responses.push(response)
        }
      }
      if (responses.length !== 0) {
        responses.sort((a, b) => (a.score < b.score) ? 1 : -1)
      }

      // console.log(responses)
      res.status(200).send(JSON.stringify({
        'data': { 
          'sentences': responses,
          'status': 'Sen Responses successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Sen Responses failed',
          'comments': '',
          'error': error
        }
      }))
    }
  },
  subList: async (req, res, next) => {
    try {
      const parentId = req.body.parentId
      let catTotal = await CatTotal.findOne()
      // console.log(catTotal.totalRatioCount)
      let catTotalRatio
      let catSchema = []
      if ( catTotal == null || catTotal.length == 0 ) {
        let newCatTotal = new CatTotal({})
        catTotal = await newCatTotal.save()
        catTotalRatio = catTotal.totalRatioCount
      }
      else {
        catTotalRatio = catTotal.totalRatioCount
      }
      // console.log(catTotal)
      let allSubs = await Category.findById(String(parentId)).populate('child', ['_id', 'name', 'catRatio', 'child', 'parent', 'catRatioTotal'])

      // console.log(allSubs.child)
      let categoryList = allSubs.child

      let catMultiplier = 1
      if ( categoryList.length > 0 ) {
        let parentCat = categoryList[0]
        while ( parentCat.parent.categories !== null || parentCat.parent.categories.length !== 0 ) {
          let parentCats = parentCat.parent.categories.sort( (prev, current) => (prev.userScore < current.userScore) ? 1 : -1 )
          if ( parentCat.parent.categories.length !== 0 ) {
            parentCat = await Category.findById(parentCats[0].category)
            catMultiplier = catMultiplier * parentCat.selfParentRatio
          }
          else { break }
        }
      }
      for (let i = 0; i < categoryList.length; i++) {
        // console.log(catMultiplier)
        let catRatio = categoryList[i].catRatioTotal
        let catPercent
        if ( catTotalRatio !== 0 ) {
          catPercent = catRatio / catTotalRatio * 100 * catMultiplier }
        else {
          catPercent = 0 }
        catSchema.push({
          'name': categoryList[i].name,
          '_id': categoryList[i]._id,
          'catRatio': catRatio,   // temporary
          'percent': catPercent,
          'parent': categoryList[i].parent,
          'child': categoryList[i].child
        })
      }
      catSchema.sort((a, b) => (a.percent < b.percent) ? 1 : -1)
      // console.log(catSchema)
      res.status(200).send(JSON.stringify({
        'data': { 
          'category': catSchema,
          'status': 'Category List successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Category List failed',
          'category': '',
          'error': error
        }
      }))
    }
  },
  catList: async (req, res, next) => {
    try {
      let catTotal = await CatTotal.findOne()
      // console.log(catTotal.totalRatioCount)
      let catTotalRatio
      let catSchema = []
      if ( catTotal == null || catTotal.length == 0 ) {
        let newCatTotal = new CatTotal({})
        catTotal = await newCatTotal.save()
        catTotalRatio = catTotal.totalRatioCount
      }
      else {
        catTotalRatio = catTotal.totalRatioCount
      }
      // console.log(catTotal)
      let categoryList = await Category.find({name: { $ne: 'GENERAL'} }, ['_id', 'name', 'catRatio', 'child', 'parent', 'catRatioTotal'], { skip:0, limit:10, sort:{ catRatioTotal: -1 } })
      for (let i = 0; i < categoryList.length; i++) {
        let catMultiplier = 1
        let parentCat = categoryList[i]
        while ( parentCat.parent.categories !== null || parentCat.parent.categories.length !== 0 ) {
          let parentCats = parentCat.parent.categories.sort( (prev, current) => (prev.userScore < current.userScore) ? 1 : -1 )
          if ( parentCat.parent.categories.length !== 0 ) {
            parentCat = await Category.findById(parentCats[0].category)
            catMultiplier = catMultiplier * parentCat.selfParentRatio
          }
          else { break }
        }
        // console.log(catMultiplier)
        let catRatio = categoryList[i].catRatioTotal
        let catPercent
        if ( catTotalRatio !== 0 ) {
          catPercent = catRatio / catTotalRatio * 100 * catMultiplier }
        else {
          catPercent = 0 }
        catSchema.push({
          'name': categoryList[i].name,
          '_id': categoryList[i]._id,
          'catRatio': catRatio,   // temporary
          'percent': catPercent,
          'parent': categoryList[i].parent,
          'child': categoryList[i].child
        })
      }
      // console.log(catSchema)
      res.status(200).send(JSON.stringify({
        'data': { 
          'category': catSchema,
          'status': 'Category List successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Category List failed',
          'category': '',
          'error': error
        }
      }))
    }
  },
  catRank: async (req, res, next) => {
    try {
      const ranking = req.body.ranking
      const catType = ranking.type
      const userId = req.user._id
      const catUserRatio = ranking.rankVal/100
      const rankSources = ranking.rankSources
      const rankReason = ranking.rankReason
      const parentId = ranking.parentId
      const parentName = ranking.parentName.toUpperCase()
      const childId = ranking.childId
      const childName = ranking.childName.toUpperCase()
      // console.log(ranking)

      let userInfo = await User.findById(userId)    // USER DATA
      let userTotalScore = parseFloat(userInfo.score)   // GET USER TOTAL SCORE
      let oldUserScore = 0    // SET TEMP OLD USER SCORE
      let catRatio = 0    // SET TEMP CATEGORY RATIO
      let catTotalRatio   // SET TOTAL RATIO
      let catTotalScore   // SET ALL TOTAL USER SCORES
      let addedRatio = 0    // SET ADDED RATIO
      let userInfluence   // USER RELATIVE INFLUENCE
      let oldParent
      let oldScore

      let catUpdateInfo = await CatUpdate.findOne({user: userId})   // UPDATE USER CATS
      if ( catUpdateInfo == null || catUpdateInfo.length == 0) {    //GET OLD USER SCORES
        oldUserScore = 0
        oldScore = 0
        oldParent = ''
      }
      else {
        oldUserScore = catUpdateInfo.score
        if (catUpdateInfo.catUpdate !== null && childId !== '') {
          let catIndex = catUpdateInfo.catUpdate.findIndex( updates => String(updates.category) == String(childId))
          // console.log(catIndex)
          if ( catIndex !== -1 ) {
            oldScore = catUpdateInfo.catUpdate[catIndex].score
            oldParent = catUpdateInfo.catUpdate[catIndex].parent
          }
          else {
            oldScore = 0
            oldParent = ''
          }
        }
        else {
          oldScore = 0
          oldParent = ''
        }
      }


      let catTotal = await CatTotal.findOne()   // TOTAL DATA
      // console.log(catTotal)
      if ( catTotal == null || catTotal.length == 0 ) {   // IF NO TOTAL DATA
        let newCatTotal = new CatTotal({    // CREATE TOTAL DATA
          totalRatioCount: 0.000001,
          totalScoreCount: userTotalScore
        })
        catTotal = await newCatTotal.save()
        // console.log(catTotal)
        catTotalRatio = catTotal.totalRatioCount    // GET TOTAL RATIO
        catTotalScore = catTotal.totalScoreCount    // GET ALL TOTAL USER SCORES
      }
      else {    // IF TOTAL DATA EXISTS
        // console.log(catTotal)
        catTotalRatio = catTotal.totalRatioCount    // GET TOTAL RATIO
        catTotalScore = catTotal.totalScoreCount    // GET ALL TOTAL USER SCORES
      }
      // console.log(catTotal)
      // console.log('catTotalRatio', catTotalRatio, 'catTotalScore', catTotalScore)

      let catParentInfo   // SET PARENT CAT INFO
      if ( parentId !== '' ) {
        catParentInfo = await Category.findById(parentId) }
      else {
        catParentInfo = await Category.findOne({name: parentName})
        if ( catParentInfo == null || catParentInfo.length == 0 ) {
          let newCat = new Category({ name: parentName })
          catParentInfo = await newCat.save()
        }
      }
      let catChildInfo    // SET CHILD CAT INFO
      if ( childId !== '' ) {
        catChildInfo = await Category.findById(childId) }
      else {
        catChildInfo = await Category.findOne({name: childName})
        if ( catChildInfo == null || catChildInfo.length == 0 ) {
          let newCat = new Category({ name: childName })
          catChildInfo = await newCat.save()
        }
      }

      let targetId, parId   // CATEGORY TO MODIFY, AUXILIARY CATEGORY
      parId = catParentInfo._id
      targetId = catChildInfo._id
      catRatio = catChildInfo.catRatio

      if ( catUserRatio !== 1 ) {   // FORMULA TO GET X - ADDED RATIO
        addedRatio = ( catTotalRatio * catUserRatio - catRatio ) / ( 1 - catUserRatio ) }
      if ((catTotalScore - oldUserScore + userTotalScore) == 0 ) {
        userInfluence = 0 }
      else {
        userInfluence = userTotalScore / ( catTotalScore - oldUserScore + userTotalScore ) }
      // console.log('addedRatio', addedRatio, ' = ( catTotalRatio', catTotalRatio, ' * catUserRatio', catUserRatio, ' - catRatio', catRatio, ' ) / ( 1 - catUserRatio', catUserRatio )
      // console.log('addedRatio', addedRatio, 'userInfluence', userInfluence)

      let finalAddedRatio = addedRatio * userInfluence
      catTotal.totalScoreCount += userTotalScore - oldUserScore
      catTotal.totalRatioCount += finalAddedRatio
      await catTotal.save()
      // console.log('finalAddedRatio', finalAddedRatio)
      let mainCatRatio = catChildInfo.catRatio += finalAddedRatio
      let mainParentRatio = catChildInfo.catParentRatio
      catChildInfo.catRatioTotal = mainCatRatio + mainParentRatio
      if (mainParentRatio !== 0 ) {
        catChildInfo.selfParentRatio = ( mainCatRatio + mainParentRatio ) / mainParentRatio }
      else { catChildInfo.selfParentRatio = 0 }

      //// UPDATE CATEGORY PARENT INFO ////
      catChildInfo.parent.userTotalScore += userTotalScore - oldScore
      if ( oldParent !== '' ) {
        if (catChildInfo.parent !== null) {
          let oldParIndex = catChildInfo.parent.categories.findIndex( categories => String(categories.category) == String(oldParent))
          if ( oldParIndex !== -1 ) {
            catChildInfo.parent.categories[oldParIndex].userScore -= oldScore }
        }
      }
      // console.log(catChildInfo)
      if (catChildInfo.parent.categories !== null) {
        let newParIndex = catChildInfo.parent.categories.findIndex( categories => String(categories.category) == String(catParentInfo._id))
        if ( newParIndex !== -1 ) {
          catChildInfo.parent.categories[newParIndex].userScore += userTotalScore }
        else {
          catChildInfo.parent.categories.push({
            category: parId,
            name: parentName,
            userScore: userTotalScore,
          })
        }
      }
      else {
        catChildInfo.parent = {
          userTotalScore: userTotalScore,
          categories: [{
            category: parId,
            name: parentName,
            userScore: userTotalScore,
          }]
        }
      }

      // console.log(catChildInfo.parent.categories)
      let parentCat = catChildInfo
      // console.log(parentCat)
      // console.log(parentCat.parent.categories.length)
      let loopCount = 0
      while ( parentCat.parent.categories !== null || parentCat.parent.categories.length !== 0 ) {
        let parentCats = parentCat.parent.categories.sort( (prev, current) => (prev.userScore < current.userScore) ? 1 : -1 )
        // console.log(loopCount, 'parentCats')
        // console.log(parentCat.parent.categories.length)
        // console.log(parentCats)
        if ( parentCat.parent.categories.length !== 0 ) {
          parentCat = await Category.findById(parentCats[0].category)
          let selfRatio = parentCat.catRatio
          let parentRatio = parentCat.catParentRatio += finalAddedRatio
          parentCat.catRatioTotal = selfRatio + parentRatio
          if (parentRatio !== 0 ) {
            parentCat.selfParentRatio = ( selfRatio + parentRatio ) / parentRatio }
          else { parentCat.selfParentRatio = 0 }
          await parentCat.save()
        }
        else { break }
        loopCount++
      }


      //// ADD CATEGORY TO PARENT ////
      let childIndex = catParentInfo.child.findIndex( child => String(child) == String(targetId)) 
      if ( childIndex == -1 ) { catParentInfo.child.push(targetId) }

      await catParentInfo.save()

      if (catChildInfo.catUpdate !== null) {
        catChildInfo.catUpdate.push({
          user: userId,
          score: userTotalScore,
          percent: catUserRatio,
          ratio: addedRatio,
          reason: rankReason,
          sources: rankSources,
          parent: parId
        })
      }
      
      else {
        catChildInfo.catUpdate = [{
          user: userId,
          score: userTotalScore,
          percent: catUserRatio,
          ratio: addedRatio,
          reason: rankReason,
          sources: rankSources,
          parent: parId
        }]
      }
      await catChildInfo.save()

      if ( catUpdateInfo == null || catUpdateInfo.length == 0 ) {
        let newCatUpdate = new CatUpdate({
          user: userId,
          score: userTotalScore,
          updateCount: 1,
          catUpdate: [{
            category: targetId,
            percent: catUserRatio,
            score: userTotalScore,
            ratio: addedRatio,
            reason: rankReason,
            sources: rankSources,
            parent: parId
          }]
        })
        catUpdateInfo = await newCatUpdate.save()
      }
      else {
        catUpdateInfo.score = userTotalScore
        catUpdateInfo.updateCount++
        // console.log(catUpdateInfo.catUpdate)
        if (catUpdateInfo.catUpdate !== null) {
          catUpdateInfo.catUpdate.push({
            category: targetId,
            percent: catUserRatio,
            score: userTotalScore,
            ratio: addedRatio,
            reason: rankReason,
            sources: rankSources,
            parent: parId
          })
        }
        else {
          catUpdateInfo.catUpdate = [{
            category: targetId,
            percent: catUserRatio,
            score: userTotalScore,
            ratio: addedRatio,
            reason: rankReason,
            sources: rankSources,
            parent: parId
          }]
        }
        await catUpdateInfo.save()
      }

      let catScore
      if (catTotal.totalRatioCount !== 0) {
        catScore = catChildInfo.catRatio / catTotal.totalRatioCount }
      else { catScore = 0 }
      
      res.status(200).send(JSON.stringify({
        'data': { 
          'user': {
            'data': '',
            'catScore': catScore
          },
          'status': 'Rank successful'
        }
      }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Rank failed',
          'catScore': '',
          'error': error
        }
      }))
    }
  },
  postReply: async (req, res, next) => {
    try {
      const reply = req.body.reply
      const user = req.user
      const confidence = reply.self
      const csValue = reply.cs
      const postId = reply.comData.postId
      const senId = reply.comData.senId
      const comSenId = reply.comData.comSenId
      const comId = reply.comData.comId
      const comAuthorId = reply.comData.userId
      const userId = user._id
      let comAuthorInfo = await User.findById(comAuthorId)
      let commentInfo = await Comment.findById(comId)
      let postInfo = await Post.findById(postId)
      let comSenInfo = await ComSentence.findById(comSenId)

      ////  GET "SELF" SCORE  ////
      let totalPS = 0
      let totalDem = 0
      let totalCS = 0
      let userCS = 0
      for (let i = 0; i < postInfo.category.length; i++) {
        let catIndex = user.category.findIndex( userCat => String(userCat.catId) == String(postInfo.category[i].catId))
        if (catIndex !== -1) {
          totalPS += user.category[catIndex].catPS
          totalDem += user.category[catIndex].denominator
          totalCS += user.category[catIndex].catCS * user.category[catIndex].denominator
        }
      }
      if (totalDem !== 0) { userCS = totalCS / totalDem }
      else { userCS = 0 }
      let userScore = totalPS * userCS    // user score
      let adjUserScore = userScore * confidence / 10
      // console.log(userScore)

      ////  GET SELF COMMENT  ////
      let selfComment = await Comment.findOne({ $and:[ {post: postId}, {user: userId} ] }, [], { skip:0, limit:1 })

      ////  CREATE SELF SENTENCE REPLY  ////
      const newComSentence = new ComSentence({
        user: user._id,
        post: postId,
        senId: senId,
        replyId: comSenId,
        comType: 'reply',
        cs: csValue,
        comment: reply.response,
        score: adjUserScore,
        userScore: userScore,
        confidence: confidence,
        userConfidence: confidence,
        denominator: adjUserScore,
      })
      if (reply.url !== null) {
        for (let i = 0; i < reply.url.length; i++) {
          newComSentence.sources.push({url: reply.url[i]})
        }
      }
      let replyInfo = await newComSentence.save()

      ////  ADD COMMENT ID TO SENTENCE REPLY  ////
      if ( selfComment !== null ) {
        replyInfo.comId = selfComment._id
      }
      ////  CREATE COMMENT, ADD COMMENT ID TO SENTENCE REPLY  ////
      else {
        let selfCom = new Comment({
          user: userId,
          post: postId,
          score: userScore,
          date: Date()
        })
        selfComment = await selfCom.save()
        replyInfo.comId = selfComment._id
      }
      ////  ADD RESPONSE TO ORIGINAL COMMENT  ////
      comSenInfo.responses.push(replyInfo._id)
      let tempDen = comSenInfo.denominator
      let origDen = comSenInfo.denominator += adjUserScore
      let tempScore = comSenInfo.score
      let origScore = comSenInfo.score += (adjUserScore * csValue / 10)
      let origConfidence = 0
      if (origDen !== 0) {
        origConfidence = origScore / origDen
      }
      comSenInfo.confidence = origConfidence
      let comSen = await comSenInfo.save()
      let replyId = comSenInfo.replyId
      // console.log(typeof replyId)
      ////  UPDATE COMMENT REPLIES  ////
      while (typeof replyId !== 'undefined') {

        ////  GET REPLY SENTENCE  ////
        let nextComSen = await ComSentence.findById(replyId)
        let tempReplyDen = nextComSen.denominator
        let tempReplyScore = nextComSen.score
        let nextDen = nextComSen.denominator += (origDen - tempDen)
        let nextScore = nextComSen.score += (origScore - tempScore)
        let nextConfidence = 0
        if (nextDen !== 0) {nextConfidence = nextScore / nextDen}
        let tempConf = nextComSen.confidence
        let nextConf = nextComSen.confidence = nextConfidence
        await nextComSen.save()

        ////  GET IMPORTANCE RATIO FOR SENTENCE  ////
        let senImp = 0
        let totalImp = 0
        let contextImp = 0
        let senInd = postInfo.sentence.findIndex( sen => String(sen._id) == String(senId))
        if ( senInd !== -1 ) {
          senImp = postInfo.sentence[senInd].importance
        }
        let nextSen = []
        let uniqSen = []
        let allComSen = await ComSentence.find({ $and:[ {post: postId}, {comId: nextComSen.comId} ] }, [], { skip:0, limit:0, sort:{ senId: -1 } })
        if (allComSen !== null) {
          for (let i = 0; i < allComSen.length; i++) {
            nextSen.push(allComSen[i].senId) }
          uniqSen = [...new Set(nextSen)]
        }
        
        if ( postInfo !== null && uniqSen !== undefined && uniqSen.length !== 0) {
          contextImp = postInfo.context.importance / 100
          for ( let i = 0; i < uniqSen.length; i++ ) {
            let senIndex = postInfo.sentence.findIndex( sen => String(sen._id) == String(uniqSen[i]))
            if ( senIndex !== -1 && !isNaN(postInfo.sentence[senIndex].importance) ) {
              totalImp += postInfo.sentence[senIndex].importance }
          }
        }
        // console.log(nextComSen)
        let nextComment = await Comment.findById(nextComSen.comId)
        let nextCat = []

        if (nextComment !== null) {
          if (typeof nextComment.category !== 'undefined') {
            for (let i = 0; i < nextComment.category.length; i++) {
              nextCat.push(nextComment.category[i].catId) }
          }
        }
        let nextUser = await User.findById(nextComSen.user)

        ////  SET IMPORTANCE RATIO  ////
        let allReplyComments = await ComSentence.find({ $and:[ {post: postId}, {user: nextComSen.user}, {senId: senId} ] }, [], { skip:0, limit:0 })
        let comCountRatio = 0
        if (allReplyComments !== null) {
          comCountRatio = 1 / allReplyComments.length }

        let impRatio = 0
        if ( totalImp !== 0 ) {
          impRatio = ( senImp / totalImp ) * ( 1 - contextImp ) * comCountRatio }

        if (nextCat.length > 0) {
          for (let i = 0; i < nextCat.length; i++) {
            let catInd = nextUser.category.findIndex( comCat => String(comCat.catId) == String(nextCat[i]) )
            if (catInd !== -1) {
              let postInd = nextUser.category[catInd].catPosts.findIndex( catPost => String(catPost.commentId) == String(nextComment._id) )
              if (postInd !== -1) {
                nextUser.category[catInd].catPosts[postInd].postCS += impRatio * (nextConf - tempConf)
              }
            }
          }
        }
        await nextUser.save()
        tempDen = tempReplyDen
        tempScore = tempReplyScore
        origDen = nextDen
        origScore = nextScore
        replyId = nextComSen.replyId
        // console.log(typeof replyId)
      }

      // console.log(comSen.responses)
      let comSenIds = comSen.responses
      let responses = []
      for (let i = 0; i < comSenIds.length; i++) {
        let response = await ComSentence.findById(comSenIds[i]).populate('user')
        if (response !== null) {
          responses.push(response)
        }
      }
      if (responses.length !== 0) {
        responses.sort((a, b) => (a.score < b.score) ? 1 : -1)
      }

      res.status(200).send(JSON.stringify({
        'data': { 
          'user': {
            'data': '',
            'responses': responses
          },
          'status': 'Reply successful'
        }
      }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Reply failed',
          'reply': '',
          'error': error
        }
      }))
    }
  },
  sentenceComments: async (req, res, next) => {
    try {
      const postId = req.body.postId
      const sentenceId = req.body.sentenceId
      // console.log(postId)
  
      let comments = await ComSentence.find({ $and:[ {post: postId}, {senId: sentenceId}, {comType: 'comment'} ] }, [], { skip:0, limit:3, sort:{ score: -1 } }).populate('user')
      // console.log(comments)
      res.status(200).send(JSON.stringify({
        'data': { 
          'comments': comments,
          'status': 'Sen Comments successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Sen Comments failed',
          'comments': '',
          'error': error
        }
      }))
    }
  },
  commentList: async (req, res, next) => {
    try {
      const postId = req.body.postId
      // console.log(postId)
  
      let comments = await Comment.find({post: postId}, [], { skip:0, limit:3, sort:{ score: -1 } }).populate('sentence').populate('user')
      // console.log(comments)
      res.status(200).send(JSON.stringify({
        'data': { 
          'comments': comments,
          'status': 'Comments successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Comments failed',
          'comments': '',
          'error': error
        }
      }))
    }
  },
  getUrls: async (req, res, next) => {
    try {
      const urls = req.body.urls
      // console.log(urls)
      let urlList = []
      for (let i = 0; i < urls.length; i++) {
        const regex = new RegExp(escapeRegex(urls[i]), 'gi');
        urlList[i] = await Post.findOne({'url': regex}, ['_id', 'totalCS', 'totalPS', 'url'])
        if (urlList[i] == null) {
          // console.log('empty')
          urlList[i] = {
            _id: '',
            totalCS: '',
            totalPS: '',
            url: urls[i]
          }
        }
      }
      // console.log(urlList)
      // console.log(postId)
      // console.log(comments)
      res.status(200).send(JSON.stringify({
        'data': { 
          'urls': urlList,
          'status': 'URLs successful'
          },
        }))
      return;
    }
    catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'URLs failed',
          'comments': '',
          'error': error
        }
      }))
    }
  },
  post: async (req, res, next) => {
    const url = req.body.url
    const title = req.body.title
    const regex = new RegExp(escapeRegex(req.body.url), 'gi');
    Post.findOne({'url': regex}, ['_id', 'ranges', 'sentence', 'totalCS', 'totalPS', 'influence', 'category', 'context', 'author'], async function(error, post){
      if (!post) {
        const newPost = new Post({
          url: url,
          title: { content: title }
        })
        newPost.save( (error, post) => {
          if (error) {
            // console.log(error);
            res.status(400).send(JSON.stringify({
              'data': {
                'comments': 0,
                'sentence': '',
                'ranges': '',
                'status': 'URL error',
                'error': error
              }
            }))
            return;
          } else {
            // console.log('New post created')
            res.status(200).send(JSON.stringify({
              'data': {
                'comments': 0,
                'sentence': '',
                'ranges': '',
                'postId': post._id,
                'status': 'URL no ranges'
              }
            }))
            return;
          }
        })
      } 
      else {
        // console.log(post._id)
        if (error) {
          // console.log(error);
          res.status(400).send(JSON.stringify({
            'data': { 
              'comments': 0,
              'sentence': '',
              'ranges': '',
              'status': 'URL error',
              'error': error
            }
          }))
          return;
        } else if (post.ranges.length == 0) {
          // console.log("No ranges found")
          res.status(200).send(JSON.stringify({
            'data': { 
              'comments': 0,
              'sentence': '',
              'ranges': '',
              'postId': post._id,
              'status': 'URL no ranges'
            }
          }))
          return;
        } 
        else {
          let topAuthor = authors = post.author
          // console.log(topAuthor)
          if (authors.length > 1) {
            topAuthor = authors.reduce( (prev, current) => { 
              return (prev.score > current.score) ? prev : current} )
          }
          // console.log(topAuthor)
          let author
          let postList = []
          let authorData
          let posts = []
          if (typeof topAuthor[0] !== 'undefined') {
            author = await User.findById(topAuthor[0].authId)
            // console.log(author.category)
            let sortCat = author.category
            sortCat.sort((a, b) => (a.catPS < b.catPS) ? 1 : -1)
            for (let i = 0; i < sortCat.length; i++) {
              for (let j = 0 ; j < sortCat[i].catPosts.length; j++) {
                if (typeof sortCat[i].catPosts[j].postId !== 'undefined') {
                  if (!postList.includes(String(sortCat[i].catPosts[j].postId))) {
                    postList.push(String(sortCat[i].catPosts[j].postId))
                  }
                }
              }
            }
            let newPost
            if (postList.length > 0) {
              let postLength = 0
              if (postList.length > 10) { postLength = 10 }
              else { postLength = postList.length }
              for (let i = 0; i < postLength; i++) {
                newPost = await Post.findById(postList[i])
                posts.push({
                  'postId': newPost._id,
                  'url': newPost.url,
                  'cs': newPost.totalCS,
                  'ps': newPost.totalPS,
                  'title': newPost.title.content
                })
              }
              // console.log(posts)
            }
            // console.log(sortCat)
            // console.log(postList)
            authorData = {
              'fullName': author.fullName,
              'cs': author.CS,
              'ps': author.PS,
            }
          }
          else {
            authorData = {
              'fullName': '',
              'cs': 0,
              'ps': 0
            }
          }
          let totalPS = 0
          let totalDem = 0
          let totalCS = 0
          let authCS = 0
          // console.log(post.category.length)
          // console.log(typeof author)
          if (typeof author !== 'undefined') {
            // console.log(post.category.length)
            for (let i = 0; i < post.category.length; i++) {
              // console.log(post.category[i].catId)
              // console.log(author.category[0].catId)
              let catIndex = author.category.findIndex( authCat => String(authCat.catId) == String(post.category[i].catId))
              // console.log(catIndex)
              if (catIndex !== -1) {
                totalPS += author.category[catIndex].catPS
                totalDem += author.category[catIndex].denominator
                totalCS += author.category[catIndex].catCS * author.category[catIndex].denominator
              }
            }
          }
          if (totalDem !== 0) { authCS = totalCS / totalDem }
          else { authCS = 0 }
          // console.log(totalPS)
          // console.log(totalDem)
          // console.log(totalCS)
          // console.log(authCS)
          // console.log(authorData)

          let commentCount = 0;
          if ( !post.comments ) { commentCount = 0 } 
          else { commentCount = post.comments.length }
          res.status(200).send(JSON.stringify({
            'data': { 
              'author': {
                'data': authorData,
                'catCS': authCS,
                'catPS': totalPS
              },
              'posts': posts,
              'cs': post.totalCS,
              'ps': post.totalPS,
              'influence': post.influence,
              'category': post.category,
              'context': post.context,
              'comments': commentCount,
              'sentence': post.sentence,
              'ranges': post.ranges,
              'postId': post._id,
              'status': 'URL with ranges'
            }
          }))
          return;
        }
      }
    })
  },
  range: async (req, res, next) => {
    const range = req.body.range
    const token = signToken(req.user)
    const userId = req.user._id
    const postId = range.postId
    // console.log(range.list.length)
    let post = await Post.findById(postId)
    for (let a = 0; a < range.list.length; a++) {
      post.ranges.push({
        start: range.list[a].start,
        end: range.list[a].end,
        user: userId
      })
      for (let b = 0; b < range.list[a].sentences.length; b++) {
        post.sentence.push({
          senId: range.list[a].sentences[b].senId,
          content: range.list[a].sentences[b].content,
        })
        let rangeIndex = post.ranges.length - 1;
        post.ranges[rangeIndex].sentences.push({
          senId: range.list[a].sentences[b].senId
        })
      }
    }
    // console.log(post)
    post.save( (error, sentenceIds) => {
      if (error) {
        // console.log(error);
        res.status(400).send(JSON.stringify({
          'data': { 
            'status': 'error',
            'error': error
          }
        }))
        return;
      } 
      else {
        let counter = 0;
        for (let c = 0; c < range.list.length; c++) {
          counter += range.list[c].sentences.length
        }
        let senIds = []
        let senIndex = sentenceIds.sentence.length - 1;
        for ( let d = 0; d < counter; d++) {
          senIds.push({
            'content': sentenceIds.sentence[senIndex].content,
            'senName': sentenceIds.sentence[senIndex].senId,
            'senId': sentenceIds.sentence[senIndex]._id,
          })
          senIndex--;
        }
        // console.log(senIds)
        res.status(200).send(JSON.stringify({
          'data': { 
            'status': 'Sentences saved',
            'ranges': senIds
          }
        }))
        return;
      }
    })
  },
  readComments: async (req, res, next) => {
    try {
      const postId = req.body.postId
      const token = signToken(req.user)
      const userId = req.user._id
      Comment.findOne({$and: [{'post': postId}, {'user': userId}]})
      .populate('sentence')
      .then( (comment) => {
        res.status(200).send(JSON.stringify({
          'data': { 
            'status': 'Comment success',
            'comment': comment
          }
        }))
        return;
      })
    } catch(error) {
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Comment failed',
          'comment': '',
          'error': error
        }
      }))
    }
  },
  review: async (req, res, next) => {
    try {
      const commentStatus = req.body.review.comments.commentStatus
      const postId = req.body.review.comments.postId
      let comment = req.body.review.comments
      const token = signToken(req.user)
      const userId = req.user._id
      let author = req.body.review.author
      let category = req.body.review.categories
      let selfReview = req.body.review.selfeval
      let influence = req.body.review.influences
      let postInfo = await Post.findById(postId)
      let userInfo = await User.findById(userId)
      let userTotalScore = parseFloat(userInfo.score)
      let userCommentScore = 0
      let catList = []
      // console.log(comment)

      ////  GET LIST OF CATEGORIES FROM POST  ////
      for (let i = 0; i < postInfo.category.length; i++) {
        catList.push(postInfo.category[i].catId) }

      ////  CREATE & ADD IDS TO ALL NEW CATEGORIES  ////
      if (typeof category !== 'undefined') {
        for (let i = 0; i < category.length; i++) {
          if (category[i].id === '') {
            const newCatgory = new Category({
              name: category[i].name })
            let newCat = await newCatgory.save()
            category[i].id = String(newCat._id)
          }
        }
      }

      ////  TRANSFORM STRINGS INTO NUMBERS IN COMMENT  ////
      if (typeof comment !== 'undefined') {
        if (comment.context.CS !== '' && typeof comment.context.CS !== 'undefined') {
          comment.context.CS = parseFloat(comment.context.CS) }
        if (comment.context.importance !== '' && typeof comment.context.importance !== 'undefined') {
          comment.context.importance = parseFloat(comment.context.importance) }
        for (let i = 0; i < comment.sentence.length; i++) {
          if (comment.sentence[i].cs !== '' && typeof comment.sentence[i].cs !== 'undefined') {
            comment.sentence[i].cs = parseFloat(comment.sentence[i].cs) }
          if (comment.sentence[i].importance !== '' && typeof comment.sentence[i].importance !== 'undefined') {
            comment.sentence[i].importance = parseFloat(comment.sentence[i].importance) }
          if (comment.sentence[i].confidence !== '' && typeof comment.sentence[i].confidence !== 'undefined') {
            comment.sentence[i].confidence = parseFloat(comment.sentence[i].confidence) }
          else {comment.sentence[i].confidence = 10}
        }
      }

      ////  TRANSFORM STRINGS INTO NUMBERS IN CATEGORIES  ////
      if (typeof category !== 'undefined') {
        for (let i = 0; i < category.length; i++) {
          if (category[i].rank !== '' && typeof category[i].rank !== 'undefined') {
            category[i].rank = parseFloat(category[i].rank) }
        }
      }

      ////  TRANSFORM STRINGS INTO NUMBERS IN INFLUENCES  ////
      if (typeof influence !== 'undefined') {
        for (let i = 0; i < influence.length; i++) {
          if (influence[i].percent !== '' && typeof influence[i].percent !== 'undefined') {
            influence[i].percent = parseFloat(influence[i].percent) }
        }
      }

      ////  TRANSFORM STRINGS INTO NUMBERS IN SELF REVIEW  ////
      if (typeof selfReview !== 'undefined') {
        for (let i = 0; i < selfReview.length; i++) {
          if (selfReview[i].rank !== '' && typeof selfReview[i].rank !== 'undefined') {
            selfReview[i].rank = parseFloat(selfReview[i].rank) }
        }
      }

      ////  CREATE & ADD IDS TO ALL NEW SELF REVIEW  ////
      if (typeof selfReview !== 'undefined') {
        for (let i = 0; i < selfReview.length; i++) {
          if (selfReview[i].id === '') {
            let selfIndex = category
            .findIndex( cat => cat.name == selfReview[i].name)
            selfReview[i].id = category[selfIndex].id
          }
        }
      }

      ////  ADD CATEGORY IDS TO LIST  ////
      for (let i = 0; i < category.length; i++) {
        if ( !catList.includes(category[i].id) ) {
          catList.push(category[i].id) }
      }

      ////  SUM USER SCORE FROM CATEGORIES  ////
      let catIdList = []
      for (let i = 0; i < userInfo.category.length; i++) {
        catIdList.push(String(userInfo.category[i].catId)) }
      for (let i = 0; i < catList.length; i++) {
        if ( catIdList.includes(catList[i]) ) {
          let senIndex = userInfo.category.findIndex( cat => cat.catId == catList[i])
          if (senIndex !== -1) {
            userCommentScore += parseFloat(userInfo.category[senIndex].catScore) }
        }
      }

      ////  CREATE & ADD IDS TO ALL NEW INFLUECES  ////
      if (typeof influence !== 'undefined') {
        for (let i = 0; i < influence.length; i++) {
          if (influence[i].id === '' && influence[i].name !== 'SELF') {
            const newPost = new Post({
              title: { content: influence[i].name }})
            let newInf = await newPost.save()
            influence[i].id = String(newInf._id)
          }
          else if (influence[i].name === 'SELF') {
            influence[i].id = String(postId) }
        }
      }
      let sentenceIds = [];
      let authorId = ''

      ////  CREATE NEW AUTHOR OR GET ID  ////
      if ( !(author.name === '' && author._id === '') ) {
        ////  CREATE NEW AUTHOR AND GET ID  ////
        if (author.name !== '' && author._id === '') {
          const newAuthor = new User({
            fullName: author.name,
            email: author.name + '@none.com',
            password: 'password'
          })
          let newAuth = await newAuthor.save()
          authorId = newAuth._id 
        }
        ////  GET AUTHOR ID  ////
        else if (author.name === '' && author._id !== '') { 
          authorId = author._id }
      }
      else if (author.name === '' && author._id === '' && postInfo.author.length == 0) {
          const newAuthor = new User({
            fullName: 'Unknown Author',
            email: postId + '@none.com',
            password: 'password'
          })
          let newAuth = await newAuthor.save()
          authorId = newAuth._id 
      }
      else {
        let newAuth = postInfo.author
        let topAuthor = newAuth.reduce( (prev, current) => { 
          return (prev.score > current.score) ? prev : current } )
        authorId = topAuthor.authId
      }

      ////  CREATE SENTENCES  ////
      if (comment.sentence.length > 0 ) {
        for (let i = 0; i < comment.sentence.length; i++) {
          if ( !isNaN(comment.sentence[i].cs) ) {
            // console.log(comment.sentence[i])
            // console.log( isNaN(comment.sentence[i].cs) )
            const newComSentence = new ComSentence({
              user: userId,
              post: postId,
              senId: comment.sentence[i].dataId,
              content: comment.sentence[i].content,
              comType: 'comment',
              cs: parseFloat(comment.sentence[i].cs),
              importance: parseFloat(comment.sentence[i].importance),
              tone: comment.sentence[i].tone,
              comment: comment.sentence[i].comment,
              score: userCommentScore * (comment.sentence[i].confidence / 10),
              userScore: userCommentScore,
              confidence: comment.sentence[i].confidence,
              userConfidence: comment.sentence[i].confidence,
              denominator: userCommentScore * (comment.sentence[i].confidence / 10),
              sources: comment.sentence[i].sources
            })
            let sentenceId = await newComSentence.save()
            const senIndex = postInfo.sentence.findIndex( sentence => sentence._id == comment.sentence[i].dataId)
            postInfo.sentence[senIndex].comments.push({_id: sentenceId._id})

            if ( !isNaN(comment.sentence[i].confidence) && !isNaN(comment.sentence[i].cs) && !isNaN(comment.sentence[i].importance) ) {
              let sentenceConfidence = parseFloat(comment.sentence[i].confidence) / 10
              let sentenceBase = userCommentScore * sentenceConfidence
              let sentenceTotalCS = sentenceBase * parseFloat(comment.sentence[i].cs)
              let sentenceTotalImportance = sentenceBase * parseFloat(comment.sentence[i].importance)
              postInfo.sentence[senIndex].denominator += sentenceBase
              postInfo.sentence[senIndex].totalCS += sentenceTotalCS
              postInfo.sentence[senIndex].totalImportance += sentenceTotalImportance
              let updatedBase = postInfo.sentence[senIndex].denominator
              let updatedCS = postInfo.sentence[senIndex].totalCS
              let updatedImportance = postInfo.sentence[senIndex].totalImportance
              let finalCS = 0
              let finalImportance = 0
              if (updatedBase !== 0) {
                finalCS = updatedCS / updatedBase
                finalImportance = updatedImportance / updatedBase
              }
              // console.log(sentenceConfidence, sentenceBase, sentenceTotalCS, sentenceTotalImportance, updatedBase, updatedCS, updatedImportance, finalCS, finalImportance, senIndex)
              postInfo.sentence[senIndex].cs = finalCS
              postInfo.sentence[senIndex].importance = finalImportance
              // console.log(postInfo.sentence[senIndex].cs)
              // console.log(postInfo.sentence[senIndex].importance)
              sentenceIds.push(sentenceId._id)
            }
          }
        }

        ////  ADD SENTENCES TO COMMENT  ////
        let comId;
        if (commentStatus) {
          let commentInfo = await Comment.findById(comment.comId)
          ////  ADD CONTEXT TO COMMENT  ////
          if (comment.context.comment !== '') {
            commentInfo.context.cs = parseFloat(comment.context.CS)
            commentInfo.context.importance = parseFloat(comment.context.importance)
            commentInfo.context.comment = comment.context.comment
            for (let i = 0; i < comment.context.sources.length; i++) {
              commentInfo.context.sources.push({ url: comment.context.sources[i] })}
          }
          for (let j = 0; j < sentenceIds.length; j++) {
            commentInfo.sentence.push({ _id: sentenceIds[j] })}
          if (authorId !== '') { commentInfo.author = authorId }
          if (typeof influence !== 'undefined') {
            for (let j = 0; j < influence.length; j++) {
              commentInfo.influence.push({
                percent: parseFloat(influence[j].percent),
                explanation: influence[j].explanation,
                score: userTotalScore,
                infId: influence[j].id
              })
            }
          }
          if (typeof category !== 'undefined') {
            for (let j = 0; j < category.length; j++) {
              commentInfo.category.push({
                rank: category[j].rank,
                explanation: category[j].explanation,
                score: userTotalScore,
                catId: category[j].id
              })
            }
          }
          commentInfo.save()
          comId = comment.comId
        }
        else {
          let newComment = new Comment({
            user: userId,
            post: postId,
            score: userCommentScore,
            date: Date(),
            context: {
              cs: parseFloat(comment.context.CS),
              importance: parseFloat(comment.context.importance),
              comment: comment.context.comment
            }
          })
          for (let i = 0; i < comment.context.sources.length; i++) {
            newComment.context.sources.push({ url: comment.context.sources[i] })}
          for (let i = 0; i < sentenceIds.length; i++) {
            newComment.sentence.push({ _id: sentenceIds[i] })}
          if (authorId !== '') { newComment.author = authorId }
          if (typeof influence !== 'undefined') {
            for (let i = 0; i < influence.length; i++) {
              newComment.influence.push({
                percent: parseFloat(influence[i].percent),
                explanation: influence[i].explanation,
                score: userTotalScore,
                infId: influence[i].id
              })
            }
          }
          if (typeof category !== 'undefined') {
            for (let i = 0; i < category.length; i++) {
              newComment.category.push({
                rank: parseFloat(category[i].rank),
                explanation: category[i].explanation,
                score: userTotalScore,
                catId: category[i].id
              })
            }
          }
          let commentsId = await newComment.save()
          comId = commentsId._id;
          userInfo.comments.push({ _id: comId });
          commentsId.save() // test
        }
        let comSentences = await ComSentence.find({'post': postId})
        for (let i = 0; i < comSentences.length; i++) {
          comSentences[i].comId = comId;
          comSentences[i].save()
        }
        if (postInfo.author.length !== 0) {
          let authIndex = postInfo.author.findIndex(findAuthor => findAuthor.authId == authorId)
          if (authIndex !== -1) {
            postInfo.author[authIndex].score += userTotalScore
          }
          else {
            postInfo.author.push({
              authId: authorId,
              score: userTotalScore
            })
          }
        }
        else {
          postInfo.author.push({
            authId: authorId,
            score: userTotalScore
          })
        }

        if (comment.context.comment !== '') {
          let contextBase = postInfo.context.denominator += userCommentScore
          let contextImportance = postInfo.context.totalImportance += (parseFloat(comment.context.importance) * userCommentScore)
          let contextCS = postInfo.context.totalCS += (parseFloat(comment.context.CS) * userCommentScore)
          let finalContextCS = 0
          let finalContextImportance = 0
          if (contextBase !== 0) {
            finalContextCS = contextCS / contextBase
            finalContextImportance = contextImportance / contextBase
          }
          postInfo.context.cs = finalContextCS
          postInfo.context.importance = finalContextImportance
          // console.log(contextBase, contextImportance, contextCS, finalContextCS, finalContextImportance)
        }

        for (let i = 0; i < category.length; i++) {
          if (postInfo.category.length > 0) {
            let catIndex = postInfo.category.findIndex( cat => cat.catId == category[i].id)
            if (catIndex !== -1 && !isNaN(category[i].rank) ) {
              let totalPS = postInfo.category[catIndex].totalPS += (parseFloat(category[i].rank) * userTotalScore)
              let catDenominator = postInfo.category[catIndex].denominator += userTotalScore
              if (catDenominator !== 0) {
                postInfo.category[catIndex].catPS = totalPS / catDenominator }
              else { postInfo.category[catIndex].catPS = 0 }
              // console.log(totalPS, catDenominator)
            }
            else if (catIndex === -1) {
              postInfo.category.push({
                catName: category[i].name,
                denominator: userTotalScore,
                catId: category[i].id,
                catPS: parseFloat(category[i].rank),
                totalPS: parseFloat(category[i].rank) * userTotalScore
              })
            }
          }
          else {
            postInfo.category.push({
              catName: category[i].name,
              denominator: userTotalScore,
              catId: category[i].id,
              catPS: parseFloat(category[i].rank),
              totalPS: parseFloat(category[i].rank) * userTotalScore
            })
          }
        }
        for (let i = 0; i < influence.length; i++) {
          if (postInfo.influence.length > 0) {
            let infIndex = postInfo.influence.findIndex( inf => inf.infId == influence[i].id)
            if (infIndex !== -1) {
              let totalPercent = postInfo.influence[infIndex].totalPercent += (parseFloat(influence[i].percent) * userTotalScore / 100)
              let infDenominator = postInfo.influence[infIndex].denominator += userTotalScore
              if (infDenominator !== 0) {
                postInfo.influence[infIndex].infPercent = totalPercent / infDenominator }
              else { postInfo.influence[infIndex].infPercent = 0 }
            }
            else {
              postInfo.influence.push({
                infName: postInfo.title.content,
                denominator: userTotalScore,
                infId: influence[i].id,
                totalPercent: parseFloat(influence[i].percent) * userTotalScore / 100,
                infPercent: parseFloat(influence[i].percent) / 100
              })
            }
          }
          else {
            postInfo.influence.push({
              infName: postInfo.title.content,
              denominator: userTotalScore,
              infId: influence[i].id,
              totalPercent: parseFloat(influence[i].percent) * userTotalScore / 100,
              infPercent: parseFloat(influence[i].percent) / 100
            })
          }
        }

        ////  ADD POST CS & PS  ////
        let authorInfo = await User.findById(authorId)
        let contextCS = postInfo.context.cs
        let contextImportance = postInfo.context.importance / 100
        let sentenceImportance = 1 - contextImportance
        let sentenceTotalCS = 0
        let sentenceTotalImportance = 0
        for (let i = 0; i < postInfo.sentence.length; i++) {
          sentenceTotalCS += (postInfo.sentence[i].cs * postInfo.sentence[i].importance)
          sentenceTotalImportance += postInfo.sentence[i].importance
        }
        let sentenceCS = 0
        if (sentenceTotalImportance !== 0) { sentenceCS = sentenceTotalCS / sentenceTotalImportance }
        let postCS = sentenceCS * sentenceImportance + contextCS * contextImportance
        let catTotalPS = 0
        for (let i = 0; i < postInfo.category.length; i++) {
          catTotalPS += postInfo.category[i].catPS }
        let selfIndex = postInfo.influence.findIndex( inf => inf.infName == 'SELF')
        let selfInfluence = 1
        if (selfIndex !== -1) {
          selfInfluence = postInfo.influence[selfIndex].infPercent }
        postInfo.totalCS = postCS
        let oldPS = postInfo.totalPS
        let newPS = postInfo.totalPS = catTotalPS * selfInfluence
        postInfo.totalScore = postInfo.totalPS * postInfo.totalCS
        let authorTotalCS = authorInfo.totalCS += postCS * userCommentScore
        let authorDenominator = authorInfo.denominator += userCommentScore
        if (authorInfo.CS == 0 && authorInfo.PS == 0) {
          authorInfo.CS = postInfo.totalCS
          authorInfo.PS = postInfo.totalPS
        }
        else {
          if (authorDenominator !== 0) {
            authorInfo.CS = authorTotalCS / authorDenominator }
          else { authorInfo.CS = 0 }
          authorInfo.PS += (newPS - oldPS)
        }
        // console.log(contextCS, contextImportance, sentenceImportance, sentenceTotalCS, sentenceTotalImportance, sentenceCS, postCS, catTotalPS, selfInfluence, oldPS, newPS, authorTotalCS, authorDenominator)

        for (let i = 0; i < category.length; i++) {
          if (authorInfo.category.length > 0) {
            let authIndex = authorInfo.category.findIndex( cat => cat.catId == category[i].id)
            if (authIndex !== -1) {
              let postIndex = authorInfo.category[authIndex].catPosts.findIndex( catPost => catPost.postId == postId)
              if (postIndex !== -1) {
                let oldDemCS = authorInfo.category[authIndex].catPosts[postIndex].denominatorCS
                let oldTotalCS = authorInfo.category[authIndex].catPosts[postIndex].postTotalCS
                let oldPostPS = authorInfo.category[authIndex].catPosts[postIndex].postPS
                authorInfo.category[authIndex].catPosts[postIndex].postOldCS = authorInfo.category[authIndex].catPosts[postIndex].postCS
                authorInfo.category[authIndex].catPosts[postIndex].postOldPS = authorInfo.category[authIndex].catPosts[postIndex].postPS
                let authDemCS = authorInfo.category[authIndex].catPosts[postIndex].denominatorCS += userCommentScore
                let authDemPS = authorInfo.category[authIndex].catPosts[postIndex].denominatorPS += userTotalScore
                let authTotalCS = authorInfo.category[authIndex].catPosts[postIndex].postTotalCS = postInfo.totalCS
                let authTotalPS = authorInfo.category[authIndex].catPosts[postIndex].postTotalPS = postInfo.totalPS
                let newPostPS = 0
                if (authDemCS !== 0) {
                  newPostPS = authorInfo.category[authIndex].catPosts[postIndex].postCS = authTotalCS / authDemCS }
                else { newPostPS = authorInfo.category[authIndex].catPosts[postIndex].postCS = 0 }
                if (authDemPS !== 0) {
                  authorInfo.category[authIndex].catPosts[postIndex].postPS = authTotalPS / authDemPS }
                else { authorInfo.category[authIndex].catPosts[postIndex].postPS = 0 }
                authorInfo.category[authIndex].catPosts[postIndex].postScore = authorInfo.category[authIndex].catPosts[postIndex].postPS * authorInfo.category[authIndex].catPosts[postIndex].postCS
                let catDem = authorInfo.category[authIndex].denominator += (authDemCS - oldDemCS)
                let catTotalCS = authorInfo.category[authIndex].catTotalCS += (authTotalCS - oldTotalCS)
                let catCS = 0
                if (catDem !== 0) {
                  catCS = authorInfo.category[authIndex].catCS = catTotalCS / catDem }
                else { catCS = authorInfo.category[authIndex].catCS = 0 }
                let catPS = authorInfo.category[authIndex].catPS += (newPostPS - oldPostPS)
                authorInfo.category[authIndex].catScore = catCS * catPS
              }
              else {
                let catPS = authorInfo.category[authIndex].catPS += postInfo.totalPS
                let catDem = authorInfo.category[authIndex].denominator += userCommentScore
                let catTotalCS = authorInfo.category[authIndex].catTotalCS += userCommentScore * postInfo.totalCS
                if (catDem !== 0) {
                  authorInfo.category[authIndex].catCS = catTotalCS / catDem }
                else { authorInfo.category[authIndex].catCS = 0 }
                authorInfo.category[authIndex].catScore = catPS * authorInfo.category[authIndex].catCS
                authorInfo.category[authIndex].catPosts.push({
                  postId: postId,
                  comment: false,
                  denominatorCS: userCommentScore,
                  denominatorPS: userTotalScore,
                  postTotalCS: userCommentScore * postInfo.totalCS,
                  postTotalPS: userTotalScore * postInfo.totalPS,
                  postCS: postInfo.totalCS,
                  postPS: postInfo.totalPS,
                  postScore: postInfo.totalCS * postInfo.totalPS
                })
              }
            }
            else {
              authorInfo.category.push({
                catName: category[i].name,
                catId: category[i].id,
                denominator: userCommentScore,
                catTotalCS: userCommentScore * postInfo.totalCS,
                catCS: postInfo.totalCS,
                catPS: postInfo.totalPS,
                catScore: postInfo.totalCS * postInfo.totalPS,
                catPosts: [{
                  postId: postId,
                  comment: false,
                  denominatorCS: userCommentScore,
                  denominatorPS: userTotalScore,
                  postTotalCS: userCommentScore * postInfo.totalCS,
                  postTotalPS: userTotalScore * postInfo.totalPS,
                  postCS: postInfo.totalCS,
                  postPS: postInfo.totalPS,
                  postScore: postInfo.totalCS * postInfo.totalPS
                }]
              })
            }
          }
          else {
            authorInfo.category.push({
              catName: category[i].name,
              catId: category[i].id,
              denominator: userCommentScore,
              catTotalCS: userCommentScore * postInfo.totalCS,
              catCS: postInfo.totalCS,
              catPS: postInfo.totalPS,
              catScore: postInfo.totalCS * postInfo.totalPS,
              catPosts: [{
                postId: postId,
                comment: false,
                denominatorCS: userCommentScore,
                denominatorPS: userTotalScore,
                postTotalCS: userCommentScore * postInfo.totalCS,
                postTotalPS: userTotalScore * postInfo.totalPS,
                postCS: postInfo.totalCS,
                postPS: postInfo.totalPS,
                postScore: postInfo.totalCS * postInfo.totalPS
              }]
            })
          }
        }
        authorInfo.score = authorInfo.PS * authorInfo.CS
        authorInfo.save()

        ////  ADD SELF EVALUATION  ////
        let selfTotalScore = userTotalScore
        if (selfTotalScore == 0) {
          for (let i = 0; i < selfReview.length; i++) {
            if (selfReview[i].rank !== '' && typeof selfReview[i].rank !== 'undefined') {
              selfTotalScore += selfReview[i].rank }
          }
        }

        let selfCommentScore = userCommentScore
        if (selfCommentScore == 0) {
          for (let i = 0; i < selfReview.length; i++) {
            if (selfReview[i].rank !== '' && typeof selfReview[i].rank !== 'undefined') {
              selfCommentScore += selfReview[i].rank }
          }
        }

        let contCS = comment.context.CS
        let contImportance = comment.context.importance / 100
        let senImportance = 1 - contImportance
        let senTotalCS = 0
        let senTotalImportance = 0
        for (let i = 0; i < comment.sentence.length; i++) {
          senTotalImportance += comment.sentence[i].importance
          senTotalCS += (comment.sentence[i].cs * comment.sentence[i].importance)
        }
        let senCS = 0 
        if (senTotalImportance !== 0) { senCS = senTotalCS / senTotalImportance }
        let commentCS = senCS * senImportance + contCS * contImportance

        ////  UPDATE USER CATEGORY SCORES  ////
        let oldSelfReview = 0
        let newSelfReview = 0
        // console.log(contCS, contImportance, senImportance, senTotalCS, senTotalImportance, senCS, commentCS, oldSelfReview, newSelfReview)

        for (let i = 0; i < selfReview.length; i++) {
          if (userInfo.category.length > 0) {
            let userIndex = userInfo.category.findIndex( cat => cat.catId == selfReview[i].id)
            if (userIndex !== -1) {
              oldSelfReview += userInfo.category[userIndex].catPS
              userInfo.category[userIndex].catPosts.push({
                commentId: comId,
                comment: true,
                denominatorCS: selfCommentScore,
                denominatorPS: selfTotalScore,
                postTotalCS: commentCS * selfCommentScore,
                postTotalPS: selfReview[i].rank * selfTotalScore,
                postCS: commentCS,
                postPS: selfReview[i].rank,
                postOldCS: 0,
                postOldPS: 0,
                postScore: commentCS * selfReview[i].rank
              })
              let catDenominator = userInfo.category[userIndex].denominator += selfCommentScore
              let catTotalCS = userInfo.category[userIndex].catTotalCS += selfCommentScore * commentCS
              if (catDenominator !== 0) {
                userInfo.category[userIndex].catCS = catTotalCS / catDenominator }
              else { userInfo.category[userIndex].catCS = 0 }
              let catCS = userInfo.category[userIndex].catCS
              let catPS = userInfo.category[userIndex].catPS += selfReview[i].rank
              userInfo.category[userIndex].catScore = catCS * catPS
              newSelfReview += userInfo.category[userIndex].catPS
              // console.log(catDenominator, catTotalCS, catCS, catPS)
            }
            else {
              userInfo.category.push({
                catName: selfReview[i].name,
                catId: selfReview[i].id,
                denominator: selfCommentScore,
                catTotalCS: selfCommentScore * commentCS,
                catCS: commentCS,
                catPS: selfReview[i].rank,
                catScore: selfReview[i].rank * commentCS,
                catPosts: [{
                  commentId: comId,
                  comment: true,
                  denominatorCS: selfCommentScore,
                  denominatorPS: selfTotalScore,
                  postTotalCS: commentCS * selfCommentScore,
                  postTotalPS: selfReview[i].rank * selfTotalScore,
                  postCS: commentCS,
                  postPS: selfReview[i].rank,
                  postOldCS: 0,
                  postOldPS: 0,
                  postScore: commentCS * selfReview[i].rank
                }]
              })
              newSelfReview += selfReview[i].rank
            }
          }
          else {
            userInfo.category.push({
              catName: selfReview[i].name,
              catId: selfReview[i].id,
              denominator: selfCommentScore,
              catTotalCS: selfCommentScore * commentCS,
              catCS: commentCS,
              catPS: selfReview[i].rank,
              catScore: selfReview[i].rank * commentCS,
              catPosts: [{
                commentId: comId,
                comment: true,
                denominatorCS: selfCommentScore,
                denominatorPS: selfTotalScore,
                postTotalCS: commentCS * selfCommentScore,
                postTotalPS: selfReview[i].rank * selfTotalScore,
                postCS: commentCS,
                postPS: selfReview[i].rank,
                postOldCS: 0,
                postOldPS: 0,
                postScore: commentCS * selfReview[i].rank
              }]
            })
            newSelfReview += selfReview[i].rank
          }
        }
        let userDenom = userInfo.denominator += selfCommentScore
        let userTotalCS = userInfo.totalCS += selfCommentScore * commentCS
        if (userDenom !== 0) { userInfo.CS = userTotalCS / userDenom }
        else { userInfo.CS = 0 }
        userInfo.PS += (newSelfReview - oldSelfReview)
        userInfo.score = userInfo.CS * userInfo.PS
        userInfo.save()
        let commentPS = 0
        for (let i = 0; i < postInfo.category.length; i++) {
          commentPS += postInfo.category[i].catPS }
        
        let infPercent = 1
        if ( selfIndex !== -1 ) {
          infPercent = postInfo.influence[selfIndex].infPercent }
        postInfo.totalCS = contextCS * contextImportance + senCS * sentenceImportance
        postInfo.totalPS = commentPS * infPercent
        postInfo.totalScore = postInfo.totalPS * postInfo.totalCS
        if (!commentStatus) {
          postInfo.comments.push({_id: comId})}
        postInfo.save()
        res.status(200).send( JSON.stringify( {
          'data': { 'status': 'comment logged' } } ) )
        return;
      } 
      else {
        res.status(200).send( JSON.stringify( {
          'data': { 'status': 'no comment logged' } } ) )
        return;
      }
    } catch (error) {
      // console.log(error)
      res.status(400).send(JSON.stringify({
        'data': { 
          'status': 'Comment failed',
          'error': error
        }
      } ) )
    }
  },
}


const data = ( () => {
  let tRatio = 0

  async function totalRatio() {
    if (tRatio === 0) {
      let catTotal = await CatTotal.findOne()
      if ( catTotal == null || catTotal.length == 0 ) {
        let newCatTotal = new CatTotal({})
        catTotal = await newCatTotal.save()
        tRatio = catTotal.totalRatioCount
      }
      else { tRatio = catTotal.totalRatioCount }
      return tRatio
    }
    else { return tRatio }
  }
  return { totalRatio }
})()

async function totalUserScore(userId) {
  let userInfo = await User.findById(userId)
  let userTotalScore = 0
  let userTotalCS = 0
  let userTotalPS = 0
  for (let i = 0; i < userInfo.category.length; i++) {
    catPercent = await catRatioFn(userInfo.category[i].catId)
    userTotalScore += catPercent * userInfo.category[i].catPS * userInfo.category[i].catCS
    userTotalPS += catPercent * userInfo.category[i].catPS
  }
  if (userTotalPS !== 0) { userTotalCS = userTotalScore / userTotalPS }
  else { userTotalCS = 0 }
  let userScores = {
    PS: userTotalPS,
    CS: userTotalCS,
    Score: userTotalScore
  }
  return userScores
}


async function catRatioFn(catId) {
  let catTotalRatio = await data.totalRatio()
  let catMultiplier = 1
  let parentCat = mainCat = await Category.findById(catId)
  while ( parentCat.parent.categories !== null || parentCat.parent.categories.length !== 0 ) {
    let parentCats = parentCat.parent.categories.sort( (prev, current) => (prev.userScore < current.userScore) ? 1 : -1 )
    if ( parentCat.parent.categories.length !== 0 ) {
      parentCat = await Category.findById(parentCats[0].category)
      catMultiplier = catMultiplier * parentCat.selfParentRatio
    }
    else { break }
  }
  let catRatio = mainCat.catRatioTotal
  let catPercent
  if ( catTotalRatio !== 0 ) {
    catPercent = catRatio / catTotalRatio * catMultiplier }
  else { catPercent = 0 }
  return catPercent
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};