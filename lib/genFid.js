const genFid = function* () {
  let id = 0;

  while (true) {
    const randNum = Math.round(Math.random() * 10000);
    yield `${id}${randNum}`;
    id += 1;
  }
};

module.exports = genFid;
