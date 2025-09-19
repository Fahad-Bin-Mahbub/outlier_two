"use client";
import React, { useState, useEffect } from "react";
import {
	Heart,
	MessageCircle,
	Share2,
	AlertTriangle,
	PieChart,
	ThumbsUp,
	ThumbsDown,
	Send,
	X,
	AlertCircle,
	User,
	Bell,
	Search,
	Image,
	Calendar,
} from "lucide-react";

interface ToastProps {
	message: string;
	type: "success" | "error";
	onClose: () => void;
}

interface NavBarProps {
	showToast: (message: string, type: "success" | "error") => void;
}

interface CommentType {
	id: number;
	author: string;
	text: string;
}

interface CommentProps {
	comment: CommentType;
}

interface PollOption {
	text: string;
	votes: number;
}

interface PollType {
	question: string;
	options: PollOption[];
}

interface PollProps {
	poll: PollType;
	showToast: (message: string, type: "success" | "error") => void;
	postId: number;
	onVoteUpdate?: (updatedPoll: PollType) => void;
}

interface Post {
	id: number;
	author: string;
	date: string;
	title: string;
	content: string;
	image: string;
	likes: number;
	dislikes: number;
	comments: CommentType[];
	poll: PollType | null;
}

interface PostCardProps {
	post: Post;
	showToast: (message: string, type: "success" | "error") => void;
	onPostUpdate?: (updatedPost: Post) => void;
}

interface CreatePostProps {
	showToast: (message: string, type: "success" | "error") => void;
	onPostCreated: (post: Post) => void;
}

interface FilterBarProps {
	showToast: (message: string, type: "success" | "error") => void;
	activeFilter: string;
	onFilterChange: (filter: string) => void;
}

interface CreatePollProps {
	onPollCreated: (poll: PollType) => void;
	onCancel: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
	return (
		<div
			className={`fixed bottom-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-xl transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 ${
				type === "error"
					? "bg-red-100 text-red-700 border-l-4 border-red-500"
					: "bg-green-100 text-green-700 border-l-4 border-green-500"
			}`}
		>
			<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
				{type === "error" ? <AlertCircle size={20} /> : <ThumbsUp size={20} />}
			</div>
			<div className="ml-3 text-sm font-medium">{message}</div>
			<button
				type="button"
				className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
				onClick={onClose}
			>
				<X size={16} />
			</button>
		</div>
	);
};

const NavBar: React.FC<NavBarProps> = ({ showToast }) => {
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<nav className="bg-white border-b border-gray-200 fixed w-full z-10 top-0 shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<div className="flex-shrink-0 flex items-center">
							<span className="text-2xl font-bold text-indigo-600">
								PublicVoice
							</span>
						</div>
						<div className="hidden sm:ml-8 sm:flex sm:space-x-8">
							<a
								href="#"
								className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Home is active", "success");
								}}
							>
								Home
							</a>
							<a
								href="#"
								className="border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Trending section coming soon", "error");
								}}
							>
								Trending
							</a>
							<a
								href="#"
								className="border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Communities feature coming soon", "error");
								}}
							>
								Communities
							</a>
							<a
								href="#"
								className="border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Notifications feature coming soon", "error");
								}}
							>
								Notifications
							</a>
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
								placeholder="Search topics or discussions..."
								type="search"
								onClick={() => showToast("Search feature coming soon", "error")}
							/>
						</div>
						<button
							className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none relative transition-all duration-200 cursor-pointer"
							onClick={() =>
								showToast("Notifications feature coming soon", "error")
							}
						>
							<Bell className="h-6 w-6" />
							<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
						</button>
						<div className="relative">
							<button
								className="flex text-sm rounded-full focus:outline-none cursor-pointer"
								onClick={() => setShowDropdown(!showDropdown)}
							>
								<div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200">
									<User className="h-5 w-5" />
								</div>
							</button>

							{showDropdown && (
								<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center"
										onClick={(e) => {
											e.preventDefault();
											showToast("Profile feature coming soon", "error");
										}}
									>
										<User className="h-4 w-4 mr-2" />
										Your Profile
									</a>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Settings feature coming soon", "error");
										}}
									>
										Settings
									</a>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Help center coming soon", "error");
										}}
									>
										Help Center
									</a>
									<div className="border-t border-gray-100 my-1"></div>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Logout feature coming soon", "error");
										}}
									>
										Sign out
									</a>
								</div>
							)}
						</div>
					</div>
					<div className="flex items-center sm:hidden">
						<button
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors duration-200 cursor-pointer"
							onClick={() => showToast("Mobile menu coming soon", "error")}
						>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
	return (
		<div className="flex space-x-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 rounded-md p-2">
			<div className="flex-shrink-0">
				<div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
					<User className="h-5 w-5 text-gray-600" />
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium text-gray-900">{comment.author}</p>
				<p className="text-sm text-gray-600">{comment.text}</p>
			</div>
		</div>
	);
};

