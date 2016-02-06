const toxy = require('toxy');
const proxy = toxy();
const rules = proxy.rules;
const poisons = proxy.poisons;

function setup(expressPort, config) {
  proxy.forward('http://localhost:' + expressPort);

  proxy
    .post('/upload')
    .poison(poisons.slowRead({ chunk: 102400, threshold: 500 }))

    // .withRule(rules.probability(90))
    // .poison(poisons.latency({ jitter: 1000 }))
    // .poison(poisons.bandwidth({ bps: 256, threshold: 2000 }))
    // .poison(poisons.throttle({ chunk: 256, threshold: 2000 }))
    // .poison(poisons.slowOpen({ delay: 500 }))

  proxy.get('/');

  proxy.listen(config.port);

  console.log(`Up and kicking ass on port ${ config.port }`);
}

module.exports = setup;
