/* storage.js - localStorage persistence layer */

const STORAGE_KEY = 'funschool_data';

function getDefaultData() {
    return {
        version: 1,
        settings: {
            soundEnabled: true
        },
        totalStars: 0,
        modules: {
            'math-addition': {
                level: 1,
                correctCount: 0,
                totalAttempts: 0,
                stars: 0
            },
            'science-planets': {
                exploredPlanets: [],
                quizCorrect: 0,
                quizTotal: 0,
                stars: 0
            }
        }
    };
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return getDefaultData();
        const data = JSON.parse(raw);
        // Merge with defaults to handle new fields
        const defaults = getDefaultData();
        return {
            ...defaults,
            ...data,
            settings: { ...defaults.settings, ...data.settings },
            modules: {
                ...defaults.modules,
                ...data.modules
            }
        };
    } catch (e) {
        return getDefaultData();
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getModuleData(moduleId) {
    const data = loadData();
    return data.modules[moduleId] || {};
}

function updateModuleData(moduleId, updates) {
    const data = loadData();
    if (!data.modules[moduleId]) data.modules[moduleId] = {};
    Object.assign(data.modules[moduleId], updates);
    saveData(data);
    return data;
}

function addStars(count) {
    const data = loadData();
    data.totalStars += count;
    saveData(data);
    return data.totalStars;
}

function getTotalStars() {
    return loadData().totalStars;
}

function getSettings() {
    return loadData().settings;
}

function updateSettings(updates) {
    const data = loadData();
    Object.assign(data.settings, updates);
    saveData(data);
    return data.settings;
}

function resetAllProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultData()));
}
