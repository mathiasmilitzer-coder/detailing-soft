import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import path from 'path';

// Supabase Konfiguration aus den Umgebungsvariablen
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE_NAME = 'services';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'services.json');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchAndSync() {
    console.log(`Lade Daten von Supabase Tabelle: ${TABLE_NAME}`);
    
    // Daten von Supabase abrufen
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('id, artikelnummer, dienstleistung, beschreibung, fahrzeugart, ort, einheit, steuerart, vk_netto')
        .order('id', { ascending: true });

    if (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        throw error;
    }

    // Daten in JSON-Format konvertieren
    const jsonContent = JSON.stringify(data, null, 2);

    // JSON-Datei in das lokale Verzeichnis schreiben
    await fs.writeFile(OUTPUT_FILE, jsonContent, 'utf-8');

    console.log(`Daten erfolgreich in ${OUTPUT_FILE} geschrieben.`);
}

fetchAndSync().catch(err => {
    console.error('Synchronisationsfehler:', err.message);
    process.exit(1);
});
