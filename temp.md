### Live Link
[Keyboard-Typing](http://keyboard-typing.com)

## Summary

This is a mono-repo for a simple web-application that allows users to record typing speeds against multiple game-modes and time restraints. The idea for this site came from regularly using similar applications (main inspiration coming from [monkeytype](https://monkeytype.com/)), and a love for rebuilding websites in a more custom, "me"-focused way. Having recreated the main features I enjoy from a collection of similar websites, this app functions to accomplish four simple goals:

1) Practice typing against simple, fun game-modes
2) Record your scores
3) Compare high-scores to others and yourself on a global leaderboard
4) Observe past scores to watch for improvement

This site was built with a React front-end (create-react-app), and utilizes a [Ruby-on-Rails RESTful API](https://github.com/konstantinstanmeyer/keyboard2) to store and fetch data from a PostgreSQL database. It is using two APIs to fetch external words/sentences: [Paper Quotes](https://paperquotes.com/), implemented to fetch punctuated and complex sentences, supporting mulitple languages as well, and [Bacon Ipsum](https://baconipsum.com/json-api/), a comedic API to fetch punctuated, difficult sentences with irregular, "pork-related" terms. User images are additionally being stored using ActiveStorage within Rails 7, saving to a Google Cloud virtual machines's local storage.

## Future Goals

1) Implement more game-modes. APIs seem to be the bottleneck with this, having used the two APIs I saw being best-fit already. This is definitely something I'll to come back to, hopefully after having found a better resource for words, or potentially after building my own API with a rich database of sentences and words.
2) Adding an automation for Github deployments. Although SSHing from my local machine into the deployed Google Cloud instance is not too time-involving, setting up [PM2](https://pm2.keymetrics.io/) to handle these actions would be extremely helpful for larger-scale production deployments, avoiding downtime and separate team members requiring to SSH.
3) Test game logic. Although the site functions and handles user input correctly, issues with input lag and css responses slowed the original development process greatly. For example, grabbing important character values (which typed values are correct, which is the current character, etc.) and general event listeners could be reworked into JQuery for more optimal code.
