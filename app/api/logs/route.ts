import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');
    const fromLine = searchParams.get('fromLine');
    const fromEnd = searchParams.get('fromEnd');
    const linesCount = searchParams.get('linesCount');

    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const totalLines = lines.length;
      
      const count = linesCount ? parseInt(linesCount, 10) : 100;

      if (fromEnd) {
        const linesFromEnd = lines.slice(-count);
        const actualLinesFromEnd = linesFromEnd.length;
        const startLine = Math.max(0, totalLines - actualLinesFromEnd);
        return NextResponse.json({ 
          content: linesFromEnd.join('\n'),
          totalLines,
          startLine,
          endLine: totalLines
        });
      }
      
      if (fromLine) {
        const lineNum = parseInt(fromLine, 10);
        const linesBefore = lines.slice(Math.max(0, lineNum - count), lineNum);
        return NextResponse.json({ 
          content: linesBefore.join('\n'),
          totalLines,
          startLine: Math.max(0, lineNum - count),
          endLine: lineNum
        });
      }
      
      return NextResponse.json({ 
        content,
        totalLines,
        startLine: 0,
        endLine: totalLines
      });
    } catch (err) {
      return NextResponse.json({ error: 'File not found or not accessible' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
