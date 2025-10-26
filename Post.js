import React, { useState } from 'react';
import { FaHeart, FaComment, FaUser } from 'react-icons/fa';
import api from '../services/api';

const Post = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    onLike(post._id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          <FaUser className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{post.user?.username || 'Unknown User'}</h3>
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          <p className="text-gray-800 mb-4">{post.text || post.content}</p>
          {post.mediaUrl && (
            <img src={post.mediaUrl} alt="Post media" className="rounded-lg mb-4 max-w-full h-auto" />
          )}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                post.likes?.includes(localStorage.getItem('userId')) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <FaHeart />
              <span>{post.likes?.length || 0}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaComment />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
          {showComments && (
            <div className="mt-4">
              <div className="space-y-3 mb-4">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.user?.username || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment || comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
