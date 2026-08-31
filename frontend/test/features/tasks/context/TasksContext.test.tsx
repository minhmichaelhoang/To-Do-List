import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TasksProvider, useTasks } from "../../../../src/features/tasks/context/TasksContext";
import { ProjectsProvider } from "../../../../src/features/projects/context/ProjectsContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

function Probe() {
	const { tasks, createTaskOptimistically } = useTasks();
	return (
		<div>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>{task.title} · {task.project.name}</li>
				))}
			</ul>
			<button
				onClick={() =>
					createTaskOptimistically({ title: "Neuer Task", description: "Beschreibung", project: "Schule" })
				}
			>
				create
			</button>
		</div>
	);
}

function renderProbe() {
	return render(
		<ProjectsProvider>
			<TasksProvider>
				<Probe />
			</TasksProvider>
		</ProjectsProvider>,
	);
}

describe("TasksContext.createTaskOptimistically", () => {
	it("zeigt den Task sofort an, bevor der POST-Request beantwortet ist", async () => {
		const fetchMock = vi.fn((_url: string, options?: RequestInit) => {
			if (options?.method === "POST") {
				return new Promise(() => {}); // bleibt absichtlich hängen
			}
			return Promise.resolve({ ok: true, status: 200, json: async () => [] });
		});
		vi.stubGlobal("fetch", fetchMock);

		renderProbe();

		await userEvent.click(screen.getByText("create"));

		expect(screen.getByText("Neuer Task · Schule")).toBeInTheDocument();
	});

	it("gleicht nach erfolgreichem POST mit den echten Server-Daten ab", async () => {
		const realTask = {
			id: "real-id",
			title: "Neuer Task",
			description: "Beschreibung",
			project: { id: "project-1", name: "Schule", color: "#123456" },
		};
		let taskGetCallCount = 0;
		const fetchMock = vi.fn((url: string, options?: RequestInit) => {
			if (options?.method === "POST") {
				return Promise.resolve({ ok: true, status: 201, json: async () => [] });
			}
			if (url.endsWith("/tasks")) {
				taskGetCallCount += 1;
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => (taskGetCallCount === 1 ? [] : [realTask]),
				});
			}
			return Promise.resolve({ ok: true, status: 200, json: async () => [] });
		});
		vi.stubGlobal("fetch", fetchMock);

		renderProbe();

		await userEvent.click(screen.getByText("create"));

		// Der POST-Mock löst hier (anders als im Test oben) schnell auf, daher ist der rein
		// optimistische Zwischenzustand nicht zuverlässig direkt nach dem Klick prüfbar –
		// relevant ist nur, dass am Ende genau einmal (nicht doppelt) der echte Task steht.
		await waitFor(() => expect(screen.getAllByText("Neuer Task · Schule")).toHaveLength(1));
	});

	it("entfernt den Platzhalter wieder und meldet einen Fehler, wenn der POST fehlschlägt", async () => {
		const alertMock = vi.fn();
		vi.stubGlobal("alert", alertMock);
		const fetchMock = vi.fn((_url: string, options?: RequestInit) => {
			if (options?.method === "POST") {
				return Promise.resolve({
					ok: false,
					status: 400,
					json: async () => ({ message: "Datum in der Vergangenheit" }),
				});
			}
			return Promise.resolve({ ok: true, status: 200, json: async () => [] });
		});
		vi.stubGlobal("fetch", fetchMock);

		renderProbe();

		await userEvent.click(screen.getByText("create"));

		await waitFor(() => expect(screen.queryByText("Neuer Task · Schule")).not.toBeInTheDocument());
		expect(alertMock).toHaveBeenCalledWith("Datum in der Vergangenheit");
	});

	it("nutzt \"Inbox\" als Platzhalter-Projekt, wenn kein Projektname eingegeben wurde", async () => {
		// POST hängt absichtlich, damit der optimistische Platzhalter nicht sofort durch den
		// Abgleich nach Erfolg überschrieben wird, bevor wir seinen Projektnamen prüfen können.
		const fetchMock = vi.fn((_url: string, options?: RequestInit) => {
			if (options?.method === "POST") {
				return new Promise(() => {});
			}
			return Promise.resolve({ ok: true, status: 200, json: async () => [] });
		});
		vi.stubGlobal("fetch", fetchMock);

		function EmptyProjectProbe() {
			const { tasks, createTaskOptimistically } = useTasks();
			return (
				<div>
					<ul>
						{tasks.map((task) => (
							<li key={task.id}>{task.title} · {task.project.name}</li>
						))}
					</ul>
					<button onClick={() => createTaskOptimistically({ title: "Ohne Projekt", description: "x" })}>
						create
					</button>
				</div>
			);
		}

		render(
			<ProjectsProvider>
				<TasksProvider>
					<EmptyProjectProbe />
				</TasksProvider>
			</ProjectsProvider>,
		);

		await userEvent.click(screen.getByText("create"));

		expect(screen.getByText("Ohne Projekt · Inbox")).toBeInTheDocument();
	});
});
