---
title: "QUEUEQUESTIONS"
description: "build the quequestions logic for people waiting in the line"
category: DEVELOPMENT
author: Keanu
date: 2026-11-15T15:12:51.935Z
---

# Warming up while you wait: the queue questions

At a book fair, the best part of our installation is also the hardest part: there are only four podiums. When a family walks up and every booth is taken, they have to wait. A wait of a few minutes in a busy hall is where people give up and walk on.

So we gave the waiting a job. While a family queues, they can scan a code, open a small page on their own phone and play a few warm-up questions. Nothing about the main game changes. They just arrive at the podium already a little bit warmed up for the dragon.

## What the family sees

The page has three screens, and each one asks for one thing.

1. **Welcome.** One big card: "Welkom in de Boektovenaarschool!" and a short line that says the questions give you a head start in the fight. The whole card is a single button, so there is nothing else to tap.
2. **Warm-up questions.** One question at a time, with large answer rows that are easy to hit with a thumb. A counter ("Opwarmvraag 1 van 3") shows how far you are. You choose an answer, tap "Onthul antwoord", and see whether you were right. The right answer turns green and a wrong choice turns red. Then you can carry on with "Nog eentje?" or stop with "Klaar voor het gevecht!".
3. **The result.** You see how many you got right and earn a badge: a newcomer, beginner, apprentice or master badge, with a medal in a matching colour. The last line sends the family back to the real world: if it is your turn, find a free podium and press the red button.

Everything the family reads is in Dutch, and nobody has to type anything.

## How it works under the hood

The three screens live in one parent component, which keeps a small piece of shared state: which screen is showing, the score, the round, and the total number of questions. The screens do not talk to each other directly. Each screen sends a small "update" message up to the parent, and the parent changes the state and decides which screen comes next. That is the usual "props down, events up" pattern in Vue, and it kept the three screens simple: the welcome screen only moves forward, the question screen only reports a point and the end, and the result screen only reads the score.

The page has its own address (`/questions`), so a QR code can open it directly.

## Where it stands

This is a working first version. The questions are placeholders for now, only three of them, and still in English. The real ones will be Dutch, about the same books and characters as the game, so that the warm-up is a preview of what is waiting at the podium. The badge colours and the pictures next to each question are also still to be designed.
