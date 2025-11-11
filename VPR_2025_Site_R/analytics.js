// Analytics Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Check if analytics elements exist (works for both standalone page and embedded in demo)
  if (!document.getElementById('total-reviews')) return;

  const STORAGE_KEY = 'vpr_reviews_v3';
  let reviews = [];
  let chartInstances = {
    criteriaChart: null,
    trendsChart: null,
    radarChart: null
  };
  
  // Load reviews from localStorage
  try {
    reviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Failed to load reviews', e);
  }

  // Calculate statistics
  function calculateStats() {
    if (reviews.length === 0) {
      return {
        total: 0,
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        avgLieFactor: 0,
        avgDataInk: 0,
        avgChartJunk: 0
      };
    }

    let totalScore = 0;
    let lieFactor = 0;
    let dataInk = 0;
    let chartJunk = 0;
    let maxScore = -Infinity;
    let minScore = Infinity;

    reviews.forEach(review => {
      const lf = parseInt(review.lieFactor) || 0;
      const di = parseInt(review.dataInk) || 0;
      const cj = parseInt(review.chartJunk) || 0;
      const score = lf + di + cj;

      totalScore += score;
      lieFactor += lf;
      dataInk += di;
      chartJunk += cj;

      if (score > maxScore) maxScore = score;
      if (score < minScore) minScore = score;
    });

    const count = reviews.length;
    return {
      total: count,
      avgScore: (totalScore / count).toFixed(2),
      maxScore: maxScore,
      minScore: minScore,
      avgLieFactor: (lieFactor / count).toFixed(2),
      avgDataInk: (dataInk / count).toFixed(2),
      avgChartJunk: (chartJunk / count).toFixed(2)
    };
  }

  // Update summary statistics
  function updateSummaryStats() {
    const stats = calculateStats();
    
    document.getElementById('total-reviews').textContent = stats.total;
    document.getElementById('avg-score').textContent = stats.total > 0 ? stats.avgScore : '-';
    document.getElementById('max-score').textContent = stats.total > 0 ? stats.maxScore : '-';
    document.getElementById('min-score').textContent = stats.total > 0 ? stats.minScore : '-';
  }

  // Create Criteria Chart
  function createCriteriaChart() {
    const ctx = document.getElementById('criteriaChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstances.criteriaChart) {
      chartInstances.criteriaChart.destroy();
    }

    const stats = calculateStats();

    chartInstances.criteriaChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lie Factor', 'Data-Ink Ratio', 'Chart Junk'],
        datasets: [{
          label: 'Average Score',
          data: [stats.avgLieFactor, stats.avgDataInk, stats.avgChartJunk],
          backgroundColor: [
            'rgba(124, 77, 255, 0.7)',
            'rgba(57, 73, 171, 0.7)',
            'rgba(92, 107, 192, 0.7)'
          ],
          borderColor: [
            'rgba(124, 77, 255, 1)',
            'rgba(57, 73, 171, 1)',
            'rgba(92, 107, 192, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    });
  }

  // Create Trends Chart
  function createTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstances.trendsChart) {
      chartInstances.trendsChart.destroy();
    }

    // Sort reviews by timestamp
    const sortedReviews = [...reviews].sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const labels = sortedReviews.map((r, i) => `Review ${i + 1}`);
    const scores = sortedReviews.map(r =>
      (parseInt(r.lieFactor) || 0) +
      (parseInt(r.dataInk) || 0) +
      (parseInt(r.chartJunk) || 0)
    );

    chartInstances.trendsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Score',
          data: scores,
          borderColor: 'rgba(57, 73, 171, 1)',
          backgroundColor: 'rgba(57, 73, 171, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgba(124, 77, 255, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Create Radar Chart
  function createRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstances.radarChart) {
      chartInstances.radarChart.destroy();
    }

    const stats = calculateStats();

    // Radar chart needs data normalized to same scale for meaningful comparison
    // Lie Factor: 1-3 scale, Data-Ink: 1-5 scale, Chart Junk: 1-5 scale
    // We'll normalize everything to 0-5 scale
    const normalizedLieFactor = stats.total > 0 ? (parseFloat(stats.avgLieFactor) / 3) * 5 : 0;
    const normalizedDataInk = stats.total > 0 ? parseFloat(stats.avgDataInk) : 0;
    const normalizedChartJunk = stats.total > 0 ? parseFloat(stats.avgChartJunk) : 0;

    chartInstances.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Lie Factor', 'Data-Ink Ratio', 'Chart Junk'],
        datasets: [{
          label: 'Average Scores (Normalized)',
          data: [normalizedLieFactor, normalizedDataInk, normalizedChartJunk],
          backgroundColor: 'rgba(124, 77, 255, 0.2)',
          borderColor: 'rgba(124, 77, 255, 1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(57, 73, 171, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(124, 77, 255, 1)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed.r.toFixed(2);
                return `${label}: ${value}/5`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            min: 0,
            ticks: {
              stepSize: 1
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  }

  // Populate review table
  function populateReviewTable() {
    const tbody = document.getElementById('analytics-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (reviews.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5" style="text-align:center;color:#667085;padding:2rem">No reviews available</td>';
      tbody.appendChild(tr);
      return;
    }

    // Show most recent reviews first
    const sortedReviews = [...reviews].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 10);

    sortedReviews.forEach(review => {
      const tr = document.createElement('tr');
      const date = new Date(review.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      const totalScore = (parseInt(review.lieFactor) || 0) + 
                        (parseInt(review.dataInk) || 0) + 
                        (parseInt(review.chartJunk) || 0);

      tr.innerHTML = `
        <td>${formattedDate}</td>
        <td><strong>${review.lieFactor || '-'}</strong></td>
        <td><strong>${review.dataInk || '-'}</strong></td>
        <td><strong>${review.chartJunk || '-'}</strong></td>
        <td><strong>${totalScore}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Export as CSV
  function exportCSV() {
    if (reviews.length === 0) {
      alert('No reviews to export');
      return;
    }

    const headers = ['Timestamp', 'Lie Factor', 'Data-Ink Ratio', 'Chart Junk', 'Total Score', 'Lie Factor Comment', 'Data-Ink Comment', 'Chart Junk Comment'];
    const rows = reviews.map(r => {
      const totalScore = (parseInt(r.lieFactor) || 0) + 
                        (parseInt(r.dataInk) || 0) + 
                        (parseInt(r.chartJunk) || 0);
      return [
        r.timestamp,
        r.lieFactor || '',
        r.dataInk || '',
        r.chartJunk || '',
        totalScore,
        (r.lieFactorComment || '').replace(/"/g, '""'),
        (r.dataInkComment || '').replace(/"/g, '""'),
        (r.chartJunkComment || '').replace(/"/g, '""')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vpr_analytics_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    showNotification('Data exported as CSV successfully!', 'success');
  }

  // Export as JSON
  function exportJSON() {
    if (reviews.length === 0) {
      alert('No reviews to export');
      return;
    }

    const stats = calculateStats();
    const exportData = {
      summary: stats,
      reviews: reviews,
      exportDate: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vpr_analytics_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    showNotification('Data exported as JSON successfully!', 'success');
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

  // Refresh function to reload data and update all visualizations
  function refreshAnalyticsData() {
    // Reload reviews from localStorage
    try {
      reviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Failed to reload reviews', e);
    }

    // Update all visualizations
    updateSummaryStats();
    createCriteriaChart();
    createRadarChart();
    createTrendsChart();
    populateReviewTable();
  }

  // Initialize everything
  updateSummaryStats();
  createCriteriaChart();
  createRadarChart();
  createTrendsChart();
  populateReviewTable();

  // Attach event listeners
  const exportCSVBtn = document.getElementById('export-csv');
  if (exportCSVBtn) {
    exportCSVBtn.addEventListener('click', exportCSV);
  }

  const exportJSONBtn = document.getElementById('export-analytics-json');
  if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', exportJSON);
  }

  // Expose refresh function globally so it can be called from script.js
  window.refreshAnalytics = refreshAnalyticsData;
});
