// ==========================================
// SCHEDULE I PRO - APP LOGIC
// ==========================================

// Estado global
let favorites = JSON.parse(localStorage.getItem('s1_favorites') || '[]');
let calcBase = null;
let calcIngredients = [];
let currentFilter = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    renderRecipes('all');
    initCalculator();
});

// ==========================================
// NAVEGACIÓN
// ==========================================
function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
    document.getElementById('section-' + section).classList.remove('hidden');

    // Actualizar tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
    });
    document.querySelector('[data-section="' + section + '"]').classList.remove('tab-inactive');
    document.querySelector('[data-section="' + section + '"]').classList.add('tab-active');

    // Inicializar componentes específicos
    if (section === 'dashboard') initChart();
    if (section === 'recipes') renderRecipes(currentFilter);
    if (section === 'calculator') initCalculator();
}

// ==========================================
// RECETAS - Renderizado y Filtrado
// ==========================================
function renderRecipes(filter) {
    currentFilter = filter;
    const grid = document.getElementById('recipes-grid');
    const search = document.getElementById('search-input')?.value.toLowerCase() || '';
    const rankFilter = document.getElementById('rank-filter')?.value || '';

    let filtered = recipes.filter(r => {
        if (filter !== 'all' && r.category !== filter && r.type !== filter) return false;
        if (search && !r.name.toLowerCase().includes(search) && 
            !r.ingredients.some(i => i.name.toLowerCase().includes(search)) &&
            !r.effects.some(e => e.toLowerCase().includes(search))) return false;
        if (rankFilter && !r.rank.includes(rankFilter)) return false;
        return true;
    });

    // Ordenar por ganancia (mayor a menor)
    filtered.sort((a, b) => b.profit - a.profit);

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">No se encontraron recetas</div>';
        return;
    }

    grid.innerHTML = filtered.map(r => {
        const isFav = favorites.includes(r.id);
        const profitClass = r.profit >= 200 ? 'text-green-400' : 
                           r.profit >= 100 ? 'text-blue-400' : 
                           r.profit > 0 ? 'text-yellow-400' : 'text-red-400';
        const categoryColor = r.category === 'early' ? 'border-green-500' : 
                             r.category === 'mid' ? 'border-blue-500' : 'border-purple-500';

        return `
            <div class="glass-card rounded-2xl p-6 border-l-4 ${categoryColor} relative overflow-hidden">
                ${isFav ? '<div class="absolute top-4 right-4 text-yellow-400"><i class="fas fa-star"></i></div>' : ''}

                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl">${r.baseIcon}</span>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold">${r.name}</h3>
                        <span class="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            <i class="fas fa-lock mr-1"></i>${r.rank}
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    ${r.ingredients.map(i => `
                        <span class="px-2 py-1 rounded-lg bg-white/5 text-xs border border-white/10 flex items-center gap-1" title="$${i.price}">
                            <span>${i.icon}</span>
                            <span class="hidden sm:inline">${i.name}</span>
                        </span>
                    `).join('')}
                </div>

                <div class="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div class="bg-white/5 rounded-lg p-2">
                        <div class="text-gray-400 text-xs">Costo</div>
                        <div class="font-mono font-semibold">$${r.cost}</div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2">
                        <div class="text-gray-400 text-xs">Venta</div>
                        <div class="font-mono text-green-400 font-semibold">$${r.sellPrice}</div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2">
                        <div class="text-gray-400 text-xs">Ganancia</div>
                        <div class="font-mono ${profitClass} font-bold text-lg">$${r.profit}</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    ${r.effects.slice(0, 4).map(e => `
                        <span class="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${e}</span>
                    `).join('')}
                    ${r.effects.length > 4 ? `<span class="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-400">+${r.effects.length - 4}</span>` : ''}
                </div>

                <div class="flex gap-2">
                    <button onclick="toggleFavorite(${r.id})" class="flex-1 py-2 rounded-xl ${isFav ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-gray-400 border border-white/10'} hover:bg-white/10 transition-all text-sm">
                        <i class="fas ${isFav ? 'fa-star' : 'fa-star-o'} mr-2"></i>${isFav ? 'Favorito' : 'Favorito'}
                    </button>
                    <button onclick="copyRecipe(${r.id})" class="px-4 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all text-sm">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterRecipes(cat) {
    // Actualizar chips visuales
    document.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.remove('bg-indigo-500/20', 'text-indigo-300', 'border-indigo-500/30');
        c.classList.add('bg-white/5', 'text-gray-400', 'border-white/10');
    });
    const activeChip = document.querySelector('[data-filter="' + cat + '"]');
    if (activeChip) {
        activeChip.classList.remove('bg-white/5', 'text-gray-400', 'border-white/10');
        activeChip.classList.add('bg-indigo-500/20', 'text-indigo-300', 'border-indigo-500/30');
    }
    renderRecipes(cat);
}

function searchRecipes() {
    renderRecipes(currentFilter);
}

function applyFilters() {
    renderRecipes(currentFilter);
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('s1_favorites', JSON.stringify(favorites));
    renderRecipes(currentFilter);
}

function copyRecipe(id) {
    const r = recipes.find(recipe => recipe.id === id);
    if (!r) return;

    const text = `**${r.name}** (${r.rank})
Base: ${r.base}
Ingredientes: ${r.ingredients.map(i => i.name).join(' → ')}
Costo: $${r.cost} | Venta: $${r.sellPrice} | Ganancia: $${r.profit}
Efectos: ${r.effects.join(', ')}`;

    navigator.clipboard.writeText(text).then(() => {
        // Feedback visual
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check text-green-400"></i>';
        setTimeout(() => btn.innerHTML = originalHTML, 1000);
    });
}

// ==========================================
// CALCULADORA
// ==========================================
function initCalculator() {
    const basesContainer = document.getElementById('calc-bases');
    if (!basesContainer) return;

    const bases = [
        {name: 'OG Kush', cost: 30, price: 38, icon: '🌿'},
        {name: 'Sour Diesel', cost: 35, price: 40, icon: '🍃'},
        {name: 'Green Crack', cost: 40, price: 43, icon: '⚡'},
        {name: 'Grandaddy Purple', cost: 45, price: 45, icon: '🍇'},
        {name: 'Meth', cost: 80, price: 70, icon: '💎'},
        {name: 'Cocaine', cost: 150, price: 150, icon: '❄️'}
    ];

    basesContainer.innerHTML = bases.map(b => `
        <button onclick="selectCalcBase('${b.name}', ${b.cost}, ${b.price}, '${b.icon}')" 
                class="calc-base-btn p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all text-left ${calcBase?.name === b.name ? 'border-indigo-500 bg-indigo-500/20' : ''}">
            <div class="text-2xl mb-1">${b.icon}</div>
            <div class="text-sm font-medium">${b.name}</div>
            <div class="text-xs text-gray-400">$${b.cost} → $${b.price}</div>
        </button>
    `).join('');

    const ingredientsContainer = document.getElementById('calc-ingredients');
    if (!ingredientsContainer) return;

    const ingredients = [
        {icon: '🥒', name: 'Cuke', price: 2, effect: 'Energizing'},
        {icon: '🍌', name: 'Banana', price: 2, effect: 'Gingeritis'},
        {icon: '💊', name: 'Paracetamol', price: 3, effect: 'Sneaky'},
        {icon: '🍩', name: 'Donut', price: 3, effect: 'Calorie-Dense'},
        {icon: '💙', name: 'Viagra', price: 4, effect: 'Tropic Thunder'},
        {icon: '🧴', name: 'Mouth Wash', price: 4, effect: 'Balding'},
        {icon: '🤧', name: 'Flu Medicine', price: 5, effect: 'Sedating'},
        {icon: '⛽', name: 'Gasoline', price: 5, effect: 'Toxic'},
        {icon: '🥤', name: 'Energy Drink', price: 6, effect: 'Athletic'},
        {icon: '🛢️', name: 'Motor Oil', price: 6, effect: 'Slippery'},
        {icon: '🫘', name: 'Mega Bean', price: 7, effect: 'Foggy'},
        {icon: '🌶️', name: 'Chili', price: 7, effect: 'Spicy'},
        {icon: '🔋', name: 'Battery', price: 8, effect: 'Bright-Eyed'},
        {icon: '🧪', name: 'Iodine', price: 8, effect: 'Jennerising'},
        {icon: '💉', name: 'Addy', price: 9, effect: 'Thought-Provoking'},
        {icon: '🐴', name: 'Horse Semen', price: 9, effect: 'Long Faced'}
    ];

    ingredientsContainer.innerHTML = ingredients.map(i => `
        <button onclick="addCalcIngredient('${i.name}', ${i.price}, '${i.effect}', '${i.icon}')" 
                class="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500 transition-all text-center ${calcIngredients.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}">
            <div class="text-2xl">${i.icon}</div>
            <div class="text-xs mt-1">$${i.price}</div>
        </button>
    `).join('');

    updateCalcDisplay();
}

function selectCalcBase(name, cost, price, icon) {
    calcBase = {name, cost, price, icon};
    calcIngredients = [];
    initCalculator(); // Re-render para actualizar estados
    updateCalcDisplay();
}

function addCalcIngredient(name, price, effect, icon) {
    if (!calcBase) {
        alert('Selecciona una base primero');
        return;
    }
    if (calcIngredients.length >= 8) {
        alert('Máximo 8 ingredientes');
        return;
    }
    calcIngredients.push({name, price, effect, icon});
    updateCalcDisplay();
}

function clearCalc() {
    calcBase = null;
    calcIngredients = [];
    initCalculator();
    updateCalcDisplay();
}

function updateCalcDisplay() {
    const stepsContainer = document.getElementById('calc-steps');
    const costEl = document.getElementById('calc-cost');
    const sellEl = document.getElementById('calc-sell');
    const profitEl = document.getElementById('calc-profit');

    if (!calcBase) {
        if (stepsContainer) stepsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Selecciona una base para comenzar</p>';
        if (costEl) costEl.textContent = '$0';
        if (sellEl) sellEl.textContent = '$0';
        if (profitEl) profitEl.textContent = '$0';
        return;
    }

    let totalCost = calcBase.cost;
    let effects = [];
    let steps = [`
        <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="flex items-center gap-3">
                <span class="text-2xl">${calcBase.icon}</span>
                <div class="flex-1">
                    <div class="font-medium">${calcBase.name}</div>
                    <div class="text-xs text-gray-400">Base: $${calcBase.cost} → $${calcBase.price}</div>
                </div>
            </div>
        </div>
    `];

    calcIngredients.forEach((ing, idx) => {
        totalCost += ing.price;
        if (!effects.includes(ing.effect)) effects.push(ing.effect);

        steps.push(`
            <div class="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 relative">
                <button onclick="removeCalcIngredient(${idx})" class="absolute top-2 right-2 text-red-400 hover:text-red-300 text-xs">
                    <i class="fas fa-times"></i>
                </button>
                <div class="flex items-center gap-3">
                    <span class="text-xl">${ing.icon}</span>
                    <div class="flex-1">
                        <div class="text-sm font-medium">${ing.name}</div>
                        <div class="text-xs text-indigo-300">+${ing.effect}</div>
                    </div>
                    <span class="text-xs text-gray-400">$${ing.price}</span>
                </div>
            </div>
        `);
    });

    // Calcular multiplicador
    let multiplier = 1;
    effects.forEach(e => {
        if (effectMultipliers[e]) multiplier += effectMultipliers[e];
    });

    const sellPrice = Math.round(calcBase.price * multiplier);
    const profit = sellPrice - totalCost;

    if (stepsContainer) stepsContainer.innerHTML = steps.join('');
    if (costEl) costEl.textContent = '$' + totalCost;
    if (sellEl) sellEl.textContent = '$' + sellPrice;
    if (profitEl) profitEl.textContent = '$' + profit;
}

function removeCalcIngredient(index) {
    calcIngredients.splice(index, 1);
    updateCalcDisplay();
}

// ==========================================
// OPTIMIZADOR
// ==========================================
function optimizeBudget() {
    const budgetInput = document.getElementById('budget-input');
    const resultDiv = document.getElementById('optimizer-result');

    if (!budgetInput || !resultDiv) return;

    const budget = parseInt(budgetInput.value);
    if (!budget || budget <= 0) {
        alert('Ingresa un presupuesto válido');
        return;
    }

    // Filtrar recetas que se puedan hacer con el presupuesto
    const affordable = recipes.filter(r => r.cost <= budget).sort((a, b) => b.profit - a.profit);

    resultDiv.classList.remove('hidden');

    if (affordable.length === 0) {
        resultDiv.innerHTML = `
            <div class="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                No hay recetas disponibles para $${budget}
            </div>
        `;
        return;
    }

    const best = affordable[0];
    const roi = Math.round((best.profit / best.cost) * 100);

    resultDiv.innerHTML = `
        <div class="glass-card rounded-2xl p-6 border-2 border-green-500/30">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-green-400">
                    <i class="fas fa-trophy mr-2"></i>Mejor opción para $${budget}
                </h3>
                <span class="text-2xl">${best.baseIcon}</span>
            </div>

            <div class="mb-4">
                <div class="text-2xl font-bold">${best.name}</div>
                <div class="text-sm text-gray-400">${best.rank} • ${best.base}</div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
                ${best.ingredients.map(i => `
                    <span class="px-2 py-1 rounded-lg bg-white/5 text-xs border border-white/10">${i.icon} ${i.name}</span>
                `).join('')}
            </div>

            <div class="grid grid-cols-4 gap-2 text-center text-sm">
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-gray-400 text-xs">Inversión</div>
                    <div class="font-mono font-semibold">$${best.cost}</div>
                </div>
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-gray-400 text-xs">Retorno</div>
                    <div class="font-mono text-green-400 font-semibold">$${best.sellPrice}</div>
                </div>
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-gray-400 text-xs">Ganancia</div>
                    <div class="font-mono text-yellow-400 font-bold text-lg">$${best.profit}</div>
                </div>
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-gray-400 text-xs">ROI</div>
                    <div class="font-mono text-indigo-400 font-semibold">${roi}%</div>
                </div>
            </div>

            ${affordable.length > 1 ? `
                <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400 mb-2">Alternativas con buen ROI:</div>
                    <div class="space-y-2">
                        ${affordable.slice(1, 4).map(alt => `
                            <div class="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                                <span>${alt.name}</span>
                                <span class="font-mono text-green-400">$${alt.profit} (${Math.round((alt.profit/alt.cost)*100)}%)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ==========================================
// GRÁFICOS
// ==========================================
function initChart() {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (window.profitChart) {
        window.profitChart.destroy();
    }

    window.profitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['OG Kush', 'Sour Diesel', 'Green Crack', 'Grandaddy P', 'Meth', 'Cocaine'],
            datasets: [{
                label: 'Ganancia Máxima ($)',
                data: [112, 97, 100, 79, 229, 565],
                backgroundColor: [
                    'rgba(34,197,94,0.6)',
                    'rgba(34,197,94,0.6)',
                    'rgba(59,130,246,0.6)',
                    'rgba(59,130,246,0.6)',
                    'rgba(168,85,247,0.6)',
                    'rgba(234,179,8,0.6)'
                ],
                borderColor: [
                    'rgb(34,197,94)',
                    'rgb(34,197,94)',
                    'rgb(59,130,246)',
                    'rgb(59,130,246)',
                    'rgb(168,85,247)',
                    'rgb(234,179,8)'
                ],
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: 'rgba(255,255,255,0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255,255,255,0.7)' }
                }
            }
        }
    });
}

// ==========================================
// UTILIDADES
// ==========================================
// Exportar datos para consola/debug
window.exportData = function() {
    const data = {
        recipes: recipes,
        favorites: favorites,
        stats: {
            total: recipes.length,
            avgProfit: Math.round(recipes.reduce((a,b) => a + b.profit, 0) / recipes.length),
            bestProfit: Math.max(...recipes.map(r => r.profit))
        }
    };
    console.log('Schedule I Pro Data:', data);
    return data;
};

// Atajo de teclado para debug
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});