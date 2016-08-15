// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRGOPfsS3-aMRV-cyBAWcRSa2GJT9P4Kg",
    authDomain: "train-time-76452.firebaseapp.com",
    databaseURL: "https://train-time-76452.firebaseio.com",
    storageBucket: "train-time-76452.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

// Process done on Train Input
var compute = {

    // Create new train object, push do DB, and clear input
    newTrain: function(name, destination, startTime, frequency) {
        var newTrain = {
            name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency
        };
        db.pushTrain(newTrain);
        render.clearInput();

    },

    // Compute minutes away and next arrival time
    nextTrain: function(startTime, frequency) {
        var currentTime = moment();
        var pastYearTime = moment(startTime, 'hh:mm').subtract(1, 'years');
        var referenceMinutes = currentTime.diff(moment(pastYearTime), 'minutes');
        var timeDiffReference = referenceMinutes % frequency;
        var minutesAway = frequency - timeDiffReference;
        var nextArrival = currentTime.add(minutesAway, 'minutes').format('hh:mm');
        var nextTrain = {
            nextArrival: nextArrival,
            minutesAway: minutesAway
        };
        return nextTrain;
    }
};

var db = {

    // Push new train object to database
    pushTrain: function(newTrain) {
        database.ref().push(newTrain)
    }
};

var render = {

    // Clear input fields after data is submitted
    clearInput: function() {
        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#startTimeInput").val("");
        $("#frequencyInput").val("");
    },

    // Clear rendered schedule output
    clearSchedule: function() {
        $("#trainScheduleTable tbody").empty();
    },

    // Render train schedule output
    renderSchedule: function(newTrainObj) {
        var name = newTrainObj.name;
        var destination = newTrainObj.destination;
        var startTime = newTrainObj.startTime;
        var frequency = newTrainObj.frequency;
        var nextTrainObj = compute.nextTrain(startTime, frequency);
        var nextArrival = nextTrainObj.nextArrival;
        var minutesAway = nextTrainObj.minutesAway;
        var row = $('<tr>');
        var nameOut = $('<td>' + name + '</td>');
        var destinationOut = $('<td>' + destination + '</td>');
        var frequencyOut = $('<td>' + frequency + '</td>');
        var nextArrivalOut = $('<td>' + nextArrival + '</td>');
        var minutesAwayOut = $('<td>' + minutesAway + '</td>');
        row.append(nameOut);
        row.append(destinationOut);
        row.append(frequencyOut);
        row.append(nextArrivalOut);
        row.append(minutesAwayOut);
        $('#trainScheduleTable tbody').append(row);
    }

};

// Process data inputs when add train button is pressed
$("#addTrainBtn").on("click", function() {

    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var startTime = $("#startTimeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    compute.newTrain(name, destination, startTime, frequency);

    return false;

});

// Process database information on startup and whenever it changes
database.ref().on("value", function(snapshot) {

    render.clearSchedule();
    snapshot.forEach(function(childSnapshot) {
        var newTrain = {
            name: childSnapshot.val().name,
            destination: childSnapshot.val().destination,
            startTime: childSnapshot.val().startTime,
            frequency: childSnapshot.val().frequency
        };

        render.renderSchedule(newTrain);

    });

});
