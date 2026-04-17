const fs = require('fs');

const htmlFile = 'index.html';
const cssFile = 'styles.css';
const jsFile = 'script.js';

let html = fs.readFileSync(htmlFile, 'utf8');

const headJsRegex = /<script>\s*\/\/\s*Global error listener[\s\S]*?<\/script>/;
const mainJsRegex = /<script>\s*\(function \(\) \{[\s\S]*?<\/script>/;
const cssRegex = /<style>[\s\S]*?<\/style>/;

let combinedJs = '';

const headJsMatch = html.match(headJsRegex);
if (headJsMatch) {
    let code = headJsMatch[0].replace(/<\/?script>/g, '').trim();
    combinedJs += code + '\n\n';
    // Remove it from head
    html = html.replace(headJsRegex, '');
}

const mainJsMatch = html.match(mainJsRegex);
if (mainJsMatch) {
    let code = mainJsMatch[0].replace(/<\/?script>/g, '').trim();
    // Wrap the IIFE inside DOMContentLoaded since we might move the tag
    code = `document.addEventListener('DOMContentLoaded', function() {\n${code}\n});`;
    combinedJs += code + '\n';
    
    // Replace the bottom script block with a link to our new script file
    html = html.replace(mainJsRegex, '<script src="script.js"></script>');
} else {
    html = html.replace('</body>', '<script src="script.js"></script>\n</body>');
}

// Add the script to the head? No, let's keep script.js at the bottom where it was.
// BUT since the error listener is inside script.js, it might run too late if it's at the bottom.
// So we should put script.js in the head! Wait, the DOM content loaded listener handles the main logic.
// Let's replace the head `<script>...` with the external link, and remove the bottom one.

if (headJsMatch) {
    // Put script link in head
    html = html.replace('</head>', '    <script src="script.js"></script>\n</head>');
}

if (combinedJs) {
    fs.writeFileSync(jsFile, combinedJs, 'utf8');
}

const cssMatch = html.match(cssRegex);
if (cssMatch) {
    let code = cssMatch[0].replace(/<\/?style>/g, '').trim();
    fs.writeFileSync(cssFile, code, 'utf8');
    html = html.replace(cssRegex, '<link rel="stylesheet" href="styles.css">');
}

fs.writeFileSync(htmlFile, html, 'utf8');
console.log('Files split successfully.');
