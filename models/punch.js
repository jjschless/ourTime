const mongoose = require('mongoose');

const punchSchema = new mongoose.Schema({
  username: {type: String, default: 'JJ'},
  clientInfo: String,
  jobInfo: String,
  clock: Date,
  daySlot: Number,
  flag: String,
  pair: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Punch'
  }
});


module.exports = mongoose.model('Punch', punchSchema);
