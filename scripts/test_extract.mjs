import fs from 'fs';
import path from 'path';

function extractFromTsx(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // strip imports and interface declarations roughly
  const renderContent = content.substring(content.indexOf('return ('));
  
  let titleMatch = content.match(/<h[12][^>]*>(.*?)<\/h[12]>/);
  let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : null;

  let descMatch = renderContent ? renderContent.match(/>([^<{}]{20,150})</) : null;
  let desc = descMatch ? descMatch[1].trim() : "Interactive React Application";

  return { title, desc };
}

console.log(extractFromTsx(path.join(process.cwd(), 'components/projects/ActivityTimeline.tsx')));
console.log(extractFromTsx(path.join(process.cwd(), 'components/projects/APIBuilder.tsx')));
