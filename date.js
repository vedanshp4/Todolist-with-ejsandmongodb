




exports.getDate =function (){
    let today = new Date();
 let day = "";
  
 let options = { day: 'numeric' ,  month: 'long' , weekday: 'long' };
  day = today.toLocaleDateString("en-US", options);

  return day;

};


module.exports.getDay = getDay;

function getDay(){
  let today = new Date();
let day = "";

let options = { weekday: 'long' };
day = today.toLocaleDateString("en-US", options);

return day;

};

