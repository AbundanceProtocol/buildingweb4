//// STATE PARAMETERS ////
let login = false
let data = {}
let message = '';
let send = { message, login, data }

//// LAUNCH NAV FROM BROWSER ACTION ////
chrome.browserAction.onClicked.addListener(launch)

//// SEND LAUNCH TO TAB ////
async function launch(tab) {
  message = 'Launch'; 
  send = { message, login, data }
  chrome.tabs.sendMessage(tab.id, send)
};

//// RECEIVE MESSAGES FROM TAB ////
chrome.runtime.onMessage.addListener(gotMessage)

//// PROCESS MESSAGES FROM TAB ////
async function gotMessage(req, sender, sendResponse) {
  console.log(req.message)
	const tabMessage = req.message;
  switch(tabMessage) {
    case 'Loaded':
      const log = await isLogged()
      console.log(log)
      if (log.message === 'Logged in') {
        login = true } 
        else { login = false }
        const loginCheck = {'message': 'Login Check', login}
        chrome.tabs.sendMessage(sender.tab.id, loginCheck)
        break;
    case 'Comment Responses':
      const respIds = req.data.respIds
      const position = req.data.position
      const comResp = await getComResponses(respIds)
      const comResponses = {'message': 'Com Responses', 'responses': comResp, 'position': position }

      chrome.tabs.sendMessage(sender.tab.id, comResponses)
      break;
    case 'Find User Comments':
      const postId = req.data.postId;
      const userComments = await getComments(postId)
      chrome.tabs.sendMessage(sender.tab.id, userComments)
      break;
    case 'Nav Post Search':
      const navText = req.data.post
      const navPosts = await getNavPosts(navText)
      chrome.tabs.sendMessage(sender.tab.id, navPosts)
      break;
    case 'Nav Category Search':
      const navCats = req.data.post
      const navCategories = await getNavCategoriess(navCats)
      chrome.tabs.sendMessage(sender.tab.id, navCategories)
      break;
    case 'Nav Author Search':
      const navAuth = req.data.post
      const navAuthors = await getNavAuthors(navAuth)
      chrome.tabs.sendMessage(sender.tab.id, navAuthors)
      break;
    case 'Nav Proposal Search':
      const navProposal = req.data.post
      const navProposals = await getNavProposals(navProposal)
      chrome.tabs.sendMessage(sender.tab.id, navProposals)
      break;
    case 'Comment List':
      console.log('comment list response')
      const getPost = req.data.postId
      const commentList = await getCommentList(getPost)
      chrome.tabs.sendMessage(sender.tab.id, commentList)
      break;
    case 'Send Search URLs':
      const getUrls = req.data.urls
      const urlResponses = await getUrlData(getUrls)
      chrome.tabs.sendMessage(sender.tab.id, urlResponses)
      break;
    case 'Send URL':
      const pageUrl = req.data.url;
      const pageTitle = req.data.title;
      const urlResponse = await getUrl(pageUrl, pageTitle)
      let userResponse
      if (login) {
        userResponse = await getUser(pageUrl, pageTitle)
      }
      const postData = {'message': 'Post and User', login, 'post': urlResponse, 'user': userResponse }
      console.log(postData)
      chrome.tabs.sendMessage(sender.tab.id, postData)
      break;
    case 'Get Sub':
      const parentId = req.data.parentId;
      const subPos = req.data.position;
      const subList = await getSubList(parentId)
      const subResponse = {'message': 'Sub List', 'subs': subList, 'position': subPos }
      chrome.tabs.sendMessage(sender.tab.id, subResponse)
      break;
    case 'Sentence Comment':
      const pageId = req.data.postId
      const senId = req.data.senId
      const comResponse = await getSenComments(pageId, senId)
      chrome.tabs.sendMessage(sender.tab.id, comResponse)
      break;
    case 'Post Comment':
      const comment = req.data.comment;
      const commentResponse = await postComment(comment)
      chrome.tabs.sendMessage(sender.tab.id, commentResponse)
      break;
    case 'User Register':
      const { email, password, fullName } = req.data
      const regResponse = await signUp(email, password, fullName)
      chrome.tabs.sendMessage(sender.tab.id, regResponse)
      break;
    case 'User Login':
      const logEmail = req.data.email
      const logPassword = req.data.password
      const logResponse = await signIn(logEmail, logPassword)
      chrome.tabs.sendMessage(sender.tab.id, logResponse)
      break;
    case 'Send Reply':
      const reply = req.data.reply;
      const pos = req.data.position;
      const postedReply = await postReply(reply)
      const repResponse = {'message': 'Reply Result', 'reply': postedReply, 'position': pos }
      chrome.tabs.sendMessage(sender.tab.id, repResponse)
      break;
    case 'Log out':
      const isLoggedOut = await signOut()
      chrome.tabs.sendMessage(sender.tab.id, isLoggedOut)
      break;
    case 'Category List':
      const categoryList = await catList()
      chrome.tabs.sendMessage(sender.tab.id, categoryList)
      break;
    case 'Add Cat Search':
      const catSearch = req.data.category;
      const catSearchResult = await searchCategories(catSearch)
      chrome.tabs.sendMessage(sender.tab.id, catSearchResult)
      break;
    case 'Send Proposal':
      const proposal = req.data.proposalData
      const propResponse = await submitPropsal(proposal)
      chrome.tabs.sendMessage(sender.tab.id, propResponse)
      break;
    case 'Category Search':
      const category = req.data.category;
      const responseCategory = await getCategories(category)
      chrome.tabs.sendMessage(sender.tab.id, responseCategory)
      break;
    case 'Send Cat Ranking':
      const ranking = req.data.ranking;
      const rankPos = req.data.position;
      const catRanking = await catRank(ranking)
      const rankResponse = {'message': 'Rank Result', 'rank': catRanking, 'position': rankPos }
      chrome.tabs.sendMessage(sender.tab.id, rankResponse)
      break;
    case 'Post Search':
      const posts = req.data.influence;
      const responsePosts = await getPosts(posts)
      chrome.tabs.sendMessage(sender.tab.id, responsePosts)
      break;
    case 'Author Search':
      const author = req.data.author;
      const responseAuthors = await getAuthors(author)
      chrome.tabs.sendMessage(sender.tab.id, responseAuthors)
      break;
    case 'Send Range':
      const rangeData = req.data.range;
      const rangeIds = await sendRanges(rangeData)
      chrome.tabs.sendMessage(sender.tab.id, rangeIds)
      break;
    case 'Send Prop Bid':
      const propBidData = req.data.proposalData;
      const propBidPos = req.data.position
      const propBidResponse = await sendPropBid(propBidData)
      const propBid = {'message': 'Prop Bid', 'bidData': propBidResponse, 'position': propBidPos }
      chrome.tabs.sendMessage(sender.tab.id, propBid)
      break;
    case 'Send Prop Reply':
      const propReplyData = req.data.proposalData;
      const propReplyPos = req.data.position
      const propReplyResponse = await sendPropReply(propReplyData)
      const propReply = {'message': 'Prop Reply', 'replyData': propReplyResponse, 'position': propReplyPos }
      chrome.tabs.sendMessage(sender.tab.id, propReply)
      break;
    case 'Send Review':
      const reviewData = req.data;
      const responseReview = await sendReview(reviewData)
      chrome.tabs.sendMessage(sender.tab.id, responseReview)
      break;
    default:
      console.log('No data');
      break;
  }
  return true;
};

