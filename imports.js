const dateien = [
    "public/js/modal.js",
    "public/js/scroll.js",
    "public/js/search.js"
];

dateien.forEach(async (datei) => {
    try {
        await import(`./${datei}`);
    } catch (error) {
        console.error('Fehler beim Importieren der Datei:', datei, error+error.stack);
    }
});