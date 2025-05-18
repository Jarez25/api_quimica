import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({}, { collection: 'element', strict: false });
const Element = mongoose.model('Element', elementSchema);

export default Element;
