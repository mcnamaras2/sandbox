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
const config = {
  apiKey: "AIzaSyC3Ftg4K-Z3nQmu3Cpsrya7mKSUBGde6Gc",
  authDomain: "tech-sandbox-print-queue-dev.firebaseapp.com",
  databaseURL: "https://tech-sandbox-print-queue-dev.firebaseio.com",
  projectId: "tech-sandbox-print-queue-dev",
  storageBucket: "tech-sandbox-print-queue-dev.appspot.com",
  messagingSenderId: "699879071054"
};
firebase.initializeApp(config);
var database = firebase.database();
var dbEvents = database.ref("events/"); //get reference to the events node of the database

$(function() { // document ready

  /* BEGIN: set up modal
  ----------------------------------------------------------*/

  var modal = document.getElementById('myModal');
  modal.submit_button = document.getElementById('sub');
  modal.closeWindow = document.getElementsByClassName("close")[0];
  modal.delete_button = document.getElementById('del');

  //close modal without saving
  modal.closeWindow.onclick = function() {
    modal.style.display = "none";
    $("#calendar").fullCalendar('refetchEvents');
  };
  window.onclick = function(click) {
    if (click.target == modal) {
      modal.style.display = "none";
      $("#calendar").fullCalendar('refetchEvents');
    }
  };

  /* END: set up modal ------------------------------- */

  var checkModal = function(event) {

    var title = document.getElementById('ptitle').value;
    //convert form fields to moments
    var start = moment(document.getElementById('pstart').value, 'YYYY-MM-DD hh:mm a', true);
    var end = moment(document.getElementById('pend').value, 'YYYY-MM-DD hh:mm a', true);

    //validate title
    if (!title.trim()) {
      alert("please enter an email address")
      return;
    } else {
      event.title = title;
    }

    //validate start and end dates
    if (!start.isValid()) {
      alert("invalid START date/time");
      return;
    } else { //update new event object
      event.start = start.toISOString(); //save as ISO 8601 string
    }

    if (!end.isValid()) {
      alert("invalid END date/time");
      return;
    } else { //update new event object
      event.end = end.toISOString(); //save as ISO 8601 string
    }
    console.log("in check modal" + event);
    //create database entry for new event
    updateDatabase(event);

  };

  function deleteEvent(event) {

    if (!event.firebaseKey) {
      //if this is a new event without an existing firebase key, create a new entry in the database.
      modal.style.display = "none"; //close the modal (if its open)
      $("#calendar").fullCalendar('refetchEvents'); //refetch the events to display the newly added event
      return;
    }

    var ref = dbEvents.child(event.firebaseKey) //get a reference for event's database key;
    ref.once("value").then(function(snapshot) {
      if (!snapshot.exists()) { //check for data at this reference.
        console.log("bad database key. Can't update database");
        return;
      } else {
        console.log("deleting event...");
        console.log(event);
        ref.remove().then(function(error) {
          if (error) {
            console.log("an error occured while trying to update the database" + error);
          }
          modal.style.display = "none"; //close the modal (if its open)
          $("#calendar").fullCalendar('refetchEvents'); //refetch the events to display the newly added event
        });
      }
    });
  };

  function updateDatabase(event) {

    if (!event.firebaseKey) {
      //if this is a new event without an existing firebase key, create a new entry in the database.
      dbEvents.push(event, function(error) {
        if (error) {
          console.log("an error occured while trying to update the database" + error);
        }
        modal.style.display = "none"; //close the modal (if its open)
        $("#calendar").fullCalendar('refetchEvents'); //refetch the events to display the newly added event
      });

    } else {

      var ref = dbEvents.child(event.firebaseKey) //get a reference for event's database key;
      ref.once("value").then(function(snapshot) {
        if (!snapshot.exists()) { //check for data at this reference.
          console.log("bad database key. Can't update database");
          return;
        } else {
          console.log("updating event...");
          console.log(event);
          ref.update({
            title: event.title,
            resourceId: event.resourceId,
            start: event.start,
            end: event.end
          }, function(error) {
            if (error) {
              console.log("an error occured while trying to update the database" + error);
            }
            modal.style.display = "none"; //close the modal (if its open)
            $("#calendar").fullCalendar('refetchEvents'); //refetch the events to display the newly added event
          });
        }
      });
    }
  };

  /* initialize the calendar
    -----------------------------------------------------------------*/

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
    selectable: true, //can select times on the calendar
    selectOverlap: false, //can't select if there is an event there already
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
    events: function(start, end, timezone, callback) {
      $.getJSON(`https://tech-sandbox-print-queue-dev.firebaseio.com/events.json`).done(function(data) {
        var events = [];
        if (data) {
          events = Object.keys(data).map(function(k) { // build an array of event objects from JS object
            data[k].firebaseKey = k; //add a firebaseKey property to the event
            return data[k]; //add an event object to the events array
          });
        }
        callback(events); //return array of event objects
      });

    },
    resources: [
      {
        id: 'a',
        title: 'MakerBot 1'
      }, {
        id: 'b',
        title: 'MakerBot 2 ',
        eventColor: 'orange'
      }, {
        id: 'c',
        title: 'MakerBot 3 ',
        eventColor: '#af41f4'
      }, {
        id: 'd',
        title: 'MakerBot Z18 ',
        eventColor: 'red'
      }, {
        id: 'e',
        title: 'Taz 6 ',
        eventColor: '#43A047'
      }, {
        id: 'f',
        title: 'Robo R1 1 ',
        eventColor: 'orange'
      }, {
        id: 'g',
        title: 'Robo R1 2 ',
        eventColor: 'maroon'
      }, {
        id: 'h',
        title: 'Robo R1 3 ',
        eventColor: 'purple'
      }, {
        id: 'i',
        title: 'Robo R1 4 ',
        eventColor: '#78909C'
      }, {
        id: 'j',
        title: 'Robo R2 ',
        eventColor: '#3F51B5'
      }
    ],
    drop: function(date, jsEvent, ui, resourceId) {
      console.log('drop', date.format(), resourceId);

    },

    select: function(start, end, jsEvent, view, resourceId) {
      if (!firebase.auth().currentUser) {
        return false;
      }
      var event = {
        title: "",
        start: start,
        end: end,
        resourceId: resourceId.id
      }

      //set values in modal form
      document.getElementById('ptitle').value = event.title; //set title field
      //display start and end moments in form fields
      document.getElementById('pstart').value = moment(event.start).format('YYYY-MM-DD hh:mm a')
      document.getElementById('pend').value = moment(event.end).format('YYYY-MM-DD hh:mm a');

      document.getElementById('pduration').textContent = moment(event.end).diff(event.start, 'hours', true) + ' hours'
      modal.style.display = "block";

      //when user clicks modal submit button
      modal.submit_button.onclick = function() {
        checkModal(event);
      };

      modal.delete_button.onclick = function() {
        deleteEvent(event);
      };

    },

    eventDrop: function(event) {
      updateDatabase(event);
    },
    eventResize: function(event) {
      updateDatabase(event);
    },
    eventClick: function(event, jsEvent, view) {
      if (!firebase.auth().currentUser) {
        return false;
      }
      //set values in modal form
      document.getElementById('ptitle').value = event.title; //set title field

      //display start and end moments in form fields
      document.getElementById('pstart').value = moment(event.start).format('YYYY-MM-DD hh:mm a');
      document.getElementById('pend').value = moment(event.end).format('YYYY-MM-DD hh:mm a');

      document.getElementById('pduration').textContent = moment(event.end).diff(event.start, 'hours', true) + ' hours'
      modal.style.display = "block";

      //when user clicks modal submit button
      modal.submit_button.onclick = function() {
        checkModal(event);
      };
      modal.delete_button.onclick = function() {
        deleteEvent(event);
      };

    }

  });
  $('#calender').fullCalendar('refetchEvents');
  console.log("refetching Events");
});
  /*function goto() {
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
} */
