var Name; //variable used for the event name when being pulled from db JSON
var evstart; //variable used for the event start time/date when being pulled from db JSON
var evend; //variable used for the event end time/date when being pulled from db JSON
var printer; //variable used for event resourceID when being pulled from the db JSON
var i = 0;
var j = 0;
var id = 0;
var allDay; //var for allday, not used much
var ID;
var obj;
var count = 0;
var eventdata; //variable for the eventdata, which is set to be eventdata pulled from db JSON
var data; //variable used to convert db json object to array for feed into FullCalendar events
var datas; //used when pulling data out of firebase database snapshot
var key; //used to assign key values from snapshot
var keys; //used to get key values for db objects to allow for changes to be made to the right object
var arr; //array used to convert JSON object from DB into array accepted by fullcalendar events
var k;
var start;
var end;
var duration;
var avgcount = 0;
var duravgnum = 0;
var avg = 0;
var ap = 0;
var bp = 0;
var cp = 0;
var dp = 0;
var ep = 0;
var fp = 0;
var gp = 0;
var hp = 0;
var ip = 0;
var jp = 0;
//url: 'https://sandbox-ui.firebaseio.com/sandbox-ui/events.json';
//config info for the firebase database
var config = {
  apiKey: "AIzaSyD7WKW8wD07hQ4fTA_gUT3xHFCUVOGqR4E",
  authDomain: "sandbox-ui.firebaseapp.com",
  databaseURL: "https://sandbox-ui.firebaseio.com",
  projectId: "sandbox-ui",
  storageBucket: "sandbox-ui.appspot.com",
  messagingSenderId: "1064917041181"
};
//initialization of the firebasre database for use in the code below, sets database reference to the events node of the database
firebase.initializeApp(config);
firebase.database().ref('sandbox-ui/events').on("value", function(snapshot) {
  //  console.log(snapshot.val());
  eventdata = snapshot.val(); //setting eventdata to be the data retrieved by snapshot.val
  // console.log(eventdata);
  keys = Object.keys(eventdata);
  //console.log(keys);
  snapshot.forEach(function(childSnapshot) {
    key = childSnapshot.key;
    datas = childSnapshot.val();
    //    console.log(key, datas);
  })
  //console.log('Getting Feed From', key, data.username, index);
  //getFeed(key);
  while (i < keys.length) { //loop that pulls out individual information from each entry for troubleshooting purposes
    k = keys[i];
    //console.log(k);
    Name = eventdata[k].title;
    //console.log('title:',Name);
    evstart = eventdata[k].start;
    //	console.log('start:',evstart);
    evend = eventdata[k].end;
    //	console.log('end:',evend);
    allDay = eventdata[k].allDay;
    //	console.log('allDay:',allDay);
    printer = eventdata[k].resourceId;
    //	console.log('resourceId:',printer);
    id = eventdata[k].id;
    //	console.log('id:',id);
    //  var theduration;
    //theduration=moment.duration(evend - evstart);
    var duration = moment.duration(moment(evend).diff(moment(evstart)));
    var theduration = duration.asHours();
    //console.log("Duration "+i+": "+ theduration+":hours ");
    if (theduration > 0) {
      duravgnum = duravgnum + theduration;
      avgcount++;

    }
    i++;
    count = i;
  }
  avg = duravgnum / avgcount;
  avg = avg.toPrecision(3);
  console.log("number of prints: " + avgcount);
  console.log("total length of all prints: " + duravgnum);
  console.log("Average print length: " + avg + " hours");
  console.log("number of prints on Makerbot 1: " + ap);
  console.log("number of prints on Makerbot 2: " + bp);
  console.log("number of prints on Makerbot 3: " + cp);
  console.log("number of prints on Makerbot z18: " + dp);
  console.log("number of prints on Taz: " + ep);
  duravgnum = duravgnum.toPrecision(6);
  document.getElementById("stat").innerHTML = "Number of Prints:" + avgcount + ' &nbsp' + " Average Print Length:" + avg + "hours" + ' &nbsp' + " Total print time this semester: " + duravgnum + "hours";
});

