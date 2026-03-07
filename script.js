/**
 * Asterbourne Chinese Takeaway - Core Logic
 * Handles Data Loading, Search, and Category Navigation
 */

// Global variable to store menu data for searching
let menuData = null;

/**
 * 1. Initialize Menu on Page Load
 */
async function initMenu() {
    try {
        // Fetch the definitive menu.json file
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error("Could not load menu.json");
        
        menuData = await response.json();
        
        const mainMenu = document.getElementById('mainMenu');
        const catNav = document.getElementById('catNav');
        const setDinnerContent = document.getElementById('setDinnerContent');

        // Clear existing content if any
        mainMenu.innerHTML = '';
        catNav.innerHTML = '';
        setDinnerContent.innerHTML = '';

        // 2. Loop through all 18+ categories
        menuData.categories.forEach(cat => {
            // A. Create Category Navigation Button
            const navLink = document.createElement('a');
            navLink.href = `#${cat.id}`;
            navLink.className = 'cat-btn';
            // We use the first two words of the category name for the button to save space on mobile
            navLink.innerText = cat.name.split(' ').slice(0, 2).join(' '); 
            catNav.appendChild(navLink);

            // B. Create Menu Section
            const section = document.createElement('section');
            section.className = 'menu-section';
            section.id = cat.id;
            
            let sectionHtml = `<h2>${cat.name}</h2>`;
            
            // C. Loop through every item in this category
            cat.items.forEach(item => {
                sectionHtml += `
                    <div class="item-row">
                        <div class="item-info">
                            <span class="item-no">${item.no}.</span>
                            <span class="item-name">${item.name}</span>
                            ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ''}
                        </div>
                        <div class="item-price">${item.price}</div>
                    </div>
                `;
            });
            
            section.innerHTML = sectionHtml;
            mainMenu.appendChild(section);
        });

        // 3. Build the Special Set Dinners at the bottom
        menuData.setDinners.forEach(set => {
            const card = document.createElement('div');
            card.className = 'set-card';
            card.innerHTML = `
                <h3>${set.name} <span class="set-price">${set.price}</span></h3>
                <p style="font-size:0.9rem; line-height:1.4; color: #444;">${set.details}</p>
            `;
            setDinnerContent.appendChild(card);
        });

    } catch (error) {
        console.error("Critical Error:", error);
        document.getElementById('mainMenu').innerHTML = `
            <div style="padding: 20px; color: red; text-align: center;">
                <h3>Error Loading Menu</h3>
                <p>Please ensure 'menu.json' is uploaded to the same folder as this file.</p>
            </div>
        `;
    }
}

/**
 * 4. Real-time Search Logic
 * Filters through 190+ items instantly as the user types
 */
function filterMenu() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sections = document.querySelectorAll('.menu-section');

    sections.forEach(section => {
        // We don't want to filter the Set Dinners via search usually, 
        // but if we do, we skip the section title check
        if (section.id === 'setDinners') return;

        const rows = section.querySelectorAll('.item-row');
        let sectionHasVisibleItems = false;

        rows.forEach(row => {
            const itemText = row.innerText.toLowerCase();
            if (itemText.includes(searchTerm)) {
                row.style.display = 'flex';
                sectionHasVisibleItems = true;
            } else {
                row.style.display = 'none';
            }
        });

        // If no items in a category match the search, hide the whole category header
        section.style.display = sectionHasVisibleItems ? 'block' : 'none';
    });
}

/**
 * 5. Smooth Scroll Fix
 * Ensures clicking category buttons scrolls perfectly on all mobile browsers
 */
document.querySelectorAll('.cat-btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 120, // Offset for sticky search bar
                behavior: 'smooth'
            });
        }
    });
});

// Run the initialization
window.onload = initMenu;
