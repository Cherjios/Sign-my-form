// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  //This functions help us to create the table User and set the columns for the table user
  var User = sequelize.define("User", {
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len:[1]
      }
    },
    
    // The email cannot be null, and must be a proper email before creation
    email: {  //Givin the parameters for email
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: { //Givin the parameters for password
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len:[1]
      }
    }
  });

  User.associate = function (models) {
    User.hasOne(models.PersonalInfo, {
        onDelete: "cascade"
    });
};
  

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
