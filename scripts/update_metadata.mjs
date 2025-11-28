import fs from 'fs';
import path from 'path';

const htmlDir = path.join(process.cwd(), 'public', 'HTML');
const reactDir = path.join(process.cwd(), 'components', 'projects');
const outputFile = path.join(process.cwd(), 'public', 'projects.json');

const BOILERPLATE = [
  '©', 'All rights reserved', 'Your cart is empty', 'Powered by', 'Click here', 
  'Loading...', 'Login', 'Sign up', 'Forgot password', 'Terms of Service', 
  'Privacy Policy', 'Cookie Policy', 'Contact us', 'Subscribe', 'Newsletter',
  'Share this link', 'Immediate requires', 'requires push notifications',
  'what do you think', 'latest design proposal', 'next.js enhanced edition',
  'welcome back', 'enter your email', 'password', 'submit', 'cancel'
];

function splitPascalCase(word) {
  // Better split: handles APIBuilder -> API Builder
  return word
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();
}

function cleanDescription(text) {
  if (!text) return "";
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]+>/g, ' ');
  // Remove { } interpolation
  cleaned = cleaned.replace(/\{[^}]+\}/g, ' ');
  // Remove multiple spaces/newlines
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Remove common code-like symbols
  cleaned = cleaned.replace(/[\[\];="]/g, '');
  
  // Skip if it contains too many symbols or boilerplate
  if (BOILERPLATE.some(b => cleaned.toLocaleLowerCase().includes(b.toLocaleLowerCase()))) return "";
  
  // Length check
  if (cleaned.length < 20 || cleaned.length > 300) return "";
  
  // Check if it's mostly code (too many dots, underscores, or unusual characters)
  const charRatio = (cleaned.match(/[^a-zA-Z0-9\s,.!?]/g) || []).length / cleaned.length;
  if (charRatio > 0.05) return "";

  return cleaned.substring(0, 160);
}

function extractDescription(content, isTsx) {
    let searchArea = content;
    if (isTsx) {
        // Strip out styled engine / CSS blocks which are usually at the top
        const firstTag = content.indexOf('<');
        searchArea = content.substring(firstTag !== -1 ? firstTag : 0);
    }

    // Try finding text in common tags, prioritizing paragraphs
    const tags = ['p', 'h2', 'span', 'div', 'section'];
    for (const tag of tags) {
        const regex = new RegExp(`<${tag}[^>]*>\\s*([^<{}]{30,220})\\s*<\\/${tag}>`, 'gi');
        let match;
        while ((match = regex.exec(searchArea)) !== null) {
            const cleaned = cleanDescription(match[1]);
            if (cleaned && !cleaned.includes('className') && !cleaned.includes('style') && !cleaned.includes('import')) {
                return cleaned;
            }
        }
    }

    // Fallback: search for text blocks between > and <
    const regex = />\s*([^<{}]{40,160})\s*</g;
    let match;
    while ((match = regex.exec(searchArea)) !== null) {
        const cleaned = cleanDescription(match[1]);
        if (cleaned) return cleaned;
    }

    return "";
}

const existingProjectsMap = new Map();
if (fs.existsSync(outputFile)) {
    const existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    existing.forEach(p => existingProjectsMap.set(p.id, p));
}

const projects = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

for (const p of projects) {
  let finalTitle = splitPascalCase(p.slug);
  let finalDesc = "";
  
  // Carry over featured flag if it exists
  const existing = existingProjectsMap.get(p.id);
  if (existing && existing.featured) {
      p.featured = true;
  }

  try {
    if (p.type === 'html') {
      const content = fs.readFileSync(path.join(htmlDir, `${p.slug}.html`), 'utf8');
      
      const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1].trim() && !['Document', 'React App'].includes(titleMatch[1].trim())) {
        finalTitle = titleMatch[1].trim();
      }

      finalDesc = extractDescription(content, false);
      if (!finalDesc) {
        const metaMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
        if (metaMatch) finalDesc = cleanDescription(metaMatch[1]);
      }

    } else if (p.type === 'react') {
      const content = fs.readFileSync(path.join(reactDir, `${p.slug}.tsx`), 'utf8');
      
      const h1Match = content.match(/<h1[^>]*>([^<{]+)<\/h1>/i);
      if (h1Match && h1Match[1].trim().length > 3) {
        let t = h1Match[1].trim();
        if (!['Dashboard', 'App', 'Home', 'Next.js'].includes(t)) {
            finalTitle = t;
        }
      }

      finalDesc = extractDescription(content, true);
    }
  } catch (err) {
    console.error(`Error processing ${p.slug}:`, err.message);
  }

  // Improved Semantic Fallback
  if (!finalDesc || finalDesc.length < 25) {
    const lowTitle = finalTitle.toLowerCase();
    const slug = p.slug.toLowerCase();
    
    if (lowTitle.includes('builder') || slug.includes('builder')) 
      finalDesc = `A professional creation tool designed for building structured data, templates, or logic with an intuitive drag-and-drop interface.`;
    else if (lowTitle.includes('dashboard') || slug.includes('dash')) 
      finalDesc = `A powerful data visualization dashboard featuring real-time monitoring, filtered analytics, and comprehensive reporting tools.`;
    else if (lowTitle.includes('game') || slug.includes('game') || slug.includes('bounce') || slug.includes('trivia')) 
      finalDesc = `An immersive, high-performance interactive game experience with optimized animations and responsive gameplay mechanics.`;
    else if (lowTitle.includes('blog') || lowTitle.includes('lifestyle') || slug.includes('newsletter')) 
      finalDesc = `A clean, content-focused platform optimized for readability and engagement across all device sizes.`;
    else if (lowTitle.includes('simulator') || slug.includes('sim')) 
      finalDesc = `A high-fidelity simulation engine designed to model and visualize complex systems with adjustable parameters.`;
    else if (lowTitle.includes('tracker') || slug.includes('track'))
      finalDesc = `A robust management system for monitoring progress, resources, and performance metrics over time.`;
    else if (lowTitle.includes('search') || slug.includes('explorer'))
      finalDesc = `A fast, feature-rich discovery tool with advanced filtering and real-time result indexing.`;
    else if (p.type === 'react') 
      finalDesc = `A premium React application built with modular components, dynamic state handling, and a sleek, modern user interface.`;
    else 
      finalDesc = `A precisely engineered web experience focusing on visual excellence and seamless user interactions.`;
  }

  p.title = finalTitle;
  p.description = finalDesc;
}

fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
console.log(`Updated ${projects.length} projects with significantly better heuristics.`);
