"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	Heart,
	MessageCircle,
	Bookmark,
	Share2,
	Search,
	Home,
	Bell,
	Settings,
	ChevronDown,
	ChevronRight,
	Grid,
	Users,
	User,
	Plus,
	Camera,
	ArrowLeft,
	MapPin,
	Link,
	Calendar,
	Moon,
	Sun,
	Zap,
	X,
	Send,
	Smile,
	Video,
	Star,
	FileImage,
	PlusCircle,
	ArrowRight,
	Clock,
	Trash2,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Alert = ({ className, children }) => (
	<div className={`flex items-center ${className}`}>{children}</div>
);

const AlertDescription = ({ className, children }) => (
	<div className={className}>{children}</div>
);

interface UserProfile {
	id: string;
	username: string;
	displayName: string;
	bio: string;
	profilePicture: string;
	coverPhoto: string;
	followersCount: number;
	followingCount: number;
	postsCount: number;
	isFollowing: boolean;
	isVerified: boolean;
	location: string;
	website: string;
	joinDate: string;
}

interface Comment {
	id: string;
	userId: string;
	username: string;
	userProfilePic: string;
	isVerified: boolean;
	text: string;
	timestamp: string;
	likesCount: number;
	isLiked: boolean;
}

interface Post {
	id: string;
	imageUrl: string;
	caption: string;
	likesCount: number;
	commentsCount: number;
	timestamp: string;
	isLiked: boolean;
	isSaved: boolean;
	comments: Comment[];
}

interface Story {
	id: string;
	userId: string;
	username: string;
	profilePicture: string;
	imageUrl: string;
	timestamp: string;
	isViewed: boolean;
}

interface UserListItem {
	id: string;
	username: string;
	displayName: string;
	profilePicture: string;
	isFollowing: boolean;
	isVerified: boolean;
	bio: string;
}

interface TabProps {
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
	onClick: () => void;
	isDarkMode: boolean;
}

const NavTab: React.FC<TabProps> = ({
	icon,
	label,
	isActive,
	onClick,
	isDarkMode,
}) => (
	<button
		onClick={onClick}
		className={`flex-1 py-4 font-medium text-sm transition-all ${
			isActive
				? isDarkMode
					? "border-b-2 border-indigo-500 text-indigo-400"
					: "border-b-2 border-indigo-600 text-indigo-600"
				: isDarkMode
				? "text-gray-400 hover:text-gray-300"
				: "text-gray-500 hover:text-gray-900"
		}`}
	>
		<div className="flex items-center justify-center gap-2">
			{icon}
			<span>{label}</span>
		</div>
	</button>
);

interface FollowButtonProps {
	isFollowing: boolean;
	onClick: () => void;
	isDarkMode: boolean;
	size?: "sm" | "md" | "lg";
}

const FollowButton: React.FC<FollowButtonProps> = ({
	isFollowing,
	onClick,
	isDarkMode,
	size = "md",
}) => {
	const sizeClasses = {
		sm: "text-xs px-3 py-1",
		md: "text-sm px-4 py-2",
		lg: "px-6 py-2.5 font-medium",
	};

	return (
		<button
			onClick={onClick}
			className={`${
				sizeClasses[size]
			} rounded-full font-medium transition-all transform hover:scale-105 ${
				isFollowing
					? isDarkMode
						? "bg-gray-700 hover:bg-gray-600"
						: "bg-gray-200 hover:bg-gray-300"
					: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
			}`}
		>
			{isFollowing ? "Following" : "Follow"}
		</button>
	);
};

interface UserCardProps {
	user: UserListItem;
	onFollowToggle: () => void;
	isDarkMode: boolean;
	gradientFrom: string;
	gradientTo: string;
}

const UserCard: React.FC<UserCardProps> = ({
	user,
	onFollowToggle,
	isDarkMode,
	gradientFrom,
	gradientTo,
}) => (
	<div
		className={`flex items-center justify-between p-3 rounded-xl ${
			isDarkMode
				? "bg-gray-800 hover:bg-gray-700"
				: "bg-gray-50 hover:bg-gray-100"
		} transition-colors`}
	>
		<div className="flex items-center gap-4">
			<div
				className={`h-12 w-12 rounded-full bg-gradient-to-br from-${gradientFrom} to-${gradientTo} p-0.5`}
			>
				<div className="h-full w-full rounded-full overflow-hidden">
					<img
						src={user.profilePicture}
						alt={user.displayName}
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
			<div>
				<div className="flex items-center gap-1">
					<p className="font-semibold">{user.displayName}</p>
					{user.isVerified && (
						<span className="text-xs bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
							✓
						</span>
					)}
				</div>
				<p
					className={`text-sm ${
						isDarkMode ? "text-gray-400" : "text-gray-500"
					}`}
				>
					@{user.username}
				</p>
				<p
					className={`text-xs mt-1 ${
						isDarkMode ? "text-gray-500" : "text-gray-600"
					}`}
				>
					{user.bio}
				</p>
			</div>
		</div>
		<FollowButton
			isFollowing={user.isFollowing}
			onClick={onFollowToggle}
			isDarkMode={isDarkMode}
			size="sm"
		/>
	</div>
);

interface CommentProps {
	comment: Comment;
	onLike: () => void;
	onDelete: () => void;
	isDarkMode: boolean;
	isOwner: boolean;
}