async function submitPropsal(proposal) {
  const url = 'http://localhost:3000/users/submitprop';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'proposal': proposal
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Proposal success', 
    data = {parsedData};
    send = { message, data }
    return send;
  } else {
    message = 'Proposal fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function sendPropReply(reply) {
  const url = 'http://localhost:3000/users/propreply';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'reply': reply
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Prop Reply success', 
    data = {parsedData};
    send = { message, data }
    return send;
  } else {
    message = 'Prop Reply fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function sendPropBid(bid) {
  const url = 'http://localhost:3000/users/propbid';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'bid': bid
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Prop Bid success', 
    data = {parsedData};
    send = { message, data }
    return send;
  } else {
    message = 'Prop Bid fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function sendReview(review) {
  const url = 'http://localhost:3000/users/review';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'review': review
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Review success', 
    data = {parsedData};
    send = { message, data }
    return send;
  } else {
    message = 'Review fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function catRank(rank) {
  const url = 'http://localhost:3000/users/catrank';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'ranking': rank
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Ranking success', 
    data = parsedData.data;
    send = { message, data }
    return send;
  } else {
    message = 'Ranking fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function postReply(reply) {
  const url = 'http://localhost:3000/users/postreply';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'reply': reply
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Reply success', 
    data = parsedData.data;
    send = { message, data }
    return send;
  } else {
    message = 'Reply fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

async function postComment(comment) {
  const url = 'http://localhost:3000/users/comment';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'comment': comment
    })
  })
  if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    message = 'Comment success', 
    data = {parsedData};
    send = { message, data }
    return send;
  } else {
    message = 'Comment fail', 
    data = {};
    send = { message, data }
    return send;
  }
}

