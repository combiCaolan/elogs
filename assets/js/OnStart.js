//WHEN AND WHAT TO DELETE - SHOULD MOVE TO CLOSE Function

/**
 * Sets the default language in sessionStorage if not already set.
 */
// function setDefaultLanguage() {
//   if (!sessionStorage.getItem('Language')) {
//     sessionStorage.setItem('Language', 'english');
//   }
// }

/**
 * Fetches a text file and returns its contents.
 * @param {string} path - The path to the file.
 * @returns {Promise<string|null>} The file contents or null if fetch fails.
 */
async function fetchTextFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch ${path}`);
    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Loads the translation file into sessionStorage if not already present.
 * @returns {Promise<void>}
 */
// async function loadTranslateFile() {
//   if (!sessionStorage.getItem('LanguageFile')) {
//     const file = `Dictionary/${sessionStorage.getItem('Language')}/TranslateFile.txt`;
//     const text = await fetchTextFile(file);
//     if (text !== null) {
//       sessionStorage.setItem('LanguageFile', text);
//     }
//   }
// }

/**
 * Loads log definition dictionaries into sessionStorage if not already present.
 * @returns {Promise<void>}
 */
async function loadLogDefinitionFile() {
  if (!sessionStorage.getItem('LabelDictionary')) {
    const file = `Dictionary/${sessionStorage.getItem('Language')}/LogDefinitionFile.txt`;
    const text = await fetchTextFile(file);
    if (text !== null) {
      const lines = text.split('\n');
      const LabelDictionary = {};
      const ScaleDictionary = {};
      const UnitsDictionary = {};
      const DescriptionDictionary = {};

      lines.forEach(line => {
        const [index, label, scale, units, description] = line.split(',');
        if (index) {
          LabelDictionary[index] = label;
          ScaleDictionary[index] = scale;
          UnitsDictionary[index] = units;
          DescriptionDictionary[index] = description;
        }
      });

      sessionStorage.setItem('LabelDictionary', JSON.stringify(LabelDictionary));
      sessionStorage.setItem('ScaleDictionary', JSON.stringify(ScaleDictionary));
      sessionStorage.setItem('UnitsDictionary', JSON.stringify(UnitsDictionary));
      sessionStorage.setItem('DescriptionDictionary', JSON.stringify(DescriptionDictionary));
    }
  } else {
    // Load dictionaries from sessionStorage into global variables for compatibility
    window.LabelDictionary = JSON.parse(sessionStorage.getItem('LabelDictionary'));
    window.ScaleDictionary = JSON.parse(sessionStorage.getItem('ScaleDictionary'));
    window.UnitsDictionary = JSON.parse(sessionStorage.getItem('UnitsDictionary'));
    window.DescriptionDictionary = JSON.parse(sessionStorage.getItem('DescriptionDictionary'));
  }
}

loadLogDefinitionFile();

/**
 * Loads log structure dictionary into sessionStorage if not already present.
 * @param {number} accessLevelForUser - The user's access level.
 * @returns {Promise<void>}
 */
async function loadLogStructureFile(accessLevelForUser) {
  if (!sessionStorage.getItem('LogStructure')) {
    const file = accessLevelForUser > 6
      ? `Dictionary/${sessionStorage.getItem('Language')}/LogStructure_Combi.txt`
      : `Dictionary/${sessionStorage.getItem('Language')}/LogStructure.txt`;
    const text = await fetchTextFile(file);
    if (text !== null) {
      sessionStorage.setItem('LogStructure', text);
      const lines = text.split('\n');
      const LogStructure_Dict = {};

      lines.forEach(line => {
        const items = line.split(',');
        if (items[0]) {
          LogStructure_Dict[items[0]] = items;
        }
      });

      sessionStorage.setItem('LogStructure_Dict', JSON.stringify(LogStructure_Dict));
    }
  }
}

/**
 * Loads Dictionary3.txt and parses it into LogKey.
 * @returns {Promise<void>}
 */
async function loadDictionary3File() {
  const file = `Dictionary/${sessionStorage.getItem('Language')}/Dictionary3.txt`;
  const text = await fetchTextFile(file);
  if (text !== null) {
    const lines = text.split('\n');
    const LogKey = {};
    lines.forEach(line => {
      const [rawKey, ...rest] = line.split(':');
      if (rawKey && rest.length) {
        const key = rawKey.replace(/ /g, '');
        const value = rest.join(':');
        LogKey[key] = value;
      }
    });
    // For compatibility, assign to global variable
    window.LogKey = LogKey;
  }
}

/**
 * Main startup function to initialize dictionaries and language files.
 * @param {number} accessLevelForUser - The user's access level.
 * @returns {Promise<void>}
 */
async function OnStart(accessLevelForUser = 0) {
  setDefaultLanguage();
  await loadLogDefinitionFile();
  // await loadTranslateFile();
  await loadLogStructureFile(accessLevelForUser);
  await loadDictionary3File();
}

// Example usage: call OnStart with the user's access level
// OnStart(AccessLevelForUser);
OnStart(8); // Replace 8 with the actual access level of the user
