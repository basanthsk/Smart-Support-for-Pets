
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Image as ImageIcon, 
  Send, 
  MoreHorizontal,
  Smile,
  MapPin,
  CheckCircle2,
  Camera,
  Loader2,
  Search,
  Filter,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

interface Post {
  id: string;
  user: string;
  avatar: string;
  petName: string;
  petType?: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  createdAt: any;
  isUser?: boolean;
  userId: string;
}

const Community: React.FC = () => {
  const { user } = useAuth();
  const [pet, setPet] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Newest');

  useEffect(() => {
    const savedPet = localStorage.getItem(`pet_${user?.uid}`);
    if (savedPet) setPet(JSON.parse(savedPet));

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.content.toLowerCase().includes(q) || 
        p.petName.toLowerCase().includes(q) || 
        p.user.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'All') {
      result = result.filter(p => p.petType === typeFilter);
    }

    if (dateFilter === 'Oldest') {
      result.sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return da - db;
      });
    } else {
      result.sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return db - da;
      });
    }

    return result;
  }, [posts, searchQuery, typeFilter, dateFilter]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setIsPosting(true);

    try {
      await addDoc(collection(db, "posts"), {
        user: user.displayName || 'Pet Parent',
        avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        petName: pet?.name || 'My Pet',
        petType: pet?.species || 'Unknown',
        content: newPostContent,
        image: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800&sig=${Date.now()}`,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
        userId: user.uid
      });

      setNewPostContent('');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to share post.");
    } finally {
      setIsPosting(false);
    }
  };

  const formatTime = (createdAt: any) => {
    if (!createdAt) return 'Just now';
    const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-32 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Community Feed</h2>
          <p className="text-slate-500 font-medium">Shared by pet parents globally.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-5 top-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search keywords, pet names..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-5 top-4 text-slate-400 hover:text-indigo-600 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-600 uppercase tracking-widest outline-none"
            >
              <option value="All">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
            <CalendarIcon size={14} className="text-slate-400" />
            <select 
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-600 uppercase tracking-widest outline-none"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Post Composer */}
      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6 transition-all focus-within:shadow-xl focus-within:shadow-indigo-50/50">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md">
            <img src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} alt="Me" className="w-full h-full object-cover" />
          </div>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={`What's ${pet?.name || 'your pet'} up to today?`}
            className="flex-1 bg-slate-50 border border-slate-50 rounded-[2rem] p-5 font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all resize-none min-h-[120px]"
          />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <ImageIcon size={18} />
              Photo
            </button>
            <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <Smile size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleCreatePost}
            disabled={!newPostContent.trim() || isPosting}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {isPosting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isPosting ? 'Sharing...' : 'Share Moment'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <p className="font-bold uppercase tracking-[0.2em] text-xs">Loading Shared Moments...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <Camera size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No moments found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
          </div>
        ) : filteredPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500">
            {/* Post Header */}
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-800">{post.user}</h4>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-indigo-600 font-bold">{post.petName}</span>
                    <span className="px-2 py-0.5 bg-slate-50 text-[10px] font-black text-slate-400 rounded-md uppercase tracking-widest">{post.petType}</span>
                    {post.userId === user?.uid && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatTime(post.createdAt)}</p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-8 pb-6">
              <p className="text-slate-700 font-medium leading-relaxed text-lg">{post.content}</p>
            </div>

            {/* Post Image */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer">
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} />
              </div>
            </div>

            {/* Post Footer / Actions */}
            <div className="p-8 flex items-center justify-between border-t border-slate-50">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 font-black text-sm text-slate-500 hover:text-rose-500 transition-all group/btn">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover/btn:bg-rose-50 group-hover/btn:text-rose-500 transition-all">
                    <Heart size={20} className={post.likes > 100 ? 'fill-rose-500 text-rose-500' : ''} />
                  </div>
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 font-black text-sm text-slate-500 hover:text-indigo-600 transition-all group/btn">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover/btn:bg-indigo-50 group-hover/btn:text-indigo-600 transition-all">
                    <MessageCircle size={20} />
                  </div>
                  {post.comments}
                </button>
              </div>
              
              <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Community;
