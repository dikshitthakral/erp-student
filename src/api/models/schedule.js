const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    time: {
      type: String,
      required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Subject',
    },
    teacher: {
        // type: mongoose.Schema.Types.ObjectId, ref: 'Teacher',
        type: String, required: true
    }
}, { autoIndex: false, autoCreate: false });

new mongoose.model("Activity", activitySchema);

const dayScheduleSchema = new mongoose.Schema({
    day: {
        type: String, required: true
    },
    activity: [activitySchema],
}, { autoIndex: false, autoCreate: false });

new mongoose.model("DaySchedule", dayScheduleSchema);

const scheduleSchema = new mongoose.Schema({
    days: {
        type: [dayScheduleSchema],
        required: true,
    },
    type: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    academic: {type: mongoose.Schema.Types.ObjectId, ref: 'Academic'},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}
});

const schedule = new mongoose.model("Schedule", scheduleSchema);
module.exports = schedule;