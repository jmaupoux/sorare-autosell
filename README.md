# Sorare auto sell
Automatically resell your cards (football & baseball) when expired on the market.

Sell again at previous price.

Sell every 15 minutes

> Because bots are unfair, I open source this one

# Setup
- git clone
- npm install
- create a file named config.json 
```javascript
    {
      "credentials": {
        "mySlug": "your_nickname_slug",
        "email": "your_mail",
        "passhash": "your_passhash",
        "starkwareKey": "your_starwarekey"
      }
    }
```

Passhash generation and starwarekey are are described in [sorare api official repository](https://github.com/sorare/api/)

Your slug is your nickname "normalized". You can find it on soraredata main manager page url.

Your mail is... your mail

- run
    npm start <config-file-path>


# More info

Contact me for support