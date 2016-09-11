$(document).ready(function(){
  // console.log("hello world")
   $('button#stats').click(slide)
  $('button#addMore').click(addtoStephanie)
  addWinners()
  $('#startTrip').click(updateResults)
})


function addWinners() {
  $.getJSON('/data/stats.json', function(data){
    // console.log(data)
    var peeps = data.people.sort(function(a, b){
      if (a.points < b.points){
        return 1
      }
      if (a.points > b.points){
        return -1
      }
      return 0
    })
    for (var i= 0; i < peeps.length; i++) {
      var person = peeps[i]
      var klass = i === 0 ? 'winner' : 'not'
      var rank = i + 1
      $('table tr:last').after(
        '<tr class=' + klass +'><td>'+ rank + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td class="points">' + person.points + '</td></tr>'
        )
      if (person.name === 'Stephanie') {
        $('table tr:last').addClass('stephanie')
      }
    }
  });
}
function delayedAlert() {
  var timeoutID = window.setTimeout(getWinner, 2000);
}

function flash() {
    $('body').addClass("flash");
    window.setTimeout(function(){$('body').removeClass("flash");}, 200)
}

function updateResults(){
  $.get('https://thingspace.io/dweet/for/SKS7-2e10?latLong=37.7741740554,-122.436788704,12', function(data) {
    $('.stephanie .points').html(1 + parseInt($('.stephanie .points').html() ))
    $('.messages').html('<p class=w>New GPS Unit detected!</p>')
  })
  flash()


  delayedAlert()
}

function getWinner(){
  $.get('https://thingspace.io/dweet/for/SKS7-2e10?latLong=37.7741740554,-122.436788704,12', function(data) {
      $.getJSON('/data/change_stats.json', function(data){
        var peeps = data.people.sort(function(a, b){
          if (a.points < b.points){
            return 1
          }
          if (a.points > b.points){
            return -1
          }
          return 0
        })
        $("table").find("tr:gt(0)").remove();
        for (var i= 0; i < peeps.length; i++) {
          var person = peeps[i]
          var klass = i === 0 ? 'winner' : 'not'
          var rank = i + 1
          $('table tr:last').after(
            '<tr class=' + klass +'><td>'+ rank + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td class="points">' + person.points + '</td></tr>'
            )
        }
    })
  })
}

function slide() {
  // $('img').addClass('slider')
  setTimeout($('img#map').addClass('slider'), 5000)
  $('img#map').addClass('closed')
  $('.hidden').show()
  // $('body').css('background', 'url(/img/map_img.png), no-repeat')
}
function addtoStephanie() {
  console.log('hello')

  // $.ajax({
  //   method: "GET",
  //   url: "/data/stats.json",
  //   data: {'hello': 'world'}
  // })
  // .success(function(data){
  //   console.log(data)

  // })
  // .fail(function(error){
  //   console.log(error)
  // });
  // $("#addHere").append('HELLO')
}
