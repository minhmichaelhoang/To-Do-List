import { Router } from "express";
import { ProjectDto } from "shared";
import { ListProjects } from "../Application/ListProjects";

/**
 * Driving Adapter (Primary Adapter) für HTTP – analog zu `TaskRouter`.
 * Aktuell nur lesend: Projekte werden implizit über `AddTask`/`EditTask`
 * (`FindOrCreateProject`) angelegt, nicht über einen eigenen POST-Endpoint.
 */
export function createProjectRouter(listProjects: ListProjects): Router {
	const router = Router();

	router.get("/projects", async (_req, res) => {
		const projects = await listProjects.execute();
		res.json(
			projects.map((project): ProjectDto => ({
				id: project.id,
				name: project.name,
				color: project.color,
			})),
		);
	});

	return router;
}
