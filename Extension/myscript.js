// let ytplayerTime = document.getElementById('movie_player') // player element
// let ytplayerTime = document.getElementById('movie_player').getCurrentTime() // current timestamp from youtube video
// let ytplayerDuration = document.getElementById('movie_player').getDuration() // total youtube video duration

chrome.runtime.sendMessage({ 'message': 'Loaded', 'data': { 'url': window.location.toString(), 'title': $(document).find("title").text() } });

//// RECEIVE MESSAGES FROM BACKGROUND ////
chrome.runtime.onMessage.addListener(gotMessage)

//// NAV PARAMETERS ////
let oldboxTop = 0, oldboxRight = 0, oldboxLeft = 0;
let dataX = 10
let dataY = 10
let authorOn = false;
let searchAuthors
let authorSchema = { 'name': '', '_id': '' }
let navDataX = 10
let navDataY = 10
let elemW = 100;
let elemH = 100;
let tooltip = document.createElement('div');
let spanTip = document.createElement('div');
let login = false;
let postId = null;
let sliderStatus = false;
let targetPage = 'menu';
let highligher = false;
let spantipOn = false;
let addToRange = true;
let targetId = 0;
let tempText = '';
let returnSpace = `
`;
let spanRanges = { 'list': [], 'postId': '' }
let selfSchema = []
let commentListSchema = []
let catSchema = []
let searchAuthSchema = []
let searchSchema = []
let infSchema = []
let comSchema = {
  'comment': '',
  'cs': 0,
  'is': 0
}
let userSchema = {
  'catCS': 0,
  'catPS': 0,
  'totalCS': 0,
  'totalPS': 0,
  'fullName': ''
}
let postSchema = {
  'postId': '',
  'posts': [],
  'title': {
    'content': '',
    'CS': '',
    'importance': '',
    'tone': '',
    'comment': '',
    'sources': ''
  },
  'author': '',
  'sentence': [],
  'context': {
    'CS': '', 
    'importance': '', 
    'comment': '', 
    'sources': ''
 },
 'media': {
    'content': '', 
    'media': '', 
    'CS': '', 
    'importance': '', 
    'comment': '', 
    'sources': ''
 },
 'CS': 0,
 'PS': 0,
 'influence': [],
 'category': [],
 'influencePercent': '',
 'categoryPercent': ''
}
let commentSchema = {
  'comId': '',
  'commentStatus': false,
  'fetched': false,
  'postId': '',
  'title': {
    'content': '',
    'CS': '',
    'importance': '',
    'tone': '',
    'comment': '',
    'sources': ''
  },
  'author': '',
  'sentence': [],
  'context': {
    'CS': '', 
    'importance': '', 
    'comment': '', 
    'sources': []
 },
 'media': {
    'content': '', 
    'media': '', 
    'CS': '', 
    'importance': '', 
    'comment': '', 
    'sources': ''
 },
 'CS': 0,
 'PS': 0,
 'influence': '',
 'influencePercent': '',
 'category': '',
 'categoryPercent': ''
}

const eval = ( () => {
  let submitEval = false;
  let commentEval = false;
  let categoryEval = false;
  let influenceEval = false;
  let contextEval = false;
  let prop = { data: {title: '', summary: '', source: [{item: '', removed: false}], funding: 0, influence: 0, cat: [{ catName: '', catId: '', catReason: '', catValue: 0, removed: false } ] }, title: false, summary: false, source: [{item: false, removed: false}], funding: false, influence: false, cat: [{ catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }], allSources: false, allCats: false, allBids: false, allInfo: false, all: false };

  function proposal(set) {
    // debugger;
    if ( typeof set.target !== 'undefined' && set.target === 'title' ) {
      if ( $('[data-prop="title"]').val() !== '' ) {
        prop.title = true
        prop.data.title = $('[data-prop="title"]').val()
        $('[data-prop="title-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
        $('[data-prop="title"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        prop.title = false
        prop.data.title = ''
        $('[data-prop="title-eval"]').removeClass('fa').removeClass('fa-check-circle')
        $('[data-prop="title"]').css('border', '')
      }
      evalInfo()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'summary' ) {
      if ( $('[data-prop="summary"]').val() !== '' ) {
        prop.summary = true
        prop.data.summary = $('[data-prop="summary"]').val()
        $('[data-prop="summary-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
        $('[data-prop="summary"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        prop.summary = false
        prop.data.summary = ''
        $('[data-prop="summary-eval"]').removeClass('fa').removeClass('fa-check-circle')
        $('[data-prop="summary"]').css('border', '')
      }
      evalInfo()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'funding' ) {
      if ( $('[data-prop="funding"]').val() !== '' && !isNaN( $('[data-prop="funding"]').val() ) ) {
        prop.funding = true
        prop.data.funding = $('[data-prop="funding"]').val()
        $('[data-prop="funding-eval"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else if ( $('[data-prop="funding"]').val() === '' ) {
        prop.funding = false
        prop.data.funding = 0
        $('[data-prop="funding-eval"]').css('border', '')
      }
      else { 
        prop.funding = false
        prop.data.funding = 0
        $('[data-prop="funding-eval"]').css('border', '0.5px solid rgb(238, 0, 0)')
      }
      evalBids()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'influence' ) {
      if ( $('[data-prop="influence"]').val() !== '' ) {
        prop.influence = true
        prop.data.influence = $('[data-prop="influence"]').val()
        $('[data-prop="influence-eval"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        prop.influence = false
        prop.data.influence = 0
        $('[data-prop="influence-eval"]').css('border', '')
      }
      evalBids()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'source' ) {
      if ( typeof prop.source[set.num] === 'undefined' ) {
        prop.source[set.num] = { item: false, removed: false } }
      if ( typeof prop.data.source[set.num] === 'undefined' ) {
        prop.data.source[set.num] = { item: '', removed: false } }
      if ( set.action === 'add' ) {
        prop.source[set.num].item = false
        prop.source[set.num].removed = false
        prop.data.source[set.num].item = ''
        prop.data.source[set.num].removed = false
        $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').css('border', '')
        $('[data-prop="source-eval"][data-prop-num="' + set.num + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
      }
      else if ( set.action === 'remove' ) {
        prop.source[set.num].item = false
        prop.source[set.num].removed = true
        prop.data.source[set.num].item = ''
        prop.data.source[set.num].removed = true
        $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').css('border', '')
        $('[data-prop="source-eval"][data-prop-num="' + set.num + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
      }
      else if ( set.action === 'set' ) {
        if ( $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').val() === '' ) {
          prop.source[set.num].item = false
          prop.source[set.num].removed = false
          prop.data.source[set.num].item = ''
          prop.data.source[set.num].removed = false
          $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').css('border', '')
          $('[data-prop="source-eval"][data-prop-num="' + set.num + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
        }
        else {
          prop.source[set.num].item = true
          prop.source[set.num].removed = false
          prop.data.source[set.num].item = $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').val()
          prop.data.source[set.num].removed = false
          $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
          $('[data-prop="source-eval"][data-prop-num="' + set.num + '"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
        }
      }
      evalSources()
      evalInfo()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'catName' ) {
      if ( typeof prop.cat[set.num] === 'undefined' ) {
        prop.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof prop.data.cat[set.num] === 'undefined' ) {
        prop.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( set.action === 'add' ) {
        prop.cat[set.num].catName = true
        prop.data.cat[set.num].catName = set.data.name
        prop.data.cat[set.num].catId = set.data.id
        $('[data-prop="catName"][data-prop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else if ( set.action === 'remove' ) {
        prop.cat[set.num].catName = false
        prop.data.cat[set.num].catName = ''
        prop.data.cat[set.num].catId = ''
        $('[data-prop="catName"][data-prop-num="' + set.num + '"]').css('border', '')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'catValue' ) {
      if ( typeof prop.cat[set.num] === 'undefined' ) {
        // console.log('new')
        prop.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof prop.data.cat[set.num] === 'undefined' ) {
        prop.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( set.action === 'add' ) {
        prop.cat[set.num].catValue = true
        prop.data.cat[set.num].catValue = $('[data-prop="cat-display"][data-prop-num="' + set.num + '"]').val()
        $('[data-prop="catValue-display"][data-prop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'catReason' ) {
      if ( typeof prop.cat[set.num] === 'undefined' ) {
        prop.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof prop.data.cat[set.num] === 'undefined' ) {
        prop.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( $('[data-prop="catReason"][data-prop-num="' + set.num + '"]').val() !== '' ) {
        prop.cat[set.num].catReason = true 
        prop.data.cat[set.num].catReason = $('[data-prop="catReason"][data-prop-num="' + set.num + '"]').val()
        $('[data-prop="catReason"][data-prop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        prop.cat[set.num].catReason = false
        prop.data.cat[set.num].catReason = ''
        $('[data-prop="catReason"][data-prop-num="' + set.num + '"]').css('border', '')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'cat' ) {
      if ( set.action === 'add' ) {
        prop.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof prop.data.cat[set.num] === 'undefined' ) {
        prop.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      else if ( set.action === 'remove' ) {
        prop.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: true }
        prop.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: true }
        evalCats()
        evalAll()
      }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allInfo' && set.action === 'reset' ) {
      resetInfo()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allBids' && set.action === 'reset' ) {
      resetBids()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allCats' && set.action === 'reset' ) {
      resetCats()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'all' && set.action === 'reset' ) {
      resetInfo()
      resetBids()
      resetCats()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'submit' && set.action === 'get' ) {
      return prop.all
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'data' && set.action === 'get' ) {
      let {source, cat, ...data} = prop.data
      let filteredSource = source.filter(src => src.removed !== true && src.item !== '')
      let filteredCat = cat.filter(category => category.removed !== true && category.catName !== '')
      let cleanSource = filteredSource.map(({removed, ...sources}) => sources)
      let cleanCat = filteredCat.map(({removed, ...cats}) => cats)
      data.categories = cleanCat
      data.sources = cleanSource
      return data
    }

    function resetCats() {
      for (let i = 0; i < prop.cat.length; i++) {
        if ( prop.cat[i].removed ) { continue }
        else {
          prop.cat[i] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
          prop.data.cat[i] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
          $('[data-prop="catReason"][data-prop-num="' + i + '"]').css('border', '')
          $('[data-prop="catName"][data-prop-num="' + i + '"]').css('border', '')
          $('[data-prop="catValue-display"][data-prop-num="' + i + '"]').css('border', '')
          $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + i + '"]').css('border', '')
          $('[data-prop="source-eval"][data-prop-num="' + i + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
          evalCat(i)
        }
      }
      evalCats()
      evalAll()
    }

    function resetInfo() {
      prop.title = false
      prop.data.title = ''
      $('[data-prop="title-eval"]').removeClass('fa').removeClass('fa-check-circle')
      $('[data-prop="title"]').css('border', '')
      prop.summary = false
      prop.data.summary = ''
      $('[data-prop="summary-eval"]').removeClass('fa').removeClass('fa-check-circle')
      $('[data-prop="summary"]').css('border', '')
      for (let i = 0; i < prop.source.length; i++) {
        if ( prop.source[i].removed ) { continue }
        else {
          prop.source[i].item = false
          prop.data.source[i].item = ''
          $('[data-prop="source"][data-prop-action="set"][data-prop-num="' + i + '"]').css('border', '')
          $('[data-prop="source-eval"][data-prop-num="' + i + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
        }
      }
      evalInfo()
      evalAll()
    }

    function resetBids() {
      prop.funding = false
      prop.data.funding = 0
      $('[data-prop="funding-eval"]').css('border', '')
      prop.influence = false
      prop.data.influence = 0
      $('[data-prop="influence-eval"]').css('border', '')
      evalBids()
      evalAll()
    }

    function evalSources() {
      for (let i = 0; i < prop.source.length; i++) {
        if ( prop.source[i].removed ) { continue }
        else if ( prop.source[i].item ) { 
          prop.allSources = true
          break
        }
        else { prop.allSources = false }
      }
    }

    function evalInfo() {
      if ( prop.title && prop.summary && prop.allSources ) {
        prop.allInfo = true
        $('[data-prop="info-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else { 
        prop.allInfo = false
        $('[data-prop="info-eval"]').removeClass('fa').removeClass('fa-check-circle')
      }
    }

    function evalCat(num) {
      if (prop.cat[num].catName && prop.cat[num].catValue && prop.cat[num].catReason) {
        prop.cat[num].empty = false
        prop.cat[num].catEval = true
        $('[data-prop="cat-name-eval"][data-prop-num="' + num + '"]').removeClass('fa-times-circle').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else if (!prop.cat[num].catName && !prop.cat[num].catValue && !prop.cat[num].catReason) {
        prop.cat[num].empty = true
        prop.cat[num].catEval = true
        $('[data-prop="cat-name-eval"][data-prop-num="' + num + '"]').removeClass('fa').removeClass('fa-check-circle').removeClass('fa-times-circle').css('color', '')
      }
      else {
        prop.cat[num].empty = false
        prop.cat[num].catEval = false
        $('[data-prop="cat-name-eval"][data-prop-num="' + num + '"]').removeClass('fa-check-circle').addClass('fa').addClass('fa-times-circle').css('color', 'rgb(238, 0, 0)')
      }
    }

    function evalCats() {
      prop.allCats = false
      for (let i = 0; i < prop.cat.length; i++) {
        if ( prop.cat[i].removed ) { continue }
        if ( !prop.cat[i].catEval ) { 
          prop.allCats = false
          $('[data-prop="cats-eval"]').removeClass('fa').removeClass('fa-check-circle')
          break
        }
        if ( prop.cat[i].catEval && !prop.cat[i].empty ) { prop.allCats = true }
      }
      if ( prop.allCats ) {
        $('[data-prop="cats-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else {
        $('[data-prop="cats-eval"]').removeClass('fa').removeClass('fa-check-circle')
      }
    }

    function evalBids() {
      if (prop.funding && prop.influence) {
        prop.allBids = true
        $('[data-prop="bids-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else { 
        prop.allBids = false
        $('[data-prop="bids-eval"]').removeClass('fa').removeClass('fa-check-circle')
      }
    }

    function evalAll() {
      if (prop.allInfo && prop.allBids && prop.allCats) {
        prop.all = true
        $('[data-prop="submit"]').css({'background-color': 'rgb(228, 219, 102)', 'border-color': '', 'pointer-events': '', 'cursor': 'pointer'})
        $('[data-prop="submit"]' + ' > div > span').css({'color': '#000'})
      }
      else { 
        prop.all = false
        $('[data-prop="submit"]').css({'background-color': '', 'border-color': '#999', 'pointer-events': 'none', 'cursor': ''})
        $('[data-prop="submit"]' + ' > div > span').css({'color': '#999'})
      }
    }
  }

  function comments() {
    evalCount('Text')
    let checkVal = 0;
    let commentCheck = document.getElementsByClassName('com-e')
    if (commentCheck || authorOn) {
      if (commentCheck) {
        for (let x = 0; x < commentCheck.length; x++) {
          let comId = commentCheck[x].id
          if ( $('#' + comId).hasClass('fa-times-circle') ) {
            checkVal = -1;
            break;
          }
          if ( $('#' + comId).hasClass('fa-check-circle')) { checkVal = 1 }
        }
      }
      if (checkVal === -1) {
        eval.getComments(false)
        $('#TextStatus').removeClass('fa-check-circle').removeClass('fa-minus-circle').addClass('fa-times-circle').css('color', '#e00') 
      } 
      else if (checkVal === 1) {
        eval.getComments(true)
        $('#TextStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0') 
      }
      else if (authorOn) {
        checkVal = 1;
        $('#TextStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0')
      }
      else {
        eval.getComments(false)
        $('#TextStatus').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', '#999') 
      }
    }
    eval.all()
  }

  function category() {
    evalCount('Cat')
    let checkVal = 0;
    let catCheck = document.getElementsByClassName('cat-eval-btn')
    if (catCheck) {
      for (let x = 0; x < catCheck.length; x++) {
        let num = parseInt(catCheck[x].getAttribute('data-num'))
        if ( $('#CatStatus' + num).hasClass('fa-times-circle') ) {
          checkVal = -1;
          break }
        if ( $('#CatStatus' + num).hasClass('fa-check-circle') ) { checkVal = 1; }
      }
      if (checkVal === -1) {
        eval.getCategories(false)
        $('#CatStatus').removeClass('fa-check-circle').removeClass('fa-minus-circle').addClass('fa-times-circle').css('color', '#e00') } 
      else if (checkVal === 1) {
        eval.getCategories(true)
        $('#CatStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0') } 
      else {
        eval.getCategories(false)
        $('#CatStatus').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', '#999') }
    }
    eval.all()
  }

  function influence() {
    evalCount('Inf')
    let checkVal = 0;
    let catCheck = document.getElementsByClassName('inf-eval-btn')
    if (catCheck) {
      for (let x = 0; x < catCheck.length; x++) {
        let num = parseInt(catCheck[x].getAttribute('data-num'))
        if ( $('#InfStatus' + num).hasClass('fa-times-circle') ) {
          checkVal = -1;
          break }
        if ( $('#InfStatus' + num).hasClass('fa-check-circle') ) {
          checkVal = 1 }
      }
      if (checkVal === -1) {
        eval.getInfluence(false)
        $('#InfStatus').removeClass('fa-check-circle').removeClass('fa-minus-circle').addClass('fa-times-circle').css('color', '#e00') } 
      else if (checkVal === 1) {
        eval.getInfluence(true)
        $('#InfStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0') } 
      else {
        eval.getInfluence(false)
        $('#InfStatus').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', '#999') }
    }
    eval.all()
  }

  function context() {
    if ( $('#ComStatus1').hasClass('fa-check-circle') ) {
      eval.getContext(true)
      $('#ComStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0') } 
    else if ( $('#ComStatus1').hasClass('fa-times-circle') ) {
      eval.getContext(false)
      $('#ComStatus').removeClass('fa-check-circle').removeClass('fa-minus-circle').addClass('fa-times-circle').css('color', '#e00') } 
    else {
      eval.getContext(false)
      $('#ComStatus').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', '#999') }
    eval.all()
  }

  function all() {
    if ( $('#ComStatus').hasClass('fa-times-circle') || $('#InfStatus').hasClass('fa-times-circle') || $('#CatStatus').hasClass('fa-times-circle') || $('#TextStatus').hasClass('fa-times-circle') ) {
      eval.getSubmit(false)
      $('#AllStatus').removeClass('fa-check-circle').removeClass('fa-minus-circle').addClass('fa-times-circle').css('color', '#e00');
      $('#SubmitComment').removeClass('submit-on').addClass('submit-off').css({'background-color': '', 'border-color': '#999'})
      $('.sub-btn').css({'color': '#999'}) } 
    else if ( $('#ComStatus').hasClass('fa-minus-circle') && $('#InfStatus').hasClass('fa-minus-circle') && $('#CatStatus').hasClass('fa-minus-circle') && $('#TextStatus').hasClass('fa-minus-circle')  ) {
      eval.getSubmit(false)
      $('#AllStatus').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', '#999');
      $('#SubmitComment').removeClass('submit-on').addClass('submit-off').css({'background-color': '', 'border-color': '#999'})
      $('.sub-btn').css({'color': '#999'}) } 
    else {
      $('#AllStatus').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css('color', '#0c0');
      if (!sen.getExpanded()) {
        eval.getSubmit(true)
        $('#SubmitComment').removeClass('submit-off').addClass('submit-on').css({'background-color': 'rgb(228, 219, 102)', 'border-color': ''})
        $('.sub-btn').css({'color': '#000'}) }
      }
  }
  function getComments(set) {
    if ( typeof set === 'undefined' ) { return commentEval } 
    else { commentEval = set }
  }
  function getCategories(set) {
    if ( typeof set === 'undefined' ) { return categoryEval } 
    else { categoryEval = set }
  }
  function getInfluence(set) {
    if ( typeof set === 'undefined' ) { return influenceEval } 
    else { influenceEval = set }
  }
  function getContext(set) {
    if ( typeof set === 'undefined' ) { return contextEval } 
    else { contextEval = set }
  }
  function getSubmit(set) {
    if ( typeof set === 'undefined' ) { return submitEval } 
    else { submitEval = set }
  }

  return {
    proposal, comments, category, influence, context, all, getComments, getCategories, getInfluence, getContext, getSubmit
  }
})()

const cat = ( () => {
  let storage = []
  let menu = ''
  let catStore
  let parentStore
  let searchbar = false
  let parentToggle = false
  let sent = false
  let childToggle = false
  let categorySchema = { 'top': [], 'search': [] }

  function catMenu(set, reset) {
    if ( typeof reset !== 'undefined' ) { menu = '' }
    if ( typeof set === 'undefined' ) { return menu } 
    else { menu = set }
  }

  function storeParent(set, reset) {
    if ( typeof reset !== 'undefined' ) { parentStore = [] }
    if ( typeof set === 'undefined' ) { return parentStore } 
    else { parentStore = set }
  }

  function sentCat(set) {
    if ( typeof set === 'undefined' ) { return sent } 
    else { sent = set }
  }

  function storeChild(set, reset) {
    if ( typeof reset !== 'undefined' ) { catStore = [] }
    if ( typeof set === 'undefined' ) { return catStore } 
    else { catStore = set }
  }

  function storeData(set, reset) {
    if ( typeof reset !== 'undefined' ) { storage = [] }
    if ( typeof set === 'undefined' ) { return storage }
    else { storage = set }
  }

  function childParentToggle(type, set) {
    if ( type == 'mark' ) {
      if ( typeof set === 'undefined' ) { return parentToggle } 
      else { parentToggle = set }
    }
    else if ( type == 'add' ) {
      if ( typeof set === 'undefined' ) { return childToggle } 
      else { childToggle = set }
    }
  }
  
  function catSearchToggle(set) {
    if ( typeof set === 'undefined' ) { return searchbar } 
    else { searchbar = set }
  }

  function catSearchToggle(set) {
    if ( typeof set === 'undefined' ) { return searchbar } 
    else { searchbar = set }
  }

  function catData(type, data, reset) {
    if ( typeof reset !== 'undefined' ) {
      categorySchema.top = []
      categorySchema.search = []
    }
    else if ( typeof type === 'undefined' ) { return categorySchema }
    else if ( type == 'top' && typeof data === 'undefined' ) { return categorySchema.top }
    else if ( type == 'top' && typeof data !== 'undefined') { 
      if ( data == '' ) { categorySchema.top = [] }
      else { categorySchema.top = data }
    }
    else if ( type == 'search' && typeof data === 'undefined' ) { return categorySchema.search }
    else if ( type == 'search' && typeof data !== 'undefined') { 
      if ( data == '' ) { categorySchema.search = [] }
      else { categorySchema.search = data }
    }
  }

  return {
    childParentToggle, catMenu, storeParent, sentCat, storeChild, storeData, catSearchToggle, catData
  }
})()

const sen = ( () => {
  let content;
  let review = false;
  let expanded = false;
  let links = false;
  let link = []
  let response = []
  let send = []
  let reply = []
  let count = 0
  let subCounter = []
  let data = []
  let catRanks = false;
  let modify = false;
  let rank = []
  let subs = []
  let allRanks = false;
  let rankFields = false;
  let prev = {}

  function modifyToggle(set) {
    if ( typeof set === 'undefined' ) { return modify } 
    else { modify = set }
  }

  function catToggle(set) {
    if ( typeof set === 'undefined' ) { return catRanks } 
    else { catRanks = set }
  }

  function commentCount(set, reset) {
    if (typeof reset !== 'undefined') { count = 0 }
    else {
      if ( typeof set === 'undefined' ) { return count } 
      else { count = set }
    }
  }

  function rankToggle(set) {
    if ( typeof set === 'undefined' ) { return rankFields } 
    else { rankFields = set }
  }

  function openedRankToggle(set) {
    if ( typeof set === 'undefined' ) { return allRanks } 
    else { allRanks = set }
  }

  function previous(child, type, parent, menu) {
    if ( typeof child !== 'undefined' ) { prev = {child, type, parent, menu} }
    else { return prev }
  }

  function subsDropdown(child, type, parent, set) {
    if ( typeof set.reset !== 'undefined' && set.reset === 'all' ) {
      subs = [] }
    else if ( typeof set.reset !== 'undefined' ) {
      subs[set.reset] = [] }
    else {
      if ( typeof subs[type] === 'undefined' ) {
        subs[type] = []
        if (typeof subs[type][child] === 'undefined') {
          subs[type][child] = []
          if (typeof subs[type][child][parent] === 'undefined') {
            subs[type][child][parent] = { toggle: false, data: [], menu: 'none', subs: false }
          }
        }
      }
      else if (typeof subs[type][child] === 'undefined') {
        subs[type][child] = []
        if (typeof subs[type][child][parent] === 'undefined') {
          subs[type][child][parent] = { toggle: false, data: [], menu: 'none', subs: false }
        }
      }
      else if (typeof subs[type][child][parent] === 'undefined') {
        subs[type][child][parent] = { toggle: false, data: [], menu: 'none', subs: false }
      }

      if ( typeof set.get !== 'undefined' && set.get === 'toggle' ) {
        return subs[type][child][parent].toggle }
      else if ( typeof set.get !== 'undefined' && set.get === 'data' ) {
        return subs[type][child][parent].data }
      else if ( typeof set.get !== 'undefined' && set.get === 'menu' ) {
        return subs[type][child][parent].menu }
      else if ( typeof set.get !== 'undefined' && set.get === 'subs' ) {
        return subs[type][child][parent].subs }
      else if ( typeof set.toggle !== 'undefined' && set.toggle !== 'undefined' ) {
        subs[type][child][parent].toggle = set.toggle }
      else if ( typeof set.data !== 'undefined' && set.data !== 'undefined' ) {
        subs[type][child][parent].data = set.data }
      else if ( typeof set.menu !== 'undefined' && set.menu !== 'undefined' ) {
        subs[type][child][parent].menu = set.menu }
      else if ( typeof set.subs !== 'undefined' && set.subs !== 'undefined' ) {
        subs[type][child][parent].subs = set.subs }
    }
  }

  function counter(type, reset) {
    if (typeof reset !== 'undefined') { subCounter[type] = 0 }
    else if ( typeof subCounter[type] === 'undefined' ) {
      subCounter[type] = 0 }
    subCounter[type]++
    return subCounter[type]
  }

  function openedRank(num, type, set, reset) {
    if (typeof reset !== 'undefined') {
      if ( type !== '' ) { rank[type] = [] }
      else { rank = [] }
    }
    else {
      if ( typeof set === 'undefined' ) {
        if ( typeof rank[type] === 'undefined' ) {
          rank[type] = []
          if (typeof rank[type][num] === 'undefined') {
            rank[type][num] = false }
        }
        else {
          if (typeof rank[type][num] === 'undefined') {
            rank[type][num] = false }
        }
        return rank[type][num] 
      } 
      else { 
        if ( typeof rank[type] === 'undefined' ) {
          rank[type] = []
          if (typeof rank[type][num] === 'undefined') {
            rank[type][num] = set }
        }
        else {
          if (typeof rank[type][num] === 'undefined') { rank[type][num] = set }
          else { rank[type][num] = set }
        }
      }
    }
  }

  function responseData(num, set, reset) {
    if (typeof reset !== 'undefined') { data = [] }
    else {
      if ( typeof set === 'undefined' ) {
        if (typeof data[num] === 'undefined') { data[num] = false }
        return data[num] 
      } 
      else { data[num] = set }
    }
  }

  function allRepliesToggle(num, set, reset) {
    if (typeof reset !== 'undefined') { reply = [] }
    else {
      if ( typeof set === 'undefined' ) {
        if (typeof reply[num] === 'undefined') { reply[num] = false }
        return reply[num] 
      } 
      else { reply[num] = set }
    }
  }

  function replyToggle(num, set, reset) {
    if (typeof reset !== 'undefined') { response = [] }
    else {
      if ( typeof set === 'undefined' ) {
        if (typeof response[num] === 'undefined') { response[num] = false }
        return response[num] 
      } 
      else { response[num] = set }
    }
  }
  
  function sendToggle(num, set, reset) {
    if (typeof reset !== 'undefined') { send = [] }
    else {
      if ( typeof set === 'undefined' ) {
        if (typeof send[num] === 'undefined') { send[num] = false }
        return send[num] 
      } 
      else { send[num] = set }
    }
  }

  function linkToggle(num, set, reset) {
    if (typeof reset !== 'undefined') { link = [] }
    else {
      if ( typeof set === 'undefined' ) {
        if (typeof link[num] === 'undefined') { link[num] = false }
        return link[num] 
      } 
      else { link[num] = set }
    }
  }

  function linksToggle(set) {
    if ( typeof set === 'undefined' ) { return links } 
    else { links = set }
  }

  function getExpanded(set) {
    if ( typeof set === 'undefined' ) { return expanded } 
    else { expanded = set }
  }

  function reviewState(set) {
    if ( typeof set === 'undefined' ) { return review } 
    else { review = set }
  }

  function totalScore() {
    let maxId = sen.nextID()
    let totalIS = 0;
    let totalCS = 0;
    for (let i = 1; i < maxId; i++) {
      if ( $('#rw' + i).attr('data-is') && $('#rw' + i).attr('data-cs') ) {
        totalIS += parseFloat( $('#rw' + i).attr('data-is') ) }
    }
    for (let i = 1; i < maxId; i++) {
      if ( $('#rw' + i).attr('data-is') && $('#rw' + i).attr('data-cs') ) {
        let tempCS = ( parseFloat( $('#rw' + i).attr('data-is') ) * parseFloat( $('#rw' + i).attr('data-cs') ) ) / totalIS
        totalCS += tempCS }
    }
    let total = $('#CSBox')
    totalCS = totalCS.toFixed(2)
    if ( totalCS > 0 ) { $('#TotalCS').text('+' + totalCS) } 
    else { $('#TotalCS').text(totalCS) }
    setColor(totalCS, 10, [total])
  }

  function nextID() {
    let i = 1;
    let spanID = document.getElementById('rw' + i);
    while (spanID) {
      i++;
      spanID = document.getElementById('rw' + i);
    }
    return i;
  }

  function currentSentence(set) {
    if ( typeof set === 'undefined' ) { return content } 
    else { content = set }
  }

  return {
    previous, subsDropdown, counter, rankToggle, openedRankToggle, openedRank, modifyToggle, catToggle, responseData, commentCount, allRepliesToggle, replyToggle, sendToggle, linkToggle, linksToggle, getExpanded, reviewState, totalScore, nextID, currentSentence
  }
})()

const nav = ( () => {
  let currentPage = 'none';
  let targetPage = 'none';
  let loginStatus = false;
  let postSub = '#PostSummary'
  let homeSub = '#NavProfile'
  let createSub = '#NavNewPost'
  let searchStatus = false
  let searchTarget = 'Post'
  let searchX = false
  
  function getSearchTarget(set) {
    if ( typeof set === 'undefined' ) { return searchTarget } 
    else { searchTarget = set }
  }
  function getSearch(set) {
    if ( typeof set === 'undefined' ) { return searchStatus } 
    else { searchStatus = set }
  }
  function getSearchX(set) {
    if ( typeof set === 'undefined' ) { return searchX } 
    else { searchX = set }
  }
  function setLogin(set) { loginStatus = set }
  function setCurrent(set) { currentPage = set }
  function setTarget(set) { targetPage = set }
  function getLogin() { return loginStatus }
  function getCurrent() { return currentPage }
  function getTarget() { return targetPage }
  function getId() {
    let getId = document.getElementsByClassName('show-menu')[0].id;
    if (getId) { return '#' + getId } 
    else { return '' }
  }
  function setHomeSub(set) { homeSub = set }
  function getHomeSub() { return homeSub }
  function setCreateSub(set) { createSub = set }
  function getCreateSub() { return createSub }
  function setPostSub(set) { postSub = set }
  function getPostSub() { return postSub }
  function targetRouter() {
    if ( targetPage === 'home' ) { return '#NavHomeMenu' } 
    else if ( targetPage === 'create' ) { return '#NavCreateMenu' } 
    else if ( targetPage === 'post' ) { return '#NavPostMenu' } 
    else if ( targetPage === 'categories' ) { return '#NavSearchMenu' } 
    else { return '' }
  }
  function currentRouter() {
    if ( currentPage === 'home' ) { return '#NavHomeMenu' } 
    else if ( currentPage === 'create' ) { return '#NavCreateMenu' } 
    else if ( currentPage === 'post' ) { return '#NavPostMenu' } 
    else if ( currentPage === 'categories' ) { return '#NavSearchMenu' } 
    else if ( currentPage === 'login' ) { return '#NavLoginMenu' } 
    else { return '' }
  }
  function getSpantip() { return spantipOn }
  function setSpantip(set) { spantipOn = set }
  function getHighlight() { return highligher }
  function setHighlight(set) { highligher = set }

  return {
    getSearchTarget, getSearch, getSearchX, setLogin, setCurrent, setTarget, setPostSub, setHomeSub, getLogin, getCurrent, getTarget, getId, getPostSub, getHomeSub, targetRouter, currentRouter, getSpantip, setSpantip, getHighlight, setHighlight, getCreateSub, setCreateSub
  }
})()

const prop = ( () => {
  let data = []
  let control = { expand: false, prop: null, open: null, sources: false, categories: false, funding: false, influence: false, allBids: false, allCats: false, allInfo: false, emptyCats: true, allSources: false, source: [{item: false, removed: false}], cat: [{ catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }], data: { propId: '', authorId: '', funding: 0, influence: 0, source: [{item: '', removed: false}], cat: [{ catName: '', catId: '', catReason: '', catValue: 0, removed: false }] } }

  function storeData(set, reset) {
    if ( typeof reset !== 'undefined' ) { data = [] }
    if ( typeof set === 'undefined' ) { return data }
    else if ( typeof set.target !== 'undefined' && set.target === 'bid' ) {
      data[set.num].bids = set.data }
    else if ( typeof set.target !== 'undefined' && set.target === 'comments' ) {
      data[set.num] = set.data }
    else { data = set }
  }

  function controller(set) {
    if (typeof set.get !== 'undefined' && set.get === 'open') {
      return control.open
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'cat' && set.action === 'add' ) {
      if ( $('[data-sprop="cat-box"]').length < 4) {
        let count = sen.counter('sprop-cat')
        control.cat[count] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
        control.data.cat[count] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
        addSPropCat(count)
      }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'cat' && set.action === 'remove' ) {
      $('[data-sprop-num="' + set.num + '"][data-sprop="cat-box"]').remove()
      control.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: true }
      control.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: true }
      evalCats()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'source') {
      if (set.action === 'add') {
        if ( $('[data-sprop="source"][data-sprop-action="set"]').length < 4) {
          let count = sen.counter('sprop-source')
          if ( typeof control.source[count] === 'undefined' ) {
            control.source[count] = { item: false, removed: false } }
          if ( typeof control.data.source[count] === 'undefined' ) {
            control.data.source[count] = { item: '', removed: false } }
          control.source[count].item = false
          control.source[count].removed = false
          control.data.source[count].item = ''
          control.data.source[count].removed = false
          addSPropSource(count)
        }
      }
      else {
        if ( typeof control.source[set.num] === 'undefined' ) {
          control.source[set.num] = { item: false, removed: false } }
        if ( typeof control.data.source[set.num] === 'undefined' ) {
          control.data.source[set.num] = { item: '', removed: false } }
        if ( set.action === 'remove' ) {
          control.source[set.num].item = false
          control.source[set.num].removed = true
          control.data.source[set.num].item = ''
          control.data.source[set.num].removed = true
          $('[data-sprop-num="' + set.num + '"][data-sprop="source-box"]').remove()
        }
        else if ( set.action === 'set' ) {
          if ( $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + set.num + '"]').val() === '' ) {
            control.source[set.num].item = false
            control.source[set.num].removed = false
            control.data.source[set.num].item = ''
            control.data.source[set.num].removed = false
            $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + set.num + '"]').css('border', '')
            $('[data-sprop="source-eval"][data-sprop-num="' + set.num + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
          }
          else {
            control.source[set.num].item = true
            control.source[set.num].removed = false
            control.data.source[set.num].item = $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + set.num + '"]').val()
            control.data.source[set.num].removed = false
            $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
            $('[data-sprop="source-eval"][data-sprop-num="' + set.num + '"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
          }
        }
      }
      evalSources()
      evalInfo()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'summary' ) {
      if ( $('[data-sprop="summary"]').val() !== '' ) {
        control.summary = true
        control.data.summary = $('[data-sprop="summary"]').val()
        $('[data-sprop="summary-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
        $('[data-sprop="summary"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        control.summary = false
        control.data.summary = ''
        $('[data-sprop="summary-eval"]').removeClass('fa').removeClass('fa-check-circle')
        $('[data-sprop="summary"]').css('border', '')
      }
      evalInfo()
      evalAll()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'funding' ) {
      let propData = prop.storeData()
      if ( $('[data-sprop="funding"]').val() !== '' && !isNaN( $('[data-sprop="funding"]').val() ) && parseFloat($('[data-sprop="funding"]').val()) <= propData[set.num].authorData.funding && parseFloat($('[data-sprop="funding"]').val()) > 0 ) {
        control.funding = true
        control.data.funding = $('[data-sprop="funding"]').val()
        $('[data-sprop="funding-eval"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else if ( $('[data-sprop="funding"]').val() === '' ) {
        control.funding = false
        control.data.funding = 0
        $('[data-sprop="funding-eval"]').css('border', '')
      }
      else { 
        control.funding = false
        control.data.funding = 0
        $('[data-sprop="funding-eval"]').css('border', '0.5px solid rgb(238, 0, 0)')
      }
      evalBids()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'influence' ) {
      if ( $('[data-sprop="influence-display"]').val() !== '---' ) {
        control.influence = true
        control.data.influence = $('[data-sprop="influence"]').val()
        $('[data-sprop="influence-eval"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        control.influence = false
        control.data.influence = 0
        $('[data-sprop="influence-eval"]').css('border', '')
      }
      evalBids()
    }
    else if (typeof set.target !== 'undefined' && set.target === 'categories') {
      if (!control.categories) {
        control.categories = true
        let propData = prop.storeData()
        propCategories(set.num, propData[set.num].authorData.category)
      }
      else {
        control.categories = false
        $('[data-sprop="categories"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
        $('[data-sprop="categories-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
        $('.com-cats' + set.num).remove()
      }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'catValue' ) {
      if ( typeof control.cat[set.num] === 'undefined' ) {
        control.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof control.data.cat[set.num] === 'undefined' ) {
        control.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( set.action === 'add' ) {
        control.cat[set.num].catValue = true
        control.data.cat[set.num].catValue = $('[data-sprop="cat-display"][data-sprop-num="' + set.num + '"]').val()
        $('[data-sprop="catValue-display"][data-sprop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if (typeof set.target !== 'undefined' && set.target === 'catReason') {
      if ( typeof control.cat[set.num] === 'undefined' ) {
        control.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false } 
      }
      if ( typeof control.data.cat[set.num] === 'undefined' ) {
        control.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( $('[data-sprop="catReason"][data-sprop-num="' + set.num + '"]').val() !== '' ) {
        control.cat[set.num].catReason = true 
        control.data.cat[set.num].catReason = $('[data-sprop="catReason"][data-sprop-num="' + set.num + '"]').val()
        $('[data-sprop="catReason"][data-sprop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else { 
        control.cat[set.num].catReason = false
        control.data.cat[set.num].catReason = ''
        $('[data-sprop="catReason"][data-prop-num="' + set.num + '"]').css('border', '')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if (typeof set.target !== 'undefined' && set.target === 'submit') {
      // console.log(control.data)
      if (control.allBids) {
        const bidData = control.data
        const sendBid = {propId: bidData.propId, funding: bidData.funding, influence: bidData.influence}
        // console.log(sendBid)
        chrome.runtime.sendMessage( { 'message': 'Send Prop Bid', 'data': { 'proposalData': sendBid, 'position': control.prop } } );
        $('[data-sprop="submit"]').css({'pointer-events': 'none', 'cursor': ''})
      }
      else if (control.all) {
        const replyData = control.data
        // console.log(control.prop)
        let {source, cat, funding, influence, ...data} = control.data
        let filteredSource = source.filter(src => src.removed !== true && src.item !== '')
        let filteredCat = cat.filter(category => category.removed !== true && category.catName !== '')
        let cleanSource = filteredSource.map(({removed, ...sources}) => sources)
        let cleanCat = filteredCat.map(({removed, ...cats}) => cats)
        data.categories = cleanCat
        data.sources = cleanSource
        // console.log(data)
        chrome.runtime.sendMessage( { 'message': 'Send Prop Reply', 'data': { 'proposalData': data, 'position': control.prop } } );
      }
    }
    else if (typeof set.target !== 'undefined' && set.target === 'sources') {
      if (!control.sources) {
        control.sources = true
        let propData = prop.storeData()
        propSources(set.num, propData[set.num].authorData.sources)
      }
      else {
        control.sources = false
        $('[data-sprop="sources"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
        $('[data-sprop="sources-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
        $('.com-link' + set.num).remove()
      }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'catName' ) {
      if ( typeof control.cat[set.num] === 'undefined' ) {
        control.cat[set.num] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
      }
      if ( typeof control.data.cat[set.num] === 'undefined' ) {
        control.data.cat[set.num] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
      }
      if ( set.action === 'add' ) {
        control.cat[set.num].catName = true
        control.data.cat[set.num].catName = set.data.name
        control.data.cat[set.num].catId = set.data.id
        $('[data-sprop="catName"][data-sprop-num="' + set.num + '"]').css('border', '0.5px solid rgb(0, 204, 0)')
      }
      else if ( set.action === 'remove' ) {
        control.cat[set.num].catName = false
        control.data.cat[set.num].catName = ''
        control.data.cat[set.num].catId = ''
        $('[data-sprop="catName"][data-sprop-num="' + set.num + '"]').css('border', '')
      }
      evalCat(set.num)
      evalCats()
      evalAll()
    }
    else if (typeof set.target !== 'undefined' && (set.target === 'review' || set.target === 'bid' || set.target === 'bids' || set.target === 'replies') ) {
      if (control.prop === set.num) { openControl(control.open, set.target) }
      else { 
        openSProp() 
        setTimeout( () => { openControl(control.open, set.target) }, 750);
      }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'control' && set.action === 'reset' ) {
      control = { expand: false, prop: null, open: null, sources: false, categories: false, funding: false, influence: false, allBids: false, allCats: false, allInfo: false, emptyCats: true, allSources: false, source: [{item: false, removed: false}], cat: [{ catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }], data: { propId: '', authorId: '', funding: 0, influence: 0, source: [{item: '', removed: false}], cat: [{ catName: '', catId: '', catReason: '', catValue: 0, removed: false }] } }
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allInfo' && set.action === 'reset' ) {
      resetInfo()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allBids' && set.action === 'reset' ) {
      resetBids()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'allCats' && set.action === 'reset' ) {
      resetCats()
    }
    else if ( typeof set.target !== 'undefined' && set.target === 'all' && set.action === 'reset' ) {
      resetInfo()
      resetBids()
      resetCats()
    }
    else if (typeof set.target !== 'undefined' && set.target === 'more') {
      if (typeof set.num === 'undefined' || control.prop === set.num) { 
        $('[data-sprop="bid-corner-btn"][data-sprop-num="' + control.prop + '"]').css('color', '#000')
        $('[data-sprop="bid-bar-btn"][data-sprop-num="' + control.prop + '"]').css('color', '#000')
        $('[data-sprop="bid"][data-sprop-num="' + control.prop + '"]').css('background-color', '#e4db66')
        $('[data-sprop="review-corner-btn"][data-sprop-num="' + control.prop + '"]').css('color', '#000')
        $('[data-sprop="review-bar-btn"][data-sprop-num="' + control.prop + '"]').css('color', '#000')
        $('[data-sprop="review"][data-sprop-num="' + control.prop + '"]').css('background-color', '#e4db66')
        $('.com-reply' + control.prop).remove()
        control.open = null
        closeSProp()
      }
      else { openSProp() }
    }

    function openControl(previous, current) {
      if (previous === current) {
        control.open = null
        if (current === 'review' || current === 'bid') {
          $('[data-sprop="' + current + '-corner-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
          $('[data-sprop="' + current + '-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
          $('[data-sprop="' + current + '"][data-sprop-num="' + set.num + '"]').css('background-color', '#e4db66')
          $('.com-reply' + set.num).remove()
          anime({
            targets: ['[data-snav="submit"]', '[data-snav="reset"]'],
            direction: 'normal',
            duration: 200,
            delay: 0,
            opacity: 0,
            easing: 'easeOutQuart' 
          });
          setTimeout( () => {
            $('[data-snav="submit"], [data-snav="reset"]').addClass('hide-field')
          }, 210);
          resetInfo()
          resetBids()
          resetCats()
        }
        else if (current === 'bids' || current === 'replies') {
          $('[data-sprop="' + current + '"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
          $('[data-sprop="' + current + '"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#000')
          $('.com-reply' + set.num).remove()
        }
      }
      else if (previous === null) {
        control.open = current
        let propData = prop.storeData()
        if (current === 'bid') { propBid(set.num, propData[set.num]) }
        else if (current === 'review') { propReply(set.num, propData[set.num]) }
        else if (current === 'bids') { 
          $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]').css('background-color', '#eee')
          $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#900')
          allPropBids(set.num, propData[set.num].bids) 
        }
        else if (current === 'replies') { 
          $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]').css('background-color', '#eee')
          $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#900')
          allPropReplies(set.num, propData[set.num].comments) 
        }
      }
      else {
        control.open = current
        if (previous === 'bid' || previous === 'review') {
          $('[data-sprop="' + previous + '-corner-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
          $('[data-sprop="' + previous + '-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
          $('[data-sprop="' + previous + '"][data-sprop-num="' + set.num + '"]').css('background-color', '#e4db66')
          $('.com-reply' + set.num).remove()
          if (current !== 'bid' && current !== 'review') {
            anime({
              targets: ['[data-snav="submit"]', '[data-snav="reset"]'],
              direction: 'normal',
              duration: 200,
              delay: 0,
              opacity: 0,
              easing: 'easeOutQuart' 
            });
            setTimeout( () => {
              $('[data-snav="submit"], [data-snav="reset"]').addClass('hide-field')
            }, 210);
          }
          resetInfo()
          resetBids()
          resetCats()
        }
        else if (previous === 'bids' || previous === 'replies') {
          $('[data-sprop="' + previous + '"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
          $('[data-sprop="' + previous + '"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#000')
          $('.com-reply' + set.num).remove()
        }
        let propData = prop.storeData()
        if (current === 'bid') { propBid(set.num, propData[set.num]) }
        else if (current === 'review') { propReply(set.num, propData[set.num]) }
        else if (current === 'bids') { 
          $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]').css('background-color', '#eee')
          $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#900')
          allPropBids(set.num, propData[set.num].bids) 
        }
        else if (current === 'replies') { 
          $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]').css('background-color', '#eee')
          $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#900')
          allPropReplies(set.num, propData[set.num].comments) 
        }
      }
    }

    function resetBids() {
      let propData = prop.storeData()
      // console.log(propData)
      control.funding = false
      control.influence = false
      control.allBids = false
      control.data.funding = 0
      control.data.influence = 0
      $('[data-sprop="bids-eval"]').removeClass('fa').removeClass('fa-check-circle')
      $('[data-sprop="submit"]').css({'background-color': '', 'border-color': '#999', 'pointer-events': 'none'})
      $('[data-sprop="submit"]' + ' > div > span').css({'color': '#999'})
      $('[data-sprop="influence-eval"]').css('border', '')
      $('[data-sprop="funding-eval"]').css('border', '')
      $('[data-sprop="funding"]').val('')
      $('[data-sprop="influence-display"]').val('---')
      $('[data-sprop="influence"]').val(0.1)
      if ( control.prop !== null ) {
        $('[data-sprop="hidden-text"]').text(propData[control.prop].authorData.funding)}
      let boxWidth = $('[data-sprop="hidden-display"]').width() + 5
      $('[data-sprop="funding"]').css('width', boxWidth + 'px')
    }

    function resetInfo() {
      $('[data-sprop="summary"]').val('')
      $('[data-sprop="source"]').val('')
      $('[data-sprop="title-eval"]').removeClass('fa').removeClass('fa-check-circle')
      $('[data-sprop="title"]').css('border', '')
      control.summary = false
      control.data.summary = ''
      $('[data-sprop="summary-eval"]').removeClass('fa').removeClass('fa-check-circle')
      $('[data-sprop="summary"]').css('border', '')
      for (let i = 0; i < control.source.length; i++) {
        if ( control.source[i].removed ) { continue }
        else {
          control.source[i].item = false
          control.data.source[i].item = ''
          $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + i + '"]').css('border', '')
          $('[data-sprop="source-eval"][data-sprop-num="' + i + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
        }
      }
      evalInfo()
      evalAll()
    }

    function resetCats() {
      $('[data-sprop="cat-display"]').val('1.0')
      $('[data-sprop="catName"]').val('')
      $('[data-sprop="catReason"]').val('')
      $('[data-sprop="catValue"]').val(1.0)
      for (let i = 0; i < control.cat.length; i++) {
        if ( control.cat[i].removed ) { continue }
        else {
          control.cat[i] = { catName: false, catReason: false, catValue: false, empty: true, catEval: true, removed: false }
          control.data.cat[i] = { catName: '', catId: '', catReason: '', catValue: 0, removed: false }
          $('[data-sprop="catReason"][data-sprop-num="' + i + '"]').css('border', '')
          $('[data-sprop="catName"][data-sprop-num="' + i + '"]').css('border', '')
          $('[data-sprop="catValue-display"][data-sprop-num="' + i + '"]').css('border', '')
          $('[data-sprop="source"][data-sprop-action="set"][data-sprop-num="' + i + '"]').css('border', '')
          $('[data-sprop="source-eval"][data-sprop-num="' + i + '"]').removeClass('fa').removeClass('fa-check-circle').css('color', '')
          evalCat(i)
        }
      }
      evalCats()
      evalAll()
    }

    function evalBids() {
      if (control.funding && control.influence) {
        control.allBids = true
        $('[data-sprop="bids-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
        $('[data-sprop="submit"]').css({'background-color': 'rgb(228, 219, 102)', 'border-color': '', 'pointer-events': ''})
        $('[data-sprop="submit"]' + ' > div > span').css({'color': '#000'})
      }
      else { 
        control.allBids = false
        $('[data-sprop="bids-eval"]').removeClass('fa').removeClass('fa-check-circle')
        $('[data-sprop="submit"]').css({'background-color': '', 'border-color': '#999', 'pointer-events': 'none'})
        $('[data-sprop="submit"]' + ' > div > span').css({'color': '#999'})
      }
    }

    function evalCat(num) {
      if (control.cat[num].catName && control.cat[num].catValue && control.cat[num].catReason) {
        control.cat[num].empty = false
        control.cat[num].catEval = true
        $('[data-sprop="cat-name-eval"][data-sprop-num="' + num + '"]').removeClass('fa-times-circle').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else if (!control.cat[num].catName && !control.cat[num].catValue && !control.cat[num].catReason) {
        control.cat[num].empty = true
        control.cat[num].catEval = true
        $('[data-sprop="cat-name-eval"][data-sprop-num="' + num + '"]').removeClass('fa').removeClass('fa-check-circle').removeClass('fa-times-circle').css('color', '')
      }
      else {
        control.cat[num].empty = false
        control.cat[num].catEval = false
        $('[data-sprop="cat-name-eval"][data-sprop-num="' + num + '"]').removeClass('fa-check-circle').addClass('fa').addClass('fa-times-circle').css('color', 'rgb(238, 0, 0)')
      }
    }

    function evalCats() {
      control.allCats = false
      control.emptyCats = true
      for (let i = 0; i < control.cat.length; i++) {
        if ( control.cat[i].removed ) { continue }
        if ( !control.cat[i].empty ) {
          control.emptyCats = false
          break
        }
      }
      for (let i = 0; i < control.cat.length; i++) {
        if ( control.cat[i].removed ) { continue }
        if ( !control.cat[i].catEval ) { 
          control.allCats = false
          $('[data-sprop="cats-eval"]').removeClass('fa').removeClass('fa-check-circle')
          break
        }
        if ( control.cat[i].catEval && !control.cat[i].empty ) { control.allCats = true }
      }
      if ( control.allCats ) {
        $('[data-sprop="cats-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else {
        $('[data-sprop="cats-eval"]').removeClass('fa').removeClass('fa-check-circle')
      }
    }

    function evalInfo() {
      if ( control.summary && control.allSources ) {
        control.allInfo = true
        $('[data-sprop="info-eval"]').addClass('fa').addClass('fa-check-circle').css('color', 'rgb(0, 204, 0)')
      }
      else { 
        control.allInfo = false
        $('[data-sprop="info-eval"]').removeClass('fa').removeClass('fa-check-circle')
      }
    }

    function evalSources() {
      for (let i = 0; i < control.source.length; i++) {
        if ( control.source[i].removed ) { continue }
        else if ( control.source[i].item ) { 
          control.allSources = true
          break
        }
        else { control.allSources = false }
      }
    }

    function evalAll() {
      if (control.allInfo && (control.allCats || control.emptyCats) ) {
        control.all = true
        $('[data-sprop="submit"]').css({'background-color': 'rgb(228, 219, 102)', 'border-color': '', 'pointer-events': ''})
        $('[data-sprop="submit"]' + ' > div > span').css({'color': '#000'})
      }
      else { 
        control.all = false
        $('[data-sprop="bids-eval"]').removeClass('fa').removeClass('fa-check-circle')
        $('[data-sprop="submit"]').css({'background-color': '', 'border-color': '#999', 'pointer-events': 'none'})
        $('[data-sprop="submit"]' + ' > div > span').css({'color': '#999'})
      }
    }

    function closeSProp() {
      resetInfo()
      resetBids()
      resetCats()
      $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
      $('[data-sprop="replies"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#000')
      $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
      $('[data-sprop="bids"][data-sprop-num="' + set.num + '"]' + ' > div > span').css('color', '#000')
      $('.com-reply' + set.num).remove()
      if (control.sources) {
        control.sources = false
        $('[data-sprop="sources"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
        $('[data-sprop="sources-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
        $('.com-link' + set.num).remove()
      }
      if (control.categories) {
        control.categories = false
        $('[data-sprop="categories"][data-sprop-num="' + set.num + '"]').css('background-color', '#ddd')
        $('[data-sprop="categories-bar-btn"][data-sprop-num="' + set.num + '"]').css('color', '#000')
        $('.com-cats' + set.num).remove()
      }
      if (control.expand) { control.expand = false }
      control.prop = null
      $('[data-sprop="more-corner-btn"][data-sprop-num="' + set.num + '"]').removeClass('fa-times').addClass('fa-expand')
      anime({
        targets: ['[data-snav="submit"]', '[data-snav="reset"]', '[data-snav="back"]'],
        direction: 'normal',
        duration: 200,
        delay: 0,
        opacity: 0,
        easing: 'easeOutQuart' 
      });
      anime({
        targets: ['[data-sprop="user-data"][data-sprop-num="' + set.num + '"]', '[data-sprop="bar"][data-sprop-num="' + set.num + '"]'],
        direction: 'normal',
        duration: 200,
        height: 0,
        width: 0,
        delay: 0,
        opacity: [1, 0],
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop="main-top"][data-sprop-num="' + set.num + '"]',
        direction: 'normal',
        duration: 200,
        delay: 0,
        borderRadius: '0 5px 5px 5px',
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop="title-bar"][data-sprop-num="' + set.num + '"]',
        direction: 'normal',
        duration: 200,
        delay: 0,
        borderRadius: '0px 8px 0 0',
        easing: 'easeOutQuart' 
      });
      setTimeout( () => {
        $('[data-snav="sort"], [data-snav="filter"]').removeClass('hide-field')
        $('[data-snav="submit"], [data-snav="reset"], [data-snav="back"]').addClass('hide-field')
        $('[data-sprop="user-data"][data-sprop-num="' + set.num + '"]').addClass('hide-field')
        $('[data-sprop="bar"][data-sprop-num="' + set.num + '"]').addClass('hide-field')
        $('[data-sprop="sidebar"][data-sprop-num="' + set.num + '"]').removeClass('hide-field')
        $('[data-sprop-select="off"]').removeClass('hide-field')
        $('[data-sprop-select="on"]').removeClass('hide-field')
        anime({
          targets: ['[data-snav="sort"]', '[data-snav="filter"]'],
          direction: 'normal',
          duration: 200,
          delay: 0,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
        anime({
          targets: '[data-sprop="sidebar"][data-sprop-num="' + set.num + '"]',
          direction: 'normal',
          duration: 200,
          width: '70px',
          delay: 0,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
        anime({
          targets: '[data-sprop-select="off"]',
          direction: 'normal',
          duration: 200,
          width: '100%',
          maxHeight: '110px',
          delay: 250,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
      }, 210);
      setTimeout( () => {
        $('[data-sprop="main-box"][data-sprop-num="' + set.num + '"]').attr('data-sprop-select', 'off')
        control.data = { propId: '', authorId: '', funding: 0, influence: 0, source: [{item: '', removed: false}], cat: [{ catName: '', catId: '', catReason: '', catValue: 0, removed: false }] }
        $('[data-click="sprop"]').off('click').on('click', (e) => {
          let spNum = $(e.target).attr('data-sprop-num')
          let spTarget = $(e.target).attr('data-sprop')
          let spAction = $(e.target).attr('data-sprop-action')
          prop.controller({target: spTarget, action: spAction, num: spNum})
        })
      }, 600);
    }

    function openSProp() {
      if (!control.expand) { control.expand = true }
      control.prop = set.num
      let propData = prop.storeData()
      control.data.propId = propData[set.num]._id
      control.data.authorId = propData[set.num].author
      $('[data-snav="back"]').attr('data-sprop-num', set.num)
      $('[data-sprop="main-box"][data-sprop-num="' + set.num + '"]').attr('data-sprop-select', 'on')
      $('[data-sprop="more-corner-btn"][data-sprop-num="' + set.num + '"]').removeClass('fa-expand').addClass('fa-times')
      anime({
        targets: ['[data-snav="sort"]', '[data-snav="filter"]', '[data-snav="submit"]', '[data-snav="reset"]'],
        direction: 'normal',
        duration: 200,
        delay: 0,
        opacity: [1, 0],
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop="sidebar"][data-sprop-num="' + set.num + '"]',
        direction: 'normal',
        duration: 200,
        delay: 250,
        width: 0,
        opacity: [1, 0],
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop-select="off"]',
        direction: 'normal',
        duration: 200,
        delay: 0,
        maxHeight: '0px',
        opacity: [1, 0],
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop="main-top"][data-sprop-num="' + set.num + '"]',
        direction: 'normal',
        duration: 200,
        delay: 250,
        borderRadius: '5px',
        easing: 'easeOutQuart' 
      });
      anime({
        targets: '[data-sprop="title-bar"][data-sprop-num="' + set.num + '"]',
        direction: 'normal',
        duration: 200,
        delay: 250,
        borderRadius: '8px 8px 0 0',
        easing: 'easeOutQuart' 
      });
      setTimeout( () => {
        $('[data-sprop-select="off"]').addClass('hide-field')
        $('[data-sprop="sidebar"][data-sprop-num="' + set.num + '"]').addClass('hide-field')
        $('[data-sprop="user-data"][data-sprop-num="' + set.num + '"]').removeClass('hide-field')
        $('[data-sprop="bar"][data-sprop-num="' + set.num + '"]').removeClass('hide-field')
        $('[data-sprop="main-box"][data-sprop-num="' + set.num + '"]').css({'max-height': '2500px'})
      }, 450);
      
      setTimeout( () => {
        $('[data-snav="sort"], [data-snav="filter"], [data-snav="reset"], [data-snav="submit"]').addClass('hide-field')
        $('[data-snav="back"]').removeClass('hide-field')
        anime({
          targets: ['[data-snav="back"]'],
          direction: 'normal',
          duration: 200,
          delay: 0,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
        $('[data-sprop="bar"][data-sprop-num="' + set.num + '"]').css('height', 'auto')
        anime({
          targets: '[data-sprop="bar"][data-sprop-num="' + set.num + '"]',
          direction: 'normal',
          duration: 250,
          width: '100%',
          delay: 0,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
        anime({
          targets: '[data-sprop="user-data"][data-sprop-num="' + set.num + '"]',
          direction: 'normal',
          duration: 250,
          width: '88px',
          delay: 0,
          opacity: [0, 1],
          easing: 'easeOutQuart' 
        });
        $('[data-click="sprop"]').off('click').on('click', (e) => {
          let spNum = $(e.target).attr('data-sprop-num')
          let spTarget = $(e.target).attr('data-sprop')
          let spAction = $(e.target).attr('data-sprop-action')
          prop.controller({target: spTarget, action: spAction, num: spNum})
        })
      }, 450);
    }
  }

  return {
    controller, storeData
  }
})()
//// NAV FUNCTIONS ////
const xy = ( () => {
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  let dataX = 10;
  let dataY = 10;
  let navDataX = 10;
  let navDataY = 10;
  function winW() { return winWidth = window.innerWidth }
  function winH() { return winHeight = window.innerHeight }
  function storeNavX() { navDataX = $('#PlatformContextMenu').attr('data-x') }
  function storeNavY() { navDataY = $('#PlatformContextMenu').attr('data-y') }
  function storeNavElemW() { elemW = $('#PlatformContextMenu').width() }
  function storeNavElemH() { elemH = $('#PlatformContextMenu').height() }
  function getNavX() {
    winWidth = xy.winW()
    let diff = winWidth - elemW;
    if (navDataX >= diff) {
      let result = winWidth - elemW - 10;
      return result } 
    else if (navDataX <= 10) { return 10 } 
    else { return navDataX }
  }
  function getNavY() {
    winHeight = xy.winH()
    let diff = winHeight - elemH;
    if (navDataY >= diff) {
      let result = winHeight - elemH - 10;
      return result } 
    else if (navDataY <= 10) { return 10 } 
    else { return navDataY }
  }
  function storeX(elem) { dataX = $(elem).attr('data-x') }
  function storeY(elem) { dataY = $(elem).attr('data-y') }
  function getX(elem) {
    let elemW = $(elem).width()
    winWidth = xy.winW()
    if (dataX >= winWidth - elemW) {
      let result = winWidth - elemW - 10;
      return result } 
    else if (dataX <= 10) { return 10 } 
    else { return dataX }
  }
  function getY(elem) {
    let elemH = $(elem).height()
    winHeight = xy.winH()
    if (dataY >= winHeight - elemH) {
      let result = winHeight - elemH - 10;
      return result } 
    else if (dataY <= 10) { return 10 } 
    else { return dataY }
  }
  return {
    winW, winH, storeNavX, storeNavY, getNavX, getNavY, storeX, storeY, getX, getY, storeNavElemW, storeNavElemH
  }
})()

function comSchemaFn() {
  for (let x = 0; x < $('.com-source-url').length; x++) {
    if ( $('.com-source-url')[x].value !== '' ) {
      commentSchema.context.sources.push( $('.com-source-url')[x].value)
    }
  }
  commentSchema.context.comment = $('#ComExplain').val() 
  commentSchema.context.CS = $('#RangeSliderCO').val() 
  commentSchema.context.importance = $('#SlideCom').val() 
}

async function sendComment() {
  // console.log('cat: ' + eval.getCategories() )
  // console.log('inf: ' + eval.getInfluence() )
  // console.log('com: ' + eval.getComments() )
  // console.log('context: ' + eval.getContext() )
  if ( eval.getCategories() ) { 
    // console.log('cat')
    catSchemaFn() }
  if ( eval.getInfluence() ) { 
    // console.log('inf')
    infSchemaFn() }
  if ( eval.getComments() ) { 
    // console.log('com')
    comSchemaFn() }
  let sendComment = {...commentSchema};
  sendComment.sentence = []
  // console.log(commentSchema)
  let sentences = commentSchema.sentence
  for (let a = 0; a < sentences.length; a++) {
    if (!sentences[a].sent && sentences[a].cs >= -10 && sentences[a].cs <= 10 && sentences[a].importance >= 0 && sentences[a].importance <= 10 && sentences[a].cs !== null) {
      sendComment.sentence.push(sentences[a])
      sentences[a].sent = true }
  }
  // console.log(sendComment)
  // console.log(catSchema)
  // console.log(infSchema)
  // console.log(comSchema)

  chrome.runtime.sendMessage( { 'message': 'Send Review', 'data': { 
    'categories': catSchema,
    'influences': infSchema,
    'comments': sendComment,
    'context': sendComment,
    'author': authorSchema,
    'selfeval': selfSchema
  } } )
}

//// PROCESS MESSAGES FROM BACKGROUND ////
async function gotMessage(req, send, sendResponse) {
  let message = req.message;
  switch(message) {
    case 'Launch':
      let container = $('#navContainer').length;
      if (container === 0) {
        nav.setTarget('none')
        nav.setCurrent('none')
        addContainer()
        popOut() } 
      else if (container === 1) {
        nav.setTarget('none')
        nav.setCurrent('none')
        closeNavigation() }
      // GET TAB URL ////
      getPageData()
      break;
    case 'Comment list success':
      let comments = req.data.comments
      if (typeof comments !== 'undefined') {
        for (let i = 0; i < comments.length; i++) {
          commentListSchema.push(comments[i])
        }
      }
      // console.log(commentListSchema)
      break;
    case 'Review success':
      // console.log('Close')
      postSubMenu(nav.getPostSub(), '#PostSummary')
      reviewCloseTransform()
      break;
    case 'Post and User':
      // console.log(req.post.data)
      populateContent(req.post)
      if ( nav.getLogin() ) { populateUser(req.user) }
      break;    
    case 'Posts Sent':
      if ( req.data.status === 'posts') {
        // console.log(req.data.posts)
        let searchInfluences = req.data.posts
        suggestedInfluences(searchInfluences, targetId) } 
      else {
        // console.log('Empty')
        suggestedInfluences('', targetId) }
      break;
    case 'URLs success':
      // console.log(req.data.urls)
      let urls = req.data.urls
      populateURLs(urls)
      break;
    case 'Categories Sent':
      if ( req.data.status === 'categories') {
        // console.log(req.data.categories)
        let searchCategories = req.data.categories
        suggestedCategories(searchCategories, targetId) } 
      else {
        // console.log('Empty')
        suggestedCategories('', targetId) }
      break;
    case 'Com Responses':
      let comMessage = req.responses.message
      if (comMessage === 'Sen response success') {
        let comNum = req.position
        let responses = req.responses.data.sentences
        allReplies(comNum, responses)
      }
      break;
    case 'Authors Sent':
      if ( req.data.status === 'authors' || req.data.status === 'no data' ) {
        // console.log(req.data.authors)
        let searchAuthors = req.data.authors
        suggestedAuthors(searchAuthors) } 
      else {
        suggestedAuthors('') }
      break;
    case 'Login Check':
      nav.setLogin(req.login);
      // console.log('Login Check')
      loginTransition()
      break;
    case 'Comment success':
      // console.log('Comment success')
      break;
    case 'Comment fail':
      // console.log('Comment fail')
      break;
    case 'Sen comment success':
      const senComments = req.data.comments
      // console.log(req.data.comments)
      addComment(senComments)
      break;
    case 'Category List success':
      sen.catToggle(true)
      let catList = req.data.category
      cat.catData('top', catList)
      populateCategories()
      // console.log(req.data.category)
      break;
    case 'Category List fail':
      sen.catToggle(false)
      $('#MarketBox').append(`
        <div class="flex-l pad-6 ft-14"><span>No categories found</span></div>
        <div class="flex-br cat-ranks" style="margin-top: 6px;"></div>
      `)
      break;
    case 'Nav proposals sent':
      // console.log(req.data)
      // console.log(req.data.proposals)
      let allProps = req.data.proposals
      let searchProps
      searchProps = allProps.sort( (prev, current) => { 
        return (prev.PS > current.PS) ? prev : current } )
      prop.storeData(searchProps)
      propSearch()
      break
    case 'Proposal success':
      // console.log(req.data)
      $('[data-prop="title"]').val('')
      $('[data-prop="summary"]').val('')
      $('[data-prop="source"]').val('')
      $('[data-prop="funding"]').val('')
      $('[data-prop="influence-display"]').val('---')
      $('[data-prop="influence"]').val(0.1)
      $('[data-prop="hidden-text"]').text('')
      let boxWidth = $('[data-prop="hidden-display"]').width() + 5
      $('[data-prop="funding"]').css('width', boxWidth + 'px')
      $('[data-prop="cat-display"]').val('1.0')
      $('[data-prop="catName"]').val('')
      $('[data-prop="catReason"]').val('')
      $('[data-prop="catValue"]').val(1.0)
      eval.proposal({target: 'all', action: 'reset'})
      break;
    case 'Proposal fail':
      // console.log(req.data)
      break;
    case 'Sen comment fail':
      // console.log(req.data)
      break;
    case 'Login successful':
      nav.setLogin(true);
      // console.log('login successful')
      loginTransition('Login successful')
      collapseMenu('#NavLoginMenu', 300, 200)
      closeNavbar(25, 485)
      if ( nav.getTarget() === 'home' || nav.getTarget() === 'create' || nav.getTarget() === 'post' || nav.getTarget() === 'categories' ) {
        let targetToCurrent = nav.getTarget()
        nav.setCurrent(targetToCurrent)
        if ( nav.getTarget() === 'home' ) {
          $('#NavHomeText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
          $('#NavHomeIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
        }
        else if ( nav.getTarget() === 'create' ) {
          $('#NavCreateText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
          $('#NavCreateIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
        }
        else if ( nav.getTarget() === 'categories' ) {
          setTimeout(() => {modifyRankFn()}, 600);
        }
        openNavbar(50, 510)
        expandMenu(nav.targetRouter(), 400, 560)
        nav.setTarget('none') } 
      else if ( nav.getTarget() === 'none' ) { nav.setCurrent('none') }
      break;
    case 'User Comments not found':
      break;
    case 'User Comments found':
      commentSchema.fetched = true;
      // console.log(req.data)
      const comment = req.data.comment
      if (!comment) { 
        // console.log('no comment')
        populateComments() } 
      else {
        commentSchema.commentStatus = true;
        commentSchema.comId = comment._id;
        for (let j = 0; j < comment.sentence.length; j++) {
          let senIndex = commentSchema.sentence
          .findIndex( sentence => sentence.dataId == comment.sentence[j].senId)
          if ( senIndex !== -1 ) {
            commentSchema.sentence[senIndex].cs = parseFloat( comment.sentence[j].cs.toFixed(1) );
            commentSchema.sentence[senIndex].importance = parseFloat( comment.sentence[j].importance.toFixed(1) );
            commentSchema.sentence[senIndex].comment = comment.sentence[j].comment;
            commentSchema.sentence[senIndex].sources = comment.sentence[j].sources;
            commentSchema.sentence[senIndex].tone = comment.sentence[j].tone;
            commentSchema.sentence[senIndex].sent = true
          }
          else {
            commentSchema.sentence.push({
              cs: parseFloat( comment.sentence[j].cs.toFixed(1) ),
              importance: parseFloat( comment.sentence[j].importance.toFixed(1) ),
              comment: comment.sentence[j].comment,
              sources: comment.sentence[j].sources,
              tone: comment.sentence[j].tone,
              sent: true
            })
          }
        }
        // console.log(commentSchema.sentence)
        populateComments() }
      break;
    case 'URL success':
      // console.log(req.data)
      postId = req.data.postId;
      spanRanges.postId = postId;
      postSchema.postId = postId;
      commentSchema.postId = postId;
      $('#CommentCount').text(req.data.comments)
      if (req.data.status == 'URL with ranges') {
        postSchema.CS = parseFloat( req.data.cs.toFixed(2) )
        postSchema.PS = parseFloat( req.data.ps.toFixed(2) )
        if (req.data.context.cs !== 0) {
          postSchema.context.CS = parseFloat( req.data.context.cs.toFixed(2) )
          postSchema.context.importance = parseFloat( req.data.context.importance.toFixed(2) )
        }
        for (let i = 0; i < req.data.influence.length; i++) {
          postSchema.influence.push({
            'infId': req.data.influence[i].infId,
            'infPercent': req.data.influence[i].infPercent,
            'infName': req.data.influence[i].infName
          })
        }
        postSchema.author = req.data.author
        postSchema.posts = req.data.posts
        for (let i = 0; i < req.data.category.length; i++) {
          postSchema.category.push({
            'catId': req.data.category[i].catId,
            'catPS': req.data.category[i].catPS,
            'catName': req.data.category[i].catName
          })
        }
        for (let i = 0; i < req.data.ranges.length; i++) {
          let start = req.data.ranges[i].start
          let end = req.data.ranges[i].end
          addToRange = false;
          reviewedArticle(start, end) }
        for (let j = 0; j < req.data.sentence.length; j++) {
          let cs = parseFloat( req.data.sentence[j].cs.toFixed(2) )
          let importance = parseFloat( req.data.sentence[j].importance.toFixed(2) )
          let senId = req.data.sentence[j].senId;
          let dataId = req.data.sentence[j]._id;
          let denom = req.data.sentence[j].denominator
          postSchema.sentence.push({
            'cs': cs,
            'importance': importance,
            'senId': senId,
            'dataId': dataId,
            'denominator': denom
          })
          commentSchema.sentence.push({
            'senId': senId,
            'dataId': dataId,
            'sent': false
          })
          if (req.data.sentence[j].totalComments != -1 && !(cs == 0 && importance == 0) ) {
            $('#' + senId).attr('data-cs', cs);
            $('#' + senId).attr('data-is', importance)
            setColor(cs, importance, [$('#' + senId)]) }
        }
      }
      sen.totalScore()
      postScore()
      addCategoryFn()
      addInfluenceFn()
      addAuthorFn()
      trackRecord()
      // console.log(postSchema)
      break;
    case 'Nav categories sent':
      let allCategories = req.data.posts
      // console.log(req.data)
      let searchCats
      if ( req.data.status !== 'no data') {
        searchCats = allCategories.sort( (prev, current) => { 
          return (prev.catRatio > current.catRatio) ? prev : current } )
      }
      searchSchema = []
      if ( typeof searchCats !== 'undefined') {
        for (let i = 0; i < searchCats.length; i++ ) {
          searchSchema.push({
            name: searchCats[i].name,
            ratio: searchCats[i].catRatio,
            _id: searchCats[i]._id,
            child: searchCats[i].child,
            parent: searchCats[i].parent,
            percent: searchCats[i].percent
          })
        }
      }
      cat.catData('search', searchSchema)
      categorySearch()
      break;
    case 'Nav posts sent':
      let allPosts = req.data.posts
      // console.log(req.data)
      let searchPosts
      if ( req.data.status !== 'no data') {
        // console.log('process')
        // console.log(allPosts[0].totalScore)
        searchPosts = allPosts.sort( (prev, current) => { 
          // console.log(prev.totalScore)
          return (prev.totalScore < current.totalScore) ? 1 : -1 } )
      }
      // console.log(searchPosts)
      searchSchema = []
      // console.log(searchPosts)
      if ( typeof searchPosts !== 'undefined') {
        for (let i = 0; i < searchPosts.length; i++ ) {
          searchSchema.push({
            title: searchPosts[i].title.content,
            cs: searchPosts[i].totalCS,
            ps: searchPosts[i].totalPS,
            postId: searchPosts[i]._id,
            url: searchPosts[i].url,
            score: searchPosts[i].totalScore
          })
        }
      }
      postSearch()
      // console.log(searchSchema)
      break;
    case 'Sub List':
      let subPos = req.position
      let subMessage = req.subs.message
      if ( subMessage === 'Sub List success' ) {
        let subList = req.subs.data.category
        let itemParent = subPos.parent
        let itemType = subPos.type
        let itemChild = subPos.child
        // console.log(subPos)
        // console.log(subList)
        sen.subsDropdown(itemChild, itemType, itemParent, {subs: true})
        openSubcategory(subPos, subList)
      }
      else { console.log('sub list failed') }
      break;
    case 'Reply Result':
      let comPos = req.position
      let repMessage = req.reply.message
      if (repMessage === 'Reply success') {
        sen.responseData(comPos, true)
        sen.replyToggle(comPos, false)
        let responses = req.reply.data.user.responses
        let numUpdate = $('#ComRep' + comPos).text()
        $('#ComRep' + comPos).text(parseFloat(numUpdate) + 1)
        $('#ComNumR' + comPos).html('')
        $('#ComResponse' + comPos).css('background-color', '#ADFF2F')
        $('#ComReplies' + comPos).css({'pointer-events': '', 'cursor': 'pointer'})
        $('#ComReplies' + comPos + ' > div').css('color', '#000')
        if (sen.allRepliesToggle(comPos) ) {
          $('.com-response' + comPos).remove()
          setTimeout( () => {allReplies(comPos, responses)}, 100);
        }
        $('#ComReplies' + comPos).off('click').on('click', () => {
          if ( sen.allRepliesToggle(comPos) ) {
            $('#ComReplies' + comPos).css('background-color', '#ddd')
            $('#ComReplies' + comPos + ' > div').css('color', '#000')
            $('.com-response' + comPos).remove()
            sen.allRepliesToggle(comPos, false)
          }
          else {
            $('#ComReplies' + comPos).css('background-color', '#eee')
            $('#ComReplies' + comPos + ' > div').css('color', '#900')
            if ( sen.responseData(comPos) ) {
              $('.com-response' + comPos).remove()
              allReplies(comPos, responses)
              sen.allRepliesToggle(comPos, true)
            }
            else {
              allReplies(comPos, responses)
            }
          }
        })
      }
      else if (repMessage === 'Reply fail') {
        $('#Send' + comPos).css('background-color', '#CD5C5C') }
      break;
    case 'No nav posts sent':
      // console.log(req.data)
      break;
    case 'Nav authors sent':
      let allAuthors = req.data.authors
      // console.log(req.data)
      let searchAuthors
      if ( req.data.status !== 'no data') {
        searchAuthors = allAuthors.sort( (prev, current) => { 
          return (prev.score > current.score) ? prev : current } )
      }
      searchAuthSchema = []
      // console.log(searchAuthors)
      if ( typeof searchAuthors !== 'undefined') {
        for (let i = 0; i < searchAuthors.length; i++ ) {
          searchAuthSchema.push({
            fullName: searchAuthors[i].fullName,
            cs: searchAuthors[i].CS,
            ps: searchAuthors[i].PS,
            authorId: searchAuthors[i]._id,
            score: searchAuthors[i].score
          })
        }
      }
      authorSearch()
      // console.log(searchAuthSchema)
      break;   
    case 'No nav authors sent':
      // console.log(req.data)
      break;    
    case 'URL fail':
      // console.log(req)
      break;
    case 'Range update':
      updateSentences(req.data)
      break;
    case 'Range fail':
      // console.log('range failed')
      break;
    case 'Login failed':
      nav.setLogin(false);
      // console.log('Login failed')
      break;
    case 'Logged out':
      nav.setLogin(false);
      // console.log('Logged out')
      logoutProcess()
      break;

    case 'Prop Reply':
      let replyMessage = req.replyData.message
      let replyPos = req.position
      if (replyMessage === 'Prop Reply success') {
        let replyPost = req.replyData.data.parsedData.data.posts
        updatePropFn(replyPost, replyPos)
      }
      break;

    case 'Prop Bid':
      let bidMessage = req.bidData.message
      let bidPos = req.position
      if (bidMessage === 'Prop Bid success') {
        let bids = req.bidData.data.parsedData.data.bids
        // console.log(bidPos)
        // console.log(bidMessage)
        // console.log(bids)
        prop.storeData({target: 'bid', num: bidPos, data: bids})
        $('[data-sprop="bid-num"][data-sprop-num="' + bidPos + '"]').text( bids.length + ' Bids' )
        if (bids.length > 0) {
          $('[data-sprop="bids"][data-sprop-num="' + bidPos + '"]').css('pointer-events', '')
          $('[data-sprop="bids"][data-sprop-num="' + bidPos + '"]' + ' > div > span').css('color', '#000')
        }
        anime({
          targets: '[data-sprop="bids"][data-sprop-num="' + bidPos + '"]',
          direction: 'normal',
          duration: 1000,
          delay: 0,
          backgroundColor: ['#ddd', '#0c0', '#ddd'],
          easing: 'easeInSine'
        });
        setTimeout( () => {
          prop.controller({target: 'bid', num: bidPos})
        }, 1000);
      }
      break;
    case 'Article successful':
      // console.log(req)
      break;
    case 'Rank Result':
      cat.sentCat(false)
      $('.rank-drop-down').css('color', '#000')
      anime({
        targets: '.rank-menu-all',
        direction: 'normal',
        duration: 300,
        delay: 0,
        opacity: [1, 0],
        easing: 'easeInSine'
      });
      setTimeout( () => { 
        $('.rank-menu-all').remove()
      }, 350);
      let catPos = req.position
      let catParent = catPos.parent
      let catType = catPos.type
      let catChild = catPos.child
      rankEval(catType)
      if ( sen.subsDropdown(catChild, catType, catParent, {get: 'subs'}) ) {
        anime({
          targets: '[data-cat-arrow="' + catParent + catType + catChild + '"]',
          direction: 'normal',
          duration: 300,
          delay: 0,
          color: 'rgb(103, 173, 75)',
          easing: 'easeInSine'
        });
      }
      else {
        anime({
          targets: '[data-cat-arrow="' + catParent + catType + catChild + '"]',
          direction: 'normal',
          duration: 300,
          delay: 0,
          color: '#C2DAB8',
          easing: 'easeInSine'
        });
      }
      break;
    default:
      // console.log('No data');
      break;
  }
}

function populateUser(req) {
  let catCS = userSchema.catCS = req.data.user.catCS.toFixed(2)
  let catPS = userSchema.catPS = req.data.user.catPS.toFixed(2)
  let totalCS = userSchema.totalCS = req.data.user.data.cs.toFixed(2)
  let totalPS = userSchema.totalPS = req.data.user.data.ps.toFixed(2)
  let fullName = userSchema.fullName = req.data.user.data.fullName
  let catCSTag = $('#CatCSBoxProf')
  let mainCSTag = $('#ProfCSBoxMain')
  let fullNameTag = $('#ProfileName')
  if ( catCS > 0 ) { $('#CatCSProf').text('+' + catCS) } 
  else { $('#CatCSProf').text(catCS) }
  setColor(catCS, 10, [catCSTag])
  if ( totalCS > 0 ) { $('#ProfCSMain').text('+' + totalCS) } 
  else { $('#ProfCSMain').text(totalCS) }
  setColor(totalCS, 10, [mainCSTag])
  $('#ProfileName').text(fullName)
  $('#CatPSProf').text(catPS)
  $('#ProfPSMain').text(totalPS)
  $('#WebCoins').text((totalCS * totalPS).toFixed(2))
  $('#DollarEx').text((totalCS * totalPS * 1.35).toFixed(2))
}

function populateContent(req) {
  postId = req.data.postId;
  spanRanges.postId = postId;
  postSchema.postId = postId;
  commentSchema.postId = postId;
  $('#CommentCount').text(req.data.comments)
  if (req.data.status == 'URL with ranges') {
    postSchema.CS = parseFloat( req.data.cs.toFixed(2) )
    postSchema.PS = parseFloat( req.data.ps.toFixed(2) )
    if (req.data.context.cs !== 0) {
      postSchema.context.CS = parseFloat( req.data.context.cs.toFixed(2) )
      postSchema.context.importance = parseFloat( req.data.context.importance.toFixed(2) )
    }
    for (let i = 0; i < req.data.influence.length; i++) {
      postSchema.influence.push({
        'infId': req.data.influence[i].infId,
        'infPercent': req.data.influence[i].infPercent,
        'infName': req.data.influence[i].infName
      })
    }
    postSchema.author = req.data.author
    postSchema.posts = req.data.posts
    for (let i = 0; i < req.data.category.length; i++) {
      postSchema.category.push({
        'catId': req.data.category[i].catId,
        'catPS': req.data.category[i].catPS,
        'catName': req.data.category[i].catName
      })
    }
    for (let i = 0; i < req.data.ranges.length; i++) {
      let start = req.data.ranges[i].start
      let end = req.data.ranges[i].end
      addToRange = false;
      reviewedArticle(start, end) }
    for (let j = 0; j < req.data.sentence.length; j++) {
      let cs = parseFloat( req.data.sentence[j].cs.toFixed(2) )
      let importance = parseFloat( req.data.sentence[j].importance.toFixed(2) )
      let senId = req.data.sentence[j].senId
      let dataId = req.data.sentence[j]._id
      let denom = req.data.sentence[j].denominator
      postSchema.sentence.push({
        'cs': cs,
        'importance': importance,
        'senId': senId,
        'dataId': dataId,
        'denominator': denom
      })
      commentSchema.sentence.push({
        'senId': senId,
        'dataId': dataId,
        'sent': false
      })
      if (req.data.sentence[j].totalComments != -1 && !(cs == 0 && importance == 0) ) {
        $('#' + senId).attr('data-cs', cs);
        $('#' + senId).attr('data-is', importance)
        setColor(cs, importance, [$('#' + senId)]) }
    }
  }
  sen.totalScore()
  postScore()
  addCategoryFn()
  addInfluenceFn()
  addAuthorFn()
  trackRecord()
  // console.log(postSchema)
}

function populateComments() {
  if (commentSchema.sentence.length > 0) {
    for (let j = 0; j < commentSchema.sentence.length; j++) {
      let senId = commentSchema.sentence[j].senId
      let cs = commentSchema.sentence[j].cs;
      let importance = commentSchema.sentence[j].importance;
      let comment = $('#' + senId)
      if ( commentSchema.sentence[j].sent ) {
        $(comment).attr('data-c-is', importance)
        $(comment).attr('data-c-cs', cs)
        setColor(cs, importance, [comment]) } 
      else {
        $(comment).attr('data-c-is', '')
        $(comment).attr('data-c-cs', '')
        $(comment).css('background-color','') }
    }
  }
  senEnd()
}

function addCategoryFn() {
  if ( postSchema.category.length == 0 ) {
    $('#PostCats').append(`
    <div class="flex-br"></div>
    <div class="flex-l pad-6 ft-14"><span>No categories</span></div>`)
    $('[data-post-sum="category"]').append(`
    <div class="flex-br"></div>
    <div class="flex-l pad-6 ft-14"><span>No categories</span></div>`)
  }
  else {
    for (let i = 0; i < postSchema.category.length; i++) {
      let catValue = postSchema.category[i].catPS 
      let catName = postSchema.category[i].catName
      let catId = postSchema.category[i].catId
      $('[data-post-sum="category"]').append(`
        <div class="flex-l pad-6">
          <div class="flex-l btn-typ btn-m bc-e">
            <div class="flex-l btn-b bc-d" style="border-right: 0.5px solid #999;">
              <span class="fa fa-align-right rotated ft-14" style="margin: 0 2px 2px 0; font-size: 10px;"></span>
              <span>` + catValue + `</span>
            </div>
            <div class="btn-ttl">`+ catName +`</div> 
          </div>
        </div>
      `)
      $('#PostCats').append(`
        <div class="flex-l pad-6">
          <div class="flex-l btn-typ btn-m bc-e">
            <div class="flex-l btn-b bc-d" style="border-right: 0.5px solid #999;">
              <span class="fa fa-align-right rotated ft-14" style="margin: 0 2px 2px 0; font-size: 10px;"></span>
              <span>` + catValue + `</span>
            </div>
            <div class="btn-ttl">`+ catName +`</div> 
          </div>
        </div>
      `)
    }
    $('#PostCats').append(`<div style="height: 6px;"></div>`)
    $('[data-post-sum="category"]').append(`<div style="height: 6px;"></div>`)
  }  
}

function addAuthorFn() {
  // console.log(postSchema.author)
  if (postSchema.author !== '') {
    let catCS = postSchema.author.data.cs.toFixed(2)
    let authCS = postSchema.author.catCS.toFixed(2)
    let catCSTag = $('#CatCSBox')
    let catCSTagMain = $('#CatCSBoxMain')
    let authCSTag = $('#AuthCSBox')
    let authCSTagMain = $('#AuthCSBoxMain')
    if ( catCS > 0 ) { 
      $('#AuthCS').text('+' + catCS) 
      $('#AuthCSMain').text('+' + catCS) 
    } 
    else { 
      $('#AuthCS').text(catCS) 
      $('#AuthCSMain').text(catCS) 
    }
    if ( authCS > 0 ) { 
      $('#CatCS').text('+' + authCS) 
      $('#CatCSMain').text('+' + authCS) 
    } 
    else { 
      $('#CatCS').text(authCS) 
      $('#CatCSMain').text(authCS) 
    }
    $('#AuthPS').text( postSchema.author.data.ps.toFixed(2) )
    $('#AuthPSMain').text( postSchema.author.data.ps.toFixed(2) )
    $('#CatPS').text( postSchema.author.catPS.toFixed(2) )
    $('#CatPSMain').text( postSchema.author.catPS.toFixed(2) )
    $('#AuthorName').text(postSchema.author.data.fullName)
    $('#AuthorNameMain').text(postSchema.author.data.fullName)
    setColor(catCS, 10, [catCSTag, catCSTagMain])
    setColor(authCS, 10, [authCSTag, authCSTagMain])
  }
  else {
    $('#AuthorName').text('No author')
    $('#AuthorNameMain').text('No author')
  }
}

function authorSearch() {
  let searchQuery = $('#NavSearchField').val()
  $('#ResultCount').text(searchAuthSchema.length)
  $('#NavSearchBox').empty()
  if (searchAuthSchema.length > 0) {
    $('#NavSearchBox').append(`
    <div class="flex-br" style="margin-top: 5px;"></div>
    `)
    for (let i = 0; i < searchAuthSchema.length; i++) {
      let postCS
      if (searchAuthSchema[i].cs > 0) {
        postCS = '+' + searchAuthSchema[i].cs.toFixed(2) }
      else { postCS = searchAuthSchema[i].cs.toFixed(2) }
      let postPS = searchAuthSchema[i].ps.toFixed(2)
      let fullName = searchAuthSchema[i].fullName.substring(0, 103)
      $('#NavSearchBox').append(`
      <div class="flex-br" style="margin-top: 8px;"></div>
      <div class="flex-l" style="width: 100%">
        <div>
          <div class="flex-l">
            <div id="postId` + i + `" style="padding: 4px 8px 4px 6px; margin: 0 0 0 8px; width: 60px; border-radius: 8px 0 0 0; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 12px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">` + postCS + `</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l">
            <div style="background-color: white; margin: 0 0 0 8px; border-top: 0; width: 60px; border-radius: 0 0 0 8px;" class="flex-l btn-typ btn-pad bc-e">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 12px"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">` + postPS + `</span></div>
            </div>
          </div>
        </div>
        <div class="ft-w flex-l" style="background-color: white; margin: 0 8px 0 0; padding: 0 5px 0 5px; font-size: 15px; width: 100%; height: auto;  border: 0.5px solid grey; border-left: 0; align-self: stretch; border-color: rgb(153, 153, 153); border-radius: 0 8px 8px 0;"><span>` + fullName + `</span></div>
      </div>
      `)
      let postTag = $('#postId' + i)
      setColor(postCS, 10, [postTag])
    }
    $('#NavSearchBox').append(`
    <div class="flex-br" style="margin-top: 12px;"></div>
    `)
  }
  else {
    $('#NavSearchBox').append(`
    <div class="flex-br" style="margin-top: 8px;"></div>
    <div class="flex-l" style="padding: 0px 12px;">
      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 0px 2px; font-weight: 600;" id="AuthorName">NO RELATED RESULTS FOR "`+ searchQuery +`"</span>
    </div>
    <div class="flex-br" style="margin-top: 12px;"></div>
    `)
  }
}

function categorySearch() {
  sen.counter('search', true)
  sen.subsDropdown(0, 'search', 0, {reset: 'search'})
  sen.openedRank(0, 'search', true, true)
  sen.openedRank(0, 'new', true, true)
  let searchQuery = $('#NavSearchField').val()
  if ( searchQuery == '') { cat.catData('search', '') }
  let searchData = cat.catData('search')
  // console.log(searchData)
  $('#ResultCount').text(searchData.length)
  $('#SearchCategories').empty()
  let hideField = ' hide-field'
  if ( sen.modifyToggle() ) { hideField = ''; }
  let searchIndex = searchData
  .findIndex( cats => cats.name.toUpperCase() == searchQuery.toUpperCase())
  let i = 0
  if (searchIndex == -1) {
    let count = sen.counter('new')
    $('#SeachPageIcon').removeClass('fa-search').addClass('fa-plus')
    $('#ResultCount').text('')
    $('#ResultTitle').text('ADD NEW CATEGORY')
    let resultsText = 'S'
    if ( searchData.length == 1) { resultsText = '' }
    $('#SearchCategories').append(`
      <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start;" data-cat-rank="0new` + count + `">
        <div class="flex-l">
          <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 18px;">
            <div class="spantip-box" style="position: relative; border-right: 0; width: auto; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px; border: 0.5px solid #eee;  background-color: #eee;">
              <div class="flex-br">
              </div>
              <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                <span id="CatArrow0new0" class="fa fa-plus nav-v pt-18" style="padding: 1px 2px; color: #000; font-size: 13px;" data-child="` + count + `" data-type="new" data-parent="0" data-cat-arrow="0new` + count + `">
                </span>
                <div class="flex-s">
                </div>
              </div>
            </div>
          </div>
          <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 60px;">
            <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
              <div class="flex-br">
              </div>
              <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                <div class="flex-s">
                </div>
                <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="---"></input>
                <div class="flex-s">
                </div>
              </div>
            </div>
          </div>
          <div style="position: relative; height: 23px; margin-top: 11px;">
            <span style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase; pointer-events: none;" class="cat-slider form-field no-drag inf-input-view cat-on" type="text" placeholder="Category">`+ searchQuery +`</span>
          </div>
          <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
            <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="new" data-menu="mark" data-parent="0">
              <span class="fa fa-caret-down nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 13px; pointer-events: none;" data-rank-mark="0new` + count + `">
              </span>
            </div>
          </div>
          <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
            <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 0 4px 0 2px; margin: 3px 0; cursor: pointer; background-color: rgb(228, 219, 102);" class="form-field mark-menu flex-l" data-cat-num="0" data-type="new" data-menu="add">
              <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 3px 2px; font-weight: 600; pointer-events: none;">NEW</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-br" style="margin-top: 12px;"></div>
      <div class="flex-l">
        <div>
          <span id="SeachPageIcon" class="fa fa-search ft-14" style="padding: 8px;"></span>
        </div>
        <div class="ft-14 ft-w"><span>` + searchData.length + `</span><span> SEARCH RESULT` + resultsText + `</span></div>
      </div>
    `)
  }
  else {
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultCount').text(searchData.length)
    if (searchData.length == 1) { $('#ResultTitle').text(' SEARCH RESULT') }
    else { $('#ResultTitle').text(' SEARCH RESULTS') }
  }
  if (searchData.length > 0) {
    for (let i = 0; i < searchData.length; i++) {
      let count = sen.counter('search')
      sen.subsDropdown(count, 'search', 0, {data: searchData[i]})
      let postPercent = searchData[i].percent.toFixed(2)
      let postText = searchData[i].name.substring(0, 103)
      $('#SearchCategories').append(`
        <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start;" data-cat-rank="0search` + count + `">
          <div class="flex-l">
            <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 18px;">
              <div class="spantip-box" style="position: relative; border-right: 0; width: auto; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px; border: 0.5px solid #eee; background-color: #eee;">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                  <span class="fa fa-chevron-right nav-v pt-18" style="padding: 1px 2px; color: #000; font-size: 13px;" data-child="` + count + `" data-type="search" data-parent="0" data-cat-arrow="0search` + count + `">
                  </span>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 60px;">
              <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                  <div class="flex-s">
                  </div>
                  <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="` + postPercent + `%"></input>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div style="position: relative; height: 23px; margin-top: 11px;">
              <span style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;  pointer-events: none;" class="cat-slider form-field no-drag inf-input-view cat-on" type="text" placeholder="Category">`+ postText +`</span>
            </div>
            <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
              <div style="border-radius: 5px; width: 100%; text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="search" data-menu="mark" data-parent="0">
                <span class="fa fa-caret-down nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 13px; pointer-events: none;" data-rank-mark="0search` + count + `">
                </span>
              </div>
            </div>
            <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
              <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="search" data-menu="add" data-parent="0">
                <span class="fa fa-level-up fa-rotate-90 nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 12px; pointer-events: none;" data-rank-add="0search` + count + `">
                </span>
              </div>
            </div>
          </div>
          <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 0;" data-menus="0search` + count + `">
          </div>
          <div class="flex-l pad-6 cat-ranks sub-0-search-` + count + `" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 10px;" data-subcats="0search` + count + `">
          </div>
        </div>
      `)
      if ( typeof searchData[i].child == 'undefined' || searchData[i].child.length == 0 ) {
        $('[data-cat-arrow="0search' + count + '"]').css({'color': '#bbb', 'pointer-events': 'none'})}
      else {
        $('[data-cat-arrow="0search' + count + '"]').css('cursor', 'pointer').addClass('sub-categories') 
        $('[data-cat-arrow="0search' + count + '"]').off('click').on('click', e => {
          let parentCatId = searchData[i]._id
          getSubs(e, parentCatId)
        })
      }
    }
    $('#SearchCategories').append(`<div class="flex-br" style="margin-top: 12px;"></div>`)
  }
  else {
    $('#SearchCategories').append(`
    <div class="flex-br" style="margin-top: 8px;"></div>
    <div class="flex-l" style="padding: 0px 12px;">
      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; text-transform: uppercase; padding: 0px 2px; font-weight: 600;" id="AuthorName">NO RELATED RESULTS FOR "`+ searchQuery +`"</span>
    </div>
    <div class="flex-br" style="margin-top: 12px;"></div>
    `)
  }
  $('#AddCatRank').off('click').on('click', () => {
    $('#AddCatButton').addClass('hide-field')
    $('#AddCategoryBox').removeClass('hide-field')
  })

  $('#AddCatSearch').off('keyup').on('keyup', addCatSearchFn)
  $('.mark-menu').off('click').on('click', openCatRank)
}

function propSearch() {
  $('[data-snav="submit"], [data-snav="reset"]').addClass('hide-field')
  $('[data-snav="filter"], [data-snav="sort"]').removeClass('hide-field')
  anime({
    targets: ['[data-snav="sort"]', '[data-snav="filter"]'],
    direction: 'normal',
    duration: 200,
    delay: 0,
    opacity: 1,
    easing: 'easeOutQuart' 
  });
  let searchQuery = $('#NavSearchField').val()
  const propData = prop.storeData()
  $('#ResultCount').text(propData.length)
  $('#NavSearchBox').empty()
  // console.log(propData)
  prop.controller({target: 'control', action: 'reset'})

  for (let i = 0; i < propData.length; i++) {
    let userName = propData[i].authorName
    let userCS = propData[i].authorData.catRelatedCS.toFixed(2)
    let userPS = propData[i].authorData.catRelatedPS.toFixed(2)
    let estReturn = propData[i].estimatedReturn.toFixed(0)
    let summary = propData[i].authorData.summary
    let title = propData[i].authorData.title
    let comCS = propData[i].authorData.catRelatedPS.toFixed(2)
    let comPS = propData[i].authorData.catRelatedPS.toFixed(2)
    let comTone = propData[i].authorData.catRelatedPS.toFixed(2)
    let sources = propData[i].authorData.sources.length
    let categories = propData[i].category.length
    let funding = propData[i].authorData.funding.toFixed(0)
    let influence = 100 * propData[i].authorData.influence.toFixed(3)
    let comments = propData[i].comments.length
    let bids = propData[i].bids.length
    let comId = propData[i].authorData.catRelatedPS.toFixed(2)
    let comData = {
      'propId': propData[i]._id,
      'categories': propData[i].category,
      'userId': propData[i].author
    }
    let bcColor = getColor(userCS, 10)
    if (userCS > 0) {
      userCS = '+' + userCS
    }
    if (comCS > 0) {
      comCS = '+' + comCS
    }
    if (comTone == null) { comTone = '---' }
    $('[data-search="main-container"]').append(`
    <div class="flex-l pad-6s flex-scroll" style="width: auto; margin-top: 8px; padding-bottom: 0; overflow: hidden; max-height: 110px; align-items: flex-start;" data-nav="comment-box" data-sprop="main-box" data-sprop-select="off" data-sprop-num="` + i + `">
      <div style="padding: 0 8px 0 0; margin: 0; opacity: 0; width: 0;" data-sprop="user-data" class="flex-c hide-field" data-sprop-num="` + i + `">
        <div class="flex-l">
          <div style="padding: 4px 8px 4px 6px; margin: 0; width: 80px; border-radius: 0; border: 0; justify-content: center;" class="flex-l btn-typ btn-pad" data-sprop="username-sidebar" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-user-circle-o ft-14" style="font-size: 10px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + userName + `</span></div>
          </div>
        </div>
        <div class="flex-l">
          <div style="padding: 4px 8px 4px 6px; margin: 0; width: 80px; border-radius: 8px 8px 0 0; background-color: ` + bcColor + `;  justify-content: center;" class="flex-l btn-typ btn-pad" data-sprop="user-sidebar" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-cs-text" data-sprop-num="` + i + `">` + userCS + `</span></div>
          </div>
        </div>
        <div class="flex-l">
          <div style="margin: 0; border-top: 0; width: 80px; border-radius: 0 0 8px 8px;  justify-content: center;" class="flex-l btn-typ btn-pad bc-e" data-sprop="bc" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-ps-text" data-sprop-num="` + i + `">` + userPS + `</span></div>
          </div>
        </div>
      </div>
      <div style="margin: 0;" data-sprop="sidebar" class="flex-c" data-sprop-num="` + i + `">
        <div class="flex-l">
          <div style="padding: 4px 8px 4px 6px; margin: 0; width: 70px; border-radius: 8px 0px 0 0; justify-content: center; border-right: 0;" class="flex-l btn-typ btn-pad bc-d" data-sprop="sidebar-top" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-krw ft-14" style="font-size: 10px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + funding + `</span></div>
          </div>
        </div>
        <div class="flex-l">
          <div style="margin: 0; border-top: 0; width: 70px; border-radius: 0; justify-content: center; border-right: 0;" class="flex-l btn-typ btn-pad bc-d">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-users ft-14" style="font-size: 10px"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + influence + `%</span></div>
          </div>
        </div>
        <div class="flex-l">
          <div style="margin: 0; border-top: 0; width: 70px; border-radius: 0; justify-content: center; border-right: 0; background-color: ` + bcColor + `" class="flex-l btn-typ btn-pad bc-d" data-sprop="cs-box" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-cs-text" data-sprop-num="` + i + `">` + userCS + `</span></div>
          </div>
        </div>
        <div class="flex-l">
          <div style="margin: 0; border-top: 0; width: 70px; border-radius: 0 0 0 8px;  justify-content: center; border-right: 0;" class="flex-l btn-typ btn-pad bc-d" data-sprop="sidebar-bottom" data-sprop-num="` + i + `" data-sprop="bc">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-tag ft-14" style="font-size: 10px"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-return-text" data-sprop-num="` + i + `">` + estReturn + `</span></div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: auto; overflow: hidden; border-radius: 0 5px 5px 5px; margin: 0;" data-sprop="main-top" data-sprop-num="` + i + `">
        <div id="ComNum` + i + `">
          <div class="flex-l" style="margin-bottom: 0px; background-color: #ddd; padding: 2px 4px; border-radius: 0px 8px 0 0; border: 0.5px solid #999; border-bottom: 0;" data-sprop="title-bar" data-sprop-num="` + i + `">
            <div style="padding: 4px 8px 4px 0px; margin: 0; width: 100%; justify-content: left;" class="flex-l btn-pad">
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700;">` + title + `</span></div>
            </div>
            <div style="padding: 2px 4px 2px 6px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: rgb(228, 219, 102); justify-content: center; border-right: 0; cursor: pointer;" class="flex-l btn-typ btn-pad sprop-btn" data-click="sprop" data-sprop="more" data-sprop-num="` + i + `" data-btn="corner">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-expand ft-14" style="font-size: 10px;" data-sprop="more-corner-btn" data-sprop-num="` + i + `"></span></div>
            </div>
            <div style="padding: 2px 5px; margin: 0; width: auto; border-radius: 0; background-color: rgb(228, 219, 102); justify-content: center; border-right: 0; cursor: pointer;" class="flex-l btn-typ btn-pad sprop-btn" data-click="sprop" data-sprop="review" data-sprop-num="` + i + `" data-btn="corner">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-pencil ft-14" style="font-size: 10px;" data-sprop="review-corner-btn" data-sprop-num="` + i + `"></span></div>
            </div>
            <div style="padding: 2px 6px 2px 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102); justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad sprop-btn" data-click="sprop" data-sprop="bid" data-sprop-num="` + i + `" data-btn="corner">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-gavel ft-14" style="font-size: 10px;" data-sprop="bid-corner-btn" data-sprop-num="` + i + `"></span></div>
            </div>
            <div style="padding: 2px 6px 2px 8px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad hide-field" data-sprop="fund-corner" data-sprop-num="` + i + `">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-krw ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px;">` + funding + `</span></div>
            </div>
            <div style="padding: 2px 6px 2px 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: #ddd;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad hide-field" data-sprop="inf-corner" data-sprop-num="` + i + `">
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px;">` + influence + `%</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div id="ComBox` + i + `" class="pad-6 pd-4-8 flex-c" style="width: auto; height: auto; min-height: 50px; background-color: #fff; color: #000; border-radius: 0 0 5px 5px; margin-bottom: 4px; align-items: self-start; text-align: left; border: 0.5px solid #999; border-top: 0;">
            <div style="margin-bottom: 4px; width: 100%;">
              <span style="color: #000; font-size: 13px; text-align: left; height: auto; overflow: hidden; margin-bottom: 4px; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; ">` + summary + `</span>
            </div>
            <div style="width: 100%" data-box="sources" data-sprop-num="` + i + `"></div>
            <div style="width: 100%" data-box="categories" data-sprop-num="` + i + `"></div>              
          </div>
          <div class="flex-br"></div>
          <div class="flex-l hide-field" style="margin: 0 0 5px 0; width: 100%; opacity: 0;" data-sprop="bar" data-sprop-num="` + i + `">
            <div id="ComReplies` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-click="sprop" data-sprop="replies" data-sprop-num="` + i + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;">
                <span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px;"></span>
              </div>
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;" data-sprop="reply-num" data-sprop-num="` + i + `">` + comments + ` Replies</span>
              </div>
            </div>
            <div id="ComResponse` + i + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102); justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad sprop-btn" data-click="sprop" data-sprop="review" data-sprop-num="` + i + `" data-num="` + i + `" data-id="` + comId + `" data-btn="bar">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-pencil ft-14" style="font-size: 10px;" data-sprop="review-bar-btn" data-sprop-num="` + i + `"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;" data-sprop="review-bar-btn" data-sprop-num="` + i + `">Reply</span></div>
            </div>
            <div id="ComReplies` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center; cursor: pointer; margin-left: 8px;" class="flex-l btn-typ btn-pad btn-lt" data-click="sprop" data-sprop="bids" data-sprop-num="` + i + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;">
                <span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px;"></span>
              </div>
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;" data-sprop="bid-num" data-sprop-num="` + i + `">` + bids + ` Bids</span>
              </div>
            </div>
            <div style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102); justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad sprop-btn" data-click="sprop" data-sprop="bid" data-sprop-num="` + i + `" data-num="` + i + `" data-id="` + comId + `" data-btn="bar">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-gavel ft-14" style="font-size: 10px;" data-sprop="bid-bar-btn" data-sprop-num="` + i + `"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;" data-sprop="bid-bar-btn" data-sprop-num="` + i + `">Bid</span></div>
            </div>
            <div class="flex-s"></div>
            <div id="ComCS` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: ` + bcColor + `;  justify-content: center;" class="flex-l btn-typ btn-pad" data-sprop="cs-box" data-sprop-num="` + i + `">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-cs-text" data-sprop-num="` + i + `">` + userCS + `</span></div>
            </div>
            <div style="padding: 4px; margin: 0; width: auto; border-radius: 0; background-color: #ddd;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-sprop="bc" data-sprop-num="` + i + `">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-tag ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-return-text" data-sprop-num="` + i + `">` + estReturn + `</span></div>
            </div>
            <div id="ComSources` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ i +`" data-click="sprop" data-sprop="sources" data-sprop-num="` + i + `" data-btn="bar">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-link rotated ft-14" style="font-size: 10px;" data-sprop="sources-bar-btn" data-sprop-num="` + i + `"></span></div>
              <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="sources-bar-btn" data-sprop-num="` + i + `">` + sources + `</span></div>
            </div>
            <div style="padding: 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: #ddd; justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad" data-click="sprop" data-sprop="categories" data-sprop-num="` + i + `" data-btn="bar">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-list-ul ft-14" style="font-size: 10px;" data-sprop="categories-bar-btn" data-sprop-num="` + i + `"></span></div>
              <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="categories-bar-btn" data-sprop-num="` + i + `">` + categories + `</span></div>
            </div>
          </div>
        </div>
        <div class="flex-br" style="pointer-events: none;">
        </div>
        <div style="width: 50px;"></div>
        <div id="ComNumR` + i + `" style="width: 100%"></div>
        <div class="flex-br" style="pointer-events: none;">
        </div>
        <div style="width: 50px;"></div>
        <div id="ComNumC` + i + `" style="width: 100%"></div>
      </div>
    </div>
    `)
    if (comments === 0) {
      $('[data-click="sprop"][data-sprop="replies"][data-sprop-num="' + i + '"]').css({'pointer-events': 'none', 'cursor': ''})
      $('[data-click="sprop"][data-sprop="replies"][data-sprop-num="' + i + '"]' + ' > div > span').css({'color': '#999'})
    }
    if (categories === 0) {
      $('[data-click="sprop"][data-sprop="categories"][data-sprop-num="' + i + '"]').css({'pointer-events': 'none', 'cursor': ''})
      $('[data-click="sprop"][data-sprop="categories"][data-sprop-num="' + i + '"]' + ' > div > span').css({'color': '#999'})
    }
    if (sources === 0) {
      $('[data-click="sprop"][data-sprop="sources"][data-sprop-num="' + i + '"]').css({'pointer-events': 'none', 'cursor': ''})
      $('[data-click="sprop"][data-sprop="sources"][data-sprop-num="' + i + '"]' + ' > div > span').css({'color': '#999'})
    }
    if (bids === 0) {
      $('[data-click="sprop"][data-sprop="bids"][data-sprop-num="' + i + '"]').css({'pointer-events': 'none', 'cursor': ''})
      $('[data-click="sprop"][data-sprop="bids"][data-sprop-num="' + i + '"]' + ' > div > span').css({'color': '#999'})
    }
    $('.sprop-btn').hover((e) => {
      let target = $(e.target).attr('data-sprop')
      let btn = $(e.target).attr('data-btn')
      let num = $(e.target).attr('data-sprop-num')
      if ( prop.controller({get: 'open'}) === target ) {
        $(e.target).css({"background-color": "#666", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#eee")
      }
      else {
        $(e.target).css({"background-color": "#666", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#eee")
      }
    },
    (e) => { 
      let target = $(e.target).attr('data-sprop')
      let btn = $(e.target).attr('data-btn')
      let num = $(e.target).attr('data-sprop-num')
      if ( prop.controller({get: 'open'}) === target ) {
        $(e.target).css({"background-color": "#fbf8c2", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#222")
      }
      else {
        $(e.target).css({"background-color": "#e4db66", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#000")
      }
    });
    $('[data-click="sprop"]').off('click').on('click', (e) => {
      let spNum = $(e.target).attr('data-sprop-num')
      let spTarget = $(e.target).attr('data-sprop')
      let spAction = $(e.target).attr('data-sprop-action')
      prop.controller({target: spTarget, action: spAction, num: spNum})
    })
  }

  $('[data-search="main-container"]').append(`<div class="flex-br" style="margin-top: 12px;"></div>`)
}


function postSearch() {
  let searchQuery = $('#NavSearchField').val()
  $('#ResultCount').text(searchSchema.length)
  $('#NavSearchBox').empty()
  if (searchSchema.length > 0) {
    $('#NavSearchBox').append(`<div class="flex-br" style="margin-top: 5px;"></div>`)
    for (let i = 0; i < searchSchema.length; i++) {
      let postCS
      if (searchSchema[i].cs > 0) {postCS = '+' + searchSchema[i].cs.toFixed(2)}
      else {postCS = searchSchema[i].cs.toFixed(2)}
      let postPS = searchSchema[i].ps.toFixed(2)
      let postText = searchSchema[i].title.substring(0, 103)
      $('#NavSearchBox').append(`
      <div class="flex-br" style="margin-top: 8px;"></div>
      <div class="flex-l" style="width: 100%">
        <div>
          <div class="flex-l">
            <div id="postId` + i + `" style="padding: 4px 8px 4px 6px; margin: 0 0 0 8px; width: 60px; border-radius: 8px 0 0 0; background-color: #99d98b; justify-content: center;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 12px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">` + postCS + `</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l">
            <div style="background-color: white; margin: 0 0 0 8px; border-top: 0; width: 60px; border-radius: 0 0 0 8px; justify-content: center;" class="flex-l btn-typ btn-pad bc-e">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 12px"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">` + postPS + `</span></div>
            </div>
          </div>
        </div>
        <div class="ft-w flex-l" style="background-color: white; margin: 0 8px 0 0; padding: 0 5px 0 5px; font-size: 15px; width: 100%; height: auto;  border: 0.5px solid grey; border-left: 0; align-self: stretch; border-color: rgb(153, 153, 153); border-radius: 0 8px 8px 0;"><span>` + postText + `</span></div>
      </div>
      `)
      let postTag = $('#postId' + i)
      setColor(postCS, 10, [postTag])
    }
    $('[data-search="main-container"]').append(`<div class="flex-br" style="margin-top: 12px;"></div>`)
  }
  else {
    $('#NavSearchBox').append(`
    <div class="flex-br" style="margin-top: 8px;"></div>
    <div class="flex-l" style="padding: 0px 12px;">
      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 0px 2px; font-weight: 600;" id="AuthorName">NO RELATED RESULTS FOR "`+ searchQuery +`"</span>
    </div>
    <div class="flex-br" style="margin-top: 12px;"></div>
    `)
  }
}

function trackRecord() {
  if (postSchema.posts.length > 0) {
    $('#AuthorBox').append(`
    <div class="flex-br" style="margin-top: 20px;"></div>
    <div class="flex-l" style="padding: 0px 6px;">
      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 0px 2px; font-weight: 600;" id="AuthorName">TRACK RECORD</span>
    </div>
    `)
    for (let i = 0; i < postSchema.posts.length; i++) {
      let postCS
      if (postSchema.posts[i].cs > 0) {postCS = '+' + postSchema.posts[i].cs.toFixed(2)}
      else {postCS = postSchema.posts[i].cs.toFixed(2)}
      let postPS = postSchema.posts[i].ps.toFixed(2)
      let postText = postSchema.posts[i].title.substring(0, 103)
      $('#AuthorBox').append(`
      <div class="flex-br" style="margin-top: 8px;"></div>
      <div class="flex-l" style="width: 100%">
        <div>
          <div class="flex-l">
            <div id="postId` + i + `" style="padding: 4px 8px 4px 6px; margin: 0 0 0 5px; width: 50px; border-radius: 5px 0 0 0; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + postCS + `</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l">
            <div style="margin: 0 0 0 5px; border-top: 0; width: 50px; border-radius: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + postPS + `</span></div>
            </div>
          </div>
        </div>
        <div class="ft-w flex-l" style="margin: 0 5px 0 0; padding: 0 5px 0 5px; font-size: 10px; width: 100%; height: auto;  border: 0.5px solid grey; border-left: 0; align-self: stretch; border-color: rgb(153, 153, 153); border-radius: 0 5px 5px 0;"><span>` + postText + `</span></div>
      </div>
      `)
      let postTag = $('#postId' + i)
      setColor(postCS, 10, [postTag])
    }
    $('#AuthorBox').append(`<div class="flex-br" style="margin-top: 12px;"></div>`)
  }
  else {
    $('#AuthorBox').append(`
    <div class="flex-br" style="margin-top: 20px;"></div>
    <div class="flex-l" style="padding: 0px 6px;">
      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 0px 2px; font-weight: 600;" id="AuthorName">NO RELATED POSTS</span>
    </div>
    <div class="flex-br" style="margin-top: 12px;"></div>
    `)
  }
}

function addInfluenceFn() {
  if (postSchema.influence.length == 0) {
    $('#PostInf').append(`
    <div class="flex-br"></div>
    <div class="flex-l pad-6 ft-14"><span>No influences</span></div>`)
    $('[data-post-sum="influence"]').append(`
    <div class="flex-br"></div>
    <div class="flex-l pad-6 ft-14"><span>No influences</span></div>`)
  }
  else {
    for (let i = 0; i < postSchema.influence.length; i++) {
      let infValue = postSchema.influence[i].infPercent * 100
      infValue = infValue.toFixed(1) + '%'
      let infName = 'SELF'
      if (postId !== postSchema.influence[i].infId) {
        infName = postSchema.influence[i].infName.substring(0, 20) }
      let infId = postSchema.influence[i].infId
      $('#PostInf').append(`
        <div class="flex-l pad-6">
          <div class="flex-l btn-typ btn-m bc-e">
            <div class="btn-b bc-d" style="border-right: 0.5px solid #999;"><span>` + infValue + `</span></div>
            <div class="btn-ttl">`+ infName +`</div> 
          </div>
        </div>
      `)
      $('[data-post-sum="influence"]').append(`
        <div class="flex-l pad-6">
          <div class="flex-l btn-typ btn-m bc-e">
            <div class="btn-b bc-d" style="border-right: 0.5px solid #999;"><span>` + infValue + `</span></div>
            <div class="btn-ttl">`+ infName +`</div> 
          </div>
        </div>
      `)
    }
    $('#PostInf').append(`<div style="height: 6px;"></div>`)
    $('[data-post-sum="influence"]').append(`<div style="height: 6px;"></div>`)
  }
}

function getSubs(e, parentCatId) {
  let itemChild = parseFloat( $(e.target).attr('data-child') )
  let itemType = $(e.target).attr('data-type')
  let itemParent = parseFloat( $(e.target).attr('data-parent') )
  let posId = { 'child': itemChild, 'type': itemType, 'parent': itemParent }
  if ( sen.subsDropdown(itemChild, itemType, itemParent, {get: 'toggle'}) ) {
    sen.subsDropdown(itemChild, itemType, itemParent, {toggle: false})
    anime({
      targets: '[data-cat-arrow="' + itemParent + itemType + itemChild + '"]',
      direction: 'normal',
      rotate: {
        value: 0,
        duration: 200,
        easing: 'easeInOutSine'
      },   
    });
    $('.sub-' + itemParent + '-' + itemType + '-' + itemChild).addClass('hide-field')
  }
  else {
    sen.subsDropdown(itemChild, itemType, itemParent, {toggle: true})
    anime({
      targets: '[data-cat-arrow="' + itemParent + itemType + itemChild + '"]',
      direction: 'normal',
      rotate: {
        value: 90,
        duration: 200,
        easing: 'easeInOutSine'
      },   
    });
    if ( !sen.subsDropdown(itemChild, itemType, itemParent, {get: 'subs'}) ) {
      chrome.runtime.sendMessage( { 'message': 'Get Sub', 'data': { 'parentId': parentCatId, 'position': posId } } );
    }
    else {
      $('.sub-' + itemParent + '-' + itemType + '-' + itemChild).removeClass('hide-field') }
  }
}

function openSubcategory(subPos, subList) {
  // console.log(subPos)
  let itemParent = subPos.parent
  let itemType = subPos.type
  let itemChild = subPos.child
  let hideField = ' hide-field'
  if ( sen.modifyToggle() ) {
    hideField = '' }
  if ( typeof subList !== 'undefined' || subList.length !== 0 ) {
    for (let i = 0; i < subList.length; i++ ) {
      let count = sen.counter(itemType)
      sen.subsDropdown(count, itemType, itemParent, {data: subList[i]})
      let catName = subList[i].name
      let catPercent = subList[i].percent.toFixed(2)
      $('[data-subcats="' + itemParent + itemType + itemChild + '"]').append(`
        <div class="flex-l pad-6 cat-ranks sub-` + itemParent + `-` + itemType + `-` + itemChild + `" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; margin-left: 0;" data-cat-rank="` + itemParent + itemType + count + `">
          <div class="flex-l">
            <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 18px;">
              <div class="spantip-box" style="position: relative; border-right: 0; width: auto; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px; border: 0.5px solid #eee;  background-color: #eee;">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                  <span class="fa fa-chevron-right nav-v pt-18" style="padding: 1px 2px; color: #000; font-size: 13px;" data-child="` + count + `" data-type="` + itemType + `" data-parent="` + itemParent + `" data-cat-arrow="` + itemParent + itemType + count + `">
                  </span>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 60px;">
              <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                  <div class="flex-s">
                  </div>
                  <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="` + catPercent + `%"></input>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div style="position: relative; height: 23px; margin-top: 11px;">
              <span style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase; pointer-events: none;" class="cat-slider form-field no-drag inf-input-view cat-on" type="text" placeholder="Category" data-num="1">`+ catName +`</span>
            </div>
            <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
              <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="` + itemType + `" data-menu="mark" data-parent="` + itemParent + `">
                <span class="fa fa-caret-down nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 13px; pointer-events: none;" data-rank-mark="` + itemParent + itemType + count + `">
                </span>
              </div>
            </div>
            <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
              <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="` + itemType + `" data-menu="add" data-parent="` + itemParent + `">
                <span class="fa fa-level-up fa-rotate-90 nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 12px; pointer-events: none;" data-rank-add="` + itemParent + itemType + count + `">
                </span>
              </div>
            </div>
          </div>
          <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 0;" data-menus="` + itemParent + itemType + count + `">
          </div>
          <div class="flex-l pad-6 cat-ranks sub-` + itemParent + `-` + itemType + `-` + count + `" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 10px;" data-subcats="` + itemParent + itemType + count + `">
          </div>
        </div>
      `)
      if ( typeof subList[i].child == 'undefined' || subList[i].child.length == 0 ) {
        $('[data-cat-arrow="' + itemParent + itemType + count + '"]').css({'color': '#bbb', 'pointer-events': 'none'}) }
      else {
        $('[data-cat-arrow="' + itemParent + itemType + count + '"]').css('cursor', 'pointer').addClass('sub-categories') 
        $('[data-cat-arrow="' + itemParent + itemType + count + '"]').off('click').on('click', e => {
          let parentCatId = subList[i]._id
          getSubs(e, parentCatId)
         })
      }
      $('#AddCatButton').addClass('hide-field')
      $('#AddCategoryBox').removeClass('hide-field')
    }
  }
  $('.mark-menu').off('click').on('click', openCatRank)
}

function populatePost() {
  if (postSchema.sentence.length > 0) {
    for (let j = 0; j < postSchema.sentence.length; j++) {
      let senId = postSchema.sentence[j].senId
      let cs = postSchema.sentence[j].cs;
      let importance = postSchema.sentence[j].importance;
      let comment = $('#' + senId)
      if ( importance >= 0.1 ) {
        $(comment).attr('data-is', importance)
        $(comment).attr('data-cs', cs)
        setColor(cs, importance, [comment]) } 
      else {
        $(comment).attr('data-is', '')
        $(comment).attr('data-cs', '')
        $(comment).css('background-color','') }
    }
  }
}

function updateSentences(data) {
  // console.log(postSchema)
  let range = data.ranges
  for (let a = 0; a < range.length; a++) {
    postSchema.sentence.push({
      'senId': range[a].senName,
      'dataId': range[a].senId,
      'comment': 'testing' + a
    })
    // added commentSchema
    commentSchema.sentence.push({
      'senId': range[a].senName,
      'dataId': range[a].senId,
      'sent': false
    })
  }
  // console.log(postSchema)
}

function suggestedAuthors(authors) {
  $('#PostText').css({'height': 'auto'})
  $('.authors-tab').remove()
  let borderRadius = '0'
  $('#NewAuthBorder').removeClass('hide-field')
  $('#AuthSpan').removeClass('hide-field')
  $('#NewAuth').removeClass('hide-field')
  $('#CatBoxes1').removeClass('hide-field')
  $('.plus-minus').removeClass('rotate45')
  if (typeof authors !== 'undefined') {
    if (authors.length > 0) { $('#NewAuthBorder').css({'border-radius': '5px 5px 0 0'}) }
    else { $('#NewAuthBorder').css({'border-radius': '5px'}) }
    for (i = 0; i < authors.length; i++) {
      if ( i+1 == authors.length ) { borderRadius = '0 0 5px 5px' }
      else { borderRadius = '0' }
      let authId = authors[i]._id
      let fullName = authors[i].fullName
      let bio = authors[i].bio
      if ( typeof bio === "undefined" ) { bio = 'N/A' }
      $('#AuthorSearch').append(`<div class="authors-tab flex-l pad-6" style="width: 100%; margin: 0; padding-top: 0;" data-id="`+ authId +`">
      <div class="flex-l btn-typ nav-btn pd-4-8 select-author" style="margin-right: 4px; width: 100%; margin: 0; border-top: 0; border-radius: `+ borderRadius +`;">
        <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-user-circle-o icn-20"></span></div>
        <div style="width: 100%; pointer-events: none;">
          <div><span style="font-size: 16px;">`+ fullName + `</span></div>
          <div><span style="color: #999;">`+ bio + `</span></div>
        </div>
        <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-plus icn-14 plus-minus"></span></div>
      </div>
    </div>`)
    }
  }
  $('.select-author').off('click').on('click', selectAuhorFn)
}

function selectAuhorFn(e) {
  let target = e.target
  let parent = $(target).parent()
  if ( $('.plus-minus').hasClass('rotate45') ) {
    $('.plus-minus').removeClass('rotate45')
    $('#AuthSpan').removeClass('hide-field')
    $('#CatBoxes1').removeClass('hide-field')
    $(target).css({'background-color': '', 'border-radius': '', 'border-top': ''})
    $(parent).addClass('authors-tab')
    $('#NewAuth').removeClass('hide-field').removeClass('authors-tab')
    if ( $(parent).attr('id') != 'NewAuth' ) {
      $('#NewAuth').removeClass('hide-field')
      $(parent).css({'padding-top': '0'}) 
    }
    suggestedAuthors(searchAuthors)
    $('.authors-tab').removeClass('hide-field')
  }
  else {
    // console.log( $(parent) )
    $('.plus-minus').addClass('rotate45')
    $(parent).css({'padding-top': ''})
    $('#AuthSpan').addClass('hide-field')
    $('#CatBoxes1').addClass('hide-field')
    if ( $(parent).attr('id') != 'NewAuth' ) {
      $('#NewAuth').addClass('hide-field') }
    $(target).css({'background-color': '#dfd', 'border-radius': '5px', 'border-top': '0.5px solid #999'})
    $(parent).removeClass('authors-tab')
    $('.authors-tab').addClass('hide-field')
  }
}

function suggestedInfluences(influences, targetId) {
  $('.inf-list').remove()
  let loopLength
  if (influences.length > 4) { loopLength = 4 }
  else { loopLength = influences.length }
  for (i = 0; i < loopLength; i++) {
    let infWidth = $('#InfSearch' + targetId).css('width')
    let bottomBorder = ''
    if ( i + 1 === loopLength) {
      bottomBorder = ' border-radius: 0 0 5px 5px; border-bottom: 0.5px solid #999;' }
    let infPos = i * 20;
    $('#InfSearch' + targetId).append(`<div id="` + influences[i]._id + `" class="inf-list" style="` + bottomBorder + ` transform: translate(-1px ,` + infPos +`px); width: ` + infWidth + `;">` + influences[i].title.content.substring(0, 20) + `</div>`)
  }
}

function suggestedCategories(categories, targetId) {
  $('.cat-list').remove()
  let catChild = cat.storeChild()
  if ( targetId == 'Top' || targetId == 'Sub' ) {
    cat.storeData(categories) }
  let count = 0
  for (i = 0; i < categories.length; i++) {
    if ( targetId == 'Top' && catChild.name.toUpperCase() == categories[i].name.toUpperCase() && catChild._id == categories[i]._id ) {
      continue }
    else {
      let catWidth = $('#CatSearch' + targetId).css('width')
      let bottomBorder = ''
      if ( i + 1 === categories.length) {
        bottomBorder = ' border-radius: 0 0 5px 5px; border-bottom: 0.5px solid #999;' }
      let catPos = count * 18;
      $('#CatSearch' + targetId).append(`<div id="` + categories[i]._id + `" class="cat-list" style="` + bottomBorder + ` transform: translate(-1px ,` + catPos +`px); width: ` + catWidth + `; z-index: 50000; font-size: 12px; font-weight: 600;" data-num="` + i +`">` + categories[i].name.toUpperCase() + `</div>`)
      count++
    }
  }
}

/// RETURN NEW WINDOW DIMENSIONS AFTER RESIZE ///
$(window).resize( () => {
  let x = xy.winW(); y = xy.winH();
  $('[data-nav="search-content"]').css('max-height', (y - 100) + 'px')
  $('[data-nav="comment-box"]').css('max-height', (y - 80) + 'px')
  $('.draggable').each( () => {
    let navMenu = $('#PlatformContextMenu')
    let elemW = $(navMenu).width()
    let elemH = $(navMenu).height()
    if ( $(navMenu).attr('data-x') > (x - elemW - 10) || $(navMenu).attr('data-y') > (y - elemH - 10) ) {
      let moveX = $(navMenu).attr('data-x');
      let moveY = $(navMenu).attr('data-y');
      elemW = $(navMenu).width()
      elemH = $(navMenu).height()
      if ($(navMenu).attr('data-x') > (x - elemW - 10) ) { moveX = x - elemW - 10 }
      if ($(navMenu).attr('data-y') > (y - elemH - 10) ) { moveY = y - elemH - 10 }
      let elem = $(navMenu).attr('id')
      anime({
        targets: '#' + String(elem),
        left: moveX,
        top: moveY,
        direction: 'normal',
        duration: 10,
        easing: 'easeOutElastic',
      });
      setTimeout( () => { $('#' + String(elem)).attr({'data-x': moveX, 'data-y': moveY}) }, 20);
    }
  })
  $('.com-e').remove()
  senEnd()
});

//// POPOUT ANIMATION ////
function popOut(navButton) {
  let button = '.draggable';
  if (typeof navButton !== 'undefined') { button = '#' + navButton }
  anime({
    targets: button,
    scale: [{ value: 1.2, duration: 50 }, { value: 0.8, duration: 150 }, { value: 1, duration: 150 }],
    direction: 'normal',
    easing: 'linear'
  }); 
  navButton = null
}

//// DISABLE LOGGED OUT ICONS ////
function loginCheck(target) {
  if (target === 'lock' && !nav.getLogin()) { return 'show-lock' } 
  else if (target === 'lock' && nav.getLogin()) { return 'hide-lock' } 
  else if (target === 'login' && !nav.getLogin()) { return 'NeedLogin' } 
  else if (target === 'login' && nav.getLogin()) { return 'logged-in' } 
  else if (target === 'rotate' && !nav.getLogin()) { return ' rotated' } 
  else if (target === 'rotate' && nav.getLogin()) { return '' } 
  else if (target === 'key' && !nav.getLogin()) { return 'fa-key' } 
  else if (target === 'key' && nav.getLogin()) { return 'fa-unlock lock-color' } 
  else if (target === 'button' && nav.getLogin()) { return '' } 
  else if (target === 'button' && !nav.getLogin()) { return ' button-disabled' } 
  else { return '' }
}

//// ADD MAIN NAV CONTAINER ////
function addContainer() {
  let maxHeight = xy.winH() - 100
  let body = document.getElementsByTagName('BODY')[0]
  let attach = document.createDocumentFragment()
  let topNav = document.createElement('div')
  $(topNav).attr({'id': 'topNav'})
  $(topNav).css({'z-index': '2147483647', 'direction': 'ltr'})
  let navContainer = document.createElement('div')
  $(navContainer).attr({'id': 'navContainer'})
  attach.appendChild(topNav)
  topNav.appendChild(navContainer)
  body.appendChild(attach)
  $('#navContainer').append(`
    <div id="PlatformContextMenu" class="draggable" style="opacity: 0.95; width: 325px; height: auto; padding: 0px; overflow: hidden; cursor: context-menu; font-size: 0; border-radius: 14px; font-family: Arial,sans-serif !important; background-color: #333; left: `+ xy.getNavX() +`px; top: `+ xy.getNavY() +`px;" data-x="`+ xy.getNavX() +`" data-y="`+ xy.getNavY() +`">
      <!-- /////  MAIN MENU  ///// -->
      <div id="SubPlatform" style="width: 325px; height: 70px; position: relative;">
        <div style="position: absolute; top: 12px; left: 70px;">
          <input id="NavSearchField" style="border-radius: 5px; width: 375px; text-transform: uppercase; height: 30px; opacity: 0; background-color: #ccc;" placeholder="Search Posts" type="text" class="cat-slider form-field no-drag hide-field">
          <div id="NavSearchPosts" class="hide-field search-target search-on" style="position: absolute; top: 35px; left: -190px; opacity: 1;">posts</div>
          <div id="NavSearchUsers" class="hide-field search-target search-off" style="position: absolute; top: 35px; left: -145px; opacity: 1;">authors</div>
          <div id="NavSearchProposals" class="hide-field search-target search-off" style="position: absolute; top: 35px; left: -90px; opacity: 1;">proposals</div>
          <div id="NavSearchCategories" class="hide-field search-target search-off" style="position: absolute; top: 35px; left: -25px; opacity: 1;">categories</div>
        </div>
        <div id="NavSearch" class="icn-con icn-dk">
          <div>
            <span id="NavSearchIcon" class="fa fa-search main-nav"></span>
            <div id="NavSearchText" class="main-nav">search</div>
          </div>
        </div>
        <div id="NavPost" class="icn-con icn-dk">
          <div>
            <span id="NavPostIcon" class="fa fa-file-text-o main-nav"></span>
            <div id="NavPostText" class="main-nav">post</div>
          </div>
        </div>
        <div id="NavCreate" class="icn-con icn-dk login-check `+ loginCheck('login')  +`">
          <div>
            <span id="NavCreateIcon" class="fa fa-pencil main-nav"></span>
            <div id="NavCreateText" class="main-nav">create</div>
          </div>
          <span id="CreateLock" class="fa fa-lock `+ loginCheck('lock') +`"></span>
        </div>
        <div id="NavHome" class="icn-con icn-dk login-check `+ loginCheck('login')  +`">
          <div>
            <span id="NavHomeIcon" class="fa fa-user main-nav"></span>
            <div id="NavHomeText" class="main-nav">home</div>
          </div>
          <span id="HomeLock" class="fa fa-lock `+ loginCheck('lock')  +`"></span>
        </div>	
        <!-- /////  SIDE CONTROL  ///// -->
        <div class="icon-parent">
          <div id="NavSettings" class="icn-box icn-dk" style="margin: 5px 0 0 0;">
            <div>
              <span class="fa fa-cog"></span>
            </div>
          </div>	
          <div id="NavClose" class="icn-box icn-dk" style="margin: 5px 0 0 0;">
            <div>
              <span class="fa fa-times"></span>
            </div>
          </div>
          <div id="NavLogin" class="icn-box icn-dk`+ loginCheck('rotate') +`">
            <div>
              <span id="NavLoginIcon" class="fa `+ loginCheck('key') +` main-nav"></span>
            </div>
          </div>
          <div id="NavSidebar" class="icn-box icn-dk">
            <div>
              <span class="fa fa-chevron-right"></span>
            </div>
          </div>
          <div id="NavMore" class="icn-box icn-dk" style="margin: 0 0 5px 0;">
            <div>
              <span class="fa fa-ellipsis-v"></span>
            </div>
          </div>	
          <div id="NavPin" class="icn-box icn-dk" style="margin: 0 0 5px 0;">
            <div>
              <span class="fa fa-thumb-tack"></span>
            </div>
          </div>					
        </div>
      </div>
      <!-- /////  LOGOUT MENU  ///// -->
      <div id="NavLogoutMenu" class="nav-menu hide-menu">
        <div id="NavLogoutContent" class="post-content" style="padding: 8px; background-color: #fff;">
          <div class="flex-l">
            <div class="flex-s"></div>
            <div class="flex-s ft-14 ft-w" style="flex-grow: 1;">Do you want to log out? </div>
            <div class="flex-l nav-btn yes-no-btn">
              <div><span id="LogoutYes">YES</span></div>
            </div>
            <div class="flex-l nav-btn yes-no-btn">
              <div><span id="LogoutNo">NO</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- /////  POST MENU  ///// -->
      <div id="NavPostMenu" class="nav-menu hide-menu">
        <div id="NavPostContent" class="post-content search-scroll" style="max-height: ` + maxHeight + `px; overflow: auto;" data-nav="search-content">
          <div id="NavPostMenuTop" style="width: auto">
            <div id="NavPostContentTop" class="post-content flex-l" style=" background-color: #e6e6e6; border-bottom: 0px solid #ddd; justify-content: space-evenly; align-items: center;">
              <div id="PostSummaryIcon" class="icn-con icn-lt flex-l bc-e" style="background-color: #eee;">
                <div>
                  <span class="fa fa-list-alt" style="color: #900"></span>
                  <div style="color: #900; font-weight: 500;">summary</div>
                  <div style="position: absolute; right: 5px; top: -12px; color: #999;">
                    <div id="AllStatus" class="fa fa-minus-circle eval-btn" style="color: #999; font-size: 14px;"></div>
                  </div>
                </div>
              </div>
              <div id="PostTextIcon" class="icn-con icn-lt show-field">
                <div>
                  <span class="fa fa-file-text-o"></span>
                  <div>text</div>
                  <div style="position: absolute; right: 5px; top: -12px; color: #999;">
                    <div id="TextStatus" class="fa fa-minus-circle eval-btn" style="color: #999; font-size: 14px;"></div>
                  </div>
                </div>
              </div>
              <div id="PostCategoriesIcon" class="icn-con icn-lt">
                <div>
                  <span class="fa fa-list-ul"></span>
                  <div>categories</div>
                  <div style="position: absolute; right: 5px; top: -12px; color: #999;">
                    <div id="CatStatus" class="fa fa-minus-circle eval-btn" style="color: #999; font-size: 14px;"></div>
                  </div>
                </div>
              </div>
              <div id="PostInfluenceIcon" class="icn-con icn-lt">
                <div>
                  <span class="fa fa-users"></span>
                  <div>influences</div>
                  <div style="position: absolute; right: 5px; top: -12px; color: #999;">
                    <div id="InfStatus" class="fa fa-minus-circle eval-btn" style="color: #999; font-size: 14px;"></div>
                  </div>
                </div>
              </div>	
              <div id="PostCommentsIcon" class="icn-con icn-lt">
                <div>
                  <span class="fa fa-comments"></span>
                  <div>comments</div>
                  <div style="position: absolute; right: 5px; top: -12px; color: #999;">
                    <div id="ComStatus" class="fa fa-minus-circle eval-btn" style="color: #999; font-size: 14px;"></div>
                  </div>
                </div>
              </div>	
            </div>
          </div>
          <div id="PostMenuTitle" style="padding: 8px 8px 0 8px;">
            <div style="position: relative;">
              <!-- /////  POST MENU TITLE CONTAINER  ///// -->
              <div class="flex-l show-field" style="opacity: 0;">
                <div>
                  <span class="fa fa-file-text-o ft-14" style="padding: 8px;"></span>
                </div>
              </div>
              <div id="ReviewMenu" style="overflow: hidden; position: relative; box-sizing: border-box; height: 0;">
                <div class="flex-l" style="flex-wrap: wrap; padding: 8px 0 0 0; width: 100%;">
                  <div class="flex-l" style="width: 100%;">
                    <div id="BackStep" class="flex-l btn-typ nav-btn" style="padding: 4px; margin-right: 4px;">
                      <div style="padding: 0;"><span class="fa fa-chevron-left ft-14" style="padding: 0;"></span></div>
                    </div>
                    <div id="ForwardStep" class="flex-l btn-typ nav-btn " style="padding: 4px; margin-right: 4px;">
                      <div style="padding: 0;"><span class="fa fa-chevron-right ft-14" style="padding: 0;"></span></div>
                    </div>
                    <!-- /////  UNDO BUTTON  ///// -->
                    <div class="flex-l btn-typ nav-btn pd-4-8" style="margin-right: 4px;">
                      <div class="pd-r4"><span class="fa fa-undo ft-14"></span></div>
                      <div><span style="padding: 0;">UNDO</span></div>
                    </div>
                    <!-- /////  SAVE BUTTON  ///// -->
                    <div id="SaveTest" class="flex-l btn-typ nav-btn pd-4-8" style="margin-right: 4px;">
                      <div class="pd-r4"><span class="fa fa-floppy-o ft-14"></span></div>
                      <div><span>SAVE</span></div>
                    </div>
                    <div class="flex-s"></div>
                    <!-- /////  SUBMIT BUTTON  ///// -->
                    <div id="SubmitComment" class="flex-l btn-typ nav-btn pd-4-8">
                      <div class="pd-r4"><span class="fa fa-arrow-circle-up ft-14 sub-btn"></span></div>
                      <div><span class="sub-btn">SUBMIT</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /////  POST MENU TITLE  ///// -->
              <div id="PostSigninPage" class="flex-l show-field" style="position: absolute; width: 100%; top: 0; left: 0;">
                <div>
                  <span class="fa fa-file-text-o ft-14" style="padding: 8px;"></span>
                </div>
                <div class="ft-14 ft-w">POST</div>
                <div id="CSBoxPost" style="margin: 0 0 0 10px; background-color: #eca;" class="flex-l btn-typ btn-pad">
                  <div class="pd-r4">
                    <span class="fa fa-check ft-14"></span></div>
                    <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="TotalCSPost">---</span></div>
                </div>
                <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                  <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                  <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="TotalPSPost">---</span></div>
                </div> 
                <div class="flex-s"></div>
                <!-- /////  POST MENU REVIEW BUTTON  ///// -->
                <div class="flex-l btn-typ review-btn nav-btn pd-4-8 `+ loginCheck('button') +`">
                  <div class="pd-r4"><span class="fa fa-plus ft-14"></span></div>
                  <div><span>REVIEW</span></div>
                </div>
              </div>
              <!-- /////  REVIEW SUB-MENU  ///// -->
              <div id="ReviewMenuTitle" class="flex-l hide-field" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%">
                <div>
                  <span class="fa fa-file-text-o ft-14" style="padding: 8px;"></span>
                </div>
                <div class="ft-14 ft-w">REVIEW</div>
                <div id="CSBox" style="margin: 0 0 0 10px; background-color: #eca;" class="flex-l btn-typ btn-pad">
                  <div class="pd-r4">
                    <span class="fa fa-check ft-14"></span></div>
                    <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="TotalCS">---</span></div>
                </div>
                <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                  <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                  <div><span>---</span></div>
                </div> 
                <div class="flex-s"></div>
                <!-- /////  POST MENU REVIEW BUTTON  ///// -->
                <div id="CancelReview" class="flex-l btn-typ nav-btn pd-4-8 `+ loginCheck('button') +`">
                  <div class="pd-r4"><span class="fa fa-ban ft-14"></span></div>
                  <div><span>CANCEL</span></div>
                </div>
              </div>
            </div>
          </div>
          <div id="PostSummary" style="overflow: hidden;" >
            <div style="padding: 8px">
              <!-- /////  POST MENU AUTHOR  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a">
                  <div>
                    <span class="fa fa-user-circle-o icn-11"></span>
                  </div>
                  <div class="ft-11">AUTHOR</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l pad-6 rev-off" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-l" style="padding: 3px 6px;">
                      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 13px; padding: 4px 2px; font-weight: 600;" id="AuthorNameMain"></span>
                    </div>
                    <div class="flex-br"></div>
                    <div class="flex-l" style="padding: 3px 6px;">
                      <div class="ft-w" style="font-size: 10px;">POST RELATED</div>              
                      <div id="CatCSBox" style="padding: 4px; margin: 0 0 0 10px; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" id="CatCS">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px;"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" id="CatPS">---</span></div>
                      </div>
                    </div>
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6">
                      <div class="ft-w" style="font-size: 10px;">OVERALL</div>              
                      <div id="AuthCSBox" style="padding: 4px; margin: 0 0 0 10px; background-color: #f2e85c;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" id="AuthCS">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" id="AuthPS">---</span></div>
                      </div>
                    </div>
                    <div style="flex-basis: 100%; height: 6px;"></div>
                  </div>
                </div>
              </div>
              <!-- /////  POST MENU TEXT  ///// -->
              <!-- 
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap;">
                  <div>
                    <span class="fa fa-file-text-o icn-11"></span>
                  </div>
                  <div class="ft-11">TEXT</div>
                  <div class="flex-s"></div>
                  <div id="FailTextIcon" class="hide-field">
                    <span class="fa fa-times-circle ft-14" style="color: #e00; padding: 6px 4px 6px 12px;"></span>
                  </div>
                  <div id="FailText" class="ft-f14 hide-field">-</div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l title-container rev-off" style="border-radius: 0 0 8px 8px">
                    <div class="flex-l pad-6">
                      <div class="flex-l btn-typ btn-m bc-e">
                        <div class="btn-b"><span>22.98</span></div>
                        <div class="btn-ttl">POLITICS</div> 
                      </div>
                    </div>
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6">
                      <div class="flex-l btn-typ btn-m bc-e">
                        <div class="btn-b"><span>16.11</span></div>
                        <div class="btn-ttl">NEWS</div> 
                      </div>
                    </div>
                    <div style="flex-basis: 100%; height: 6px;"></div>
                  </div>
                </div>
              </div> -->
              
              <!-- /////  POST MENU CATEGORIES  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap;">
                  <div>
                    <span class="fa fa-list-ul icn-11"></span>
                  </div>
                  <div class="ft-11">CATEGORIES</div>
                  <div class="flex-s"></div>
                  <div id="FailCatIcon" class="hide-field">
                    <span class="fa fa-times-circle ft-14" style="color: #e00; padding: 6px 4px 6px 12px;"></span>
                  </div>
                  <div id="FailCat" class="ft-f14 hide-field">-</div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-c title-container rev-off" style="border-radius: 0 0 8px 8px" data-post-sum="category">
                    <div style="flex-basis: 100%; height: 6px;"></div>
                  </div>
                </div>
              </div>
              <!-- /////  POST MENU INFLUENCES  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a">
                  <div>
                    <span class="fa fa-users icn-11"></span>
                  </div>
                  <div class="ft-11">INFLUENCES</div>
                  <div class="flex-s"></div>
                  <div id="FailInfIcon" class="hide-field">
                    <span class="fa fa-times-circle ft-14" style="color: #e00; padding: 6px 4px 6px 12px;"></span>
                  </div>
                  <div id="FailInf" class="ft-f14 hide-field">-</div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-c title-container rev-off" data-post-sum="influence">
                  </div>
                </div>
              </div>
              <!-- /////  POST MENU COMMENTS  ///// -->
              <!--
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a">
                  <div>
                    <span class="fa fa-comments icn-11"></span>
                  </div>
                  <div class="ft-11">COMMENTS</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l title-container rev-off" >
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6">
                      <div class="flex-l btn-typ btn-m bc-e">
                        <div class="btn-b"><span id="CommentCount">374</span></div>
                        <div class="btn-ttl">COMMENTS</div> 
                      </div>
                    </div>
                    <div style="flex-basis: 100%; height: 6px;"></div>
                  </div>
                </div>
              </div>
              -->
            </div>
          </div>
          <div id="PostText" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU AUTHOR  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l rev-on hide-field" style="flex-wrap: wrap; padding: 8px 0 0 0; width: 100%;">
                  <div class="flex-s"></div>
                  <div id="FindTitle" class="flex-l btn-typ nav-btn pd-4-8" style="margin-right: 4px;">
                    <div class="pd-r4"><span class="fa fa-header icn-20"></span></div>
                    <div><span>TITLE</span></div>
                  </div>
                  <div id="FindAuthor" class="flex-l btn-typ nav-btn pd-4-8" style="margin-right: 4px;">
                    <div class="pd-r4"><span class="fa fa-user-circle-o icn-20"></span></div>
                    <div><span>AUTHOR</span></div>
                  </div>
                  <div id="HighlightText" class="flex-l btn-typ nav-btn pd-4-8">
                    <div class="pd-r4"><span class="fa fa-i-cursor icn-20"></span></div>
                    <div><span>HIGHLIGHT TEXT</span></div>
                  </div>
                  <div class="flex-s"></div>
                </div>
                <div class="flex-l flex-s icn-a">
                  <div>
                    <span class="fa fa-user-circle-o icn-11"></span>
                  </div>
                  <div class="ft-11">AUTHOR</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="AuthorSearch" class="flex-l title-container cat-range rev-on hide-field" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;">
                    <div id="CatBoxes1" class="flex-l pad-6" style="width: 100%;">
                      <form autocomplete="off" style="width: 100%;" class="flex-l">
                        <div style="width: 100%; position: relative;" id="AuthSearch1">
                          <input id="AuthSearch" style="border-radius: 5px; width: 100%;" class="cat-slider form-field no-drag author-input cat-on" type="text" placeholder="Author" data-id="" data-num="1"></input>
                          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
                            <div id="CatStatus1" class="fa cat-eval-btn" style="color: #999; font-size: 14px;" data-num="1"></div>
                          </div>
                        </div>
                      </form> 
                      <div id="AddedCat1" class="form-button add-cat mr-pd">
                        <span class="fa fa-search" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                      </div>
                    </div> 
                    <div id="NewAuth" class="flex-l pad-6" style="width: 100%; margin: 0;" data-id="" data-name="">
                      <div id="NewAuthBorder" class="flex-l btn-typ nav-btn pd-4-8 hide-field select-author" style="margin-right: 4px; width: 100%; margin: 0;">
                        <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-user-circle-o icn-20"></span></div>
                        <div style="width: 100%; pointer-events: none;">
                          <div><span id="NewAuthor" style="font-size: 16px;"></span></div>
                          <div><span id="AuthSpan">ADD AS NEW AUHTOR</span></div>
                        </div>
                        <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-plus icn-14 plus-minus"></span></div>
                      </div>
                    </div>
                  </div>
                  <div id="AuthorBox" class="flex-l pad-6 rev-off" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-l" style="padding: 3px 6px;">
                      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px; font-weight: 600;" id="AuthorName"></span>
                    </div>
                    <div class="flex-br"></div>                  
                    <div class="flex-l" style="padding: 3px 6px;">
                      <div class="ft-w" style="font-size: 10px;">POST RELATED</div>              
                      <div id="CatCSBoxMain" style="margin: 0 0 0 10px; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatCSMain">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatPSMain">---</span></div>
                      </div>
                    </div>
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6">
                      <div class="ft-w" style="font-size: 10px;">OVERALL
                      </div>              
                      <div id="AuthCSBoxMain" style="margin: 0 0 0 10px; background-color: #f2e85c;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="AuthCSMain">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="AuthPSMain">---</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="PostCategories" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU CATEGORIES  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div id="CategoriesBox" class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap; overflow: hidden;">
                  <div>
                    <span class="fa fa-list-ul icn-11"></span>
                  </div>
                  <div class="ft-11">CATEGORIES</div>
                  <div class="flex-s"></div>
                  <div class="ft-11">USE EXISTING</div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="MainCatA1" class="flex-l title-container cat-range rev-on hide-field" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;">
                      <div id="CatBoxes1" class="flex-l pad-6" style="width: 100%;">
                        <form autocomplete="off" style="width: 100%;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div id="CatRange1" class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" id="CatSlide1" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="1.0" step="0.001"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                            <input class="input-range no-drag hide-field" orient="vertical" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 100px; width: 60px; overflow: hidden; margin-bottom: 8px;">
                            </input>
                          </div>
                        </div>
                        <div style="width: 100%; position: relative;" id="CatSearch1">
                          <input id="CatSearchBox1" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag cat-input cat-on" type="text" placeholder="Category" data-id="" data-num="1"></input>
                          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
                            <div id="CatStatus1" class="fa cat-eval-btn" style="color: #999; font-size: 14px;" data-num="1"></div>
                          </div>
                        </div>
                      </form> 
                      <div id="AddedCat1" class="form-button add-cat mr-pd">
                        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                      </div>
                    </div> 
                    <div class="pad-6 hidden-field" style="width: 100%;">
                      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
                        <div class="flex-l" style="width: 100%; height: 20px;">
                          <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
                        </div>
                        <div class="flex-br">
                        </div>
                        <div class="flex-l" style="padding: 0;">
                          <span class="sl-i">0.001</span>
                          <input id="SlideCat1" class="flex-l input-range no-drag slider-input" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="1">
                          <span class="sl-i">1000</span>
                        </div>
                      </div>
                    </div>
                    <div class="pad-6 hidden-field" style="width: 100%">
                      <textarea rows="2" id="CExplain1" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t cat-on" placeholder="Rating justification..." data-num="1"></textarea>
                    </div>
                    <div class="pad-6 hidden-field" style="width: 100%; margin-top: 6px">
                      <span class="ft-12" style="color: #000; padding: 4px 4px 4px 0;">Self Review:</span>
                    </div>
                    <div id="SelfBoxes1" class="flex-l pad-6 hidden-field" style="width: 100%;">
                      <form autocomplete="off" style="width: 100%;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div id="SelfRange1" class="spantip-box" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; border-right: 1px solid #999;">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" id="SelfSlide1" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="---" step="0.001"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                            <input class="input-range no-drag hide-field" orient="vertical" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 100px; width: 60px; overflow: hidden; margin-bottom: 8px;">
                            </input>
                          </div>
                        </div>
                        <div style="width: 100%; position: relative;" id="SelfSearch1">
                          <input id="SelfSearchBox1" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase; pointer-events: none; background-color: #eee; border-left: 0;" class="cat-slider form-field no-drag self-input cat-on" type="text" placeholder="Category" data-id="" data-num="1"></input>
                          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
                            <div id="SelfStatus1" class="fa cat-eval-btn" style="color: #999; font-size: 14px;" data-num="1"></div>
                          </div>
                        </div>
                        <div id="RemoveSelf1" class="form-button remove-self mr-pd" data-num="1">
                          <span class="fa fa-undo" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                        </div>
                      </form> 
                    </div> 
                    <div class="pad-6 hidden-field" style="width: 100%;">
                      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
                        <div class="flex-br">
                        </div>
                        <div class="flex-l" style="padding: 0;">
                          <span id="SelfLow1" class="sl-i">0.001</span>
                          <input id="SlideSelf1" class="flex-l input-range no-drag self-slider-input" orient="horizontal" type="range" step="0.001" value="---" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="1">
                          <span id="SelfHigh1" class="sl-i">1000</span>
                        </div>
                      </div>
                    </div>
                    <div class="pad-6 hidden-field" style="width: 100%">
                      <textarea rows="2" id="SExplain1" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t cat-on" placeholder="Self rating justification..." data-num="1"></textarea>
                    </div>
                  </div>
                  <div id="PostCats" class="flex-c title-container cat-range rev-off" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px;">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="PostInfluence" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU INFLUENCES  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div id="InfluenceBox" class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap; overflow: hidden;">
                  <div>
                    <span class="fa fa-users icn-11"></span>
                  </div>
                  <div class="ft-11">INFLUENCES</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="MainInfA1" class="flex-l title-container inf-range rev-on hide-field" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;">
                      <div id="InfBoxes1" class="flex-l pad-6" style="width: 100%;">
                        <form autocomplete="off" style="width: 100%;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div id="InfRange1" class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" id="InfSlide1" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="inf-slider form-field no-drag" data-id="" value="---"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style="width: 100%; position: relative;" id="InfSearch1">
                          <input id="InfSearchBox1" style="border-radius: 0 5px 5px 0; width: 100%; pointer-events: none; background-color: #eee; color: #666" class="inf-slider form-field no-drag inf-input inf-on" type="text" placeholder="SELF" value="SELF" data-id="" data-num="1"></input>
                          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
                            <div id="InfStatus1" class="fa inf-eval-btn" style="color: #999; font-size: 14px;" data-num="1"></div>
                          </div>
                        </div>
                      </form> 
                      <div id="RemoveInf1" class="form-button remove-inf mr-pd" data-num="1">
                        <span class="fa fa-undo" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                      </div>
                      <div id="AddedInf1" class="form-button add-inf mr-pd">
                        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                      </div>
                    </div> 
                    <div class="pad-6" style="width: 100%;">
                      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 5px 5px;">
                        <div class="flex-l" style="padding: 0;">
                          <input id="SlideInf1" class="flex-l input-range no-drag inf-slider-input" orient="horizontal" type="range" step="0.1" value="50" min="0.1" max="100" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="1">
                        </div>
                      </div>
                    </div>
                    <div class="pad-6 hidden-field" style="width: 100%">
                      <textarea rows="2" id="IExplain1" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t inf-on" placeholder="Rating justification..." data-num="1"></textarea>
                    </div>
                  </div>
                  <div id="PostInf" class="flex-l title-container cat-range rev-off" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px;">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="PostComments" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
            <!-- /////  POST MENU COMMENTS  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l icn-a">
                  <div>
                    <span class="fa fa-comments icn-11"></span>
                  </div>
                  <div class="ft-11">COMMENTS</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l title-container rev-on hide-field" style="border-top: 0.5px solid #999;">
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6" style="width: 100%; position: relative;">
                      <textarea rows="8" id="ComExplain" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t br-9" placeholder="Add context"></textarea>
                      <div style="position: absolute; right: 12px; top: 10px; color: #999;">
                        <div id="ComStatus1" class="fa inf-eval-btn" style="color: #999; font-size: 14px;" data-num="1"></div>
                      </div>
                    </div>
                    <div id="ComSources" style="width: 100%;">
                      <div id="ComUrlSubSrc1" class="flex-l pad-6">
                        <div style="width: 100%;">
                          <input id="ComUrlData1" class="com-source-url" type="text" class="form-field no-drag" placeholder="Source URL" data-id=""></input>
                        </div>
                        <div id="AddComUrl1" class="form-button add-com-source mr-pd" data-num="1">
                          <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                        </div>
                      </div> 
                    </div>
                    <div id="ComBoxes1" class="flex-l pad-6" style="width: 100%;">
                      <div class="t-t" style="width: 80px; margin-left: 0px; height: 24px;">
                        <div id="CommentRange" class="com-range br-9" style="background-color: #eee; position: absolute; bottom: 0px; border-radius: 5px; width: 100%; height: auto;">
                          <input id="RangeSliderCO" class="input-range no-drag hidden-field" orient="vertical" type="range" step="0.1" value="0" min="-10" max="10" style="user-drag: none; user-select: none; height: 100px; width: 100%; overflow: hidden; margin-top: 8px;">
                          </input>
                          <div class="flex-br">
                          </div>
                          <div class="flex-l span-ctn" style="height: 22px;">
                            <div class="flex-s">
                            </div>
                            <span class="fa fa-check nav-v pt-18" style="padding: 1px 2px; color: #000">
                            </span>
                            <span id="CommentVal" class="nav-v pt-18 sp-v" style="width: 35px; text-align: center;">---</span>
                            <div class="flex-s">
                            </div>
                          </div>
                        </div>
                      </div>
                      <form autocomplete="off" style="width: 100%; margin-left: 8px;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div id="ComRange" class="spantip-box br-9" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" id="ComSlide" style="border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 15px;  font-weight: 500;" class="com-slider form-field no-drag" data-id="" value="---"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="bc-e br-9" style="width: 100%; border-radius: 0 5px 5px 0; padding: 4px; border-left: 0; height: 24px; box-sizing: border-box;">
                          <div style="width: 100%;">
                            <input id="SlideCom" class="flex-l input-range no-drag" orient="horizontal" type="range" step="0.1" value="10" min="0.1" max="99.9" style="user-drag: none; user-select: none; height: 14px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;"></input>
                          </div>
                        </div>
                      </form> 
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /////  LOGIN MENU  ///// -->
      <div id="NavLoginMenu" class="nav-menu hide-menu" style="width: 100%;">
        <div id="NavLoginContent" class="post-content" style="padding: 8px;">
          <div id="SigninPage" class="flex-l">
            <div>
              <span id="SigninIcon" class="fa fa-key rotated ft-14" style="padding: 8px;"></span>
            </div>
            <div id="SigninTitle" class="ft-14 flex-s ft-w" style="flex-grow: 1;">LOGIN</div>
            <div id="SigninChange" style="border-radius: 5px;" class="flex-l nav-btn pd-4-8 form-button">
              <div class="pd-r4">
                <span id="SigninChangeIcon" class="fa fa-user-plus ft-14"></span>
              </div>
              <div>
                <span style="font-size: 10px" id="SigninChangeTitle">REGISTER</span>
              </div>
            </div>
          </div>
          <!-- /////  LOGIN FIELDS  ///// -->
          <div>
            <form>
              <div class="flex-l register-field hide-field" style="margin-top: 10px; transition-duration: 0.3s;">
                <div class="flex-l field-label">FULL NAME</div>
                <div class="flex-s"><input id="fullName" class="navInput" type="text" name="name" placeholder="Full Name"></div>
              </div>
              <div class="flex-l login-field hide--field" style="margin-top: 10px;">
                <div class="flex-l field-label">EMAIL</div>
                <div class="flex-s"><input id="PlatformEmail" class="navInput" type="text" name="email" placeholder="Email"></div>
              </div>
              <div class="flex-l login-field hide--field" style="margin-top: 10px;">
                <div class="flex-l field-label">PASSWORD</div>
                <div class="flex-s"><input id="PlatformPassword" class="navInput" type="password" name="password" placeholder="Password"></div>
              </div>
              <div class="flex-l register-field hide-field" style="margin-top: 10px; transition-duration: 0.3s;">
                <div class="flex-l field-label">RETYPE</div>
                <div class="flex-s"><input id="PlatformPassword2" class="navInput" type="password" name="password2" placeholder="Password"></div>
              </div>
            </form>
          </div>
          <div id="newSubmit" class="navSubMenu2 subMenemit loginRow login-button hide--field flex-l" style="margin-top: 10px; opacity: 1; width: 100%;">
            <span class="navTitle form-button" style="font-size: 12px; border-radius: 20px; margin: 0 5px; text-align: center; vertical-align: middle; width: 100%;">SUBMIT</span>
          </div>
        </div>
      </div>
      <!-- /////  SEARCH MENU  ///// -->
      <div id="NavSearchMenu" class="nav-menu hide-menu" style="width: 100%;">
        <div id="NavSearchContent" class="post-content search-scroll" style="max-height: ` + maxHeight + `px; overflow: auto;" data-nav="search-content">
        <div id="SearchPageBox" class="flex-l show-field pad-6" style="width: auto; top: 0; left: 0;">
        <div>
          <span id="SeachPageIcon" class="fa fa-search ft-14" style="padding: 8px;"></span>
        </div>
        <div class="ft-14 ft-w"><span id="ResultCount"></span><span id="ResultTitle"> SEARCH RESULTS</span></div>
        <div class="flex-s"></div>
        <!-- /////  POST MENU REVIEW BUTTON  ///// -->
        <div class="flex-l btn-typ sort-btn nav-btn pd-4-8" data-snav="sort" data-snav-class="genenral">
          <div class="pd-r4"><span id="ModifySortIcon" class="fa fa-sort-amount-desc ft-14"></span></div>
          <div><span id="ModifySort">SORT</span></div>
        </div>
        <div class="flex-l btn-typ filter-btn nav-btn pd-4-8" style="margin: 0 0 0 6px;" data-snav="filter" data-snav-class="genenral">
          <div class="pd-r4"><span id="ModifyFilterIcon" class="fa fa-filter ft-14"></span></div>
          <div><span id="ModifyFilter">FILTER</span></div>
        </div>
        <div class="flex-l btn-typ nav-btn pd-4-8 hide-field" style="margin: 0 0 0 6px; opacity: 0;" data-click="sprop" data-sprop="more" data-snav="back" data-click="sprop" data-sprop-num="" data-snav-class="prop">
          <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-chevron-left ft-14" style="" data-sprop="sub-view"></span></div>
          <div style="pointer-events: none;"><span data-sprop="sub-view">RESULTS</span></div>
        </div>
        <div class="flex-l btn-typ nav-btn pd-4-8 hide-field" style="margin: 0 0 0 6px; opacity: 0; cursor: pointer;" data-click="sprop" data-sprop="all" data-sprop-action="reset" data-snav="reset" data-snav-class="prop">
          <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-undo ft-14" style="" data-sprop="sub-view"></span></div>
          <div style="pointer-events: none;"><span style="" data-sprop="sub-view">RESET</span></div>
        </div>
        <div class="flex-l btn-typ nav-btn pd-4-8 hide-field" style="margin: 0 0 0 6px; pointer-events: none; opacity: 0;" data-click="sprop" data-sprop="submit" data-snav="submit" data-snav-class="prop">
          <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-arrow-circle-up ft-14" style="color: #999;" data-sprop="sub-view"></span></div>
          <div style="pointer-events: none;"><span style="color: #999;" data-sprop="sub-view">SUBMIT</span></div>
        </div>
        <div class="flex-l btn-typ rev-btn nav-btn pd-4-8" style="margin: 0 0 0 6px;" data-snav="review" data-snav-class="cat">
          <div class="pd-r4"><span id="ModifyReviewIcon" class="fa fa-comments ft-14"></span></div>
          <div><span id="ModifyReview">REVIEW</span></div>
        </div>
        <div class="flex-l btn-typ rank-btn nav-btn pd-4-8" style="margin: 0 0 0 6px;" data-snav="rank" data-snav-class="cat">
          <div class="pd-r4"><span id="ModifyRankIcon" class="fa fa-pencil-square-o ft-14"></span></div>
          <div><span id="ModifyRank">RANK</span></div>
        </div>
      </div>
        <div id="NavSearchBox" class="post-nav" style="overflow: hidden; height: auto" data-search="main-container">
        </div>
      </div>
    </div>
      <!-- /////  HOME MENU  ///// -->
      <div id="NavHomeMenu" class="nav-menu hide-menu">
        <div id="NavHomeContent" class="post-content">
          <div id="NavHomeMenuTop" style="width: 100%">
            <div id="NavHomeContentTop" class="post-content flex-l" style=" background-color: #e6e6e6; border-bottom: 0px solid #ddd; justify-content: space-evenly; align-items: center; width: 100%;">
              <div id="NavProfileIcon" class="icn-con icn-lt bc-e" style="background-color: #eee;">
                <div>
                  <span class="fa fa-id-card" style="color: #900"></span>
                  <div style="color: #900">profile</div>
                </div>
              </div>
              <div id="NavWalletIcon" class="icn-con icn-lt">
                <div>
                  <span class="fa fa-book"></span>
                  <div>wallet</div>
                </div>
              </div>
              <div id="NavDashboardIcon" class="icn-con icn-lt">
                <div>
                  <span class="fa fa-tachometer"></span>
                  <div>dashboard</div>
                </div>
              </div>	
            </div>
          </div>	
          <div id="NavProfile" class="post-nav" style="overflow: hidden; height: auto" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU PROFILE  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a">
                  <div>
                    <span class="fa fa-id-card icn-11"></span>
                  </div>
                  <div class="ft-11">PROFILE</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="ProfileBox" class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-l" style="padding: 3px 6px;">
                      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px; font-weight: 600;" id="ProfileName"></span>
                    </div>
                    <div class="flex-br"></div>                  
                    <div class="flex-l" style="padding: 3px 6px;">
                      <div class="ft-w" style="font-size: 10px;">POST RELATED</div>              
                      <div id="CatCSBoxProf" style="margin: 0 0 0 10px; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatCSProf">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatPSProf">---</span></div>
                      </div>
                    </div>
                    <div class="flex-br"></div>
                    <div class="flex-l pad-6">
                      <div class="ft-w" style="font-size: 10px;">OVERALL
                      </div>              
                      <div id="ProfCSBoxMain" style="margin: 0 0 0 10px; background-color: #f2e85c;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="ProfCSMain">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="ProfPSMain">---</span></div>
                      </div>
                    </div>
                    <div class="flex-br" style="margin-top: 12px;"></div>                      
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="NavWallet" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU WALLET  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div id="InfluenceBoxXY" class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap; overflow: hidden;">
                  <div>
                    <span class="fa fa-book icn-11"></span>
                  </div>
                  <div class="ft-11">WALLET</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="WalletBox" class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-l" style="padding: 3px 6px;">
                      <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px; font-weight: 600;" id="WalletTitle">EXCHANGE RATE</span>
                    </div>
                    <div class="flex-br"></div>                  
                    <div class="flex-l" style="padding: 3px 6px;">
                      <div class="ft-w" style="font-size: 10px;">EARNED WEBCOINS</div>              
                      <div id="WebCoinBox" style="margin: 0 0 0 10px;" class="flex-l btn-typ btn-pad">
                        <div class="pd-r4"><span class="fa fa-krw ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="WebCoins">---</span></div>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l">
                        <span class="fa fa-exchange ft-14"></span>
                      </div>
                      <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                        <div class="pd-r4"><span class="fa fa-usd ft-14"></span></div>
                        <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="DollarEx">---</span></div>
                      </div>
                    </div>
                    <div class="flex-br" style="margin-top: 12px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="NavDashboard" class="post-nav" style="overflow: hidden; height: 0" >
            <div style="padding: 8px;">
              <!-- /////  POST MENU WALLET  ///// -->
              <div class="flex-l" style="flex-wrap: wrap;">
                <div id="InfluenceBoxXYZ" class="flex-l flex-s br-9" style="padding: 0; margin: 8px 0 0 0; border-radius: 8px; background-color: #ddd; flex-grow: 1; flex-wrap: wrap; overflow: hidden;">
                  <div>
                    <span class="fa fa-tachometer icn-11"></span>
                  </div>
                  <div class="ft-11">DASHBOARD</div>
                  <div class="flex-s"></div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div id="PostInfXYZ" class="flex-l title-container cat-range" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px;">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /////  CREATE MENU  ///// -->
      <div id="NavCreateMenu" class="nav-menu hide-menu search-scroll" style="max-height: ` + maxHeight + `px; overflow: hidden;" data-nav="search-content" data-create="container">
        <div id="NavCreateContent" class="post-content flex-l">
          <div id="NavNewPostIcon" class="icn-con icn-lt bc-e" style="background-color: #eee;">
            <div>
              <span class="fa fa-pencil-square" style="color: #900"></span>
              <div style="color: #900">post</div>
            </div>
          </div>
          <div id="NavReview" class="icn-con icn-lt">
            <div>
              <span class="fa fa-comment"></span>
              <div>review</div>
            </div>
          </div>	
          <div id="NavProposalIcon" class="icn-con icn-lt">
            <div>
              <span class="fa fa-gavel"></span>
              <div>proposals</div>
            </div>
          </div>	
          <div id="NavCollaborate" class="icn-con icn-lt">
            <div>
              <span class="fa fa-users"></span>
              <div>collaborate</div>
            </div>
          </div>
          <div id="NavDrafts" class="icn-con icn-lt">
            <div>
              <span class="fa fa-folder"></span>
              <div>drafts</div>
            </div>
          </div>
        </div>
        <div id="NavNewPost" style="overflow: hidden;">
          <div style="padding: 8px;">
            <div class="flex-l" style="flex-wrap: wrap;">
              <div class="flex-l flex-s icn-a">
                <div>
                  <span class="fa fa-pencil-square icn-11"></span>
                </div>
                <div class="ft-11">NEW POST</div>
                <div class="flex-s"></div>
                <div class="flex-l icn-typ">
                  <div style="padding: 0;"><span class="fa fa-chevron-right ft-14"></span></div>
                </div>
                <div class="flex-br"></div>
                <div id="ProfileBox18" class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
                  <div class="flex-l" style="padding: 3px 6px;">
                    <span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px; font-weight: 600;" id="ProfileName18"></span>
                  </div>
                  <div class="flex-br"></div>                  
                  <div class="flex-l" style="padding: 3px 6px;">
                    <div class="ft-w" style="font-size: 10px;">POST RELATED</div>              
                    <div id="CatCSBoxProf18" style="margin: 0 0 0 10px; background-color: #99d98b;" class="flex-l btn-typ btn-pad">
                      <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                      <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatCSProf18">---</span></div>
                    </div>
                    <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                      <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                      <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="CatPSProf18">---</span></div>
                    </div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l pad-6">
                    <div class="ft-w" style="font-size: 10px;">OVERALL
                    </div>              
                    <div id="ProfCSBoxMain18" style="margin: 0 0 0 10px; background-color: #f2e85c;" class="flex-l btn-typ btn-pad">
                      <div class="pd-r4"><span class="fa fa-check ft-14"></span></div>
                      <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="ProfCSMain18">---</span></div>
                    </div>
                    <div style="margin: 0 0 0 5px;" class="flex-l btn-typ btn-pad bc-e">
                      <div class="pd-r4"><span class="fa fa-align-right rotated ft-14"></span></div>
                      <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 15px; padding: 4px 2px;" id="ProfPSMain18">---</span></div>
                    </div>
                  </div>
                  <div class="flex-br" style="margin-top: 12px;"></div>                      
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="NavProposal" style="width: 100%; height: 0; overflow: hidden;" class="flex-c">
          <div style="overflow: hidden; position: relative; box-sizing: border-box; height: auto; width: 100%;">
            <div class="flex-l" style="flex-wrap: wrap; padding: 8px 8px 0 8px; width: 100%;">
              <div class="flex-l" style="width: 100%;">
                <div class="flex-l btn-typ nav-btn" style="padding: 4px; margin-right: 4px;" data-click="prop" data-prop="all" data-prop-action="reset">
                  <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-undo ft-14"></span></div>
                  <div style="pointer-events: none;"><span style="padding: 0;">RESET ALL</span></div>
                </div>
                <div class="flex-l btn-typ nav-btn pd-4-8" style="margin-right: 4px;" data-click="prop" data-prop="save">
                  <div style="pointer-events: none;" class="pd-r4"><span class="fa fa-floppy-o ft-14"></span></div>
                  <div style="pointer-events: none;"><span>SAVE</span></div>
                </div>
                <div class="flex-s"></div>
                <div style="pointer-events: none;" class="flex-l btn-typ nav-btn pd-4-8" data-click="prop" data-prop="submit">
                  <div class="pd-r4" style="pointer-events: none;"><span class="fa fa-arrow-circle-up ft-14" style="color: #999;" data-prop="sub-view"></span></div>
                  <div style="pointer-events: none;"><span class="" data-prop="sub-view" style="color: #999;">SUBMIT</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="post-nav bc-e" style="">
            <div style="padding: 0px 8px;">
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a" style="position: relative;">
                  <div>
                    <span class="fa fa-flask icn-11"></span>
                  </div>
                  <div class="ft-11">PROPOSAL INFO</div>
                  <div class="flex-s"></div>
                  <div style="position: absolute; right: 28px; top: 7px; color: #999;">
                    <div class="" style="color: #999; font-size: 14px;" data-prop="info-eval"></div>
                  </div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="prop" data-prop="allInfo" data-prop-action="reset"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-br"></div>  
                    <div style="width: 100%;">
                      <div class="flex-l pad-6">
                        <div style="width: 100%; position: relative;">
                          <input class="com-source-url" type="text" class="form-field no-drag" placeholder="Proposal Title" data-input="prop" data-prop="title" data-prop-action="set"></input>
                          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
                            <div class="" style="color: #999; font-size: 14px;" data-prop="title-eval"></div>
                          </div>
                        </div>
                      </div> 
                    </div>                
                    <div class="flex-l pad-6" style="width: 100%; position: relative;">
                      <textarea rows="5" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t br-9" placeholder="Proposal Summary" data-input="prop" data-prop="summary" data-prop-action="set"></textarea>
                      <div style="position: absolute; right: 12px; top: 10px; color: #999;">
                        <div class="" style="color: #999; font-size: 14px;" data-prop="summary-eval"></div>
                      </div>
                    </div>
                    <div style="width: 100%;" class="flex-c" data-prop="source-container">
                      <div style="width: 100%;" data-prop-num="0" data-prop="source-box">
                        <div class="flex-l pad-6">
                          <div style="width: 100%; position: relative;">
                            <input type="text" class="prop-source form-field no-drag" placeholder="Source" data-input="prop" data-prop="source" data-prop-num="0" data-prop-action="set"></input>
                            <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                              <div class="" style="color: #999; font-size: 14px;" data-prop="source-eval" data-prop-num="0"></div>
                            </div>
                          </div>
                          <div class="form-button mr-pd" data-click="prop" data-prop="source" data-prop-num="0" data-prop-action="add">
                            <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex-br" style="margin-top: 12px;"></div>                      
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="post-nav bc-e" style="">
            <div style="padding: 0px 8px;">
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a" style="position: relative;">
                  <div>
                    <span class="fa fa-gavel icn-11"></span>
                  </div>
                  <div class="ft-11">BID TARGET</div>
                  <div class="flex-s"></div>
                  <div style="position: absolute; right: 28px; top: 7px; color: #999;">
                    <div class="" style="color: #999; font-size: 14px;" data-prop="bids-eval"></div>
                  </div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="prop" data-prop="allBids" data-prop-action="reset"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
                    <div class="flex-br"></div>  
                    <div class="flex-l pad-6" style="width: 100%;">
                      <div class="ft-w" style="font-size: 10px;">FUNDING</div>
                      <form autocomplete="off" style="width: 100%; margin-left: 8px;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0; width: 90px;">
                          <div class="spantip-box br-9" style="position: relative; width: 90px; z-index: 5000; border-radius: 5px; overflow: hidden; height: 24px;" data-prop="funding-eval">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px; position: relative;">
                              <div class="flex-s">
                              </div>
                              <div class="fa fa-krw ft-14" style="font-size: 13px; margin: 0 0 0 8px;">
                              </div>
                              <input type="text" style="font-family: Arial,sans-serif !important; border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: left; margin: 0; font-size: 13px; padding: 4px 0px 4px 3px;" class="com-slider form-field no-drag" value="" maxlength="7" placeholder="0" data-input="prop" data-prop="funding" data-prop-action="set"></input>
                              <div style="visibility: hidden; position: absolute; left: 0px; top: 0px;" data-prop="hidden-display">
                                <span style="font-family: Arial,sans-serif !important; border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 13px; padding-left: 1px" class="com-slider form-field" data-prop="hidden-text"><span>
                              </div>
                              <div class="flex-s">
                              </div>
                            </div>
                          </div>
                        </div>
                      </form> 
                    </div> 
                    <div class="flex-l pad-6" style="width: 100%;">
                      <div class="ft-w" style="font-size: 10px;">INFLUENCE</div>
                      <form autocomplete="off" style="width: 100%; margin-left: 8px;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div class="spantip-box br-9" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 24px;" data-prop="influence-eval">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 13px;" class="com-slider form-field no-drag" value="---" data-prop="influence-display"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="bc-e br-9" style="width: 100%; border-radius: 0 5px 5px 0; padding: 4px; border-left: 0; height: 24px;">
                          <div style="width: 100%;">
                            <input class="flex-l input-range no-drag" orient="horizontal" type="range" step="0.1" value="5" min="0.1" max="99.9" style="user-drag: none; user-select: none; height: 14px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-click="prop" data-prop="influence" data-prop-action="set"></input>
                          </div>
                        </div>
                      </form> 
                    </div> 
                    <div class="flex-br" style="margin-top: 12px;"></div>                      
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="post-nav bc-e" style="">
            <div style="padding: 0px 8px 8px 8px;">
              <div class="flex-l" style="flex-wrap: wrap;">
                <div class="flex-l flex-s icn-a" data-prop="category-container" style="position: relative;">
                  <div>
                    <span class="fa fa-list-ul icn-11"></span>
                  </div>
                  <div class="ft-11">CATEGORIES</div>
                  <div class="flex-s"></div>
                  <div style="position: absolute; right: 28px; top: 7px; color: #999;">
                    <div class="" style="color: #999; font-size: 14px;" data-prop="cats-eval"></div>
                  </div>
                  <div class="flex-l icn-typ">
                    <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="prop" data-prop="allCats" data-prop-action="reset"></span></div>
                  </div>
                  <div class="flex-br"></div>
                  <div class="flex-l title-container" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;" data-prop="cat-box">
                      <div class="flex-l pad-6" style="width: 100%;">
                        <form autocomplete="off" style="width: 100%;" class="flex-l">
                        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                          <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;" data-prop-num="0" data-prop="catValue-display">
                            <div class="flex-br">
                            </div>
                            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
                              <div class="flex-s">
                              </div>
                              <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" value="1.0" step="0.001" data-prop-num="0" data-prop="cat-display"></input>
                              <div class="flex-s">
                              </div>
                            </div>
                            <input class="input-range no-drag hide-field" orient="vertical" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 100px; width: 60px; overflow: hidden; margin-bottom: 8px;">
                            </input>
                          </div>
                        </div>
                        <div id="CatSearchProp0" style="width: 100%; position: relative;">
                          <input id="CatSearchBoxProp0" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag" type="text" placeholder="Category" data-input="prop" data-prop="catName" data-prop-num="0" data-num="Prop0" data-prop-action="set"></input>
                          <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                            <div class="" style="color: #999; font-size: 14px;" data-prop="cat-name-eval" data-prop-num="0"></div>
                          </div>
                        </div>
                      </form> 
                      <div class="form-button mr-pd" data-click="prop" data-prop="cat" data-prop-action="add">
                        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                      </div>
                    </div> 
                    <div class="pad-6 hidden-field" style="width: 100%;">
                      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
                        <div class="flex-l" style="width: 100%; height: 20px;">
                          <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
                        </div>
                        <div class="flex-br">
                        </div>
                        <div class="flex-l" style="padding: 0;">
                          <span class="sl-i">0.001</span>
                          <input class="flex-l input-range no-drag slider-input" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-prop="catValue" data-prop-num="0" data-prop-action="set">
                          <span class="sl-i">1000</span>
                        </div>
                      </div>
                    </div>
                    <div class="pad-6 hidden-field" style="width: 100%">
                      <textarea rows="2" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t" placeholder="Rating justification..." data-input="prop" data-prop="catReason" data-prop-num="0" data-prop-action="set"></textarea>
                      <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                        <div class="" style="color: #999; font-size: 14px;" data-prop="cat-reason-eval" data-prop-num="0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="NavBottom" style="width: auto; height: 0px; opacity: 0;">
      </div>
    </div>
  `)
  var container = document.querySelector("#navContainer");
  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  $('#NavPost').hover(() => {
    if ( $('#NavPostIcon').css('color') != 'rgb(251, 248, 194)' ) {
      $('#NavPostIcon').css('color', '#eee')
      $('#NavPostText').css('color', '#eee')
    }
    if ( !nav.getSearch() ) {
      $('#NavPost').css("background-color", "#444") }
    },
    () => { 
      $('#NavPost').css("background-color", "")
      if ( nav.getCurrent() !== 'post' ) {
        $('#NavPostIcon').css('color', '')
        $('#NavPostText').css('color', '')
      }
  });
  $('#NavCreate').hover(() => {
    if ( $('#NavCreateIcon').css('color') != 'rgb(251, 248, 194)' && $('#NavCreateIcon').css('color') != 'rgb(185, 183, 129)' ) {
      $('#NavCreateIcon').css('color', '#eee')
      $('#NavCreateText').css('color', '#eee')
    }
    if ( !nav.getSearch() ) {
      $('#NavCreate').css("background-color", "#444") }
    },
    () => { 
      $('#NavCreate').css("background-color", ''); 
      if ( nav.getCurrent() !== 'create' && nav.getTarget() !== 'create' ) {
        $('#NavCreateIcon').css('color', '')
        $('#NavCreateText').css('color', '')
      }
  });
  $('#NavHome').hover(() => {
    if ( $('#NavHomeIcon').css('color') != 'rgb(251, 248, 194)' && $('#NavHomeIcon').css('color') != 'rgb(185, 183, 129)' ) {
      $('#NavHomeIcon').css('color', '#eee')
      $('#NavHomeText').css('color', '#eee')
    }
    if ( !nav.getSearch() ) {
      $('#NavHome').css("background-color", "#444") }
    },
    () => { 
      $('#NavHome').css("background-color", '')
      if ( nav.getCurrent() !== 'home' && nav.getTarget() !== 'home') {
        $('#NavHomeIcon').css('color', '')
        $('#NavHomeText').css('color', '')
      }
  });
  $('#NavSearch').hover(() => {
    if ( $('#NavSearchIcon').css('color') != 'rgb(251, 248, 194)' ) {
      $('#NavSearchIcon').css('color', '#eee')
      $('#NavSearchText').css('color', '#eee')
    }
    if ( !nav.getSearch()) {
      $('#NavSearch').css("background-color", "#444") }
    },
    () => { 
      $('#NavSearch').css("background-color", '')
      if ( !nav.getSearch() ) {
        $('#NavSearchIcon').css('color', '')
        $('#NavSearchText').css('color', '')
      }
  });
  $(".no-drag").mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $(".no-drag").mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  if ( sen.reviewState() ) { $('.eval-btn').removeClass('hide-field') } 
  else { $('.eval-btn').addClass('hide-field') }
  $('#BackStep').off('click').on('click', postBackFn)
  $('#ForwardStep').off('click').on('click', postForwardFn)
  $('#PlatformPassword').off('keyup').on('keyup', e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      submitSignin();
    }
  } )
  $('#NavSearchField').off('keyup').on('keyup', () => {
    postSearchFn( nav.getSearchTarget() ) } )
  $('.inf-input').off('keyup').on('keyup', e => infInputFn(e))
  $('.cat-input').off('keyup').on('keyup', e => {catInputFn(e); copyText(e)})
  $('.author-input').off('keyup').on('keyup', e => {authorInputFn(e)
  copyAuthor()})  
  $('#RangeSliderCO').off('input').on('input', () => {
    let comVal = $('#RangeSliderCO').val()
    setColor(comVal, 10, [$('#CommentRange')])
    if ( comVal > 0 && comVal % 1 !== 0 || comVal == 10 ) {
      $('#CommentVal').text('+' + comVal) } 
    else if ( comVal == 0 ) {
        $('#CommentVal').text('0.0') } 
    else if ( comVal <=0 && comVal % 1 !== 0 || comVal == -10 ) {
      $('#CommentVal').text(comVal) } 
    else if ( comVal > 0 && comVal < 10 && comVal % 1 === 0 ) {
      $('#CommentVal').text('+' + comVal + '.0') } 
    else if ( comVal > -10 && comVal < 0 && comVal % 1 === 0 ) {
      $('#CommentVal').text(comVal + '.0') }
  })
  $('[data-input="prop"]').off('input').on('input', propRouter)
  $('[data-click="prop"]').off('click').on('click', propRouter)
  $('[data-prop="funding"]').css('width', $('[data-prop="hidden-display"]').width() + 5 )
  $('[data-prop="influence"]').on('input', () => {
    let infVal = $('[data-prop="influence"]').val()
    if ( infVal % 1 === 0 ) { $('[data-prop="influence-display"]').val(infVal + '.0%') } 
    else { $('[data-prop="influence-display"]').val(infVal + '%') }
    $('[data-click="prop"]').off('click').on('click', propRouter)
  })
  $('[data-prop="funding"]').off('input').on('input', propFunding)

  $('#SlideCom').on('input', () => {
    let comVal = $('#SlideCom').val()
    if ( comVal % 1 === 0 ) { $('#ComSlide').val(comVal + '.0%') } 
    else { $('#ComSlide').val(comVal + '%') }
  })
  $('#ComSources').hover( () => {
    if ( $('#PostComments')[0].style.height !== 'auto' && nav.getPostSub() === '#PostComments' ) {
      $('#PostComments').css('height', 'auto') }
  })
  $('[data-prop="cat"]')
  $('.cat-range').hover( () => {
    if ( $('#PostCategories')[0].style.height !== 'auto' && nav.getPostSub() === '#PostCategories' ) {
      $('#PostCategories').css('height', 'auto') }
  })
  $('.inf-range').hover( () => {
    if ( $('#PostInfluence')[0].style.height !== 'auto' && nav.getPostSub() === '#PostInfluence' ) {
      $('#PostInfluence').css('height', 'auto') }
  })
  $('.cat-on').off('input').on('input', catEval)
  $('.prop-eval').off('input').on('input', propEval)
  $('.inf-on').off('input').on('input', e => { infEval(e) } )
  $('#SlideInf1').off('touchend').on('touchend', e => { infEval(e, 1) } )
  $('#ComExplain').off('keyup').on('keyup', comEval )
  $('#RangeSliderCO').off('touchend').on('touchend', comEval )
  $('#SlideCom').off('touchend').on('touchend', comEval )
  $('.self-slider-input').off('click').on('click', catEval )
  $('.self-slider-input').off('touchend').on('touchend', catEval )
}

function spropFunding() {
  let num = $('[data-snav="back"]').attr('data-sprop-num')
  let infVal = $('[data-sprop="funding"]').val()
  $('[data-sprop="hidden-text"]').text(infVal)
  let boxWidth = $('[data-sprop="hidden-display"]').width() + 5
  $('[data-sprop="funding"]').css('width', boxWidth + 'px')
  prop.controller({target: 'funding', action: 'set', num })
}

function propFunding() {
  let infVal = $('[data-prop="funding"]').val()
  $('[data-prop="hidden-text"]').text(infVal)
  let boxWidth = $('[data-prop="hidden-display"]').width() + 5
  $('[data-prop="funding"]').css('width', boxWidth + 'px')
  eval.proposal({target: 'funding', action: 'set'})
}

function openSubmenu(itemParent, itemType, itemChild, menuType, dataList) {
  let parentBorder, parentActive, childBorder, childActive, hideInput, parentCat, childCat
  let searchQuery = $('#NavSearchField').val()
  let userName = userSchema.fullName
  if (menuType == 'mark') {
    cat.childParentToggle('mark', true)
    hideInput = ''
    parentBorder = ''
    parentActive = ' cursor: pointer;'
    childBorder = ' border: 0.5px solid #ddd;'
    childActive = ' pointer-events: none;'
    childCat = { _id: dataList.catId, name: dataList.name.toUpperCase() }
    if ( dataList.parent == 'General' ) {
      parentCat = { _id: '', name: 'GENERAL' } }
    else {
      parentCat = { _id: dataList.parent[0].category, name: dataList.parent[0].name.toUpperCase() } }
  }
  else if (menuType == 'add') {
    hideInput = 'hide-field'
    parentBorder = ' border: 0.5px solid #ddd;'
    parentActive = ' pointer-events: none;'
    childBorder = ''
    childActive = ' cursor: pointer;'
    childCat = { _id: '', name: 'ADD SUBCATEGORY' }
    parentCat = { _id: dataList.catId, name: dataList.name.toUpperCase() }
    $('#CatSearchBoxSub').attr('placeholder', 'ADD SUBCATEGORY' )
  }
  cat.storeChild(childCat)
  cat.storeParent(parentCat)
  $('[data-menus="' + itemParent + itemType + itemChild + '"]').append(`
    <div class="flex-l rank-menu` + itemType + itemChild + ` rank-menu-all" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
      <div class="pd-r4" style="padding: 2px;"><span class="fa fa-comment ft-14" style="font-size: 10px; margin: 8px 4px 0 0; visibility: hidden;"></span></div>
      <div style="width: 100%; border: 0.5px solid #999; background-color: #ddd; border-radius: 8px; margin-bottom: 4px;">
        <div class="flex-l" style="margin-bottom: 0px; background-color: #ccc; padding: 2px 4px; border-radius: 8px 8px 0 0;">
          <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 12px; padding: 0 3px;"></span></div>
          <div style="padding: 4px 8px 4px 0px; margin: 0; width: 100%; justify-content: left;" class="flex-l btn-pad">
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700;">` + userName + `</span></div>
          </div>
        </div>
        <div class="flex-br"></div>
        <div id="MainRankBox" class="" style="width: 100%; height: auto; min-height: 30px; color: #000; border-radius: 0 0 5px 5px; align-items: self-start; text-align: left; padding: 0;">
          <div id="RankBox" style="width: 100%;">
            <div class="flex-l rank-url" style="width: 100%; padding: 4px 4px 0 4px;" data-count="1">
              <div id="ModifyParent" class="form-button mr-pd hide-field" style="margin: 0 4px 0 0px; padding: 3px 5px; background-color: #c6c6c6; cursor: pointer; visibility: hidden;" data-count="1">
                <span class="fa fa-pencil-square-o" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
              </div>
              <form autocomplete="off" style="width: auto;">
                <div id="CatSearchTop" style="position: relative;` + parentActive +`">
                  <input id="CatSearchBoxTop" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 2px 6px; font-weight: 700; width: 100px; border-radius: 5px; pointer-events: none; text-transform: uppercase; background-color: #ddd;` + parentBorder + `" class="form-field no-drag span-eval" type="text" placeholder="Parent Category" value="` + parentCat.name + `" data-id="" data-count="1" data-num="Top"></input>
                  <span id="CloseSearch" class="fa fa-times hide-field search-btn" style="font-size: 12px; padding: 0; position: absolute; right: 6px; top: 3px; color: #666; opacity: 0; cursor: pointer;"></span>
                  <div id="HiddenCat" style="visibility: hidden; position: absolute; left: 0px; top: 0px;">
                    <span id="HiddenText" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 2px 6px; font-weight: 700; border-radius: 5px; pointer-events: none; text-transform: uppercase;" class="">` + parentCat.name + `<span>
                  </div>
                </div>
              </form>
              <span id="RankAddnew0" class="fa fa-chevron-right nav-v pt-18 rank-drop-down" style="padding: 4px 6px 1px 6px; color: #000; font-size: 13px; pointer-events: none;">
              </span>
              <form autocomplete="off" style="width: auto;">
                <div id="CatSearchSub" style="position: relative;` + childActive +`">
                  <input id="CatSearchBoxSub" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 2px 6px; font-weight: 700; width: 100px; border-radius: 5px; pointer-events: none; text-transform: uppercase; background-color: #ddd;` + childBorder + `" class="form-field no-drag span-eval" type="text" placeholder="Parent Category" value="` + childCat.name + `" data-id="" data-count="1" data-num="Sub"></input>
                  <span id="CloseSearchSub" class="fa fa-times hide-field sub-search-btn" style="font-size: 12px; padding: 0; position: absolute; right: 6px; top: 3px; color: #666; opacity: 0; cursor: pointer;"></span>
                  <span id="CheckSearchSub" class="fa fa-check hide-field sub-search-btn" style="font-size: 12px; padding: 0; position: absolute; right: 22px; top: 3px; color: #ccc; opacity: 0; pointer-events: none; cursor: pointer;"></span>
                  <div id="HiddenCatSub" style="visibility: hidden; position: absolute; left: 0px; top: 0px;">
                    <span id="HiddenTextSub" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 2px 6px; font-weight: 700; border-radius: 5px; pointer-events: none; text-transform: uppercase;" class="">` + childCat.name + `<span>
                  </div>
                </div>
              </form>
            </div> 
            <form autocomplete="off" style="width: 100%; padding: 4px 4px 0 4px;" class="flex-l rank-toggle ` + hideInput + `">
              <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                <div id="ComRange" class="spantip-box br-9" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
                  <div class="flex-br"></div>
                  <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                    <div class="flex-s"></div>
                    <input type="text" id="RankSlide" style="border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 12px; font-weight: 500;" class="com-slider form-field no-drag" data-id="" value="---"></input>
                    <div class="flex-s"></div>
                  </div>
                </div>
              </div>
              <div class="bc-e br-9" style="width: 100%; border-radius: 0 5px 5px 0; padding: 4px; border-left: 0; height: 24px; box-sizing: border-box;">
                <div style="width: 100%;">
                  <input id="SlideRank" class="flex-l input-range no-drag" orient="horizontal" type="range" step="1" value="100" min="1" max="100000" style="user-drag: none; user-select: none; height: 13px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;"></input>
                </div>
              </div>
            </form> 
            <div class="flex-l rank-toggle ` + hideInput + `" style="width: 100%; padding: 4px;">
              <textarea rows="4" id="RankReasoning" style="border-radius: 5px; width: 100%; background-color: #fff; font-size: 12px; font-family: Arial,sans-serif !important;" class="form-field no-drag bc-e span-eval" placeholder="Reasoning..."></textarea>
            </div>
            <div class="flex-l rank-url rank-toggle ` + hideInput + `" style="width: 100%; padding: 0 4px 4px 4px;" data-count="1">
              <form autocomplete="off" style="width: 100%;">
                <div>
                  <input style="width: 100%; border-radius: 5px;" class="rank-url-text form-field no-drag span-eval" type="text" placeholder="Source URL" data-id="" data-count="1"></input>
                </div>
              </form> 
              <div class="form-button add-rank-url mr-pd" style="margin: 0 0 0 4px;" data-count="1">
                <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
              </div>
            </div> 
          </div>
        </div>
        <div class="flex-br"></div>
      </div>
    </div>
    <div class="flex-l rank-menu` + itemType + itemChild + ` rank-menu-all" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
      <div class="pd-r4" style="padding: 2px;"><span class="fa fa-comment ft-14" style="font-size: 10px; margin: 8px 4px 0 0; visibility: hidden;"></span></div>
      <div class="flex-l" style="width: 100%;">
        <div class="flex-s" style="width: 100%;"></div>
        <div id="ResetRank" style="padding: 4px 6px; margin: 0; width: auto; border-radius: 8px; background-color: #ddd; justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt reset-btn` + itemChild + `">
          <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-undo ft-14" style="font-size: 10px;"></span></div>
        </div>
        <div style="padding: 3px 6px 5px 6px; margin: 0 0 0 4px; width: auto; border-radius: 8px; background-color: #ddd;  justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt" data-action="close">
          <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-times ft-14" style="font-size: 10px;"></span></div>
        </div>            
        <div id="SendRank" style="padding: 4px 7px 4px 5px; margin: 0 0 0 4px; width: auto; border-radius: 8px; background-color: #ddd; justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt send-btn` + itemChild + `">
          <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-paper-plane ft-14" style="font-size: 10px;"></span></div>
        </div>
      </div>
    </div>
  `)
  $('#CatSearchBoxTop').css('width', $('#HiddenCat').width() + 2 )
  $('#CatSearchBoxSub').css('width', $('#HiddenCatSub').width() + 2 )
  rankEval(menuType)
  if (menuType == 'add') { 
    setTimeout( () => { 
      openChildCat()
    }, 200);
  }
  $(".no-drag").mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $(".no-drag").mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  $('#ResetRank').off('click').on('click', e => { 
    $('.rank-url-text').val('')
    $('#RankReasoning').val('')
    $('#SlideRank').val(100)
    $('#RankSlide').val('---')
    if (menuType == 'mark') {
      $('#CatSearchBoxTop').val(parentCat.name)
      $('#CatSearchBoxTop').attr('placeholder', parentCat.name )
      $('#HiddenText').text(parentCat.name)
      cat.storeParent(parentCat)
      closeParentCat()
    }
    else if (menuType == 'add') {
      $('#CatSearchBoxSub').val(childCat.name)
      $('#CatSearchBoxSub').attr('placeholder', childCat.name )
      $('#HiddenTextSub').text(childCat.name)
      cat.storeChild(childCat)
      checkChild(parentCat)
      openChildCat()
    }
    $('.cat-list').remove()
    rankEval(menuType)
  })
  $('.add-rank-url').off('click').on('click', addRankSource )
  $('#CatSearchTop').off('click').on('click', openParentCat )
  $('#CatSearchSub').off('click').on('click', openChildCat )
  $('#CatSearchBoxTop').off('keyup').on('keyup', e => { 
    $('#HiddenText').text( $('#CatSearchBoxTop').val().toUpperCase() )
    catInputFn(e)
    rankEval(menuType)
  })
  $('#CatSearchBoxSub').off('keyup').on('keyup', e => { 
    $('#HiddenTextSub').text( $('#CatSearchBoxSub').val().toUpperCase() )
    catInputFn(e)
    checkChild(parentCat)
    rankEval(menuType)
  })
  $('[data-action="close"]').off('click').on('click', () => {
    let closeMenu = sen.previous()
    sen.subsDropdown(closeMenu.child, closeMenu.type, closeMenu.parent, {menu: 'none'})
    $('.rank-drop-down').css('color', '#000')
    $('.rank-menu-all').remove()
  })
  $('#SendRank').off('click').on('click', e => {
    let rankValue = $('#SlideRank').val()
    let rankPerc = (rankValue/1000).toFixed(3)
    let markData = {
      'childName': cat.storeChild().name.toUpperCase(),
      'childId': cat.storeChild()._id,
      'rankReason': $('#RankReasoning').val(),
      'rankVal': rankPerc,
      'rankSources': [],
      'parentName': cat.storeParent().name.toUpperCase(),
      'parentId': cat.storeParent()._id,
      'type': menuType
    }
    for (let i = 0; i <  $('.rank-url-text').length; i++) {
      let rankUrl = $('.rank-url-text')[i].value
      if ( rankUrl !== '' ) { markData.rankSources.push(rankUrl) }
    }
    if ( sen.rankToggle() && !cat.sentCat() ) { 
      let posId = { 'child': itemChild, 'type': itemType, 'parent': itemParent }
      sen.rankToggle(false)
      cat.sentCat(true)
      $('#SendRank > div > span').css('color', '#999')
      $('#SendRank').css({'background-color': '#ddd', 'pointer-events': 'none', 'cursor': ''})
      chrome.runtime.sendMessage( { 'message': 'Send Cat Ranking', 'data': { 'ranking': markData, 'position': posId } } );
    }
  })
  $('#RankReasoning').off('keyup').on('keyup', () => { rankEval(menuType) })
  $('#SlideRank').on('input', () => {
    let rankVal = $('#SlideRank').val()
    let rankPercent = (rankVal/1000).toFixed(3)
    $('#RankSlide').val(rankPercent + '%')
    rankEval(menuType)
  })
  $('.mark-menu').off('click').on('click', openCatRank)
}

function propRouter(e) {
  let propTarget = $(e.target).attr('data-prop')
  let propAction = $(e.target).attr('data-prop-action')
  let propNum = $(e.target).attr('data-prop-num')
  if ( propAction === 'add' ) {
    if ( propTarget === 'source' ) { 
      addPropSource() }
    else if ( propTarget === 'cat' ) { 
      addPropCat() }
  }
  else if ( propAction === 'remove' ) {
    if ( propTarget === 'source' ) { 
      removePropSource(e) }
    else if ( propTarget === 'cat' ) { 
      removePropCat(e) }
  }
  else if ( propAction === 'reset' ) { resetProp(e) }
  else if ( propAction === 'set' && propTarget === 'catValue' ) {
    eval.proposal({target: propTarget, action: 'add', num: propNum})
  }
  else if ( propAction === 'set' && propTarget === 'catName' ) {
    eval.proposal({target: propTarget, action: 'remove', num: propNum})
    catInputFn(e)
    copyText(e)
  }
  else { eval.proposal({target: propTarget, action: propAction, num: propNum}) }
}

function openCatRank(e) {
  let searchQuery = $('#NavSearchField').val()
  let itemChild = parseFloat( $(e.target).attr('data-child') )
  let itemType = $(e.target).attr('data-type')
  let itemParent = parseFloat( $(e.target).attr('data-parent') )
  let menuType = $(e.target).attr('data-menu')
  let dataList = []
  if (itemType !== 'new') {
    let catData = sen.subsDropdown(itemChild, itemType, itemParent, {get: 'data'})
    let parent = 'General'
    if ( catData.parent.categories.length !== 0 ) {
      parent = catData.parent.categories.sort( (prev, current) => { 
        return (prev.userScore > current.userScore) ? prev : current } )
    }
    dataList = {
      catId: catData._id,
      name: catData.name,
      parent: parent
    }
  }
  else {
    dataList = {
      catId: '',
      name: searchQuery,
      parent: 'General'
    }
  }
  let prevClick = sen.previous()
  sen.previous(itemChild, itemType, itemParent, menuType)
  if ( prevClick.child == itemChild && prevClick.type == itemType && prevClick.parent == itemParent) {
    if ( sen.subsDropdown(itemChild, itemType, itemParent, {get: 'menu'}) == menuType ) {
      sen.subsDropdown(itemChild, itemType, itemParent, {menu: 'none'})
      $('.rank-drop-down').css('color', '#000')
      $('.rank-menu-all').remove()
    }
    else {
      sen.subsDropdown(itemChild, itemType, itemParent, {menu: menuType})
      $('.rank-drop-down').css('color', '#000')
      $('.rank-menu-all').remove()
      $('[data-rank-' + menuType + '="' + itemParent + itemType + itemChild + '"]').css('color', '#900') 
      openSubmenu(itemParent, itemType, itemChild, menuType, dataList)
    }
  }
  else if ( prevClick.child !== itemChild || prevClick.type !== itemType || prevClick.parent !== itemParent ) {
    sen.subsDropdown(prevClick.child, prevClick.type, prevClick.parent, {menu: 'none'})
    $('.rank-drop-down').css('color', '#000')
    $('.rank-menu-all').remove()
    sen.subsDropdown(itemChild, itemType, itemParent, {menu: menuType})
    $('[data-rank-' + menuType + '="' + itemParent + itemType + itemChild + '"]').css('color', '#900') 
    openSubmenu(itemParent, itemType, itemChild, menuType, dataList)
  }
}
 
function postScore() {
  let total = $('#CSBoxPost')
  let totalCS = postSchema.CS.toFixed(2)
  let totalPS = postSchema.PS.toFixed(2)
  if ( totalCS > 0 ) { $('#TotalCSPost').text('+' + totalCS) } 
  else { $('#TotalCSPost').text(totalCS) }
  $('#TotalPSPost').text(totalPS)
  setColor(totalCS, 10, [total])
}

function copyAuthor() {
  $('#NewAuthor').text( $('#AuthSearch').val() )
  $('#NewAuth').attr('data-name', $('#AuthSearch').val() )
}

function copyText(e) {
  targetId = e.target.getAttribute('data-num')
  $('#SelfSearchBox' + targetId).val( $(e.target).val() )
}

function postBackFn() {
  if ( nav.getPostSub() === '#PostComments' ) { 
    postSubMenu(nav.getPostSub(), '#PostInfluence')} 
  else if ( nav.getPostSub() === '#PostInfluence' ) {
    postSubMenu(nav.getPostSub(), '#PostCategories')} 
  else if ( nav.getPostSub() === '#PostCategories' ) {
    postSubMenu(nav.getPostSub(), '#PostText')} 
  else if ( nav.getPostSub() === '#PostText' ) {
    postSubMenu(nav.getPostSub(), '#PostSummary')} 
  else { return }
}

function postForwardFn() {
  if ( nav.getPostSub() === '#PostSummary' ) { 
    postSubMenu(nav.getPostSub(), '#PostText') } 
  else if ( nav.getPostSub() === '#PostText' ) {
    postSubMenu(nav.getPostSub(), '#PostCategories') } 
  else if ( nav.getPostSub() === '#PostCategories' ) {
    postSubMenu(nav.getPostSub(), '#PostInfluence') } 
  else if ( nav.getPostSub() === '#PostInfluence' ) {
    postSubMenu(nav.getPostSub(), '#PostComments') } 
  else { return }
}

function catRankInputFn(e) {
  let rankSearch = $(e.target).val();
  if ( rankSearch !== '' && rankSearch !== ' ' ) {
    chrome.runtime.sendMessage({ message: 'Rank Search', data: { 'author': rankSearch	}})} 
  else if ( rankSearch === '') {
    $('.authors-tab').remove() 
    $('#NewAuthBorder').css({'border-radius': '5px'}).addClass('hide-field')
  }
  return;
}

function authorInputFn(e) {
  let authorSearch = $(e.target).val();
  if ( authorSearch !== '' && authorSearch !== ' ' ) {
    chrome.runtime.sendMessage({ message: 'Author Search', data: { 'author': authorSearch	}	})} 
  else if ( authorSearch === '') {
    $('.authors-tab').remove() 
    $('#NewAuthBorder').css({'border-radius': '5px'}).addClass('hide-field')
  }
  return;
}

function addCatSearchFn(e) {
  let categorySearch = $(e.target).val();
  targetId = e.target.id.substr(12)
  if ( categorySearch !== '' ) {
    chrome.runtime.sendMessage({ message: 'Add Cat Search', data: { 'category': categorySearch	}})} 
  else if ( categorySearch == '') { $('#SearchCategories').empty() }
  return;
}

function catInputFn(e) {
  let categorySearch = $(e.target).val();
  targetId = $(e.target).attr('data-num')
  // console.log(targetId)
  if ( categorySearch !== '' ) {
    chrome.runtime.sendMessage({ message: 'Category Search', data: { 'category': categorySearch	}	}) } 
  else if ( categorySearch === '') { $('.cat-list').remove() }
  return;
}

function postSearchFn(set) {
  let postSearch = $('#NavSearchField').val();
  if ( postSearch !== '' ) {
    if ( $('#NavSearchMenu').height() == 0 ) {
      if ( set !== 'Category' ) {
        $('.rank-btn').addClass('hide-field')
        $('.rev-btn').addClass('hide-field')
        $('.sort-btn').removeClass('hide-field')
        $('.filter-btn').removeClass('hide-field')
      }
      else {
        $('.rank-btn').removeClass('hide-field')
        $('.rev-btn').removeClass('hide-field')
        $('.sort-btn').addClass('hide-field')
        $('.filter-btn').addClass('hide-field')
      }
      openNavbar(50, 0)
      expandMenu('#NavSearchMenu', 150, 50)
      $('#NavSearchMenu').css('height', 'auto')
    }
    chrome.runtime.sendMessage({ message: 'Nav ' + set + ' Search', data: { 'post': postSearch	}})
  }
  else if ( nav.getSearchTarget() !== 'Category' ) {
    collapseMenu('#NavSearchMenu', 300, 0);
    closeNavbar(25, 285)
    // console.log('empty search')
  }
  else {
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultCount').text('')
    $('#ResultTitle').text(' SEARCH RESULTS')
    $('#SearchCategories').empty()
  }
}

function infInputFn(e) {
  let influenceSearch = $(e.target).val();
  // console.log(influenceSearch)
  // console.log(e.target.id)
  targetId = e.target.id.substr(12)
  if ( influenceSearch !== '' ) {
    chrome.runtime.sendMessage({ message: 'Post Search', data: { 'influence': influenceSearch	}})} 
  else if ( influenceSearch === '') { $('.inf-list').remove() }
  return;
}

function closeNavbar(duration, timeout) {
  setTimeout( () => { 
    anime({
      targets: '#NavBottom',
      direction: 'normal',
      duration: duration,
      delay: 0,
      height: ['14px', '0px'],
      easing: 'easeInSine'
    });
  }, timeout);
}

function openNavbar(duration, timeout) {
  let extendTime = timeout + duration + 250
  setTimeout( () => { 
    anime({
      targets: '#NavBottom',
      direction: 'normal',
      duration: duration,
      delay: 0,
      height: ['0px', '14px'],
      easing: 'easeInSine'
    });
  }, timeout);
  setTimeout( () => { 
    if ( $('#NavBottom').height() == 0 ) { openNavbar(duration, timeout) }
  }, extendTime);
}

function navReviewMenu() {
  if ( !nav.getLogin() ) {
    nav.setTarget('post');
    nav.setCurrent('login');
    collapseMenu('#NavPostMenu', 300, 0)
    closeNavbar(25, 285)
    openNavbar(50, 360)
    expandMenu('#NavLoginMenu', 400, 410) } 
  else if ( nav.getLogin() ) {
    $('.com-e').removeClass('hide-field')
    reviewTransform()
    if (!commentSchema.fetched) { getUserComments() } 
    else { populateComments() }
    sen.reviewState(true) }
}

function getUserComments() {
  chrome.runtime.sendMessage({ message: 'Find User Comments', data: { 'postId': postSchema.postId	}	})
}

function reviewTransform() {
  $('.rev-on').removeClass('hide-field')
  $('.rev-off').addClass('hide-field')
  $('.eval-btn').removeClass('hide-field')
  expandMenu('#ReviewMenu', 300, 0)
  $('#NavPostMenu').css('height', 'auto')
  if ( nav.getPostSub() !== '#PostSummary') {
    postSubMenu(nav.getPostSub(), '#PostSummary') }
  if ( $('#ReviewMenuTitle').hasClass('hide-field') ) {
    $('#ReviewMenuTitle').removeClass('hide-field').addClass('show-field') }
  anime({
    targets: ['#PostSigninPage'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeOutQuart'
  });
  anime({
    targets: ['PostTextIcon'],
    direction: 'normal',
    duration: 50,
    delay: 0,
    opacity: [0, 1],
    easing: 'easeOutQuart'
  });
  anime({
    targets: ['#ReviewMenuTitle'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [0, 1],
    easing: 'easeOutQuart'
  });
}

function evalCount(target) {
  let failCount = 0;
  let classEval = '';
  if ( target === 'Inf' ) { classEval = '.inf-eval-btn' }
  else if ( target === 'Cat' ) { classEval = '.cat-eval-btn' }
  else if ( target === 'Text' ) { classEval = '.com-e' }
  let evals = $(classEval)
  if (evals) {
    for (let i = 0; i < evals.length; i++) {
      if ( $('#' + evals[i].id).hasClass('fa-times-circle') ) { failCount++ }
    }
  }
  if ( failCount > 0 ) {
    $('#Fail' + target).removeClass('hide-field').text(failCount)
    $('#Fail' + target + 'Icon').removeClass('hide-field')
  }
  else {
    $('#Fail' + target).addClass('hide-field')
    $('#Fail' + target + 'Icon').addClass('hide-field')
  }
}

function reviewCloseTransform() {
  sen.reviewState(false)
  $('.rev-on').addClass('hide-field')
  $('.rev-off').removeClass('hide-field')
  $('.eval-btn').addClass('hide-field')
  $('.com-e').addClass('hide-field')
  populatePost()
  collapseMenu('#ReviewMenu', 300, 0)
  if ( $('#PostSigninPage').hasClass('hide-field') ) {
    $('#PostSigninPage').removeClass('hide-field').addClass('show-field') }
  if ( $('#PostTextIcon').hasClass('hide-field') ) {
    $('#PostTextIcon').removeClass('hide-field').addClass('show-field') }
  anime({
    targets: ['#PostSigninPage', 'PostTextIcon'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [0, 1],
    easing: 'easeOutQuart'
  });
  anime({
    targets: ['#ReviewMenuTitle'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeOutQuart'
  });
  setTimeout( () => { 
    if ( $('#ReviewMenuTitle').hasClass('show-field') ) {
      $('#ReviewMenuTitle').removeClass('show-field').addClass('hide-field') } }, 450);
}

function expandMenu(target, duration, timeout) {
  if ( $(target).hasClass('hide-menu') ) {
    $(target).removeClass('hide-menu').addClass('show-menu') }
  let targetElem = target.substr(1)
  if ( $('#' + targetElem)[0].style.height == 'auto' ) {
    let elemHeight = $(target).height();
    $(target).css('height', elemHeight) }
  let easing = 'easeOutElastic';
  let targetContent = document.querySelector(target).children;
  let menuHeight = targetContent[0].clientHeight + 'px';
  if ( target === '#NavLoginMenu' ) {
    $('#NavLoginMenu').css('transform', '')
    // console.log('login offset')
    if ($('#PlatformContextMenu').offset().left !== $('#NavLoginMenu').offset().left) {
      let leftShift = $('#PlatformContextMenu').offset().left - $('#NavLoginMenu').offset().left
      $('#NavLoginMenu').css({'transform': 'translate3d(' + leftShift + 'px, 0, 0)', 'transition-duration': '0.0s', 'transition-delay': '0.0s'})
    }
  }
  if ( target === '#NavSearchMenu' || target === '#ReviewMenu' ) {
    menuHeight = 'auto'
  }
  if ( document.querySelector(target).clientHeight > targetContent[0].clientHeight) {
    easing = 'easeOutQuint' } 
  else { easing = 'easeOutElastic' }
  setTimeout( () => { 
    anime({
      targets: target,
      direction: 'normal',
      duration: duration,
      delay: 0,
      height: menuHeight,
      easing: easing
    })
  }, timeout);
  setTimeout( () => { 
    $(target).css('height', 'auto')
  }, timeout + duration + 15);
  setTimeout( () => { 
    $(target).css('height', 'auto')
  }, timeout + duration + 105);
}

function collapseMenu(target, duration, timeout) {
  if ( $(target).hasClass('show-menu') ) {
    $(target).removeClass('show-menu').addClass('hide-menu') }
  let targetElem = target.substr(1)
  if ( $('#' + targetElem)[0].style.height == 'auto' ) {
    let elemHeight = $(target).height();
    $(target).css('height', elemHeight) }
  setTimeout( () => { 
    anime({
      targets: target,
      direction: 'normal',
      duration: duration,
      delay: 0,
      height: 0,
      easing: 'easeInBack'
    })
  }, timeout);
}

function navPostMenu() {
  if ( nav.getSearch() ) {
    navSearchMenu() 
    setTimeout( () => { navPostFn() }, 250);
  }
  else { navPostFn() }
}

function navPostFn() {
  if ( nav.getCurrent() === 'none' ) {
    nav.setCurrent('post');
    nav.setTarget('none');
    $('.main-nav').css('color', 'rgb(204, 204, 204)')
    $('#NavPostText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    $('#NavPostIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    openNavbar(50, 0)
    expandMenu('#NavPostMenu', 400, 50) } 
  else if ( nav.getCurrent() === 'post' ) {
    nav.setCurrent('none');
    nav.setTarget('none');
    $('.main-nav').css('color', 'rgb(204, 204, 204)')
    collapseMenu('#NavPostMenu', 300, 0);
    closeNavbar(25, 285) } 
  else if ( nav.getCurrent() !== 'post' ) {
    nav.setCurrent('post');
    nav.setTarget('none');
    $('.main-nav').css('color', 'rgb(204, 204, 204)')
    $('#NavPostText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    $('#NavPostIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    let menuId = nav.getId()
    if ( menuId !== '' ) {
      collapseMenu(menuId, 300, 0)
      closeNavbar(25, 285)
    }
    openNavbar(50, 360)
    expandMenu('#NavPostMenu', 400, 410) }
}

function navMenu(target) {
  if ( $(target).height() !== 0) {
    collapseMenu(target, 300, 0)
    closeNavbar(25, 285) } 
  else {
    openNavbar(50, 0)
    expandMenu(target, 400, 50) }
}

function navHomeFn() {
  if ( nav.getLogin() ) { 
    if ( nav.getCurrent() === 'none' ) {
      nav.setCurrent('home');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavHomeText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavHomeIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      openNavbar(50, 0)
      expandMenu('#NavHomeMenu', 400, 50) } 
    else if ( nav.getCurrent() === 'home' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      collapseMenu('#NavHomeMenu', 300, 0);
      closeNavbar(25, 285) } 
    else if ( nav.getCurrent() !== 'home' ) {
      nav.setCurrent('home');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavHomeText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavHomeIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      let menuId = nav.getId()
      if ( menuId !== '' ) {
        collapseMenu(menuId, 300, 0)
        closeNavbar(25, 285) }
      openNavbar(50, 360)
      expandMenu('#NavHomeMenu', 400, 410) } } 
  else if ( !nav.getLogin() ) {
    if ( nav.getCurrent() === 'none' ) {
      nav.setTarget('home');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavHomeText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavHomeIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      openNavbar(50, 0)
      expandMenu('#NavLoginMenu', 400, 50) } 
    else if ( nav.getTarget() !== 'home' & nav.getCurrent() === 'login' ) {
      nav.setTarget('home');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavHomeText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavHomeIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      collapseMenu('#NavLoginMenu', 300, 0)
      closeNavbar(25, 285)
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410) } 
    else if ( nav.getTarget() === 'home' & nav.getCurrent() === 'login' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      collapseMenu('#NavLoginMenu', 300, 0);
      closeNavbar(25, 285) } 
    else if ( nav.getCurrent() !== 'none' ) {
      nav.setCurrent('login');
      nav.setTarget('home');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavHomeText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavHomeIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      let menuId = nav.getId()
      if ( menuId !== '' ) {
        collapseMenu(menuId, 300, 0)
        closeNavbar(25, 285) }
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410) } }
}

function navHomeMenu() {
  if ( nav.getSearch() ) {
    navSearchMenu() 
    setTimeout( () => { navHomeFn() }, 250);
  }
  else { navHomeFn() }
}

function navCreateFn() {
  if ( nav.getLogin() ) { 
    if ( nav.getCurrent() === 'none' ) {
      nav.setCurrent('create');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavCreateText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavCreateIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      openNavbar(50, 0)
      expandMenu('#NavCreateMenu', 400, 50) } 
    else if ( nav.getCurrent() === 'create' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      collapseMenu('#NavCreateMenu', 300, 0);
      closeNavbar(25, 285) } 
    else if ( nav.getCurrent() !== 'create' ) {
      nav.setCurrent('create');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavCreateText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavCreateIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      let menuId = nav.getId()
      if ( menuId !== '' ) {
        collapseMenu(menuId, 300, 0)
        closeNavbar(25, 285) }
      openNavbar(50, 360)
      expandMenu('#NavCreateMenu', 400, 410) } } 
  else if ( !nav.getLogin() ) {
    if ( nav.getCurrent() === 'none' ) {
      nav.setTarget('create');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavCreateText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavCreateIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      openNavbar(50, 0)
      expandMenu('#NavLoginMenu', 400, 50) } 
    else if ( nav.getTarget() !== 'create' & nav.getCurrent() === 'login' ) {
      nav.setTarget('create');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavCreateText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavCreateIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      collapseMenu('#NavLoginMenu', 300, 0)
      closeNavbar(25, 285)
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410) } 
    else if ( nav.getTarget() === 'create' & nav.getCurrent() === 'login' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      collapseMenu('#NavLoginMenu', 300, 0);
      closeNavbar(25, 285) } 
    else if ( nav.getCurrent() !== 'none' ) {
      nav.setCurrent('login');
      nav.setTarget('create');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavCreateText').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      $('#NavCreateIcon').attr('style', 'color: rgb(185, 183, 129) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      let menuId = nav.getId()
      if ( menuId !== '' ) {
        collapseMenu(menuId, 300, 0)
        closeNavbar(25, 285) }
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410) } }
}

function navCreateMenu() {
  if ( nav.getSearch() ) {
    navSearchMenu() 
    setTimeout( () => { navCreateFn() }, 250);
  }
  else { navCreateFn() }
}

function navSearchMenu() {
  if ( nav.getSearch() ) {
    if ( $('#NavSearchMenu').height() !== 0 ) {
      collapseMenu('#NavSearchMenu', 300, 0);
      closeNavbar(25, 285)
    }
    $('#NavSearchField').val('')
    $('.main-nav').css('color', 'rgb(204, 204, 204)')
    if ( nav.getSearchX() ) {
      $('#PlatformContextMenu').css({'width': '325px', 'transform': 'translate3d(0, 0, 0)', 'transition-duration': '0.25s'}) }
    else {
      $('#PlatformContextMenu').css({'width': '325px', 'transition-duration': '0.25s'}) }
    $('#NavSearchField').css({'opacity': 0, 'transition-duration': '0.25s', 'transition-delay': '0.0s', 'transform': 'translate3d(0px, 0, 0)', 'width': '0px'})
    $('#SubPlatform').attr('style', 'width: 325px; transform: translate3d(0, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
    $('#NavSearch').attr('style', 'transform: translate3d(0, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
    $('#NavPost').attr('style', 'transform: translate3d(0, 0, 0) scale(1); transition-duration: 0.25s; transition-delay: 0.0s;')
    $('#NavCreate').attr('style', 'transform: translate3d(0, 0, 0) scale(1); transition-duration: 0.25s; transition-delay: 0.0s;')
    $('#NavHome').attr('style', 'transform: translate3d(0, 0, 0) scale(1); transition-duration: 0.25s; transition-delay: 0.0s;')
    $('#NavSearchPosts').addClass('hide-field')
    $('#NavSearchUsers').addClass('hide-field')
    $('#NavSearchProposals').addClass('hide-field')
    $('#NavSearchCategories').addClass('hide-field')
    setTimeout( () => { 
      $('#NavSearchMenu').css({'transition-duration': '', 'transform': ''})
      $('#NavSearchField').addClass('hide-field')
      $('#NavPostText').removeClass('hide-field')
      $('#NavCreateText').removeClass('hide-field')
      $('#NavHomeText').removeClass('hide-field')
      $('#PlatformContextMenu').css({'transition-duration': ''})
    }, 300);
    nav.getSearch(false)
    nav.getSearchX(false)
  }
  else if ( !nav.getSearch() ){
    if ( nav.getCurrent() !== 'none' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      collapseMenu('#NavPostMenu', 300, 0);
      collapseMenu('#NavCreateMenu', 300, 0);
      collapseMenu('#NavHomeMenu', 300, 0);
      collapseMenu('#NavLoginMenu', 300, 0);
      closeNavbar(25, 285) 
    }
    collapseMenu('#NavLogoutMenu', 200, 0)
    $('.main-nav').css('color', 'rgb(204, 204, 204)')
    $('#NavSearchText').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    $('#NavSearchIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
    $('#NavSearchField').removeClass('hide-field')
    setTimeout( () => {
      $("#NavSearchField").focus()
      let xDist = $(window).width() - ($('#PlatformContextMenu').offset().left + $('#PlatformContextMenu').width())
      if ( xDist > 210 ) {
        $('#NavSearchField').css({'opacity': 1, 'transition-duration': '0.0s', 'transition-delay': '0.25s', 'transform': 'translate3d(-200px, 0, 0)', 'width': '375px', 'transition-delay': '0.0s'})
        $('#PlatformContextMenu').css({'width': '525px', 'transform': 'translate3d(0, 0, 0)', 'transition-duration': '0.25s', 'transition-delay': '0.0s'})
        $('#SubPlatform').attr('style', 'width: 525px; transform: translate3d(200px, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavSearch').attr('style', 'transform: translate3d(-200px, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavPost').attr('style', 'transform: translate3d(160px, -15px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavCreate').attr('style', 'transform: translate3d(90px, 4px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavHome').attr('style', 'transform: translate3d(20px, 24px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
      }
      else {
        nav.getSearchX(true)
        $('#NavSearchField').css({'opacity': 1, 'transition-duration': '0.25s', 'transition-delay': '0.0s', 'transform': 'translate3d(-200px, 0, 0)', 'width': '375px'})
        $('#PlatformContextMenu').css({'width': '525px', 'transform': 'translate3d(-200px, 0, 0)', 'transition-duration': '0.25s', 'transition-delay': '0.0s'})
        $('#SubPlatform').attr('style', 'width: 525px; transform: translate3d(200px, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavSearch').attr('style', 'transform: translate3d(-200px, 0, 0); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavPost').attr('style', 'transform: translate3d(160px, -15px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavCreate').attr('style', 'transform: translate3d(90px, 4px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
        $('#NavHome').attr('style', 'transform: translate3d(20px, 24px, 0) scale(0.6); transition-duration: 0.25s; transition-delay: 0.0s;')
      }
    }, 350);
    setTimeout( () => { 
      $('#NavPostText').addClass('hide-field')
      $('#NavCreateText').addClass('hide-field')
      $('#NavHomeText').addClass('hide-field')
    }, 300);
    setTimeout( () => { 
      $('#PlatformContextMenu').css({'transition-duration': ''})
      $('#NavSearchPosts').removeClass('hide-field')
      $('#NavSearchUsers').removeClass('hide-field')
      $('#NavSearchProposals').removeClass('hide-field')
      $('#NavSearchCategories').removeClass('hide-field')
      if ($('#PlatformContextMenu').offset().left !== $('#NavSearch').offset().left) {
        $('#SubPlatform').attr('style', 'transform: translate3d(270px, 0px, 0); transition-duration: 0.0s; transition-delay: 0.0s;')
        let leftShift = $('#PlatformContextMenu').offset().left - $('#SearchPageBox').offset().left
        $('#NavSearchMenu').css({'transform': 'translate3d(' + leftShift + 'px, 0, 0)', 'transition-duration': '0.0s', 'transition-delay': '0.0s'})
      }
    }, 600);
    setTimeout( () => { 
      if ( nav.getSearchTarget() === 'Category' ) {
        postSearchFn( nav.getSearchTarget() )
        // console.log(cat.catData('top'))
        if ( cat.catData('top').length == 0 ) {
          chrome.runtime.sendMessage( { 'message': 'Category List' } );}
        else { populateCategories() }
      }
    }, 800);
    nav.getSearch(true)
  }
}

function closeLogin() {
  setTimeout( () => { 
    $('#NavLoginMenu').css('opacity', '0').removeClass('show-login').addClass('hide-login');
    anime({
      targets: '#NavBottom',
      direction: 'normal',
      duration: 50,
      delay: 0,
      height: ['14px', '0px'],
      easing: 'easeInSine'
    });
  }, 600);
  setTimeout( () => { 
    anime({
      targets: '#NavLoginMenu',
      direction: 'normal',
      duration: 200,
      delay: 0,
      height: ['145px', '0px'],
      easing: 'easeOutElastic'
    });
  }, 400);
  setTimeout( () => { 
    $('#SigninPage').css('opacity', '0').removeClass('show-field').addClass('hide-field');
    $('#SigninPage').css('opacity', '0').removeClass('show-field').addClass('hide-field');
    $('.login-field').css('opacity', '0').removeClass('show-field').addClass('hide-field');
    $('.login-button').css('opacity', '0').removeClass('show-field').addClass('hide-field');
  }, 400);
  setTimeout( () => { 
    anime({
      targets: ['#SigninPage', '#SigninPage', '.login-field', '.login-button'],
      direction: 'normal',
      duration: 400,
      delay: 0,
      opacity: [1, 0],
      easing: 'easeOutQuart'
    });
  }, 0);
}

function logoutProcess() {
  nav.setTarget('none');
  if ( $('#NavHomeMenu').hasClass('show-menu') || $('#NavCreateMenu').hasClass('show-menu') ) {
    nav.setCurrent('none')
    let menuId = nav.getId()
    if ( menuId !== '' ) {
      collapseMenu(menuId, 300, 0)
      closeNavbar(25, 285) }
    logoutTransition() } 
  else { logoutTransition() }
}

function loginTransition() {
  anime({
    targets: ['#CreateLock', '#HomeLock'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeOutQuart'
  });
  anime({
    targets: '#NavLoginIcon',
    direction: 'normal',
    duration: 200,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeOutQuart'
  });
  setTimeout( () => { 
    $('#NavLoginIcon').removeClass('fa-key').addClass(['fa-unlock', 'lock-color']);
    $('#NavLogin').removeClass('rotated');
    anime({
      targets: '#NavLoginIcon',
      direction: 'normal',
      duration: 200,
      delay: 0,
      opacity: [0, 1],
      easing: 'easeOutCubic'
    });
  }, 500);
  setTimeout( () => { 
    $('#CreateLock').removeClass('show-lock').addClass('hide-lock');
    $('#HomeLock').removeClass('show-lock').addClass('hide-lock');
    $('#NavCreate').removeClass('NeedLogin').addClass('logged-in');
    $('#NavHome').removeClass('NeedLogin').addClass('logged-in');
    $('.review-btn').removeClass('button-disabled');
    return;
  }, 400);
  if ( $('.review-btn').hasClass('show-login') ) { closeLogin() }
  setTimeout( () => { 
    if ( nav.getTarget() === 'create') { navCreateMenu() } 
    else { return }
  }, 800);
}

function logoutTransition() {
  $('#CreateLock').css('opacity', '0').removeClass('hide-lock').addClass('show-lock');
  $('#HomeLock').css('opacity', '0').removeClass('hide-lock').addClass('show-lock');
  $('.review-btn').addClass('button-disabled');
  anime({
    targets: ['#CreateLock', '#HomeLock'],
    direction: 'normal',
    duration: 400,
    delay: 0,
    opacity: [0, 1],
    easing: 'easeOutQuart'
  });
  anime({
    targets: '#NavLoginIcon',
    direction: 'normal',
    duration: 200,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeOutQuart'
  });
  setTimeout( () => { 
    $('#NavLoginIcon').removeClass(['fa-unlock', 'lock-color']).addClass('fa-key')
    $('#NavLogin').addClass('rotated')
    anime({
      targets: '#NavLoginIcon',
      direction: 'normal',
      duration: 200,
      delay: 0,
      opacity: [0, 1],
      easing: 'easeOutCubic'
    });
  }, 200);
  setTimeout( () => { 
    $('#NavCreate').removeClass('logged-in').addClass('NeedLogin');
    $('#NavHome').removeClass('logged-in').addClass('NeedLogin');
    return;
  }, 400);
}

function navSearchTarget(e) {
  let postSearch = $('#NavSearchField').val();
  let searchId = e.target.id
  let currentId
  if ( nav.getSearchTarget() === 'Post' ) { currentId = 'NavSearchPosts' }
  else if ( nav.getSearchTarget() === 'Author' ) { currentId = 'NavSearchUsers' }
  else if ( nav.getSearchTarget() === 'Proposal' ) { currentId = 'NavSearchProposals' }
  else if ( nav.getSearchTarget() === 'Category' ) { currentId = 'NavSearchCategories' }
  if ( searchId === 'NavSearchPosts' && searchId !== currentId ) { // target: posts
    nav.getSearchTarget('Post')
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultTitle').text(' SEARCH RESULTS')
    $('[data-snav-class="genenral"]').removeClass('hide-field').css('opacity', 1)
    $('[data-snav-class="prop"]').addClass('hide-field')
    $('[data-snav-class="cat"]').addClass('hide-field')
    if ( $('#NavSearchField').val() !== '' ) {postSearchFn( nav.getSearchTarget() )}
    else if ( $('#NavSearchMenu').height() !== 0 ) {
      collapseMenu('#NavSearchMenu', 300, 0);
      closeNavbar(25, 285)
    }
    $('#NavSearchField').attr('placeholder', 'Search Posts')
    $('#' + currentId).removeClass('search-on').addClass('search-off')
    $('#NavSearchPosts').removeClass('search-off').addClass('search-on')
  }
  else if ( searchId === 'NavSearchUsers' && searchId !== currentId ) { // target: authors
    nav.getSearchTarget('Author')
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultTitle').text(' SEARCH RESULTS')
    $('[data-snav-class="genenral"]').removeClass('hide-field').css('opacity', 1)
    $('[data-snav-class="prop"]').addClass('hide-field')
    $('[data-snav-class="cat"]').addClass('hide-field')
    if ( $('#NavSearchField').val() !== '' ) {postSearchFn( nav.getSearchTarget() )}
    else if ( $('#NavSearchMenu').height() !== 0 ) {
      collapseMenu('#NavSearchMenu', 300, 0);
      closeNavbar(25, 285)
    }
    $('#NavSearchField').attr('placeholder', 'Search Authors')
    $('#' + currentId).removeClass('search-on').addClass('search-off')
    $('#NavSearchUsers').removeClass('search-off').addClass('search-on')
  }
  else if ( searchId === 'NavSearchProposals' && searchId !== currentId ) { // target: proposals
    nav.getSearchTarget('Proposal')
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultTitle').text(' SEARCH RESULTS')
    $('[data-snav-class="genenral"]').removeClass('hide-field').css('opacity', 1)
    $('[data-snav-class="prop"]').addClass('hide-field')
    $('[data-snav-class="cat"]').addClass('hide-field')
    if ( $('#NavSearchField').val() !== '' ) {postSearchFn( nav.getSearchTarget() )}
    else if ( $('#NavSearchMenu').height() !== 0 ) {
      collapseMenu('#NavSearchMenu', 300, 0);
      closeNavbar(25, 285)
    }
    $('#NavSearchField').attr('placeholder', 'Search Proposals')
    $('#' + currentId).removeClass('search-on').addClass('search-off')
    $('#NavSearchProposals').removeClass('search-off').addClass('search-on')
  }
  else if ( searchId === 'NavSearchCategories' && searchId !== currentId ) { // target: categories
    nav.getSearchTarget('Category')
    $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
    $('#ResultTitle').text(' SEARCH RESULTS')
    $('[data-snav-class="genenral"]').addClass('hide-field')
    $('[data-snav-class="prop"]').addClass('hide-field')
    $('[data-snav-class="cat"]').removeClass('hide-field').css('opacity', 1)
    if ( $('#NavSearchField').val() !== '' ) {postSearchFn( nav.getSearchTarget() )}
    $('#NavSearchField').attr('placeholder', 'Search Categories')
    $('#' + currentId).removeClass('search-on').addClass('search-off')
    $('#NavSearchCategories').removeClass('search-off').addClass('search-on')
    if (cat.catData('top').length == 0 ) {
      $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
      chrome.runtime.sendMessage( { 'message': 'Category List' } );
    }
    else {
      $('#SeachPageIcon').removeClass('fa-plus').addClass('fa-search')
      $('#ResultTitle').text(' SEARCH RESULTS')
      populateCategories()
    }
  }
}

//// PROCESS CLICK ON NAV ////
async function dragEnd(e) {
  if ((dx - e.clientX) === 0 && (dy - e.clientY) === 0) {
    $('#NavClose').off('click').on('click', closeNavigation)
    $('#NavCreate').off('click').on('click', navCreateMenu)
    $('#NavHome').off('click').on('click', navHomeMenu)
    $('#NavSearch').off('click').on('click', navSearchMenu)
    $('#SigninChange').off('click').on('click', flipSignin)
    $('#newSubmit').off('click').on('click', submitSignin)
    $('#NavLogin').off('click').on('click', signInOut)
    $('#NavPost').off('click').on('click', navPostMenu)
    $('#CancelReview').off('click').on('click', reviewCloseTransform)
    $('#HighlightText').off('click').on('click', textHighlight)
    $('#LogoutYes').off('click').on('click', navLogoutMenu)
    $('.search-target').off('click').on('click', e => { navSearchTarget(e) } )
    $('#LogoutNo').off('click').on('click', () => {
      collapseMenu('#NavLogoutMenu', 200, 0) } )
    $('.slider-input').off('mousedown').on('mousedown', catRangeSlider)
    $('.slider-input').off('touchstart').on('touchstart', catRangeSlider)
    $('[data-prop="catValue"]').off('mousedown').on('mousedown', catPropSlider)
    $('[data-prop="catValue"]').off('touchstart').on('touchstart', catPropSlider)
    $('.self-slider-input').off('mousedown').on('mousedown', selfRangeSlider)
    $('.self-slider-input').off('touchstart').on('touchstart', selfRangeSlider)
    $('.inf-slider-input').off('mousedown').on('mousedown', infRangeSlider)
    $('.inf-slider-input').off('touchstart').on('touchstart', infRangeSlider)
    $('.remove-self').off('click').on('click', clearSelfEval)
    $('.select-author').off('click').on('click', selectAuhorFn)
    $('.add-cat').off('click').on('click', addCat)
    $('[data-prop="remove-cat"]').off('click').on('click', removePropCat)
    $('.remove-cat').off('click').on('click', removeCat)
    $('.add-inf').off('click').on('click', addInf)
    $('.remove-inf').off('click').on('click', removeInf)
    if ( $('span').hasClass('nav-se') && !sen.getExpanded() ) {
      $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
      $('.nav-se').off('mouseover').on('mouseover', spanTooltip)
    }
    $('.cat-input').off('keyup', e => {removeCatId(e)}).on('keyup', e => {removeCatId(e)})
    if ( eval.getSubmit() ) { $('#SubmitComment').off('click').on('click', sendComment) } 
    else { $('#SubmitComment').off('click') }
    if ( nav.getPostSub() !== '#PostSummary' ) {
      $('#PostSummaryIcon').off('click').on('click', () => { postSubMenu(nav.getPostSub(), '#PostSummary')})}
    if ( nav.getPostSub() !== '#PostText' ) {
      $('#PostTextIcon').off('click').on('click', () => { postSubMenu(nav.getPostSub(), '#PostText')})}
    if ( nav.getPostSub() !== '#PostCategories' ) {
      $('#PostCategoriesIcon').off('click').on('click', () => { postSubMenu(nav.getPostSub(), '#PostCategories')})}
    if ( nav.getPostSub() !== '#PostInfluence' ) {
      $('#PostInfluenceIcon').off('click').on('click', () => { postSubMenu(nav.getPostSub(), '#PostInfluence')})}
    if ( nav.getPostSub() !== '#PostComments' ) {
      $('#PostCommentsIcon').off('click').on('click', () => { postSubMenu(nav.getPostSub(), '#PostComments')})}
    if (nav.getHomeSub() !== '#NavWallet') {
      $('#NavWalletIcon').off('click').on('click', () => { homeSubMenu(nav.getHomeSub(), '#NavWallet')})}
    if (nav.getHomeSub() !== '#NavProfile') {
      $('#NavProfileIcon').off('click').on('click', () => { homeSubMenu(nav.getHomeSub(), '#NavProfile')})}
    if (nav.getHomeSub() !== '#NavDashboard') {
      $('#NavDashboardIcon').off('click').on('click', () => { homeSubMenu(nav.getHomeSub(), '#NavDashboard')})}
    if (nav.getCreateSub() !== '#NavProposal') {
      $('#NavProposalIcon').off('click').on('click', () => { createSubMenu(nav.getCreateSub(), '#NavProposal')})}
    if (nav.getCreateSub() !== '#NavNewPost') {
      $('#NavNewPostIcon').off('click').on('click', () => { createSubMenu(nav.getCreateSub(), '#NavNewPost')})}
    $('#FindTitle').off('click').on('click', () => { eval.category() } )
    $('.cat-list').off('click').on('click', e => { selectCat(e) } )
    $('.inf-list').off('click').on('click', e => { selectInf(e) } )
    $('.review-btn').off('click').on('click', navReviewMenu)
    $('.rank-btn').off('click').on('click', modifyRankFn)
    $('.add-com-source').off('click').on('click', addCom)
    $('.remove-com-source').off('click').on('click', removeCom)
    $('#SlideCom').off('click').on('click', comEval )
    $('#RangeSliderCO').off('click').on('click', comEval )
    $('#SlideInf1').off('click').on('click', e => { infEval(e, 1) } )
    $('[data-prop="submit"]').off('click').on('click', submitProp)
    $('[data-prop="reset"]').off('click').on('click', resetProp)
    return;
  } 
  else { return }
}

function propEval(e) {
  let propTarget = $(e.target).attr('data-prop')
  let propNum = $(e.target).attr('data-prop-num')
  eval.proposal({target: propTarget, num: propNum})
}

function resetProp(e) {
  let resetTarget = $(e.target).attr('data-prop')
  let propAction = $(e.target).attr('data-prop-action')
  let propNum = $(e.target).attr('data-prop-num')

  if ( resetTarget === 'allInfo' ) {
    $('[data-prop="title"]').val('')
    $('[data-prop="summary"]').val('')
    $('[data-prop="source"]').val('')
  }
  else if ( resetTarget === 'allBids' ) {
    $('[data-prop="funding"]').val('')
    $('[data-prop="influence-display"]').val('---')
    $('[data-prop="influence"]').val(0.1)
    $('[data-prop="hidden-text"]').text('')
    let boxWidth = $('[data-prop="hidden-display"]').width() + 5
    $('[data-prop="funding"]').css('width', boxWidth + 'px')
  }
  else if ( resetTarget === 'allCats' ) {
    $('[data-prop="cat-display"]').val('1.0')
    $('[data-prop="catName"]').val('')
    $('[data-prop="catReason"]').val('')
    $('[data-prop="catValue"]').val(1.0)
  }
  else if ( resetTarget === 'all' ) {
    $('[data-prop="title"]').val('')
    $('[data-prop="summary"]').val('')
    $('[data-prop="source"]').val('')
    $('[data-prop="funding"]').val('')
    $('[data-prop="influence-display"]').val('---')
    $('[data-prop="influence"]').val(0.1)
    $('[data-prop="hidden-text"]').text('')
    let boxWidth = $('[data-prop="hidden-display"]').width() + 5
    $('[data-prop="funding"]').css('width', boxWidth + 'px')
    $('[data-prop="cat-display"]').val('1.0')
    $('[data-prop="catName"]').val('')
    $('[data-prop="catReason"]').val('')
    $('[data-prop="catValue"]').val(1.0)
  }
  eval.proposal({target: resetTarget, action: propAction, num: propNum})
  // console.log('reset proposal')
}

function submitProp() {
  if ( eval.proposal({target: 'submit', action: 'get'}) ) {
    let proposalData = eval.proposal({target: 'data', action: 'get'})
    chrome.runtime.sendMessage( { 'message': 'Send Proposal', 'data': { 'proposalData': proposalData } } );
  }
  // console.log('submit proposal')
}

function catSPropSlider(e) {
  let catNum = $(e.target).attr('data-sprop-num')
  $('.no-drag').mouseover( () => {
    $('#PlatformContextMenu').removeClass('draggable')
  });
  $('.no-drag').mouseout( () => {
    $('#PlatformContextMenu').addClass('draggable')
  });
  $('[data-sprop="catValue"]').off('input').on('input', e => {
    let catSlider = $('[data-sprop="catValue"][data-sprop-num="' + catNum + '"]').val()
    let lowValue = 0.001
    let midValue = 1
    let highValue = 1000
    let catValue = 1;
    let sliderVal = parseFloat(catSlider)
    if ( sliderVal >= 0.4 && sliderVal < 0.6 ) {
      catValue = (lowValue)+(((midValue+lowValue)/100+lowValue)-lowValue)*5*(sliderVal-0.4)
    }
    else if ( sliderVal >= 0.6 && sliderVal < 0.8 ) {
      catValue = ((midValue+lowValue)/100+lowValue)+((midValue+lowValue)/10+lowValue)-((midValue+lowValue)/100+lowValue)*5*(sliderVal-0.6)
    }
    else if ( sliderVal >= 0.8 && sliderVal < 1 ) {
      catValue = ((midValue+lowValue)/10+lowValue)+((midValue-((midValue+lowValue)/10+lowValue)))*5*(sliderVal-0.8)
    }
    else if ( sliderVal >= 1 && sliderVal < 1.2 ) {
      catValue = (midValue)+(((highValue+midValue)/100+midValue)-midValue)*5*(sliderVal-1)
    }
    else if ( sliderVal >= 1.2 && sliderVal < 1.4 ) {
      catValue = ((highValue+midValue)/100+midValue)+(((highValue+midValue)/10+midValue)-((highValue+midValue)/100+midValue))*5*(sliderVal-1.2)
    }
    else if ( sliderVal >= 1.4 && sliderVal <= 1.6 ) {
      catValue = ((highValue+midValue)/10+midValue)+((highValue-((highValue+midValue)/10+midValue)))*5*(sliderVal-1.4) }
    if ( catValue >= 1000 ) {
      catValue = catValue.toFixed(0) }
    else if ( catValue >= 100 && catValue < 1000 ) {
      catValue = catValue.toFixed(1) }
    else if ( catValue >= 10 && catValue < 100 ) {
      catValue = catValue.toFixed(2) }
    else if ( catValue >= 1 && catValue < 10 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.1 && catValue < 1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.01 && catValue < 0.1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.001 && catValue < 0.01 ) {
      catValue = catValue.toFixed(4) }
    else if ( catValue >= 0.0001 && catValue < 0.001 ) {
      catValue = catValue.toFixed(5) }
    else if ( catValue >= 0.00001 && catValue < 0.0001 ) {
      catValue = catValue.toFixed(6) }
    $('[data-sprop="cat-display"][data-sprop-num="' + catNum + '"]').val(catValue)
    $('[data-sprop="catValue"]').off('click').on('click', e => {
      prop.controller({target: 'catValue', action: 'add', num: catNum})
    })
  })
}

function catPropSlider(e) {
  let catNum = $(e.target).attr('data-prop-num')
  $('.no-drag').mouseover( () => {
    $('#PlatformContextMenu').removeClass('draggable')
  });
  $('.no-drag').mouseout( () => {
    $('#PlatformContextMenu').addClass('draggable')
  });
  $('[data-prop="catValue"]').off('input').on('input', e => {
    let catSlider = $('[data-prop="catValue"][data-prop-num="' + catNum + '"]').val()
    let lowValue = 0.001
    let midValue = 1
    let highValue = 1000
    let catValue = 1;
    let sliderVal = parseFloat(catSlider)
    if ( sliderVal >= 0.4 && sliderVal < 0.6 ) {
      catValue = (lowValue)+(((midValue+lowValue)/100+lowValue)-lowValue)*5*(sliderVal-0.4)
    }
    else if ( sliderVal >= 0.6 && sliderVal < 0.8 ) {
      catValue = ((midValue+lowValue)/100+lowValue)+((midValue+lowValue)/10+lowValue)-((midValue+lowValue)/100+lowValue)*5*(sliderVal-0.6)
    }
    else if ( sliderVal >= 0.8 && sliderVal < 1 ) {
      catValue = ((midValue+lowValue)/10+lowValue)+((midValue-((midValue+lowValue)/10+lowValue)))*5*(sliderVal-0.8)
    }
    else if ( sliderVal >= 1 && sliderVal < 1.2 ) {
      catValue = (midValue)+(((highValue+midValue)/100+midValue)-midValue)*5*(sliderVal-1)
    }
    else if ( sliderVal >= 1.2 && sliderVal < 1.4 ) {
      catValue = ((highValue+midValue)/100+midValue)+(((highValue+midValue)/10+midValue)-((highValue+midValue)/100+midValue))*5*(sliderVal-1.2)
    }
    else if ( sliderVal >= 1.4 && sliderVal <= 1.6 ) {
      catValue = ((highValue+midValue)/10+midValue)+((highValue-((highValue+midValue)/10+midValue)))*5*(sliderVal-1.4) }
    if ( catValue >= 1000 ) {
      catValue = catValue.toFixed(0) }
    else if ( catValue >= 100 && catValue < 1000 ) {
      catValue = catValue.toFixed(1) }
    else if ( catValue >= 10 && catValue < 100 ) {
      catValue = catValue.toFixed(2) }
    else if ( catValue >= 1 && catValue < 10 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.1 && catValue < 1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.01 && catValue < 0.1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.001 && catValue < 0.01 ) {
      catValue = catValue.toFixed(4) }
    else if ( catValue >= 0.0001 && catValue < 0.001 ) {
      catValue = catValue.toFixed(5) }
    else if ( catValue >= 0.00001 && catValue < 0.0001 ) {
      catValue = catValue.toFixed(6) }
    $('[data-prop="cat-display"][data-prop-num="' + catNum + '"]').val(catValue)
    $('[data-prop="catValue"]').off('click').on('click', e => {
      eval.proposal({target: 'catValue', action: 'add', num: catNum})
    })
  })
}

function addSPropSource(count) {
  $('[data-sprop="source-container"]').append(`
  <div style="width: 100%;" data-sprop-num="` + count + `" data-sprop="source-box">
    <div class="flex-l pad-6">
      <div style="width: 100%; position: relative;">
        <input type="text" class="prop-source form-field no-drag" placeholder="Source" data-input="sprop" data-sprop="source" data-sprop-num="` + count + `" data-sprop-action="set"></input>
        <div style="position: absolute; right: 12px; top: 5px; color: #999;">
          <div class="fa" style="color: #999; font-size: 14px;" data-sprop="source-eval" data-sprop-num="` + count + `"></div>
        </div>
      </div>
      <div class="form-button mr-pd" data-click="sprop" data-sprop="source" data-sprop-action="remove" data-sprop-num="` + count + `">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div class="form-button mr-pd" data-click="sprop" data-sprop="source" data-sprop-action="add" data-sprop-num="` + count + `">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div>
  </div>
  `)
  $('[data-input="sprop"]').off('input').on('input', (e) => {
    let spNum = $(e.target).attr('data-sprop-num')
    let spTarget = $(e.target).attr('data-sprop')
    let spAction = $(e.target).attr('data-sprop-action')
    if (spAction === 'set' && spTarget === 'catName') {
      prop.controller({target: spTarget, action: 'remove', num: spNum})
      catInputFn(e)
      copyText(e)
    }
    else {
      prop.controller({target: spTarget, action: spAction, num: spNum})
    }
  })
  $('[data-click="sprop"]').off('click').on('click', (e) => {
    let spNum = $(e.target).attr('data-sprop-num')
    let spTarget = $(e.target).attr('data-sprop')
    let spAction = $(e.target).attr('data-sprop-action')
    prop.controller({target: spTarget, action: spAction, num: spNum})
  })
}

function addPropSource() {
  if ( $('[data-prop="source"][data-prop-action="set"]').length < 4) {
    let count = sen.counter('prop-source')
    $('[data-prop="source-container"]').append(`
    <div style="width: 100%;" data-prop-num="` + count + `" data-prop="source-box">
      <div class="flex-l pad-6">
        <div style="width: 100%; position: relative;">
          <input type="text" class="prop-source form-field no-drag" placeholder="Source" data-input="prop" data-prop="source" data-prop-num="` + count + `" data-prop-action="set"></input>
          <div style="position: absolute; right: 12px; top: 5px; color: #999;">
            <div class="fa" style="color: #999; font-size: 14px;" data-prop="source-eval" data-prop-num="` + count + `"></div>
          </div>
        </div>
        <div class="form-button mr-pd" data-click="prop" data-prop="source" data-prop-action="remove" data-prop-num="` + count + `">
          <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
        <div class="form-button mr-pd" data-click="prop" data-prop="source" data-prop-action="add" data-prop-num="` + count + `">
          <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
      </div>
    </div>
    `)
    $('[data-input="prop"]').off('input').on('input', propRouter)
    $('[data-click="prop"]').off('click').on('click', propRouter)
    $('[data-prop="funding"]').off('input').on('input', propFunding)
  }
}

function removePropSource(e) {
  let propNum = $(e.target).attr('data-prop-num')
  $('[data-prop-num="' + propNum + '"][data-prop="source-box"]').remove()
  eval.proposal({target: 'source', action: 'remove', num: propNum})
}

function modifyRankFn() {
  if ( !sen.modifyToggle() ) {
    if ( nav.getLogin() ) {
      anime({
        targets: '.rank-btn',
        direction: 'normal',
        duration: 300,
        delay: 0,
        backgroundColor: '#3390FF',
        color: '#fff',
        easing: 'easeInSine'
      });
      $('.rank-menu').removeClass('hide-field')
      sen.modifyToggle(true)
    }
    else {
      nav.setTarget('categories');
      nav.setCurrent('login');
      collapseMenu('#NavSearchMenu', 300, 0)
      closeNavbar(25, 285)
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410)
    }
  }
  else {
    anime({
      targets: '.rank-btn',
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#eee',
      color: '#000',
      easing: 'easeInSine'
    });
    $('.rank-menu-all').remove()
    $('.rank-drop-down').css('color', '#000')
    sen.openedRank(0, '', true, true)
    sen.openedRankToggle(false)
    $('.rank-menu').addClass('hide-field')
    sen.modifyToggle(false)
  }
}

function selectInf(e) {
  let selectedInf = e.target.innerText
  // console.log(selectedInf)
  let displayText = selectedInf.toUpperCase()
  $('#InfSearchBox' + targetId).val(displayText)
  $('#InfSearchBox' + targetId).attr('data-id', e.target.id);
  $('.inf-list').remove()
};

function selectCat(e) {
  // console.log(targetId)
  let selectedCat = e.target.innerText
  let displayText = selectedCat.toUpperCase()
  $('#CatSearchBox' + targetId).val(displayText)
  $('#SelfSearchBox' + targetId).val(displayText)
  $('#CatSearchBox' + targetId).attr('data-id', e.target.id);
  $('#SelfSearchBox' + targetId).attr('data-id', e.target.id);
  if ( targetId == 'Top' ) { 
    let num = $(e.target).attr('data-num')
    let storageData = cat.storeData()
    cat.storeParent(storageData[num])
    closeParentCat() }
  else if ( targetId == 'Sub' ) {
    let parentCat = cat.storeParent()
    checkChild( parentCat )
  }
  else if ( targetId.substring(0, 4) === 'Prop' ) {
    // console.log($('#CatSearchBox' + targetId).attr('data-prop'))
    // console.log('test2')
    let num = $('#CatSearchBox' + targetId).attr('data-prop-num')
    eval.proposal({target: 'catName', action: 'add', num: num, data: { name: displayText, id: e.target.id }})
  }
  else if ( targetId.substring(0, 5) === 'SProp' ) {
    // console.log('test3')
    let num = $('#CatSearchBox' + targetId).attr('data-sprop-num')
    prop.controller({target: 'catName', action: 'add', num: num, data: { name: displayText, id: e.target.id }})
  }
  $('.cat-list').remove()
};

function openParentCat() {
  if ( !cat.catSearchToggle() ) {
    cat.childParentToggle('mark', false)
    let placeholder = $('#CatSearchBoxTop').val()
    $('#CatSearchTop').off('click')
    $('.search-btn').removeClass('hide-field')
    anime({
      targets: '.search-btn',
      direction: 'normal',
      duration: 300,
      delay: 0,
      opacity: [0, 1],
      easing: 'easeInSine'
    });
    anime({
      targets: '#CatSearchBoxTop',
      direction: 'normal',
      duration: 300,
      delay: 0,
      width: '200px',
      backgroundColor: '#fff',
      easing: 'easeInSine'
    });
    setTimeout( () => { 
      $('#CatSearchBoxTop').css('pointer-events', 'auto')
      $('#CatSearchBoxTop').attr('placeholder', placeholder)
      $('#CatSearchBoxTop').val('')
      $('#CatSearchBoxTop').focus()
    }, 150);
    $('#CloseSearch').off('click').on('click', () => {
      $('#CatSearchBoxTop').attr('placeholder', placeholder)
      $('#CatSearchBoxTop').val(placeholder)
      $('.cat-list').remove()
      closeParentCat()
    } )
    rankEval('mark')
  }
}

function openChildCat() {
  if ( !cat.catSearchToggle() ) {
    cat.childParentToggle('add', false)
    let placeholder = $('#CatSearchBoxSub').val()
    $('#CatSearchSub').off('click')
    $('.sub-search-btn').removeClass('hide-field')
    anime({
      targets: '.sub-search-btn',
      direction: 'normal',
      duration: 300,
      delay: 0,
      opacity: [0, 1],
      easing: 'easeInSine'
    });
    anime({
      targets: '#CatSearchBoxSub',
      direction: 'normal',
      duration: 300,
      delay: 0,
      width: '200px',
      backgroundColor: '#fff',
      easing: 'easeInSine'
    });
    setTimeout( () => { 
      $('#CatSearchBoxSub').css('pointer-events', 'auto')
      $('#CatSearchBoxSub').attr('placeholder', placeholder)
      $('#CatSearchBoxSub').val('')
      $('#CatSearchBoxSub').focus()
    }, 150);
    $('#CloseSearchSub').off('click').on('click', () => {
      $('#CatSearchBoxSub').attr('placeholder', placeholder)
      $('#CatSearchBoxSub').val(placeholder)
      $('.cat-list').remove()
      closeChildCat()
    } )
    $('#CheckSearchSub').off('click').on('click', () => {
      let childCat
      if ( $('#CatSearchBoxSub').val() == '' ) {
        let placeholder = $('#CatSearchBoxSub').attr('placeholder')
        $('#CatSearchBoxSub').val(placeholder)
        childCat = { _id: '', name: placeholder }
      }
      else { childCat = { _id: '', name: $('#CatSearchBoxSub').val() } }
      let data = cat.storeData()
      if ( typeof data == 'object' ) {
        let catIndex = data.findIndex( cat => cat.name.toUpperCase() == childCat.name.toUpperCase())
        if ( catIndex !== -1 ) { childCat._id = data[catIndex]._id }
      }
      // console.log(childCat)
      cat.storeChild(childCat)
      $('.cat-list').remove()
      $('.rank-toggle').css('opacity', 0)
      closeChildCat()
      setTimeout( () => { 
        $('.rank-toggle').removeClass('hide-field')
        anime({
          targets: '.rank-toggle',
          direction: 'normal',
          duration: 300,
          delay: 0,
          opacity: [0, 1],
          easing: 'easeInSine'
        });
      }, 250);
    } )
    rankEval('add')
  }
}

function checkChild(parentCat) {
  if ( $('#CatSearchBoxSub').val() == '' || $('#CatSearchBoxSub').val().toUpperCase() == 'ADD SUBCATEGORY' || $('#CatSearchBoxSub').val().toUpperCase() == parentCat.name.toUpperCase() ) {
    $('#CheckSearchSub').css({'color': '#ccc', 'pointer-events': 'none', 'cursor': ''})
  }
  else {
    $('#CheckSearchSub').css({'color': '#67AD4B', 'pointer-events': '', 'cursor': 'pointer'})
  }
}

function closeParentCat() {
  $('#HiddenText').text( $('#CatSearchBoxTop').val() )
  cat.childParentToggle('mark', true)
  rankEval('mark')
  let boxWidth = $('#HiddenCat').width() + 2
  anime({
    targets: '.search-btn',
    direction: 'normal',
    duration: 300,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeInSine'
  });
  anime({
    targets: '#CatSearchBoxTop',
    direction: 'normal',
    duration: 300,
    delay: 0,
    width: boxWidth + 'px',
    backgroundColor: '#ddd',
    easing: 'easeInSine'
  });
  setTimeout( () => { 
    $('#CatSearchBoxTop').css('pointer-events', 'none')
    $('#CatSearchBoxTop').attr('placeholder', $('#CatSearchBoxTop').val() )
    $('#CatSearchTop').off('click').on('click', openParentCat )
  }, 150);
  setTimeout( () => { $('.search-btn').addClass('hide-field') }, 325);
  cat.catSearchToggle(false)
}

function closeChildCat() {
  cat.childParentToggle('add', true)
  rankEval('add')
  $('#HiddenTextSub').text( $('#CatSearchBoxSub').val() )
  let boxWidth = $('#HiddenCatSub').width() + 2
  anime({
    targets: '.sub-search-btn',
    direction: 'normal',
    duration: 300,
    delay: 0,
    opacity: [1, 0],
    easing: 'easeInSine'
  });
  anime({
    targets: '#CatSearchBoxSub',
    direction: 'normal',
    duration: 300,
    delay: 0,
    width: boxWidth + 'px',
    backgroundColor: '#ddd',
    easing: 'easeInSine'
  });
  setTimeout( () => { 
    $('#CatSearchBoxSub').css('pointer-events', 'none')
    $('#CatSearchBoxSub').attr('placeholder', $('#CatSearchBoxSub').val() )
    $('#CatSearchSub').off('click').on('click', openChildCat )
  }, 150);
  setTimeout( () => { $('.sub-search-btn').addClass('hide-field') }, 325);
  cat.catSearchToggle(false)
}

function csSliderClose(comNum, self) {
  let scrollY = window.pageYOffset
  let scrollX = window.pageXOffset
  $('#highlightSpantip').addClass('draggable')
  $('#' + self + 'RangeSliderCP' + comNum).addClass('hide-field')
  window.scrollTo(scrollX, scrollY)
}

function csSlider(comNum, self) {
  $('#highlightSpantip').removeClass('draggable')
  $('#' + self + 'RangeSliderCP' + comNum).removeClass('hide-field')
  $('#' + self + 'CreditRange' + comNum).off('mouseout').on('mouseout', () => { csSliderClose(comNum, self) })
}

function creditRangeSlider() {
  $('.highlightTooltip').removeClass('draggable')
  $('#RangeSliderCP').removeClass('hide-field')
  $('#CreditRange').off('mouseout').on('mouseout', closeRangeSlider)
}

function confidenceRangeSlider() {
  $('.highlightTooltip').removeClass('draggable')
  $('#RangeSliderConf').removeClass('hide-field')
  $('#ConfidenceRange').off('mouseout').on('mouseout', closeConfRangeSlider)
}

function closeConfRangeSlider() {
  let scrollY = window.pageYOffset
  let scrollX = window.pageXOffset
  $('.highlightTooltip').addClass('draggable')
  $('#RangeSliderConf').addClass('hide-field')
  window.scrollTo(scrollX, scrollY)
}

function closeRangeSlider() {
  let scrollY = window.pageYOffset
  let scrollX = window.pageXOffset
  $('.highlightTooltip').addClass('draggable')
  $('#RangeSliderCP').addClass('hide-field')
  window.scrollTo(scrollX, scrollY)
}

function importanceRangeSlider() {
  $('.highlightTooltip').removeClass('draggable')
  $('#RangeSliderIS').removeClass('hide-field')
  $('#ImportanceRange').off('mouseout').on('mouseout', closeImportanceSlider)
}

function closeImportanceSlider() {
  let scrollY = window.pageYOffset
  let scrollX = window.pageXOffset
  $('.highlightTooltip').addClass('draggable')
  $('#RangeSliderIS').addClass('hide-field')
  window.scrollTo(scrollX, scrollY)
}

function catRangeSlider(e) {
  let rangeId = e.target.getAttribute('data-num')
  let catSlider = $('#SlideCat' + rangeId);
  $('.no-drag').mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $('.no-drag').mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  $('#SlideCat' + rangeId).off('input').on('input', () => { 
    let catSlider = $('#SlideCat' + rangeId).val();
    let lowValue = 0.001
    let midValue = 1
    let highValue = 1000
    let catValue = 1;
    let sliderVal = parseFloat(catSlider)
    if ( sliderVal >= 0.4 && sliderVal < 0.6 ) {
      catValue = (lowValue)+(((midValue+lowValue)/100+lowValue)-lowValue)*5*(sliderVal-0.4)
    }
    else if ( sliderVal >= 0.6 && sliderVal < 0.8 ) {
      catValue = ((midValue+lowValue)/100+lowValue)+((midValue+lowValue)/10+lowValue)-((midValue+lowValue)/100+lowValue)*5*(sliderVal-0.6)
    }
    else if ( sliderVal >= 0.8 && sliderVal < 1 ) {
      catValue = ((midValue+lowValue)/10+lowValue)+((midValue-((midValue+lowValue)/10+lowValue)))*5*(sliderVal-0.8)
    }
    else if ( sliderVal >= 1 && sliderVal < 1.2 ) {
      catValue = (midValue)+(((highValue+midValue)/100+midValue)-midValue)*5*(sliderVal-1)
    }
    else if ( sliderVal >= 1.2 && sliderVal < 1.4 ) {
      catValue = ((highValue+midValue)/100+midValue)+(((highValue+midValue)/10+midValue)-((highValue+midValue)/100+midValue))*5*(sliderVal-1.2)
    }
    else if ( sliderVal >= 1.4 && sliderVal <= 1.6 ) {
      catValue = ((highValue+midValue)/10+midValue)+((highValue-((highValue+midValue)/10+midValue)))*5*(sliderVal-1.4) }
    if ( catValue >= 1000 ) {
      catValue = catValue.toFixed(0) }
    else if ( catValue >= 100 && catValue < 1000 ) {
      catValue = catValue.toFixed(1) }
    else if ( catValue >= 10 && catValue < 100 ) {
      catValue = catValue.toFixed(2) }
    else if ( catValue >= 1 && catValue < 10 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.1 && catValue < 1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.01 && catValue < 0.1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.001 && catValue < 0.01 ) {
      catValue = catValue.toFixed(4) }
    else if ( catValue >= 0.0001 && catValue < 0.001 ) {
      catValue = catValue.toFixed(5) }
    else if ( catValue >= 0.00001 && catValue < 0.0001 ) {
      catValue = catValue.toFixed(6) }
    $('#CatSlide' + rangeId).val(catValue)
    selfRange(rangeId, catValue)
  })
}

function selectAuhorFn(e) {
  authorSchema = {
    'name': '',
    '_id': ''
  }
  let target = e.target
  let parent = $(target).parent()
  if ( $('.plus-minus').hasClass('rotate45') ) {
    authorOn = false
    $('.plus-minus').removeClass('rotate45')
    $('#AuthSpan').removeClass('hide-field')
    $('#CatBoxes1').removeClass('hide-field')
    $(target).css({'background-color': '', 'border-radius': '', 'border-top': ''})
    $(parent).addClass('authors-tab')
    $('#NewAuth').removeClass('hide-field').removeClass('authors-tab')
    if ( $(parent).attr('id') != 'NewAuth' ) {
      $('#NewAuth').removeClass('hide-field')
      $(parent).css({'padding-top': '0'}) }
    suggestedAuthors(searchAuthors)
    $('.authors-tab').removeClass('hide-field')
    eval.comments()
  }
  else {
    authorOn = true
    let dataId = ""
    let dataName = ""
    if (typeof $(parent).attr('data-name') === 'undefined' ) { dataName = "" }
    else { dataName = $(parent).attr('data-name') }
    dataId = $(parent).attr('data-id')
    authorSchema = {
      'name': dataName,
      '_id': dataId
    }
    $('.plus-minus').addClass('rotate45')
    $(parent).css({'padding-top': ''})
    $('#AuthSpan').addClass('hide-field')
    $('#CatBoxes1').addClass('hide-field')
    if ( $(parent).attr('id') != 'NewAuth' ) {
      $('#NewAuth').addClass('hide-field') }
    $(target).css({'background-color': '#dfd', 'border-radius': '5px', 'border-top': '0.5px solid #999'})
    $(parent).removeClass('authors-tab')
    $('.authors-tab').addClass('hide-field')
    eval.comments()
  }
}

function selfRange(idNum, catValue) {
  let lowValue = 0.001, highValue = 1000;
  if ( catValue > 665 ) {
    lowValue = 0.001
    highValue = 1000
  }
  else if ( catValue > 5 && catValue <= 665 ) {
    if ( 0.001 < catValue / 5000) { lowValue = 0.001 }
    else { lowValue = catValue / 5000 }
    highValue = catValue * 1.5
    if ( 0.00001 > lowValue ) { lowValue = 0.00001 }
  }
  else if ( catValue > 1 && catValue <= 5 ) {
    if ( 0.001 < catValue / 5000) { lowValue = 0.001 }
    else { lowValue = catValue / 5000 }
    highValue = catValue * 1.5
    if ( 0.00001 > lowValue ) { lowValue = 0.00001 }
  }
  else if ( catValue <= 1 && catValue > 0.5 ) {
    if ( 1.5 < catValue * 2 ) { highValue = 1.5 }
    else { highValue = catValue * 2 }
    lowValue = catValue / 5000;
    if ( 0.00001 > lowValue ) { lowValue = 0.00001 }
  }
  else if ( catValue <= 0.5 ) {
    if ( 1 < catValue * 5 ) { highValue = 1.0 }
    else { highValue = catValue * 5 }
    lowValue = catValue / 5000;
    if ( 0.00001 > lowValue ) { lowValue = 0.00001 } 
  }
  if ( highValue == 1000 ) {
    highValue = highValue.toFixed(0) }
  else if ( highValue >= 100 && highValue < 1000 ) {
    highValue = highValue.toFixed(1) }
  else if ( highValue >= 10 && highValue < 100 ) {
    highValue = highValue.toFixed(2) }
  else if ( highValue < 10 ) {
    highValue = highValue.toFixed(3) }
  else { highValue = highValue.toFixed(3) }
  if ( lowValue == 0.001 ) {
    lowValue = lowValue.toFixed(3) }
  else if ( lowValue < 0.001 && lowValue >= 0.0001 ) {
    lowValue = lowValue.toFixed(4) }
  else if ( lowValue < 0.0001 && lowValue >= 0.00001 ) {
    lowValue = lowValue.toFixed(5) }
  else if ( lowValue < 0.00001 && lowValue >= 0.000001 ) {
    lowValue = lowValue.toFixed(6) } 
  else { lowValue = lowValue.toFixed(7) }
  $('#SelfLow' + idNum).text( lowValue )
  $('#SelfHigh' + idNum).text( highValue )
  $('#SelfSlide' + idNum).val('---')
  $('#SlideSelf' + idNum).val(1)
}

function selfRangeSlider(e) {
  let rangeId = e.target.getAttribute('data-num')
  $('.no-drag').mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $('.no-drag').mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  $('#SlideSelf' + rangeId).off('input').on('input', () => { 
    let catSlider = $('#SlideSelf' + rangeId).val();
    let lowValue = $('#SelfLow' + rangeId).text()
    lowValue = parseFloat(lowValue)
    let midValue = $('#CatSlide' + rangeId).val() / 20
    midValue = parseFloat(midValue)
    let highValue = $('#SelfHigh' + rangeId).text()
    highValue = parseFloat(highValue)
    let catValue = 1;
    let sliderVal = parseFloat(catSlider)
    if ( sliderVal >= 0.4 && sliderVal < 0.6 ) {
      catValue = (lowValue)+(((midValue+lowValue)/100+lowValue)-lowValue)*5*(sliderVal-0.4)
    }
    else if ( sliderVal >= 0.6 && sliderVal < 0.8 ) {
      catValue = ((midValue+lowValue)/100+lowValue)+((midValue+lowValue)/10+lowValue)-((midValue+lowValue)/100+lowValue)*5*(sliderVal-0.6)
    }
    else if ( sliderVal >= 0.8 && sliderVal < 1 ) {
      catValue = ((midValue+lowValue)/10+lowValue)+((midValue-((midValue+lowValue)/10+lowValue)))*5*(sliderVal-0.8)
    }
    else if ( sliderVal >= 1 && sliderVal < 1.2 ) {
      catValue = (midValue)+(((highValue+midValue)/100+midValue)-midValue)*5*(sliderVal-1)
    }
    else if ( sliderVal >= 1.2 && sliderVal < 1.4 ) {
      catValue = ((highValue+midValue)/100+midValue)+(((highValue+midValue)/10+midValue)-((highValue+midValue)/100+midValue))*5*(sliderVal-1.2)
    }
    else if ( sliderVal >= 1.4 && sliderVal <= 1.6 ) {
      catValue = ((highValue+midValue)/10+midValue)+((highValue-((highValue+midValue)/10+midValue)))*5*(sliderVal-1.4)
    }
    if ( catValue >= 1000 ) {
      catValue = catValue.toFixed(0) }
    else if ( catValue >= 100 && catValue < 1000 ) {
      catValue = catValue.toFixed(1) }
    else if ( catValue >= 10 && catValue < 100 ) {
      catValue = catValue.toFixed(2) }
    else if ( catValue >= 1 && catValue < 10 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.1 && catValue < 1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.01 && catValue < 0.1 ) {
      catValue = catValue.toFixed(3) }
    else if ( catValue >= 0.001 && catValue < 0.01 ) {
      catValue = catValue.toFixed(4) }
    else if ( catValue >= 0.0001 && catValue < 0.001 ) {
      catValue = catValue.toFixed(5) }
    else if ( catValue >= 0.00001 && catValue < 0.0001 ) {
      catValue = catValue.toFixed(6) }
    $('#SelfSlide' + rangeId).val(catValue)
  })
}

function infRangeSlider(e) {
  let rangeId = e.target.getAttribute('data-num')
  let infSlider = $('#SlideInf' + rangeId);
  $('.no-drag').mouseover( () => {
    $('#PlatformContextMenu').removeClass('draggable')
  });
  $('.no-drag').mouseout( () => {
    $('#PlatformContextMenu').addClass('draggable')
  });
  $('#SlideInf' + rangeId).off('input').on('input', () => { 
    let infTotal = 0;
    let infValue = document.getElementsByClassName('inf-slider-input');
    for (let a = 0; a < infValue.length; a++) {
      infTotal += parseFloat(infValue[a].value)
    }
    for (let a = 0; a < infValue.length; a++) {
      let idVal = infValue[a].getAttribute('data-num')
      let sliderVal = parseFloat(infValue[a].value)
      let inFPercent = sliderVal/infTotal*100
      $('#InfSlide' + idVal).val(inFPercent.toFixed(1) + '%')
    }
  })
}

function spanTooltip(e) {
  if ( sen.reviewState() ) { reviewTip(e) } 
  else { postTip(e) }
}

function cancelFn(target) {
  $(target).css({'opacity': '1', 'background-color': ''})
  sen.totalScore()
  $('#Tone').val('Blank')
  $('#CreditRange').css('background-color', '#eee');
  $('#CreditVal').text('---')
  $('#RangeSliderIS').val(10)
  $('#RangeSliderCP').val(0)
  $('#ImportanceRange').css('background-color', 'rgba(221, 221, 221, 1)')
  $('#ImportanceVal').text('---')
  $('#comment').val('')
  $('.source-url').val('')
  $('#SpanQuote').css('background-color', 'rgb(230, 230, 230)')
  $(target).removeAttr('data-c-cs').removeAttr('data-c-is')
  $('#highlightSpantip').removeClass('expanded-span')
  let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
  if (senIndex !== -1) {
    commentSchema.sentence[senIndex].senId = target.id;
    commentSchema.sentence[senIndex].cs = null;
    commentSchema.sentence[senIndex].importance = null;
    commentSchema.sentence[senIndex].comment = null;
    commentSchema.sentence[senIndex].sources = [];
    commentSchema.sentence[senIndex].content = sen.currentSentence().innerText;
    commentSchema.sentence[senIndex].tone = null } 
  else {
    commentSchema.sentence.push({
      'senId': target.id,
      'cs': null,
      'importance': null,
      'comment': null,
      'sources': [],
      'content': sen.currentSentence().innerText,
      'tone': null
    }) }
  $('#highlightSpantip').remove();
  sen.getExpanded(false)
  spanTip = document.createElement('div');
  anime.remove(target);
  nav.setSpantip(false);
  nav.setHighlight(false)
  $('.nav-se').off('mouseover', spanTooltip).on('mouseover', spanTooltip)
  $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  tipEval(target)
}

function closeFn(target) {
  $(target).css({'opacity': '1'})
  collapseMenu('#SpanEdit', 100, 0)
  $('#highlightSpantip').remove();
  sen.getExpanded(false)
  spanTip = document.createElement('div');
  anime.remove(target);
  nav.setSpantip(false);
  nav.setHighlight(false)
  $('.nav-se').off('click').on('mouseover', spanTooltip)
  $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  // console.log(commentSchema)
  sen.commentCount(0, true)
  sen.responseData(0, true, true)
  sen.allRepliesToggle(0, true, true)
  sen.replyToggle(0, true, true)
  sen.sendToggle(0, true, true)
  sen.linkToggle(0, true, true)
  tipEval(target)
}

function doneFn(target) {
  let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
  if (senIndex !== -1) {
    commentSchema.sentence[senIndex].cs = parseFloat($(target).attr('data-c-cs'))
    commentSchema.sentence[senIndex].importance = parseFloat($(target).attr('data-c-is'))
    commentSchema.sentence[senIndex].comment = $('#comment').val()
    commentSchema.sentence[senIndex].content = sen.currentSentence().innerText;
    commentSchema.sentence[senIndex].tone = $('#Tone').val()
    commentSchema.sentence[senIndex].sources = [];
    for ( let a = 0; a < $('.source-url').length; a++) {
      if ( $('.source-url')[a].value != '' ) {
        commentSchema.sentence[senIndex].sources.push({
          'url': $('.source-url')[a].value
        }) }
    } } 
  else {
    commentSchema.sentence.push({
      'senId': target.id,
      'cs': $(target).attr('data-c-cs'),
      'importance': $(target).attr('data-c-is'),
      'comment': $('#comment').val(),
      'sources': [],
      'content': sen.currentSentence().innerText,
      'tone': $('#Tone').val()
    })
    let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
    commentSchema.sentence[senIndex].sources = []
    for ( let a = 0; a < $('.source-url').length; a++) {
      if ( $('.source-url')[a].value != '' ) {
        commentSchema.sentence[senIndex].sources.push({
          'url': $('.source-url')[a].value
        }) }
    } }        
  $(target).css({'opacity': '1'})
  collapseMenu('#SpanEdit', 100, 0)
  $('#highlightSpantip').remove();
  sen.getExpanded(false)
  spanTip = document.createElement('div');
  anime.remove(target);
  nav.setSpantip(false);
  nav.setHighlight(false)
  $('.nav-se').off('click').on('mouseover', spanTooltip)
  $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  // console.log(commentSchema)
  sen.commentCount(0, true)
  sen.responseData(0, true, true)
  sen.allRepliesToggle(0, true, true)
  sen.replyToggle(0, true, true)
  sen.sendToggle(0, true, true)
  sen.linkToggle(0, true, true)
  tipEval(target)
}

function resetReplyFn(comNum) {
  sen.totalScore()
  $('#ReplyComment' + comNum).val('')
  $('#CreditRange' + comNum).css('background-color', '#ddd');
  $('#CreditVal' + comNum).text('---')
  $('#RangeSliderCP' + comNum).val(0)
  $('#SelfCreditRange' + comNum).css('background-color', 'rgb(139, 225, 112)');
  $('#SelfCreditVal' + comNum).text('+10')
  $('#SelfRangeSliderCP' + comNum).val(10)
  $('#comment').val('')
  $('.source-url' + comNum).val('')
  replyEval(comNum)
}

function rankEval(menuType) {
  if ( cat.childParentToggle(menuType) && $('#RankReasoning').val() !== '' && $('#RankSlide').val() !== '---' && !cat.sentCat() ) {
    sen.rankToggle(true)
    $('#SendRank > div > span').css('color', '#000')
    $('#SendRank').css({'background-color': '#ddd', 'pointer-events': '', 'cursor': 'pointer'})
  }
  else {
    sen.rankToggle(false)
    $('#SendRank > div > span').css('color', '#999')
    $('#SendRank').css({'background-color': '#ddd', 'pointer-events': 'none', 'cursor': ''})
  }
}

function replyEval(comNum) {
  if ( $('#ReplyComment' + comNum).val() !== '' && $('#CreditVal' + comNum).text() !== '---' ) {
    sen.sendToggle(comNum, true)
    $('#Send' + comNum + ' > div > span').css('color', '#000')
    $('#Send' + comNum).css('background-color', '#e4db66')
  }
  else {
    sen.sendToggle(comNum, false)
    $('#Send' + comNum + ' > div > span').css('color', '#999')
    $('#Send' + comNum).css('background-color', '#ddd')
  }
}

function resetFn(target) {
  visCheck(target)
  $(target).css({'opacity': '1', 'background-color': ''})
  $(target).removeAttr('data-c-cs').removeAttr('data-c-is').removeAttr('data-c-cf')
  sen.totalScore()
  $('#Tone').val('Blank')
  $('#CreditRange').css('background-color', '#eee');
  $('#CreditVal').text('---')
  $('#RangeSliderIS').val(10)
  $('#RangeSliderCP').val(0)
  $('#ImportanceRange').css('background-color', 'rgba(221, 221, 221, 1)')
  $('#ImportanceVal').text('---')
  $('#comment').val('')
  $('.source-url').val('')
  $('#SpanQuote').css('background-color', 'rgb(230, 230, 230)')
  let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
  if (senIndex !== -1) {
    commentSchema.sentence[senIndex].senId = target.id;
    commentSchema.sentence[senIndex].cs = null;
    commentSchema.sentence[senIndex].importance = null;
    commentSchema.sentence[senIndex].comment = null;
    commentSchema.sentence[senIndex].sources = [];
    commentSchema.sentence[senIndex].content = sen.currentSentence().innerText;
    commentSchema.sentence[senIndex].tone = null;
    commentSchema.sentence[senIndex].confidence = 10;
   } 
  else {
    commentSchema.sentence.push({
      'senId': target.id,
      'cs': null,
      'importance': null,
      'comment': null,
      'sources': [],
      'content': sen.currentSentence().innerText,
      'tone': null,
      'confidence': 10
    }) }
  tipEval(target)
}

async function senEnd() {
  if ( commentSchema.sentence.length > 0 ) {
    for (let i = 0; i < commentSchema.sentence.length; i++) {
      let sent = commentSchema.sentence[i].sent;
      let senId = commentSchema.sentence[i].senId;
      let cs = commentSchema.sentence[i].cs;
      let importance = commentSchema.sentence[i].importance;
      let comment = commentSchema.sentence[i].comment;
      let tone = commentSchema.sentence[i].tone;
      let sources = commentSchema.sentence[i].sources;
      if (!cs) { cs = '' }
      if (!importance) { importance = '' }
      if (!comment) { comment = ''  }
      if (!tone) { tone = '' }
      if (!sources) { sources = [] }
      if ( sent ) {
        if ( document.getElementById('Eval' + senId) ) {
          $('#Eval' + senId).removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('fa-telegram').css({'color': '#39f'}) } 
        else { createSenEval(senId, 2) } } 
      else if ( comment !== '' && cs !== '' && importance !== '' ) {
        if ( document.getElementById('Eval' + senId) ) {
          $('#Eval' + senId).removeClass('fa-times-circle').removeClass('fa-telegram').addClass('fa-check-circle').css({'color': '#0c0'}) } 
        else { createSenEval(senId, 1) } } 
      else if ( comment !== '' || cs !== '' || importance !== '' || sources.length > 0 || (tone !== 'Blank' && tone !== '') ) {
        if ( document.getElementById('Eval' + senId) ) {
          $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-telegram').addClass('fa-times-circle').css({'color': '#e00'}) } 
        else { createSenEval(senId, -1) } } 
      else {
        if ( document.getElementById('Eval' + senId) ) {
          $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-telegram').removeClass('fa-times-circle').css({'color': ''}) } }
    } }
  eval.comments()
}

function createSenEval(senId, status) {
  let contentBody = document.getElementsByTagName('BODY')[0]
  let winX = window.scrollX
  let winY = window.scrollY
  let evalClass, evalColor
  if (status === 1) {
    evalClass = 'fa-check-circle';
    evalColor = '#0c0' } 
  else if ( status === -1) {
    evalClass = 'fa-times-circle';
    evalColor = '#e00' }
  else if ( status === 2 ) {
    evalClass = 'fa-telegram';
    evalColor = '#39f' }
  let lastLetter = document.getElementById(senId).childNodes[0];
  window.getSelection().setBaseAndExtent(lastLetter, lastLetter.length-1, lastLetter, lastLetter.length)
  let endLetterLeft = window.getSelection().getRangeAt(0).getBoundingClientRect().left;
  let leftXY = winX + endLetterLeft - 6;
  let endLetterTop = window.getSelection().getRangeAt(0).getBoundingClientRect().top;
  let topXY = winY + endLetterTop - 10;
  window.getSelection().removeAllRanges();
  let evalIcon = document.createElement('div');
  $(evalIcon).css({'left': leftXY + 'px', 'top': topXY + 'px', 'position': 'absolute', 'font-size': '12px', 'color': evalColor})
  $(evalIcon).addClass('fa').addClass(evalClass).addClass('com-e')
  $(evalIcon).attr('id', 'Eval' + senId)
  contentBody.appendChild(evalIcon)
}

function reviewTip(e) {
  let target = e.target
  let senIndex = commentSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  let spanbox = e.target.getBoundingClientRect();
  if ( ((spanbox.top !== oldboxTop || spanbox.right !== oldboxRight || spanbox.left !== oldboxLeft) || !nav.getSpantip()) && !nav.getHighlight() && $(e.target).hasClass('nav-se') && !sen.getExpanded() ) {
    let cs = $(target).attr('data-c-cs')
    let is = $(target).attr('data-c-is')
    nav.setSpantip(true);
    let firstLetter = e.target.childNodes[0]
    window.getSelection().setBaseAndExtent(firstLetter, 0, firstLetter, 1)
    selLetterLeft = window.getSelection().getRangeAt(0).getBoundingClientRect().left
    window.getSelection().removeAllRanges()
    $(spanTip).addClass('highlightTooltip')
    spanTip.innerHTML = `
      <div class="flex-br">
      </div>
      <div class="flex-l" style="width: 100%;">
        <div class="flex-s">
        </div>
        <div style="width: auto; align-items: center;" class="flex-l">
        <div class="tooltip-exp t-t" style="width: 25px; margin: 0;">
          <div class="spantip-box" style="width: 25px; background-color: #eee;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span id="SpanEval" class="fa fa-minus-circle nav-v pt-18" style="padding: 1px 2px; color: #999">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="t-t" style="width: 70px;">
          <div id="CreditRange" style="background-color: #eee; position: absolute; bottom: 0px; border: 0.5px solid #999; border-radius: 5px; width: 70px; height: auto;">
            <input id="RangeSliderCP" class="input-range no-drag hide-field in-s tip-eval" orient="vertical" type="range" step="0.1" value="0" min="-10" max="10" style="cursor: pointer;">
            </input>
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="height: 20px;">
              <div class="flex-s">
              </div>
              <span id="Credit" class="fa fa-check nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <span id="CreditVal" class="nav-v pt-18 sp-v" style="width: 40px;">---</span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="t-t">
          <div id="ImportanceRange" class="spantip-box" style="width: 60px;">
            <input id="RangeSliderIS" class="input-range no-drag hide-field tip-eval" orient="vertical" type="range" step="0.1" value="10" min="0.1" max="10" style="user-drag: none; user-select: none; height: 100px; width: 30px; overflow: hidden; margin-top: 8px; cursor: pointer;">
            </input>
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="height: 20px;">
              <div class="flex-s">
              </div>
              <span id="Importance" class="fa fa-align-right rotated nav-v pt-18" style="font-size: 15px; padding: 1px 2px; color: #000">
              </span>
              <span id="ImportanceVal" class="nav-v pt-18 sp-v" style="width: 30px;">---</span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-on tooltip-sent t-t" style="width: 30px; cursor: pointer;">
          <div id="Modify" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span class="fa fa-pencil nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-on tooltip-sent t-t" style="width: 30px; cursor: pointer;">
          <div id="Enlarge" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span id="EnlargeIcon" class="fa fa-expand nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-off tooltip-gen t-t" style="width: 30px; cursor: pointer;">
          <div id="Visible" class="spantip-box vis-on" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span id="VisIcon" class="fa fa-eye nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-off t-t" style="width: 30px; cursor: pointer;">
          <div id="Reset" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span class="fa fa-undo nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-off tooltip-close t-t" style="width: 30px; cursor: pointer;">
          <div id="Edit" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span class="fa fa-pencil-square-o nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-off tooltip-exp t-t" style="width: 30px; display: none; cursor: pointer;">
          <div id="Cancel" class="tooltip-exp spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span class="fa fa-times nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="sent-off tooltip-exp t-t" style="display: none; cursor: pointer;">
          <div id="Done" class="spantip-box" style="width: 60px;">
            <div class="flex-l span-ctn" style="height: 19px">
              <span class="nav-v pt-18 spantip-text">Done</span>
            </div>
          </div>
        </div>
        <div style="overflow: hidden; width: 0;">
          <div style="width: auto; height: 20px;">
          </div>
        </div>
        </div>
        <div class="flex-s"></div>
      </div>
    <span class="bottomTriangle nav-v"></span>`
    let contentBody = document.getElementsByTagName('BODY')[0]
    spanTip.id = 'highlightSpantip';
    $('#highlightSpantip').addClass('turn-off')
    contentBody.prepend(spanTip)
    $(spanTip).css({'opacity': 0, 'padding': '4px', 'width': 'auto', 'height': 'auto'})
    let quote = $('#SpanQuote')
    let credit = $('#CreditRange')
    let importance = $('#ImportanceRange')
    if (senIndex !== -1) {
      if ( commentSchema.sentence[senIndex].sent ) {
        $('.sent-off').addClass('hide-field')
        $('#CreditRange').css('pointer-events', 'none')
        $('#ImportanceRange').css('pointer-events', 'none')
      }
    }
    else { $('.sent-on').addClass('hide-field') }
    if ( $(target).attr('data-c-cs') == '0' && $(target).attr('data-c-is') == '0' ) {
      $('#CreditVal').text('---').css({'color': '#999'})
      $('#ImportanceVal').text('---').css({'color': '#999'})
      $('#Credit').css({'color': '#999'})
      $('#Importance').css({'color': '#999'})
      $('#CreditRange').css({'background-color': '#eee'})
      $('#ImportanceRange').css({'background-color': '#eee'})
      $('#Visible').removeClass('vis-on').addClass('vis-off')
      $('#VisIcon').removeClass('fa-eye').addClass('fa-eye-slash').css({'color': '#eee'})
      $('#Visible').css({'background-color': '#3390ff', 'transition-duration': '0.15s'})
    } 
    else {
      if (is) {
        setGreyscale(is, importance)
        if ( is % 1 === 0 ) { $('#ImportanceVal').text(is + '.0') } 
        else { $('#ImportanceVal').text(is) }
        $('#RangeSliderIS').attr('value', is);
      }
      if (cs) {
        setColor(cs, 10, [credit])
        $('#RangeSliderCP').attr('value', cs);
        if ( cs > 0 && cs % 1 !== 0 || cs == 10 ) { $('#CreditVal').text('+' + cs) } 
        else if ( cs == 0 ) { $('#CreditVal').text('0.0') } 
        else if ( cs <=0 && cs % 1 !== 0 || cs == -10 ) { $('#CreditVal').text(cs) } 
        else if ( cs > 0 && cs < 10 && cs % 1 === 0 ) { $('#CreditVal').text('+' + cs + '.0') } 
        else if ( cs > -10 && cs < 0 && cs % 1 === 0 ) { $('#CreditVal').text(cs + '.0') }
      }
    }
    let color = $(target).css('background-color');
    $(quote).css('background-color', color);
    let spantipWidth = spanTip.offsetWidth
    let positionX = window.scrollX + (spanbox.right + spanbox.left)/2 - spantipWidth/2
    let positionX2 = window.scrollX + (selLetterLeft + 5) - spantipWidth/2
    if ( positionX2 > positionX ) { positionX = positionX2 }
    let positionY = window.scrollY + spanbox.top - 30;
    $(spanTip).css({'left': positionX + 'px', 'top': positionY + 'px'})
    animation = anime({
      targets: '.highlightTooltip',
      direction: 'normal',
      duration: 200,
      opacity: 0.95,
      top: '-=3px',
      easing: 'linear',
    }); 
    spantipWidth = document.getElementsByClassName('highlightTooltip')[0].offsetWidth
    oldboxTop = spanbox.top;
    oldboxLeft = spanbox.left;
    oldboxRight = spanbox.right
    sen.currentSentence(e.target)
    $('#Enlarge').off('click').on('click', () => { expandSpanFn(target) } )
    $('#Edit').off('click').on('click', () => { expandSpanFn(target) } )
    $('#Reset').off('click').on('click', () => { resetFn(target) } )
    $('#CreditRange').off('mouseover').on('mouseover', creditRangeSlider)
    $('#ConfidenceRange').off('mouseover').on('mouseover', confidenceRangeSlider)
    $('#ImportanceRange').off('mouseover').on('mouseover', importanceRangeSlider)
    $('#RangeSliderIS').off('input').on('input', () => { 
      visCheck(target)
      importanceSlidersFn(target) } )
    $('#RangeSliderCP').off('input').on('input', () => { 
      visCheck(target)
      rangeSliderFn(target) } )
    $('.tip-eval').off('click').on('click', () => { tipEval(target) } )
    $('.tip-eval').off('touchend').on('touchend', () => {tipEval(target) } )
    tipEval(target)
    $('#Visible').hover( () => {
      if ( $('#Visible').hasClass('vis-on') ) {
        $('#VisIcon').removeClass('fa-eye').addClass('fa-eye-slash').css({'color': '#eee'})
        $('#Visible').css({'background-color': '#3390ff', 'transition-duration': '0.15s'})
      }
    }, () => {
      if ( $('#Visible').hasClass('vis-on') ) {
        $('#VisIcon').removeClass('fa-eye-slash').addClass('fa-eye').css({'color': '#000'})
        $('#Visible').css({'background-color': '#ddd', 'transition-duration': '0.15s'})
      }
    })
    $('#Visible').off('click').on('click', () => { visibleFn(target) } )
  }
}

function visibleFn(target) {
  if ( $('#Visible').hasClass('vis-on') ) {
    resetFn(target)
    let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
    commentSchema.sentence[senIndex].cs = 0;
    commentSchema.sentence[senIndex].importance = 0;
    $(target).attr('data-c-cs', 0).attr('data-c-is', 0).css({'background-color': '#f6f6f6'})
    $('#CreditVal').text('---').css({'color': '#999'})
    $('#ImportanceVal').text('---').css({'color': '#999'})
    $('#Credit').css({'color': '#999'})
    $('#Importance').css({'color': '#999'})
    $('#CreditRange').css({'background-color': '#eee'})
    $('#ImportanceRange').css({'background-color': '#eee'})
    $('#Visible').removeClass('vis-on').addClass('vis-off')
    $('#VisIcon').removeClass('fa-eye').addClass('fa-eye-slash').css({'color': '#eee'})
    $('#Visible').css({'background-color': '#3390ff', 'transition-duration': '0.15s'})
  } 
  else {
    let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
    // console.log(commentSchema)
    commentSchema.sentence[senIndex].cs = null;
    commentSchema.sentence[senIndex].importance = null;
    $(target).attr('data-c-cs', '').attr('data-c-is', '').css({'background-color': ''})
    $('#CreditVal').text('---').css({'color': '#000'})
    $('#ImportanceVal').text('---').css({'color': '#000'})
    $('#Credit').css({'color': '#000'})
    $('#Importance').css({'color': '#000'})
    $('#CreditRange').css({'background-color': '#eee'})
    $('#ImportanceRange').css({'background-color': '#eee'})
    $('#Visible').removeClass('vis-off').addClass('vis-on')
    $('#VisIcon').removeClass('fa-eye-slash').addClass('fa-eye').css({'color': '#000'})
    $('#Visible').css({'background-color': '#ddd', 'transition-duration': '0.15s'})
  }
  spanEval(target)
}

function importanceSlidersFn(target) {
  let importance = $('#ImportanceRange')
  $(target).attr('data-c-is', $('#RangeSliderIS')[0].value)
  let cs = $(target).attr('data-c-cs')
  let quote = $('#SpanQuote')
  if (!cs) {
    let cs = 'rgba(230, 230, 230, ';
    setGreyscale($('#RangeSliderIS')[0].value, importance)
    setColor(cs, $('#RangeSliderIS')[0].value, [target])
    if (quote) { setColor(cs, $('#RangeSliderIS')[0].value, [quote]) }
  } 
  else {
    cs = $(target).attr('data-c-cs')
    setGreyscale($('#RangeSliderIS')[0].value, importance)
    setColor(cs, $('#RangeSliderIS')[0].value, [target])
    if (quote) { setColor(cs, $('#RangeSliderIS')[0].value, [quote]) }
  }
  importanceValue = $('#ImportanceVal')[0];
  importanceValue.innerText = $('#RangeSliderIS')[0].value;
  if ( $('#RangeSliderIS')[0].value % 1 === 0 ) {
    importanceValue.innerText = importanceValue.innerText + '.0' }
  sen.totalScore()
  $('#ImportanceRange').off('mouseover').on('mouseover', importanceRangeSlider)
  let senIndex = commentSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  commentSchema.sentence[senIndex].importance = parseFloat($('#RangeSliderIS')[0].value)
}

function visCheck(target) {
  if ( ($(target).attr('data-c-cs') == '0' && $(target).attr('data-c-is') == '0') || $('#Visible').hasClass('vis-off') ) {
    if ( $(target).css('background-color') == 'rgb(246, 246, 246)' ) {
      $(target).css({'background-color': ''}) }
    if ( $(target).attr('data-c-cs') == '0' ) {
      $(target).removeAttr('data-c-cs') }
    if ( $(target).attr('data-c-is') == '0' ) {
      $(target).removeAttr('data-c-is') }
    $('#CreditVal').css({'color': '#000'})
    $('#ImportanceVal').css({'color': '#000'})
    $('#Credit').css({'color': '#000'})
    $('#Importance').css({'color': '#000'})
    $('#Visible').removeClass('vis-off').addClass('vis-on')
    $('#VisIcon').removeClass('fa-eye-slash').addClass('fa-eye').css({'color': '#000'})
    $('#Visible').css({'background-color': '#ddd', 'transition-duration': '0.15s'})
  }
}

function rangeConfSliderFn(target) {
  let confidence = $('#ConfidenceRange')
  $(target).attr('data-c-cf', $('#RangeSliderConf')[0].value)
  setColor($('#RangeSliderConf')[0].value, 10, [confidence])
  let confidenceValue = $('#ConfidenceVal')[0]
  if ( $('#RangeSliderConf')[0].value > 0 ) {
    confidenceValue.innerText = '+' + $('#RangeSliderConf')[0].value; } 
  else {
    confidenceValue.innerText = $('#RangeSliderConf')[0].value; }
  if ( $('#RangeSliderConf')[0].value >= 0 && $('#RangeSliderConf')[0].value < 10 && $('#RangeSliderConf')[0].value % 1 === 0 ) {
    confidenceValue.innerText = confidenceValue.innerText + '.0' }
  $('#ConfidenceRange').off('mouseover').on('mouseover', confidenceRangeSlider)
  let senIndex = commentSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  commentSchema.sentence[senIndex].confidence = parseFloat($('#RangeSliderConf')[0].value)
}

function replySliderFn(comNum, self) {
  let credit = $('#' + self + 'CreditRange' + comNum)
  setColor($('#' + self + 'RangeSliderCP' + comNum)[0].value, 10, [credit])
  let creditValue = $('#' + self + 'CreditVal' + comNum)[0]
  if ( $('#' + self + 'RangeSliderCP' + comNum)[0].value > 0 ) {
    creditValue.innerText = '+' + $('#' + self + 'RangeSliderCP' + comNum)[0].value; } 
  else {
    creditValue.innerText = $('#' + self + 'RangeSliderCP' + comNum)[0].value; }
  if ( $('#' + self + 'RangeSliderCP' + comNum)[0].value > -10 && $('#' + self + 'RangeSliderCP' + comNum)[0].value < 10 && $('#' + self + 'RangeSliderCP' + comNum)[0].value % 1 === 0 ) {
    creditValue.innerText = creditValue.innerText + '.0' }
  sen.totalScore()
  $('#' + self + 'CreditRange' + comNum).off('mouseover').on('mouseover', () => { csSlider(comNum, self)} )
  replyEval(comNum)
}

function rangeSliderFn(target) {
  let credit = $('#CreditRange')
  $(target).attr('data-c-cs', $('#RangeSliderCP')[0].value)
  let is = $(target).attr('data-c-is')
  let quote = $('#SpanQuote')
  if (!is) {
    setColor($('#RangeSliderCP')[0].value, 10, [credit])
    setColor($('#RangeSliderCP')[0].value, 10, [target])
    if (quote) {
      setColor($('#RangeSliderCP')[0].value, 10, [quote]) }        
  } 
  else {
    is = $(target).attr('data-c-is')
    setColor($('#RangeSliderCP')[0].value, 10, [credit])
    setColor($('#RangeSliderCP')[0].value, is, [target])
    if (quote) {
      setColor($('#RangeSliderCP')[0].value, is, [quote]) }
  }
  let creditValue = $('#CreditVal')[0]
  if ( $('#RangeSliderCP')[0].value > 0 ) {
    creditValue.innerText = '+' + $('#RangeSliderCP')[0].value; } 
  else {
    creditValue.innerText = $('#RangeSliderCP')[0].value; }
  if ( $('#RangeSliderCP')[0].value > -10 && $('#RangeSliderCP')[0].value < 10 && $('#RangeSliderCP')[0].value % 1 === 0 ) {
    creditValue.innerText = creditValue.innerText + '.0' }
  sen.totalScore()
  $('#CreditRange').off('mouseover').on('mouseover', creditRangeSlider)
  let senIndex = commentSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  commentSchema.sentence[senIndex].cs = parseFloat($('#RangeSliderCP')[0].value)
}

function tipEval(target) {
  let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
  // console.log( typeof commentSchema.sentence[senIndex] )
  // console.log(senIndex)
  let senId = target.id
  let sent = false
  let cs = ''
  let importance = ''
  let comment = ''
  let tone = ''
  let sources = []
  if (senIndex !== -1) {
    sent = commentSchema.sentence[senIndex].sent
    cs = commentSchema.sentence[senIndex].cs;
    importance = commentSchema.sentence[senIndex].importance;
    comment = commentSchema.sentence[senIndex].comment;
    tone = commentSchema.sentence[senIndex].tone;
    sources = commentSchema.sentence[senIndex].sources;
  }
  if (!cs) { cs = '' }
  if (!importance) { importance = '' }
  if (!comment) { comment = '' }
  if (!tone) { tone = '' }
  if (!sources) { sources = [] }
  // console.log(cs, importance, comment, tone, sources, sent)
  if ( sent ) {
    $('#comment').css({'border': '', 'background-color': ''});
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-telegram').css({'color': '#39f'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('fa-telegram').css({'color': '#39f'}) }
      else { createSenEval(senId, 2) }
  }
  else if ( (comment !== '' && cs !== '' && importance !== '') || ($(target).attr('data-c-cs') == '0' && $(target).attr('data-c-is') == '0') ) {
    $('#comment').css({'border': '0.5px solid #0c0', 'background-color': '#cec'});
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});
    $('#SpanEval').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-check-circle').css({'color': '#0c0'})
    $('#SpanEval').removeClass('fa-times-circle').removeClass('fa-minus-circle').removeClass('fa-telegram').addClass('fa-check-circle').css({'color': '#0c0'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-times-circle').removeClass('fa-telegram').addClass('fa-check-circle').css({'color': '#0c0'})
    } 
    else { createSenEval(senId, 1) }
  } 
  else if ( comment !== '' || cs !== '' || importance !== '' || sources.length > 0 || (tone !== 'Blank' && tone !== '') ) {
    if ( comment === '' ) {
      $('#comment').css({'border': '0.5px solid #e00', 'background-color': '#fdd'}) } 
    else { $('#comment').css({'border': '0.5px solid #0c0', 'background-color': '#cec'}) }
    if ( cs === '' ) { $('#CreditRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#CreditRange').css({'border': '0.5px solid #999'}) }
    if ( importance === '' ) {
      $('#ImportanceRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#ImportanceRange').css({'border': '0.5px solid #999'}) }
    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-minus-circle').removeClass('fa-telegram').addClass('fa-times-circle').css({'color': '#e00'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-telegram').addClass('fa-times-circle').css({'color': '#e00'})
    } 
    else { createSenEval(senId, -1) }
  } 
  else {
    $('#comment').css({'border': '', 'background-color': ''});
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-telegram').addClass('fa-minus-circle').css({'color': '#999'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-telegram').css({'color': ''})
    }
  }
  eval.comments()
}

function spanEval(target) {
  let sources = '';
  let urls = document.getElementsByClassName('source-url')
  if (urls) {
    for (let i = 0; i < urls.length; i++) {
      if (urls[i].value !== '' ) {
        sources = 'Source';
        break;
      }
    }
  }
  let senIndex = commentSchema.sentence.findIndex( sentence => sentence.senId == target.id)
  let sent = commentSchema.sentence[senIndex].sent;
  let senId = target.id;
  let cs = commentSchema.sentence[senIndex].cs;
  let importance = commentSchema.sentence[senIndex].importance;
  let comment = $('#comment').val();
  let tone = $('#Tone').val();
  if (!cs) { cs = '' }
  if (!importance) { importance = '' }
  if (!comment) { comment = '' }
  if (!tone) { tone = '' }
  if (!sources) { sources = '' }
  if ( sent ) {
    $('#comment').css({'border': '', 'background-color': '#cdd'});
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});
    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-minus-circle').addClass('fa-telegram').css({'color': '#39f'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('fa-telegram').css({'color': '#39f'}) }
  }
  else if ( (comment !== '' && cs !== '' && importance !== '') || ($(target).attr('data-c-cs') == '0' && $(target).attr('data-c-is') == '0') ) {
    if ( $('#Visible').hasClass('vis-on') ) {
      $('#comment').css({'border': '0.5px solid #0c0', 'background-color': '#cec'}) } 
    else {
      $('#comment').css({'border': '', 'background-color': '#ddd'}) }
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});
    $('#SpanEval').removeClass('fa-times-circle').removeClass('fa-minus-circle').removeClass('fa-telegram').addClass('fa-check-circle').css({'color': '#0c0'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-times-circle').removeClass('fa-telegram').addClass('fa-check-circle').css({'color': '#0c0'}) } 
    else { createSenEval(senId, 1) }
  } 
  else if ( comment !== '' || cs !== '' || importance !== '' || sources !== '' || (tone !== 'Blank' && tone !== '') ) {
    if ( comment === '' ) { $('#comment').css({'border': '0.5px solid #e00', 'background-color': '#fdd'}) } 
    else { $('#comment').css({'border': '0.5px solid #0c0', 'background-color': '#cec'}) }
    if ( cs === '' ) { $('#CreditRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#CreditRange').css({'border': '0.5px solid #999'}) }
    if ( importance === '' ) { $('#ImportanceRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#ImportanceRange').css({'border': '0.5px solid #999'}) }
    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-minus-circle').removeClass('fa-telegram').addClass('fa-times-circle').css({'color': '#e00'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-telegram').addClass('fa-times-circle').css({'color': '#e00'}) } 
    else { createSenEval(senId, -1) }
  } 
  else {
    $('#comment').css({'border': '', 'background-color': ''});
    $('#CreditRange').css({'border': '0.5px solid #999'});
    $('#ImportanceRange').css({'border': '0.5px solid #999'});
    $('#SpanEval').removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-telegram').addClass('fa-minus-circle').css({'color': '#999'})
    if ( document.getElementById('Eval' + senId) ) {
      $('#Eval' + senId).removeClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-telegram').css({'color': '#999'}) }
  }
  eval.comments()
}

function populateCategories() {
  sen.counter('top', true)
  sen.subsDropdown(0, 'top', 0, {reset: 'top'})
  let catList = cat.catData('top')
  $('#NavSearchBox').empty()
  openNavbar(50, 0)
  expandMenu('#NavSearchMenu', 150, 50)
  $('#NavSearchMenu').css('height', 'auto')
  let hideField = ' hide-field'
  if ( sen.modifyToggle() ) {
    hideField = '' }
  $('#NavSearchBox').append(`
    <div id="SearchCategories" class="flex-l pad-6" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start;">
    </div>
    <div id="TopCategories" class="flex-l pad-6" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start;">
      <div style="position: relative; width: 100%;">
        <div class="flex-l show-field" style="opacity: 0;">
          <div>
            <span class="fa fa-file-text-o ft-14" style="padding: 8px;"></span>
          </div>
        </div>
        <div class="flex-l show-field" style="position: absolute; width: 100%; top: 0; left: 0;">
          <div>
            <span class="fa fa-list-ol ft-14" style="padding: 8px;"></span>
          </div>
          <div class="ft-14 ft-w">TOP CATEGORIES</div>
        </div>
      </div>
    </div>
  `)
  for (let i = 0; i < catList.length; i++) {
    let count = sen.counter('top')
    sen.subsDropdown(count, 'top', 0, {data: catList[i]})
    let catName = catList[i].name
    let catPercent = catList[i].percent.toFixed(2)
    $('#TopCategories').append(`
      <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start;" data-cat-rank="0top` + count + `">
        <div class="flex-l">
          <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 18px;">
            <div class="spantip-box" style="position: relative; border-right: 0; width: auto; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px; border: 0.5px solid #eee;  background-color: #eee;">
              <div class="flex-br">
              </div>
              <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                <span class="fa fa-chevron-right nav-v pt-18" style="padding: 1px 2px; color: #000; font-size: 13px;" data-child="` + count + `" data-type="top" data-parent="0" data-cat-arrow="0top` + count + `">
                </span>
                <div class="flex-s">
                </div>
              </div>
            </div>
          </div>
          <div class="t-t" style="box-sizing: border-box; height: 23px; margin: 0; width: 60px;">
            <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 23px;">
              <div class="flex-br">
              </div>
              <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                <div class="flex-s">
                </div>
                <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="` + catPercent + `%"></input>
                <div class="flex-s">
                </div>
              </div>
            </div>
          </div>
          <div style="position: relative; height: 23px; margin-top: 11px;">
            <span style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase; pointer-events: none;" class="cat-slider form-field no-drag inf-input-view cat-on" type="text" placeholder="Category">`+ catName +`</span>
          </div>
          <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
            <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="top" data-menu="mark" data-parent="0">
              <span class="fa fa-caret-down nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 13px; pointer-events: none;" data-rank-mark="0top` + count + `">
              </span>
            </div>
          </div>
          <div class="rank-menu` + hideField + `" style="position: relative; height: 23px; margin: 0px 0 0 6px;">
            <div style="border-radius: 5px; width: 100%;text-transform: uppercase; height: 17px; padding: 1px 4px; margin: 3px 0; cursor: pointer;" class="form-field mark-menu" data-child="` + count + `" data-type="top" data-menu="add" data-parent="0">
              <span class="fa fa-level-up fa-rotate-90 nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 12px; pointer-events: none;" data-rank-add="0top` + count + `">
              </span>
            </div>
          </div>
        </div>
        <div class="flex-l pad-6 cat-ranks" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 0;" data-menus="0top` + count + `">
        </div>
        <div class="flex-l pad-6 cat-ranks sub-0-top-` + count + `" style="width: 100%; padding-top: 0; flex-direction: column; align-items: flex-start; padding-left: 10px;" data-subcats="0top` + count + `">
        </div>
      </div>
    `)
    if ( typeof catList[i].child == 'undefined' || catList[i].child.length == 0 ) {
      $('[data-cat-arrow="0top' + count + '"]').css({'color': '#bbb', 'pointer-events': 'none'})}
    else {
      $('[data-cat-arrow="0top' + count + '"]').css('cursor', 'pointer').addClass('sub-categories') 
      $('[data-cat-arrow="0top' + count + '"]').off('click').on('click', e => {
        let parentCatId = catList[i]._id
        getSubs(e, parentCatId)
      })
    }    
  }
  if ( cat.catData('search').length !== 0 &&  $('#NavSearchField').val() !== '' ) {
    categorySearch()
  }
  $('#TopCategories').append(`
    <div id="MarkBottom" class="flex-br cat-ranks" style="margin-top: 10px;"></div>
  `)
  
  $('#AddCatRank').off('click').on('click', () => {
    $('#AddCatButton').addClass('hide-field')
    $('#AddCategoryBox').removeClass('hide-field')
  })
  $('#AddCatSearch').off('keyup').on('keyup', addCatSearchFn )
  $('.mark-menu').off('click').on('click', openCatRank)
}

function postTip(e) {
  let target = e.target
  let spanbox = e.target.getBoundingClientRect();
  if ( ((spanbox.top !== oldboxTop || spanbox.right !== oldboxRight || spanbox.left !== oldboxLeft) || !nav.getSpantip()) && !nav.getHighlight() && $(e.target).hasClass('nav-se') && !sen.getExpanded() ) {
    let cs = $(target).attr('data-cs')
    let is = $(target).attr('data-is')
    nav.setSpantip(true);
    let firstLetter = e.target.childNodes[0]
    window.getSelection().setBaseAndExtent(firstLetter, 0, firstLetter, 1)
    selLetterLeft = window.getSelection().getRangeAt(0).getBoundingClientRect().left
    window.getSelection().removeAllRanges()
    $(spanTip).addClass('highlightTooltip')
    spanTip.innerHTML = `
    <div class="flex-br">
    </div>
    <div id="BottomSpan" class="flex-l" style="width: 100%;">
      <div class="flex-s">
      </div>
      <div style="width: auto; align-items: center;" class="flex-l">
        <div class="t-t" style="width: 70px; margin-left: 0px;">
          <div id="CreditRange" style="background-color: #eee; position: absolute; bottom: 0px; border: 0.5px solid #999; border-radius: 5px; width: 70px; height: auto;">
            <input id="RangeSliderCP" class="input-range no-drag hide-field in-s" orient="vertical" type="range" step="0.1" value="0" min="-10" max="10">
            </input>
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="height: 21px;">
              <div class="flex-s">
              </div>
              <span id="Credit" class="fa fa-check nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <span id="CreditVal" class="nav-v pt-18 sp-v" style="width: 40px; padding: 3px 0;">---</span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="t-t">
          <div id="ImportanceRange" class="spantip-box" style="width: 60px; height: 21px">
            <input id="RangeSliderIS" class="input-range no-drag hide-field in-s" orient="vertical" type="range" step="0.1" value="10" min="0.1" max="10">
            </input>
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="height: 21px;">
              <div class="flex-s">
              </div>
              <span id="Importance" class="fa fa-align-right rotated nav-v pt-18" style="font-size: 15px; padding: 1px 2px; color: #000">
              </span>
              <span id="ImportanceVal" class="nav-v pt-18 sp-v" style="width: 40px; padding: 3px 0;">---</span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="t-t" style="width: 30px;">
          <div id="AllComments" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span id="AllCommentsIcon" class="fa fa-comments nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="tooltip-close t-t" style="width: 30px;">
          <div id="Edit" class="spantip-box" style="width: 30px;">
            <div class="flex-l span-ctn">
              <div class="flex-s">
              </div>
              <span class="fa fa-pencil-square-o nav-v pt-18" style="padding: 1px 2px; color: #000">
              </span>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div class="flex-s"></div>
        <div class="tooltip-exp t-t" style="display: none; width: 70px;">
          <div id="Cancel" class="spantip-box" style="width: 70px;">
            <div class="flex-l span-ctn" style="height: 19px">
              <span class="nav-v pt-18 spantip-text">Cancel</span>
            </div>
          </div>
        </div>
        <div class="tooltip-exp t-t" style="display: none;">
          <div id="Reset" class="spantip-box" style="width: 60px;">
            <div class="flex-l span-ctn" style="height: 19px">
              <span class="nav-v pt-18 spantip-text">Reset</span>
            </div>
          </div>
        </div>
        <div class="tooltip-exp t-t" style="display: none;">
          <div id="Done" class="spantip-box" style="width: 60px;">
            <div class="flex-l span-ctn" style="height: 19px">
              <span class="nav-v pt-18 spantip-text">Done</span>
            </div>
          </div>
        </div>
        <div style="overflow: hidden; width: 0;">
          <div style="width: auto; height: 20px;">
          </div>
        </div>
      </div>
      <div class="flex-s"></div>
    </div>
    <span class="bottomTriangle nav-v"></span>`
    let contentBody = document.getElementsByTagName('BODY')[0]
    spanTip.id = 'highlightSpantip';
    $('#highlightSpantip').addClass('turn-off')
    $(spanTip).css({'opacity': 0, 'padding': '4px', 'width': 'auto', 'height': 'auto'})
    contentBody.prepend(spanTip)
    let credit = $('#CreditRange')
    let importance = $('#ImportanceRange')
    if (is) {
      setGreyscale(is, importance)
      if ( is % 1 === 0 ) { $('#ImportanceVal').text(is + '.0') } 
      else { $('#ImportanceVal').text(is) }
      $('#RangeSliderIS').attr('value', is);
    }
    if (cs) {
      setColor(cs, 10, [credit])
      $('#RangeSliderCP').attr('value', cs);
      if ( cs > 0 && cs % 1 !== 0 || cs == 10 ) { $('#CreditVal').text('+' + cs) } 
      else if ( cs == 0 ) { $('#CreditVal').text('0.0') } 
      else if ( cs <=0 && cs % 1 !== 0 || cs == -10 ) { $('#CreditVal').text(cs) } 
      else if ( cs > 0 && cs < 10 && cs % 1 === 0 ) { $('#CreditVal').text('+' + cs + '.0') } 
      else if ( cs > -10 && cs < 0 && cs % 1 === 0 ) { $('#CreditVal').text(cs + '.0') }
    }
    let spantipWidth = spanTip.offsetWidth
    let positionX = window.scrollX + (spanbox.right + spanbox.left)/2 - spantipWidth/2
    let positionX2 = window.scrollX + (selLetterLeft + 5) - spantipWidth/2
    if ( positionX2 > positionX ) { positionX = positionX2 }
    let positionY = window.scrollY + spanbox.top - 30
    $(spanTip).css({'left': positionX + 'px', 'top': positionY + 'px'})
    animation = anime({
      targets: '.highlightTooltip',
      direction: 'normal',
      duration: 200,
      opacity: 0.95,
      top: '-=3px',
      easing: 'linear',
    }); 
    spantipWidth = document.getElementsByClassName('highlightTooltip')[0].offsetWidth
    oldboxTop = spanbox.top;
    oldboxLeft = spanbox.left;
    oldboxRight = spanbox.right
    sen.currentSentence(e.target)
    let senIndex = postSchema.sentence
    .findIndex( sentence => sentence.senId == target.id)
    if (senIndex !== -1) {
      if (postSchema.sentence[senIndex].denominator !== 0) {
        $('#AllComments').off('click').on('click', () => { expandCommentsFn(target) } )
      }
      else {
        $('#AllComments').off('click')
        $('#AllCommentsIcon').css('color', '#999')
      }
    }    
    else {
      $('#AllComments').off('click')
      $('#AllCommentsIcon').css('color', '#999')
    }
    $('#Edit').off('click').on('click', () => { expandSpanFn(target) } )
    $('.add-source').off('click').on('click', () =>{ addSource('', target) } )
  }
}

function clearSelfEval(e) {
  targetId = e.target.getAttribute('data-num')
  $('#SelfSlide' + targetId).val('---')
  $('#SlideSelf' + targetId).val('1')
  $('#SExplain' + targetId).val('')
  catEval(e)
}

function removeCat(e) {
  let removeId = parseInt( e.target.id.substr(9) )
  $('#MainCatA' + removeId).remove()
  $('.add-cat').off('click').on('click', addCat)
  eval.category()
}

function removeInf(e) {
  if ( e.target.id === 'RemoveInf1') {
    $('#InfSlide1').val('---');
    $('#IExplain1').val('');
    infEval(e, 1)
  } 
  else {
    let idNum = document.getElementsByClassName('inf-input');
    if ( idNum.length === 2 ) { $('#RemoveInf1').removeClass('hide-field') }
    let removeId = parseInt( e.target.id.substr(9) )
    $('#MainInfA' + removeId).remove()
    let infTotal = 0;
    let infValue = document.getElementsByClassName('inf-slider-input');
    for (let a = 0; a < infValue.length; a++) {
      infTotal += parseFloat(infValue[a].value) }
    for (let a = 0; a < infValue.length; a++) {
      let idVal = infValue[a].getAttribute('data-num')
      let sliderVal = parseFloat(infValue[a].value)
      let inFPercent = sliderVal/infTotal*100
      $('#InfSlide' + idVal).val(inFPercent.toFixed(1) + '%')
    }
  }
  let idNum = document.getElementsByClassName('inf-input');
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    infEval(e, num)
  }
}

function comEval() {
  if ( $('#ComExplain').val() === '' ) {
    $('#ComStatus1').removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('hide-field').css('color', '#999');
    $('#ComExplain').css({'border': '', 'background-color': ''});
    $('#CommentRange').css({'border': ''});
    $('#ComRange').css({'border': ''}) } 
  else if ( $('#ComExplain').val() !== '' && $('#ComSlide').val() !== '---' && $('#CommentVal').text() !== '---' ) {
    $('#ComStatus1').removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0');
    $('#ComExplain').css({'border': '0.5px solid #0c0', 'background-color': '#cec'});
    $('#CommentRange').css({'border': ''});
    $('#ComRange').css({'border': ''}) } 
  else {
    if ( $('#CommentVal').text() === '---' ) {
      $('#CommentRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#CommentRange').css({'border': ''}) }
    if ( $('#ComSlide').val() === '---' ) {
      $('#ComRange').css({'border': '0.5px solid #e00'}) } 
    else { $('#ComRange').css({'border': ''}) }
    $('#ComStatus1').removeClass('hide-field').removeClass('fa-check-circle').addClass('fa-times-circle').css('color', '#e00');
    $('#ComExplain').css({'border': '', 'background-color': ''});
  }
  eval.context()
}

function infEval(e, num) {
  if (!num) { num = e.target.getAttribute('data-num') }
  if ( num == 1 ) {
    if ( $('#InfSlide' + num).val() !== '---' && $('#IExplain' + num).val() === '' ) {
      $('#InfRange' + num).css({'border': '', 'border-right': '0'})
      $('#InfSearchBox' + num).css({'border': '', 'background-color': '#eee', 'border-left': '0.5px solid #999;'});
      $('#IExplain' + num).css({'border': '0.5px solid #e00', 'background-color': '#fdd'});
      $('#InfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } 
    else if ( $('#InfSlide' + num).val() !== '---' && $('#IExplain' + num).val() !== '' ) {
      $('#InfRange' + num).css({'border': '', 'border-right': '0'})
      $('#InfSearchBox' + num).css({'border': '0.5px solid #0c0', 'background-color': '#cec', 'border-left': '0.5px solid #0c0'});
      $('#IExplain' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#InfStatus' + num).removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0') } 
    else if ( $('#InfSlide' + num).val() === '---' && $('#IExplain' + num).val() === '' ) {
      $('#InfRange' + num).css({'border': '', 'border-right': '0'})
      $('#InfSearchBox' + num).css({'border': '', 'background-color': '#eee', 'border-left': '0.5px solid #999;'});
      $('#IExplain' + num).css({'border': '', 'background-color': ''});
      $('#InfStatus' + num).removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('hide-field').css('color', '#999') } 
    else if ( $('#InfSlide' + num).val() === '---' && $('#IExplain' + num).val() !== '' ) {
      $('#InfRange' + num).css({'border': '0.5px solid #e00', 'border-right': '0.5px solid #e00;'})
      $('#InfSearchBox' + num).css({'border': '', 'background-color': '#eee', 'border-left': '0'});
      $('#IExplain' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#InfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } } 
  else {
    if ( $('#InfSearchBox' + num).val() !== '' && $('#IExplain' + num).val() === '' ) {
      $('#InfSearchBox' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#IExplain' + num).css({'border': '0.5px solid #e00', 'background-color': '#fdd'});
      $('#InfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } 
    else if ( $('#InfSearchBox' + num).val() === '' && $('#IExplain' + num).val() !== '' ) {
      $('#InfSearchBox' + num).css({'border': '0.5px solid #e00', 'background-color': '#fdd'});
      $('#IExplain' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#InfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } 
    else if ( $('#InfSearchBox' + num).val() !== '' && $('#IExplain' + num).val() !== '' ) {
      $('#InfSearchBox' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#IExplain' + num).css({'border': '0.5px solid #0c0', 'background-color': '#dfd'});
      $('#InfStatus' + num).removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0') } 
    else if ( $('#InfSearchBox' + num).val() === '' && $('#IExplain' + num).val() === '' ) {
      $('#InfSearchBox' + num).css({'border': '0.5px solid #e00', 'background-color': '#fdd'});
      $('#IExplain' + num).css({'border': '0.5px solid #e00', 'background-color': '#fdd'});
      $('#InfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') }
  }
  eval.influence()
}

function catEval(e) {
  let num = e.target.getAttribute('data-num');
  if ( ( $('#CatSearchBox' + num).val() !== '' && $('#CExplain' + num).val() !== '' ) && ( ( $('#SExplain' + num).val() === '' && $('#SelfSlide' + num).val() === '---' ) || ( $('#SExplain' + num).val() !== '' && $('#SelfSlide' + num).val() !== '---' ) ) ) {
    $('#CatStatus' + num).removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0') 
    $('#CatSearchBox' + num).css({'border': '1px solid #0c0', 'background-color': '#dfd'});
    $('#CExplain' + num).css({'border': '1px solid #0c0', 'background-color': '#dfd'});
    if ( $('#SExplain' + num).val() !== '' && $('#SelfSlide' + num).val() !== '---' ) {
      $('#SelfRange' + num).css({'border': ''});
      $('#SelfStatus' + num).removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0')
      $('#SExplain' + num).css({'border': '1px solid #0c0', 'background-color': '#dfd'});
    }
    else {
      $('#SelfStatus' + num).removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('hide-field').css('color', '#eee')
      $('#SExplain' + num).css({'border': '', 'background-color': ''});
      $('#SelfRange' + num).css({'border': ''});
    }
  }
  else if ( $('#CatSearchBox' + num).val() === '' && $('#CExplain' + num).val() === '' && $('#SExplain' + num).val() === '' && $('#SelfSlide' + num).val() === '---') {
    $('#CatSearchBox' + num).css({'border': '', 'background-color': ''});
    $('#CExplain' + num).css({'border': '', 'background-color': ''});
    $('#SelfRange' + num).css({'border': ''});
    $('#SExplain' + num).css({'border': '', 'background-color': ''});
    $('#CatStatus' + num).removeClass('fa-times-circle').removeClass('fa-check-circle').addClass('hide-field').css('color', '#999')
    $('#SelfStatus' + num).removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('hide-field').css('color', '#eee')
  }
  else {
    $('#CatStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00')
    if ( $('#CatSearchBox' + num).val() === '' && $('#CExplain' + num).val() !== '' ) {
      $('#CatSearchBox' + num).css({'border': '1px solid #e00', 'background-color': '#fdd'});
      $('#CExplain' + num).css({'border': '', 'background-color': ''});
      $('#CatStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } 
    else if ( $('#CatSearchBox' + num).val() !== '' && $('#CExplain' + num).val() === '' ) {
      $('#CatSearchBox' + num).css({'border': '', 'background-color': ''});
      $('#CExplain' + num).css({'border': '1px solid #e00', 'background-color': '#fdd'});
      $('#CatStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00') } 

    if ( $('#SExplain' + num).val() === '' && $('#SelfSlide' + num).val() === '---') {
      $('#SelfRange' + num).css({'border': ''});
      $('#SExplain' + num).css({'border': '', 'background-color': ''});
      $('#SelfStatus' + num).removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('hide-field').css('color', '#eee')
    }
    else if ( $('#SExplain' + num).val() !== '' && $('#SelfSlide' + num).val() === '---') {
      $('#SelfRange' + num).css({'border': '1px solid #e00'});
      $('#SExplain' + num).css({'border': '1px solid #0c0', 'background-color': '#dfd'});
      $('#SelfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00')
    }
    else if ( $('#SExplain' + num).val() === '' && $('#SelfSlide' + num).val() !== '---') {
      $('#SelfRange' + num).css({'border': ''});
      $('#SExplain' + num).css({'border': '1px solid #e00', 'background-color': '#fdd'});
      $('#SelfStatus' + num).removeClass('fa-check-circle').removeClass('hide-field').addClass('fa-times-circle').css('color', '#e00')
    }
    else if ( $('#SExplain' + num).val() !== '' && $('#SelfSlide' + num).val() !== '---') {
      $('#SelfRange' + num).css({'border': ''});
      $('#SExplain' + num).css({'border': '1px solid #0c0', 'background-color': '#dfd'});
      $('#SelfStatus' + num).removeClass('fa-times-circle').removeClass('hide-field').addClass('fa-check-circle').css('color', '#0c0') 
    } 
  }
  eval.category()
}

function catSchemaFn() {
  catSchema = []
  selfSchema = []
  let i = 0;
  let idNum = document.getElementsByClassName('cat-input');
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    if ( $('#CatSearchBox' + num).val() !== "" && $('#CExplain' + num).val() !== "" ) {
      catSchema.push({
        'name': $('#CatSearchBox' + num).val(),
        'id': $('#CatSearchBox' + num).attr('data-id'),
        'rank': $('#CatSlide' + num).val(),
        'explanation': $('#CExplain' + num).val()
      })
    }
    if ( $('#SelfSearchBox' + num).val() !== "" && $('#SExplain' + num).val() !== "" ) {
      selfSchema.push({
        'name': $('#CatSearchBox' + num).val(),
        'id': $('#CatSearchBox' + num).attr('data-id'),
        'rank': $('#SelfSlide' + num).val(),
        'explanation': $('#SExplain' + num).val()
      })
    }
  }
  return catSchema
}

function infSchemaFn() {
  infSchema = []
  let i = 0;
  let idNum = document.getElementsByClassName('inf-input');
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    if ( $('#InfSearchBox' + num).val() !== '' && $('#IExplain' + num).val() !== '' ) {
      let infPercent = $('#InfSlide' + num).val()
      infPercent = infPercent.slice(0, -1)
      infSchema.push({
        'name': $('#InfSearchBox' + num).val(),
        'id': $('#InfSearchBox' + num).attr('data-id'),
        'percent': infPercent,
        'explanation': $('#IExplain' + num).val()
      })
    }
  }
  // console.log(infSchema)
}

function removePropCat(e) {
  let propNum = $(e.target).attr('data-prop-num')
  $('[data-prop-num="' + propNum + '"][data-prop="cat-box"]').remove()
  eval.proposal({target: 'cat', action: 'remove', num: propNum})
}

function addSPropCat(count) {
  $('[data-sprop="category-container"]').append(`
    <div class="flex-l title-container" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;" data-sprop="cat-box" data-sprop-num="` + count + `">
      <div class="flex-l pad-6" style="width: 100%;">
        <form autocomplete="off" style="width: 100%;" class="flex-l">
        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
          <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;" data-sprop-num="` + count + `" data-sprop="catValue-display">
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
              <div class="flex-s">
              </div>
              <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" value="1.0" step="0.001" data-sprop-num="` + count + `" data-sprop="cat-display"></input>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div id="CatSearchSProp` + count + `" style="width: 100%; position: relative;">
          <input id="CatSearchBoxSProp` + count + `" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag" type="text" placeholder="Category" data-input="sprop" data-sprop="catName" data-sprop-num="` + count + `" data-num="SProp` + count + `" data-sprop-action="set"></input>
          <div style="position: absolute; right: 12px; top: 5px; color: #999;">
            <div class="" style="color: #999; font-size: 14px;" data-sprop="cat-name-eval" data-sprop-num="` + count + `"></div>
          </div>
        </div>
      </form> 
      <div class="form-button mr-pd" data-sprop-num="` + count + `" data-click="sprop" data-sprop="cat" data-sprop-action="remove">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div class="form-button mr-pd" data-click="sprop" data-sprop="cat" data-sprop-action="add">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div> 
    <div class="pad-6 hidden-field" style="width: 100%;">
      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
        <div class="flex-l" style="width: 100%; height: 20px;">
          <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
        </div>
        <div class="flex-br">
        </div>
        <div class="flex-l" style="padding: 0;">
          <span class="sl-i">0.001</span>
          <input class="flex-l no-drag" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-sprop="catValue" data-sprop-num="` + count + `" data-sprop-action="set">
          <span class="sl-i">1000</span>
        </div>
      </div>
    </div>
    <div class="pad-6 hidden-field" style="width: 100%">
      <textarea rows="2" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t" placeholder="Rating justification..." data-sprop-num="` + count + `" data-input="sprop" data-sprop="catReason" data-sprop-action="set"></textarea>
    </div>
  </div>
  `)
  $('.no-drag').mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $('.no-drag').mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  $('[data-sprop="catValue"]').off('mousedown').on('mousedown', catSPropSlider)
  $('[data-sprop="catValue"]').off('touchstart').on('touchstart', catSPropSlider)
  $('[data-input="sprop"]').off('input').on('input', (e) => {
    let spNum = $(e.target).attr('data-sprop-num')
    let spTarget = $(e.target).attr('data-sprop')
    let spAction = $(e.target).attr('data-sprop-action')
    if (spAction === 'set' && spTarget === 'catName') {
      prop.controller({target: spTarget, action: 'remove', num: spNum})
      catInputFn(e)
      copyText(e)
    }
    else {
      prop.controller({target: spTarget, action: spAction, num: spNum})
    }
  })
  $('[data-click="sprop"]').off('click').on('click', (e) => {
    let spNum = $(e.target).attr('data-sprop-num')
    let spTarget = $(e.target).attr('data-sprop')
    let spAction = $(e.target).attr('data-sprop-action')
    prop.controller({target: spTarget, action: spAction, num: spNum})
  })
}

function addPropCat() {
  if ( $('[data-prop="cat-box"]').length < 4) {
    let count = sen.counter('prop-cat')
    $('[data-prop="category-container"]').append(`
      <div class="flex-l title-container" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;" data-prop="cat-box" data-prop-num="` + count + `">
        <div class="flex-l pad-6" style="width: 100%;">
          <form autocomplete="off" style="width: 100%;" class="flex-l">
          <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
            <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;" data-prop-num="` + count + `" data-prop="catValue-display">
              <div class="flex-br">
              </div>
              <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
                <div class="flex-s">
                </div>
                <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" value="1.0" step="0.001" data-prop-num="` + count + `" data-prop="cat-display"></input>
                <div class="flex-s">
                </div>
              </div>
            </div>
          </div>
          <div id="CatSearchProp` + count + `" style="width: 100%; position: relative;">
            <input id="CatSearchBoxProp` + count + `" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag" type="text" placeholder="Category" data-input="prop" data-prop="catName" data-prop-num="` + count + `" data-num="Prop` + count + `" data-prop-action="set"></input>
            <div style="position: absolute; right: 12px; top: 5px; color: #999;">
              <div class="" style="color: #999; font-size: 14px;" data-prop="cat-name-eval" data-prop-num="` + count + `"></div>
            </div>
          </div>
        </form> 
        <div class="form-button mr-pd" data-prop-num="` + count + `" data-click="prop" data-prop="cat" data-prop-action="remove">
          <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
        <div class="form-button mr-pd" data-click="prop" data-prop="cat" data-prop-action="add">
          <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
      </div> 
      <div class="pad-6 hidden-field" style="width: 100%;">
        <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
          <div class="flex-l" style="width: 100%; height: 20px;">
            <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
          </div>
          <div class="flex-br">
          </div>
          <div class="flex-l" style="padding: 0;">
            <span class="sl-i">0.001</span>
            <input class="flex-l no-drag" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-click="prop" data-prop="catValue" data-prop-num="` + count + `" data-prop-action="set">
            <span class="sl-i">1000</span>
          </div>
        </div>
      </div>
      <div class="pad-6 hidden-field" style="width: 100%">
        <textarea rows="2" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t" placeholder="Rating justification..." data-prop-num="` + count + `" data-input="prop" data-prop="catReason" data-prop-action="set"></textarea>
      </div>
    </div>
    `)
    eval.proposal({target: 'cat', action: 'add', num: count})
    $('[data-prop="catValue"]').off('mousedown').on('mousedown', catPropSlider)
    $('[data-prop="catValue"]').off('touchstart').on('touchstart', catPropSlider)
    $('.cat-input').off('keyup').on('keyup', e => {catInputFn(e); copyText(e)})
    $('[data-prop="remove-cat"]').off('click').on('click', e => { 
      // console.log('remove cat')
      removePropCat(e)
    })  
    $('.cat-input').off('mouseover').on('mouseover', catRangeSlider)
    $('.cat-on').off('click').on('input', catEval)
    $('.self-slider-input').off('click').on('click', catEval )
    $('.self-slider-input').off('touchend').on('touchend', catEval )
    $('[data-input="prop"]').off('input').on('input', propRouter)
    $('[data-click="prop"]').off('click').on('click', propRouter)
    $('[data-prop="funding"]').off('input').on('input', propFunding)
  }
}

function addCat() {
  let i = 1;
  let idList = []
  let idNum = document.getElementsByClassName('cat-input');
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    idList.push(num)
  }
  while ( idList.includes(i) ) { i++ }
  $('#CategoriesBox').append(`
    <div id="MainCatA`+ i +`" class="flex-l title-container cat-range rev-on" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;">
      <div id="CatBoxes`+ i +`" class="flex-l pad-6" style="width: 100%;">
        <form autocomplete="off" style="width: 100%;" class="flex-l">
        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
          <div id="CatRange`+ i +`" class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;">
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
              <div class="flex-s">
              </div>
              <input type="text" id="CatSlide`+ i +`" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="1.0" step="0.001"></input>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div style="width: 100%; position: relative;" id="CatSearch`+ i +`">
          <input id="CatSearchBox`+ i +`" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag cat-input cat-on" type="text" placeholder="Category" data-id="" data-num="`+ i +`"></input>
          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
            <div id="CatStatus`+ i +`" class="fa cat-eval-btn" style="color: #999; font-size: 14px;" data-num="`+ i +`"></div>
          </div>
        </div>
      </form> 
      <div id="RemoveCat`+ i +`" class="form-button remove-cat mr-pd">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div id="AddedCat`+ i +`" class="form-button add-cat mr-pd">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div> 
    <div class="pad-6 hidden-field" style="width: 100%;">
      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
        <div class="flex-l" style="width: 100%; height: 20px;">
          <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
        </div>
        <div class="flex-br">
        </div>
        <div class="flex-l" style="padding: 0;">
          <span class="sl-i">0.001</span>
          <input id="SlideCat`+ i +`" class="flex-l input-range no-drag slider-input" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="`+ i +`">
          <span class="sl-i">1000</span>
        </div>
      </div>
    </div>
    <div class="pad-6 hidden-field" style="width: 100%">
      <textarea rows="2" id="CExplain`+ i +`" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t cat-on" placeholder="Rating justification..." data-num="`+ i +`"></textarea>
    </div>
    <div class="pad-6 hidden-field" style="width: 100%; margin-top: 6px">
      <span class="ft-12" style="color: #000; padding: 4px 4px 4px 0;">Self Review:</span>
    </div>
    <div id="SelfBoxes`+ i +`" class="flex-l pad-6 hidden-field" style="width: 100%;">
      <form autocomplete="off" style="width: 100%;" class="flex-l">
        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
          <div id="SelfRange`+ i +`" class="spantip-box" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; border-right: 1px solid #999;">
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
              <div class="flex-s">
              </div>
              <input type="text" id="SelfSlide`+ i +`" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" data-id="" value="---" step="0.001"></input>
              <div class="flex-s">
              </div>
            </div>
            <input class="input-range no-drag hide-field" orient="vertical" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 100px; width: 60px; overflow: hidden; margin-bottom: 8px;">
            </input>
          </div>
        </div>
        <div style="width: 100%; position: relative;" id="SelfSearch`+ i +`">
          <input id="SelfSearchBox`+ i +`" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase; pointer-events: none; background-color: #eee; border-left: 0;" class="cat-slider form-field no-drag self-input cat-on" type="text" placeholder="Category" data-id="" data-num="`+ i +`"></input>
          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
            <div id="SelfStatus`+ i +`" class="fa cat-eval-btn" style="color: #999; font-size: 14px;" data-num="`+ i +`"></div>
          </div>
        </div>
        <div id="RemoveSelf`+ i +`" class="form-button remove-self mr-pd" data-num="`+ i +`">
          <span class="fa fa-undo" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
      </form> 
    </div> 
    <div class="pad-6 hidden-field" style="width: 100%;">
      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
        <div class="flex-br">
        </div>
        <div class="flex-l" style="padding: 0;">
          <span id="SelfLow`+ i +`" class="sl-i">0.001</span>
          <input id="SlideSelf`+ i +`" class="flex-l input-range no-drag self-slider-input" orient="horizontal" type="range" step="0.001" value="---" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="`+ i +`">
          <span id="SelfHigh`+ i +`" class="sl-i">1000</span>
        </div>
      </div>
    </div>
    <div class="pad-6 hidden-field" style="width: 100%">
      <textarea rows="2" id="SExplain`+ i +`" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t cat-on" placeholder="Self rating justification..." data-num="`+ i +`"></textarea>
    </div>
  </div>
  `)
  $('.cat-input').off('keyup').on('keyup', e => {catInputFn(e); copyText(e)})
  $('.add-cat').off('click').on('click', addCat)
  $('.cat-input').off('mouseover').on('mouseover', catRangeSlider)
  $('.cat-range').off('touchstart').on('touchstart', catRangeSlider)
  $('.self-input').off('mouseover').on('mouseover', catRangeSlider)
  $('.self-range').off('touchstart').on('touchstart', selfRangeSlider)
  $('.cat-on').off('click').on('input', catEval)
  $('.remove-self').off('click').on('click', clearSelfEval)
  $('.self-slider-input').off('click').on('click', catEval )
  $('.self-slider-input').off('touchend').on('touchend', catEval )
}

function addInf() {
  let i = 1;
  let idList = []
  let idNum = document.getElementsByClassName('inf-input');
  if ( idNum.length === 1 ) { $('#RemoveInf1').addClass('hide-field') }
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    idList.push(num)
  }
  while ( idList.includes(i) ) { i++ }
  $('#InfluenceBox').append(`
    <div id="MainInfA`+ i +`" class="flex-l title-container inf-range rev-on" style="border-radius: 0; border-top: 0.5px solid #999; padding: 6px 4px 12px 6px;">
      <div id="InfBoxes`+ i +`" class="flex-l pad-6" style="width: 100%;">
        <form autocomplete="off" style="width: 100%;" class="flex-l">
        <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
          <div id="InfRange`+ i +`" class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;">
            <div class="flex-br">
            </div>
            <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
              <div class="flex-s">
              </div>
              <input type="text" id="InfSlide`+ i +`" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0; pointer-events: none;" class="inf-slider form-field no-drag" placeholder="---" data-id="" value="1.0" step="0.001"></input>
              <div class="flex-s">
              </div>
            </div>
          </div>
        </div>
        <div style="width: 100%; position: relative;" id="InfSearch`+ i +`">
          <input id="InfSearchBox`+ i +`" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="inf-slider form-field no-drag inf-input inf-on" type="text" placeholder="Influence" data-id="" data-num="`+ i +`"></input>
          <div style="position: absolute; right: 6px; top: 5px; color: #999;">
            <div id="InfStatus`+ i +`" class="fa inf-eval-btn" style="color: #999; font-size: 14px;" data-num="`+ i +`"></div>
          </div>
        </div>
      </form> 
      <div id="RemoveInf`+ i +`" class="form-button remove-inf mr-pd">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div id="AddedInf`+ i +`" class="form-button add-inf mr-pd">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div> 
    <div class="pad-6" style="width: 100%;">
      <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 5px 5px;">
        <div class="flex-l" style="padding: 0;">
          <input id="SlideInf`+ i +`" class="flex-l input-range no-drag inf-slider-input" orient="horizontal" type="range" step="0.1" value="50" min="0.1" max="100" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-num="`+ i +`">
        </div>
      </div>
    </div>
    <div class="pad-6 hidden-field" style="width: 100%">
      <textarea rows="2" id="IExplain`+ i +`" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t inf-on" placeholder="Rating justification..." data-num="`+ i +`"></textarea>
    </div>
  </div>
  `)
  $('.inf-input').off('keyup').on('keyup', e => infInputFn(e))
  $('.inf-range').off('mouseover').on('mouseover', infRangeSlider)
  $('.inf-range').off('touchstart').on('touchstart', infRangeSlider)
  let infTotal = 0;
  let infValue = document.getElementsByClassName('inf-slider-input');
  for (let a = 0; a < infValue.length; a++) {
    infTotal += parseFloat(infValue[a].value)
  }
  for (let a = 0; a < infValue.length; a++) {
    let idVal = infValue[a].getAttribute('data-num')
    let sliderVal = parseFloat(infValue[a].value)
    let inFPercent = sliderVal/infTotal*100
    $('#InfSlide' + idVal).val(inFPercent.toFixed(1) + '%')
  }
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    infEval(null, num)
  }
  $('.inf-on').off('input').on('input', e => { infEval(e) } )
}

function removeCom(e) {
  let removeId = parseInt( e.target.id.substr(12) )
  $('#ComUrlSubSrc' + removeId).remove()
}

function addCom() {
  let i = 1;
  let idList = []
  let idNum = document.getElementsByClassName('add-com-source');
  for (let a = 0; a < idNum.length; a++) {
    let num = parseInt(idNum[a].getAttribute('data-num'))
    idList.push(num)
  }
  while ( idList.includes(i) ) { i++ }
  $('#ComSources').append(`
  <div id="ComUrlSubSrc`+ i +`" class="flex-l pad-6">
    <div style="width: 100%;">
      <input id="ComUrlData`+ i +`" class="com-source-url span-eval" type="text" class="form-field no-drag" placeholder="Source URL" data-id=""></input>
    </div>
    <div id="RemoveComUrl`+ i +`" class="form-button remove-com-source mr-pd" data-num="1">
      <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
    </div>
    <div id="AddComUrl`+ i +`" class="form-button add-com-source mr-pd" data-num="1">
      <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
    </div>
  </div> 
  `)
  $('.add-com-source').off('click').on('click', addCom)
  $('.remove-com-source').off('click').on('click', removeCom)
}

function removeSource(e) {
  let removeId = e.target.id
  $('#Url' + removeId).remove()
}

function addRankSource() {
  let count = document.getElementsByClassName('add-rank-url').length + 1
  if (count <= 3) {
    let noValue = false
    let numCount = 2
    while (!noValue) {
      if ( $('.rank-url').length == 0 ) {
        numCount = 2
        break;
      }
      else {
        for (let i = 0; i < $('.rank-url').length; i++) {
          let rankUrl = $('.rank-url')[i]
          if ( $(rankUrl).attr('data-count') == numCount ) {
            numCount++
            break
          }
          if (i + 1 == $('.rank-url').length && $(rankUrl).attr('data-count') !== numCount) {
            noValue = true
            break
          }
        }
      }
    }
    $('#RankBox').append(`
    <div class="flex-l rank-url" style="width: 100%; padding: 0 4px 4px 4px;" data-count="` + numCount + `">
      <form autocomplete="off" style="width: 100%;">
        <div>
          <input style="width: 100%; border-radius: 5px;" class="rank-url-text form-field no-drag span-eval" type="text" placeholder="Source URL" data-id="" data-count="` + numCount + `"></input>
        </div>
      </form>
      <div class="form-button remove-rank-url mr-pd" style="margin: 0 0 0 4px;" data-count="` + numCount + `">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div class="form-button add-rank-url mr-pd" style="margin: 0 0 0 4px;" data-count="` + numCount + `">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div> 
    `)
    $('.add-rank-url').off('click').on('click', addRankSource )
    $('.remove-rank-url').off('click').on('click', e => { removeRankSource(e) } )
  }
}

function removeRankSource(e) {
  let urlTag
  let count = $(e.target).attr('data-count')
  for (let i = 0; i < $('.rank-url').length; i++) {
    let rankUrl = $('.rank-url')[i]
    if ( $(rankUrl).attr('data-count') == count ) {
      urlTag = $(rankUrl)[0]
      break
    }
  }
  $(urlTag).remove()
}

function addReplyUrl(num) {
  let count = document.getElementsByClassName('add-url' + num).length + 1
  if (count <= 4) {
    let noValue = false
    let numCount = 2
    while (!noValue) {
      if ( $('.src-url' + num).length == 0 ) {
        numCount = 2
        break;
      }
      else {
        for (let i = 0; i < $('.src-url' + num).length; i++) {
          let srcUrl = $('.src-url' + num)[i]
          if ( $(srcUrl).attr('data-count') == numCount ) {
            numCount++
            break
          }
          if (i + 1 == $('.src-url' + num).length && $(srcUrl).attr('data-count') !== numCount) {
            noValue = true
            break
          }
        }
      }
    }
    $('#ReplyBox' + num).append(`
    <div class="flex-l src-url` + num + `" style="width: 100%; padding: 0 4px 4px 4px;" data-count="` + numCount + `">
      <form autocomplete="off" style="width: 100%;">
        <div>
          <input style="width: 100%; border-radius: 5px;" class="source-url` + num + ` form-field no-drag span-eval" type="text" placeholder="Source URL" data-id="" data-count="` + numCount + `"></input>
        </div>
      </form>
      <div class="form-button remove-url` + num + ` mr-pd" style="margin: 0 0 0 4px;" data-count="` + numCount + `">
        <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
      <div class="form-button add-url` + num + ` mr-pd" style="margin: 0 0 0 4px;" data-count="` + numCount + `">
        <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
      </div>
    </div> 
    `)
    $('.add-url' + num).off('click').on('click', () => { addReplyUrl(num) } )
    $('.remove-url' + num).off('click').on('click', (e) => { removeReply(e, num) } )
  }
}

function removeReply(e, num) {
  let urlTag
  let count = $(e.target).attr('data-count')
  for (let i = 0; i < $('.src-url' + num).length; i++) {
    let srcUrl = $('.src-url' + num)[i]
    if ( $(srcUrl).attr('data-count') == count ) {
      urlTag = $(srcUrl)[0]
      break
    }
  }
  $(urlTag).remove()
}

function addSource(url, target) {
  if (url == '[object MouseEvent]' || !url) {
    url = '';
    $('#SpanEdit').css('height', 'auto')
  }
  let count = document.getElementsByClassName('add-source').length
  if (count < 4) {
    let i = 1;
    let sourceID = document.getElementById('UrlData' + i);
    while (sourceID) {
      i++;
      sourceID = document.getElementById('UrlData' + i);
    }
    $('#CommentBox').append(`
      <div id="UrlSubSrc`+ i +`" class="flex-l pad-6s" style="width: 100%;">
        <form autocomplete="off" style="width: 100%;">
          <div>
            <input id="UrlData`+ i +`" class="source-url form-field no-drag span-eval" type="text" value="`+ url +`" placeholder="Source URL" data-id=""></input>
          </div>
        </form>
        <div id="SubSrc`+ i +`" class="form-button remove-source mr-pd">
          <span class="fa fa-minus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
        <div id="AddUrl`+ i +`" class="form-button add-source mr-pd">
          <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
        </div>
      </div>
    `)
    $('.add-source').off('click').on('click', () => { addSource('', target) } )
    $('.remove-source').off('click').on('click', removeSource)
  }
  $('.span-eval').off('input').on('input', () => { 
    visCheck(target)
    spanEval(target) } )
}

function setGreyscale(is, target) {
  let color = parseInt(is*(-3.4)+255)
  let output = 'rgba(' + color + ', ' + color + ', ' + color + ', 1)'
  $(target).css('background-color', output)
}

function getColor(cs, is) {
  if (!is) {is = 10;}
  let opacity = parseFloat(is*(0.06)+0.4)
  let tempred = parseFloat((cs*(-0.451)) + 10)
  let tempgreen = parseFloat((cs*(0.337)) + 10);
  let tempgreenplus = parseFloat((cs*(-0.114)) + 10);
  let red = parseInt(tempred * 25.5)
  let greenplus = parseInt(tempgreenplus * 25.5)
  let green = parseInt(tempgreen * 25.5)
  var output = 'rgba(238, 238, 238, ' + opacity + ')';
  if ( cs.length > 8 ) {
    return output = cs + opacity + ')';
  } else if ( cs === null) {
    return output = 'rgba(238, 238, 238, ' + opacity + ')';
  } else if (-10 <= cs && cs < 0) { 
    return output = 'rgba(255, ' + green + ', 112, ' + opacity + ')'
  } else if (0 <= cs && cs <= 10) { 
    return output = 'rgba(' + red + ', ' + greenplus + ', 112, ' + opacity + ')'
  } else if (cs < -10 || cs > 10 || cs == null) {
    return output = 'rgba(238, 238, 238, ' + opacity + ')'; }
}

function setColor(cs, is, target) {
  if (!is) {is = 10;}
  let opacity = parseFloat(is*(0.06)+0.4)
  let tempred = parseFloat((cs*(-0.451)) + 10)
  let tempgreen = parseFloat((cs*(0.337)) + 10);
  let tempgreenplus = parseFloat((cs*(-0.114)) + 10);
  let red = parseInt(tempred * 25.5)
  let greenplus = parseInt(tempgreenplus * 25.5)
  let green = parseInt(tempgreen * 25.5)
  var output = 'rgba(238, 238, 238, ' + opacity + ')';
  if ( cs.length > 8 ) {
    output = cs + opacity + ')';
  } else if ( cs === null) {
    output = 'rgba(238, 238, 238, ' + opacity + ')';
  } else if (-10 <= cs && cs < 0) { 
    output = 'rgba( 255, ' + green + ', 112, ' + opacity + ')'
  } else if (0 <= cs && cs <= 10) { 
    output = 'rgba( ' + red + ', ' + greenplus + ', 112, ' + opacity + ')'
  } else if (cs < -10 || cs > 10 || cs == null) {
    output = 'rgba(238, 238, 238, ' + opacity + ')'; }
  for (let i = 0; i < target.length; i++) {
    $(target[i]).css('background-color', output)
  }
}

function propBid(comNum, comData) {
  let userName = userSchema.fullName
  let funding = comData.authorData.funding
  $('[data-snav="submit"], [data-snav="reset"]').removeClass('hide-field')
  anime({
    targets: ['[data-snav="submit"]', '[data-snav="reset"]'],
    direction: 'normal',
    duration: 200,
    delay: 0,
    opacity: 1,
    easing: 'easeOutQuart' 
  });

  $('[data-sprop="review-corner-btn"][data-sprop-num="' + comNum + '"]').css('color', '#000')
  $('[data-sprop="review-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#000')
  $('[data-sprop="review"][data-sprop-num="' + comNum + '"]').css('background-color', '#e4db66')

  $('[data-sprop="bid-corner-btn"][data-sprop-num="' + comNum + '"]').css('color', '#222')
  $('[data-sprop="bid-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#222')
  $('[data-sprop="bid"][data-sprop-num="' + comNum + '"]').css('background-color', '#fbf8c2')

  $('#ComNumR' + comNum).append(`
  <div class="flex-l com-reply` + comNum + `" style="flex-wrap: wrap;">
    <div class="flex-l flex-s icn-a" style="position: relative;">
      <div>
        <span class="fa fa-gavel icn-11"></span>
      </div>
      <div class="ft-11">BID</div>
      <div class="flex-s"></div>
      <div style="position: absolute; right: 28px; top: 7px; color: #999;">
        <div class="" style="color: #999; font-size: 14px;" data-sprop="bids-eval"></div>
      </div>
      <div class="flex-l icn-typ">
        <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="sprop" data-sprop="allBids" data-sprop-action="reset"></span></div>
      </div>
      <div class="flex-br"></div>
      <div class="flex-l pad-6" style=" background-color: #fff; flex-wrap: wrap;">
        <div class="flex-br"></div>  
        <div class="flex-l pad-6" style="width: 100%;">
          <div class="ft-w" style="font-size: 10px;">FUNDING</div>
          <form autocomplete="off" style="width: 100%; margin-left: 8px;" class="flex-l">
            <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0; width: 90px;">
              <div class="spantip-box br-9" style="position: relative; width: 90px; z-index: 5000; border-radius: 5px; overflow: hidden; height: 24px;" data-sprop="funding-eval">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px; position: relative;">
                  <div class="flex-s">
                  </div>
                  <div class="fa fa-krw ft-14" style="font-size: 13px; margin: 0 0 0 8px;">
                  </div>
                  <input type="text" style="font-family: Arial,sans-serif !important; border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: left; margin: 0; font-size: 13px; padding: 4px 0px 4px 3px;" class="com-slider form-field no-drag" value="" maxlength="7" placeholder="` + funding + `" data-input="sprop" data-sprop="funding" data-sprop-action="set"></input>
                  <div style="visibility: hidden; position: absolute; left: 0px; top: 0px;" data-sprop="hidden-display">
                    <span style="font-family: Arial,sans-serif !important; border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 13px; padding-left: 1px" class="com-slider form-field" data-sprop="hidden-text">` + funding + `<span>
                  </div>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
          </form> 
        </div> 
        <div class="flex-l pad-6" style="width: 100%;">
          <div class="ft-w" style="font-size: 10px;">INFLUENCE</div>
          <form autocomplete="off" style="width: 100%; margin-left: 8px;" class="flex-l">
            <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
              <div class="spantip-box br-9" style="position: relative; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden; height: 24px;" data-sprop="influence-eval">
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="box-sizing: border-box; height: 22px;">
                  <div class="flex-s">
                  </div>
                  <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #e6e6e6; text-align: center; margin: 0; pointer-events: none; font-size: 13px;" class="com-slider form-field no-drag" value="---" data-sprop="influence-display"></input>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div class="bc-e br-9" style="width: 100%; border-radius: 0 5px 5px 0; padding: 4px; border-left: 0; height: 24px;">
              <div style="width: 100%;">
                <input class="flex-l input-range no-drag" orient="horizontal" type="range" step="0.1" value="5" min="0.1" max="99.9" style="user-drag: none; user-select: none; height: 14px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-sprop="influence" data-sprop-action="set"></input>
              </div>
            </div>
          </form> 
        </div> 
        <div class="flex-br" style="margin-top: 12px;"></div>                      
      </div>
    </div>
  </div>
  `)
  $(".no-drag").mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
  $(".no-drag").mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
  $('[data-sprop="funding"]').css('width', $('[data-sprop="hidden-display"]').width() + 5 )
  $('[data-sprop="funding"]').off('input').on('input', spropFunding)
  $('[data-sprop="influence"]').on('input', () => {
    let infVal = $('[data-sprop="influence"]').val()
    if ( infVal % 1 === 0 ) { $('[data-sprop="influence-display"]').val(infVal + '.0%') } 
    else { $('[data-sprop="influence-display"]').val(infVal + '%') }
    $('[data-sprop="influence"]').off('click').on('click', () => {
      prop.controller({target: 'influence', action: 'set', num: comNum })})
  })
  $('[data-click="sprop"]').off('click').on('click', (e) => {
    let spNum = $(e.target).attr('data-sprop-num')
    let spTarget = $(e.target).attr('data-sprop')
    let spAction = $(e.target).attr('data-sprop-action')
    prop.controller({target: spTarget, action: spAction, num: spNum})
  })
}

function propReply(comNum, comData) {
  let userName = userSchema.fullName
  $('[data-snav="submit"], [data-snav="reset"]').removeClass('hide-field')
  anime({
    targets: ['[data-snav="submit"]', '[data-snav="reset"]'],
    direction: 'normal',
    duration: 200,
    delay: 0,
    opacity: 1,
    easing: 'easeOutQuart' 
  });
  $('[data-sprop="bid-corner-btn"][data-sprop-num="' + comNum + '"]').css('color', '#000')
  $('[data-sprop="bid-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#000')
  $('[data-sprop="bid"][data-sprop-num="' + comNum + '"]').css('background-color', '#e4db66')
  $('[data-sprop="review-corner-btn"][data-sprop-num="' + comNum + '"]').css('color', '#222')
  $('[data-sprop="review-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#222')
  $('[data-sprop="review"][data-sprop-num="' + comNum + '"]').css('background-color', '#fbf8c2')
  $('#ComNumR' + comNum).append(`
    <div class="post-nav bc-e com-reply` + comNum + `" style="">
      <div style="padding: 0px 0px;">
        <div class="flex-l" style="flex-wrap: wrap;">
          <div class="flex-l flex-s icn-a" style="position: relative;">
            <div>
              <span class="fa fa-pencil icn-11"></span>
            </div>
            <div class="ft-11">REPLY</div>
            <div class="flex-s"></div>
            <div style="position: absolute; right: 28px; top: 7px; color: #999;">
              <div class="" style="color: #999; font-size: 14px;" data-sprop="info-eval"></div>
            </div>
            <div class="flex-l icn-typ">
              <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="sprop" data-sprop="allInfo" data-sprop-action="reset"></span></div>
            </div>
            <div class="flex-br"></div>
            <div class="flex-l pad-6" style="width: 100%; background-color: #fff; flex-wrap: wrap;">
              <div class="flex-br"></div>  
              <div class="flex-l pad-6" style="width: 100%; position: relative;">
                <textarea rows="5" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t br-9" placeholder="Proposal Response..." data-input="sprop" data-sprop="summary" data-sprop-action="set"></textarea>
                <div style="position: absolute; right: 12px; top: 10px; color: #999;">
                  <div class="" style="color: #999; font-size: 14px;" data-sprop="summary-eval"></div>
                </div>
              </div>
              <div style="width: 100%;" class="flex-c" data-sprop="source-container">
                <div style="width: 100%;" data-sprop-num="0" data-sprop="source-box">
                  <div class="flex-l pad-6">
                    <div style="width: 100%; position: relative;">
                      <input type="text" class="prop-source form-field no-drag" placeholder="Source" data-input="sprop" data-sprop="source" data-sprop-num="0" data-sprop-action="set"></input>
                      <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                        <div class="" style="color: #999; font-size: 14px;" data-sprop="source-eval" data-sprop-num="0"></div>
                      </div>
                    </div>
                    <div class="form-button mr-pd" data-click="sprop" data-sprop="source" data-sprop-num="0" data-sprop-action="add">
                      <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-br" style="margin-top: 12px;"></div>                      
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="post-nav bc-e com-reply` + comNum + `" style="">
      <div style="padding: 0px 0px 8px 0px;">
        <div class="flex-l" style="flex-wrap: wrap;">
          <div class="flex-l flex-s icn-a" data-sprop="category-container" style="position: relative;">
            <div>
              <span class="fa fa-list-ul icn-11"></span>
            </div>
            <div class="ft-11">CATEGORIES</div>
            <div class="flex-s"></div>
            <div style="position: absolute; right: 28px; top: 7px; color: #999;">
              <div class="" style="color: #999; font-size: 14px;" data-sprop="cats-eval"></div>
            </div>
            <div class="flex-l icn-typ">
              <div style="padding: 0;"><span class="fa fa-undo ft-14" style="cursor: pointer;" data-click="sprop" data-sprop="allCats" data-sprop-action="reset"></span></div>
            </div>
            <div class="flex-br"></div>
            <div class="flex-l title-container" style="border-radius: 0; padding: 6px 4px 12px 6px;" data-sprop="cat-box">
                <div class="flex-l pad-6" style="width: 100%;">
                  <form autocomplete="off" style="width: 100%;" class="flex-l">
                  <div class="t-t" style="box-sizing: border-box; height: 24px; margin: 0;">
                    <div class="spantip-box" style="position: relative; border-right: 0; width: 60px; z-index: 5000; border-radius: 5px 0 0 5px; overflow: hidden;" data-sprop-num="0" data-sprop="catValue-display">
                      <div class="flex-br">
                      </div>
                      <div class="flex-l span-ctn" style="box-sizing: border-box; height: 23px;">
                        <div class="flex-s">
                        </div>
                        <input type="text" style="border-radius: 0; border: 0; width: 100%; background-color: #ddd; text-align: center; margin: 0;" class="cat-slider form-field no-drag" placeholder="---" value="1.0" step="0.001" data-sprop-num="0" data-sprop="cat-display"></input>
                        <div class="flex-s">
                        </div>
                      </div>
                      <input class="input-range no-drag hide-field" orient="vertical" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 100px; width: 60px; overflow: hidden; margin-bottom: 8px;">
                      </input>
                    </div>
                  </div>
                  <div id="CatSearchSProp0" style="width: 100%; position: relative;">
                    <input id="CatSearchBoxSProp0" style="border-radius: 0 5px 5px 0; width: 100%; text-transform: uppercase;" class="cat-slider form-field no-drag" type="text" placeholder="Category" data-input="sprop" data-sprop="catName" data-sprop-num="0" data-num="SProp0" data-sprop-action="set"></input>
                    <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                      <div class="" style="color: #999; font-size: 14px;" data-sprop="cat-name-eval" data-sprop-num="0"></div>
                    </div>
                  </div>
                </form> 
                <div class="form-button mr-pd" data-click="sprop" data-sprop="cat" data-sprop-action="add">
                  <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
                </div>
              </div> 
              <div class="pad-6 hidden-field" style="width: 100%;">
                <div class="bc-e br-9" style="width: auto; border-radius: 5px; padding: 5px 5px 2px 5px;">
                  <div class="flex-l" style="width: 100%; height: 20px;">
                    <span style="font-size: 12px; font-family: Arial,sans-serif !important; font-weight: 500; margin-left: 8px; color: #999; pointer-events: none;">Typical post at 1.000 in category...</span>
                  </div>
                  <div class="flex-br">
                  </div>
                  <div class="flex-l" style="padding: 0;">
                    <span class="sl-i">0.001</span>
                    <input class="flex-l no-drag" orient="horizontal" type="range" step="0.001" value="1" min="0.4" max="1.6" style="user-drag: none; user-select: none; height: 15px; width: 100%; overflow: hidden; margin: 0; appearance: slider-horizontal;" data-sprop="catValue" data-sprop-num="0" data-sprop-action="set">
                    <span class="sl-i">1000</span>
                  </div>
                </div>
              </div>
              <div class="pad-6 hidden-field" style="width: 100%">
                <textarea rows="2" style="border-radius: 5px;" class="form-field no-drag bc-f tx-t" placeholder="Rating justification..." data-input="sprop" data-sprop="catReason" data-sprop-num="0" data-sprop-action="set"></textarea>
                <div style="position: absolute; right: 12px; top: 5px; color: #999;">
                  <div class="" style="color: #999; font-size: 14px;" data-sprop="cat-reason-eval" data-sprop-num="0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `)
    $(".no-drag").mouseover( () => { $('#PlatformContextMenu').removeClass('draggable') });
    $(".no-drag").mouseout( () => { $('#PlatformContextMenu').addClass('draggable') });
    $('.sprop-btn').hover((e) => {
      let target = $(e.target).attr('data-sprop')
      let btn = $(e.target).attr('data-btn')
      let num = $(e.target).attr('data-sprop-num')
      if ( prop.controller({get: 'open'}) === target ) {
        $(e.target).css({"background-color": "#666", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#eee")
      }
      else {
        $(e.target).css({"background-color": "#666", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#eee")
      }
    },
    (e) => { 
      let target = $(e.target).attr('data-sprop')
      let btn = $(e.target).attr('data-btn')
      let num = $(e.target).attr('data-sprop-num')
      if ( prop.controller({get: 'open'}) === target ) {
        $(e.target).css({"background-color": "#fbf8c2", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#222")
      }
      else {
        $(e.target).css({"background-color": "#e4db66", 'cursor': 'pointer'})
        $('[data-sprop="' + target + '-' + btn + '-btn"][data-sprop-num="' + num + '"]').css("color", "#000")
      }
    });
    $('[data-sprop="catValue"]').off('mousedown').on('mousedown', catSPropSlider)
    $('[data-sprop="catValue"]').off('touchstart').on('touchstart', catSPropSlider)
    $('[data-input="sprop"]').off('input').on('input', (e) => {
      let spNum = $(e.target).attr('data-sprop-num')
      let spTarget = $(e.target).attr('data-sprop')
      let spAction = $(e.target).attr('data-sprop-action')
      if (spAction === 'set' && spTarget === 'catName') {
        // console.log('1')
        prop.controller({target: spTarget, action: 'remove', num: spNum})
        catInputFn(e)
        copyText(e)
      }
      else {
        // console.log('2')
        prop.controller({target: spTarget, action: spAction, num: spNum})
      }
    })
    $('[data-click="sprop"]').off('click').on('click', (e) => {
      let spNum = $(e.target).attr('data-sprop-num')
      let spTarget = $(e.target).attr('data-sprop')
      let spAction = $(e.target).attr('data-sprop-action')
      prop.controller({target: spTarget, action: spAction, num: spNum})
    })
}

function addReply(e, comData) {
  let userName = userSchema.fullName
  let target = e.target
  let comNum = $(target).attr('data-num')
  if ( sen.replyToggle(comNum) ) {
    $('#ComResponse' + comNum).css('background-color', '#e4db66')
    $('#ComResponse' + comNum + ' > div').css('color', '#000')
    $('.com-reply' + comNum).remove()
    sen.replyToggle(comNum, false)
  }
  else {
    $('.com-reply' + comNum).remove()
    $('#ComResponse' + comNum).css('background-color', '#fbf8c2')
    $('#ComResponse' + comNum + ' > div').css('color', '#222')
    $('#ComNumR' + comNum).append(`
    <div class="flex-l com-reply` + comNum + `" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
      <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 10px; margin: 8px 4px 0 0; visibility: hidden;"></span></div>
      <div style="width: 100%">
        <div class="flex-l" style="margin-bottom: 0px; background-color: #555; padding: 2px 4px; border-radius: 8px 8px 0 0;">
          <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 12px; padding: 0 3px;"></span></div>
          <div style="padding: 4px 8px 4px 0px; margin: 0; width: 100%; justify-content: left;" class="flex-l btn-pad">
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700;">` + userName + `</span></div>
          </div>
          <div id="ComConf` + comNum + `" style="padding: 0; margin: 0; width: auto; border: 0; border-radius: 8px;  justify-content: center;" class="flex-l btn-typ btn-pad">
            <div class="t-t" style="width: 60px; margin: 0;">
              <div id="SelfCreditRange` + comNum + `" style="background-color: rgb(139, 225, 112); position: absolute; bottom: 1px; border: 0.5px solid #999; border-radius: 8px; width: 100%; height: auto;" class="credit-range">
                <input id="SelfRangeSliderCP` + comNum + `" class="input-range no-drag hide-field in-s tip-eval" orient="vertical" type="range" step="0.1" value="10" min="0" max="10" style="cursor: pointer;">
                </input>
                <div class="flex-br" style="pointer-events: none;">
                </div>
                <div class="flex-l span-ctn" style="padding: 4px 8px 4px 6px; height: 18px; width: 100%; pointer-events: none;">
                  <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 10px;"></span></div>
                  <div class="pd-r4" style="padding: 0 0 0 4px;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
                  <div><span id="SelfCreditVal` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-count="` + comNum + `">+10</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-br"></div>
        <div id="ComBox` + comNum + `" class="" style="width: 100%; height: auto; min-height: 50px; background-color: #ddd; color: #000; border-radius: 0 0 5px 5px; margin-bottom: 4px; align-items: self-start; text-align: left; padding: 0;">
          <div id="ReplyBox` + comNum + `" style="margin-bottom: 4px; width: 100%;">
            <div class="flex-l" style="width: 100%; padding: 4px;">
              <textarea rows="4" id="ReplyComment` + comNum + `" style="border-radius: 5px; width: 100%; background-color: #fff; font-size: 12px; font-family: Arial,sans-serif !important;" class="form-field no-drag bc-e span-eval" placeholder="Response..."></textarea>
            </div>
            <div class="flex-l" style="width: 100%; padding: 0 4px 4px 4px;" data-count="1">
              <form autocomplete="off" style="width: 100%;">
                <div>
                  <input style="width: 100%; border-radius: 5px;" class="source-url` + comNum + ` form-field no-drag span-eval" type="text" placeholder="Source URL" data-id="" data-count="1"></input>
                </div>
              </form> 
              <div class="form-button add-url` + comNum + ` mr-pd" style="margin: 0 0 0 4px;" data-count="1">
                <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
              </div>
            </div> 
          </div>
        </div>
        <div class="flex-br"></div>
        <div class="flex-l" style="width: 100%;"></div>
      </div>
    </div>
    <div class="flex-br"></div>
    <div class="flex-l com-reply` + comNum + `" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
      <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 10px; margin: 8px 4px 0 0; visibility: hidden;"></span></div>
        <div style="width: 100%">
          <div style="width: 100%; align-items: center; margin-bottom: 6px;" class="flex-l">
            <div class="t-t" style="width: 70px; margin: 0;">
              <div id="CreditRange` + comNum + `" style="background-color: #ddd; position: absolute; bottom: 0px; border: 0.5px solid #999; border-radius: 8px; width: auto; height: auto;" class="credit-range">
                <input id="RangeSliderCP` + comNum + `" class="input-range no-drag hide-field in-s tip-eval" orient="vertical" type="range" step="0.1" value="0" min="-10" max="10" style="cursor: pointer;">
                </input>
                <div class="flex-br" style="pointer-events: none;">
                </div>
                <div class="flex-l span-ctn" style="height: 20px; pointer-events: none;">
                  <div class="flex-s">
                  </div>
                  <span id="Credit" class="fa fa-check nav-v pt-18" style="padding: 2px 0px 2px 6px; font-size: 12px; color: #000; margin: 0;" data-count="` + comNum + `">
                  </span>
                  <span id="CreditVal` + comNum + `" class="nav-v pt-18 sp-v credit-val` + comNum + `" style="width: 35px; font-size: 12px; font-weight: 700;" data-count="` + comNum + `">---</span>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-s" style="width: 100%;"></div>
            <div style="padding: 4px 6px; margin: 0; width: auto; border-radius: 8px; background-color: #ddd; justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt reset-btn` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-undo ft-14" style="font-size: 10px;"></span></div>
            </div>
            <div style="padding: 4px 6px; margin: 0 0 0 4px; width: auto; border-radius: 8px; background-color: #ddd;  justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt com-resp` + comNum + `" data-num="` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-times ft-14" style="font-size: 10px;"></span></div>
            </div>            
            <div id="Send` + comNum + `" style="padding: 4px 7px 4px 5px; margin: 0 0 0 4px; width: auto; border-radius: 8px; background-color: #ddd; justify-content: center; height: 20px; cursor: pointer;" class="flex-l btn-typ btn-lt send-btn` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-paper-plane ft-14" style="font-size: 10px;"></span></div>
            </div>
          </div>
        </div>
      </div>
    `)
    $('.com-resp' + comNum).off('click').on('click', (e) => { 
      addReply(e, comData) } )
    $('.add-url' + comNum).off('click').on('click', () => { addReplyUrl(comNum) } )
    $('.remove-source').off('click').on('click', removeSource)
    $('#CreditRange' + comNum).off('mouseover').on('mouseover', () => { csSlider(comNum, '')} )
    $('#SelfCreditRange' + comNum).off('mouseover').on('mouseover', () => { csSlider(comNum, 'Self')} )
    $('#RangeSliderCP' + comNum).off('input').on('input', () => { 
      replySliderFn(comNum, '') } )
    $('#SelfRangeSliderCP' + comNum).off('input').on('input', () => { 
      replySliderFn(comNum, 'Self') } )
    $('.reset-btn' + comNum).off('click').on('click', () => { resetReplyFn(comNum) } )
    $('#ReplyComment' + comNum).off('input').on('input', () => { replyEval(comNum) } )
    $('.btn-lt').hover((e) => {
      if ( e.target.id == 'Send' + comNum && sen.sendToggle(comNum) ) {
        $(e.target).css({"background-color": "#666", 'cursor': 'pointer'}) 
        $('#' + e.target.id + ' > div > span').css("color", "#eee")
      }
      else if ( e.target.id == 'Send' + comNum && !sen.sendToggle(comNum) ) {
        $(e.target).css({"background-color": "#eee", 'cursor': ''})
        $('#' + e.target.id + ' > div > span').css("color", "#999")
      }
      else {
        $(e.target).css("background-color", "#eee")
      }
    },
    (e) => { 
      if ( e.target.id == 'Send' + comNum && sen.sendToggle(comNum) ) {
        $(e.target).css({"background-color": "#e4db66", 'cursor': 'pointer'})
        $('#' + e.target.id + ' > div > span').css("color", "#000")
      }
      else if ( e.target.id == 'Send' + comNum && !sen.sendToggle(comNum) ) {
        $(e.target).css({"background-color": "#ddd", 'cursor': ''})
        $('#' + e.target.id + ' > div > span').css("color", "#999")
      }
      else {
        $(e.target).css("background-color", "#ddd")
      }
    });
    $('#Send' + comNum).off('click').on('click', () => { 
      if ( sen.sendToggle(comNum) ) { sendReplyFn(comNum, comData) }
    } )
    replyEval(comNum)
    sen.replyToggle(comNum, true)
  }
}

function sendReplyFn(comNum, comData) {
  let replySchema = {
    'response': '',
    'cs': '',
    'self': '',
    'url': [],
    'comData': {
      'comSenId': '',
      'postId': '',
      'senId': '',
      'comId': '',
      'userId': ''
    }
  }
  replySchema.response = $('#ReplyComment' + comNum).val()
  let csValue = $('#CreditVal' + comNum).text()
  let selfValue = $('#SelfCreditVal' + comNum).text()
  if ( csValue.charAt(0) === '+' ) { csValue = csValue.substring(1) }
  if ( selfValue.charAt(0) === '+' ) { selfValue = selfValue.substring(1) }
  replySchema.cs = parseFloat(csValue)
  replySchema.self = parseFloat(selfValue)
  for (let i = 0; i <  $('.source-url' + comNum).length; i++) {
    let srcUrl = $('.source-url' + comNum)[i].value
    if ( srcUrl !== '' ) { replySchema.url.push(srcUrl) }
  }
  replySchema.comData.comSenId = comData.comSenId
  replySchema.comData.postId = comData.postId
  replySchema.comData.senId = comData.senId
  replySchema.comData.comId = comData.comId
  replySchema.comData.userId = comData.userId
  // console.log(replySchema)
  chrome.runtime.sendMessage( { 'message': 'Send Reply', 'data': { 'reply': replySchema, 'position': comNum } } );
}

async function allPropBids(comNum, bidData) {
   if (typeof bidData !== 'undefined') {
    for (let i = 0; i < bidData.length; i++) {
      let userName = bidData[i].userName
      let funding = bidData[i].funding
      let influence = (bidData[i].influence*100).toFixed(2)
      $('#ComNumR' + comNum).append(`
      <div class="flex-l com-reply` + comNum + `" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
        <div class="pd-r4" style="padding: 0;"><span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px; margin: 8px 4px 0 0;"></span></div>
        <div id="ComNum` + comNum + `" style="width: 100%">
          <div class="flex-l" style="margin-bottom: 0px; background-color: #ddd; padding: 2px 4px; border-radius: 8px; border: 0.5px solid #999;">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-user-circle-o ft-14" style="font-size: 12px; padding: 0 3px;"></span></div>
            <div style="padding: 4px 8px 4px 0px; margin: 0; width: auto; justify-content: left;" class="flex-l btn-pad">
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700; white-space: nowrap;">` + userName + `</span></div>
            </div>
            <div class="flex-s"></div>
            <div id="ComReplies` + comNum + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #e6e6e6;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">Funding</span>
              </div>
            </div>
            <div id="ComResponse` + comNum + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: #fff;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-num="` + comNum + `" data-id="` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-krw ft-14" style="font-size: 10px;"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">` + funding + `</span></div>
            </div>
            <div id="ComReplies` + comNum + `" style="padding: 4px; margin: 0 0 0 6px; width: auto; border-radius: 8px 0 0 8px; background-color: #e6e6e6;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">Influence</span>
              </div>
            </div>
            <div id="ComResponse` + comNum + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: #fff;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-num="` + comNum + `" data-id="` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-users ft-14" style="font-size: 10px;"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">` + influence + `%</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
        <div id="ComNumR` + comNum + `" style="width: 100%"></div>
        <div id="ComNumC` + comNum + `" style="width: 100%"></div>
      </div>
      `)
    }
  }
}

async function allPropReplies(comNum, comData) {
  if (typeof comData !== 'undefined') {
    for (let i = 0; i < comData.length; i++) {
      let count = sen.counter('prop-replies')
      let userName = comData[i].userName
      let totalCS = comData[i].totalCS.toFixed(2)
      let totalPS = comData[i].totalPS.toFixed(2)
      let comment = comData[i].comment
      let sources = comData[i].sources
      let sourceNum = comData[i].sources.length
      let catNum = comData[i].category.length
      let estReturn = comData[i].estimatedReturn.toFixed(0)
      let replies = comData[i].replies.length
      let performance = comData[i].performance.toFixed(2)
      $('#ComNumR' + comNum).append(`
        <div class="flex-l com-reply` + comNum +`" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
          <div class="pd-r4" style="padding: 0;"><span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px; margin: 8px 4px 0 0;"></span></div>
          <div id="ComNum` + comNum + `" style="width: 100%">
            <div class="flex-l" style="margin-bottom: 0px; background-color: #ddd; padding: 2px 4px; border-radius: 8px 8px 0 0; border: 0.5px solid #999; border-bottom: 0;">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-user-circle-o ft-14" style="font-size: 12px; padding: 0 3px;"></span></div>
              <div style="padding: 4px 8px 4px 0px; margin: 0; width: auto; justify-content: left;" class="flex-l btn-pad">
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700; white-space: nowrap;">` + userName + `</span></div>
              </div>
              <div class="flex-l" style="width: 100%">
                <div id="CSUser` + comNum + `" style="padding: 2px; margin: 0; width: auto; border-radius: 6px 0 0 6px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                  <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 8px;"></span></div>
                  <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + totalCS + `</span></div>
                </div>
                <div style="padding: 2px; margin: 0; width: auto; border-radius: 0 6px 6px 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ comNum +`">
                  <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-align-right rotated ft-14" style="font-size: 8px;"></span></div>
                  <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + totalPS + `</span></div>
                </div>
              </div>
              <div id="ComConf` + comNum + `" style="padding: 2px 6px 2px 4px; margin: 0; width: 70px; border-radius: 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 8px;"></span></div>
            <div class="pd-r4" style="padding: 0 0 0 4px;"><span class="fa fa-check ft-14" style="font-size: 8px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + performance + `</span></div>
          </div>
          </div>
          <div class="flex-br"></div>
          <div id="ComBox` + comNum + `" class="pad-6 pd-4-8" style="width: auto; height: auto; min-height: 50px; background-color: #fff; color: #000; border-radius: 0 0 5px 5px; margin-bottom: 4px; align-items: self-start; text-align: left; border: 0.5px solid #999; border-top: 0;">
            <div style="margin-bottom: 4px; width: 100%;">
              <span style="color: #000; font-size: 13px; text-align: left; height: auto; overflow: hidden; margin-bottom: 4px; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; ">` + comment + `</span>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l" style="margin: 0 0 5px 0; width: 100%;">
            <div id="ComReplies` + comNum + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
              <div class="pd-r4" style="padding: 0; pointer-events: none;">
                <span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px;"></span>
              </div>
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">` + replies + `</span>
              </div>
            </div>
            <div id="ComResponse` + comNum + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102);  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-num="` + comNum + `" data-id="` + comNum + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-plus ft-14" style="font-size: 10px;"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + comNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">Reply</span></div>
            </div>
            <div class="flex-s"></div>
          <div id="ComCS` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center;" class="flex-l btn-typ btn-pad" data-sprop="cs-box" data-sprop-num="` + i + `">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-tag ft-14" style="font-size: 10px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="user-cs-text" data-sprop-num="` + i + `">` + estReturn + `</span></div>
          </div>
          <div id="ComSources` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ i +`" data-click="rprop" data-rprop="sources" data-rprop-num="` + i + `" data-btn="bar">
            <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-link rotated ft-14" style="font-size: 10px;" data-rprop="sources-bar-btn" data-rprop-num="` + i + `"></span></div>
            <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-sprop="sources-bar-btn" data-sprop-num="` + i + `">` + sourceNum + `</span></div>
          </div>
          <div style="padding: 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: #ddd; justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad" data-click="rprop" data-rprop="categories" data-rprop-num="` + i + `" data-btn="bar">
            <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-list-ul ft-14" style="font-size: 10px;" data-rprop="categories-bar-btn" data-rprop-num="` + i + `"></span></div>
            <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;" data-rprop="categories-bar-btn" data-rprop-num="` + i + `">` + catNum + `</span></div>
          </div>
          </div>
        </>
        <div id="ComNumR` + comNum + `" style="width: 100%"></div>
        <div id="ComNumC` + comNum + `" style="width: 100%"></div>
      </div>
      `)

      $('[data-click="rprop"]').off('click').on('click', (e) => {
        let spNum = $(e.target).attr('data-rprop-num')
        let spTarget = $(e.target).attr('data-rprop')
        let spAction = $(e.target).attr('data-rprop-action')
        prop.replies({target: spTarget, action: spAction, num: spNum})
      })
    }
  }
}

function getPageData() {
  let domain = document.domain
  let url = window.location.toString()
  if (domain == 'www.google.com' && url.includes('google.com/search')) {
    let allNodes = document.querySelectorAll('.g > div > div > div > a')
    let urls = []
    for (let i = 0; i < allNodes.length; i++) {
      urls.push(allNodes[i].href) }
    // console.log(urls)
    chrome.runtime.sendMessage( { 'message': 'Send Search URLs', 'data': { 'urls': urls } } )
  }
  else {
    chrome.runtime.sendMessage( { 'message': 'Send URL', 'data': { 'url': window.location.toString(), 'title': $(document).find("title").text() } } );
  }
}

async function updatePropFn(post, num) {
  prop.storeData({target: 'comments', num: num, data: post})
  let comments = post.comments
  let userCS = post.authorData.catRelatedCS.toFixed(2)
  let userPS = post.authorData.catRelatedPS.toFixed(2)
  let estReturn = post.estimatedReturn.toFixed(0)
  let bcColor = getColor(userCS, 10)
  if (userCS > 0) {userCS = '+' + userCS}
  if (comments.length == 1) {
    $('[data-sprop="reply-num"][data-sprop-num="' + num + '"]').text( comments.length + ' Reply' )
  }
  else {
    $('[data-sprop="reply-num"][data-sprop-num="' + num + '"]').text( comments.length + ' Replies' )
  }
  if (comments.length > 0) {
    $('[data-sprop="replies"][data-sprop-num="' + num + '"]').css({'pointer-events': '', 'cursor': 'pointer0'})
    $('[data-sprop="replies"][data-sprop-num="' + num + '"]' + ' > div > span').css('color', '#000')
  }
  anime({
    targets: '[data-sprop="replies"][data-sprop-num="' + num + '"]',
    direction: 'normal',
    duration: 1000,
    delay: 0,
    backgroundColor: ['#ddd', '#0c0', '#ddd'],
    easing: 'easeInSine'
  });
  setTimeout( () => {
    $('[data-sprop="user-cs-text"][data-sprop-num="' + num + '"]').text(userCS)
    $('[data-sprop="user-return-text"][data-sprop-num="' + num + '"]').text(estReturn)
    $('[data-sprop="user-ps-text"][data-sprop-num="' + num + '"]').text(userPS)
    anime({
      targets: '[data-sprop="bc"][data-sprop-num="' + num + '"]',
      direction: 'normal',
      duration: 1000,
      delay: 0,
      backgroundColor: ['#ddd', '#0c0', '#ddd'],
      easing: 'easeInSine'
    });
    anime({
      targets: '[data-sprop="user-sidebar"][data-sprop-num="' + num + '"]',
      direction: 'normal',
      duration: 1000,
      delay: 0,
      backgroundColor: ['#0c0', bcColor],
      easing: 'easeInSine'
    });
    anime({
      targets: '[data-sprop="cs-box"][data-sprop-num="' + num + '"]',
      direction: 'normal',
      duration: 1000,
      delay: 0,
      backgroundColor: ['#0c0', bcColor],
      easing: 'easeInSine'
    });
    prop.controller({target: 'review', num: num})
  }, 1000);
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function populateURLs(urls) {
  let allUrls = document.querySelectorAll('.g > div > div > div > a')
  let pageUrls = []
  for (let i = 0; i < allUrls.length; i++) {
    pageUrls.push(allUrls[i].href) }
  for (let i = 0; i < urls.length; i++) {
    if (urls[i]._id !== '') {
      let urlIndex = pageUrls.findIndex(url => String(url) == String(urls[i].url) )
      if (urlIndex !== -1) {
        let postCS = urls[i].totalCS.toFixed(3)
        let postPS = urls[i].totalPS.toFixed(3)
        let bcColor = getColor(postCS, 10)
        allUrls[i].style.position = 'relative';
        allUrls[i].innerHTML += `
        <div style="position: absolute; left: -90px; top: 25px; padding: 0 8px 0 0; margin: 0;" data-sprop="user-data" class="flex-c">
          <div class="flex-l">
            <div style="padding: 4px 8px 4px 6px; margin: 0; width: 60px; border-radius: 8px 8px 0 0; background-color: ` + bcColor + `;  justify-content: center;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + postCS + `</span></div>
            </div>
          </div>
          <div class="flex-l">
            <div style="margin: 0; border-top: 0; width: 60px; border-radius: 0 0 8px 8px;  justify-content: center;" class="flex-l btn-typ btn-pad bc-e">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + postPS + `</span></div>
            </div>
          </div>
        </div>
        `
      }
    }
  }
}

async function allReplies(comNum, responses) {
  // console.log(comNum, responses)
  sen.responseData(comNum, true)
  sen.allRepliesToggle(comNum, true)
   if (typeof responses !== 'undefined') {
    for (let i = 0; i < responses.length; i++) {
      let iNum = i + sen.commentCount()
      let userName = responses[i].user.fullName
      let userCS = responses[i].user.CS.toFixed(2)
      let userPS = responses[i].user.PS.toFixed(2)
      let comText = responses[i].comment
      let comCS = responses[i].cs.toFixed(1)
      let comPS = responses[i].importance.toFixed(1)
      let comTone = responses[i].tone
      let comLinks = responses[i].sources.length
      let comConf = responses[i].confidence.toFixed(1)
      let comResp = responses[i].responses.length
      let comId = responses[i]._id
      let comData = {
        'comSenId': responses[i]._id,
        'postId': responses[i].post,
        'senId': responses[i].senId,
        'comId': responses[i].comId,
        'userId': responses[i].user._id
      }
      if (userCS > 0) {
        userCS = '+' + userCS
      }
      if (comCS > 0) {
        comCS = '+' + comCS
      }
      if (comConf > 0) {
        comConf = '+' + comConf
      }
      if (comTone == null) { comTone = '---' }
      $('#ComNumC' + comNum).append(`
        <div class="flex-l com-response` + comNum +`" style="width: 100%; height: 100%; overflow: none; border-radius: 5px; margin: 0 0 0 0px; align-items: self-start;">
        <div class="pd-r4" style="padding: 0;"><span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px; margin: 8px 4px 0 0;"></span></div>
        <div id="ComNum` + iNum + `" style="width: 100%">
          <div class="flex-l" style="margin-bottom: 0px; background-color: #555; padding: 2px 4px; border-radius: 8px 8px 0 0;">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-user-circle-o ft-14" style="font-size: 12px; padding: 0 3px;"></span></div>
            <div style="padding: 4px 8px 4px 0px; margin: 0; width: auto; justify-content: left;" class="flex-l btn-pad">
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700; white-space: nowrap;">` + userName + `</span></div>
            </div>
            <div class="flex-l" style="width: 100%">
              <div id="CSUser` + iNum + `" style="padding: 2px; margin: 0; width: auto; border-radius: 6px 0 0 6px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 8px;"></span></div>
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + userCS + `</span></div>
              </div>
              <div style="padding: 2px; margin: 0; width: auto; border-radius: 0 6px 6px 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ iNum +`">
                <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-align-right rotated ft-14" style="font-size: 8px;"></span></div>
                <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + userPS + `</span></div>
              </div>
            </div>
            <div id="ComConf` + iNum + `" style="padding: 2px 6px 2px 4px; margin: 0; width: 70px; border-radius: 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
            <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 8px;"></span></div>
            <div class="pd-r4" style="padding: 0 0 0 4px;"><span class="fa fa-check ft-14" style="font-size: 8px;"></span></div>
            <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + comConf + `</span></div>
          </div>
          </div>
          <div class="flex-br"></div>
          <div id="ComBox` + iNum + `" class="pad-6 pd-4-8" style="width: 100%; height: auto; min-height: 50px; background-color: #eee; color: #000; border-radius: 0 0 5px 5px; margin-bottom: 4px; align-items: self-start; text-align: left;">
            <div style="margin-bottom: 4px; width: 100%;">
              <span style="color: #000; font-size: 13px; text-align: left; height: auto; overflow: hidden; margin-bottom: 4px; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; ">` + comText + `</span>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l" style="margin: 0 0 5px 0; width: 100%;">
            <div id="ComReplies` + iNum + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
              <div class="pd-r4" style="padding: 0; pointer-events: none;">
                <span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px;"></span>
              </div>
              <div style="padding: 0 0 0 2px; pointer-events: none;">
                <span id="ComRep` + iNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">` + comResp + `</span>
              </div>
            </div>
            <div id="ComResponse` + iNum + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102);  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-num="` + iNum + `" data-id="` + comId + `">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-plus ft-14" style="font-size: 10px;"></span></div>
              <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + iNum + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">Reply</span></div>
            </div>
            <div class="flex-s"></div>
            <div id="ComCS` + iNum + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comCS + `</span></div>
            </div>
            <div id="ComSources` + iNum + `" style="padding: 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ iNum +`">
              <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-link rotated ft-14" style="font-size: 10px;"></span></div>
              <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comLinks + `</span></div>
            </div>
          </div>
        </>
        <div id="ComNumR` + iNum + `" style="width: 100%"></div>
        <div id="ComNumC` + iNum + `" style="width: 100%"></div>
      </div>
      `)
      let userCSTag = $('#CSUser' + iNum)
      let comCSTag = $('#ComCS' + iNum)
      let comConfTag = $('#ComConf' + iNum)
      $('.btn-lt').hover((e) => {
        $(e.target).css("background-color", "#eee") 
      },
      (e) => { 
        if ( !(e.target.id == 'ComSources' + iNum && sen.linkToggle(i)) ) {
          $(e.target).css("background-color", "#ddd")
        }
      });
      if (comResp == 0) {
        $('#ComReplies' + iNum).css({'pointer-events': 'none', 'cursor': ''})
        $('#ComReplies' + iNum + ' > div').css('color', '#777')
      }
      if (comLinks == 0) {
        $('#ComSources' + iNum).css({'pointer-events': 'none', 'cursor': ''})
        $('#ComSources' + iNum + ' > div').css('color', '#777')
      }
      setColor(responses[i].user.CS, 10, [userCSTag])
      setColor(responses[i].cs, 10, [comCSTag])
      setColor(responses[i].confidence, 10, [comConfTag])
      $('#ComSources' + iNum).off('click').on('click', (e) => { 
        showSources(e, responses[i].sources) } )
      $('#ComResponse' + iNum).off('click').on('click', (e) => { 
        addReply(e, comData) } )
      $('#ComReplies' + iNum).off('click').on('click', () => {
        if ( sen.allRepliesToggle(iNum) ) {
          $('#ComReplies' + iNum).css('background-color', '#ddd')
          $('#ComReplies' + iNum + ' > div').css('color', '#000')
          $('.com-response' + iNum).addClass('hide-field')
          sen.allRepliesToggle(iNum, false)
        }
        else {
          $('#ComReplies' + iNum).css('background-color', '#eee')
          $('#ComReplies' + iNum + ' > div').css('color', '#900')
          if ( sen.responseData(iNum) ) {
            $('.com-response' + iNum).removeClass('hide-field')
            sen.allRepliesToggle(iNum, true)
          }
          else {
            chrome.runtime.sendMessage( { 'message': 'Comment Responses', 'data': { 'respIds': responses[i].responses, 'position': iNum } } );
          }
        }
      } )
    }
    let updatedCount = responses.length + sen.commentCount()
    sen.commentCount(updatedCount)
  }
}

function propCategories(comNum, categories) {
  $('.com-cats' + comNum).remove()
  $('[data-sprop="categories"][data-sprop-num="' + comNum + '"]').css('background-color', '#eee')
  $('[data-sprop="categories-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#900')
  if (categories !== 'undefined') {
    for (let i = 0; i < categories.length; i++) {
      let catName = categories[i].name
      let catImp = categories[i].importance
      let catInfo = categories[i].reason
      $('[data-box="categories"][data-sprop-num="' + comNum + '"]').append(`
      <div class="flex-br com-cats` + comNum + `"></div>
      <div class="flex-l pad-6 com-cats` + comNum + `" style="width:fit-content; height: auto; background-color: #fff; color: #000; border-radius: 5px; margin-bottom: 4px; align-items: self-start; padding: 0px; border: 0.5px solid #999; overflow: hidden;">
        <span class="bc-d" style="color: #000; font-size: 11px; text-align: left; height: auto; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; padding: 1px 5px; border-right: 0.5px solid #999;">` + catImp + `</span>
        <span style="color: #000; font-size: 11px; text-align: left; height: auto; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; padding: 1px 5px;">` + catName + `</span>
        <span class="fa fa-caret-down nav-v pt-18 rank-drop-down" style="padding: 3px 5px 3px 0; color: #000; font-size: 13px; cursor: pointer;" data-sprop="cat-dropdown" data-dropdown="` + i + `">
          </span>
      </div>
      <div class="hide-field com-cats` + comNum + `" style="position: relative; margin: 0px 0 2px 6px;" data-sprop="cat-dropdown-info" data-dropdown="` + i + `">
        <div style="border-radius: 5px; width: 100%; height: auto; padding: 2px 4px; margin: 0; cursor: pointer;" class="form-field">
          <span class="nav-v pt-18 rank-drop-down" style="padding: 1px; color: #000; font-size: 10px; pointer-events: none; font-family: Arial,sans-serif !important;">` + catInfo + `</span>
        </div>
      </div>
      `)
    }
    $('[data-sprop="cat-dropdown"]').off('click').on('click', (e) => {
      let catNum = $(e.target).attr('data-dropdown')
      if ( $('[data-sprop="cat-dropdown-info"][data-dropdown="' + catNum + '"]').hasClass('hide-field')) {
        $('[data-sprop="cat-dropdown-info"][data-dropdown="' + catNum + '"]').removeClass('hide-field')
        $(e.target).css('color', '#900')
      }
      else {
        $('[data-sprop="cat-dropdown-info"][data-dropdown="' + catNum + '"]').addClass('hide-field')
        $(e.target).css('color', '#000')
      }
    })
  }
}

function propSources(comNum, sources) {
  $('.com-link' + comNum).remove()
  $('[data-sprop="sources"][data-sprop-num="' + comNum + '"]').css('background-color', '#eee')
  $('[data-sprop="sources-bar-btn"][data-sprop-num="' + comNum + '"]').css('color', '#900')
  if (sources !== 'undefined') {
    for (let i = 0; i < sources.length; i++) {
      let comSource = sources[i].url
      $('[data-box="sources"][data-sprop-num="' + comNum + '"]').append(`
      <div class="flex-br com-link` + comNum + `"></div>
      <div class="flex-l pad-6 com-link` + comNum + `" style="width: 100%; height: auto; background-color: #fff; color: #000; border-radius: 5px; margin-bottom: 4px; align-items: self-start; padding: 1px 4px; border: 0.5px solid #999;">
        <span class="fa fa-link" style="font-size: 12px; padding: 3px 5px 0 0; color: #000;"></span>
        <span style="color: #000; font-size: 11px; text-align: left; height: auto; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important;">` + comSource + `</span>
      </div>
      `)
    }
  }
}

function showSources(e, sources) {
  let target = e.target
  let comNum = $(target).attr('data-num')
  if ( sen.linkToggle(comNum) ) {
    $('#ComSources' + comNum).css('background-color', '#ddd')
    $('#ComSources' + comNum + ' > div').css('color', '#000')
    $('.com-link' + comNum).remove()
    sen.linkToggle(comNum, false)
  }
  else {
    $('.com-link' + comNum).remove()
    $('#ComSources' + comNum).css('background-color', '#eee')
    $('#ComSources' + comNum + ' > div').css('color', '#900')
    if (sources !== 'undefined') {
      for (let i = 0; i < sources.length; i++) {
        let comSource = sources[i].url
        $('#ComBox' + comNum).append(`
        <div class="flex-br com-link` + comNum + `"></div>
        <div class="flex-l pad-6 com-link` + comNum + `" style="width: 100%; height: auto; background-color: #fff; color: #000; border-radius: 5px; margin-bottom: 4px; align-items: self-start; padding: 1px 4px; border: 0.5px solid #999;">
          <span class="fa fa-link" style="font-size: 12px; padding: 3px 5px 0 0; color: #000;"></span>
          <span style="color: #000; font-size: 11px; text-align: left; height: auto; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important;">` + comSource + `</span>
        </div>
        `)
      }
    }
    sen.linkToggle(comNum, true)
  }
}

function addComment(comments) {
  if (typeof comments !== 'undefined') {
    let maxHeight = xy.winH() - 80
    sen.commentCount(0)
    for (let i = 0; i < comments.length; i++) {
      // console.log(comments[i])
      let userName = comments[i].user.fullName
      let userCS = comments[i].user.CS.toFixed(2)
      let userPS = comments[i].user.PS.toFixed(2)
      let comText = comments[i].comment
      let comCS = comments[i].cs.toFixed(1)
      let comPS = comments[i].importance.toFixed(1)
      let comTone = comments[i].tone
      let comLinks = comments[i].sources.length
      let comConf = comments[i].confidence.toFixed(1)
      let comResp = comments[i].responses.length
      let comId = comments[i]._id
      let comData = {
        'comSenId': comments[i]._id,
        'postId': comments[i].post,
        'senId': comments[i].senId,
        'comId': comments[i].comId,
        'userId': comments[i].user._id
      }
      if (userCS > 0) {
        userCS = '+' + userCS
      }
      if (comCS > 0) {
        comCS = '+' + comCS
      }
      if (comConf > 0) {
        comConf = '+' + comConf
      }
      if (comTone == null) { comTone = '---' }
      $('#CommentBox').append(`
      <div class="flex-l pad-6s flex-scroll" style="width: 100%; margin-top: 8px; padding-bottom: 0; max-height: ` + maxHeight + `px; overflow: auto; align-items: flex-start;" data-nav="comment-box">
        <div>
          <div class="flex-l">
            <div style="padding: 0px 8px 4px 6px; margin: 0; width: 50px; border-radius: 8px 8px 0 0; justify-content: center;" class="flex-l btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-user-circle-o ft-14" style="font-size: 30px;"></span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l">
            <div id="CSUser` + i + `" style="padding: 4px 8px 4px 6px; margin: 0; width: 50px; border-radius: 8px 8px 0 0; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + userCS + `</span></div>
            </div>
          </div>
          <div class="flex-br"></div>
          <div class="flex-l">
            <div style="margin: 0; border-top: 0; width: 50px; border-radius: 0 0 8px 8px;  justify-content: center;" class="flex-l btn-typ btn-pad bc-e">
              <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px"></span></div>
              <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + userPS + `</span></div>
            </div>
          </div>
        </div>
        <div style="width: 100%; height: auto; overflow: hidden; border-radius: 5px; margin: 0 0 0 8px;">
          <div id="ComNum` + i + `">
            <div class="flex-l" style="margin-bottom: 0px; background-color: #555; padding: 2px 4px; border-radius: 8px 8px 0 0;">
              <div style="padding: 4px 8px 4px 0px; margin: 0; width: 100%; justify-content: left;" class="flex-l btn-pad">
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 14px; padding: 4px 2px; font-weight: 700;">` + userName + `</span></div>
              </div>
              <div id="ComConf` + i + `" style="padding: 2px 6px 2px 4px; margin: 0; width: 70px; border-radius: 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                <div class="pd-r4" style="padding: 0;"><span class="fa fa-comment ft-14" style="font-size: 8px;"></span></div>
                <div class="pd-r4" style="padding: 0 0 0 4px;"><span class="fa fa-check ft-14" style="font-size: 8px;"></span></div>
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 9px; padding: 2px;">` + comConf + `</span></div>
              </div>
            </div>
            <div class="flex-br"></div>
            <div id="ComBox` + i + `" class="pad-6 pd-4-8" style="width: 100%; height: auto; min-height: 50px; background-color: #eee; color: #000; border-radius: 0 0 5px 5px; margin-bottom: 4px; align-items: self-start; text-align: left;">
              <div style="margin-bottom: 4px; width: 100%;">
                <span style="color: #000; font-size: 13px; text-align: left; height: auto; overflow: hidden; margin-bottom: 4px; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important; ">` + comText + `</span>
              </div>
            </div>
            <div class="flex-br"></div>
            <div class="flex-l" style="margin: 0 0 5px 0; width: 100%;">
              <div id="ComReplies` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #ddd;  justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
                <div class="pd-r4" style="padding: 0; pointer-events: none;">
                  <span class="fa fa-share fa-flip-vertical ft-14" style="font-size: 10px;"></span>
                </div>
                <div style="padding: 0 0 0 2px; pointer-events: none;">
                  <span id="ComRep` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">` + comResp + ` Replies</span>
                </div>
              </div>
              <div id="ComResponse` + i + `" style="padding: 4px; margin: 0; width: auto; cursor: pointer; border-radius: 0 8px 8px 0; background-color: rgb(228, 219, 102);  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad" data-num="` + i + `" data-id="` + comId + `">
                <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-plus ft-14" style="font-size: 10px;"></span></div>
                <div style="padding: 0 0 0 2px; pointer-events: none;"><span id="AddReply` + i + `" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 2px 2px;">Reply</span></div>
              </div>
              <div class="flex-s"></div>
              <div id="ComCS` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 8px 0 0 8px; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 10px;"></span></div>
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comCS + `</span></div>
              </div>
              <div style="padding: 4px; margin: 0; width: auto; border-radius: 0; background-color: #ddd;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad">
                <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 10px;"></span></div>
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comPS + `</span></div>
              </div>
              <div id="ComSources` + i + `" style="padding: 4px; margin: 0; width: auto; border-radius: 0; background-color: #ddd;  justify-content: center; border-left: 0; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt" data-num="`+ i +`">
                <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-link rotated ft-14" style="font-size: 10px;"></span></div>
                <div style="pointer-events: none;"><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comLinks + `</span></div>
              </div>
              <div style="padding: 4px; margin: 0; width: auto; border-radius: 0 8px 8px 0; background-color: #ddd;  justify-content: center; border-left: 0;" class="flex-l btn-typ btn-pad">
                <div><span class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 10px; padding: 4px 2px;">` + comTone + `</span></div>
              </div>
            </div>
          </div>
          <div class="flex-br" style="pointer-events: none;">
          </div>
          <div style="width: 50px;"></div>
          <div id="ComNumR` + i + `" style="width: 100%"></div>
          <div class="flex-br" style="pointer-events: none;">
          </div>
          <div style="width: 50px;"></div>
          <div id="ComNumC` + i + `" style="width: 100%"></div>
        </div>
      </div>
      `)
      if (typeof comResp !== 'undefined' && comResp == 1) {
        $('#ComRep' + i).text(comResp + ' Reply')
      }
      let userCSTag = $('#CSUser' + i)
      let comCSTag = $('#ComCS' + i)
      let comConfTag = $('#ComConf' + i)
      $('.btn-lt').hover((e) => {
        $(e.target).css("background-color", "#eee") 
      },
      (e) => { 
        if ( !(e.target.id == 'ComSources' + i && sen.linkToggle(i)) ) {
          $(e.target).css("background-color", "#ddd")
        }
      });
      if (comResp == 0) {
        $('#ComReplies' + i).css({'pointer-events': 'none', 'cursor': ''})
        $('#ComReplies' + i + ' > div').css('color', '#777')
      }
      if (comLinks == 0) {
        $('#ComSources' + i).css({'pointer-events': 'none', 'cursor': ''})
        $('#ComSources' + i + ' > div').css('color', '#777')
      }
      setColor(comments[i].user.CS, 10, [userCSTag])
      setColor(comments[i].cs, 10, [comCSTag])
      setColor(comments[i].confidence, 10, [comConfTag])
      $('#ComSources' + i).off('click').on('click', (e) => { 
        showSources(e, comments[i].sources) } )
      $('#ComResponse' + i).off('click').on('click', (e) => { 
        addReply(e, comData) } )
      $('#ComReplies' + i).off('click').on('click', () => {
        if ( sen.allRepliesToggle(i) ) {
          $('#ComReplies' + i).css('background-color', '#ddd')
          $('#ComReplies' + i + ' > div').css('color', '#000')
          $('.com-response' + i).addClass('hide-field')
          sen.allRepliesToggle(i, false)
        }
        else {
          $('#ComReplies' + i).css('background-color', '#eee')
          $('#ComReplies' + i + ' > div').css('color', '#900')
          if ( sen.responseData(i) ) {
            $('.com-response' + i).removeClass('hide-field')
            sen.allRepliesToggle(i, true)
          }
          else {    
            chrome.runtime.sendMessage( { 'message': 'Comment Responses', 'data': { 'respIds': comments[i].responses, 'position': i } } );
          }
        }
      })
    }
    sen.commentCount(comments.length)
  }
}

function expandCommentsFn(target) {
  $('#BottomSpan').addClass('hide-field')
  setTimeout( () => { 
    $('#highlightSpantip').css('padding-bottom', '0px')
    // console.log('padding-bottom', '0px')
  }, 350);
  sen.getExpanded(true)
  let senIndex = postSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  $(spanTip).prepend(`
    <div id="SpanBox" class="nav-v flex-l">
      <div id="SpanEdit" style="height: 0; width: 0;" class="flex-l nav-v">
        <div id="CommentBox" class="flex-l title-container" style="border-radius: 8px; width: 100%; background-color: #444;">
          <div class="flex-l pad-6s" style="width: 100%; margin-top: 8px;">
            <div>
              <div class="flex-l">
                <div id="CSComment" style="padding: 4px 8px 4px 6px; margin: 0; width: 60px; border-radius: 8px 8px 0 0; background-color: #99d98b;  justify-content: center;" class="flex-l btn-typ btn-pad">
                  <div class="pd-r4" style="padding: 0;"><span class="fa fa-check ft-14" style="font-size: 12px;"></span></div>
                  <div><span id="CommentCS" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">---</span></div>
                </div>
              </div>
              <div class="flex-br"></div>
              <div class="flex-l">
                <div id="PSComment" style="margin: 0; border-top: 0; width: 60px; border-radius: 0 0 8px 8px;  justify-content: center;" class="flex-l btn-typ btn-pad bc-e">
                  <div class="pd-r4" style="padding: 0;"><span class="fa fa-align-right rotated ft-14" style="font-size: 12px"></span></div>
                  <div><span id="CommentPS" class="pt-18" style="font-family: Arial,sans-serif !important; font-size: 12px; padding: 4px 2px;">---</span></div>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: 100%; background-color: #fff; overflow: hidden; border-radius: 5px; margin: 0 0 0 8px;">
              <div id="SpanQuote" class="flex-l pad-6 pd-4-8" style="width: 100%; background-color: #eee; color: #000">
                <span class="fa fa-quote-left" style="font-size: 14px; padding: 0 8px 0 0; color: #000;"></span>
                <span id="SentenceId" style="color: #000; font-size: 13px; text-align: left; height: 34px; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important;"></span>
              </div>
            </div>
            <div style="margin: 0 0 0 8px;">
              <div class="flex-l" style="margin: 0 0 5px 0;">
                <div id="CloseSpan" style="padding: 3px; margin: 0; width: 20px; border-radius: 6px; background-color: #ddd; justify-content: center; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
                  <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-times ft-14" style="font-size: 12px;"></span></div>
                </div>
              </div>
              <div class="flex-br"></div>
              <div class="flex-l">
                <div id="AddComment" style="margin: 0; border-top: 0; width: 20px; border-radius: 5px;  justify-content: center; background-color: #ddd; padding: 4px 2px 2px 4px; cursor: pointer;" class="flex-l btn-typ btn-pad btn-lt">
                  <div class="pd-r4" style="padding: 0; pointer-events: none;"><span class="fa fa-pencil-square-o ft-14" style="font-size: 12px"></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  let cf = $(target).attr('data-c-cf')
  let commentCS = postSchema.sentence[senIndex].cs
  let commentPS = postSchema.sentence[senIndex].importance
  $('#CommentCS').text(commentCS)
  let commentTag = $('#CSComment')
  $('#CommentPS').text(commentPS)
  setColor(commentCS, 10, [commentTag])
  // console.log(cf)
  let confidence = $('#ConfidenceRange')
  let confidenceValue = $('#ConfidenceVal')[0]
  if (cf) {
    setColor(cf, 10, [confidence])
    $('#RangeSliderConf').attr('value', cf);
    if ( $('#RangeSliderConf')[0].value > 0 ) {
      confidenceValue.innerText = '+' + $('#RangeSliderConf')[0].value;
    } else {
      confidenceValue.innerText = $('#RangeSliderConf')[0].value;
    }
    if ( $('#RangeSliderConf')[0].value >= 0 && $('#RangeSliderConf')[0].value < 10 && $('#RangeSliderConf')[0].value % 1 === 0 ) {
      confidenceValue.innerText = confidenceValue.innerText + '.0'
    }
  }
  if (postSchema.sentence[senIndex].denominator !== 0) {
    chrome.runtime.sendMessage( { 'message': 'Sentence Comment', 'data': { 'postId': postSchema.postId, 'senId': postSchema.sentence[senIndex].dataId} } );
  }
  if ( commentSchema.sentence[senIndex].sent ) {
    $('.sent-off').addClass('hide-field')
    $('#EnlargeIcon').removeClass('fa-expand').addClass('fa-compress')
    $('#Tone').css({'background-color': '#cdd'}).css({'pointer-events': 'none'})
    $('#comment').css({'background-color': '#cdd'}).css({'pointer-events': 'none'})
    $('.source-url').css({'background-color': '#cdd', 'pointer-events': 'none'})
    $('.add-source').css({'pointer-events': 'none', 'background-color': '#999'})
    $('.remove-source').css({'pointer-events': 'none', 'background-color': '#999'})
    $('#ConfidenceRange').css('pointer-events', 'none')
  }
  let quote = $('#SpanQuote')
  let credit = $('#CreditRange')
  if (senIndex !== -1) {
    let commentVal = commentSchema.sentence[senIndex].comment;
    let toneVal = commentSchema.sentence[senIndex].tone;
    $('#comment').val(commentVal)
    $('#Tone').val(toneVal)
    $('#CommentCS').val(commentSchema.sentence[senIndex].cs)
    $('#CommentPS').val(commentSchema.sentence[senIndex].importance)
    if (commentSchema.sentence[senIndex].sources) {
      if ( commentSchema.sentence[senIndex].sources.length > 0 ) {
        let sourceVal = commentSchema.sentence[senIndex].sources[0].url;
        $('#UrlData1').val(sourceVal)
        for (let a = 1; a < commentSchema.sentence[senIndex].sources.length; a++) {
          let sourceVal = commentSchema.sentence[senIndex].sources[a].url;
          addSource(sourceVal, target);
        }
      }
    }
  } else {
    commentSchema.sentence.push({
      'senId': target.id
    })
  }
  $('.add-source').off('click').on('click', () => {addSource('', target) } )
  let color = $(target).css('background-color');
  $(quote).css('background-color', color);
  $('#Enlarge').off('click').on('click', () => { doneFn(target) } )
  $('#Reset').off('click').on('click', () => { resetFn(target) } )
  $('#CloseSpan').off('click').on('click', () => { closeFn(target) } )
  $('#Cancel').off('click').on('click', () => { cancelFn(target) } )
  $('#ConfidenceRange').off('mouseover').on('mouseover', confidenceRangeSlider)
  $('#RangeSliderConf').off('input').on('input', () => { rangeConfSliderFn(target) } )
  $(spanTip).css('z-index', '2147483647')
  $('.tooltip-close').css('display', 'none');
  $('.tooltip-exp').css('display', 'block');
  let sentenceBox = document.getElementById('SentenceId');
  let spanBox = document.getElementById('highlightSpantip').getBoundingClientRect();
  $('#highlightSpantip').addClass('expanded-span')
  let sentence = sen.currentSentence();
  let sentenceString = sentence.innerText;
  if ( sentenceString.length > 105 ) {
    sentenceString = sentenceString.substring(0, 83) + '...'
  }
  sentenceBox.innerText = sentenceString;
  $('.nav-se').off('click').on('mouseover', spanTooltip)
  $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  animation = anime({
    targets: sentence,
    direction: 'normal',
    duration: 1600,
    loop: true,
    opacity: [1, 0.7],
    easing: 'easeInOutQuad',
  });
  animation = anime({
    targets: '.bottomTriangle',
    direction: 'normal',
    duration: 200,
    opacity: 0,
    easing: 'linear',
  }); 
  animation = anime({
    targets: '#highlightSpantip',
    direction: 'normal',
    duration: 200,
    padding: '0px 0px 8px 0px',
    opacity: 0.95,
    backgroundColor: '#444',
    easing: 'linear',
  }); 
  animation = anime({
    targets: '#SpanEdit',
    direction: 'normal',
    duration: 200,
    width: '420px',
    easing: 'linear',
  }); 
  setTimeout( () => { 
    expandMenu('#SpanEdit', 200, 0)
  }, 100);
  setTimeout( () => { 
    let expandedBox = document.getElementById('highlightSpantip');
    let boxTop = expandedBox.getBoundingClientRect().top;
    let boxLeft = expandedBox.getBoundingClientRect().left;
    $('.highlightTooltip').addClass('draggable')
    expandedBox.setAttribute('data-x', boxLeft)
    expandedBox.setAttribute('data-y', boxTop)
    $(expandedBox).css('position', 'fixed');
    $(expandedBox).css('top', boxTop + 'px');
  }, 310);
  setTimeout( () => { 
    $('#SpanEdit').css('height', 'auto')
  }, 360);
  $('.span-eval').off('input').on('input', () => { 
    visCheck(target)
    spanEval(target) } )
  $('.tip-eval').off('click').on('click', () => { spanEval(target) } )
  $('.tip-eval').off('touchend').on('touchend', () => {spanEval(target) } )
  spanEval(target)
}

function expandSpanFn(target) {
  sen.getExpanded(true)
  let senIndex = commentSchema.sentence
  .findIndex( sentence => sentence.senId == target.id)
  $(spanTip).prepend(`
    <div id="SpanBox" class="nav-v flex-l">
      <div id="SpanEdit" style="height: 0; width: 0;" class="flex-l nav-v">
        <div id="CommentBox" clas s="flex-l title-container" style="border-radius: 8px; width: 100%; background-color: #444;">
          <div class="flex-l pad-6s" style="width: auto; margin-top: 8px;">
            <div style="width: 100%; height: 100%; background-color: #fff; overflow: hidden; border-radius: 5px; margin: 0;">
              <div id="SpanQuote" class="flex-l pad-6 pd-4-8" style="width: auto; background-color: #eee; color: #000">
                <span class="fa fa-quote-left" style="font-size: 14px; padding: 0 8px 0 0; color: #000;"></span>
                <span id="SentenceId" style="color: #000; font-size: 13px; text-align: left; height: 34px; overflow: hidden; line-height: 17px; font-weight: 600; font-family: Arial,sans-serif !important;"></span>
              </div>
            </div>
          </div>
          <div class="flex-l pad-6s" style="width: auto; align-items: left;">
            <div>
              <form autocomplete="off" style="width: 100%;">
                <label for="Tone" class="ft-12" style="color: #fff; padding: 4px 4px 4px 0;">Tone:</label>
                <select name="Tone" id="Tone" class="form-field no-drag ft-12 span-eval" style="width: 120px; border-radius: 5px;">
                  <option class="ft-12" value="Blank">Select:</option>
                  <option class="ft-12" value="Factual">Factual</option>
                  <option class="ft-12" value="Hyperbole">Hyperbole</option>
                  <option class="ft-12" value="Sarcastic">Sarcastic</option>
                  <option class="ft-12" value="Joking">Joking</option>
                </select>
              </form> 
            </div>
            <div class="flex-s"></div>
            <label for="Tone" class="ft-12" style="color: #fff; padding: 4px 4px 4px 0;">Self Review:</label>
            <div class="t-t" style="width: 70px;">
              <div id="ConfidenceRange" style="background-color: rgb(139, 225, 112); position: absolute; bottom: 0px; border: 0.5px solid #999; border-radius: 5px; width: 70px; height: auto;">
                <input id="RangeSliderConf" class="input-range no-drag hide-field in-s tip-eval" orient="vertical" type="range" step="0.1" value="10" min="0" max="10" style="cursor: pointer;">
                </input>
                <div class="flex-br">
                </div>
                <div class="flex-l span-ctn" style="height: 20px;">
                  <div class="flex-s">
                  </div>
                  <span id="Confidence" class="fa fa-check nav-v pt-18" style="padding: 1px 2px; color: #000">
                  </span>
                  <span id="ConfidenceVal" class="nav-v pt-18 sp-v" style="width: 40px;">+10</span>
                  <div class="flex-s">
                  </div>
                </div>
              </div>
            </div>
          </div> 
          <div class="flex-l pad-6s" style="width: auto">
            <textarea rows="4" id="comment" style="border-radius: 5px; width: 100%; font-size: 14px; font-family: Arial,sans-serif !important;" class="form-field no-drag bc-e span-eval" placeholder="Comment..."></textarea>
          </div>
          <div id="UrlSubSrc1" class="flex-l pad-6s" style="width: auto;">
            <form autocomplete="off" style="width: 100%;">
              <div>
                <input id="UrlData1" class="source-url form-field no-drag span-eval" type="text" placeholder="Source URL" data-id=""></input>
              </div>
            </form> 
            <div id="AddUrl1" class="form-button add-source mr-pd">
              <span class="fa fa-plus" style="font-size: 12px; padding: 0; pointer-events: none;"></span>
            </div>
          </div> 
        </div>
      </div>
    </div>
  `);
  let cf = $(target).attr('data-c-cf')
  // console.log(cf)
  let confidence = $('#ConfidenceRange')
  let confidenceValue = $('#ConfidenceVal')[0]
  if (cf) {
    // console.log('active')
    setColor(cf, 10, [confidence])
    $('#RangeSliderConf').attr('value', cf);
    if ( $('#RangeSliderConf')[0].value > 0 ) {
      confidenceValue.innerText = '+' + $('#RangeSliderConf')[0].value;
    } else {
      confidenceValue.innerText = $('#RangeSliderConf')[0].value;
    }
    if ( $('#RangeSliderConf')[0].value >= 0 && $('#RangeSliderConf')[0].value < 10 && $('#RangeSliderConf')[0].value % 1 === 0 ) {
      confidenceValue.innerText = confidenceValue.innerText + '.0'
    }
  }
  if ( commentSchema.sentence[senIndex].sent ) {
    $('.sent-off').addClass('hide-field')
    $('#EnlargeIcon').removeClass('fa-expand').addClass('fa-compress')
    $('#Tone').css({'background-color': '#cdd'}).css({'pointer-events': 'none'})
    $('#comment').css({'background-color': '#cdd'}).css({'pointer-events': 'none'})
    $('.source-url').css({'background-color': '#cdd', 'pointer-events': 'none'})
    $('.add-source').css({'pointer-events': 'none', 'background-color': '#999'})
    $('.remove-source').css({'pointer-events': 'none', 'background-color': '#999'})
    $('#ConfidenceRange').css('pointer-events', 'none')
  }
  let quote = $('#SpanQuote')
  let credit = $('#CreditRange')
  if (senIndex !== -1) {
    let commentVal = commentSchema.sentence[senIndex].comment;
    let toneVal = commentSchema.sentence[senIndex].tone;
    $('#comment').val(commentVal)
    $('#Tone').val(toneVal)
    if (commentSchema.sentence[senIndex].sources) {
      if ( commentSchema.sentence[senIndex].sources.length > 0 ) {
        let sourceVal = commentSchema.sentence[senIndex].sources[0].url;
        $('#UrlData1').val(sourceVal)
        for (let a = 1; a < commentSchema.sentence[senIndex].sources.length; a++) {
          let sourceVal = commentSchema.sentence[senIndex].sources[a].url;
          addSource(sourceVal, target);
        }
      }
    }
  } else {
    commentSchema.sentence.push({
      'senId': target.id
    })
  }
  $('.add-source').off('click').on('click', () => {addSource('', target) } )
  let color = $(target).css('background-color');
  $(quote).css('background-color', color);
  $('#Enlarge').off('click').on('click', () => { doneFn(target) } )
  $('#Reset').off('click').on('click', () => { resetFn(target) } )
  $('#Done').off('click').on('click', () => { doneFn(target) } )
  $('#Cancel').off('click').on('click', () => { cancelFn(target) } )
  $('#ConfidenceRange').off('mouseover').on('mouseover', confidenceRangeSlider)
  $('#RangeSliderConf').off('input').on('input', () => { rangeConfSliderFn(target) } )
  $(spanTip).css('z-index', '2147483647')
  $('.tooltip-close').css('display', 'none');
  $('.tooltip-exp').css('display', 'block');
  let sentenceBox = document.getElementById('SentenceId');
  let spanBox = document.getElementById('highlightSpantip').getBoundingClientRect();
  $('#highlightSpantip').addClass('expanded-span')
  let sentence = sen.currentSentence();
  let sentenceString = sentence.innerText;
  if ( sentenceString.length > 105 ) {
    sentenceString = sentenceString.substring(0, 103) + '...'
  }
  sentenceBox.innerText = sentenceString;
  $('.nav-se').off('click').on('mouseover', spanTooltip)
  $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  animation = anime({
    targets: sentence,
    direction: 'normal',
    duration: 1600,
    loop: true,
    opacity: [1, 0.7],
    easing: 'easeInOutQuad',
  });
  animation = anime({
    targets: '.bottomTriangle',
    direction: 'normal',
    duration: 200,
    opacity: 0,
    easing: 'linear',
  }); 
  animation = anime({
    targets: '#highlightSpantip',
    direction: 'normal',
    duration: 200,
    padding: '0px 0px 8px 0px',
    opacity: 0.95,
    backgroundColor: '#444',
    easing: 'linear',
  }); 
  animation = anime({
    targets: '#SpanEdit',
    direction: 'normal',
    duration: 200,
    width: '420px',
    easing: 'linear',
  }); 
  setTimeout( () => { 
    expandMenu('#SpanEdit', 200, 0)
  }, 100);
  setTimeout( () => { 
    let expandedBox = document.getElementById('highlightSpantip');
    let boxTop = expandedBox.getBoundingClientRect().top;
    let boxLeft = expandedBox.getBoundingClientRect().left;
    $('.highlightTooltip').addClass('draggable')
    expandedBox.setAttribute('data-x', boxLeft)
    expandedBox.setAttribute('data-y', boxTop)
    $(expandedBox).css('position', 'fixed');
    $(expandedBox).css('top', boxTop + 'px');
  }, 310);
  $('.span-eval').off('input').on('input', () => { 
    visCheck(target)
    spanEval(target) } )
  $('.tip-eval').off('click').on('click', () => { spanEval(target) } )
  $('.tip-eval').off('touchend').on('touchend', () => {spanEval(target) } )
  spanEval(target)
}

function removeSpanTooltip(e) {
  if ( !$(e.target).hasClass('nav-se') && nav.getSpantip() && !$(e.target).hasClass('highlightTooltip') && !$(e.target).hasClass('nav-v') && !sen.getExpanded() && e.target.id !== 'CreditRange' && e.target.id !== 'ImportanceRange' && e.target.id !== 'RangeSliderIS' && e.target.id !== 'RangeSliderCP' ) {
    $('#highlightSpantip').remove()
    nav.setSpantip(false);
  }
}

function textHighlight() {
  if ( !nav.getHighlight() ) {
    addToRange = true
    nav.setHighlight(true)
    anime({
      targets: '#HighlightText',
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#3390FF',
      color: '#fff',
      easing: 'easeInSine'
    });
    //// TEXT SELECTION LISTENER ////
    $('body').off('mouseup', highlightText).on('mouseup', highlightText)
  } else if ( nav.getHighlight() ) {
    nav.setHighlight(false)
    anime({
      targets: '#HighlightText',
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#eee',
      color: '#000',
      easing: 'easeInSine'
    });
    $('body').off('mouseup', highlightText)
    let highlightTooltip = document.getElementById('highlightTooltip')
    if (highlightTooltip) { $('#highlightTooltip').remove() }
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
    if (spanRanges.list.length != 0) {
      // console.log(spanRanges)

      chrome.runtime.sendMessage( { 'message': 'Send Range', 'data': { 'range': spanRanges } } );
      spanRanges = {
        'list': [],
        'postId': postId
      }
    }
  }
}

//// SELECT TEXT ////
function highlightText(e) {
  let someSelection = window.getSelection()
  let ranges = [];
  for ( let i = 0; i < someSelection.rangeCount; i++ ) {
    let range = someSelection.getRangeAt(i);
    while ( range.startContainer.nodeType == 3 || range.startContainer.childNodes.length == 1 ) {
      range.setStartBefore( range.startContainer );
    }
    while ( range.endContainer.nodeType == 3 || range.endContainer.childNodes.length == 1 ) {
      range.setEndAfter( range.endContainer );
    }
    if ( window.getSelection().getRangeAt(0).cloneContents().firstChild.nodeType == 3 ) {
      range.setStartBefore( range.startContainer );
    }
    if ( window.getSelection().getRangeAt(0).cloneContents().lastChild.nodeType == 3 ) {
      range.setEndAfter( range.endContainer );
    }
    ranges.push( range );
  }
  someSelection.removeAllRanges();
  for(let i = 0; i < ranges.length; i++) {
    someSelection.addRange(ranges[i]);
  }
  if ( tempText == window.getSelection().toString() || window.getSelection().toString() === returnSpace ) { 
    $('#highlightTooltip').off('mouseover').on('mouseover', () => { 
      $('#highlightTooltip').removeClass('turn-off') } )
    $('#highlightTooltip').off('mouseout').on('mouseout', () => { 
      $('#highlightTooltip').addClass('turn-off') } )
    if ( $('#highlightTooltip').hasClass('turn-off') ) {
      $('#highlightTooltip').remove()
      window.getSelection().removeAllRanges()
    }
    tempText = '';
  } 
  else if ( tempText != window.getSelection().toString() || window.getSelection().toString() !== returnSpace ) { 
    let box = window.getSelection().getRangeAt(0).getBoundingClientRect()
    tempText = window.getSelection().toString()
    $(tooltip).addClass('highlightTooltip')
    tooltip.innerHTML = `<div>
      <span id="TextOn" class="fa fa-i-cursor pt-18"></span>
      <span id="TextOff" class="fa fa-times pt-18"></span>
      <span id="TextCancel" class="fa fa-ban pt-18"></span>
    </div>
    <span class="bottomTriangle"></span>`
    let contentBody = document.getElementsByTagName('BODY')[0]
    tooltip.id = 'highlightTooltip';
    $('#highlightTooltip').addClass('turn-off')
    contentBody.appendChild(tooltip)
    $(tooltip).css({'opacity': 0})
    let tooltipWidth = tooltip.offsetWidth
    let positionX = window.scrollX + (box.right + box.left)/2 - tooltipWidth/2
    let positionY = window.scrollY + box.top - 36
    $(tooltip).css({'left': positionX + 'px', 'top': positionY + 'px'})
    animation = anime({
      targets: '.highlightTooltip',
      direction: 'normal',
      duration: 200,
      opacity: 0.9,
      top: '-=3px',
      easing: 'linear',
    }); 
    tooltipWidth = document.getElementsByClassName('highlightTooltip')[0].offsetWidth
  } 
  $('#TextOn').off('mouseup').on('mouseup', textOnFn)
  $('#TextOff').off('click').on('click', () => {
    $('#highlightTooltip').remove();
    window.getSelection().removeAllRanges();
    tempText = '';
  } )
  $('#TextCancel').off('click').on('click', textHighlight)
}

function clearSelection() {
  if ( window.getSelection ) { window.getSelection().removeAllRanges(); }
  else if ( document.selection ) { document.selection.empty(); }
}

function textOnFn() {
  let fragmentContents = window.getSelection().getRangeAt(0).cloneContents()
  let selNodes = window.getSelection().getRangeAt(0).cloneContents();
  let selStart = selNodes.childNodes[0];
  let selEnd = selNodes.childNodes[selNodes.childNodes.length-1];
  let i = 0; j = 0;
  while ( selStart.nodeType !== 3 && i < 3 ) {
    selStart = selStart.childNodes[0];
    i++;
  };
  ////  save selStart   ////
  while ( selEnd.nodeType !== 3 && j < 3 ) {
    selEnd = selEnd.childNodes[0];
    j++;
  };
  ////  save selEnd   ////
  if (addToRange) {
    // console.log('in range')
    insertReviews()
  }
  var div = document.createElement('div');
  div.appendChild(selNodes.cloneNode(true))
  div.innerHTML
  let rangePosition = window.getSelection().getRangeAt(0)
  let mainString = '';
  let outerContainer = '';
  let textString = '';
  let allNodes = fragmentContents.childNodes
  let altFragment = fragmentContents.cloneNode(true)
  let altNodes = altFragment.childNodes
  for (let i = 0; i < allNodes.length; i++) {
    outerContainer = '';
    textString = '';
    if ( allNodes[i].nodeType === 3 ) {
      mainString += '<span class="nav-se">' + allNodes[i].nodeValue + '</span>';
    } else if ( allNodes[i].nodeType === 1 ) {
      let newDiv = document.createElement('div');
      newDiv.appendChild( allNodes[i].cloneNode(true) );
      outerContainer = newDiv.innerHTML
      outerContainer = outerContainer.replace(allNodes[i].innerHTML, '@#@#@#')
      let subNodes = allNodes[i].childNodes
      for (let j = 0; j < subNodes.length; j++) {
        if ( j === 0 ) {
          subNodes[j].nodeValue = '<span class="nav-se">' + subNodes[j].nodeValue
        }
        if (j === subNodes.length - 1 ) {
          subNodes[j].nodeValue = subNodes[j].nodeValue + '</span>'
        }
        if ( subNodes[j].nodeType === 3 ) {
          subNodes[j].nodeValue = subNodes[j].nodeValue.replace(/((((?<!(\s[A-Z]|Mr|Mrs|Rep|Sen|Col))\.\s(?![a-z])|\?\s(?![a-z])|\.”\s(?![a-z])|\."\s(?![a-z])|\!\s(?![a-z]))((\r\n)*|\r*|\n*)))/g, '$1@@@@@@')
          subNodes[j].nodeValue = subNodes[j].nodeValue.replace(/(@@@@@@)/g, '</span><span class="nav-se">')
          textString += subNodes[j].nodeValue
        } else {
          let tempDiv = document.createElement('div');
          tempDiv.appendChild( subNodes[j].cloneNode(true) );
          textString += tempDiv.innerHTML;
        }
      }
      textString = textString.replace('<span class="nav-se"></span>', '');
      outerContainer = outerContainer.replace('@#@#@#', textString);
    }
    mainString += outerContainer;
  } 
  let k = sen.nextID();
  let startK = k;
  let spanRegex = /\<span\sclass\=\"nav\-se\"\>/g;
  mainString = mainString.replace(spanRegex, (match) => { 
    let newString = '<span class="nav-se" id="rw' + k + '">'
    k++;
    return newString;
  })
  let endK = k - 1;
  rangePosition.deleteContents();
  let newFragment = document.createRange().createContextualFragment(mainString);
  rangePosition.insertNode(newFragment);
  if (addToRange) {
    // console.log('added')
    let listIndex = spanRanges.list.length - 1;
    for (let z = startK; z <= endK; z++) {
      spanRanges.list[listIndex].sentences.push({
        'content': $('#rw' + z).text(),
        'senId': 'rw' + z
      })
    }
  }
  $('#highlightTooltip').remove();
  clearSelection();
  tempText = '';
  $('.nav-se').off('mouseover', spanTooltip).on('mouseover', spanTooltip)
  if ( $('span').hasClass('nav-se') ) {
    $('body').off('click', removeSpanTooltip).on('click', removeSpanTooltip)
  }
}

function insertReviews() {
  let selNodes = window.getSelection().getRangeAt(0).cloneContents();
  let selStart = selNodes.childNodes[0];
  let selEnd = selNodes.childNodes[selNodes.childNodes.length-1];
  let i = 0; j = 0;
  while ( selStart.nodeType !== 3 && i < 3 ) {
    selStart = selStart.childNodes[0];
    i++;
  };
  while ( selEnd.nodeType !== 3 && j < 3 ) {
    selEnd = selEnd.childNodes[0];
    j++;
  };
  let innerXPath = `') and contains(text(),'`;
  selStart = selStart.nodeValue.replace(/\'|\"|\`/g, innerXPath);
  selEnd = selEnd.nodeValue.replace(/\'|\"|\`/g, innerXPath);
  spanRanges.list.push({
    'start': selStart,
    'end': selEnd,
    'sentences': [],
  })
}

function reviewedArticle(selStart, selEnd) {

  let startXPath = "//*[contains(text(),'" + selStart + "')]";
  let endXPath = "//*[contains(text(),'" + selEnd + "')]";
  let startLink = document.evaluate ( startXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  let startNum = startLink.snapshotLength;
  for (let i = 0; i < startNum; ++i) {
    var selStartNode = startLink.snapshotItem(i);
  }
  let endLink = document.evaluate( endXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  let endNum = endLink.snapshotLength;
  for (let i = 0; i < endNum; ++i) {
    var selEndNode = endLink.snapshotItem(i);
  }
  if (typeof selStartNode !== 'undefined' && typeof selEndNode !== 'undefined') {
    window.getSelection().setBaseAndExtent(selStartNode, 0, selEndNode, selEndNode.childNodes.length);
    textOnFn()
  }
}

function createSubMenu(current, target) {
  let currentIcon = current + 'Icon';
  let targetIcon = target + 'Icon';
  let postSub = nav.getCreateSub()
  if (target === '#NavProposal') {
    $('[data-create="container"]').css('overflow', 'auto') }
  else {
    $('[data-create="container"]').css('overflow', 'hidden') }

  nav.setCreateSub( target )
  $('#NavCreateMenu').css('height', 'auto')
  setTimeout( () => { 
    anime({
      targets: currentIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#ddd',
      easing: 'easeInSine'
    });
    anime({
      targets: targetIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#f33',
      backgroundColor: '#eee',
      easing: 'easeInSine'
    });
    anime({
      targets: [currentIcon + '> div > div', currentIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#000',
      easing: 'easeInSine'
    });
    anime({
      targets: [targetIcon + '> div > div', targetIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#900',
      easing: 'easeInSine'
    });
    collapseMenu(current, 200, 0);
  }, 5);
  setTimeout( () => { 
    expandMenu(target, 200, 0);
  }, 215);
  setTimeout( () => { 
    $('#NavCreateMenu').css('height', $('#NavCreateMenu').height() + 'px');
    $('#NavCreateMenu').css('height', 'auto');
  }, 460);
}

function homeSubMenu(current, target) {
  let currentIcon = current + 'Icon';
  let targetIcon = target + 'Icon';
  let postSub = nav.getHomeSub()
  nav.setHomeSub( target )
  $('#NavHomeMenu').css('height', 'auto')
  setTimeout( () => { 
    anime({
      targets: currentIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#ddd',
      easing: 'easeInSine'
    });
    anime({
      targets: targetIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#f33',
      backgroundColor: '#eee',
      easing: 'easeInSine'
    });
    anime({
      targets: [currentIcon + '> div > div', currentIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#000',
      easing: 'easeInSine'
    });
    anime({
      targets: [targetIcon + '> div > div', targetIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#900',
      easing: 'easeInSine'
    });
    collapseMenu(current, 200, 0);
  }, 5);
  setTimeout( () => { 
    expandMenu(target, 200, 0);
  }, 215);
  setTimeout( () => { 
    $('#NavHomeMenu').css('height', $('#NavHomeMenu').height() + 'px');
    $('#NavHomeMenu').css('height', 'auto');
  }, 460);
}

function postSubMenu(current, target) {
  let currentIcon = current + 'Icon';
  let targetIcon = target + 'Icon';
  let postSub = nav.getPostSub()
  nav.setPostSub( target )
  $('#NavPostMenu').css('height', 'auto')
  setTimeout( () => { 
    anime({
      targets: currentIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      backgroundColor: '#ddd',
      easing: 'easeInSine'
    });
    anime({
      targets: targetIcon,
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#f33',
      backgroundColor: '#eee',
      easing: 'easeInSine'
    });
    anime({
      targets: [currentIcon + '> div > div', currentIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#000',
      easing: 'easeInSine'
    });
    anime({
      targets: [targetIcon + '> div > div', targetIcon + '> div > span'],
      direction: 'normal',
      duration: 300,
      delay: 0,
      color: '#900',
      easing: 'easeInSine'
    });
    collapseMenu(current, 200, 0);
  }, 5);
  setTimeout( () => { 
    expandMenu(target, 200, 0);
  }, 215);
  setTimeout( () => { 
    $('#NavPostMenu').css('height', $('#NavPostMenu').height() + 'px');
    $('#NavPostMenu').css('height', 'auto');
  }, 460);
}

function removeCatId(e) {
  $(e.target).attr('data-id', '');
  if ( $(e.target).attr('data-prop') !== 'undefined' ) {
    let num = $(e.target).attr('data-prop-num')
    eval.proposal({target: 'catName', action: 'remove', num: num})
    // console.log($('#CatSearchBox' + targetId).attr('data-prop-num'))
  }
  else if ( $(e.target).attr('data-sprop') !== 'undefined' ) {
    let num = $(e.target).attr('data-prop-num')
    prop.controller({target: 'catName', action: 'remove', num: num})
    // console.log($('#CatSearchBox' + targetId).attr('data-prop-num'))
  }
}

function navLogoutMenu() {
  // console.log('Logging out')
  chrome.runtime.sendMessage( { message: 'Log out' } )  
  collapseMenu('#NavLogoutMenu', 200, 0);
}

function signInOutFn() {
  if ( nav.getSearch() ) {
    navSearchMenu() }
  if ( nav.getLogin() ) {
    // console.log('logged')
    if ( $('#NavLogoutMenu').height() !== 0) {
      collapseMenu('#NavLogoutMenu', 200, 0)
    } else {
      expandMenu('#NavLogoutMenu', 200, 0)
    }
    return;
  } 
  else {
    if ( nav.getCurrent() === 'none' ) {
      nav.setTarget('none');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavLoginIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      openNavbar(50, 0)
      expandMenu('#NavLoginMenu', 400, 50)
    } 
    else if ( nav.getTarget() !== 'none' & nav.getCurrent() === 'login' ) {
      nav.setTarget('none');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavLoginIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      collapseMenu('#NavLoginMenu', 300, 0)
      closeNavbar(25, 285)
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410)
    } 
    else if ( nav.getTarget() === 'none' & nav.getCurrent() === 'login' ) {
      nav.setCurrent('none');
      nav.setTarget('none');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      collapseMenu('#NavLoginMenu', 300, 0);
      closeNavbar(25, 285);
    } 
    else if ( nav.getCurrent() === 'post' ) {
      nav.setTarget('none');
      nav.setCurrent('login');
      $('.main-nav').css('color', 'rgb(204, 204, 204)')
      $('#NavLoginIcon').attr('style', 'color: rgb(251, 248, 194) !important; transition-duration: 0.15s; transition-delay: 0.2s;')
      collapseMenu('#NavPostMenu', 300, 0)
      closeNavbar(25, 285)
      openNavbar(50, 360)
      expandMenu('#NavLoginMenu', 400, 410)
    }
  }
}

function signInOut() {
  if ( nav.getSearch() ) {
    navSearchMenu() 
    setTimeout( () => { signInOutFn() }, 250);
  }
  else { signInOutFn() }
}

function submitSignin() {
  if ( $('#newSubmit').hasClass('login-button') ) {
    let email = $('#PlatformEmail').val();
    let password = $('#PlatformPassword').val();
    chrome.runtime.sendMessage({ message: 'User Login', data: { email, password	}	})
    return } 
  else if ( $('#newSubmit').hasClass('register-button') && $('#PlatformPassword').val() === $('#PlatformPassword2').val() ) {
    let email = $('#PlatformEmail').val();
    let password = $('#PlatformPassword').val();
    let fullName = $('#fullName').val();
    chrome.runtime.sendMessage({ message: 'User Register', data: { email, password, fullName	}	})
    return } 
  else {
    // console.log('none');
    return }
}

function flipSignin() {
  if ( $('#SigninChangeIcon').hasClass('fa-user-plus') ) {
    $('#newSubmit').removeClass('login-button').addClass('register-button')
    $('.register-field').css('opacity', '0').removeClass('hide-field')
    anime({
      targets: '.register-field',
      direction: 'normal',
      duration: 200,
      delay: 0,
      opacity: [0, 1],
      easing: 'easeOutQuart'
    });
    anime({
      targets: ['#SigninChangeIcon', '#SigninIcon', '#SigninChangeTitle', '#SigninTitle'],
      direction: 'normal',
      duration: 100,
      delay: 0,
      opacity: [1, 0],
      easing: 'easeInCubic'
    });
    setTimeout( () => { 
      $('#SigninChangeIcon').removeClass('fa-user-plus').addClass('fa-key rotated')
      $('#SigninIcon').removeClass('fa-key rotated').addClass('fa-user-plus')
      $('#SigninChangeTitle').text('LOGIN')
      $('#SigninTitle').text('REGISTER')
      anime({
        targets: ['#SigninChangeIcon', '#SigninIcon', '#SigninChangeTitle', '#SigninTitle'],
        direction: 'normal',
        duration: 100,
        delay: 0,
        opacity: [0, 1],
        easing: 'easeOutCubic'
      });
    }, 100);
    expandMenu('#NavLoginMenu', 400, 100) } 
  else if ( $('#SigninChangeIcon').hasClass('fa-key') ) {
    $('#newSubmit').removeClass('register-button').addClass('login-button')
    anime({
      targets: '.register-field',
      direction: 'normal',
      duration: 200,
      delay: 0,
      opacity: [1, 0],
      easing: 'easeOutQuart'
    });
    anime({
      targets: ['#SigninChangeIcon', '#SigninIcon', '#SigninChangeTitle', '#SigninTitle'],
      direction: 'normal',
      duration: 100,
      delay: 0,
      opacity: [1, 0],
      easing: 'easeInCubic'
    });
    setTimeout( () => { 
      $('#SigninChangeIcon').removeClass('fa-key rotated').addClass('fa-user-plus')
      $('#SigninIcon').removeClass('fa-user-plus').addClass('fa-key rotated')
      $('#SigninChangeTitle').text('REGISTER')
      $('#SigninTitle').text('LOGIN')
      anime({
        targets: ['#SigninChangeIcon', '#SigninIcon', '#SigninChangeTitle', '#SigninTitle'],
        direction: 'normal',
        duration: 100,
        delay: 0,
        opacity: [0, 1],
        easing: 'easeOutCubic'
      });
    }, 100);
    setTimeout( () => { 
      $('.register-field').css('opacity', '0').addClass('hide-field')
    }, 500);
    setTimeout( () => { 
      expandMenu('#NavLoginMenu', 200, 0)
    }, 500);
  }
}

//// COMMON ////

//// DRAG MOVE FUNCTION ////
function dragMoveListener(event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.left = x + 'px';
  target.style.top = y + 'px'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  dataX = x
  dataY = y
}

window.dragMoveListener = dragMoveListener

//// DRAG STATE ////
function dragStart(e) {
  if (e.type === 'touchstart') {
    dx = e.touches[0].clientX;
    dy = e.touches[0].clientY;
  } else {
    dx = e.clientX;
    dy = e.clientY;
  }
}

//// DRAG ANIMATION ////
interact('.draggable').draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  // enable autoScroll
  autoScroll: true,

  // call this function on every dragmove event
  onmove: dragMoveListener,

  // call this function on every dragend event
  onend: function (event) {
  var textEl = event.target.querySelector('p')

  textEl && (textEl.textContent =
    'moved a distance of ' +
    (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
      Math.pow(event.pageY - event.y0, 2) | 0))
      .toFixed(2) + 'px')
  }
})

function closeNavigation() {
  popOut()
  setTimeout( () => { 
    navDataX = $('#PlatformContextMenu').attr('data-x');
    navDataY = $('#PlatformContextMenu').attr('data-y');
    xy.storeNavX()
    xy.storeNavY()
    document.getElementById('navContainer').remove(); 
  }, 200);
}