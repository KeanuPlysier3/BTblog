---
title: "# Taking the books home: a QR code and a website"
description: "When a family beats the dragon (or runs out of time), the game is over. But the point of Boektopia is that kids go home and actually read. So at the end of a round, every booth now shows a QR code. A parent scans it and gets a page with every book their kids met during the game."
category: DEVELOPMENT
author: Keanu
date: 2026-11-11T12:19:36.008Z
---

When a family beats the dragon (or runs out of time), the game is over. But the point of Boektopia is that kids go home and actually read. So at the end of a round, every booth now shows a QR code. A parent scans it and gets a page with every book their kids met during the game.

## The problem: the phone can't reach our laptop

The game runs on our own router, without internet. The parent's phone uses mobile data, so it can't reach our laptop. The website has to live online, and it can't ask our server anything. Everything it needs has to be in the link itself.

So the server collects each player's right and wrong answers at the end of a round and sends them to the booth. The booth turns them into a link like this:

`?c2=12,45,78&w2=3,9`

Booth 2 got riddles 12, 45 and 78 right, and 3 and 9 wrong. I put the booth number in the key on purpose. Every booth belongs to its own wizard character on the big screen, so the website can show "this was your wizard, these are your books".

## A separate website

The website is its own small Vue project, because it will be hosted separately from the game. That also meant it needed its own copy of the book data. The hosting service won't have our shared folder. I added a small script that copies only the title, author and character from our riddle file. That keeps the website light, and nobody can look up the answers to the riddles on it.

On the website, every player gets two lists: "Geredde boeken" and "Nog te redden". Each book is a card that will link to a detail page later on.

## Working with AI on this

I used Claude Code for this part. It set up the empty website project, reviewed my code, and did most of the styling. I wrote the data flow myself: what the server sends, how the link is built, and how the website reads it back.

The reviews were the most useful part. The AI found an event I forgot to define, which would have crashed the server at the end of every round. It also noticed that my QR data kept growing every round, so a new family would have gotten the previous family's books.

The styling was a different story. The first version looked like every other AI-generated page: emojis, small grey uppercase labels, cards with coloured borders. When I asked for something "less AI-ish", it went for a light, bookish design that didn't match our dark game at all. It also made the book cards so subtle they no longer looked tappable. It took a few rounds of telling it what our project actually looks like before it fit. That's my main lesson from this branch: AI gives you a reasonable default, but it doesn't know your style unless you keep showing it.

## What I learned

- **A link can carry larger amounts of data:** `URLSearchParams` Thn I expected
- **Every screen needs exactly one `h1`:** I fixed that across the booth, which started every screen at `h2`.

Next up: a detail page for every book, and real covers instead of the placeholder letters.
