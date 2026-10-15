/**
 * Requirement 1: JavaScript Class with meaningful properties and methods
 */
class LibraryItem {
    constructor(id, title, author, isAvailable = true) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isAvailable = isAvailable;
    }

    // Method implementing the specific business rule
    borrowItem() {
        // Business Rule: Cannot borrow if already borrowed
        if (this.isAvailable) {
            this.isAvailable = false;
            return true;
        }
        return false;
    }

    returnItem() {
        this.isAvailable = true;
    }
}

// Global State Array 
let libraryItems = [];

// DOM Element Selections
const addForm = document.getElementById('addForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const itemList = document.getElementById('itemList');
const totalCount = document.getElementById('totalCount');
const availableCount = document.getElementById('availableCount');
const borrowedCount = document.getElementById('borrowedCount');
const emptyState = document.getElementById('emptyState');
const titleError = document.getElementById('titleError');
const authorError = document.getElementById('authorError');

/**
 * Pre-defined educational materials (17 total items)
 */
const defaultMaterials = [
    { id: 'L-101', title: 'Clean Code', author: 'Robert C. Martin', isAvailable: true },
    { id: 'L-102', title: 'Java Fundamentals', author: 'Alex Rivera', isAvailable: false },
    { id: 'L-103', title: 'Design Patterns', author: 'Erich Gamma', isAvailable: true },
    { id: 'L-104', title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isAvailable: true },
    { id: 'L-105', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isAvailable: false },
    { id: 'L-106', title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', isAvailable: false },
    { id: 'L-107', title: "You Don't Know JS Yet", author: 'Kyle Simpson', isAvailable: true },
    { id: 'L-108', title: 'Database System Concepts', author: 'Abraham Silberschatz', isAvailable: false },
    { id: 'L-109', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', isAvailable: true },
    { id: 'L-110', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isAvailable: false },
    { id: 'L-111', title: 'Operating System Concepts', author: 'Abraham Silberschatz', isAvailable: true },
    { id: 'L-112', title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler', isAvailable: true },
    { id: 'L-113', title: 'Head First Design Patterns', author: 'Eric Freeman & Elisabeth Robson', isAvailable: false },
    { id: 'L-114', title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', isAvailable: true },
    { id: 'L-115', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isAvailable: false },
    { id: 'L-116', title: "Computer Systems: A Programmer's Perspective", author: 'Randal E. Bryant', isAvailable: true },
    { id: 'L-117', title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', isAvailable: false }
];

/**
 * Initialization & LocalStorage (Bonus Enhancement)
 */
function loadInitialMaterials() {
    libraryItems = defaultMaterials.map(item => 
        new LibraryItem(item.id, item.title, item.author, item.isAvailable)
    );
    saveToStorage();
}

function initApp() {
    const storedData = localStorage.getItem('nu_library_records');
    if (storedData) {
        // Map raw JSON objects back to LibraryItem class instances
        const parsedData = JSON.parse(storedData);
        if (parsedData.length <= 3) {
            loadInitialMaterials();
        } else {
            libraryItems = parsedData.map(item => new LibraryItem(item.id, item.title, item.author, item.isAvailable));
        }
    } else {
        // Load sample data if local storage is empty
        loadInitialMaterials();
    }
    renderUI();
}

function saveToStorage() {
    localStorage.setItem('nu_library_records', JSON.stringify(libraryItems));
    renderUI();
}

/**
 * Event Handling & Input Validation
 */
addForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    const titleVal = titleInput.value.trim();
    const authorVal = authorInput.value.trim();
    let isValid = true;

    // Form Validation using classList to toggle visibility
    if (!titleVal) {
        titleError.classList.remove('hidden');
        isValid = false;
    } else {
        titleError.classList.add('hidden');
    }

    if (!authorVal) {
        authorError.classList.remove('hidden');
        isValid = false;
    } else {
        authorError.classList.add('hidden');
    }

    // Stop execution if validation fails
    if (!isValid) return;

    // Create new object from class and add to array
    const newId = 'L-' + Date.now().toString().slice(-4);
    const newItem = new LibraryItem(newId, titleVal, authorVal);
    libraryItems.push(newItem);

    // Reset form fields
    titleInput.value = '';
    authorInput.value = '';

    saveToStorage();
});

/**
 * Status Change / Business Logic Handler
 */
window.toggleItemStatus = function (id) {
    const targetItem = libraryItems.find(item => item.id === id);

    if (targetItem) {
        if (targetItem.isAvailable) {
            targetItem.borrowItem(); // Trigger business rule application
        } else {
            targetItem.returnItem();
        }
        saveToStorage();
    }
};

/**
 * Removal Operation
 */
window.deleteItemRecord = function (id) {
    libraryItems = libraryItems.filter(item => item.id !== id);
    saveToStorage();
};

/**
 * Dynamic Interface Rendering & DOM Manipulation
 */
function renderUI() {
    // Clear existing list
    itemList.innerHTML = '';

    let availableTracker = 0;
    let borrowedTracker = 0;

    if (libraryItems.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');

        // Dynamic creation of elements
        libraryItems.forEach(item => {
            // Update counter logic
            if (item.isAvailable) availableTracker++;
            else borrowedTracker++;

            const li = document.createElement('li');

            // Requirement: classList used for UI state based on item status
            if (!item.isAvailable) {
                li.classList.add('bg-slate-50', 'opacity-80');
            } else {
                li.classList.add('bg-white');
            }
            li.classList.add('p-4', 'flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'justify-between', 'gap-4', 'transition-all', 'hover:bg-slate-50');

            const badgeHTML = item.isAvailable
                ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Available</span>`
                : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Borrowed</span>`;

            const actionBtnHTML = item.isAvailable
                ? `<button onclick="toggleItemStatus('${item.id}')" class="text-sm bg-white text-slate-600 hover:text-amber-600 font-medium px-3 py-1.5 border border-slate-200 hover:border-amber-200 rounded-lg shadow-sm transition-colors">Borrow Item</button>`
                : `<button onclick="toggleItemStatus('${item.id}')" class="text-sm bg-white text-slate-600 hover:text-emerald-600 font-medium px-3 py-1.5 border border-slate-200 hover:border-emerald-200 rounded-lg shadow-sm transition-colors">Return Item</button>`;

            li.innerHTML = `
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-slate-800">${item.title}</h3>
                        ${badgeHTML}
                    </div>
                    <p class="text-sm text-slate-500">Author: ${item.author} <span class="mx-2 text-slate-300">•</span> ID: ${item.id}</p>
                </div>
                <div class="flex items-center gap-2">
                    ${actionBtnHTML}
                    <button onclick="deleteItemRecord('${item.id}')" class="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg transition-colors" title="Remove from database">Delete</button>
                </div>
            `;
            itemList.appendChild(li);
        });
    }

    // Update Dynamic Counters
    totalCount.textContent = libraryItems.length;
    availableCount.textContent = availableTracker;
    borrowedCount.textContent = borrowedTracker;
}

// Boot the application
initApp();