const CommentComponent: React.FC<CommentProps> = ({
	comment,
	onLike,
	onDelete,
	isDarkMode,
	isOwner,
}) => (
	<div
		className={`flex gap-3 py-3 ${
			isDarkMode ? "border-gray-700" : "border-gray-200"
		}`}
	>
		<div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
			<img
				src={comment.userProfilePic}
				alt={comment.username}
				className="w-full h-full object-cover"
			/>
		</div>
		<div className="flex-1">
			<div className="flex items-start justify-between">
				<div>
					<div className="flex items-center gap-1">
						<span className="font-medium text-sm">@{comment.username}</span>
						{comment.isVerified && (
							<span className="text-xs bg-indigo-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
								✓
							</span>
						)}
					</div>
					<p
						className={`text-sm ${
							isDarkMode ? "text-gray-300" : "text-gray-700"
						}`}
					>
						{comment.text}
					</p>
					<div className="flex items-center gap-4 mt-1 text-xs">
						<span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>
							{comment.timestamp}
						</span>
						<button className="flex items-center gap-1 group" onClick={onLike}>
							<span
								className={
									comment.isLiked
										? "text-indigo-500"
										: isDarkMode
										? "text-gray-500"
										: "text-gray-400"
								}
							>
								{comment.likesCount}{" "}
								{comment.likesCount === 1 ? "like" : "likes"}
							</span>
						</button>
						<button
							className={`flex items-center gap-1 ${
								isDarkMode
									? "text-gray-500 hover:text-gray-400"
									: "text-gray-400 hover:text-gray-600"
							}`}
						>
							Reply
						</button>
					</div>
				</div>
				{isOwner && (
					<button
						className={`p-1 rounded-full ${
							isDarkMode
								? "text-gray-500 hover:text-gray-400 hover:bg-gray-700"
								: "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
						}`}
						onClick={onDelete}
					>
						<Trash2 size={14} />
					</button>
				)}
			</div>
		</div>
	</div>
);

interface PostCardProps {
	post: Post;
	onLike: () => void;
	onSave: () => void;
	onComment: (text: string) => void;
	onCommentLike: (commentId: string) => void;
	onCommentDelete: (commentId: string) => void;
	formatNumber: (num: number) => string;
	isDarkMode: boolean;
	currentUserPic: string;
}

