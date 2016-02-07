# Upload your Assets

small POC to test assets uploads under bad network conditions

---

# Getting started
```
$> git clone git@github.com:goncalvesjoao/up-your-ass-ets.git
$> cd up-your-ass-ets
$> npm install
$> npm start
```

---

# Usage
```
$> npm start
or
$> npm run debug
```
Go to http://localhost:3000 and use the *form* to submit the *./dummy_data/* files and watch the server receive chunks of data due to **toxy**'s restrictions.

---

# Notes
How to create dummy files:
```
$> dd if=/dev/urandom bs=1024 count=<multiplying number> of=<name of file>
```
