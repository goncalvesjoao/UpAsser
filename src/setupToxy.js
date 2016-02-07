const toxy = require('toxy');
const proxy = toxy();
const rules = proxy.rules;
const poisons = proxy.poisons;

function setup(expressPort, config) {
  proxy.forward('http://localhost:' + expressPort);

  proxy
    .post('/upload')
    .poison(poisons.bandwidth({ bps: 102400, threshold: 500 }))
    .poison(poisons.throttle({ chunk: 102400, threshold: 500 }))
    .poison(poisons.slowRead({ chunk: 102400, threshold: 500 }))

    // .withRule(rules.probability(90))
    // .poison(poisons.latency({ jitter: 1000 }))
    // .poison(poisons.slowOpen({ delay: 500 }))

  proxy
    .get('/upload_progress')
    .poison(poisons.slowRead({ chunk: 8, threshold: 500 }))
    .poison(poisons.bandwidth({ bps: 8, threshold: 500 }))
    .poison(poisons.throttle({ chunk: 8, threshold: 500 }))
    .withRule(rules.probability(95))

  proxy.get('/');

  proxy.listen(config.port);

  console.log(`Up and kicking ass on port ${ config.port }`);
}

module.exports = setup;
