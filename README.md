# Welcome to Ai'titude

## What is Ai'titude

Ai'titude is an open source climbing coach app.

You know when you go to the climbing gym and have no idea what to train? Or ... you're super busy and need flexible training plans? Or even, you're like many of us and cannot really commit to a boring weekly training plan?

**Ai'titude is here for you :)**

## How it works

It's straigtforward to use.


First of all, visit the "About you" tab int the app and tell the app about your climbing history and your goals.

![About yourself](https://raw.githubusercontent.com/quintao/climbingcoach/refs/heads/main/assets/images/docs/intro.png)


You're all set! Next time you go training and need some inspiration, visit the "Training plan" tab. Just tell the app what you're up to today: a hard bouldering session, a chill lead climbing session, some hanging at home or even a few exercises to do at the hotel during a business trip!

![Creating a training plan](https://raw.githubusercontent.com/quintao/climbingcoach/refs/heads/main/assets/images/docs/training1.png)


If you're not happy with the proposed plan, you can make it easier or harder with the buttons :) once you're happy with the plan, just click "Let's do this". That's it.

![Fine-tuning a training plan](https://raw.githubusercontent.com/quintao/climbingcoach/refs/heads/main/assets/images/docs/training2.png)


Then go hit the climbs! You can see your current training in the "Training plan" tab.


![Current training plan](https://raw.githubusercontent.com/quintao/climbingcoach/refs/heads/main/assets/images/docs/current.png)


Once you finish the training, it is very important to give the app some feedback about how it went. It will help the app to personalize your next training session. Then click "Mark as completed".

You can see your training log in the "Training log" tab.


![Training logs](https://raw.githubusercontent.com/quintao/climbingcoach/refs/heads/main/assets/images/docs/logs.png)



## The technical stuff

You have to create a Gemini API key and add it here:
[add it here](https://github.com/quintao/climbingcoach/blob/2b24252f4c5b8a529febcdd25c1fce62e89200b6/app/services/llm/gemini.ts#L17).

Then just type 
```
yarn android
```

in your command line and the emulator should show up.


## Creating an APK or app bundle

I use NPX/expo to handle builds, so it's as easy as:

```
npx eas build -p android --profile production
```

to generate an app bundle that you can distribute.

To generate an APK that you can download and install on your own phone:

```
npx eas build -p android --profile preview

```
