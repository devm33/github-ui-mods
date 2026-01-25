// GitHub UI Mods - Content Script
// Adds custom buttons to GitHub PR pages

(function() {
  'use strict';

  // Feature 1: Add "Copy PR Link" button next to PR title
  function addCopyPRLinkButton() {
    // Find the PR title element
    const titleElement = document.querySelector('.js-issue-title');
    if (!titleElement) {
      return false;
    }

    // Check if button already exists
    if (document.getElementById('copy-pr-link-btn')) {
      return true;
    }

    // Create the button
    const button = document.createElement('button');
    button.id = 'copy-pr-link-btn';
    button.className = 'btn btn-sm';
    button.style.cssText = 'margin-left: 8px; vertical-align: middle; display: inline-flex; align-items: center; gap: 4px;';
    button.innerHTML = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
        <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm5.22-1.72a.75.75 0 0 1 1.06 0l3.97 3.97V4.25a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1 0-1.5H9.44L5.47 5.53a.75.75 0 0 1 0-1.06Z"></path>
      </svg>
      <span>Copy PR Link</span>
    `;
    button.title = 'Copy PR title and link to clipboard';
    
    // Add click handler
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Get PR title and URL
      const prTitle = titleElement.textContent.trim();
      const prUrl = window.location.href;
      const textToCopy = `${prTitle}: ${prUrl}`;
      
      // Copy to clipboard
      // Save original button content before try/catch
      const originalText = button.innerHTML;
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
            <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
          </svg>
          Copied!
        `;
        button.style.color = '#1a7f37';
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
            <path fill="currentColor" d="M9.036 7.976a.75.75 0 0 0-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 1 0 1.06 1.06L12 13.06l2.963 2.964a.75.75 0 0 0 1.061-1.06L13.061 12l2.963-2.964a.75.75 0 0 0-1.06-1.06L12 10.939 9.036 7.976Z"></path>
            <path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"></path>
          </svg>
          Failed
        `;
        button.style.color = '#f85149';
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.color = '';
        }, 2000);
      }
    });
    
    // Insert button after the PR number
    const prNumberElement = document.querySelector('.gh-header-number');
    if (prNumberElement) {
      prNumberElement.after(button);
      return true;
    }
    
    return false;
    
    return false;
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

    // Create the button
    const button = document.createElement('button');
    button.id = 'copilot-request-review-btn';
    button.className = 'btn btn-sm';
    button.style.marginLeft = '8px';
    button.innerHTML = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
        <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.25-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7.25 8V4.75a.75.75 0 0 1 1.5 0Z"></path>
      </svg>
      Request Review
    `;
    button.title = 'Request Copilot review for draft PR';
    
    // Add click handler
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Save original button content
      const originalText = button.innerHTML;
      
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
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
              <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
            Requested!
          `;
          button.style.color = '#1a7f37';
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
          }, 2000);
        } else {
          // Fallback: provide feedback that manual action is needed
          button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
              <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
            </svg>
            Use Reviewers section
          `;
          button.style.color = '#db6d28';
          button.title = 'Could not find review request button. Please use the Reviewers section manually.';
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
            button.title = 'Request Copilot review for draft PR';
          }, 3000);
        }
      } else {
        // Could not find reviewers section
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="display:inline-block;vertical-align:text-bottom;">
            <path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
          </svg>
          Use Reviewers section
        `;
        button.style.color = '#db6d28';
        button.title = 'Could not find Reviewers section. Please request review manually.';
        setTimeout(() => {
          button.innerHTML = originalText;
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