//// PROCESS SIGN OUT ////
async function signOut() {
  await chrome.storage.sync.set({'PlatformToken': ''})
  login = false;
  message = 'Logged out', 
  data = {};
  send = { message, login, data }
  return send;
}

//// PROCESS SIGN UP ////
async function signUp(email, password, fullName) {
  const url = 'http://localhost:3000/users/signup';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'email': email,
      'password': password,
      'fullName': fullName
    })
  })
  if (response.status === 200) {
    login = true;
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Register successful';
    let token = parsedData.data.token
    await chrome.storage.sync.set({'PlatformToken': token})
    send = { message, login, data }
    return send;
  } else {
    await chrome.storage.sync.set({'PlatformToken': ''})
    login = false;
    message = 'Register failed', 
    data = {};
    send = { message, login, data }
    return send;
  }
}

//// VERIFY TOKEN ////
async function isLogged() {
  try {
    let storedToken = await getLocalStorageValue('PlatformToken');
    let token = storedToken.PlatformToken
    let url = 'http://localhost:3000/users/secret';
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Authorization: token
      }
    })
    if (response.status === 200 || response.status === 304) {
      let res = await response.text();
      let parsedData = await JSON.parse(res);
      parsedData.completed = true;
      message = 'Logged in';
      login = true;
      data = parsedData.data;
      send = { message, login, data }
      return send;
    } else {
      message = 'Not logged';
      login = false;
      data = '';
      send = { message, login, data }
      return send;
    }
  } catch (error) {
    message = 'Login error';
    login = false;
    data = '';
    send = { message, login, data, error }
    return send;
  }
}

//// PROCESS SIGN IN ////
async function signIn(email, password) {
  const url = 'http://localhost:3000/users/signin';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'email': email,
      'password': password
    })
  })
  if (response.status === 200) {
    login = true;
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Login successful';
    let token = parsedData.data.token
    await chrome.storage.sync.set({'PlatformToken': token})
    send = { message, login, data }
    return send;
  } else {
    await chrome.storage.sync.set({'PlatformToken': ''})
    login = false;
    message = 'Login failed', 
    data = {};
    send = { message, login, data }
    return send;
  }
}

async function getComments(postId) {
  const url = 'http://localhost:3000/users/read';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'postId': postId
    })
  })
  if (response.status !== 200) {
    message = 'User Comments not found';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'User Comments found';
    send = { message, data }
    return send;
  }
}

//// GET SUB LIST ////
async function getSubList(parentId) {
  const url = 'http://localhost:3000/users/sublist';

  // const url = 'http://localhost:3000/users/comresponses';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'parentId': parentId
    })
  })
  if (response.status !== 200) {
    message = 'Sub List fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Sub List success';
    send = { message, data }
    return send;
  }
}

//// GET CATEGORY LIST ////
async function catList() {
  const url = 'http://localhost:3000/users/catlist';

  // const url = 'http://localhost:3000/users/comresponses';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      // 'respIds': respIds
    })
  })
  if (response.status !== 200) {
    message = 'Category List fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Category List success';
    send = { message, data }
    return send;
  }
}

//// GET USER DATA ////
async function getUser(pageUrl, pageTitle) {
  const url = 'http://localhost:3000/users/userdata';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'url': pageUrl,
      'title': pageTitle
    })
  })
  if (response.status !== 200) {
    message = 'User fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'User success';
    send = { message, data }
    return send;
  }
}

//// GET URL DATA FROM SERVER ////
async function getUrlData(urls) {
  const url = 'http://localhost:3000/users/geturls';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'urls': urls
    })
  })
  if (response.status !== 200) {
    message = 'URLs fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'URLs success';
    send = { message, data }
    return send;
  }
}

//// GET COMMENT RESPONSES FROM SERVER ////
async function getComResponses(respIds) {
  const url = 'http://localhost:3000/users/comresponses';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'respIds': respIds
    })
  })
  if (response.status !== 200) {
    message = 'Sen response fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Sen response success';
    send = { message, data }
    return send;
  }
}

