import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Resolve the path to the HTML file in public/HTML
    const filePath = path.join(process.cwd(), 'public', 'HTML', `${slug}.html`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Read the HTML content
    let htmlContent = fs.readFileSync(filePath, 'utf8');

    // Inject API Keys from environment variables
    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
    const firebaseKey = process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY_HERE';
    
    htmlContent = htmlContent
      .replace(/YOUR_API_KEY_HERE/g, googleMapsKey)
      .replace(/YOUR_FIREBASE_API_KEY_HERE/g, firebaseKey);

    // Return the modified HTML
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error serving project HTML:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
