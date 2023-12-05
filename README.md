A simple Safari extension that redirects YouTube's video pages to an Invidious instance. Only video pages (e.g., www.youtube.com/watch?v=<video_id>) are redirected, allowing normal YouTube browsing until you start watching a video.

Features:

- Choose Your Invidious Instance: Select your preferred Invidious instance, whether it's self-hosted or a public instance. Many public instances can be find here https://docs.invidious.io/instances/.
- Automatic Redirection (Default): Video pages are automatically redirected to Invidious.
- Manual Redirection Control: Toggle automatic redirection on/off in the extension popup. When off, manually redirect any YouTube video to Invidious by clicking "Redirect."

How to build:
- Create XCode's Safari Web Extension project
- Clone this project and `pnpm i`
- Build the project using `pnpm build`
- Link all the resources from `dist/` folder to the XCode project
- In XCode's Product menu, click Run
