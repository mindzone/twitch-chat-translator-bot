# Todo

## Logical

- [x] Add router for different screens
- [x] Add a storage system (probably localStorage combined with vueuse composables?)
- [ ] Localisation

## Features

- [x] Twitch Token
    - [x] Storing Twitch Token
    - [x] Validating Twitch Token
    - [x] Checking scopes on the Twitch Token
    - [x] Showing the name of the account based on the Twitch Token
- [ ] Bad words filter
    - [ ] Add bad words filter
    - [ ] Allow words to be added to the filter
    - [ ] Allow words to be removed from the filter
    - [ ] Store the words
- [ ] Welcome messages
    - [ ] Add a way to add one or more messages the bot should say when started
- [ ] Implement words that should not be translated
    - [ ] Keep `@mentions` intact
    - [ ] Allow words to be added
    - [ ] Allow words to be removed
    - [ ] Store the words
    - [ ] Add regex based so words like `MindZooooooooneeeeee` work too
- [ ] Languages to translate to
    - [ ] Allow target languages to be configured. e.g. `es` and `en`. This will translate `es` to `en` and everything
      else to `es`
    - [ ] Allow secondary translations so for example `de` gets translated to `es` and `en`
- [ ] Remove emotes from translations
    - [ ] Remove 7tv/bttv etc too
- [ ] Multiple translation apis
    - [ ] Google Translate Free
    - [ ] Google Translate using custom token
    - [ ] Deepl

## Other

- [ ] Docs
- [ ] Logo and artwork
- [ ] Github Readme/Contributing guide etc