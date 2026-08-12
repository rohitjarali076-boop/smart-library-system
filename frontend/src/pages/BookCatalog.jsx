import React, { useState } from 'react';
import { Search } from 'lucide-react';

const CATALOG_BOOKS = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', copies: 4, shelf: 'CS-102', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop' },
  { id: '2', title: 'Design Patterns', author: 'Erich Gamma', category: 'Software Engineering', copies: 2, shelf: 'SE-304', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop' },
  { id: '3', title: 'Artificial Intelligence', author: 'Stuart Russell', category: 'Artificial Intelligence', copies: 1, shelf: 'AI-501', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop' },
  { id: '4', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Data Structures', copies: 6, shelf: 'DS-201', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop' }
];

export default function BookCatalog() {
  const [query, setQuery] = useState('');

  const filtered = CATALOG_BOOKS.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Full Library Catalog</h1>
            <p className="text-xs text-slate-400 mt-1">Browse all available books, check availability, and shelf locators.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((b) => (
            <div key={b.id} className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
              <div>
                <img src={b.cover} alt={b.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                <span className="text-[10px] font-bold text-sky-400 uppercase">📍 Shelf {b.shelf}</span>
                <h3 className="font-bold text-white text-sm mt-1">{b.title}</h3>
                <p className="text-xs text-slate-400">{b.author}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold">{b.copies} Available</span>
                <button className="px-3 py-1.5 bg-sky-500 text-slate-950 font-bold rounded-lg text-xs">Reserve</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}