import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { BlogPost } from '../hooks/useBlogPosts';

interface RelatedPostsSelectorProps {
  posts: BlogPost[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  currentPostId?: string;
}

const RelatedPostsSelector: React.FC<RelatedPostsSelectorProps> = ({
  posts,
  selectedIds,
  onChange,
  currentPostId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const availablePosts = posts.filter(
    post => post.id !== currentPostId && !selectedIds.includes(post.id)
  );

  const filteredPosts = searchTerm
    ? availablePosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availablePosts;

  const selectedPosts = posts.filter(post => selectedIds.includes(post.id));

  const handleAddPost = (postId: string) => {
    if (!selectedIds.includes(postId)) {
      onChange([...selectedIds, postId]);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleRemovePost = (postId: string) => {
    onChange(selectedIds.filter(id => id !== postId));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for posts to link..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
        </div>

        {showDropdown && searchTerm && filteredPosts.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredPosts.slice(0, 10).map(post => (
              <button
                key={post.id}
                type="button"
                onClick={() => handleAddPost(post.id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{post.title}</div>
                {post.excerpt && (
                  <div className="text-sm text-gray-500 truncate">{post.excerpt}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPosts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Related Posts:</p>
          {selectedPosts.map(post => (
            <div
              key={post.id}
              className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{post.title}</div>
                {post.excerpt && (
                  <div className="text-sm text-gray-600 truncate">{post.excerpt}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemovePost(post.id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label={`Remove ${post.title}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPosts.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No related posts selected. Search above to add internal links.
        </p>
      )}
    </div>
  );
};

export default RelatedPostsSelector;
