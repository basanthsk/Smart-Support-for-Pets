import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserByUsername, onPostsUpdateByUserId, followUser, unfollowUser, onFollowsUpdate, startChat, checkMutualFollow } from '../services/firebase';
import { Loader2, AtSign, Phone, MessageSquare, UserPlus, UserCheck, Dog, Image as ImageIcon } from 'lucide-react';
import { AppRoutes } from '../types';

interface UserProfileData {
    id: string;
    displayName: string;
    username: string;
    photoURL: string;
    petName?: string;
    phoneNumber?: string;
}

interface Post {
    id: string;
    content: string;
    image?: string;
    createdAt: any;
}

const UserProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentUserFollows, setCurrentUserFollows] = useState<{ following: string[], followers: string[] }>({ following: [], followers: [] });
    const [profileUserFollows, setProfileUserFollows] = useState<{ following: string[], followers: string[] }>({ following: [], followers: [] });
    const [isMutual, setIsMutual] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;
            document.documentElement.scrollTop = 0; // Scroll to top on page load
            setLoading(true);
            setError(null);
            try {
                const userProfileData = await getUserByUsername(username);
                if (userProfileData) {
                    setProfile(userProfileData as UserProfileData);
                } else {
                    setError('User not found.');
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to fetch user profile.');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (!profile?.id) return;
        
        const unsubPosts = onPostsUpdateByUserId(profile.id, setPosts);
        const unsubProfileFollows = onFollowsUpdate(profile.id, setProfileUserFollows);
        
        setLoading(false);

        return () => {
            unsubPosts();
            unsubProfileFollows();
        };
    }, [profile?.id]);
    
    useEffect(() => {
        if (!currentUser?.uid) return;
        const unsubCurrentUserFollows = onFollowsUpdate(currentUser.uid, setCurrentUserFollows);
        return () => unsubCurrentUserFollows();
    }, [currentUser?.uid]);

    useEffect(() => {
        if (currentUser?.uid && profile?.id) {
            checkMutualFollow(currentUser.uid, profile.id).then(setIsMutual);
        }
    }, [currentUser?.uid, profile?.id, currentUserFollows]);


    const handleFollowToggle = async () => {
        if (!currentUser || !profile || currentUser.uid === profile.id) return;
        const isCurrentlyFollowing = currentUserFollows.following.includes(profile.id);
        if (isCurrentlyFollowing) {
            await unfollowUser(currentUser.uid, profile.id);
        } else {
            await followUser(currentUser.uid, profile.id);
        }
    };
    
    const handleMessage = async () => {
        if (!currentUser || !profile) return;
        const chatId = await startChat(currentUser.uid, profile.id);
        navigate(AppRoutes.CHAT);
    };

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-theme" size={48} /></div>;
    }
    
    if (error) {
        return <div className="text-center py-20 text-rose-500 font-bold">{error}</div>;
    }

    if (!profile) {
        return <div className="text-center py-20 text-slate-500 font-bold">User profile could not be loaded.</div>;
    }
    
    const isFollowing = currentUserFollows.following.includes(profile.id);
    const isSelf = currentUser?.uid === profile.id;
    
    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="h-48 md:h-64 bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50 rounded-t-[3.5rem]"></div>
                
                <div className="relative px-6 md:px-12 -mt-24">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-8 border-white bg-slate-100 shadow-2xl flex-shrink-0">
                            <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-center md:text-left pb-4">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{profile.displayName}</h2>
                            <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-1"><AtSign size={14} />{profile.username}</p>
                        </div>
                        {!isSelf && (
                            <div className="flex items-center gap-3 pb-4">
                                {isMutual && (
                                    <button onClick={handleMessage} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all shadow-sm" title="Message User">
                                        <MessageSquare size={20} />
                                    </button>
                                )}
                                <button onClick={handleFollowToggle} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${isFollowing ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-theme text-white hover:bg-theme-hover'}`}>
                                    {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="px-6 md:px-12 pt-8 flex flex-col md:flex-row items-center gap-8 border-t border-slate-100 mt-8">
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{posts.length}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Moments</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{profileUserFollows.followers.length}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{profileUserFollows.following.length}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Following</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        {profile.petName && (
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                                <Dog size={20} className="text-theme"/>
                                <p className="text-sm font-bold text-slate-600">Proud parent of <span className="text-theme font-black">{profile.petName}</span></p>
                            </div>
                        )}
                    </div>
                    {profile.phoneNumber && (
                        <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-theme transition-all">
                            <Phone size={14} /> Call
                        </a>
                    )}
                </div>

                <div className="px-6 md:px-12 pt-12 pb-12">
                    <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6">Shared Moments</h3>
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map(post => (
                                <div key={post.id} className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group">
                                    {post.image ? (
                                        <img src={post.image} className="w-full h-full object-cover" alt="User post"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-6 text-center text-slate-400 font-bold">
                                            <p>"{post.content.slice(0, 100)}{post.content.length > 100 && '...'}"</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                        <p className="text-white font-medium text-sm line-clamp-2">{post.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-slate-50 rounded-3xl">
                            <ImageIcon size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="font-bold text-slate-500">No moments shared yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;