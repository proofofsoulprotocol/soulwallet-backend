const mongoose = require('mongoose');

const recoveryRecordSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    index: true
  },
  wallet_address: {
    required: true,
    type: String,
    index: true
  }, 
  status: {
    require: true,
    type: String
  },
  new_key: {
    required: true,
    type: String 
  },
  request_id: {
    require: true,
    type: String
  },

  recovery_records: [{
    guardian_address: {
      require: true,
      type: String,
    },
    signature: {
      require: true,
      type: String
    }//,
    // request_id: {
    //   require: false,
    //   type: String
    // }
  }]
});

module.exports = mongoose.model('RecoveryRecord', recoveryRecordSchema);