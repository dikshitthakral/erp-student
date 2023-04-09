const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    time: {
      type: String,
      required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Subject',
    },
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}
}, { autoIndex: false, autoCreate: false });

new mongoose.model("Activity", activitySchema);

const scheduleSchema = new mongoose.Schema({
    day: {
        type: String, required: true
    },
    activities: [activitySchema],
    type: {
        type: String,
        required: false,
    },
    academic: {type: mongoose.Schema.Types.ObjectId, ref: 'Academic'},
});

const schedule = new mongoose.model("Schedule", scheduleSchema);
module.exports = schedule;