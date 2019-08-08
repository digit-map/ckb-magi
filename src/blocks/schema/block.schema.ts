import * as mongoose from 'mongoose';

export const BlockSchema = new mongoose.Schema({
  hash: String,
  number: String,
  difficulty: String,
  timestamp: String,
  parentHash: String,
});
