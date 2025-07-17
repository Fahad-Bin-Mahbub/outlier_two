"use client";
import React, { useState, useEffect } from "react";
import {
	Bell,
	MessageCircle,
	User,
	Search,
	Heart,
	X,
	Check,
	Calendar,
	MapPin,
	Clock,
	Plus,
	Camera,
	Send,
} from "lucide-react";

type Hobby = {
	id: string;
	title: string;
	description: string;
	location: string;
	schedule: string;
	image: string;
	userId: string;
	createdBy: User;
};

type User = {
	id: string;
	name: string;
	avatar: string;
	bio: string;
};

type Message = {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
	read: boolean;
};

type ConnectionRequest = {
	id: string;
	senderId: string;
	receiverId: string;
	hobbyId: string;
	status: "pending" | "accepted" | "rejected";
};

const mockUsers: User[] = [
	{
		id: "user1",
		name: "Alex Johnson",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		bio: "Outdoor enthusiast and hobby collector",
	},
	{
		id: "user2",
		name: "Jamie Smith",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		bio: "Love learning new skills and meeting people",
	},
	{
		id: "user3",
		name: "Taylor Wong",
		avatar:
			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		bio: "Amateur photographer and hiker",
	},
];

const mockHobbies: Hobby[] = [
	{
		id: "hobby1",
		title: "Landscape Photography",
		description:
			"Weekly photo walks around local parks and scenic spots. All skill levels welcome!",
		location: "Central Park",
		schedule: "Saturdays, 9 AM - 11 AM",
		image:
			"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user1",
		createdBy: mockUsers[0],
	},
	{
		id: "hobby2",
		title: "Board Game Night",
		description:
			"Casual board game meetup with a variety of games from strategy to party games.",
		location: "The Game Cafe, Downtown",
		schedule: "Thursdays, 6 PM - 10 PM",
		image:
			"https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user2",
		createdBy: mockUsers[1],
	},
	{
		id: "hobby3",
		title: "Urban Sketching",
		description:
			"Drawing and sketching urban landscapes around the city. Bring your own supplies!",
		location: "City Art District",
		schedule: "Sundays, 2 PM - 4 PM",
		image:
			"https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user3",
		createdBy: mockUsers[2],
	},
	{
		id: "hobby4",
		title: "Trail Running",
		description:
			"Group runs on local trails for all fitness levels. Come join us for exercise and fresh air!",
		location: "Forest Park Trails",
		schedule: "Tuesdays & Fridays, 7 AM - 8 AM",
		image:
			"https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user1",
		createdBy: mockUsers[0],
	},
	{
		id: "hobby5",
		title: "Cooking Workshop",
		description:
			"Learn to cook international cuisines with a local chef. Ingredients provided.",
		location: "Community Kitchen",
		schedule: "Mondays, 6 PM - 8 PM",
		image:
			"https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user2",
		createdBy: mockUsers[1],
	},
	{
		id: "hobby6",
		title: "Book Club",
		description:
			"Monthly book discussions over coffee. We read a mix of fiction and non-fiction.",
		location: "Riverside Library",
		schedule: "Last Saturday of month, 3 PM - 5 PM",
		image:
			"https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
		userId: "user3",
		createdBy: mockUsers[2],
	},
];

const mockMessages: Message[] = [
	{
		id: "msg1",
		senderId: "user2",
		receiverId: "user1",
		content:
			"Hi! I saw your photography hobby listing. I'd love to join next Saturday!",
		timestamp: new Date("2025-04-28T14:22:00"),
		read: false,
	},
	{
		id: "msg2",
		senderId: "user3",
		receiverId: "user1",
		content: "When is the next trail running session?",
		timestamp: new Date("2025-04-29T09:15:00"),
		read: true,
	},
];

const mockRequests: ConnectionRequest[] = [
	{
		id: "req1",
		senderId: "user2",
		receiverId: "user1",
		hobbyId: "hobby1",
		status: "pending",
	},
	{
		id: "req2",
		senderId: "user3",
		receiverId: "user1",
		hobbyId: "hobby4",
		status: "accepted",
	},
];

