$(document).ready(function(){
  // console.log("hello world")
  addWinners()

  // $('button#addMore').click(addtoStephanie)
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
      $('table.winners tr:last').after(
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
function removeAlert(id) {
  window.setTimeout(function(){$(id).hide()}, 1000);
}

function doThings(row) {
  $.get('https://thingspace.io/dweet/for/SKS7-2e10?latLong=37.7741740554,-122.436788704,12', function(data) {
  // console.log(row)

    $.get('https://thingspace.io/dweet/for/SKS7-2e10?latLong=37.7741740554,-122.436788704,12', function(data) {
    })
    $('#now').html('<h3>' + row.latitude + ', ' + row.longitude + ' at '+ row.timestamp + '</h3>')
  })
  // $('table tr:last').after(
  //   '<tr><td>' + row.timestamp + '</td><td>' + row.latitude + '</td><td>' + row.longitude + '</td><td>' + true + '</td></tr>'
  //   )
  if (row.latitude === 37.7741740554) {
    $('.stephanie .points').html(1 + parseInt($('.stephanie .points').html() ))
    $('#first').show()
  }
  else if (row.latitude === 37.7770008073) {
    $('.stephanie .points').html(1 + parseInt($('.stephanie .points').html() ))
    $('#second').show()
  }
}


function getResults(){
  $.get('/data/mockArduino.json', function( data ){
    for (var i = 0; i < data.data.length; i ++ ){
      var row = data.data[i]
      doThings(row)
    }
  })



  delayedAlert()
  removeAlert('#first')

}

function updateResults(){
  // this.hide()
  $('#now').show()
  $('#startTrip').hide()

  getResults()
}

function getWinner(){
  // flash()
  $('#second').show()
  $('#third').show()
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
          $('table.winners tr:last').after(
            '<tr class=' + klass +'><td>'+ rank + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td class="points">' + person.points + '</td></tr>'
            )
        }
    })
  })
  removeAlert('#second')
  // removeAlert('#third')
}
