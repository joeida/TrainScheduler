// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRGOPfsS3-aMRV-cyBAWcRSa2GJT9P4Kg",
    authDomain: "train-time-76452.firebaseapp.com",
    databaseURL: "https://train-time-76452.firebaseio.com",
    storageBucket: "train-time-76452.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

var compute = {

    newTrain: function(name, destination, startTime, frequency) {
        var newTrain = {
            name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency
        };
        db.pushTrain(newTrain);
        render.clearInput();

    }
};

var db = {

    pushTrain: function(newTrain) {
        database.ref().push(newTrain)
    }
};

var render = {

    clearInput: function() {
        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#startTimeInput").val("");
        $("#frequencyInput").val("");
    },

    clearSchedule: function() {
        $("#trainScheduleTable tbody").empty();
    },

    renderSchedule: function(newTrain) {
        var name = newTrain.name;
        var destination = newTrain.destination;
        var startTime = newTrain.startTime;
        var frequency = newTrain.frequency;
        
        var row = $('<tr>');
        var nameOut = $('<td>' + name + '</td>');
        var destinationOut = $('<td>' + destination + '</td>');
        var frequencyOut = $('<td>' + frequency + '</td>');
        row.append(nameOut);
        row.append(destinationOut);
        row.append(frequencyOut);
        $('#trainScheduleTable tbody').append(row);
    }

};

$("#addTrainBtn").on("click", function() {

    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var startTime = $("#startTimeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    compute.newTrain(name, destination, startTime, frequency);

    return false;


});

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





