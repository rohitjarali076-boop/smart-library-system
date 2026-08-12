const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['MEMBER', 'LIBRARIAN', 'ADMIN'],
      default: 'MEMBER'
    },
    memberId: {
      type: String,
      unique: true,
      required: true
    },
    department: {
      type: String,
      default: 'Computer Science'
    },
    maxAllowedBooks: {
      type: Number,
      default: 5
    }
  },
  { timestamps: true }
);

// Pre-save hook: Async hooks return promises natively
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);