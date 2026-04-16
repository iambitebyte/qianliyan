'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import path from 'path';
import { ArrowLeft, FileText, RefreshCw, Clock, Monitor, HardDrive, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { getBasePath } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/protected-route';

interface FileInfo {
  name: string;
  size: number;
  modified: Date;
}

function LogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderPath = searchParams.get('path') || '';
  const basePath = getBasePath();
  const { logout } = useAuth();
  
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [content, setContent] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [lastFileModifyTime, setLastFileModifyTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startLine, setStartLine] = useState(0);
  const [endLine, setEndLine] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousScrollHeightRef = useRef<number>(0);

  useEffect(() => {
    loadFiles();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [folderPath]);

  useEffect(() => {
    if (selectedFile && refreshInterval > 0) {
      loadContent(true);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        loadContent(false);
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedFile, refreshInterval]);

  useEffect(() => {
    if (selectedFile && files.length > 0) {
      const file = files.find(f => f.name === selectedFile);
      if (file) {
        setLastFileModifyTime(new Date(file.modified));
        setElapsedTime(0);
      }
    }
  }, [selectedFile, files]);

  useEffect(() => {
    if (lastFileModifyTime && refreshInterval > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - lastFileModifyTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, refreshInterval * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lastFileModifyTime, refreshInterval]);

  const loadFiles = async () => {
    try {
      const res = await fetch(`${basePath}/api/files?path=${encodeURIComponent(folderPath)}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (forceFirstLoad = false, loadPrevious = false) => {
    if (!selectedFile) return;

    const shouldShowLoading = forceFirstLoad || isFirstLoad;

    if (shouldShowLoading) {
      setContentLoading(true);
    }

    if (loadPrevious) {
      setLoadingPrevious(true);
    }

    try {
      const url = new URL(`${basePath}/api/logs`, window.location.origin);
      url.searchParams.append('path', path.join(folderPath, selectedFile));
      url.searchParams.append('linesCount', '100');
      
      if (loadPrevious && startLine > 0) {
        url.searchParams.append('fromLine', startLine.toString());
      } else if (shouldShowLoading || forceFirstLoad) {
        url.searchParams.append('fromEnd', 'true');
      } else {
        url.searchParams.append('fromEnd', 'true');
      }
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      const file = files.find(f => f.name === selectedFile);
      
      if (loadPrevious && data.content) {
        setContent(prev => data.content + '\n' + prev);
        setStartLine(data.startLine);
        
        if (scrollAreaRef.current) {
          const currentScrollTop = scrollAreaRef.current.scrollTop;
          const newScrollHeight = scrollAreaRef.current.scrollHeight;
          scrollAreaRef.current.scrollTop = currentScrollTop + (newScrollHeight - previousScrollHeightRef.current);
        }
      } else if (shouldShowLoading) {
        setContent(data.content);
        setTotalLines(data.totalLines);
        setStartLine(data.startLine);
        setEndLine(data.endLine);
        if (file) {
          setLastFileModifyTime(new Date(file.modified));
        }
        setElapsedTime(0);
        
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
          }
        }, 100);
        
        setIsFirstLoad(false);
      } else if (data.content) {
        setContent(prev => prev + '\n' + data.content);
        setTotalLines(data.totalLines);
        setStartLine(data.startLine);
        setEndLine(data.endLine);
        
        if (!isScrolling) {
          setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
            }
          }, 100);
        }
      }
    } catch (err) {
      console.error('Failed to load content');
    } finally {
      if (shouldShowLoading) {
        setContentLoading(false);
      }
      if (loadPrevious) {
        setLoadingPrevious(false);
      }
    }
  };

  const goBack = () => {
    router.push('/');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} 小时 ${minutes} 分钟 ${secs} 秒`;
  };

  const handleScroll = () => {
    setIsScrolling(true);
    
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight } = scrollAreaRef.current;
      
      if (scrollTop === 0 && startLine > 0 && !loadingPrevious) {
        previousScrollHeightRef.current = scrollHeight;
        loadContent(false, true);
      }
    }
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  };

  if (!folderPath) {
    router.push('/');
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                日志文件查看
              </h1>
              <div className="text-sm text-gray-500 font-mono truncate mt-1">
                {folderPath}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="shrink-0"
              title="退出"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full px-4 py-4">
        <div className="flex-1 flex gap-4">
           <div className={`bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition-opacity ${contentLoading ? 'opacity-50 pointer-events-none' : ''}`} style={{ width: '20%', height: 'calc(100vh - 250px)' }}>
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">文件列表</h2>
              </div>
              <Badge variant="secondary">{files.length} 个文件</Badge>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    加载中...
                  </div>
                ) : files.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    未找到 .log 或 .txt 文件
                  </div>
                ) : (
                  <div className="space-y-1">
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedFile === file.name
                            ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                            : 'border border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedFile(file.name)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText
                            size={18}
                            className={`shrink-0 ${selectedFile === file.name ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate text-sm">{file.name}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {formatFileSize(file.size)}
                              </div>
                              <span>·</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(file.modified).toLocaleString('zh-CN', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden" style={{ width: '80%', height: 'calc(100vh - 250px)' }}>
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900 truncate">
                  {selectedFile || '请选择文件'}
                </h2>
                {content && (
                  <span className="text-xs text-gray-500 shrink-0">
                    {totalLines} 行
                  </span>
                )}
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {lastFileModifyTime && (
                      <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(elapsedTime)}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      {refreshInterval === 0 ? '手动' : `${refreshInterval}秒`}
                    </Badge>
                  </div>

                  <Input
                    type="text"
                    placeholder="输入文本过滤内容..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-48"
                  />

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 whitespace-nowrap">刷新间隔:</label>
                    <Select
                      value={refreshInterval.toString()}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="w-24"
                    >
                      <option value={1}>1秒</option>
                      <option value={2}>2秒</option>
                      <option value={5}>5秒</option>
                      <option value={10}>10秒</option>
                      <option value={30}>30秒</option>
                      <option value={0}>手动</option>
                    </Select>

                    {refreshInterval === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadContent(false)}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw size={16} />
                        刷新
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1"
              onScroll={handleScroll}
            >
              <div className="bg-gray-900 min-h-full">
                {loadingPrevious && (
                  <div className="p-4 bg-gray-800 flex items-center justify-center gap-2 border-b border-gray-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-400">加载更多日志...</span>
                  </div>
                )}
                <div className="p-4">
                <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {content ? (
                    filterText ? (
                      content
                        .split('\n')
                        .filter((line, index) => {
                          if (!line.includes(filterText)) return false;
                          return true;
                        })
                        .map((line, index) => (
                          <div key={index} className="flex hover:bg-gray-800/50">
                            <span className="text-gray-500 select-none pr-6 text-right min-w-[3rem]">
                              {index + 1}
                            </span>
                            <span className={`flex-1 ${/error/i.test(line) ? 'text-red-400' : ''}`}>{line}</span>
                          </div>
                        )) || <div className="text-gray-400">未找到匹配内容</div>
                    ) : (
                      content
                        .split('\n')
                        .map((line, index) => {
                          const lineNumber = startLine + index + 1;
                          return (
                            <div key={index} className="flex hover:bg-gray-800/50">
                              <span className="text-gray-500 select-none pr-6 text-right min-w-[3rem]">
                                {lineNumber}
                              </span>
                              <span className={`flex-1 ${/error/i.test(line) ? 'text-red-400' : ''}`}>{line}</span>
                            </div>
                          );
                        })
                    )
                  ) : (
                    selectedFile ? '加载中...' : '请从左侧选择一个文件'
                  )}
                </pre>
                </div>
              </div>
            </ScrollArea>
           </div>
         </div>
       </div>
       </div>

      {contentLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-gray-700 font-medium">加载日志文件...</div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default function LogsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">加载中...</div>
        </div>
      </div>
    }>
      <LogsContent />
    </Suspense>
  );
}
