  var config = {
      apiKey: "AIzaSyBiMTQEv9UKc8kwiWVQOe2F5_dbUrjFBgY",
      authDomain: "train-schedule-6fc2e.firebaseapp.com",
      databaseURL: "https://train-schedule-6fc2e.firebaseio.com",
      projectId: "train-schedule-6fc2e",
      storageBucket: "train-schedule-6fc2e.appspot.com",
      messagingSenderId: "996697542279"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var current = moment().format("YYYY-MM-DD");
  var array = current.split("-");
  var years = parseInt(array[0]);
  var months = parseInt(array[1]);
  var days = parseInt(array[2]);

  var trainName = "";
  var trainDestination = "";
  var trainTime = "";
  var trainFrequency = "";


  $("#submit-button").on("click", function() {

      event.preventDefault();

      trainName = $("#name-input").val().trim();
      trainDestination = $("#destination-input").val().trim();
      trainTime = $("#time-input").val().trim();
      trainFrequency = $("#frequency-input").val().trim();


      console.log(trainName);
      console.log(trainDestination);
      console.log(trainTime);
      console.log(trainFrequency);

      // trainTime = moment(moment(trainTime, "hh:mm A").subtract(1, "years"), "hh:mm ").format("hh:mm A");
      // console.log("CHECK!" + trainTime);


      database.ref().push({
          name: trainName,
          destination: trainDestination,
          time: trainTime,
          frequency: trainFrequency
      })

      $("#name-input").val("");
      $("#destination-input").val("");
      $("#time-input").val("");
      $("#frequency-input").val("");
  });

  console.log("Train names courtesy of my nephew, Vaughn, the biggest fan of 'Thomas the Train & Friends.'")

  database.ref().on("child_added", function(snapshot) {

      console.log(snapshot.val().name);
      console.log(snapshot.val().destination);
      console.log(snapshot.val().time);
      console.log(snapshot.val().frequency);

      var newRow = $("<tr>");
      var addRow = snapshot.val();

      var frequencyCheck = snapshot.val().frequency;
      var firstTime = snapshot.val().time;

      var firstMoment = moment(firstTime, "HH:mm");

      var dayEnd = moment("23:59", "HH:mm");

      var timesArray = [];

      for (var i = firstMoment; i.isSameOrBefore(dayEnd); i.add(frequencyCheck, "minutes")) {

          var times = i.format("HH:mm");

          timesArray.push(times);
      }

      var currentTime = moment("20:52", "HH:mm");

      var futureArray = [];

      for (var i = 0; i < timesArray.length; i++) {

          if (moment(timesArray[i], "HH:mm").isAfter(currentTime)) {
              futureArray.push(timesArray[i]);
          }
      }

      var nextTrain = futureArray[0];

      var minutesAway = moment(nextTrain, "HH:mm").diff(currentTime, "minutes");

      var showTime = moment(nextTrain, "HH:mm").format("h:mm a");

      newRow.append("<td>" + addRow.name + "</td>");
      newRow.append("<td>" + addRow.destination + "</td>");
      newRow.append("<td>" + addRow.frequency + "</td>");
      newRow.append("<td>" + showTime + "</td>");
      newRow.append("<td>" + minutesAway + "</td>");

      $("#train-row").append(newRow);
  });