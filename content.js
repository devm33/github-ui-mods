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

    // Find the Copilot reviewer link in the sidebar only (not in timeline)
    const sidebar = document.querySelector('.Layout-sidebar');
    if (!sidebar) {
      return false;
    }
    
    const copilotLink = sidebar.querySelector('a[href="/apps/copilot-pull-request-reviewer"]');
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
    button.style.cssText = 'margin-left: 4px; margin-right: 4px; position: relative; top: -4px;';
    button.title = 'Request Copilot review for draft PR';
    const playIcon = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="position: relative; margin-top: 0;">
        <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"></path>
      </svg>
    `;
    button.innerHTML = playIcon;
    
    // Add click handler
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Copilot reviewer user ID
      const COPILOT_USER_ID = '175728472';
      
      // Get the authenticity token - look for it in the reviewers form specifically
      const reviewersForm = document.querySelector('form[action*="review-requests"]');
      let csrfToken = reviewersForm?.querySelector('input[name="authenticity_token"]')?.value;
      
      // Fallback to other sources
      if (!csrfToken) {
        csrfToken = document.querySelector('input[name="authenticity_token"]')?.value;
      }
      
      if (!csrfToken) {
        console.error('Could not find CSRF token');
        return;
      }
      
      // Get other required headers from the page
      const fetchNonce = document.querySelector('meta[name="fetch-nonce"]')?.content || '';
      const clientVersion = document.querySelector('meta[name="github-client-version"]')?.content || '';
      
      // Build the review request URL from current page
      const prUrl = window.location.pathname; // e.g., /owner/repo/pull/123
      const reviewRequestUrl = `${prUrl}/review-requests`;
      
      // Create form data
      const formData = new FormData();
      formData.append('authenticity_token', csrfToken);
      formData.append('partial_last_updated', Math.floor(Date.now() / 1000).toString());
      formData.append('dummy-field-just-to-avoid-empty-submit', 'foo');
      formData.append('reviewer_user_ids[]', COPILOT_USER_ID);
      
      try {
        const headers = {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        };
        
        if (fetchNonce) {
          headers['X-Fetch-Nonce'] = fetchNonce;
        }
        if (clientVersion) {
          headers['X-GitHub-Client-Version'] = clientVersion;
        }
        
        const response = await fetch(reviewRequestUrl, {
          method: 'POST',
          body: formData,
          headers: headers
        });
        
        if (response.ok) {
          // Visual feedback - success
          button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="color: #1a7f37;">
              <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
          `;
          button.style.color = '#1a7f37';
          
          // Reload the page to show updated reviewers
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          throw new Error(`Request failed: ${response.status}`);
        }
      } catch (err) {
        console.error('Failed to request review:', err);
        button.innerHTML = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="octicon" style="color: #f85149;">
            <path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
          </svg>
        `;
        button.style.color = '#f85149';
        button.title = 'Failed to request review';
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
