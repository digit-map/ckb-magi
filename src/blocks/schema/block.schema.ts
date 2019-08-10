import * as mongoose from 'mongoose';

export const BlockSchema = new mongoose.Schema({
  hash: { type: String, unique: true },
  number: { type: Number, unique: true },
  difficulty: String,
  timestamp: String,
  parentHash: String,
});
