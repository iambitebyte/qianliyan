import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');
    const fromLine = searchParams.get('fromLine');

    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (fromLine) {
        const lineNum = parseInt(fromLine, 10);
        const lines = content.split('\n');
        const incrementContent = lines.slice(lineNum).join('\n');
        return NextResponse.json({ 
          content: incrementContent,
          totalLines: lines.length 
        });
      }
      
      return NextResponse.json({ 
        content,
        totalLines: content.split('\n').length 
      });
    } catch (err) {
      return NextResponse.json({ error: 'File not found or not accessible' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
