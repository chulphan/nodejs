module.exports.sum = (a, b) => {
  return a+b;
};

module.exports.avg = (a, b) => {
  return (a+b)/2;
};

module.exports.mul = (a, b) => {
  return a * b;
};

module.exports.div = (a, b) => {
  if (b === 0){
    return "error!!";
  }else{
    return a/b;
  }
}