const AddHobbyModal = ({ isOpen, onClose, onAdd, currentUser }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [schedule, setSchedule] = useState("");
	const [image, setImage] = useState(
		"https://plus.unsplash.com/premium_photo-1677355760435-8c1f1d81edc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	);

	const handleSubmit = () => {
		if (!title || !description || !location || !schedule) {
			alert("Please fill out all fields");
			return;
		}

		const newHobby = {
			id: `hobby${Date.now()}`,
			title,
			description,
			location,
			schedule,
			image,
			userId: currentUser.id,
			createdBy: currentUser,
		};

		onAdd(newHobby);
		onClose();

		setTitle("");
		setDescription("");
		setLocation("");
		setSchedule("");
		setImage("/api/placeholder/500/300");
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h3 className="text-lg font-bold text-gray-900">Add a New Hobby</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				<div className="p-6">
					<div className="mb-6">
						<div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
							<img
								src={image}
								alt="Hobby preview"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
								<div className="text-white flex flex-col items-center">
									<Camera size={24} />
									<span className="text-sm mt-1">Choose Image</span>
								</div>
							</div>
						</div>
					</div>

					<div className="mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., Weekend Hiking Group"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Describe your hobby, who it's for, what to expect..."
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Location
						</label>
						<input
							type="text"
							id="location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., Central Park, East Entrance"
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="schedule"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Schedule
						</label>
						<input
							type="text"
							id="schedule"
							value={schedule}
							onChange={(e) => setSchedule(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., Saturdays, 10 AM - 12 PM"
						/>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="px-4 py-2 bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							Create Hobby
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const Toast = ({ message, type = "success", onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-slide-up">
			<div
				className={`rounded-lg shadow-lg p-4 flex items-center ${
					type === "success" ? "bg-green-500" : "bg-red-500"
				} text-white`}
			>
				<div className="mr-3">
					{type === "success" ? (
						<Check className="h-5 w-5" />
					) : (
						<X className="h-5 w-5" />
					)}
				</div>
				<div className="flex-1">{message}</div>
				<button
					onClick={onClose}
					className="ml-auto text-white hover:text-gray-200 cursor-pointer"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

const Hobby = () => {
	const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
	const [hobbies, setHobbies] = useState<Hobby[]>(mockHobbies);
	const [filteredHobbies, setFilteredHobbies] = useState<Hobby[]>(mockHobbies);
	const [messages, setMessages] = useState<Message[]>(mockMessages);
	const [requests, setRequests] = useState<ConnectionRequest[]>(mockRequests);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<
		"home" | "messages" | "profile"
	>("home");
	const [activeMessageUser, setActiveMessageUser] = useState<User | null>(null);
	const [newMessageText, setNewMessageText] = useState<string>("");
	const [showMessagePane, setShowMessagePane] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);

	const [showAddHobbyModal, setShowAddHobbyModal] = useState<boolean>(false);
	const [toast, setToast] = useState<{
		show: boolean;
		message: string;
		type: "success" | "error";
	}>({
		show: false,
		message: "",
		type: "success",
	});

	useEffect(() => {
		if (searchTerm) {
			const filtered = hobbies.filter(
				(hobby) =>
					hobby.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					hobby.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
					hobby.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredHobbies(filtered);
		} else {
			setFilteredHobbies(hobbies);
		}
	}, [searchTerm, hobbies]);

	const handleRequestResponse = (
		requestId: string,
		status: "accepted" | "rejected"
	) => {
		const updatedRequests = requests.map((req) =>
			req.id === requestId ? { ...req, status } : req
		);
		setRequests(updatedRequests);
		setShowNotifications(false);

		if (status === "accepted") {
			showToast("Connection request accepted!", "success");
		} else {
			showToast("Connection request declined.", "success");
		}
	};

	const sendMessage = () => {
		if (newMessageText.trim() && activeMessageUser) {
			const newMessage: Message = {
				id: `msg${messages.length + 1}`,
				senderId: currentUser.id,
				receiverId: activeMessageUser.id,
				content: newMessageText,
				timestamp: new Date(),
				read: false,
			};
			setMessages([...messages, newMessage]);
			setNewMessageText("");
		}
	};

	const sendConnectionRequest = (hobby: Hobby) => {
		if (hobby.userId === currentUser.id) return;

		const existingRequest = requests.find(
			(req) =>
				req.senderId === currentUser.id &&
				req.hobbyId === hobby.id &&
				req.receiverId === hobby.userId
		);

		if (!existingRequest) {
			const newRequest: ConnectionRequest = {
				id: `req${requests.length + 1}`,
				senderId: currentUser.id,
				receiverId: hobby.userId,
				hobbyId: hobby.id,
				status: "pending",
			};
			setRequests([...requests, newRequest]);
			showToast("Connection request sent!", "success");
		} else {
			showToast("You have already sent a request for this hobby.", "error");
		}
	};

	const addHobby = (newHobby: Hobby) => {
		setHobbies([...hobbies, newHobby]);
		showToast("New hobby created successfully!", "success");
	};

	const showToast = (
		message: string,
		type: "success" | "error" = "success"
	) => {
		setToast({
			show: true,
			message,
			type,
		});
	};

	const hideToast = () => {
		setToast({ ...toast, show: false });
	};

	const getUnreadMessageCount = () => {
		return messages.filter(
			(msg) => msg.receiverId === currentUser.id && !msg.read
		).length;
	};

	const getPendingRequestCount = () => {
		return requests.filter(
			(req) => req.receiverId === currentUser.id && req.status === "pending"
		).length;
	};

	const renderPage = () => {
		switch (currentPage) {
			case "messages":
				return (
					<div className="p-6 max-w-6xl mx-auto">
						<h2 className="text-2xl font-bold mb-6">Messages</h2>
						<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
							{messages.some(
								(msg) =>
									msg.senderId === currentUser.id ||
									msg.receiverId === currentUser.id
							) ? (
								<div className="grid grid-cols-1 md:grid-cols-3">
									<div className="border-r border-gray-200">
										<div className="p-4 border-b border-gray-200">
											<h3 className="font-medium">Conversations</h3>
										</div>
										<div className="overflow-y-auto max-h-96">
											{Array.from(
												new Set([
													...messages
														.filter((msg) => msg.receiverId === currentUser.id)
														.map((msg) => msg.senderId),
													...messages
														.filter((msg) => msg.senderId === currentUser.id)
														.map((msg) => msg.receiverId),
												])
											).map((userId) => {
												const user = mockUsers.find((u) => u.id === userId);
												if (!user) return null;

												const unreadCount = messages.filter(
													(msg) =>
														msg.senderId === userId &&
														msg.receiverId === currentUser.id &&
														!msg.read
												).length;

												return (
													<div
														key={userId}
														className={`p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${
															activeMessageUser?.id === userId
																? "bg-blue-50"
																: ""
														}`}
														onClick={() => {
															setActiveMessageUser(user);
															setShowMessagePane(true);

															setMessages(
																messages.map((msg) =>
																	msg.senderId === userId &&
																	msg.receiverId === currentUser.id &&
																	!msg.read
																		? { ...msg, read: true }
																		: msg
																)
															);
														}}
													>
														<img
															src={user.avatar}
															alt={user.name}
															className="w-10 h-10 rounded-full mr-3"
														/>
														<div className="flex-1">
															<h4 className="font-medium">{user.name}</h4>
															<p className="text-sm text-gray-500 truncate">
																{
																	messages
																		.filter(
																			(msg) =>
																				(msg.senderId === userId &&
																					msg.receiverId === currentUser.id) ||
																				(msg.receiverId === userId &&
																					msg.senderId === currentUser.id)
																		)
																		.sort(
																			(a, b) =>
																				b.timestamp.getTime() -
																				a.timestamp.getTime()
																		)[0]?.content
																}
															</p>
														</div>
														{unreadCount > 0 && (
															<span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
																{unreadCount}
															</span>
														)}
													</div>
												);
											})}
										</div>
									</div>

									<div className="col-span-2 flex flex-col h-96">
										{activeMessageUser && showMessagePane ? (
											<>
												<div className="p-4 border-b border-gray-200 flex items-center">
													<img
														src={activeMessageUser.avatar}
														alt={activeMessageUser.name}
														className="w-8 h-8 rounded-full mr-3"
													/>
													<h3 className="font-medium">
														{activeMessageUser.name}
													</h3>
												</div>
												<div className="flex-1 overflow-y-auto p-4 space-y-4">
													{messages
														.filter(
															(msg) =>
																(msg.senderId === activeMessageUser.id &&
																	msg.receiverId === currentUser.id) ||
																(msg.receiverId === activeMessageUser.id &&
																	msg.senderId === currentUser.id)
														)
														.sort(
															(a, b) =>
																a.timestamp.getTime() - b.timestamp.getTime()
														)
														.map((msg) => (
															<div
																key={msg.id}
																className={`max-w-xs p-3 rounded-lg ${
																	msg.senderId === currentUser.id
																		? "ml-auto bg-blue-600 text-white shadow-sm"
																		: "bg-gray-100 text-gray-800 shadow-sm"
																}`}
															>
																<p>{msg.content}</p>
																<span className="text-xs opacity-75 block mt-1">
																	{msg.timestamp.toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</span>
															</div>
														))}
												</div>
												<div className="p-4 border-t border-gray-200">
													<div className="flex">
														<input
															type="text"
															className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
															placeholder="Type a message..."
															value={newMessageText}
															onChange={(e) =>
																setNewMessageText(e.target.value)
															}
															onKeyPress={(e) =>
																e.key === "Enter" && sendMessage()
															}
														/>
														<button
															className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center"
															onClick={sendMessage}
														>
															<Send size={18} className="mr-1" />
															Send
														</button>
													</div>
												</div>
											</>
										) : (
											<div className="flex items-center justify-center h-full text-gray-500">
												<div className="text-center p-8">
													<MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
													<p className="text-lg font-medium">
														Select a conversation
													</p>
													<p className="text-sm text-gray-400 mt-1">
														Choose a contact from the left to start messaging
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="p-12 text-center text-gray-500">
									<MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
									<h3 className="text-lg font-medium mb-2">No messages yet</h3>
									<p className="mb-6">
										Connect with hobby hosts to start conversations
									</p>
									<button
										onClick={() => setCurrentPage("home")}
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
									>
										Explore Hobbies
									</button>
								</div>
							)}
						</div>
					</div>
				);

			case "profile":
				return (
					<div className="p-6 max-w-4xl mx-auto">
						<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
							<div className="bg-gradient-to-r from-blue-600 to-purple-600 h-36"></div>
							<div className="px-6 pb-6">
								<div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
									<img
										src={currentUser.avatar}
										alt={currentUser.name}
										className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
									/>
									<div className="mt-4 sm:mt-0 p-2 sm:ml-4 text-center sm:text-left">
										<h2 className="text-2xl font-bold">{currentUser.name}</h2>
										<p className="text-gray-600">Member since April 2025</p>
									</div>
								</div>

								<div className="border-b border-gray-200 pb-6 mb-6">
									<h3 className="text-lg font-medium mb-3">About</h3>
									<p className="text-gray-600">{currentUser.bio}</p>
								</div>

								<div className="mb-8">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg font-medium">Your Hobbies</h3>
										<button
											onClick={() => setShowAddHobbyModal(true)}
											className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
										>
											<Plus size={16} className="mr-1" /> Add New Hobby
										</button>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{hobbies
											.filter((hobby) => hobby.userId === currentUser.id)
											.map((hobby) => (
												<div
													key={hobby.id}
													className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
												>
													<div className="relative">
														<img
															src={hobby.image}
															alt={hobby.title}
															className="w-full h-48 object-cover"
														/>
														<div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
															Your Hobby
														</div>
													</div>
													<div className="p-4">
														<h4 className="font-bold text-lg mb-2">
															{hobby.title}
														</h4>
														<div className="flex flex-wrap text-sm text-gray-600 mb-3">
															<div className="flex items-center mr-4 mb-2">
																<MapPin
																	size={16}
																	className="mr-1 text-gray-500"
																/>
																{hobby.location}
															</div>
															<div className="flex items-center mb-2">
																<Clock
																	size={16}
																	className="mr-1 text-gray-500"
																/>
																{hobby.schedule}
															</div>
														</div>
														<p className="text-gray-600 mb-4 text-sm line-clamp-2">
															{hobby.description}
														</p>

														<div className="flex justify-between items-center">
															<div className="flex items-center">
																<span className="text-sm font-medium text-gray-600 mr-2">
																	Connection Requests:
																</span>
																<span className="text-sm bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
																	{
																		requests.filter(
																			(req) =>
																				req.hobbyId === hobby.id &&
																				req.status === "pending"
																		).length
																	}
																</span>
															</div>
															<button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
																Manage
															</button>
														</div>
													</div>
												</div>
											))}

										{hobbies.filter((hobby) => hobby.userId === currentUser.id)
											.length === 0 && (
											<div
												className="col-span-full text-center p-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
												onClick={() => setShowAddHobbyModal(true)}
											>
												<div className="mb-3 text-gray-400">
													<Plus size={32} className="mx-auto" />
												</div>
												<h4 className="text-lg font-medium text-gray-600 mb-2">
													No hobbies yet
												</h4>
												<p className="text-gray-500 mb-4">
													Share your interests with others by creating a hobby.
												</p>
												<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
													Create Your First Hobby
												</button>
											</div>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-lg font-medium mb-4">
										Connected Hobbies
									</h3>
									{requests.filter(
										(req) =>
											req.senderId === currentUser.id &&
											req.status === "accepted"
									).length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{requests
												.filter(
													(req) =>
														req.senderId === currentUser.id &&
														req.status === "accepted"
												)
												.map((req) => {
													const hobby = hobbies.find(
														(h) => h.id === req.hobbyId
													);
													if (!hobby) return null;
													return (
														<div
															key={req.id}
															className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
														>
															<img
																src={hobby.image}
																alt={hobby.title}
																className="w-full h-48 object-cover"
															/>
															<div className="p-4">
																<h4 className="font-bold text-lg mb-2">
																	{hobby.title}
																</h4>
																<div className="flex flex-wrap text-sm text-gray-600 mb-3">
																	<div className="flex items-center mr-4 mb-2">
																		<MapPin
																			size={16}
																			className="mr-1 text-gray-500"
																		/>
																		{hobby.location}
																	</div>
																	<div className="flex items-center mb-2">
																		<Clock
																			size={16}
																			className="mr-1 text-gray-500"
																		/>
																		{hobby.schedule}
																	</div>
																</div>
																<div className="flex items-center mt-2">
																	<img
																		src={hobby.createdBy.avatar}
																		alt={hobby.createdBy.name}
																		className="w-6 h-6 rounded-full mr-2"
																	/>
																	<span className="text-sm">
																		Hosted by {hobby.createdBy.name}
																	</span>
																</div>
															</div>
														</div>
													);
												})}
										</div>
									) : (
										<div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
											<div className="mb-4 text-gray-400">
												<Heart size={32} className="mx-auto" />
											</div>
											<h4 className="text-lg font-medium text-gray-600 mb-2">
												You haven't connected to any hobbies yet
											</h4>
											<p className="text-gray-500 mb-4">
												Discover and join hobbies that interest you
											</p>
											<button
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
												onClick={() => setCurrentPage("home")}
											>
												Explore Hobbies
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return (
					<>
						<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
							<div className="max-w-7xl mx-auto">
								<div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
									<main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
										<div className="sm:text-center lg:text-left">
											<h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
												<span className="block xl:inline">
													Find new friends for your
												</span>{" "}
												<span className="block text-yellow-300 xl:inline">
													favorite hobbies
												</span>
											</h1>
											<p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
												Connect with people in your area who share your
												interests and passions. Discover new hobbies or find
												friends for the ones you already love.
											</p>
											<div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
												<div className="rounded-md shadow">
													<a
														href="#hobby-list"
														className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
													>
														Browse Hobbies
													</a>
												</div>
												<div className="mt-3 sm:mt-0 sm:ml-3">
													<button
														onClick={() => setShowAddHobbyModal(true)}
														className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
													>
														<Plus size={20} className="mr-2" />
														Add Your Hobby
													</button>
												</div>
											</div>
										</div>
									</main>
								</div>
							</div>
							<div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
								<img
									className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-60 rounded-xl"
									src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="People enjoying hobbies together"
								/>
							</div>
						</div>

						<div id="hobby-list" className="py-12 bg-gray-50">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex flex-col sm:flex-row justify-between items-center mb-8">
									<h2 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
										Discover Hobbies
									</h2>
									<div className="relative rounded-md shadow-sm w-full sm:w-auto">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Search className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type="text"
											className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 sm:text-sm border-gray-300 rounded-lg"
											placeholder="Search hobbies or locations"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>

								{filteredHobbies.length > 0 ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{filteredHobbies.map((hobby) => (
											<div
												key={hobby.id}
												className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
											>
												<div className="relative h-48">
													<img
														className="w-full h-full object-cover"
														src={hobby.image}
														alt={hobby.title}
													/>
													{hobby.userId === currentUser.id && (
														<div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
															Your Hobby
														</div>
													)}
												</div>
												<div className="p-6">
													<h3 className="text-xl font-semibold text-gray-900 mb-2">
														{hobby.title}
													</h3>
													<p className="text-gray-600 mb-4 line-clamp-2">
														{hobby.description}
													</p>

													<div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
														<div className="flex items-center">
															<MapPin
																size={16}
																className="mr-2 text-gray-500"
															/>
															{hobby.location}
														</div>
														<div className="flex items-center">
															<Calendar
																size={16}
																className="mr-2 text-gray-500"
															/>
															{hobby.schedule}
														</div>
														<div className="flex items-center pt-1">
															<img
																className="h-6 w-6 rounded-full mr-2"
																src={hobby.createdBy.avatar}
																alt={hobby.createdBy.name}
															/>
															<span>Hosted by {hobby.createdBy.name}</span>
														</div>
													</div>

													{hobby.userId !== currentUser.id && (
														<button
															className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
															onClick={() => sendConnectionRequest(hobby)}
														>
															<Heart size={18} className="mr-2" />
															Connect
														</button>
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-16 bg-white rounded-xl shadow-sm">
										<Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
										<p className="text-gray-500 text-lg mb-4">
											No hobbies found matching your search.
										</p>
										<button
											className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
											onClick={() => setSearchTerm("")}
										>
											Clear Search
										</button>
									</div>
								)}
							</div>
						</div>

						<div className="py-16 bg-white">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="text-center">
									<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
										How HobbyConnect Works
									</h2>
									<p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
										Connect with others and enjoy your favorite activities
										together in just three simple steps.
									</p>
								</div>

								<div className="mt-16">
									<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
										<div className="text-center p-6 rounded-xl hover:bg-blue-50 transition-colors">
											<div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
												<Search className="h-8 w-8" />
											</div>
											<h3 className="text-xl font-medium text-gray-900 mb-2">
												Discover
											</h3>
											<p className="text-base text-gray-500">
												Browse through hobbies in your area or add your own to
												share with others.
											</p>
										</div>

										<div className="text-center p-6 rounded-xl hover:bg-blue-50 transition-colors">
											<div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
												<Heart className="h-8 w-8" />
											</div>
											<h3 className="text-xl font-medium text-gray-900 mb-2">
												Connect
											</h3>
											<p className="text-base text-gray-500">
												Send connection requests for hobbies you're interested
												in joining.
											</p>
										</div>

										<div className="text-center p-6 rounded-xl hover:bg-blue-50 transition-colors">
											<div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
												<MessageCircle className="h-8 w-8" />
											</div>
											<h3 className="text-xl font-medium text-gray-900 mb-2">
												Communicate
											</h3>
											<p className="text-base text-gray-500">
												Once connected, message directly to coordinate meetups
												and activities.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow-md sticky top-0 z-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<div
								className="flex-shrink-0 flex items-center cursor-pointer"
								onClick={() => setCurrentPage("home")}
							>
								<svg
									className="h-8 w-8 text-blue-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
									<path d="M8 16l5.5-3L8 10v6zm6.5-3L20 10v6l-5.5-3z" />
								</svg>
								<span className="ml-2 text-xl font-bold text-gray-900">
									HobbyConnect
								</span>
							</div>
							<nav className="hidden md:ml-6 md:flex md:space-x-8">
								<button
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors ${
										currentPage === "home"
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}
									onClick={() => setCurrentPage("home")}
								>
									Home
								</button>
								<button
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors ${
										currentPage === "messages"
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}
									onClick={() => setCurrentPage("messages")}
								>
									Messages
									{getUnreadMessageCount() > 0 && (
										<span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
											{getUnreadMessageCount()}
										</span>
									)}
								</button>
							</nav>
						</div>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<button
									className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
									onClick={() => setShowNotifications(!showNotifications)}
								>
									<Bell className="h-6 w-6" />
									{getPendingRequestCount() > 0 && (
										<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
									)}
								</button>

								{showNotifications && (
									<div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 border border-gray-100">
										<div
											className="py-1"
											role="menu"
											aria-orientation="vertical"
										>
											<div className="px-4 py-3 border-b border-gray-200">
												<h3 className="text-sm font-medium text-gray-900">
													Notifications
												</h3>
											</div>

											{requests.filter(
												(req) =>
													req.receiverId === currentUser.id &&
													req.status === "pending"
											).length > 0 ? (
												<div className="max-h-96 overflow-y-auto">
													{requests
														.filter(
															(req) =>
																req.receiverId === currentUser.id &&
																req.status === "pending"
														)
														.map((request) => {
															const sender = mockUsers.find(
																(u) => u.id === request.senderId
															);
															const hobby = hobbies.find(
																(h) => h.id === request.hobbyId
															);
															if (!sender || !hobby) return null;

															return (
																<div
																	key={request.id}
																	className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
																>
																	<div className="flex items-start">
																		<img
																			src={sender.avatar}
																			alt={sender.name}
																			className="h-10 w-10 rounded-full mr-3"
																		/>
																		<div className="flex-1 min-w-0">
																			<p className="text-sm font-medium text-gray-900">
																				{sender.name} wants to join your{" "}
																				<span className="font-semibold text-blue-600">
																					{hobby.title}
																				</span>{" "}
																				hobby
																			</p>
																			<p className="text-sm text-gray-500 truncate mb-2">
																				{hobby.schedule} at {hobby.location}
																			</p>
																			<div className="mt-2 flex space-x-2">
																				<button
																					className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
																					onClick={() =>
																						handleRequestResponse(
																							request.id,
																							"accepted"
																						)
																					}
																				>
																					<Check className="h-4 w-4 mr-1" />
																					Accept
																				</button>
																				<button
																					className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
																					onClick={() =>
																						handleRequestResponse(
																							request.id,
																							"rejected"
																						)
																					}
																				>
																					<X className="h-4 w-4 mr-1" />
																					Decline
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})}
												</div>
											) : (
												<div className="px-4 py-12 text-center text-gray-500">
													<Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
													<p>No new notifications</p>
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							<div className="flex items-center">
								<button
									className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
									onClick={() => setCurrentPage("profile")}
								>
									<span className="sr-only">Open user menu</span>
									<img
										className="h-8 w-8 rounded-full object-cover"
										src={currentUser.avatar}
										alt={currentUser.name}
									/>
									<span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
										{currentUser.name}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
				<div className="flex justify-around text-sm">
					<button
						className={`flex flex-col items-center py-3 px-4 ${
							currentPage === "home" ? "text-blue-600" : "text-gray-500"
						}`}
						onClick={() => setCurrentPage("home")}
					>
						<svg
							className="h-6 w-6 mb-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						<span>Home</span>
					</button>
					<button
						className={`flex flex-col items-center py-3 px-4 ${
							currentPage === "messages" ? "text-blue-600" : "text-gray-500"
						}`}
						onClick={() => setCurrentPage("messages")}
					>
						<div className="relative">
							<MessageCircle className="h-6 w-6 mb-1" />
							{getUnreadMessageCount() > 0 && (
								<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
									{getUnreadMessageCount()}
								</span>
							)}
						</div>
						<span>Messages</span>
					</button>
					<button
						className={`flex flex-col items-center py-3 px-4 ${
							currentPage === "profile" ? "text-blue-600" : "text-gray-500"
						}`}
						onClick={() => setCurrentPage("profile")}
					>
						<User className="h-6 w-6 mb-1" />
						<span>Profile</span>
					</button>
				</div>
			</div>

			<main className="flex-1 pb-16 md:pb-0">{renderPage()}</main>

			<footer className="bg-white border-t border-gray-200">
				<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center">
								<svg
									className="h-8 w-8 text-blue-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
									<path d="M8 16l5.5-3L8 10v6zm6.5-3L20 10v6l-5.5-3z" />
								</svg>
								<span className="ml-2 text-xl font-bold text-gray-900">
									HobbyConnect
								</span>
							</div>
							<p className="mt-4 text-gray-600">
								Making it easy to find friends for your favorite activities and
								discover new hobbies in your area.
							</p>
							<div className="mt-6 flex space-x-6">
								<a
									href="#"
									className="text-gray-400 hover:text-gray-500 cursor-pointer"
								>
									<span className="sr-only">Facebook</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-gray-500 cursor-pointer"
								>
									<span className="sr-only">Instagram</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-gray-500 cursor-pointer"
								>
									<span className="sr-only">Twitter</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
								Platform
							</h3>
							<ul className="mt-4 space-y-4">
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										How it works
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										FAQ
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
								Company
							</h3>
							<ul className="mt-4 space-y-4">
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Contact
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-base text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
									>
										Careers
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
						<div className="mt-8 md:mt-0 md:order-1">
							<p className="text-base text-gray-400">
								&copy; 2025 HobbyConnect, Inc. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>

			<AddHobbyModal
				isOpen={showAddHobbyModal}
				onClose={() => setShowAddHobbyModal(false)}
				onAdd={addHobby}
				currentUser={currentUser}
			/>

			{toast.show && (
				<Toast message={toast.message} type={toast.type} onClose={hideToast} />
			)}
		</div>
	);
};

export default Hobby;
