const mongoose = require('mongoose');

const withTransaction = async func => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    await func(session);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = withTransaction;