function gotData(data) {
  console.log(data); //taking the data from the database
  data = data;
  arr = Object.keys(data).map(function(k) {
    return data[k]
  }); //converting from JSON object into an array for use with events function of Fullcalender
  console.log(arr);
  for (var h = 0; h < arr.length; h++) {
    if (arr[h].resourceId == 'a') {
      ap++;
    }
    if (arr[h].resourceId == 'b') {
      bp++;
    }
    if (arr[h].resourceId == 'c') {
      cp++;
    }
    if (arr[h].resourceId == 'd') {
      dp++;
    }
    if (arr[h].resourceId == 'e') {
      ep++;
    }
    if (arr[h].resourceId == 'f') {
      fp++;
    }
    if (arr[h].resourceId == 'g') {
      gp++;
    }
    if (arr[h].resourceId == 'h') {
      hp++;
    }
    if (arr[h].resourceId == 'i') {
      ip++;
    }
    if (arr[h].resourceId == 'j') {
      jp++;
    }
  }

}
$(function() { // document ready

  /* initialize the external events
    -----------------------------------------------------------------*/

  $('#external-events .fc-event').each(function() {

    // store data so the calendar knows to render an event upon drop
    $(this).data('event', {
      title: $.trim($(this).text()), // use the element's text as the event title
      stick: true // maintain when user navigates (see docs on the renderEvent method)
    });

    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999, revert: true, // will cause the event to go back to its
      revertDuration: 0 //  original position after the drag
    });

  });

  /* initialize the calendar
    -----------------------------------------------------------------*/
  var database = firebase.database().ref('sandbox-ui/events');
  var scrollTime = moment().format("HH:mm");
  //setting database to be the reference to our events node
  $('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    //now: $('#calendar').fullCalendar('getDate'),
    // days of week. an array of zero-based day of week integers (0=Sunday), broken into two arrays to allow for different hours for weekend days
    businessHours: [
      {
        dow: [
          1, 2, 3, 4, 5
        ], // Monday - Friday
        start: '9:00', // a start time 9am
        end: '18:00', // an end time 6pm
      }, {
        dow: [0], // Sunday, Saturday
        start: '11:00', // 11am
        end: '17:00' // 5pm
      }
    ],
    timezone: 'local',
    header: {
      //header of calender
      left: 'today prev,next',
      center: 'title',
      right: 'timelineDay'
    },
    height: "auto", //set height of rendered calender, auto is set to allow for Fullcalender to determine best fit size
    //contentHeight:"auto",
    editable: false, // enable draggable events
    droppable: true, // this allows things to be dropped onto the calendar
    //aspectRatio: 3, unneeded due to height value being set
    scrollTime: scrollTime, // undo default 6am scrollTime
    nowIndicator: true, //sets indicator of current time
    slotLabelInterval: '01:00:00', //1 hour slot labels with 15 minute intervals
    slotDuration: '00:15:00', //sets slot intervals to 15 minutes
    snapDuration: '00:15:00', //events snap to nearest 15 minute
    eventLongPressDelay: 1000, //sets delay for touch events
    longPressDelay: 1000, //sets delay for touch events
    selectLongPressDelay: 1000, //sets delay for touch events
    defaultView: 'timelineDay', //sets timeline view
    resourceLabelText: '3D Printers', //label for resource column
    resourceAreaHeight: '100%',
    eventOverlap: false, //events cannot overlap
    events: arr,
    resources: [
      {
        id: 'a',
        title: 'MakerBot 1' + '\xa0\xa0\xa0\xa0' + '# of prints:' + ap
      }, {
        id: 'b',
        title: 'MakerBot 2 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + bp,
        eventColor: 'orange'
      }, {
        id: 'c',
        title: 'MakerBot 3 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + cp,
        eventColor: '#af41f4'
      }, {
        id: 'd',
        title: 'MakerBot Z18 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + dp,
        eventColor: 'red'
      }, {
        id: 'e',
        title: 'Taz 6 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + ep,
        eventColor: '#43A047'
      }, {
        id: 'f',
        title: 'Robo R1 1 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + (
        fp - 2),
        eventColor: 'orange'
      }, {
        id: 'g',
        title: 'Robo R1 2 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + (
        gp - 1),
        eventColor: 'maroon'
      }, {
        id: 'h',
        title: 'Robo R1 3 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + (
        hp - 1),
        eventColor: 'purple'
      }, {
        id: 'i',
        title: 'Robo R1 4 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + (
        ip - 1),
        eventColor: '#78909C'
      }, {
        id: 'j',
        title: 'Robo R2 ' + '\xa0\xa0\xa0\xa0' + '# of prints:' + (
        jp - 1),
        eventColor: '#3F51B5'
      }
    ],
    drop: function(date, jsEvent, ui, resourceId) {
      console.log('drop', date.format(), resourceId);

    },
    eventReceive: function(event) { // called when a proper external event is dropped
      console.log('eventReceive', event);
      duration = moment.duration(event.end - event.start);
      //var dur=event.start.format('YYYY-MM-DD HH:mm:SS')-event.end.format('YYYY-MM-DD HH:mm:SS');
      //alert("Length of Print:"+ duration.hours()+' hours:'+duration.minutes()+' minutes')
      $('#calendar').fullCalendar('updateEvent', event);

    },
    eventDrop: function(event) { // called when an event (already on the calendar) is moved
      console.log('eventDrop', event);

      var h = keys[event.id];
      //set h to be the value of key, which currently is the last key in the eventdata snapshot from firebase
      if (h == undefined) {} else {
        database = firebase.database();
        var firebaseRef = firebase.database().ref('sandbox-ui/events/' + h);
        //updating firebase data for event
        firebaseRef.update({resourceId: event.resourceId});
        firebaseRef.update({start: event.start.format('YYYY-MM-DD HH:mm')});
        firebaseRef.update({end: event.end.format('YYYY-MM-DD HH:mm')});
        $('#calendar').fullCalendar('updateEvent', event);
        //rerendering events, with new event data after updates
        $("#calendar").fullCalendar('removeEvents');
        gotData(eventdata);
        $("#calendar").fullCalendar('addEventSource', arr);
        $('#calendar').fullCalendar('rerenderEvents');
      }

    },
    eventResize: function(event) {
      var duration = moment.duration(event.end - event.start);
      var h = keys[event.id];
      if (h == undefined) {
        alert("Length of Print:" + duration.hours() + ' hours:' + duration.minutes() + ' minutes'); //alerting length of print
        $('#calendar').fullCalendar('updateEvent', event) //set h to be the value of key, which currently is the last key in the eventdata snapshot from firebase);
      } else {
        //alert(event.id);
        //alert(h);
        database = firebase.database();
        var firebaseRef = firebase.database().ref('sandbox-ui/events/' + h);
        alert("Length of Print:" + duration.hours() + ' hours:' + duration.minutes() + ' minutes'); //alerting length of print
        // alert(event.start);
        //alert(event.end);
        $('#calendar').fullCalendar('updateEvent', event); //updating event with new info
        //block to update the events database information
        firebaseRef.update({allDay: false});
        firebaseRef.update({start: event.start.format('YYYY-MM-DD HH:mm')});
        firebaseRef.update({end: event.end.format('YYYY-MM-DD HH:mm')});
        //rerendering events, with new event data after updates
        $("#calendar").fullCalendar('removeEvents');
        gotData(eventdata);
        $("#calendar").fullCalendar('addEventSource', arr);
        $('#calendar').fullCalendar('rerenderEvents');
      }
    },
    eventClick: function(event, jsEvent, view) {
      if (!firebase.auth().currentUser) {
        return false;
      } else {

        var e;
        //  document.getElementById('info').style.visibility='visible';
        //function to submit modal print information after enter key pressed
        document.getElementById("content").addEventListener("keyup", function(e) {
          //event.preventDefault();
          //13 is the keycode for enter key
          if (e.keyCode === 13) {
            document.getElementById("sub").click();
          }
        });
        //function to close modal on press of esc button
        window.addEventListener('keydown', function(e) {
          //event.preventDefault();
          //27 is the keycode for escape key
          if (e.keyCode === 27) {
            span.click();
            //console.log("esc");
            document.getElementById("forms").reset();
          }
        });
        var modal = document.getElementById('myModal');
        //pre-populate modal
        document.getElementById('ptitle').value = event.title;
        document.getElementById('pstart').value = event.start.format('YYYY-MM-DD hh:mm a'); //display nicely
        document.getElementById('pend').value = event.end.format('YYYY-MM-DD hh:mm a');

        document.getElementById('pduration').textContent = event.end.diff(event.start, 'hours', true) + ' hours'
        modal.style.display = "block";
        var submit = document.getElementById('sub');
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        var del = document.getElementById('del');

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }
        window.onclick = function(click) {
          if (click.target == modal) {
            modal.style.display = "none";

          }
        }
        //funtion for when submit button pressed
        submit.onclick = function() {
          event.title = document.getElementById('ptitle').value; //check for updated event title in modal. fallback to original title.
          var pstart = moment(document.getElementById('pstart').value, "YYYY-MM-DD hh:mm a"); //parse start date field
          var pend = moment(document.getElementById('pend').value, "YYYY-MM-DD hh:mm a"); //parse end date field

          if (!pstart.isValid()) {
            alert("invalid START date/time");
            return;
          }

          if (!pend.isValid()) {
            alert("invalid END date/time");
            return;
          }

          var h = keys[event.id];

          event.start = pstart.format('YYYY-MM-DD HH:mm'); //save as 24hr;
          event.end = pend.format('YYYY-MM-DD HH:mm'); //save as 24hr;
          console.log("event ready to save:");
          console.log(event);

          $('#calendar').fullCalendar('updateEvent', event);
          console.log(h);
          if (h == undefined) {
            database = firebase.database();
            firebaseRef = firebase.database().ref('sandbox-ui/events').push();
            //seting new firebase data child in events directory
            firebaseRef.child("title").set(event.title);
            firebaseRef.child("allDay").set(false);
            firebaseRef.child("start").set(event.start);
            firebaseRef.child("end").set(event.end);
            firebaseRef.child("id").set(count - 1);
            firebaseRef.child("resourceId").set(event.resourceId);
            $('#calendar').fullCalendar('updateEvent', event);
            console.log(count);
            //rerendering events, with new event data after updates
            $("#calendar").fullCalendar('removeEvents');
            gotData(eventdata);
            $("#calendar").fullCalendar('addEventSource', arr);
            $('#calendar').fullCalendar('rerenderEvents');
            modal.style.display = "none";
            document.getElementById("forms").reset();
          } else {
            console.log(h);
            database = firebase.database();
            firebaseRef = firebase.database().ref('sandbox-ui/events/' + h);
            //updating firebase data for event
            firebaseRef.update({end: event.end});
            //console.log(event.end);
            firebaseRef.update({start: event.start});
            //console.log(event.start);
            firebaseRef.update({title: event.title});
            //console.log(event.title);
            //  firebaseRef.update({allDay:false});
            //firebaseRef.update({id:count-1});
            //firebaseRef.update({resourceId:event.resourceId});
            //  console.log(count);
            //rerendering events, with new event data after updates
            $('#calendar').fullCalendar('updateEvent', event);
            $("#calendar").fullCalendar('removeEvents');
            gotData(eventdata);
            $("#calendar").fullCalendar('addEventSource', arr);
            $('#calendar').fullCalendar('rerenderEvents');
            modal.style.display = "none";
            document.getElementById("forms").reset();
            //  var resourceId=event.resourceId;
            //  var resourceId=event.resourceId;
          }
        }
        del.onclick = function() {
          var h = keys[event.id];
          if (h == undefined) {
            //sets event.id to keep count accurate
            //alert(h);
            //alert(event.id);
            event.tite = null;
            event.start = null;
            event.end = null;
            $('#calendar').fullCalendar('updateEvent', event);
            //rerendering events, with new event data after updates
            $("#calendar").fullCalendar('removeEvents');
            gotData(eventdata);
            $("#calendar").fullCalendar('addEventSource', arr);
            $('#calendar').fullCalendar('rerenderEvents');
            //location.reload().reload();
            document.getElementById("forms").reset();
            modal.style.display = "none";
          } else {
            console.log(event.id);
            //alert(h);
            //alert(event.id);
            database = firebase.database();
            firebaseRef = firebase.database().ref('sandbox-ui/events/' + h);
            //sets null for data to 'erase' event
            firebaseRef.update({title: null});
            firebaseRef.update({start: null});
            firebaseRef.update({end: null});
            firebaseRef.update({resourceId: null});
            $('#calendar').fullCalendar('updateEvent', event);
            //rerendering events, with new event data after updates
            $("#calendar").fullCalendar('removeEvents');
            gotData(eventdata);
            $("#calendar").fullCalendar('addEventSource', arr);
            $('#calendar').fullCalendar('rerenderEvents');
            document.getElementById("forms").reset();
            modal.style.display = "none";
          }
        }

        //var things=event.id-1;
        //var length=event.end.diff(event.start, 'minutes');
        //var length=(end-start);
      }
    }
  });
  $('#calender').fullCalendar('refetchEvents');
  $('#calendar').fullCalendar('render')
});

function goto() {
  //goes to specified date
  var date = prompt('Enter date:', 'YYYY-MM-DD', {
    buttons: {
      Ok: true,
      Cancel: false
    }
  });
  $('#calendar').fullCalendar('gotoDate', date);
  //rerendering events, with new event data after updates
  $("#calendar").fullCalendar('removeEvents');
  $("#calendar").fullCalendar('addEventSource', arr);
  $('#calendar').fullCalendar('rerenderEvents');
}
