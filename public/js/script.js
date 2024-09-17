document.addEventListener('DOMContentLoaded', () => {
    const pingForm = document.getElementById('pingForm');
    const urlInput = document.getElementById('urlInput');
    const resultsList = document.getElementById('resultsList');

    let sites = JSON.parse(localStorage.getItem('pingedSites')) || [];

    // Ajouter https://google.com comme exemple si aucun site n'est enregistré
    if (sites.length === 0) {
        sites.push({
            url: 'https://google.com',
            status: 200,
            pingTime: '100ms',
            timestamp: Date.now(),
            favorite: false
        });
        localStorage.setItem('pingedSites', JSON.stringify(sites));
    }

    function getStatusColor(status) {
        if (status >= 200 && status < 300) return 'text-green-500';
        if (status >= 300 && status < 400) return 'text-yellow-500';
        if (status >= 400 && status < 500) return 'text-orange-500';
        if (status >= 500) return 'text-red-500';
        return 'text-gray-500';
    }

    function updateUI() {
        resultsList.innerHTML = '';
        // Trier les sites du plus récent au plus ancien
        sites.sort((a, b) => b.timestamp - a.timestamp);
        sites.forEach((site, index) => {
            const siteElement = document.createElement('div');
            siteElement.className = 'bg-gray-800 p-6 rounded-lg shadow-lg mb-4';
            
            if (site.error) {
                siteElement.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">${site.url}</h3>
                        <button class="delete-btn text-red-500 hover:text-red-300" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <p class="text-red-500">Erreur: Impossible de pinger le site</p>
                `;
            } else {
                siteElement.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">${site.url}</h3>
                        <div>
                            <button class="reping-btn text-accent hover:text-accent-light mr-2" data-index="${index}">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button class="favorite-btn text-yellow-500 hover:text-yellow-300 mr-2" data-index="${index}">
                                <i class="fas ${site.favorite ? 'fa-star' : 'fa-star-o'}"></i>
                            </button>
                            <button class="delete-btn text-red-500 hover:text-red-300" data-index="${index}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <p class="mb-2">Status: <span class="${getStatusColor(site.status)}">${site.status}</span></p>
                    <p class="mb-2">Ping Time: <span class="bg-accent text-white px-2 py-1 rounded-full text-sm">${site.pingTime}</span></p>
                `;
            }
            resultsList.appendChild(siteElement);
        });

        // Add event listeners for buttons
        document.querySelectorAll('.reping-btn').forEach(btn => {
            btn.addEventListener('click', () => rePing(btn.dataset.index));
        });
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleFavorite(btn.dataset.index));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteSite(btn.dataset.index));
        });
    }

    pingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let url = urlInput.value.trim();
        
        // Ajouter automatiquement https:// si nécessaire
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        try {
            const response = await fetch('/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            if (data.error) {
                sites.unshift({
                    url,
                    error: true,
                    timestamp: Date.now(),
                    favorite: false
                });
            } else {
                sites.unshift({
                    url,
                    ...data,
                    timestamp: Date.now(),
                    favorite: false
                });
            }
            localStorage.setItem('pingedSites', JSON.stringify(sites));
            updateUI();
            urlInput.value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function rePing(index) {
        const site = sites[index];
        try {
            const response = await fetch('/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: site.url }),
            });
            const data = await response.json();
            if (data.error) {
                sites[index] = {
                    ...site,
                    error: true,
                    timestamp: Date.now()
                };
            } else {
                sites[index] = {
                    ...site,
                    ...data,
                    error: false,
                    timestamp: Date.now()
                };
            }
            localStorage.setItem('pingedSites', JSON.stringify(sites));
            updateUI();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function toggleFavorite(index) {
        sites[index].favorite = !sites[index].favorite;
        localStorage.setItem('pingedSites', JSON.stringify(sites));
        updateUI();
    }

    function deleteSite(index) {
        sites.splice(index, 1);
        localStorage.setItem('pingedSites', JSON.stringify(sites));
        updateUI();
    }

    updateUI();
});