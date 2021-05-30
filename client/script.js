window.onload = function () {
  const url = window.location.origin;
  let socket = io.connect(url);

  let clients = {};

  function now() {
    return new Date().getTime();
  }

  function getCursorElement(id) {
    var elementId = 'cursor-' + id;
    var element = document.getElementById(elementId);
    if (element == null) {
      element = document.createElement('div');
      element.id = elementId;
      var header = document.getElementById('header');
      element.className = 'cursor';
      header.appendChild(element);
    }
    return element;
  }

  function RemoveElement(id) {
    var deleteId = 'cursor-' + id;
    var element_avail = document.getElementById(deleteId);
    if (element_avail) {
      document.getElementById(deleteId).remove();
    }
  }

  let lastEmit = now();

  function updateMouse(x, y, el) {
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  document.onmousemove = document.onmouseenter = document.onmouseover = function (e) {
    // switch (e.type) {
    //   case "mousemove":
    // this is just i am ratelimitting per second streaming. but for smooth moving we may need to remove later
    if (now() - lastEmit > 1000) {
      socket.emit("mousemove", {
        x: e.pageX,
        y: e.pageY
      });
      lastEmit = now()
          // break;
      // }
      // default:
      //   break;
    }
  };

  socket.on("moving", function (data) {
    clients[data.id] = data;
    clients[data.id].updated = now();
    var el = getCursorElement(data.id);
    updateMouse(data.x, data.y, el);
  });

  //also set a timeout and check if all clients are still exist. if not delete that node from the body

  socket.on("clientdisconnect", function (id) {
    delete clients[id];
    //remove cursor animation in the home page here....
    RemoveElement(id);
  });
};
