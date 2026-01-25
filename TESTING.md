# Testing & Verification Guide

## Extension Verification Checklist

### Installation Verification
- [ ] Extension loads without errors in Chrome
- [ ] Extension icon appears in Chrome toolbar
- [ ] No errors in Chrome DevTools console
- [ ] Extension shows as active in `chrome://extensions/`

### Feature 1: Copy PR Link Button
**Test Scenarios:**

1. **Regular PR (Open)**
   - Navigate to: Any open GitHub pull request
   - Expected: "Copy PR Link" button appears next to PR title
   - Action: Click the button
   - Expected: 
     - Text copied to clipboard in format: `{PR Title}: {PR URL}`
     - Button shows "Copied!" with green checkmark
     - Button returns to normal state after 2 seconds

2. **Draft PR**
   - Navigate to: Any draft GitHub pull request
   - Expected: Same behavior as regular PR for Feature 1

3. **Closed/Merged PR**
   - Navigate to: A closed or merged pull request
   - Expected: Same behavior - button should still work

### Feature 2: Request Copilot Review Button
**Test Scenarios:**

1. **Draft PR with Copilot Available**
   - Navigate to: A draft pull request where Copilot is available
   - Expected: "Request Review" button appears next to Copilot reviewer link
   - Action: Click the button
   - Expected:
     - Attempts to open reviewer selection UI
     - Button shows "Requested!" with green checkmark
     - Button returns to normal state after 2 seconds

2. **Non-Draft PR**
   - Navigate to: An open (non-draft) pull request
   - Expected: "Request Review" button does NOT appear
   - Reason: Feature only activates on draft PRs

3. **Draft PR without Copilot**
   - Navigate to: A draft PR where Copilot is not listed as a reviewer option
   - Expected: Button does not appear (no Copilot link to attach to)

### Cross-Browser Testing
- [ ] Chrome (primary target)
- [ ] Microsoft Edge (Chromium-based)
- [ ] Brave (Chromium-based)

### Edge Cases
- [ ] Button positioning is correct and doesn't break layout
- [ ] Buttons don't duplicate on dynamic page updates
- [ ] Extension works with GitHub's dark and light themes
- [ ] Extension works on private repositories
- [ ] Extension works on organization repositories
- [ ] Copy function works correctly with special characters in PR title
- [ ] Extension doesn't interfere with other GitHub functionality

## Manual Test Results

### Test Environment
- Browser: _____________
- Browser Version: _____________
- Date Tested: _____________
- Tester: _____________

### Feature 1 Results
| Test Case | Status | Notes |
|-----------|--------|-------|
| Button appears | ⬜ Pass / ⬜ Fail | |
| Copy to clipboard works | ⬜ Pass / ⬜ Fail | |
| Format is correct | ⬜ Pass / ⬜ Fail | |
| Visual feedback works | ⬜ Pass / ⬜ Fail | |

### Feature 2 Results
| Test Case | Status | Notes |
|-----------|--------|-------|
| Button appears on draft PR | ⬜ Pass / ⬜ Fail | |
| Button hidden on non-draft PR | ⬜ Pass / ⬜ Fail | |
| Click action works | ⬜ Pass / ⬜ Fail | |
| Visual feedback works | ⬜ Pass / ⬜ Fail | |

## Troubleshooting

### Extension not loading
1. Check that Developer mode is enabled in `chrome://extensions/`
2. Verify all files (manifest.json, content.js, icons) are present
3. Check for errors in the Extensions page
4. Try removing and re-adding the extension

### Buttons not appearing
1. Open DevTools console (F12) and check for JavaScript errors
2. Verify you're on a GitHub pull request page (URL: github.com/*/*/pull/*)
3. Refresh the page
4. Check if GitHub has changed their DOM structure (selectors might need updating)

### Copy to clipboard not working
1. Check browser permissions for clipboard access
2. Try on a different GitHub PR page
3. Check DevTools console for errors
4. Ensure the page is loaded over HTTPS

### Request Review button not working
1. Verify the PR is actually in draft status
2. Check that Copilot reviewer is available on the repository
3. Check DevTools console for errors
4. May need to manually adjust based on GitHub's current UI structure

## Debugging Tips

### View Extension Console Logs
1. Go to `chrome://extensions/`
2. Find "GitHub UI Mods"
3. Click "Inspect views: background page" or inspect the content script from DevTools

### Inspect Content Script
1. Open any GitHub PR page
2. Open DevTools (F12)
3. Go to Console tab
4. Look for messages from the extension
5. Use Sources tab to set breakpoints in content.js

### Test on Local HTML
1. Open `test.html` in your browser
2. Verify buttons appear on the simulated GitHub page
3. This tests the extension logic without needing actual GitHub access

## Known Limitations

1. **Request Review functionality**: This feature attempts to automate clicking through GitHub's UI. If GitHub changes their DOM structure, this may break and require updates to the selectors in content.js.

2. **Dynamic content**: GitHub uses dynamic content loading. The extension uses MutationObserver to handle this, but there may be edge cases where buttons don't appear immediately.

3. **Permissions**: The extension only has access to GitHub pull request pages (for security and performance).

## Reporting Issues

If you encounter issues:
1. Check the Troubleshooting section above
2. Document the issue with:
   - Browser and version
   - GitHub page URL (without sensitive info)
   - Steps to reproduce
   - Console errors (if any)
   - Screenshots (if applicable)
