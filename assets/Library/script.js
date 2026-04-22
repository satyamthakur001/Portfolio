const app = {
    // --- State Management ---
    state: {
        currentUser: null,
        books: [],
        users: [],
        theme: 'dark'
    },

    init() {
        this.loadData();
        this.loadTheme();
        // If logged in previously, jump to dashboard, else show landing
        if (this.state.currentUser) {
            this.state.currentUser.role === 'admin'
                ? this.navigate('admin-dashboard-view')
                : this.navigate('user-dashboard-view');
        } else {
            this.navigate('landing-view');
        }
    },

    loadData() {
        // Load books
        const storedBooks = localStorage.getItem('lib_books');
        if (storedBooks) {
            this.state.books = JSON.parse(storedBooks);
        } else {
            // Seed some default books
            this.state.books = [
                { id: this.generateId(), title: "The Clean Coder", author: "Robert C. Martin", category: "Technology", borrowedBy: null, dueDate: null },
                { id: this.generateId(), title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "Technology", borrowedBy: null, dueDate: null },
                { id: this.generateId(), title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", borrowedBy: null, dueDate: null }
            ];
            this.saveBooks();
        }

        // Load users
        const storedUsers = localStorage.getItem('lib_users');
        if (storedUsers) {
            this.state.users = JSON.parse(storedUsers);
        }

        // Load session
        const storedSession = sessionStorage.getItem('lib_session');
        if (storedSession) {
            this.state.currentUser = JSON.parse(storedSession);
        }
    },

    saveBooks() {
        localStorage.setItem('lib_books', JSON.stringify(this.state.books));
    },

    saveUsers() {
        localStorage.setItem('lib_users', JSON.stringify(this.state.users));
    },

    saveSession() {
        if (this.state.currentUser) {
            sessionStorage.setItem('lib_session', JSON.stringify(this.state.currentUser));
        } else {
            sessionStorage.removeItem('lib_session');
        }
    },

    // --- Theme Management ---
    loadTheme() {
        const storedTheme = localStorage.getItem('lib_theme');
        if (storedTheme) {
            this.state.theme = storedTheme;
        }
        this.applyTheme();
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('lib_theme', this.state.theme);
        this.applyTheme();
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        const icon = document.getElementById('theme-icon');
        if (icon) {
            if (this.state.theme === 'light') {
                // Moon icon for dark mode toggle
                icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            } else {
                // Sun icon for light mode toggle
                icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            }
        }
    },

    // --- Navigation & UI Utilities ---
    navigate(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        // Show target view
        document.getElementById(viewId).classList.add('active');

        // Render data if navigating to dashboards
        if (viewId === 'admin-dashboard-view') {
            this.renderAdminDashboard();
        } else if (viewId === 'user-dashboard-view') {
            this.renderUserDashboard();
        }
    },

    toggleAuthTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');

        document.getElementById(`tab-${tab}`).classList.add('active');
        const form = document.getElementById(`user-${tab === 'login' ? 'login' : 'signup'}-form`);
        form.classList.add('active');
        form.style.display = 'block';

        this.clearErrors();
    },

    clearErrors() {
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger reflow for animation
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // --- Authentication Logic ---
    handleAdminLogin(e) {
        e.preventDefault();
        const user = document.getElementById('admin-username').value;
        const pass = document.getElementById('admin-password').value;
        const errEl = document.getElementById('admin-login-error');

        // Fixed credentials required by project specs
        if (user === 'admin' && pass === 'admin123') {
            this.state.currentUser = { username: 'admin', role: 'admin' };
            this.saveSession();
            this.showToast('Admin logged in successfully', 'success');
            document.getElementById('admin-login-form').reset();
            this.navigate('admin-dashboard-view');
        } else {
            errEl.textContent = 'Invalid admin credentials.';
        }
    },

    handleUserSignup(e) {
        e.preventDefault();
        const user = document.getElementById('signup-username').value.trim();
        const pass = document.getElementById('signup-password').value;
        const errEl = document.getElementById('user-signup-error');

        if (user === '' || pass === '') {
            errEl.textContent = 'All fields are required.';
            return;
        }

        if (this.state.users.some(u => u.username === user)) {
            errEl.textContent = 'Username already exists.';
            return;
        }

        if (user.toLowerCase() === 'admin') {
            errEl.textContent = 'Cannot use reserved username.';
            return;
        }

        this.state.users.push({ username: user, password: pass });
        this.saveUsers();

        this.showToast('Account created! Please sign in.', 'success');
        document.getElementById('user-signup-form').reset();
        this.toggleAuthTab('login');
    },

    handleUserLogin(e) {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;
        const errEl = document.getElementById('user-login-error');

        const foundUser = this.state.users.find(u => u.username === user && u.password === pass);

        if (foundUser) {
            this.state.currentUser = { username: foundUser.username, role: 'user' };
            this.saveSession();
            this.showToast(`Welcome back, ${foundUser.username}!`, 'success');
            document.getElementById('user-login-form').reset();
            this.navigate('user-dashboard-view');
        } else {
            errEl.textContent = 'Invalid username or password.';
        }
    },

    logout() {
        this.state.currentUser = null;
        this.saveSession();
        this.navigate('landing-view');
        this.showToast('Logged out successfully', 'success');
    },

    // --- Admin Features ---
    renderAdminDashboard() {
        this.renderAdminStats();
        this.renderAdminBooks();
        this.renderAdminBorrowedList();
    },

    renderAdminStats() {
        const totalBooks = this.state.books.length;
        const borrowedBooks = this.state.books.filter(b => b.borrowedBy).length;
        const availableBooks = totalBooks - borrowedBooks;

        const html = `
            <div class="stat-card">
                <div class="stat-value">${totalBooks}</div>
                <div class="stat-label">Total Books</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: var(--success);">${availableBooks}</div>
                <div class="stat-label">Available</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: var(--warning);">${borrowedBooks}</div>
                <div class="stat-label">Borrowed</div>
            </div>
        `;
        document.getElementById('admin-stats').innerHTML = html;
    },

    handleAddBook(e) {
        e.preventDefault();
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const category = document.getElementById('book-category').value;

        if (!title || !author || !category) return;

        const newBook = {
            id: this.generateId(),
            title,
            author,
            category,
            borrowedBy: null,
            dueDate: null
        };

        this.state.books.push(newBook);
        this.saveBooks();

        document.getElementById('add-book-form').reset();
        this.showToast('Book added successfully!', 'success');
        this.renderAdminDashboard();
    },

    renderAdminBooks() {
        const searchQuery = document.getElementById('admin-search-book').value.toLowerCase();
        const filterCategory = document.getElementById('admin-category-filter') ? document.getElementById('admin-category-filter').value : 'All';
        const tbody = document.getElementById('admin-books-list');

        let filteredBooks = this.state.books.filter(b =>
            b.title.toLowerCase().includes(searchQuery) ||
            b.author.toLowerCase().includes(searchQuery)
        );

        if (filterCategory !== 'All') {
            filteredBooks = filteredBooks.filter(b => b.category === filterCategory);
        }

        if (filteredBooks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem;">No books found.</td></tr>';
            return;
        }

        tbody.innerHTML = filteredBooks.map(book => `
            <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}<br><span class="text-sm text-muted">${book.category || 'N/A'}</span></td>
                <td>
                    <span class="status-badge ${book.borrowedBy ? 'status-borrowed' : 'status-available'}">
                        ${book.borrowedBy ? 'Borrowed' : 'Available'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon edit" onclick="app.openEditModal('${book.id}')" title="Edit">✎</button>
                        ${!book.borrowedBy ? `<button class="btn-icon delete" onclick="app.deleteBook('${book.id}')" title="Delete">✕</button>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.state.books = this.state.books.filter(b => b.id !== id);
            this.saveBooks();
            this.showToast('Book deleted.', 'success');
            this.renderAdminDashboard();
        }
    },

    openEditModal(id) {
        const book = this.state.books.find(b => b.id === id);
        if (!book) return;

        document.getElementById('edit-book-id').value = book.id;
        document.getElementById('edit-book-title').value = book.title;
        document.getElementById('edit-book-author').value = book.author;
        document.getElementById('edit-book-category').value = book.category || 'Fiction';

        const modal = document.getElementById('edit-modal');
        modal.classList.add('active');
    },

    closeEditModal() {
        document.getElementById('edit-modal').classList.remove('active');
    },

    handleEditBookSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('edit-book-id').value;
        const title = document.getElementById('edit-book-title').value.trim();
        const author = document.getElementById('edit-book-author').value.trim();
        const category = document.getElementById('edit-book-category').value;

        const bookIndex = this.state.books.findIndex(b => b.id === id);
        if (bookIndex !== -1 && title && author && category) {
            this.state.books[bookIndex].title = title;
            this.state.books[bookIndex].author = author;
            this.state.books[bookIndex].category = category;
            this.saveBooks();
            this.showToast('Book updated successfully.', 'success');
            this.closeEditModal();
            this.renderAdminDashboard();
        }
    },

    renderAdminBorrowedList() {
        const tbody = document.getElementById('admin-borrowed-list');
        const borrowedBooks = this.state.books.filter(b => b.borrowedBy);

        if (borrowedBooks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 2rem;">No books are currently borrowed.</td></tr>';
            return;
        }

        tbody.innerHTML = borrowedBooks.map(book => {
            const isOverdue = new Date(book.dueDate) < new Date();
            const dateStr = new Date(book.dueDate).toLocaleDateString();

            return `
            <tr>
                <td><strong>${book.title}</strong><br><span class="text-sm text-muted">by ${book.author}</span></td>
                <td><span class="highlight-text">${book.borrowedBy}</span></td>
                <td>
                    <span style="color: ${isOverdue ? 'var(--danger)' : 'inherit'}">${dateStr}</span>
                    ${isOverdue ? ' <span class="badge" style="background:var(--danger);color:white;border:none">Overdue</span>' : ''}
                </td>
            </tr>
        `}).join('');
    },

    // --- User Features ---
    renderUserDashboard() {
        document.getElementById('current-user-name').textContent = this.state.currentUser.username;
        this.renderUserProfileAndAlerts();
        this.renderUserBorrowedBooks();
        this.renderUserBooks();
    },

    renderUserProfileAndAlerts() {
        const username = this.state.currentUser.username;
        const myBooks = this.state.books.filter(b => b.borrowedBy === username);
        const alertsArea = document.getElementById('user-alerts-area');

        document.getElementById('user-borrow-count').textContent = myBooks.length;

        // Check for approaching deadlines or overdues
        let alerts = '';
        const today = new Date();

        myBooks.forEach(book => {
            const dueDate = new Date(book.dueDate);
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                alerts += `<div class="toast error mb-4" style="position:relative; transform:none; min-width:100%; display:block">
                    <strong>Overdue Book:</strong> You missed the return date for "${book.title}". Please return it immediately!
                </div>`;
            } else if (diffDays <= 2) {
                alerts += `<div class="toast warning mb-4" style="position:relative; transform:none; min-width:100%; display:block">
                    <strong>Deadline Approaching:</strong> "${book.title}" is due in ${diffDays} day(s).
                </div>`;
            }
        });

        alertsArea.innerHTML = alerts;
    },

    renderUserBorrowedBooks() {
        const username = this.state.currentUser.username;
        const myBooks = this.state.books.filter(b => b.borrowedBy === username);
        const container = document.getElementById('user-borrowed-list');

        if (myBooks.length === 0) {
            container.innerHTML = '<p class="text-muted">You have not borrowed any books.</p>';
            return;
        }

        const today = new Date();

        container.innerHTML = myBooks.map(book => {
            const dueDate = new Date(book.dueDate);
            const isOverdue = dueDate < today;
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            let statusClass = '';
            if (isOverdue) statusClass = 'overdue';
            else if (diffDays <= 2) statusClass = 'near-due';

            return `
            <div class="borrow-card ${statusClass}">
                <div class="borrow-info">
                    <h4>${book.title}</h4>
                    <p>By ${book.author}</p>
                    <span class="due-badge" style="color: ${isOverdue ? 'var(--danger)' : 'inherit'}">
                        Due: ${dueDate.toLocaleDateString()}
                    </span>
                </div>
                <div>
                    <button class="btn btn-secondary btn-small" onclick="app.returnBook('${book.id}')">Return</button>
                </div>
            </div>
            `;
        }).join('');
    },

    renderUserBooks() {
        const searchQuery = document.getElementById('user-search-book').value.toLowerCase();
        const filterCategory = document.getElementById('user-category-filter') ? document.getElementById('user-category-filter').value : 'All';
        const grid = document.getElementById('user-books-grid');

        // Only show available books
        const availableBooks = this.state.books.filter(b => !b.borrowedBy);

        let filteredBooks = availableBooks.filter(b =>
            b.title.toLowerCase().includes(searchQuery) ||
            b.author.toLowerCase().includes(searchQuery)
        );

        if (filterCategory !== 'All') {
            filteredBooks = filteredBooks.filter(b => b.category === filterCategory);
        }

        if (filteredBooks.length === 0) {
            grid.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1; text-align:center; padding:2rem;">No available books match your criteria.</p>';
            return;
        }

        grid.innerHTML = filteredBooks.map(book => `
            <div class="book-card">
                <span class="badge mb-4" style="align-self: flex-start; margin-bottom: 0.5rem; font-size: 0.75rem;">${book.category || 'N/A'}</span>
                <h4>${book.title}</h4>
                <div class="author">By ${book.author}</div>
                <div class="card-footer">
                    <span class="status-badge status-available">Available</span>
                    <button class="btn btn-primary btn-small" onclick="app.openBorrowModal('${book.id}')">Borrow</button>
                </div>
            </div>
        `).join('');
    },

    openBorrowModal(id) {
        // Enforce max 3 books rule
        const username = this.state.currentUser.username;
        const myBorrowCount = this.state.books.filter(b => b.borrowedBy === username).length;

        if (myBorrowCount >= 3) {
            this.showToast('You have reached the maximum borrow limit of 3 books.', 'error');
            return;
        }

        const book = this.state.books.find(b => b.id === id);
        if (!book || book.borrowedBy) return; // Prevent if already issued

        document.getElementById('borrow-book-id').value = book.id;
        document.getElementById('borrow-book-title-display').textContent = book.title;

        const modal = document.getElementById('borrow-modal');
        modal.classList.add('active');
    },

    closeBorrowModal() {
        document.getElementById('borrow-modal').classList.remove('active');
    },

    handleBorrowSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('borrow-book-id').value;
        const days = parseInt(document.getElementById('borrow-days').value, 10);

        const bookIndex = this.state.books.findIndex(b => b.id === id);
        if (bookIndex !== -1 && !this.state.books[bookIndex].borrowedBy) {
            // Check limits again to prevent concurrent manipulation
            const username = this.state.currentUser.username;
            const myBorrowCount = this.state.books.filter(b => b.borrowedBy === username).length;
            if (myBorrowCount >= 3) {
                this.showToast('You have reached the maximum borrow limit of 3 books.', 'error');
                this.closeBorrowModal();
                return;
            }

            // Calculate due date
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + days);

            this.state.books[bookIndex].borrowedBy = username;
            this.state.books[bookIndex].dueDate = dueDate.toISOString();

            this.saveBooks();
            this.showToast(`Borrowed "${this.state.books[bookIndex].title}" for ${days} days.`, 'success');
            this.closeBorrowModal();
            this.renderUserDashboard(); // Update lists
        }
    },

    returnBook(id) {
        const bookIndex = this.state.books.findIndex(b => b.id === id);
        if (bookIndex !== -1) {
            this.state.books[bookIndex].borrowedBy = null;
            this.state.books[bookIndex].dueDate = null;

            this.saveBooks();
            this.showToast('Book returned successfully.', 'success');
            this.renderUserDashboard();
        }
    }
};

// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => app.init());