//// GET POST COMMENTS FROM SERVER ////
async function getSenComments(pageId, senId) {
  const url = 'http://localhost:3000/users/sencomments';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'postId': pageId,
      'sentenceId': senId
    })
  })
  if (response.status !== 200) {
    message = 'Sen comment fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Sen comment success';
    send = { message, data }
    return send;
  }
}

//// GET POST COMMENTS FROM SERVER ////
async function getCommentList(pageId) {
  const url = 'http://localhost:3000/users/commentlist';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'postId': pageId
    })
  })
  if (response.status !== 200) {
    message = 'Comment list fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Comment list success';
    send = { message, data }
    return send;
  }
}

//// GET CATEGORIES FROM SERVER ////
async function getUrl(pageUrl, pageTitle) {
  const url = 'http://localhost:3000/users/url';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'url': pageUrl,
      'title': pageTitle
    })
  })
  if (response.status !== 200) {
    message = 'URL fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res);
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'URL success';
    send = { message, data }
    return send;
  }
}

async function sendRanges(rangeData) {
  const url = 'http://localhost:3000/users/range';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'range': rangeData
    })
  })
  if (response.status !== 200) {
    console.log('Range fail')
    message = 'Range fail';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Range update';
    send = { message, data }
    return send;
  }
}

//// GET NAV POSTS FROM SERVER ////
async function getNavProposals(posts) {
  const keyword = posts
  const url = 'http://localhost:3000/users/navproposals';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })
  if (response.status !== 200) {
    message = 'No nav proposals sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Nav proposals sent';
    send = { message, data }
    return send;
  }
}

//// GET NAV CATEGORIES FROM SERVER ////
async function getNavCategoriess(categories) {
  const keyword = categories
  const url = 'http://localhost:3000/users/navcategories';
  let storedToken = await getLocalStorageValue('PlatformToken');
  let token = storedToken.PlatformToken
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },       
    body: JSON.stringify({
      'keyword': keyword
    })
  })
  if (response.status !== 200) {
    message = 'No nav categories sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Nav categories sent';
    send = { message, data }
    return send;
  }
}

//// GET NAV POSTS FROM SERVER ////
async function getNavAuthors(posts) {
  const keyword = posts
  const url = 'http://localhost:3000/users/navauthors';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })
  if (response.status !== 200) {
    message = 'No nav authors sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Nav authors sent';
    send = { message, data }
    return send;
  }
}

//// GET NAV POSTS FROM SERVER ////
async function getNavPosts(posts) {
  const keyword = posts
  const url = 'http://localhost:3000/users/navposts';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })
  if (response.status !== 200) {
    message = 'No nav posts sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Nav posts sent';
    send = { message, data }
    return send;
  }
}

//// GET POSTS FROM SERVER ////
async function getPosts(posts) {
  const keyword = posts
  const url = 'http://localhost:3000/users/posts';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })

  if (response.status !== 200) {
    message = 'Posts Sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Posts Sent';
    send = { message, data }
    return send;
  }
}

//// GET AUTHORS FROM SERVER ////
async function getAuthors(author) {
  const keyword = author
  const url = 'http://localhost:3000/users/author';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })

  if (response.status !== 200) {
    message = 'Authors Sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Authors Sent';
    send = { message, data }
    return send;
  }
}

//// MATCH CATEGORY FROM SERVER ////
async function searchCategories(categories) {
  const keyword = categories
  const url = 'http://localhost:3000/users/catsearch';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })

  if (response.status !== 200) {
    message = 'Categories Sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Categories Sent';
    send = { message, data }
    return send;
  }
}

//// GET CATEGORIES FROM SERVER ////
async function getCategories(categories) {
  const keyword = categories
  const url = 'http://localhost:3000/users/category';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify({
      'keyword': keyword
    })
  })

  if (response.status !== 200) {
    message = 'Categories Sent';
    data = '';
    send = { message, data }
    return send;
  } else if (response.status === 200) {
    let res = await response.text();
    let parsedData = JSON.parse(res)
    console.log(parsedData.data)
    data = parsedData.data;
    message = 'Categories Sent';
    send = { message, data }
    return send;
  }
}

//// GET TOKEN FROM LOCAL STORAGE ////
async function getLocalStorageValue(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(key, function (value) {
        resolve(value);
      })
    }
    catch (error) {
      reject(error);
    }
  });
}