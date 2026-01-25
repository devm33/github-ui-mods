// GitHub UI Mods - Content Script
// Adds custom buttons to GitHub PR pages

(function() {
  'use strict';

  // Feature 1: Add "Copy PR Link" button next to the copy branch button
  function addCopyPRLinkButton() {
    // Check if button already exists
    if (document.getElementById('copy-pr-link-btn')) {
      return true;
    }

    // Find the copy branch button (clipboard icon next to branch name)
    const copyBranchBtn = document.querySelector('.gh-header-meta clipboard-copy');
    if (!copyBranchBtn) {
      return false;
    }

    // Get PR title for copying
    const titleElement = document.querySelector('.js-issue-title');
    if (!titleElement) {
      return false;
    }

    // Create the button - match the style of the existing clipboard-copy button
    const button = document.createElement('button');
    button.id = 'copy-pr-link-btn';
    button.className = 'Button Button--iconOnly Button--secondary Button--small';
    button.type = 'button';
    button.title = 'Copy PR link';
    button.style.cssText = 'vertical-align: middle; margin-left: 4px;';
    button.innerHTML = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-link">
        <path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
      </svg>
    `;
    
    // Add click handler
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const prTitle = titleElement.textContent.trim();
      const prUrl = window.location.href;
      const textToCopy = `${prTitle}: ${prUrl}`;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        // Visual feedback - change to checkmark
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-check" style="color: #1a7f37;">
            <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
          </svg>
        `;
        setTimeout(() => {
          button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-link">
              <path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
            </svg>
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
    
    // Insert button after the copy branch button
    copyBranchBtn.after(button);
    return true;
  }

  // Feature 2: Add "Request Review" button next to Copilot reviewer for draft PRs
  function addCopilotReviewButton() {
    // Check if this is a draft PR
    const draftBadge = document.querySelector('.State[title="Status: Draft"]');
    if (!draftBadge) {
      // Not a draft PR, no need to add the button
      return false;
    }

    // Find the Copilot reviewer link
    const copilotLink = document.querySelector('a[href="/apps/copilot-pull-request-reviewer"]');
    if (!copilotLink) {
      return false;
    }

    // Check if button already exists
    if (document.getElementById('copilot-request-review-btn')) {
      return true;
    }

    // Create the button - icon only with play icon
    const button = document.createElement('button');
    button.id = 'copilot-request-review-btn';
    button.className = 'Button Button--iconOnly Button--secondary Button--small';
    button.type = 'button';
    button.style.cssText = 'margin-left: 4px; padding-right: 1px; position: relative; top: -4px;';
    button.title = 'Request Copilot review for draft PR';
    const playIcon = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="position: relative; left: 1px;">
        <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"></path>
      </svg>
    `;
    button.innerHTML = playIcon;
    
    // Add click handler
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Try to find the review request form/button
      // GitHub's UI typically has a button or action to request reviews
      // We'll try to find and click it programmatically
      
      // Try to find the "Reviewers" section and expand it if needed
      const reviewersSection = document.querySelector('.discussion-sidebar-item.js-discussion-sidebar-item');
      if (reviewersSection) {
        // Try multiple selector patterns for the request review button
        const requestReviewBtn = reviewersSection.querySelector('button[aria-label*="request"]') ||
                                 reviewersSection.querySelector('summary[aria-label*="request"]') ||
                                 reviewersSection.querySelector('.js-request-reviewers-button');
        
        if (requestReviewBtn) {
          requestReviewBtn.click();
          
          // Wait a bit for the modal/dropdown to appear
          setTimeout(() => {
            // Try to find and click on Copilot in the reviewer list
            const copilotReviewerOption = document.querySelector('[data-filterable-for*="copilot"]') ||
                                          document.querySelector('[data-targets*="copilot"]') ||
                                          document.querySelector('label[for*="copilot"]');
            if (copilotReviewerOption) {
              copilotReviewerOption.click();
            }
          }, 100);
          
          // Visual feedback - success
          button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="color: #1a7f37;">
              <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
          `;
          button.style.color = '#1a7f37';
          
          setTimeout(() => {
            button.innerHTML = playIcon;
            button.style.color = '';
          }, 2000);
        } else {
          // Fallback: provide feedback that manual action is needed
          button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="color: #db6d28;">
              <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
            </svg>
          `;
          button.style.color = '#db6d28';
          button.title = 'Could not find review request button. Please use the Reviewers section manually.';
          setTimeout(() => {
            button.innerHTML = playIcon;
            button.style.color = '';
            button.title = 'Request Copilot review for draft PR';
          }, 3000);
        }
      } else {
        // Could not find reviewers section
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="color: #db6d28;">
            <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
          </svg>
        `;
        button.style.color = '#db6d28';
        button.title = 'Could not find Reviewers section. Please request review manually.';
        setTimeout(() => {
          button.innerHTML = playIcon;
          button.style.color = '';
          button.title = 'Request Copilot review for draft PR';
        }, 3000);
      }
    });
    
    // Insert button next to Copilot link
    const copilotContainer = copilotLink.parentElement;
    if (copilotContainer) {
      copilotLink.after(button);
      return true;
    }
    
    return false;
  }

  // Initialize the modifications
  function init() {
    // Try to add features immediately
    addCopyPRLinkButton();
    addCopilotReviewButton();
    
    // Also observe DOM changes in case elements load dynamically
    const observer = new MutationObserver(function(mutations) {
      addCopyPRLinkButton();
      addCopilotReviewButton();
    });
    
    // Observe the main container for changes
    const container = document.querySelector('#partial-discussion-header') || document.body;
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    
    // Also check periodically in case of dynamic loading
    const checkInterval = setInterval(() => {
      const btn1Added = addCopyPRLinkButton();
      const btn2Added = addCopilotReviewButton();
      
      // If both buttons are added or not needed, we can stop checking so frequently
      if (btn1Added) {
        clearInterval(checkInterval);
      }
    }, 1000);
    
    // Clear interval after 10 seconds regardless
    setTimeout(() => clearInterval(checkInterval), 10000);
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
