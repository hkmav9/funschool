/* modules.js - Pluggable module registry */

const FunSchool = {
    modules: {},
    currentModule: null,
    currentScreen: 'home'
};

function registerModule(config) {
    FunSchool.modules[config.id] = config;
}

function getModule(id) {
    return FunSchool.modules[id] || null;
}

function getAllModules() {
    return Object.values(FunSchool.modules);
}

function getModulesByCategory(category) {
    return getAllModules().filter(m => m.category === category);
}

function getCategories() {
    const cats = new Set(getAllModules().map(m => m.category));
    return Array.from(cats);
}
