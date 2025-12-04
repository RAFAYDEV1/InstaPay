// Quick fix script - adds the missing ApiService import
// Run this from the backend directory: node add-import-fix.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'signup', 'phone.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Check if ApiService is already imported
if (content.includes('import ApiService')) {
    console.log('✅ ApiService is already imported!');
    process.exit(0);
}

// Find the line with } from 'react-native';
const searchLine = "} from 'react-native';";
const importLine = "import ApiService from '../../services/api.service';";

if (content.includes(searchLine)) {
    // Add the import after the react-native import
    content = content.replace(
        searchLine,
        searchLine + '\n' + importLine
    );

    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Successfully added ApiService import!');
    console.log('   Added line:', importLine);
} else {
    console.log('❌ Could not find the insertion point');
    console.log('   Please add this line manually after the react-native import:');
    console.log('   ' + importLine);
}
