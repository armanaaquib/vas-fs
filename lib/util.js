const genFid = () => {
  const rid1 = Date.now().toString(36).slice(0, 4);
  const rid2 = Math.random().toString(36).substr(2, 5);

  return rid1 + rid2;
};

const extractExt = (contentType) => {
  return contentType.split('/')[1];
};

module.exports = { genFid, extractExt };
