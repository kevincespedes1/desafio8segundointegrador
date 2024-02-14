import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null)

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true },
    age: { type: Number },
    gender: { type: String },
    password: { type: String },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }, 
    rol: { type: String, default: 'usuario' } 
});

schema.plugin(mongoosePaginate)

export default mongoose.model(collection, schema)
