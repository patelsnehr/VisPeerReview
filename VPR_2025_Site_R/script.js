document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for fade-in animations
  const faders = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    faders.forEach(fader => fadeObserver.observe(fader));
  } else {
    faders.forEach(fader => fader.classList.add('show'));
  }

  // FAQ Accordion functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = question.nextElementSibling;
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.classList.remove('active');
        }
      });
      
      // Toggle current FAQ
      question.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('active');
    });
  });

  // Demo page functionality
  const demoImage = document.getElementById('demo-image');
  if (!demoImage) return;

  const uploadInput = document.getElementById('upload-file');
  const loadBtn = document.getElementById('load-url');
  const urlInput = document.getElementById('image-url');
  const dropArea = document.getElementById('drop-area');
  const nudgeArea = document.getElementById('nudge-area');
  const nudgeText = document.getElementById('nudge-text');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressHint = document.getElementById('progress-hint');

  // Track form state for personalized nudges (3 fields now)
  let formState = {
    ratings: 0,
    comments: 0,
    totalFields: 3
  };

  // Personalized nudge messages
  const nudges = {
    initial: {
      icon: '💡',
      text: 'Start by selecting a rating and adding meaningful comments for each criterion.',
      type: ''
    },
    noComments: {
      icon: '✍️',
      text: 'Tip: Add detailed comments to make your review more valuable. Explain your ratings!',
      type: 'warning'
    },
    someComments: {
      icon: '👍',
      text: 'Good progress! Try to add comments for all criteria to provide comprehensive feedback.',
      type: ''
    },
    shortComments: {
      icon: '📝',
      text: 'Consider expanding your comments. Specific examples and suggestions are most helpful!',
      type: 'warning'
    },
    allComplete: {
      icon: '🎉',
      text: 'Excellent! Your review is complete with ratings and detailed comments. Ready to save!',
      type: 'success'
    },
    ratingsOnly: {
      icon: '⚠️',
      text: 'You have ratings but no comments. Written feedback helps others understand your perspective!',
      type: 'warning'
    }
  };

  // Update progress bar and checklist
  function updateProgress() {
    const criteria = ['lieFactor', 'dataInk', 'chartJunk'];
    let completed = 0;
    let hints = [];

    criteria.forEach(criterion => {
      const rating = document.getElementById(criterion);
      const comment = document.getElementById(`${criterion}-comment`);
      const progressItem = document.getElementById(`progress-${criterion}`);
      
      if (rating && comment && progressItem) {
        const hasRating = rating.value !== '';
        const hasComment = comment.value.trim().length > 0;
        
        if (hasRating && hasComment) {
          completed++;
          progressItem.classList.add('completed');
          progressItem.querySelector('.progress-checkbox').textContent = '☑';
        } else {
          progressItem.classList.remove('completed');
          progressItem.querySelector('.progress-checkbox').textContent = '☐';
          
          if (!hasRating) {
            hints.push(`Select a rating for ${criterion.replace(/([A-Z])/g, ' $1').trim()}`);
          } else if (!hasComment) {
            hints.push(`Add comments for ${criterion.replace(/([A-Z])/g, ' $1').trim()}`);
          }
        }
      }
    });

    const percentage = Math.round((completed / formState.totalFields) * 100);
    
    if (progressBar) {
      progressBar.style.width = percentage + '%';
      progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
      progressText.textContent = percentage + '% Complete';
    }
    
    if (progressHint) {
      if (percentage === 100) {
        progressHint.textContent = '✅ Review complete! Click "Save Review" to save your feedback.';
        progressHint.style.color = '#10b981';
      } else if (hints.length > 0) {
        progressHint.textContent = hints[0];
        progressHint.style.color = '#667085';
      } else {
        progressHint.textContent = 'Keep going! Complete all sections.';
        progressHint.style.color = '#667085';
      }
    }
  }

  // Update personalized nudge based on form state
  function updateNudge() {
    const criteria = ['lieFactor', 'dataInk', 'chartJunk'];
    
    // Update individual nudges for each criterion
    criteria.forEach(criterion => {
      const rating = document.getElementById(criterion);
      const comment = document.getElementById(`${criterion}-comment`);
      const nudge = document.getElementById(`nudge-${criterion}`);
      
      if (rating && comment && nudge) {
        const hasRating = rating.value !== '';
        const hasComment = comment.value.trim().length > 0;
        const commentLength = comment.value.trim().length;
        
        const icon = nudge.querySelector('.nudge-icon');
        const text = nudge.querySelector('.nudge-text');
        
        // Reset classes
        nudge.className = 'individual-nudge';
        
        if (!hasRating && !hasComment) {
          // Neither rating nor comment
          icon.textContent = '💡';
          text.textContent = 'Select a rating and add comments to explain your evaluation';
          nudge.classList.add('info');
        } else if (hasRating && !hasComment) {
          // Has rating but no comment
          icon.textContent = '✍️';
          text.textContent = 'Great! Now add detailed comments to explain your rating';
          nudge.classList.add('warning');
        } else if (!hasRating && hasComment) {
          // Has comment but no rating
          icon.textContent = '⚠️';
          text.textContent = 'Don\'t forget to select a rating!';
          nudge.classList.add('warning');
        } else if (hasRating && hasComment && commentLength < 120) {
          // Both but comment is short
          icon.textContent = '📝';
          text.textContent = 'Good start! Consider adding more specific details and examples';
          nudge.classList.add('warning');
        } else if (hasRating && hasComment) {
          // Both rating and substantial comment
          icon.textContent = '✅';
          text.textContent = 'Nicely done! Just complete the sentence, and your evaluation will reflect depth and precision.';
          nudge.classList.add('success');
        }
      }
    });

    // Update progress bar
    updateProgress();
  }

  // Attach listeners to all form inputs for real-time updates
  document.querySelectorAll('.rating-select, .comment-box').forEach(input => {
    input.addEventListener('input', updateNudge);
    input.addEventListener('change', updateNudge);
  });

  // Drag and drop functionality
  if (dropArea) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('hover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('hover');
      });
    });

    dropArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });

    // Keyboard accessibility for drop area
    dropArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        uploadInput.click();
      }
    });
  }

  // File upload handler
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });
  }

  // Handle image file reading
  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      demoImage.src = e.target.result;
      demoImage.alt = `Uploaded visualization: ${file.name}`;
      showNotification('Image loaded successfully!', 'success');
    };
    reader.onerror = () => {
      showNotification('Error reading file. Please try again.', 'error');
    };
    reader.readAsDataURL(file);
  }

  // Load image from URL
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const url = (urlInput && urlInput.value || '').trim();
      
      if (!url) {
        showNotification('Please enter an image URL.', 'error');
        urlInput.focus();
        return;
      }
      
      if (!/^https?:\/\//i.test(url)) {
        showNotification('URL must start with http:// or https://', 'error');
        urlInput.focus();
        return;
      }
      
      demoImage.src = url;
      demoImage.alt = 'Visualization loaded from URL';
      showNotification('Image URL loaded successfully!', 'success');
    });
  }

  // Review storage
  const STORAGE_KEY = 'vpr_reviews_v3';
  let reviews = [];
  let storageAvailable = false;

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
    reviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.warn('localStorage not available, using in-memory storage', e);
    storageAvailable = false;
  }

  // Render reviews table
  function renderReviews() {
    const tbody = document.querySelector('#reviews-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (reviews.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4" style="text-align:center;color:#667085;padding:2rem">No reviews saved yet</td>';
      tbody.appendChild(tr);
      return;
    }

    reviews.forEach((review) => {
      const tr = document.createElement('tr');
      
      const commentsSummary = [];
      if (review.lieFactorComment) commentsSummary.push(`LF: ${review.lieFactorComment.substring(0, 50)}...`);
      if (review.dataInkComment) commentsSummary.push(`DI: ${review.dataInkComment.substring(0, 50)}...`);
      if (review.chartJunkComment) commentsSummary.push(`CJ: ${review.chartJunkComment.substring(0, 50)}...`);
      
      const commentsCell = commentsSummary.length > 0 
        ? commentsSummary.join('<br>') 
        : '<em style="color:#9ca3af">No comments</em>';
      
      tr.innerHTML = `
        <td><strong>${review.lieFactor || '-'}</strong></td>
        <td><strong>${review.dataInk || '-'}</strong></td>
        <td><strong>${review.chartJunk || '-'}</strong></td>
        <td style="font-size:0.875rem">${commentsCell}</td>
      `;
      tr.setAttribute('role', 'row');
      tbody.appendChild(tr);
    });
  }

  renderReviews();

  // Save review functionality
  const saveBtn = document.getElementById('save-review');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      try {
        const form = document.getElementById('rubric-form');
        const formData = new FormData(form);
        
        const hasRating = Array.from(document.querySelectorAll('.rating-select'))
          .some(select => select.value !== '');
        
        if (!hasRating) {
          showNotification('Please select at least one rating before saving.', 'error');
          return;
        }
        
        const review = {
          timestamp: new Date().toISOString(),
          image: demoImage.src,
          lieFactor: formData.get('lieFactor') || '',
          dataInk: formData.get('dataInk') || '',
          chartJunk: formData.get('chartJunk') || '',
          lieFactorComment: formData.get('lieFactor-comment') || '',
          dataInkComment: formData.get('dataInk-comment') || '',
          chartJunkComment: formData.get('chartJunk-comment') || ''
        };

        reviews.push(review);
        
        if (storageAvailable) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        }
        
        renderReviews();
        showNotification('✅ Review saved successfully!', 'success');
        announceToScreenReader('Review saved successfully');
        
        // Reset form
        form.reset();
        updateNudge();
      } catch (e) {
        console.error('Save failed', e);
        showNotification('Failed to save review. Please try again.', 'error');
      }
    });
  }

  // Clear reviews
  const clearBtn = document.getElementById('clear-local');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete all saved reviews?')) {
        return;
      }
      
      if (storageAvailable) {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      reviews = [];
      renderReviews();
      showNotification('All reviews cleared', 'success');
      announceToScreenReader('All reviews have been cleared');
    });
  }

  // Export reviews as JSON
  const exportBtn = document.getElementById('export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      try {
        if (reviews.length === 0) {
          showNotification('No reviews to export', 'error');
          return;
        }
        
        const jsonStr = JSON.stringify(reviews, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `vpr_reviews_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        
        showNotification('Reviews exported successfully!', 'success');
        announceToScreenReader('Reviews exported as JSON file');
      } catch (e) {
        console.error('Export failed', e);
        showNotification('Failed to export reviews', 'error');
      }
    });
  }

  // Sample JSON download
  const sampleLink = document.getElementById('download-sample');
  if (sampleLink) {
    const sampleData = [{
      timestamp: new Date().toISOString(),
      lieFactor: 2,
      dataInk: 5,
      chartJunk: 3,
      lieFactorComment: 'Some scale distortions present',
      dataInkComment: 'Excellent use of minimal design',
      chartJunkComment: 'Could reduce decorative elements'
    }];

    try {
      const blob = new Blob([JSON.stringify(sampleData, null, 2)], { 
        type: 'application/json' 
      });
      sampleLink.href = URL.createObjectURL(blob);
      
      sampleLink.addEventListener('click', () => {
        setTimeout(() => URL.revokeObjectURL(sampleLink.href), 1500);
      });
    } catch (e) {
      console.warn('Failed to create sample download', e);
    }
  }

  // Import JSON
  const importBtn = document.getElementById('import-json-btn');
  const importInput = document.getElementById('import-json');
  
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    
    importInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || !files[0]) return;
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (!Array.isArray(data)) {
            showNotification('Invalid JSON format. Must be an array.', 'error');
            return;
          }
          
          reviews = reviews.concat(data);
          
          if (storageAvailable) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
          }
          
          renderReviews();
          showNotification(`Successfully imported ${data.length} review(s)`, 'success');
          announceToScreenReader(`Imported ${data.length} reviews`);
        } catch (err) {
          console.error('Import failed', err);
          showNotification('Invalid JSON file. Please check the format.', 'error');
        }
      };
      
      reader.onerror = () => {
        showNotification('Error reading file', 'error');
      };
      
      reader.readAsText(files[0]);
      importInput.value = '';
    });
  }

  // Utility: Show notification
  function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      padding: 1rem 1.5rem;
      margin-bottom: 0.5rem;
      border-radius: 10px;
      background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#e0e7ff'};
      color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#3730a3'};
      border: 2px solid ${type === 'error' ? '#fca5a5' : type === 'success' ? '#6ee7b7' : '#c7d2fe'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      font-weight: 600;
    `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Utility: Announce to screen readers
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Add animation keyframes
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      .sr-only {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize nudge and progress on page load
  updateNudge();
});