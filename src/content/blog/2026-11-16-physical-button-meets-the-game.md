---
title: "physical button meets the game"
description: "Actually implementing the button into the game flow, and making the esp logic optional via server settings."
category: DEVELOPMENT
author: Keanu
date: 2026-11-16T19:02:03.651Z
---

Last week, my ESP32 could finally send "pressed" to our server. But a button press that only shows up in a terminal isn't a game yet. This week, I connected the button to the actual game flow, and made it possible to play more than one round in a row.

## What the button has to do

With a physical button, the player shouldn't need to touch "Klaar" on the iPad. But the ESP32 only says one thing: "pressed". It doesn't know the player's age, and the iPad doesn't know the button was pressed.

So I let the server decide what a press means, depending on where the game is:

| Game state | First press | Player 1 presses again |
|---|---|---|
| Lobby | join the round | start the video |
| Video | – | start the game |
| Anything else | ignored | ignored |

Three things made it work:

1. **The age is sent before the press.** As soon as a player taps an age on the iPad, the booth sends it to the server. When the button is pressed, the server already knows it. A press without an age is simply ignored.

2. **The server tells the iPad what happened.** After a press, the server confirms "you joined" to that booth, and the iPad moves on. Before, the iPad switched by itself when you tapped Klaar. Now it only moves on when the server says so, also for the Klaar button. That fits our rule: the server decides everything.

3. **One function per action.** Joining the round and starting the game each have one function on the server, `addPlayer()` and `startGame()`. The physical button and the iPad button both call the same function, so they can never behave differently.

A setting on the server, `espUsed`, switches between the physical button and the iPad buttons. The booths get that setting every time they connect, so we can test both ways.

## Resetting a round

At the fair, families play one after another. That means everything from the previous round has to disappear. That turned out to touch every part of the project:

- **The server** resets the dragon's health, the players and the stored ages.
- **Every booth** forgets who was player 1, whether it joined, its QR code, its feedback and its riddle.
- **The big screen** fills the HP bar again, clears the timer, and swaps the wizards in the 3D scene for the new players. It used to build the wizards only once, for the first round, and keep them forever.

## What went wrong

- **A missing variable:** the server used `age` in the button handler, but it didn't exist there. The first press in the lobby would have crashed the whole server.
- **An inverted check:** I wrote `===` where I meant `!==`, so the button only worked when the game was *not* in the lobby.
- **A reset that didn't reset:** the booth only forgot that it had joined when the state became WAITING, but the reset goes straight to LOBBY. Every booth would have skipped the age screen in the next round.
- **A one-second delay** between pressing and the iPad responding. Part of it was the ESP32 saving power on its Wi-Fi; `WiFi.setSleep(false)` helped. The rest is probably my phone hotspot, which we won't use at the fair.

## Working with AI

I used Claude Code as a reviewer and for the bigger connecting pieces. I wrote the server settings and the first version of the button handler. Then I asked it what I'd missed, and that's where it found the missing `age` variable and the inverted check before I ever pressed the button. This project has a lot of different places where I have to code so from time to time I forget the ways I structured data, and how it was passed. That is where Claude comes in very handy.

I also learned to be careful with my instructions. When I said "the server needs to be done still", it started writing code I hadn't asked for. I stopped it, and now it explains first and only writes when I say so.

## What I learned

- **With a physical button, the server has to tell the iPad what happened.** The iPad can't know by itself.

- **One function per action** keeps two ways of doing the same thing in sync.

- **Check first, then act:** most of my bugs were checks that were missing, inverted, or in the wrong place.
