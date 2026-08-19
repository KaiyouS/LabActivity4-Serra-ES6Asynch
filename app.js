/**
 * Lab Activity 4: Advanced ES6+ & Asynchronous Fetch
 * Description: Fetches and displays posts from JSONPlaceholder using modern ES6+ standards
 * formatted in a minimalist editorial style.
 */

// API Endpoint configuration
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM Element references
const postsContainer = document.querySelector('#posts-container');
const postCountElement = document.querySelector('#post-count');
const statusTextElement = document.querySelector('#status-text');
const statusBulletElement = document.querySelector('.status-bullet');
const refreshBtn = document.querySelector('#refresh-btn');

/**
 * Displays minimalist editorial skeleton placeholders during data fetching.
 */
const renderLoadingState = () => {
    if (statusTextElement) statusTextElement.textContent = 'Updating feed...';
    if (statusBulletElement) statusBulletElement.className = 'status-bullet loading';
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
    }

    // Render 4 minimalist placeholder skeletons
    if (postsContainer) {
        postsContainer.innerHTML = Array.from({ length: 4 })
            .map(() => `
                <div class="skeleton-post" aria-hidden="true">
                    <div class="skeleton-line skeleton-meta"></div>
                    <div class="skeleton-line skeleton-title-1"></div>
                    <div class="skeleton-line skeleton-title-2"></div>
                    <div class="skeleton-line skeleton-body-1"></div>
                    <div class="skeleton-line skeleton-body-2"></div>
                    <div class="skeleton-line skeleton-body-3"></div>
                </div>
            `)
            .join('');
    }
};

/**
 * Updates status bar upon successful data retrieval and rendering.
 * @param {number} count - Total number of rendered entries.
 */
const renderSuccessState = (count) => {
    if (statusTextElement) statusTextElement.textContent = 'Live Feed Connected';
    if (statusBulletElement) statusBulletElement.className = 'status-bullet';
    if (postCountElement) postCountElement.textContent = `${count} Dispatches Published`;
    if (refreshBtn) {
        refreshBtn.classList.remove('loading');
        refreshBtn.disabled = false;
    }
};

/**
 * Displays an editorial error notice when a network or HTTP error occurs.
 * @param {string} errorMessage - Descriptive error message.
 */
const renderErrorState = (errorMessage) => {
    if (statusTextElement) statusTextElement.textContent = 'Feed Disconnected';
    if (statusBulletElement) statusBulletElement.className = 'status-bullet error';
    if (postCountElement) postCountElement.textContent = 'Transmission error';
    if (refreshBtn) {
        refreshBtn.classList.remove('loading');
        refreshBtn.disabled = false;
    }

    if (postsContainer) {
        postsContainer.innerHTML = `
            <div class="error-editorial-box" role="alert">
                <span class="error-label">Connection Notice</span>
                <h2 class="error-heading">Unable to retrieve dispatch entries</h2>
                <p class="error-text">
                    An error occurred while fetching the latest posts from the external REST API.
                </p>
                <div class="error-code">${errorMessage}</div>
                <button type="button" class="error-retry-btn" onclick="fetchPosts()">
                    Retry Connection
                </button>
            </div>
        `;
    }
};

/**
 * Asynchronously fetches posts from the JSONPlaceholder API,
 * applies functional transformation pipelines (.filter, .map),
 * and renders them in a minimalist editorial layout.
 */
const fetchPosts = async () => {
    renderLoadingState();

    try {
        const response = await fetch(API_URL);

        // Explicit HTTP status validation to prevent silent failures (e.g. 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText || 'Failed to fetch data'}`);
        }

        const posts = await response.json();

        // ES6+ Functional Pipeline:
        // 1. .filter() to limit results to the first 10 posts
        // 2. .map() with object destructuring to transform each post into HTML template literals
        const postEntriesHTML = posts
            .filter((_, index) => index < 10)
            .map(({ id, title, body }) => `
                <article class="editorial-post" data-id="${id}">
                    <div class="post-meta">
                        <span class="post-number">Dispatch No. ${String(id).padStart(2, '0')}</span>
                        <span class="meta-dot">/</span>
                        <span class="post-source-tag">JSONPlaceholder Collection</span>
                    </div>
                    <h2 class="post-title">${title}</h2>
                    <p class="post-body">${body}</p>
                    <div class="post-footer">
                        <span class="post-tag">Entry #${id}</span>
                        <span class="post-source-tag">Read time · 2 min</span>
                    </div>
                </article>
            `)
            .join('');

        // Inject generated markup into the feed container
        if (postsContainer) {
            postsContainer.innerHTML = postEntriesHTML;
        }

        renderSuccessState(10);
    } catch (error) {
        console.error('Fetch Error:', error);
        renderErrorState(error.message);
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchPosts);
refreshBtn?.addEventListener('click', fetchPosts);
