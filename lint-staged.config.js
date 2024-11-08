module.exports = {
  '{packages,tools}/**/*.{ts, js, json, md, html, css,scss}': [
    'nx affected:lint --uncommited --fix true --base=origin/master --head=HEAD',
    'nx affected:test --base=origin/master --head=HEAD',
  ],
};
