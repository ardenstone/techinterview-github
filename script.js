
function get(url, username, password) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    //Adding date time string to prevent browser cache
    req.open('GET', url + '?rand='+new Date().getTime());
    if (username) {
      req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password))
    }
    req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
    req.onerror = (e) => reject(Error(`Network Error: ${e}`));
    req.send();
  });
}
function pullEvents(username, password) {
    var message = '';
    var APIurl = "https://api.github.com/events";
    get(APIurl, username, password)
      .then((data) => {
        if (username && password) {
          document.getElementById('login-form').style.display = 'none';
        }
        //Need to turn raw string response into JSON objects
        data = JSON.parse(data);
        message = 'passed';
        $('#events').children().fadeOut(500).promise().then(function() {
          $('#events').empty();
          for (var i = 0; i < data.length; i++) {
            var item = data[i]
            var mainItem = "<div id='"+ item.id +"' class='list-group-item'></div>";
            $("#events").append(mainItem);
            var header = "<a target='_blank' href='https://github.com/" + item.repo.name + "'>" + item.repo.name + "</a>\
                          <h4 onclick=\"showDetails('"+item.id+"'); return false;\"  class='list-group-item-heading'>"+ item.type + "</h4>\
                          <p class='list-group-item-text text-left'>\
                          User: \
                          <img src='"+item.actor.avatar_url+"' width='32px'/>\
                          <a target='_blank' href='https://github.com/"+item.actor.login+"'>"+item.actor.login+"</a>\
                          </p><p class='list-group-item-text text-right'>\
                          <a href='#' onclick=\"showDetails('"+item.id+"'); return false;\"  role='button' class='btn btn-default'>Details</a>\
                          </div>\
                          </p>";
            var details = "<p id='"+item.id+"_details' class='list-group-item-text item_details'>Date: " + Sugar.Date.create(item.created_at) + "</p>";
            $("#"+item.id).append($(header+details).hide().fadeIn(500));
            elements = document.getElementsByClassName('item_details');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
          };
        });
      }).catch((err) => {
        message = err;
      });
  return message;
};

pullEvents();

function showDetails(id) {
  if(document.getElementById(id + '_details').style.display == 'none') {
    elements = document.getElementsByClassName('item_details');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
    elements = document.getElementsByClassName('list-group-item list-group-item-info');
    for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'list-group-item';
    }
    document.getElementById(id + '_details').style.display = '';
    document.getElementById(id).className = 'list-group-item list-group-item-info';
  } else {
    document.getElementById(id + '_details').style.display = 'none';
    document.getElementById(id).className = 'list-group-item';
  }
};

function login(){
  var username = document.getElementById('username').value;
  if(!username){
    var usernameGroup = document.getElementById("usernameGroup");
    usernameGroup.className += " has-error";
  }
  var password = document.getElementById('password').value;
  if(!password){
    var passwordGroup = document.getElementById("passwordGroup");
    passwordGroup.className += " has-error";
  }
  if(username && password) {
    pullEvents(username, password);
  }
};

document.getElementById("password").addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      pullEvents(username, password);
    }
}, false);