const CreatePoll: React.FC<CreatePollProps> = ({ onPollCreated, onCancel }) => {
	const [question, setQuestion] = useState<string>("");
	const [options, setOptions] = useState<string[]>(["", ""]);

	const addOption = () => {
		if (options.length < 6) {
			setOptions([...options, ""]);
		}
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const removeOption = (index: number) => {
		if (options.length > 2) {
			const newOptions = [...options];
			newOptions.splice(index, 1);
			setOptions(newOptions);
		}
	};

	const handleSubmit = () => {
		if (question.trim() === "") {
			return;
		}

		const validOptions = options.filter((opt) => opt.trim() !== "");
		if (validOptions.length < 2) {
			return;
		}

		const newPoll: PollType = {
			question: question,
			options: validOptions.map((text) => ({ text, votes: 0 })),
		};

		onPollCreated(newPoll);
	};

	return (
		<div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100 mb-4 shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-medium text-indigo-800">Create a Poll</h3>
				<button
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
				>
					<X size={20} />
				</button>
			</div>

			<div className="mb-4">
				<label
					htmlFor="poll-question"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Question
				</label>
				<input
					type="text"
					id="poll-question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder="Ask a question..."
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Options
				</label>
				{options.map((option, index) => (
					<div key={index} className="flex items-center mb-2">
						<input
							type="text"
							value={option}
							onChange={(e) => updateOption(index, e.target.value)}
							placeholder={`Option ${index + 1}`}
							className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
						/>
						{options.length > 2 && (
							<button
								onClick={() => removeOption(index)}
								className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-200"
							>
								<X size={18} />
							</button>
						)}
					</div>
				))}

				{options.length < 6 && (
					<button
						onClick={addOption}
						className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 cursor-pointer flex items-center mt-1"
					>
						+ Add another option
					</button>
				)}
			</div>

			<div className="flex justify-end space-x-2">
				<button
					onClick={onCancel}
					className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
				>
					Cancel
				</button>
				<button
					onClick={handleSubmit}
					className="px-4 py-2 bg-indigo-600 rounded-md text-white shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
				>
					Create Poll
				</button>
			</div>
		</div>
	);
};

const Poll: React.FC<PollProps> = ({
	poll,
	showToast,
	postId,
	onVoteUpdate,
}) => {
	const [voted, setVoted] = useState<number | null>(null);
	const [pollData, setPollData] = useState<PollType>(poll);
	const [animating, setAnimating] = useState<number | null>(null);

	const handleVote = (index: number) => {
		const updatedPoll = { ...pollData };
		const updatedOptions = [...updatedPoll.options];

		if (voted !== null && voted !== index) {
			updatedOptions[voted].votes = Math.max(
				0,
				updatedOptions[voted].votes - 1
			);
		}

		if (voted === index) {
			setVoted(null);
			showToast("Your vote has been removed", "success");
		} else {
			updatedOptions[index].votes += 1;
			setVoted(index);
			setAnimating(index);

			setTimeout(() => setAnimating(null), 600);

			showToast(
				voted !== null
					? "Your vote has been changed"
					: "Your vote has been recorded",
				"success"
			);
		}

		updatedPoll.options = updatedOptions;
		setPollData(updatedPoll);

		if (onVoteUpdate) {
			onVoteUpdate(updatedPoll);
		}
	};

	const totalVotes = pollData.options.reduce(
		(sum, option) => sum + option.votes,
		0
	);

	return (
		<div className="bg-white rounded-lg border border-indigo-100 p-5 mt-4 shadow-md">
			<div className="flex items-center mb-3">
				<div className="bg-indigo-100 p-2 rounded-full mr-3">
					<PieChart className="h-5 w-5 text-indigo-600" />
				</div>
				<h3 className="text-lg font-medium text-gray-900">
					{pollData.question}
				</h3>
			</div>
			<div className="space-y-3 mt-4">
				{pollData.options.map((option, index) => {
					const percentage =
						totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
					const isSelected = voted === index;
					return (
						<div key={index} className="relative">
							<button
								onClick={() => handleVote(index)}
								className={`w-full text-left p-3 border rounded-md cursor-pointer transition-all duration-300 ${
									isSelected
										? "border-indigo-500 bg-indigo-50 shadow-md"
										: "border-gray-200 hover:bg-gray-50 hover:border-indigo-200"
								}`}
							>
								<div className="flex justify-between items-center mb-1">
									<span
										className={`text-sm font-medium ${
											isSelected ? "text-indigo-700" : "text-gray-700"
										}`}
									>
										{option.text}
									</span>
									<span
										className={`text-sm font-medium ${
											isSelected ? "text-indigo-600" : "text-gray-500"
										} bg-gray-100 px-2 py-0.5 rounded-full`}
									>
										{percentage}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
									<div
										className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
											animating === index ? "animate-pulse" : ""
										} ${isSelected ? "bg-indigo-600" : "bg-indigo-400"}`}
										style={{ width: `${percentage}%` }}
									></div>
								</div>
								<div className="mt-1 text-xs text-gray-500 flex items-center">
									{option.votes} {option.votes === 1 ? "vote" : "votes"}
									{isSelected && (
										<span className="ml-2 text-indigo-600 font-medium flex items-center">
											• Your vote
										</span>
									)}
								</div>
							</button>
						</div>
					);
				})}
			</div>
			<div className="mt-4 text-sm text-gray-500 flex items-center bg-gray-50 p-2 rounded-md">
				<AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
				<span>Total votes: {totalVotes}</span>
			</div>
		</div>
	);
};

const PostCard: React.FC<PostCardProps> = ({
	post,
	showToast,
	onPostUpdate,
}) => {
	const [likes, setLikes] = useState<number>(post.likes);
	const [dislikes, setDislikes] = useState<number>(post.dislikes);
	const [liked, setLiked] = useState<boolean>(false);
	const [disliked, setDisliked] = useState<boolean>(false);
	const [showComments, setShowComments] = useState<boolean>(false);
	const [comments, setComments] = useState<CommentType[]>(post.comments);
	const [newComment, setNewComment] = useState<string>("");
	const [poll, setPoll] = useState<PollType | null>(post.poll);
	const [animateLike, setAnimateLike] = useState<boolean>(false);
	const [animateDislike, setAnimateDislike] = useState<boolean>(false);

	const handleLike = () => {
		if (liked) {
			setLikes(likes - 1);
			setLiked(false);
		} else {
			setLikes(likes + 1);
			setLiked(true);
			setAnimateLike(true);
			setTimeout(() => setAnimateLike(false), 300);

			if (disliked) {
				setDislikes(dislikes - 1);
				setDisliked(false);
			}
		}

		if (onPostUpdate) {
			const updatedPost = {
				...post,
				likes: liked ? likes - 1 : likes + 1,
				dislikes: disliked && !liked ? dislikes - 1 : dislikes,
			};
			onPostUpdate(updatedPost);
		}
	};

	const handleDislike = () => {
		if (disliked) {
			setDislikes(dislikes - 1);
			setDisliked(false);
		} else {
			setDislikes(dislikes + 1);
			setDisliked(true);
			setAnimateDislike(true);
			setTimeout(() => setAnimateDislike(false), 300);

			if (liked) {
				setLikes(likes - 1);
				setLiked(false);
			}
		}

		if (onPostUpdate) {
			const updatedPost = {
				...post,
				dislikes: disliked ? dislikes - 1 : dislikes + 1,
				likes: liked && !disliked ? likes - 1 : likes,
			};
			onPostUpdate(updatedPost);
		}
	};

	const handleShare = () => {
		showToast("Link copied to clipboard!", "success");
	};

	const handleAddComment = () => {
		if (newComment.trim() && newComment.length <= 50) {
			const comment = {
				id: comments.length + 1,
				author: "You",
				text: newComment,
			};
			const updatedComments = [...comments, comment];
			setComments(updatedComments);
			setNewComment("");
			showToast("Comment added successfully", "success");

			if (onPostUpdate) {
				const updatedPost = {
					...post,
					comments: updatedComments,
				};
				onPostUpdate(updatedPost);
			}
		} else if (newComment.length > 50) {
			showToast("Comment must be 50 characters or less", "error");
		} else {
			showToast("Please enter a comment", "error");
		}
	};

	const handlePollUpdate = (updatedPoll: PollType) => {
		setPoll(updatedPoll);

		if (onPostUpdate) {
			const updatedPost = {
				...post,
				poll: updatedPoll,
			};
			onPostUpdate(updatedPost);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
			<div className="p-5">
				<div className="flex items-center mb-4">
					<div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3 shadow-md">
						<User className="h-6 w-6" />
					</div>
					<div>
						<h3 className="text-lg font-medium text-gray-900">{post.author}</h3>
						<p className="text-sm text-gray-500 flex items-center">
							<Calendar className="h-3 w-3 mr-1" />
							{post.date}
						</p>
					</div>
				</div>
				<h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
				<p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

				{post.image && (
					<div className="relative rounded-lg overflow-hidden mb-4 group shadow-md">
						<img
							src={post.image}
							alt={post.title}
							className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</div>
				)}

				{poll && (
					<Poll
						poll={poll}
						showToast={showToast}
						postId={post.id}
						onVoteUpdate={handlePollUpdate}
					/>
				)}

				<div className="flex items-center justify-between mt-5 border-t border-gray-100 pt-4">
					<div className="flex space-x-6">
						<button
							onClick={handleLike}
							className={`flex items-center space-x-2 ${
								liked ? "text-indigo-600" : "text-gray-500"
							} hover:text-indigo-600 transition-colors duration-200 cursor-pointer group`}
						>
							<ThumbsUp
								size={20}
								className={`transition-transform duration-200 ${
									animateLike ? "scale-125" : "group-hover:scale-110"
								} ${liked ? "fill-indigo-600" : ""}`}
							/>
							<span
								className={`text-sm font-medium ${
									liked ? "text-indigo-600" : ""
								}`}
							>
								{likes}
							</span>
						</button>
						<button
							onClick={handleDislike}
							className={`flex items-center space-x-2 ${
								disliked ? "text-red-600" : "text-gray-500"
							} hover:text-red-600 transition-colors duration-200 cursor-pointer group`}
						>
							<ThumbsDown
								size={20}
								className={`transition-transform duration-200 ${
									animateDislike ? "scale-125" : "group-hover:scale-110"
								} ${disliked ? "fill-red-600" : ""}`}
							/>
							<span
								className={`text-sm font-medium ${
									disliked ? "text-red-600" : ""
								}`}
							>
								{dislikes}
							</span>
						</button>
						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer group"
						>
							<MessageCircle
								size={20}
								className="group-hover:scale-110 transition-transform duration-200"
							/>
							<span className="text-sm font-medium">{comments.length}</span>
						</button>
					</div>
					<button
						onClick={handleShare}
						className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer group bg-gray-50 px-3 py-1.5 rounded-full hover:bg-indigo-50"
					>
						<Share2
							size={18}
							className="group-hover:scale-110 transition-transform duration-200"
						/>
						<span className="hidden sm:inline text-sm font-medium">Share</span>
					</button>
				</div>
			</div>

			{showComments && (
				<div className="bg-gray-50 p-5 border-t border-gray-100">
					<h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
						<MessageCircle size={18} className="mr-2 text-indigo-600" />
						Comments
					</h4>
					<div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-2">
						{comments.map((comment) => (
							<Comment key={comment.id} comment={comment} />
						))}
						{comments.length === 0 && (
							<div className="text-gray-500 text-sm py-4 flex flex-col items-center justify-center bg-gray-100 rounded-md">
								<MessageCircle size={24} className="mb-2 text-gray-400" />
								<p>No comments yet. Be the first to comment!</p>
							</div>
						)}
					</div>
					<div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
						<input
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment (max 50 characters)"
							maxLength={50}
							className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleAddComment();
								}
							}}
						/>
						<button
							onClick={handleAddComment}
							className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
						>
							<Send size={18} />
						</button>
					</div>
					<div className="mt-2 text-xs text-gray-500 flex items-center">
						<span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
							{50 - newComment.length} characters remaining
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

const CreatePost: React.FC<CreatePostProps> = ({
	showToast,
	onPostCreated,
}) => {
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [showPollCreator, setShowPollCreator] = useState<boolean>(false);
	const [poll, setPoll] = useState<PollType | null>(null);

	const handleSubmit = () => {
		if (!title.trim() || !content.trim()) {
			showToast("Please fill in both title and content", "error");
			return;
		}

		const newPost: Post = {
			id: Date.now(),
			author: "You",
			date: "Just now",
			title: title,
			content: content,
			image: "",
			likes: 0,
			dislikes: 0,
			comments: [],
			poll: poll,
		};

		onPostCreated(newPost);

		setTitle("");
		setContent("");
		setPoll(null);
		setIsCreating(false);
		setShowPollCreator(false);

		showToast("Post created successfully", "success");
	};

	const handlePollCreated = (newPoll: PollType) => {
		setPoll(newPoll);
		setShowPollCreator(false);
		showToast("Poll added to your post", "success");
	};

	if (!isCreating) {
		return (
			<div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
				<div className="flex items-center space-x-3">
					<div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
						<User className="h-6 w-6" />
					</div>
					<button
						className="flex-grow text-left bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-full transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
						onClick={() => setIsCreating(true)}
					>
						What's on your mind about public issues?
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-100">
			<div className="mb-4">
				<h3 className="text-xl font-medium mb-4 text-gray-800 flex items-center">
					<span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full mr-2">
						<User className="h-5 w-5" />
					</span>
					Create a Post
				</h3>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
				/>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="What's on your mind about public issues?"
					rows={4}
					className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
				></textarea>
			</div>

			{showPollCreator ? (
				<CreatePoll
					onPollCreated={handlePollCreated}
					onCancel={() => setShowPollCreator(false)}
				/>
			) : poll ? (
				<div className="mb-4">
					<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<div className="bg-indigo-100 p-1.5 rounded-full mr-2">
									<PieChart className="h-5 w-5 text-indigo-600" />
								</div>
								<span className="font-medium text-indigo-800">
									{poll.question}
								</span>
							</div>
							<button
								onClick={() => setPoll(null)}
								className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer bg-white rounded-full p-1.5 shadow-sm hover:shadow-md"
							>
								<X size={18} />
							</button>
						</div>
						<div className="text-sm text-indigo-600 mt-2 bg-white p-2 rounded-md inline-block">
							Poll with {poll.options.length} options
						</div>
					</div>
				</div>
			) : null}

			<div className="flex justify-between items-center">
				<div className="flex space-x-1 bg-gray-50 p-1 rounded-lg">
					<button
						className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 cursor-pointer px-3 py-1.5 rounded-md hover:bg-indigo-50"
						onClick={() => showToast("Image upload coming soon", "error")}
					>
						<Image className="h-5 w-5 mr-1.5" />
						<span className="text-sm font-medium">Image</span>
					</button>
					<button
						className={`flex items-center transition-colors duration-200 cursor-pointer px-3 py-1.5 rounded-md ${
							poll
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
						}`}
						onClick={() => {
							if (!poll) {
								setShowPollCreator(true);
							}
						}}
					>
						<PieChart className="h-5 w-5 mr-1.5" />
						<span className="text-sm font-medium">Poll</span>
					</button>
					<button
						className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 cursor-pointer px-3 py-1.5 rounded-md hover:bg-indigo-50"
						onClick={() => showToast("Event creation coming soon", "error")}
					>
						<Calendar className="h-5 w-5 mr-1.5" />
						<span className="text-sm font-medium">Event</span>
					</button>
				</div>

				<div className="flex space-x-2">
					<button
						onClick={() => {
							setIsCreating(false);
							setTitle("");
							setContent("");
							setPoll(null);
							setShowPollCreator(false);
						}}
						className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className={`px-4 py-2 rounded-md text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
							!title.trim() || !content.trim()
								? "bg-gray-400 cursor-not-allowed"
								: "bg-indigo-600 hover:bg-indigo-700"
						}`}
						disabled={!title.trim() || !content.trim()}
					>
						Post
					</button>
				</div>
			</div>
		</div>
	);
};

const FilterBar: React.FC<FilterBarProps> = ({
	showToast,
	activeFilter,
	onFilterChange,
}) => {
	const filters = [
		{ id: "all", name: "All Issues" },
		{ id: "environment", name: "Environment" },
		{ id: "education", name: "Education" },
		{ id: "transportation", name: "Transportation" },
		{ id: "healthcare", name: "Healthcare" },
		{ id: "housing", name: "Housing" },
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center overflow-x-auto border border-gray-100">
			<span className="text-gray-700 font-medium mr-4 whitespace-nowrap">
				Filter by:
			</span>
			<div className="flex space-x-2">
				{filters.map((filter) => (
					<button
						key={filter.id}
						className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
							activeFilter === filter.id
								? "bg-indigo-100 text-indigo-700 shadow-sm"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => {
							onFilterChange(filter.id);
							if (filter.id === "all") {
								showToast("Showing all issues", "success");
							} else if (filter.id === "environment") {
								showToast("Showing environment issues", "success");
							} else {
								showToast(`${filter.name} filter coming soon`, "error");
								onFilterChange("all");
							}
						}}
					>
						{filter.name}
					</button>
				))}
			</div>
		</div>
	);
};

const PublicIssuesPlatform = () => {
	const demoData: Post[] = [
		{
			id: 1,
			author: "Jane Doe",
			date: "3 hours ago",
			title: "Climate Change Policy",
			content:
				"Should our city implement stricter regulations on carbon emissions from local businesses? Many small business owners are concerned about the economic impact, while environmental groups are pushing for immediate action.",
			image:
				"https://plus.unsplash.com/premium_photo-1664298311043-46b3814a511f?q=80&w=2550&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			likes: 125,
			dislikes: 23,
			comments: [
				{
					id: 1,
					author: "Alex Johnson",
					text: "We need to find a balance between environmental protection and economic growth.",
				},
				{
					id: 2,
					author: "Maria Garcia",
					text: "The climate crisis won't wait. We need bold action now, not later.",
				},
			],
			poll: {
				question: "What approach should our city take on carbon emissions?",
				options: [
					{ text: "Strict regulations immediately", votes: 156 },
					{ text: "Gradual implementation over 5 years", votes: 243 },
					{ text: "Incentives instead of regulations", votes: 189 },
					{ text: "No new regulations needed", votes: 82 },
				],
			},
		},
		{
			id: 2,
			author: "John Smith",
			date: "Yesterday",
			title: "Public Transportation Expansion",
			content:
				"The city council is considering a major expansion of our public transportation system. The proposal includes new bus routes, bike lanes, and a downtown light rail. What are your thoughts on this $450 million project?",
			image:
				"https://images.unsplash.com/photo-1502818364365-08cda033fee1?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			likes: 87,
			dislikes: 12,
			comments: [
				{
					id: 1,
					author: "Sarah Williams",
					text: "I'm all for this! We desperately need better public transit options.",
				},
				{
					id: 2,
					author: "David Chen",
					text: "The cost seems high. Will this increase our taxes?",
				},
				{
					id: 3,
					author: "Rajiv Patel",
					text: "Bike lanes would be a game changer for my daily commute.",
				},
			],
			poll: null,
		},
		{
			id: 3,
			author: "Elena Rodriguez",
			date: "2 days ago",
			title: "Education Budget Allocation",
			content:
				"Our school district has received an additional $2 million in funding. How should we allocate these resources? Teacher salaries, new technology, facility improvements, or extracurricular programs?",
			image:
				"https://plus.unsplash.com/premium_photo-1726750864109-39b235d63f95?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			likes: 215,
			dislikes: 8,
			comments: [
				{
					id: 1,
					author: "Michael Taylor",
					text: "Teacher salaries should be the priority. We can't retain good educators with current pay.",
				},
			],
			poll: {
				question: "Where should the additional education funding go?",
				options: [
					{ text: "Teacher salaries and benefits", votes: 312 },
					{ text: "Classroom technology upgrades", votes: 145 },
					{ text: "Building renovations", votes: 87 },
					{ text: "Expanded after-school programs", votes: 204 },
				],
			},
		},
	];

	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [posts, setPosts] = useState<Post[]>(demoData);

	const showToast = (message: string, type: "success" | "error") => {
		setToast({ message, type });
		setTimeout(() => {
			setToast(null);
		}, 3000);
	};

	const handlePostCreated = (newPost: Post) => {
		setPosts([newPost, ...posts]);
	};

	const handlePostUpdate = (updatedPost: Post) => {
		const updatedPosts = posts.map((post) =>
			post.id === updatedPost.id ? updatedPost : post
		);
		setPosts(updatedPosts);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<NavBar showToast={showToast} />

			<main className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 my-6 flex items-center">
					<span className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3 shadow-sm">
						<MessageCircle size={24} />
					</span>
					Public Issues Forum
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<CreatePost
							showToast={showToast}
							onPostCreated={handlePostCreated}
						/>
						<FilterBar
							showToast={showToast}
							activeFilter={activeFilter}
							onFilterChange={setActiveFilter}
						/>

						{posts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								showToast={showToast}
								onPostUpdate={handlePostUpdate}
							/>
						))}

						<div className="flex justify-center mt-8">
							<button
								className="bg-white text-indigo-600 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-indigo-100 hover:bg-indigo-50 font-medium"
								onClick={() => showToast("Load more coming soon", "error")}
							>
								Load More
							</button>
						</div>
					</div>

					<div className="hidden lg:block space-y-6">
						<div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-200">
							<h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
								<svg
									className="h-5 w-5 mr-2 text-indigo-600"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
								Trending Topics
							</h2>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Trending topic details coming soon", "error");
										}}
									>
										<span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-medium mr-3">
											#1
										</span>
										<span className="font-medium">Climate Action Plan</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Trending topic details coming soon", "error");
										}}
									>
										<span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-medium mr-3">
											#2
										</span>
										<span className="font-medium">School Budget Debate</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Trending topic details coming soon", "error");
										}}
									>
										<span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-medium mr-3">
											#3
										</span>
										<span className="font-medium">Downtown Redevelopment</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Trending topic details coming soon", "error");
										}}
									>
										<span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-medium mr-3">
											#4
										</span>
										<span className="font-medium">
											Public Safety Initiative
										</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Trending topic details coming soon", "error");
										}}
									>
										<span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 font-medium mr-3">
											#5
										</span>
										<span className="font-medium">
											Healthcare Access Proposal
										</span>
									</a>
								</li>
							</ul>
							<button
								className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 cursor-pointer flex items-center font-medium"
								onClick={() =>
									showToast("View all trending topics coming soon", "error")
								}
							>
								View all trending topics
								<svg
									className="h-4 w-4 ml-1"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>

						<div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-200">
							<h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
								<Calendar className="h-5 w-5 mr-2 text-indigo-600" />
								Upcoming Events
							</h2>
							<ul className="space-y-4">
								<li>
									<a
										href="#"
										className="block hover:bg-indigo-50 p-3 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
										onClick={(e) => {
											e.preventDefault();
											showToast("Event details coming soon", "error");
										}}
									>
										<p className="font-medium text-gray-900 flex items-center">
											<span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
											Town Hall Meeting
										</p>
										<p className="text-sm text-indigo-600 mt-1 flex items-center">
											<Calendar className="h-3 w-3 mr-1" />
											May 5, 2025 • 6:00 PM
										</p>
										<p className="text-sm text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
											City Hall, Main Auditorium
										</p>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="block hover:bg-indigo-50 p-3 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
										onClick={(e) => {
											e.preventDefault();
											showToast("Event details coming soon", "error");
										}}
									>
										<p className="font-medium text-gray-900 flex items-center">
											<span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
											School Board Meeting
										</p>
										<p className="text-sm text-indigo-600 mt-1 flex items-center">
											<Calendar className="h-3 w-3 mr-1" />
											May 12, 2025 • 7:30 PM
										</p>
										<p className="text-sm text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
											Central School District Office
										</p>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="block hover:bg-indigo-50 p-3 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
										onClick={(e) => {
											e.preventDefault();
											showToast("Event details coming soon", "error");
										}}
									>
										<p className="font-medium text-gray-900 flex items-center">
											<span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
											Public Transit Forum
										</p>
										<p className="text-sm text-indigo-600 mt-1 flex items-center">
											<Calendar className="h-3 w-3 mr-1" />
											May 18, 2025 • 5:30 PM
										</p>
										<p className="text-sm text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
											Community Center, Room 103
										</p>
									</a>
								</li>
							</ul>
							<button
								className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 cursor-pointer flex items-center font-medium"
								onClick={() =>
									showToast("View all events coming soon", "error")
								}
							>
								View all events
								<svg
									className="h-4 w-4 ml-1"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>

						<div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-200">
							<h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
								<svg
									className="h-5 w-5 mr-2 text-indigo-600"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Popular Communities
							</h2>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Community details coming soon", "error");
										}}
									>
										<div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 shadow-sm">
											<svg
												className="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium block">
												Environmental Action
											</span>
											<span className="text-xs text-gray-500">
												12.4k members
											</span>
										</div>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Community details coming soon", "error");
										}}
									>
										<div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 shadow-sm">
											<svg
												className="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium block">
												Education Reform
											</span>
											<span className="text-xs text-gray-500">
												8.7k members
											</span>
										</div>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Community details coming soon", "error");
										}}
									>
										<div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3 shadow-sm">
											<svg
												className="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium block">
												Urban Development
											</span>
											<span className="text-xs text-gray-500">
												6.2k members
											</span>
										</div>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center text-gray-700 hover:text-indigo-600 p-2 rounded-md hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											showToast("Community details coming soon", "error");
										}}
									>
										<div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white mr-3 shadow-sm">
											<svg
												className="h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
												/>
											</svg>
										</div>
										<div>
											<span className="font-medium block">
												Healthcare Access
											</span>
											<span className="text-xs text-gray-500">
												9.1k members
											</span>
										</div>
									</a>
								</li>
							</ul>
							<button
								className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 cursor-pointer flex items-center font-medium"
								onClick={() =>
									showToast("View all communities coming soon", "error")
								}
							>
								Explore all communities
								<svg
									className="h-4 w-4 ml-1"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</main>

			<footer className="bg-white border-t border-gray-200 py-8 mt-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row md:justify-between items-center">
						<div className="mb-6 md:mb-0">
							<span className="text-2xl font-bold text-indigo-600">
								PublicVoice
							</span>
							<p className="mt-2 text-sm text-gray-500">
								A platform for public discourse on important issues.
							</p>
						</div>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("About page coming soon", "error");
								}}
							>
								About
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Privacy policy coming soon", "error");
								}}
							>
								Privacy
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Terms of service coming soon", "error");
								}}
							>
								Terms
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Contact page coming soon", "error");
								}}
							>
								Contact
							</a>
						</div>
					</div>
					<div className="mt-8 border-t border-gray-200 pt-8 text-center">
						<p className="text-sm text-gray-500">
							&copy; 2025 PublicVoice. All rights reserved.
						</p>
						<div className="mt-2 flex justify-center space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Social media links coming soon", "error");
								}}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Social media links coming soon", "error");
								}}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.625.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Social media links coming soon", "error");
								}}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									showToast("Social media links coming soon", "error");
								}}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>

			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
};

export default PublicIssuesPlatform;