const PostCard: React.FC<PostCardProps> = ({
	post,
	onLike,
	onSave,
	onComment,
	onCommentLike,
	onCommentDelete,
	formatNumber,
	isDarkMode,
	currentUserPic,
}) => {
	const [showComments, setShowComments] = useState<boolean>(false);
	const [commentText, setCommentText] = useState<string>("");

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (commentText.trim()) {
			onComment(commentText);
			setCommentText("");
		}
	};

	return (
		<div
			className={`overflow-hidden rounded-xl shadow-lg ${
				isDarkMode ? "bg-gray-800" : "bg-white"
			} transition-transform transform hover:-translate-y-1`}
		>
			<div className="relative aspect-square overflow-hidden">
				<img
					src={post.imageUrl}
					alt={post.caption}
					className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105 cursor-pointer"
				/>
			</div>

			<div className="p-4">
				<p
					className={`text-sm mb-3 line-clamp-2 ${
						isDarkMode ? "text-gray-300" : "text-gray-700"
					}`}
				>
					{post.caption}
				</p>

				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<button className="flex items-center gap-1 group" onClick={onLike}>
							<Heart
								size={18}
								className={`transition-colors ${
									post.isLiked
										? "text-rose-500 fill-rose-500"
										: `${
												isDarkMode ? "text-gray-400" : "text-gray-500"
										  } group-hover:text-rose-500`
								}`}
							/>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{formatNumber(post.likesCount)}
							</span>
						</button>

						<button
							className="flex items-center gap-1 group"
							onClick={() => setShowComments(!showComments)}
						>
							<MessageCircle
								size={18}
								className={`${
									isDarkMode
										? "text-gray-400 group-hover:text-indigo-400"
										: "text-gray-500 group-hover:text-indigo-500"
								}`}
							/>
							<span
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{formatNumber(post.commentsCount)}
							</span>
						</button>
					</div>

					<button className="group" onClick={onSave}>
						<Bookmark
							size={18}
							className={`transition-colors ${
								post.isSaved
									? "text-amber-500 fill-amber-500"
									: `${
											isDarkMode ? "text-gray-400" : "text-gray-500"
									  } group-hover:text-amber-500`
							}`}
						/>
					</button>
				</div>

				<div
					className={`text-xs mt-3 ${
						isDarkMode ? "text-gray-500" : "text-gray-400"
					}`}
				>
					{post.timestamp}
				</div>

				{}
				{showComments && (
					<div
						className={`mt-4 pt-3 border-t ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<h4
							className={`text-sm font-semibold mb-2 ${
								isDarkMode ? "text-white" : "text-gray-800"
							}`}
						>
							Comments
						</h4>

						{post.comments.length > 0 ? (
							<div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
								{post.comments.map((comment) => (
									<CommentComponent
										key={comment.id}
										comment={comment}
										onLike={() => onCommentLike(comment.id)}
										onDelete={() => onCommentDelete(comment.id)}
										isDarkMode={isDarkMode}
										isOwner={comment.username === "alex_design"}
									/>
								))}
							</div>
						) : (
							<p
								className={`text-sm italic ${
									isDarkMode ? "text-gray-500" : "text-gray-400"
								}`}
							>
								No comments yet. Be the first to comment!
							</p>
						)}

						{}
						<form
							className="flex items-center gap-2 mt-3"
							onSubmit={handleCommentSubmit}
						>
							<div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
								<img
									src={currentUserPic}
									alt="Your profile"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-1 relative">
								<input
									type="text"
									placeholder="Add a comment..."
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
									className={`w-full py-2 px-3 pr-10 rounded-full text-sm ${
										isDarkMode
											? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
											: "bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200"
									} border focus:outline-none focus:ring-1 focus:ring-indigo-500`}
								/>
								<button
									type="button"
									className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
										isDarkMode
											? "text-gray-400 hover:text-gray-300"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<Smile size={18} />
								</button>
							</div>
							<button
								type="submit"
								disabled={!commentText.trim()}
								className={`p-2 rounded-full ${
									commentText.trim()
										? "bg-indigo-500 text-white hover:bg-indigo-600"
										: isDarkMode
										? "bg-gray-700 text-gray-500"
										: "bg-gray-200 text-gray-400"
								} transition-colors`}
							>
								<Send size={18} />
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

interface StoryCircleProps {
	imageUrl: string;
	username: string;
	isAddStory?: boolean;
	isViewed?: boolean;
	isDarkMode: boolean;
	onClick: () => void;
}

const StoryCircle: React.FC<StoryCircleProps> = ({
	imageUrl,
	username,
	isAddStory = false,
	isViewed = false,
	isDarkMode,
	onClick,
}) => (
	<div className="flex flex-col items-center min-w-16" onClick={onClick}>
		<div
			className={`w-16 h-16 rounded-full p-0.5 ${
				isAddStory
					? "bg-gradient-to-br from-gray-200 to-gray-300"
					: isViewed
					? isDarkMode
						? "bg-gray-700"
						: "bg-gray-300"
					: "bg-gradient-to-br from-indigo-500 to-purple-500"
			}`}
		>
			<div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
				{isAddStory ? (
					<Plus
						size={24}
						className={`${isDarkMode ? "text-gray-800" : "text-gray-600"}`}
					/>
				) : (
					<img
						src={imageUrl}
						alt={username}
						className={`w-full h-full object-cover ${
							isViewed ? "opacity-70" : ""
						}`}
					/>
				)}
			</div>
		</div>
		<span
			className={`text-xs mt-2 truncate max-w-16 ${
				isDarkMode ? "text-gray-400" : "text-gray-500"
			}`}
		>
			{isAddStory ? "Your story" : username}
		</span>
	</div>
);

interface AddStoryModalProps {
	onClose: () => void;
	onSubmit: (imageUrl: string) => void;
	isDarkMode: boolean;
}

const AddStoryModal: React.FC<AddStoryModalProps> = ({
	onClose,
	onSubmit,
	isDarkMode,
}) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [step, setStep] = useState<"select" | "preview">("select");

	const handleImageSelect = (imageUrl: string) => {
		setSelectedImage(imageUrl);
		setStep("preview");
	};

	const handleSubmit = () => {
		if (selectedImage) {
			onSubmit(selectedImage);
		}
	};

	const demoImages = [
		"https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
		"https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
		"https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
		"https://images.unsplash.com/photo-1618172193622-ae2d025f4032?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
		"https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
		"https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
			<div
				className={`relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${
					isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
				}`}
			>
				<div className="p-4 border-b flex items-center justify-between">
					<h3 className="font-bold">
						{step === "select" ? "Create New Story" : "Preview Story"}
					</h3>
					<button
						className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
						onClick={onClose}
					>
						<X size={20} />
					</button>
				</div>

				{step === "select" ? (
					<div className="p-4">
						<div className="flex items-center gap-4 mb-4">
							<button
								className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-lg ${
									isDarkMode
										? "bg-gray-700 text-gray-300"
										: "bg-gray-100 text-gray-700"
								}`}
							>
								<Camera size={20} />
								<span className="text-sm">Camera</span>
							</button>
							<button
								className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-lg ${
									isDarkMode
										? "bg-indigo-600 text-white"
										: "bg-indigo-100 text-indigo-700"
								}`}
							>
								<FileImage size={20} />
								<span className="text-sm">Gallery</span>
							</button>
							<button
								className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-lg ${
									isDarkMode
										? "bg-gray-700 text-gray-300"
										: "bg-gray-100 text-gray-700"
								}`}
							>
								<Video size={20} />
								<span className="text-sm">Video</span>
							</button>
						</div>

						<h4
							className={`text-sm font-medium mb-3 ${
								isDarkMode ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Recent Photos
						</h4>
						<div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
							{demoImages.map((img, idx) => (
								<div
									key={idx}
									className="aspect-[9/16] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
									onClick={() => handleImageSelect(img)}
								>
									<img
										src={img}
										alt={`story option ${idx}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col h-96">
						<div className="relative flex-1 bg-black">
							{selectedImage && (
								<img
									src={selectedImage}
									alt="Story preview"
									className="w-full h-full object-contain"
								/>
							)}
							<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full overflow-hidden border border-white">
											<img
												src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
												alt="Profile"
												className="w-full h-full object-cover"
											/>
										</div>
										<span className="text-white text-sm font-medium">
											Your story
										</span>
									</div>
									<div className="flex gap-2">
										<button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
											<Smile size={16} />
										</button>
										<button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
											<FileImage size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="p-4 flex justify-end">
							<button
								className="px-6 py-2 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-colors"
								onClick={handleSubmit}
							>
								Share Story
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

interface SavedPostsModalProps {
	posts: Post[];
	onClose: () => void;
	onPostUnsave: (postId: string) => void;
	isDarkMode: boolean;
}

const SavedPostsModal: React.FC<SavedPostsModalProps> = ({
	posts,
	onClose,
	onPostUnsave,
	isDarkMode,
}) => {
	const savedPosts = posts.filter((post) => post.isSaved);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
			<div
				className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl ${
					isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
				}`}
			>
				<div className="p-4 border-b flex items-center justify-between">
					<h3 className="font-bold flex items-center gap-2">
						<Bookmark size={18} />
						Saved Items
					</h3>
					<button
						className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
						onClick={onClose}
					>
						<X size={20} />
					</button>
				</div>

				<div
					className="p-4 overflow-y-auto"
					style={{ maxHeight: "calc(90vh - 70px)" }}
				>
					{savedPosts.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{savedPosts.map((post) => (
								<div
									key={post.id}
									className="relative group rounded-lg overflow-hidden"
								>
									<img
										src={post.imageUrl}
										alt={post.caption}
										className="w-full aspect-square object-cover"
									/>
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<div className="text-white text-center">
											<div className="flex items-center justify-center gap-4 mb-2">
												<div className="flex items-center gap-1">
													<Heart size={16} className="fill-white text-white" />
													<span className="text-sm">{post.likesCount}</span>
												</div>
												<div className="flex items-center gap-1">
													<MessageCircle size={16} />
													<span className="text-sm">{post.commentsCount}</span>
												</div>
											</div>
											<button
												className="mt-2 px-3 py-1 bg-red-500 text-white rounded-full text-xs flex items-center gap-1 mx-auto"
												onClick={() => onPostUnsave(post.id)}
											>
												<Bookmark size={12} className="fill-white" />
												Unsave
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div
								className={`w-16 h-16 rounded-full ${
									isDarkMode ? "bg-gray-700" : "bg-gray-100"
								} flex items-center justify-center mb-4`}
							>
								<Bookmark
									size={24}
									className={isDarkMode ? "text-gray-500" : "text-gray-400"}
								/>
							</div>
							<h4 className="text-lg font-medium mb-2">No saved posts yet</h4>
							<p
								className={`text-sm ${
									isDarkMode ? "text-gray-400" : "text-gray-500"
								} max-w-md`}
							>
								When you save posts, they will appear here for you to quickly
								access later.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface StoryViewerProps {
	story: Story;
	onClose: () => void;
	onNext: () => void;
	onPrevious: () => void;
	hasNext: boolean;
	hasPrevious: boolean;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
	story,
	onClose,
	onNext,
	onPrevious,
	hasNext,
	hasPrevious,
}) => {
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					if (hasNext) {
						onNext();
					} else {
						onClose();
					}
					return 0;
				}
				return prev + 0.5;
			});
		}, 30);

		return () => clearInterval(timer);
	}, [story.id, hasNext, onNext, onClose]);

	return (
		<div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
			{}
			<div className="absolute top-0 left-0 right-0 p-2 z-10">
				<div className="h-1 bg-white/30 rounded-full overflow-hidden">
					<div
						className="h-full bg-white transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					></div>
				</div>
			</div>

			{}
			<button
				className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white z-10"
				onClick={onClose}
			>
				<X size={18} />
			</button>

			{}
			{hasPrevious && (
				<button
					className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white z-10"
					onClick={onPrevious}
				>
					<ArrowLeft size={20} />
				</button>
			)}

			{hasNext && (
				<button
					className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white z-10"
					onClick={onNext}
				>
					<ArrowRight size={20} />
				</button>
			)}

			{}
			<div className="relative w-full h-full md:w-sm md:h-[80vh] max-w-sm mx-auto overflow-hidden">
				<img
					src={story.imageUrl}
					alt="Story"
					className="w-full h-full object-cover"
				/>

				{}
				<div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
							<img
								src={story.profilePicture}
								alt={story.username}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<p className="text-white font-medium text-sm">
								@{story.username}
							</p>
							<p className="text-white/70 text-xs">{story.timestamp}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ModernSocialProfile = () => {
	const mockUser: UserProfile = {
		id: "user123",
		username: "alex_design",
		displayName: "Alex Morgan",
		bio: "UI/UX Designer & Illustrator ✨\nCreating experiences through design\nCurrently @designco",
		profilePicture:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
		coverPhoto:
			"https://images.unsplash.com/photo-1668343266773-bf5fbbc907e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
		followersCount: 12453,
		followingCount: 567,
		postsCount: 86,
		isFollowing: false,
		isVerified: true,
		location: "San Francisco, CA",
		website: "alexmorgan.design",
		joinDate: "Joined May 2022",
	};

	const mockComments: Comment[] = [
		{
			id: "comment-1",
			userId: "user-emma",
			username: "emma_j",
			userProfilePic:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			isVerified: true,
			text: "This design looks amazing! I love the color palette you chose.",
			timestamp: "2 hours ago",
			likesCount: 12,
			isLiked: false,
		},
		{
			id: "comment-2",
			userId: "user-michael",
			username: "michael_design",
			userProfilePic:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			isVerified: false,
			text: "Great work as always! The gradients are on point.",
			timestamp: "5 hours ago",
			likesCount: 8,
			isLiked: true,
		},
	];

	const mockComments2: Comment[] = [
		{
			id: "comment-3",
			userId: "user-sophia",
			username: "sophia_w",
			userProfilePic:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			isVerified: true,
			text: "I need this workspace setup in my life! So clean and minimal.",
			timestamp: "1 day ago",
			likesCount: 23,
			isLiked: true,
		},
		{
			id: "comment-4",
			userId: "user-alex",
			username: "alex_design",
			userProfilePic:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
			isVerified: true,
			text: "Thanks everyone for the positive feedback! Really appreciate it.",
			timestamp: "10 hours ago",
			likesCount: 15,
			isLiked: false,
		},
	];

	const mockPosts: Post[] = [
		{
			id: "post-1",
			imageUrl:
				"https://miro.medium.com/v2/resize:fit:2000/1*tjeUmVcvdX4s9MFecak5Sw.jpeg",
			caption:
				"Exploring new design concepts today. What do you think of this clean interface? #design #uiux #creative",
			likesCount: 842,
			commentsCount: 53,
			timestamp: "2 hours ago",
			isLiked: true,
			isSaved: false,
			comments: mockComments,
		},
		{
			id: "post-2",
			imageUrl:
				"https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
			caption:
				"Color gradients that inspire. Working on a new project with these palettes. #design #colors",
			likesCount: 1254,
			commentsCount: 78,
			timestamp: "5 hours ago",
			isLiked: false,
			isSaved: true,
			comments: [],
		},
		{
			id: "post-3",
			imageUrl:
				"https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
			caption:
				"Workspace setup for today. Feeling productive with this minimal design. #workspace #productivity",
			likesCount: 973,
			commentsCount: 42,
			timestamp: "8 hours ago",
			isLiked: false,
			isSaved: false,
			comments: mockComments2,
		},
		{
			id: "post-4",
			imageUrl:
				"https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
			caption:
				"Typography exploration for a new brand identity project. #typography #branding",
			likesCount: 765,
			commentsCount: 31,
			timestamp: "1 day ago",
			isLiked: true,
			isSaved: true,
			comments: [],
		},
		{
			id: "post-5",
			imageUrl:
				"https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
			caption:
				"Sketching new ideas on my iPad. Digital workflow that keeps me inspired. #design #sketch",
			likesCount: 1103,
			commentsCount: 67,
			timestamp: "2 days ago",
			isLiked: false,
			isSaved: false,
			comments: [],
		},
		{
			id: "post-6",
			imageUrl:
				"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
			caption:
				"Coffee break during a design sprint. Sometimes you need to recharge. #coffee #designlife",
			likesCount: 892,
			commentsCount: 29,
			timestamp: "3 days ago",
			isLiked: true,
			isSaved: true,
			comments: [],
		},
	];

	const mockStories: Story[] = [
		{
			id: "story-1",
			userId: "user-emma",
			username: "emma_j",
			profilePicture:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "2 hours ago",
			isViewed: false,
		},
		{
			id: "story-2",
			userId: "user-mike",
			username: "mike_d",
			profilePicture:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "5 hours ago",
			isViewed: true,
		},
		{
			id: "story-3",
			userId: "user-sophia",
			username: "sophia",
			profilePicture:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "8 hours ago",
			isViewed: false,
		},
		{
			id: "story-4",
			userId: "user-david",
			username: "david.m",
			profilePicture:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "12 hours ago",
			isViewed: false,
		},
		{
			id: "story-5",
			userId: "user-rebecca",
			username: "rebecca",
			profilePicture:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1612547036242-77002603e5aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "1 day ago",
			isViewed: true,
		},
		{
			id: "story-6",
			userId: "user-alex",
			username: "alex_t",
			profilePicture:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
			imageUrl:
				"https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
			timestamp: "1 day ago",
			isViewed: true,
		},
	];

	const mockFollowers: UserListItem[] = [
		{
			id: "follower-1",
			username: "creative.mind1",
			displayName: "Emma Johnson",
			profilePicture:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: true,
			bio: "Designer, Photographer, and Creative Director based in NYC",
		},
		{
			id: "follower-2",
			username: "creative.mind2",
			displayName: "Michael Chen",
			profilePicture:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: false,
			isVerified: false,
			bio: "Product Designer at Tech Co. Creating meaningful experiences.",
		},
		{
			id: "follower-3",
			username: "creative.mind3",
			displayName: "Sophia Williams",
			profilePicture:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: true,
			bio: "UI/UX Designer based in London. Focused on creating intuitive interfaces",
		},
		{
			id: "follower-4",
			username: "creative.mind4",
			displayName: "James Rodriguez",
			profilePicture:
				"https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: false,
			isVerified: false,
			bio: "Motion Designer working with leading brands in the industry",
		},
		{
			id: "follower-5",
			username: "creative.mind5",
			displayName: "Olivia Martinez",
			profilePicture:
				"https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: false,
			bio: "Brand Designer based in Berlin. Passionate about visual identities",
		},
	];

	const mockFollowing: UserListItem[] = [
		{
			id: "following-1",
			username: "design.hero1",
			displayName: "David Miller",
			profilePicture:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: true,
			bio: "UI Designer working on amazing things at Design Studio",
		},
		{
			id: "following-2",
			username: "design.hero2",
			displayName: "Rebecca Taylor",
			profilePicture:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: false,
			bio: "Product Designer focusing on user-centered experiences",
		},
		{
			id: "following-3",
			username: "design.hero3",
			displayName: "Alex Thompson",
			profilePicture:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: true,
			bio: "Art Director with 10+ years experience in digital and print",
		},
		{
			id: "following-4",
			username: "design.hero4",
			displayName: "Nina Patel",
			profilePicture:
				"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: true,
			bio: "Motion Designer specializing in animation and interactive experiences",
		},
		{
			id: "following-5",
			username: "design.hero5",
			displayName: "Carlos Vega",
			profilePicture:
				"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
			isFollowing: true,
			isVerified: false,
			bio: "Brand Designer creating identities for startups and established companies",
		},
	];

	const [userProfile, setUserProfile] = useState<UserProfile>(mockUser);
	const [posts, setPosts] = useState<Post[]>(mockPosts);
	const [stories, setStories] = useState<Story[]>(mockStories);
	const [followers, setFollowers] = useState<UserListItem[]>(mockFollowers);
	const [following, setFollowing] = useState<UserListItem[]>(mockFollowing);
	const [activeTab, setActiveTab] = useState<
		"posts" | "followers" | "following"
	>("posts");
	const [isScrolled, setIsScrolled] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [showStories, setShowStories] = useState<boolean>(true);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [showAddStoryModal, setShowAddStoryModal] = useState<boolean>(false);
	const [showSavedPostsModal, setShowSavedPostsModal] =
		useState<boolean>(false);
	const [viewingStory, setViewingStory] = useState<Story | null>(null);
	const [storyIndex, setStoryIndex] = useState<number>(0);
	const navRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	const handleFollowToggle = (): void => {
		setUserProfile((prev) => ({
			...prev,
			isFollowing: !prev.isFollowing,
			followersCount: prev.isFollowing
				? prev.followersCount - 1
				: prev.followersCount + 1,
		}));

		showActionAlert(
			userProfile.isFollowing
				? `Unfollowed ${userProfile.displayName}`
				: `Following ${userProfile.displayName}`
		);
	};

	const handleFollowUser = (
		userId: string,
		listType: "followers" | "following"
	): void => {
		if (listType === "followers") {
			const targetUser = followers.find((user) => user.id === userId);
			setFollowers((prev) =>
				prev.map((user) =>
					user.id === userId
						? { ...user, isFollowing: !user.isFollowing }
						: user
				)
			);

			if (targetUser) {
				showActionAlert(
					targetUser.isFollowing
						? `Unfollowed ${targetUser.displayName}`
						: `Following ${targetUser.displayName}`
				);
			}
		} else {
			const targetUser = following.find((user) => user.id === userId);
			setFollowing((prev) =>
				prev.map((user) =>
					user.id === userId
						? { ...user, isFollowing: !user.isFollowing }
						: user
				)
			);

			if (following.find((user) => user.id === userId)?.isFollowing) {
				setUserProfile((prev) => ({
					...prev,
					followingCount: Math.max(0, prev.followingCount - 1),
				}));
			}

			if (targetUser) {
				showActionAlert(
					targetUser.isFollowing
						? `Unfollowed ${targetUser.displayName}`
						: `Following ${targetUser.displayName}`
				);
			}
		}
	};

	const handleLikePost = (postId: string): void => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							isLiked: !post.isLiked,
							likesCount: post.isLiked
								? Math.max(0, post.likesCount - 1)
								: post.likesCount + 1,
					  }
					: post
			)
		);
	};

	const handleSavePost = (postId: string): void => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId ? { ...post, isSaved: !post.isSaved } : post
			)
		);

		const post = posts.find((p) => p.id === postId);

		if (post) {
			showActionAlert(
				post.isSaved
					? `Post removed from saved items`
					: `Post saved to collection`
			);
		}
	};

	const handleAddComment = (postId: string, text: string): void => {
		const newComment: Comment = {
			id: `comment-${Date.now()}`,
			userId: "user123",
			username: "alex_design",
			userProfilePic: userProfile.profilePicture,
			isVerified: true,
			text: text,
			timestamp: "Just now",
			likesCount: 0,
			isLiked: false,
		};

		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							comments: [...post.comments, newComment],
							commentsCount: post.commentsCount + 1,
					  }
					: post
			)
		);

		showActionAlert("Comment added");
	};

	const handleLikeComment = (postId: string, commentId: string): void => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							comments: post.comments.map((comment) =>
								comment.id === commentId
									? {
											...comment,
											isLiked: !comment.isLiked,
											likesCount: comment.isLiked
												? Math.max(0, comment.likesCount - 1)
												: comment.likesCount + 1,
									  }
									: comment
							),
					  }
					: post
			)
		);
	};

	const handleDeleteComment = (postId: string, commentId: string): void => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							comments: post.comments.filter(
								(comment) => comment.id !== commentId
							),
							commentsCount: Math.max(0, post.commentsCount - 1),
					  }
					: post
			)
		);

		showActionAlert("Comment deleted");
	};

	const handleAddStory = (imageUrl: string): void => {
		const newStory: Story = {
			id: `story-${Date.now()}`,
			userId: "user123",
			username: "alex_design",
			profilePicture: userProfile.profilePicture,
			imageUrl: imageUrl,
			timestamp: "Just now",
			isViewed: false,
		};

		setStories((prev) => [newStory, ...prev]);
		setShowAddStoryModal(false);
		showActionAlert("Story shared successfully");
	};

	const handleViewStory = (storyId: string): void => {
		const index = stories.findIndex((story) => story.id === storyId);
		if (index !== -1) {
			setStoryIndex(index);
			setViewingStory(stories[index]);

			setStories((prev) =>
				prev.map((story) =>
					story.id === storyId ? { ...story, isViewed: true } : story
				)
			);
		}
	};

	const handleNextStory = (): void => {
		if (storyIndex < stories.length - 1) {
			const nextIndex = storyIndex + 1;
			setStoryIndex(nextIndex);
			setViewingStory(stories[nextIndex]);

			setStories((prev) =>
				prev.map((story, i) =>
					i === nextIndex ? { ...story, isViewed: true } : story
				)
			);
		} else {
			setViewingStory(null);
		}
	};

	const handlePreviousStory = (): void => {
		if (storyIndex > 0) {
			const prevIndex = storyIndex - 1;
			setStoryIndex(prevIndex);
			setViewingStory(stories[prevIndex]);
		}
	};

	const showActionAlert = (message: string): void => {
		setAlertMessage(message);
		setShowAlert(true);

		setTimeout(() => {
			setShowAlert(false);
		}, 2000);
	};

	const handleLoadMore = (): void => {
		if (isLoading) return;

		setIsLoading(true);

		setTimeout(() => {
			const newPosts = [
				{
					id: `post-${posts.length + 1}`,
					imageUrl:
						"https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
					caption:
						"Experimenting with new gradient styles for interfaces. #design #ui #gradients",
					likesCount: 723,
					commentsCount: 38,
					timestamp: "4 days ago",
					isLiked: false,
					isSaved: false,
					comments: [],
				},
				{
					id: `post-${posts.length + 2}`,
					imageUrl:
						"https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
					caption:
						"Brainstorming session for a new app concept. #appdesign #creative #ux",
					likesCount: 845,
					commentsCount: 41,
					timestamp: "5 days ago",
					isLiked: false,
					isSaved: false,
					comments: [],
				},
				{
					id: `post-${posts.length + 3}`,
					imageUrl:
						"https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
					caption:
						"Design system components for our latest project. #designsystem #components",
					likesCount: 912,
					commentsCount: 57,
					timestamp: "1 week ago",
					isLiked: false,
					isSaved: false,
					comments: [],
				},
			];

			setPosts((prev) => [...prev, ...newPosts]);
			setIsLoading(false);
		}, 1000);
	};

	const toggleDarkMode = (): void => {
		setIsDarkMode((prev) => !prev);
	};

	const toggleStories = (): void => {
		setShowStories((prev) => !prev);
	};

	useEffect(() => {
		const handleScroll = (): void => {
			if (navRef.current) {
				const position = navRef.current.getBoundingClientRect().top;
				setIsScrolled(position <= 0);
			}

			if (headerRef.current) {
				const scrollPosition = window.scrollY;
				headerRef.current.style.backgroundPositionY = `${
					scrollPosition * 0.3
				}px`;
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const formatNumber = (num: number): string => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toString();
	};

	const renderFollowers = (): JSX.Element => (
		<div
			className={`p-6 animate-fadeIn ${
				isDarkMode ? "text-white" : "text-gray-800"
			}`}
		>
			<h3 className="text-xl font-bold mb-6">Followers</h3>
			<div className="space-y-6">
				{followers.map((follower) => (
					<UserCard
						key={follower.id}
						user={follower}
						onFollowToggle={() => handleFollowUser(follower.id, "followers")}
						isDarkMode={isDarkMode}
						gradientFrom="indigo-500"
						gradientTo="purple-500"
					/>
				))}

				{}
				<div className="flex justify-center pt-6">
					<button
						className={`flex items-center gap-1 font-medium ${
							isDarkMode
								? "text-indigo-400 hover:text-indigo-300"
								: "text-indigo-600 hover:text-indigo-700"
						} transition-colors`}
						onClick={() => console.log("Load more followers")}
					>
						<span>See More Followers</span>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>
		</div>
	);

	const renderFollowing = (): JSX.Element => (
		<div
			className={`p-6 animate-fadeIn ${
				isDarkMode ? "text-white" : "text-gray-800"
			}`}
		>
			<h3 className="text-xl font-bold mb-6">Following</h3>
			<div className="space-y-6">
				{following.map((user) => (
					<UserCard
						key={user.id}
						user={user}
						onFollowToggle={() => handleFollowUser(user.id, "following")}
						isDarkMode={isDarkMode}
						gradientFrom="indigo-500"
						gradientTo="cyan-500"
					/>
				))}

				{}
				<div className="flex justify-center pt-6">
					<button
						className={`flex items-center gap-1 font-medium ${
							isDarkMode
								? "text-indigo-400 hover:text-indigo-300"
								: "text-indigo-600 hover:text-indigo-700"
						} transition-colors`}
						onClick={() => console.log("Load more following")}
					>
						<span>See More</span>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>
		</div>
	);

	const renderPosts = (): JSX.Element => (
		<div className="animate-fadeIn">
			{}
			<div className={`px-6 py-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
				<div className="flex items-center justify-between mb-4">
					<h3
						className={`font-bold ${
							isDarkMode ? "text-white" : "text-gray-800"
						}`}
					>
						Stories
					</h3>
					<div className="flex items-center gap-3">
						<button
							className={`text-sm flex items-center gap-1 ${
								isDarkMode ? "text-indigo-400" : "text-indigo-600"
							}`}
							onClick={() => setShowSavedPostsModal(true)}
						>
							<Bookmark size={14} />
							<span>Saved</span>
						</button>
						<button
							className={`text-sm flex items-center gap-1 ${
								isDarkMode ? "text-indigo-400" : "text-indigo-600"
							}`}
							onClick={toggleStories}
						>
							{showStories ? "Hide" : "View All"}
							<ChevronRight size={14} />
						</button>
					</div>
				</div>

				{showStories && (
					<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
						{}
						<StoryCircle
							imageUrl=""
							username="Your story"
							isAddStory={true}
							isDarkMode={isDarkMode}
							onClick={() => setShowAddStoryModal(true)}
						/>

						{}
						{stories.map((story) => (
							<StoryCircle
								key={story.id}
								imageUrl={story.profilePicture}
								username={story.username}
								isViewed={story.isViewed}
								isDarkMode={isDarkMode}
								onClick={() => handleViewStory(story.id)}
							/>
						))}
					</div>
				)}
			</div>

			{}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				{posts.map((post) => (
					<PostCard
						key={post.id}
						post={post}
						onLike={() => handleLikePost(post.id)}
						onSave={() => handleSavePost(post.id)}
						onComment={(text) => handleAddComment(post.id, text)}
						onCommentLike={(commentId) => handleLikeComment(post.id, commentId)}
						onCommentDelete={(commentId) =>
							handleDeleteComment(post.id, commentId)
						}
						formatNumber={formatNumber}
						isDarkMode={isDarkMode}
						currentUserPic={userProfile.profilePicture}
					/>
				))}
			</div>

			{}
			<div className="flex justify-center p-6">
				<button
					className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-md ${
						isDarkMode
							? "bg-gray-800 text-white hover:bg-gray-700"
							: "bg-white text-gray-800 hover:bg-gray-50"
					} flex items-center gap-2 ${
						isLoading ? "opacity-50 cursor-wait" : ""
					}`}
					onClick={handleLoadMore}
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="flex items-center gap-2">
							<span className="animate-pulse">Loading...</span>
							<div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
						</span>
					) : (
						<>
							<span>Load More</span>
							<ChevronDown size={16} />
						</>
					)}
				</button>
			</div>
		</div>
	);

	return (
		<div
			className={`main-container min-h-screen font-sans transition-colors duration-300`}
			style={{
				backgroundColor: isDarkMode ? "#111827" : "#111827",
				backgroundImage: isDarkMode
					? "linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.8)), url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)"
					: "linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.8)), url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)",
				backgroundSize: "cover",
				backgroundAttachment: "fixed",
				backgroundPosition: "center",
			}}
		>
			<Helmet>
				{" "}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>{" "}
			</Helmet>

			{}
			{showAlert && (
				<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
					<Alert
						className={`px-4 py-2 rounded-lg shadow-lg ${
							isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						}`}
					>
						<Zap className="h-4 w-4 text-indigo-500" />
						<AlertDescription className="ml-2 text-sm font-medium">
							{alertMessage}
						</AlertDescription>
					</Alert>
				</div>
			)}

			{}
			{viewingStory && (
				<StoryViewer
					story={viewingStory}
					onClose={() => setViewingStory(null)}
					onNext={handleNextStory}
					onPrevious={handlePreviousStory}
					hasNext={storyIndex < stories.length - 1}
					hasPrevious={storyIndex > 0}
				/>
			)}

			{}
			{showAddStoryModal && (
				<AddStoryModal
					onClose={() => setShowAddStoryModal(false)}
					onSubmit={handleAddStory}
					isDarkMode={isDarkMode}
				/>
			)}

			{}
			{showSavedPostsModal && (
				<SavedPostsModal
					posts={posts}
					onClose={() => setShowSavedPostsModal(false)}
					onPostUnsave={handleSavePost}
					isDarkMode={isDarkMode}
				/>
			)}

			{}
			<div
				className={`px-4 py-3 flex items-center justify-between sm:hidden ${
					isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
				} sticky top-0 z-20 shadow-sm`}
			>
				<button className="p-2">
					<ArrowLeft size={24} />
				</button>
				<h1 className="text-lg font-bold">Profile</h1>
				<div className="flex gap-2">
					<button className="p-2" onClick={toggleDarkMode}>
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
					<button className="p-2">
						<Settings size={20} />
					</button>
				</div>
			</div>

			{}
			<div
				ref={headerRef}
				className="h-48 sm:h-64 md:h-80 bg-cover bg-center relative"
				style={{
					backgroundImage: `url(${userProfile.coverPhoto})`,
					backgroundAttachment: "fixed",
				}}
			>
				{}
				<div className="hidden sm:flex items-center justify-between absolute top-0 left-0 right-0 p-4 z-10">
					<div className="flex items-center gap-8">
						<button className="p-2 bg-white/10 backdrop-blur-lg rounded-full text-white">
							<ArrowLeft size={20} />
						</button>
						<div className="hidden md:flex items-center gap-6">
							<button className="text-white/90 hover:text-white flex items-center gap-2">
								<Home size={18} />
								<span className="font-medium">Home</span>
							</button>
							<button className="text-white/90 hover:text-white flex items-center gap-2">
								<Search size={18} />
								<span className="font-medium">Explore</span>
							</button>
							<button className="text-white/90 hover:text-white flex items-center gap-2">
								<Bell size={18} />
								<span className="font-medium">Notifications</span>
							</button>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<button
							className="p-2 bg-white/10 backdrop-blur-lg rounded-full text-white"
							onClick={toggleDarkMode}
						>
							{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
						<button
							className="p-2 bg-white/10 backdrop-blur-lg rounded-full text-white"
							onClick={() => setShowSavedPostsModal(true)}
						>
							<Bookmark size={20} />
						</button>
						<button className="p-2 bg-white/10 backdrop-blur-lg rounded-full text-white">
							<Settings size={20} />
						</button>
					</div>
				</div>

				{}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
			</div>

			{}
			<div
				className={`relative -mt-16 sm:-mt-24 px-4 ${
					isDarkMode ? "text-white" : "text-gray-800"
				}`}
			>
				<div
					className={`max-w-screen-lg mx-auto rounded-xl shadow-lg overflow-hidden ${
						isDarkMode ? "bg-gray-800" : "bg-white"
					}`}
				>
					<div className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
							{}
							<div className="relative mt-4 sm:mt-0">
								<div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-xl">
									<div className="h-full w-full rounded-xl overflow-hidden">
										<img
											src={userProfile.profilePicture}
											alt={userProfile.displayName}
											className="w-full h-full object-cover"
										/>
									</div>
								</div>
								{}
								<button className="absolute bottom-2 right-2 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
									<Camera size={16} />
								</button>
							</div>

							{}
							<div className="flex-1 flex flex-col items-center sm:items-start">
								<div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
									<div className="text-center sm:text-left">
										<div className="flex items-center gap-2 justify-center sm:justify-start">
											<h1 className="text-2xl font-bold">
												{userProfile.displayName}
											</h1>
											{userProfile.isVerified && (
												<span className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
													✓
												</span>
											)}
										</div>
										<p
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											@{userProfile.username}
										</p>
									</div>
									<div className="flex gap-2">
										<FollowButton
											isFollowing={userProfile.isFollowing}
											onClick={handleFollowToggle}
											isDarkMode={isDarkMode}
											size="lg"
										/>
										<button
											className={`p-2 rounded-full transition-all ${
												isDarkMode
													? "bg-gray-700 hover:bg-gray-600"
													: "bg-gray-100 hover:bg-gray-200"
											}`}
											onClick={() =>
												showActionAlert("Profile shared successfully")
											}
										>
											<Share2 size={18} />
										</button>
									</div>
								</div>

								{}
								<div className="flex justify-center sm:justify-start gap-6 text-sm mb-4">
									<div className="text-center">
										<span className="block font-bold text-lg">
											{formatNumber(userProfile.postsCount)}
										</span>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Posts
										</span>
									</div>
									<div className="text-center">
										<span className="block font-bold text-lg">
											{formatNumber(userProfile.followersCount)}
										</span>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Followers
										</span>
									</div>
									<div className="text-center">
										<span className="block font-bold text-lg">
											{formatNumber(userProfile.followingCount)}
										</span>
										<span
											className={`${
												isDarkMode ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Following
										</span>
									</div>
								</div>

								{}
								<div className="text-sm text-center sm:text-left">
									<p className="whitespace-pre-line">{userProfile.bio}</p>

									<div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-4">
										<div className="flex items-center gap-1">
											<MapPin
												size={14}
												className={`${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											/>
											<span
												className={`${
													isDarkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												{userProfile.location}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<Link
												size={14}
												className={`${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											/>
											<a
												href={`https://${userProfile.website}`}
												className="text-indigo-500"
											>
												{userProfile.website}
											</a>
										</div>
										<div className="flex items-center gap-1">
											<Calendar
												size={14}
												className={`${
													isDarkMode ? "text-gray-400" : "text-gray-500"
												}`}
											/>
											<span
												className={`${
													isDarkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												{userProfile.joinDate}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{}
					<div
						ref={navRef}
						className={`sticky top-0 sm:top-auto z-10 transition-all ${
							isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
						} ${isScrolled ? "shadow-md" : "border-t border-b"} ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
					>
						<div className="flex justify-around">
							<NavTab
								icon={<Grid size={16} />}
								label="Posts"
								isActive={activeTab === "posts"}
								onClick={() => setActiveTab("posts")}
								isDarkMode={isDarkMode}
							/>
							<NavTab
								icon={<Users size={16} />}
								label="Followers"
								isActive={activeTab === "followers"}
								onClick={() => setActiveTab("followers")}
								isDarkMode={isDarkMode}
							/>
							<NavTab
								icon={<User size={16} />}
								label="Following"
								isActive={activeTab === "following"}
								onClick={() => setActiveTab("following")}
								isDarkMode={isDarkMode}
							/>
						</div>
					</div>

					{}
					<div className="min-h-screen">
						{activeTab === "posts" && renderPosts()}
						{activeTab === "followers" && renderFollowers()}
						{activeTab === "following" && renderFollowing()}
					</div>
				</div>
			</div>

			{}
			<div
				className={`sm:hidden fixed bottom-0 left-0 right-0 ${
					isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
				} border-t ${
					isDarkMode ? "border-gray-700" : "border-gray-200"
				} p-2 z-20 shadow-md`}
			>
				<div className="flex justify-around">
					<button className="p-2">
						<Home size={24} />
					</button>
					<button className="p-2">
						<Search size={24} />
					</button>
					<button
						className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white shadow-lg transform hover:scale-105 transition-transform"
						onClick={() => setShowAddStoryModal(true)}
					>
						<Plus size={24} />
					</button>
					<button className="p-2">
						<Bell size={24} />
					</button>
					<button className="p-2">
						<div className="w-6 h-6 rounded-full overflow-hidden">
							<img
								src={userProfile.profilePicture}
								alt={userProfile.displayName}
								className="w-full h-full object-cover"
							/>
						</div>
					</button>
				</div>
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translate(-50%, -20px);
					}
					to {
						opacity: 1;
						transform: translate(-50%, 0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				.animate-slideDown {
					animation: slideDown 0.3s ease-out forwards;
				}

				.animate-pulse {
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
				}

				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default ModernSocialProfile;
