# columns

Transfer cards/issues from a github project to another

For this to work, you need:
- a personnal access token with "repo" permissions (for private or org projects) or "public_repo" (for public projects)
- create a `token.json` file at the root, in the shape `{"token": "1234567890tokenabcdef"}`
- around the line 100 of index.html, set the "domain" you want to act on

## Dev

`npx serve`