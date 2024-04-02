---
name: "⚠️ Bug issue template"
about: A template to start specific bug issue
title: "❗ ${{issue title placeholder}}"
labels: bug
assignees: ''

---

## Issue Description

This is a strange one that I honestly couldn't believe wasn't caused by our app, but it turns out I can reproduce it in a minimal fresh React app as well: if you have a <textarea> input and you select and delete any line other than the first, second, or last, you cannot type in that input anymore until you leave and refocus it. This is only reproducible in Safari.

React version: 18.2.0
Safari version: 17.3
MacOS version: Sonoma 14.3

## Steps To Reproduce

1. Render a <textarea> with four or more lines of initial content
2. Select a line other than the first, second, or last
3. Delete that line by pressing Delete
4. Attempt to keep typing

## The current behavior

Upon deleting the line, the line cannot be typed into anymore. Moving the caret to another line allows typing, but moving it back to the deleted line does not. Sometimes an errant character appears in the deleted line. Blurring (moving focus away from) the input and refocusing it makes the whole input interactive again, but does not restore lost input.

## The expected behavior

The input should remain full interactive as normal.

## More details
