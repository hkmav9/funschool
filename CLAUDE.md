# FunSchool

Static PWA (plain HTML/JS/CSS, no build step) hosted on Firebase Hosting at https://funschool-app.web.app.

## Deploying

When the user says "deploy":

- **On the user's Mac (local session):** run `./deploy.sh "commit message"`. It bumps the service worker cache, commits, pushes to `main`, and runs `firebase deploy`.
- **In a cloud/mobile session (no Firebase login):** do NOT run `deploy.sh` or `firebase`. Commit the changes and push to `main`. The GitHub Action in `.github/workflows/deploy.yml` deploys to Firebase automatically and bumps the service worker cache itself. Then tell the user to check the Actions tab for the run result.

Never commit key files (`*.pem`, `id_*`, `rmkey`): Firebase publishes the whole project folder.

## Layout

- Each activity is a module file (`math.js`, `states.js`, `story.js`, ...) that calls `registerModule({... category ...})`; the home screen groups modules into subject tiles by `category` (see `app.js`).
- New modules need a `<script>` tag in `index.html` and an entry in the `FILES` list in `sw.js`.
- Target device is iPad Air 11" in landscape; layout rules are at the end of `styles.css`.
