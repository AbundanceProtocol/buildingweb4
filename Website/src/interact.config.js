import interact from 'interactjs';

// let navDataX = 10
// let navDataY = 10


let dataX = 10
let dataY = 10
let dx = 10
let dy = 10

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
export function dragStart(e) {
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

export async function dragEnd(e) {
  if ((dx - e.clientX) === 0 && (dy - e.clientY) === 0) {
    return;
  } 
  else { return }
}