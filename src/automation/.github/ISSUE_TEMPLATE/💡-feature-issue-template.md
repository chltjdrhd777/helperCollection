---
name: "\U0001F4A1 Feature issue template"
about: A template to start specific feature issue
title: "\U0001F4A1 ${{issue title placeholder}}"
labels: feature
assignees: ''

---

## Summary

Removes every API from react-dom/test-utils except act in favor of using @testing-library/react. Removal is gated behind disableDOMTestUtils that's off for Meta builds.

The functions aren't removed but instead throw with a helpful error message. We're doing the same for ReactDOM.render.

## How did you test this change?

- `yarn test ReactTestUtils-test`
