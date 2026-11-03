---
title: "Building the setup and lobby for Wizards vs. the Dragon"
description: "Video setup and after"
category: DEVELOPMENT
author: Keanu
date: 2026-11-03T15:43:46.441Z
---

Today we turned an empty repo into the start of a working game flow. Families can now connect their booths, choose an age, watch an intro, and start the game together.

Three apps, one server
The game has three parts:

Server: Express and Socket.io, running on the laptop.
Booth: a Vue app running on each iPad.
Screen: a three.js app shown on the big screen.
We set up the booth and screen with Vite, which gives us hot reload during development and a plain build for the fair. A small VS Code task starts all three with one shortcut.

The most important decision was to make the server the single source of truth. Our first version came from an older project that used peer-to-peer connections, where the server only introduced the devices. We removed that, so every message now passes through the server, and the server decides what happens next.

Booths that survive a refresh
Each iPad gets a booth number from the server and saves it in localStorage. If the Wi-Fi drops or the page reloads, the iPad asks for its old number back. The screen shows how many booths are connected, and a setup page with a QR code helps the crew get every iPad online.

One state for everyone
We use a single gameState that moves through the steps: waiting, lobby, video and game. The screen and the iPads never decide their own page. They only show what the server sends, which fixed a bug where a refreshed screen fell out of sync with the iPads.

Player 1
The first player to press Klaar becomes player 1, and only they can start the intro and the game. The server checks who sent each request, so a stale button on an iPad can't start the game by accident. When a player is ready, their wizard card lights up on the big screen, in the same left-to-right order as the booths.

Intro and explanation
The intro video plays on each iPad as an overlay. When it ends, it fades away to reveal a short explanation built from our own storyboard drawings: guess the character, cast your spell, and watch the dragon take damage.

Lessons learned
Safari has strict video rules: videos with sound need a tap first, so for now the intro plays muted.
Check which build you're looking at: we spent too long on a black screen that was just an old build on the wrong port.
Derive, don't store: values an iPad remembers on its own go stale. Asking the server again on every reconnect fixed our "two player 1's" bug.

How we used AI
We wrote most of the game logic ourselves: the booth numbers, the shared game state, player 1, and the age and video components. We used Claude Code as a helper alongside that:

Learning Vue: it explained new concepts, like defineEmits, computed and scoped styles, by comparing them to React, which we already knew.
Reviewing our code: it caught bugs, like a missing import that crashed the server and a stale player 1 flag.
Extending what we built: once we had a pattern, it applied the same approach to similar parts, like the screen's setup page and the explanation cards.
Every chunk where AI wrote code is logged in our dev diary, with the prompts we used and why.
