import { Schema, model } from "mongoose";

// Define a schema for the sequence generator collection
const sequenceSchema = new Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 }
});

// Create a model for the sequence generator collection
const Sequence = model('Sequence', sequenceSchema);

const shopSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isActive: { type: String, default: false },
    address: { type: String },
    phone: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    query: { type: Array, default: [] },
    pincode: { type: String },
    uuid: { type: Number, unique: true },
  },
  { timestamps: true }
);

// Pre-save hook to generate auto-incrementing uuid
shopSchema.pre('save', async function(next) {
  try {
      if (!this.uuid) {
          let sequenceValue;
          const sequence = await Sequence.findByIdAndUpdate(
              { _id: 'shop_uuid_sequence' },
              { $inc: { sequence_value: 1 } },
              { new: true, upsert: true }
          );
          sequenceValue = sequence.sequence_value;
          const existingShop = await Shop.findOne({ uuid: sequenceValue });
          if (existingShop) {
              sequence.sequence_value++;
              await sequence.save();
              sequenceValue = sequence.sequence_value;
          }
          this.uuid = sequenceValue;
      }
      next();
  } catch (err) {
    console.log("err: ", err);
  }
});

const Shop = model("Shop", shopSchema);
export default Shop;
