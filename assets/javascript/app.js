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

    newTrain: function(name, destination, time, frequency) {
        var newTrain = {
            name: name,
            destination: destination,
            time: time,
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
        $("#timeInput").val("");
        $("#frequencyInput").val("");
    },

    clearSchedule: function() {
        $("#trainScheduleTable tbody").empty();
    },

    renderSchedule: function(newTrain) {
        var row = $('<tr>');
        for ( var key in newTrain) {
            var data = $('<td>');
            data.html(newTrain[key]);
            row.append(data);
        }
        $('#trainScheduleTable tbody').append(row);
    }

};

$("#addTrainBtn").on("click", function() {

    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var time = $("#timeInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    compute.newTrain(name, destination, time, frequency);

    return false;


});

database.ref().on("value", function(snapshot) {

    render.clearSchedule();
    snapshot.forEach(function(childSnapshot) {
        var newTrain = {
            name: childSnapshot.val().name,
            destination: childSnapshot.val().destination,
            time: childSnapshot.val().time,
            frequency: childSnapshot.val().frequency,
            nextArrival: "",
            minutesAwway: ""
        };

        render.renderSchedule(newTrain);

    });

});





