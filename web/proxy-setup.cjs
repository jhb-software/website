// Preload script to configure Node.js fetch to use HTTP proxy
// Required in environments where HTTP_PROXY is set but Node.js fetch (undici) doesn't respect it
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
if (proxy) {
  try {
    const { setGlobalDispatcher, ProxyAgent } = require('undici');
    setGlobalDispatcher(new ProxyAgent(proxy));
  } catch (e) {
    // undici not available, skip proxy setup
  }
}
