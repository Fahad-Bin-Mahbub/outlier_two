"use client";

import { useState } from "react";

type Card = {
	id: string;
	title: string;
	description: string;
};

type Column = {
	id: string;
	title: string;
	cards: Card[];
};

export default function TrelloExport() {
	const [columns, setColumns] = useState<Column[]>([
		{ id: "todo", title: "To Do", cards: [] },
		{ id: "inprogress", title: "In Progress", cards: [] },
		{ id: "done", title: "Done", cards: [] },
	]);

	const [draggingCard, setDraggingCard] = useState<Card | null>(null);
	const [dark, setDark] = useState(false);
	const [show, setShow] = useState(true);
	const [search, setSearch] = useState("");
	const [newTitle, setNewTitle] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [modalOpen, setModalOpen] = useState<string | null>(null);

	const handleDragStart = (card: Card) => {
		setDraggingCard(card);
	};

	const handleDrop = (colId: string) => {
		if (!draggingCard) return;
		setColumns((cols) =>
			cols
				.map((col) => {
					if (col.cards.find((c) => c.id === draggingCard.id)) {
						return {
							...col,
							cards: col.cards.filter((c) => c.id !== draggingCard.id),
						};
					}
					return col;
				})
				.map((col) => {
					if (col.id === colId) {
						return { ...col, cards: [...col.cards, draggingCard] };
					}
					return col;
				})
		);
		setDraggingCard(null);
	};

	const addCard = (columnId: string) => {
		if (!newTitle || !newDescription) return;
		const newCard: Card = {
			id: Date.now().toString(),
			title: newTitle,
			description: newDescription,
		};
		setColumns((cols) =>
			cols.map((col) =>
				col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
			)
		);
		setNewTitle("");
		setNewDescription("");
		setModalOpen(null);
	};

	const deleteCard = (cardId: string) => {
		setColumns((cols) =>
			cols.map((col) => ({
				...col,
				cards: col.cards.filter((c) => c.id !== cardId),
			}))
		);
	};

	const addColumn = () => {
		const name = prompt("Enter column title:");
		if (!name) return;
		setColumns([
			...columns,
			{ id: Date.now().toString(), title: name, cards: [] },
		]);
	};

	const clearAllCards = () => {
		setColumns(columns.map((col) => ({ ...col, cards: [] })));
	};

	return (
		<main
			className={`${
				dark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
			} min-h-screen p-8`}
		>
			<div className="flex justify-between items-center mb-6 flex-wrap gap-2">
				<h1 className="text-3xl font-bold">Trello Clone</h1>
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="text"
						placeholder="Search cards..."
						className="px-3 py-1 rounded border text-sm"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button
						onClick={() => setShow(!show)}
						className="bg-slate-500 text-white px-3 py-1 rounded text-sm hover:bg-slate-600"
					>
						{show ? "Hide Columns" : "Show Columns"}
					</button>
					<button
						onClick={() => setDark(!dark)}
						className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
					>
						Toggle Dark Mode
					</button>
					<button
						onClick={addColumn}
						className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
					>
						+ Add Column
					</button>
					<button
						onClick={clearAllCards}
						className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
					>
						Clear All Cards
					</button>
				</div>
			</div>

			{show && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{columns.map((column) => (
						<div
							key={column.id}
							onDragOver={(e) => e.preventDefault()}
							onDrop={() => handleDrop(column.id)}
							className="bg-white rounded-xl shadow p-4 flex flex-col min-h-[300px] dark:bg-slate-800 transition-transform hover:scale-105"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold">{column.title}</h2>
								<button
									onClick={() => setModalOpen(column.id)}
									className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
								>
									+ Add
								</button>
							</div>
							<div className="flex flex-col gap-3">
								{column.cards
									.filter((c) =>
										c.title.toLowerCase().includes(search.toLowerCase())
									)
									.map((card) => (
										<div
											key={card.id}
											draggable
											onDragStart={() => handleDragStart(card)}
											className="bg-slate-100 border border-slate-300 p-4 rounded-lg shadow-sm hover:bg-slate-200 dark:bg-slate-700 dark:text-white flex justify-between items-start transition-transform hover:scale-105"
										>
											<div>
												<h3 className="font-bold">{card.title}</h3>
												<p className="text-sm text-gray-600 dark:text-gray-300">
													{card.description}
												</p>
											</div>
											<button
												onClick={() => deleteCard(card.id)}
												className="text-red-400 hover:text-red-600 text-lg"
											>
												✕
											</button>
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			)}

			{modalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl w-80 space-y-4">
						<h2 className="text-xl font-bold">Add Card</h2>
						<input
							type="text"
							placeholder="Title"
							className="w-full px-3 py-2 border rounded"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
						/>
						<textarea
							placeholder="Description"
							className="w-full px-3 py-2 border rounded"
							value={newDescription}
							onChange={(e) => setNewDescription(e.target.value)}
						></textarea>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setModalOpen(null)}
								className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
							>
								Cancel
							</button>
							<button
								onClick={() => addCard(modalOpen)}
								className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
