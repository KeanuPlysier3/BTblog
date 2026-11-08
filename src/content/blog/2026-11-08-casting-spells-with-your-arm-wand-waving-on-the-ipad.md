---
title: "# Casting spells with your arm: wand waving on the iPad"
description: "The motion detection on Ipad"
category: DEVELOPMENT
author: Keanu
date: 2026-11-08T09:32:42.961Z
---

Until now, players confirmed their answer with a button. That works, but it doesn't feel like magic. On this branch, I made players **cast the spell themselves**: pick an answer, raise your arm, and swing it forward like a wand.

## Reusing what I already had

For an earlier project, heatCheck, I'd already built arm detection for a basketball game, using MoveNet in TensorFlow.js. MoveNet finds 17 points on your body, like your shoulders, elbows and wrists, in every camera frame. My heatCheck code was plain JavaScript, so I could import it straight into the Vue booth app without rewriting it. I renamed everything from shots to spells, and removed the parts the booth didn't need, like the debug readout.

Two things had to change for the fair:
- **No internet:** the model normally downloads from Google when the page loads. I saved the model files in the project, so the laptop serves them.
- **Safari needs HTTPS for the camera,** so the booth's development server now runs over HTTPS too.

## Designing the gesture

The basketball version looked for "elbow bent, then arm up". A spell is different, and I wanted it to feel like Harry Potter:

1. **Ready:** your hand is above your shoulder, with your elbow bent to 90° or less.
2. **Swing:** you swing your arm forward and down, quickly.
3. **Cast:** the spell fires, and your answer is confirmed.

There was one catch. A camera only sees in 2D, so an arm pointing straight at it looks short, and its elbow angle becomes unreliable. So instead of only checking the angle, I detect the **movement**: the hand has to drop a clear distance since the ready pose, measured in upper-arm lengths, so it works whether you stand close or far away. All the thresholds live in one settings object, so I can tune them by feel.

When an answer is selected, a camera overlay opens on top of the riddle, with your arms drawn over the video. The arm turns yellow when you're ready, and green when the spell is cast, so you can see the gesture being recognised.

## The upside-down problem

This took far longer than it should have. On the iPad, the camera image looked fine, but the dots MoveNet drew were upside down, flickered a lot, and had low confidence.

I tried a lot of things with AI's help: turning the frames 180°, flipping them vertically, an automatic check that compared both orientations, and turning the drawing with CSS. Some seemed to work for a while, then didn't. None of them actually held up.

In the end, I asked the AI to stop guessing and search online. Within minutes it found the real cause: **a known Safari bug.** When a video is sent straight to the GPU, which TensorFlow.js does to run MoveNet, iOS Safari can upload it upside down. The fix was one line of logic: copy each camera frame onto a normal canvas first, and give MoveNet the canvas instead of the video. A canvas doesn't go through the buggy path, so MoveNet now always sees people upright. Then I removed every earlier attempt again.

## What I learned

- **Find the cause, don't keep adjusting settings.** When a fix only works sometimes, it's not the fix. One search found what hours of guessing didn't.
- **Look for existing bugs on your platform.** I assumed my code was wrong, but the problem was in Safari itself.
- **Clean up after debugging.** Each failed attempt left code behind, and removing it afterwards kept the final version small and understandable.

## How I used AI

I designed the gesture and decided how it should work, and I wrote the riddle and answer flow it plugs into. I used Claude Code to port and adapt my heatCheck code, write the swing detection from my description, download the model, style the camera overlay, and review my code. It also caused the time lost on the camera bug, by guessing at fixes instead of looking it up. Telling it to search is what finally solved it.

## Next up

Tuning the swing on the real booth iPads, the 3-minute timer, resetting the dragon between rounds, and the book list behind the QR code.
