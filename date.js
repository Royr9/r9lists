//  we dont have to say module.exports we can use just:  exports.getDate
module.exports.getDate = function(){
  const options = {
    weekday: "long",
    month: "long",
    day : "numeric"
  };
  const today = new Date();
  return today.toLocaleDateString("en-us", options);
}

module.exports.getDay = function(){
  const options = {
    weekday: "long"
  };
  const today = new Date();
  return  today.toLocaleDateString("en-us", options);
}


//  a way of getting date without a module: 
// let dayInNumber = today.getDay()
// let dayArray = ["sunday", "monday" , "tuesday", "wendsday", "thurday", "friday" , "saturday"];
// let day = dayArray[dayInNumber];