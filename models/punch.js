const mongoose = require('mongoose');

const punchSchema = new mongoose.Schema({
  username: {type: String, default: 'JJ'},
  clientInfo: String,
  jobInfo: String,
  clockIn: Date,
  clockOut: Date,
  earnedHours: Number,
  updates: {type: Array}
});


module.exports = mongoose.model('Punch', punchSchema);
